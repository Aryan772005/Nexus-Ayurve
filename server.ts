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
    message: "Ayurcare+ Backend is running",
    nvidiaKeySet: !!process.env.NVIDIA_API_KEY
  });
});
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/heart-rate", heartRateRoutes);
app.use("/api/analyze-symptoms", aiRoutes);

// Chat route for local development (mirrors api/chat.ts on Vercel)
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Missing message" });

  let apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "NVIDIA_API_KEY not set" });
  if (apiKey.startsWith('Bearer ')) apiKey = apiKey.substring(7);

  try {
    const { default: axios } = await import("axios");
    const response = await axios.post("https://integrate.api.nvidia.com/v1/chat/completions", {
      model: "meta/llama-3.1-8b-instruct",
      messages: [
        { role: "system", content: "You are a knowledgeable and compassionate Ayurvedic health assistant. Provide helpful advice based on Ayurvedic principles." },
        { role: "user", content: message }
      ],
      temperature: 0.4,
      top_p: 0.8,
      max_tokens: 1024,
    }, {
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" }
    });
    const aiText = response.data.choices?.[0]?.message?.content || "No response";
    res.json({ reply: aiText });
  } catch (error: any) {
    console.error("Chat error:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data?.detail || error.message });
  }
});

// Food Analyze route for local development
app.post("/api/food-analyze", async (req, res) => {
  try {
    const handlerModule = await import("./api/food-analyze.ts");
    await handlerModule.default(req, res);
  } catch (err) {
    console.error("Local dev handler failed:", err);
    res.status(500).json({ error: "Failed to run serverless function locally" });
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
