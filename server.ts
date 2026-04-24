import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import authRoutes from "./src/routes/authRoutes";
import userRoutes from "./src/routes/userRoutes";
import appointmentRoutes from "./src/routes/appointmentRoutes";
import heartRateRoutes from "./src/routes/heartRateRoutes";
import aiRoutes from "./src/routes/aiRoutes";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "Nexus Ayurve Backend is running",
    nvidiaKeySet: !!process.env.NVIDIA_API_KEY
  });
});
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/heart-rate", heartRateRoutes);
app.use("/api/analyze-symptoms", aiRoutes);

// Chat route for local development
app.post("/api/chat", async (req, res) => {
  try {
    const handlerModule = await import("./api/chat.ts") as any;
    await handlerModule.default(req, res);
  } catch (err) {
    console.error("Local chat handler failed:", err);
    res.status(500).json({ error: "Failed to run chat function locally" });
  }
});


// Food Analyze route for local development
app.post("/api/food-analyze", async (req, res) => {
  try {
    const handlerModule = await import("./api/food-analyze.ts") as any;
    await handlerModule.default(req, res);
  } catch (err) {
    console.error("Local dev handler failed:", err);
    res.status(500).json({ error: "Failed to run serverless function locally" });
  }
});

// Health Coach route for local development
app.post("/api/health-coach", async (req, res) => {
  try {
    const handlerModule = await import("./api/health-coach.ts") as any;
    await handlerModule.default(req, res);
  } catch (err) {
    console.error("Health coach handler failed:", err);
    res.status(500).json({ error: "Failed to run health coach locally" });
  }
});

// Export the app for Vercel serverless functions
export default app;

async function startServer() {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Vite middleware for development
    if (process.env.NODE_ENV !== "production") {
      console.log("Starting Vite in development mode...");
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);

      // Serve index.html for all other routes in dev mode
      app.get("*", async (req, res, next) => {
        const url = req.originalUrl;
        try {
          let template = fs.readFileSync(path.resolve(__dirname, "index.html"), "utf-8");
          template = await vite.transformIndexHtml(url, template);
          res.status(200).set({ "Content-Type": "text/html" }).end(template);
        } catch (e) {
          vite.ssrFixStacktrace(e as Error);
          next(e);
        }
      });
    } else {
      console.log("Starting in production mode...");
      const distPath = path.join(process.cwd(), "dist");
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

// Only start the server if not running on Vercel
if (!process.env.VERCEL) {
  startServer();
}
