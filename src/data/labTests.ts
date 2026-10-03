export interface LabPackage {
  id: string;
  title: string;
  subtitle: string;
  testsCount: number;
  parameters: string[];
  price: number;
  originalPrice: number;
  rating: number;
  bookingsCount: number;
  sampleType: string;
  fastingRequired: string;
  reportTime: string;
  tag?: string;
  recommendedFor: string;
}

export const LAB_PACKAGES: LabPackage[] = [
  {
    id: "pkg-ayur-full-body",
    title: "Ayur-Prakriti Full Body Comprehensive Health Screening",
    subtitle: "Complete body vitality & dosha organ screening with CBC, Liver, Kidney, Thyroid & Lipid Profile",
    testsCount: 64,
    parameters: [
      "Complete Hemogram & CBC (24 parameters)",
      "Liver Function Profile (Bilirubin, SGOT, SGPT, ALP, Proteins)",
      "Kidney Renal Function (Urea, Creatinine, Uric Acid, BUN)",
      "Lipid Cholesterol Profile (Total, HDL, LDL, VLDL, Triglycerides)",
      "Thyroid Profile (Total T3, Total T4, TSH Ultra-sensitive)",
      "HbA1c Glycated Hemoglobin & Average Blood Glucose",
      "Ayurvedic Dosha Metabolic Risk Assessment"
    ],
    price: 999,
    originalPrice: 2499,
    rating: 4.9,
    bookingsCount: 38240,
    sampleType: "Blood & Urine Sample",
    fastingRequired: "10-12 hours fasting required",
    reportTime: "Digital Report in 24 Hours",
    tag: "Most Popular Checkup",
    recommendedFor: "Men & Women aged 20-75 for annual preventive health & dosha balance"
  },
  {
    id: "pkg-gut-metabolism",
    title: "Ayurvedic Gut Detox & Digestive Metabolism Screen",
    subtitle: "In-depth gastrointestinal biomarker analysis to identify Ama (toxin) buildup & enzyme function",
    testsCount: 28,
    parameters: [
      "Serum Amylase & Lipase Digestive Enzymes",
      "Stool Routine & Occult Blood Examination",
      "High-sensitivity C-Reactive Protein (hs-CRP) Gut Inflammation",
      "Helicobacter pylori (H. pylori) IgG Screen",
      "Liver Transaminases & Detox Capacity Screen"
    ],
    price: 649,
    originalPrice: 1399,
    rating: 4.8,
    bookingsCount: 14120,
    sampleType: "Blood & Stool Sample",
    fastingRequired: "8-10 hours fasting required",
    reportTime: "Digital Report in 24 Hours",
    tag: "Gut Health Essential",
    recommendedFor: "Individuals suffering from acidity, bloating, irregular bowels, or IBS"
  },
  {
    id: "pkg-vitality-hormones",
    title: "Vitality, Stress & Cortisol Hormonal Dosha Panel",
    subtitle: "Evaluates chronic stress exhaustion, adrenal fatigue, Vitamin D & B12, and vital vitality hormones",
    testsCount: 20,
    parameters: [
      "Morning Serum Cortisol Stress Hormone",
      "Vitamin D3 (25-Hydroxycholecalciferol) Bone & Immunity",
      "Vitamin B12 Cyanocobalamin Neurological Level",
      "Total Testosterone / Serum Estrogen Hormone",
      "Electrolytes Panel (Sodium, Potassium, Chloride)"
    ],
    price: 849,
    originalPrice: 1899,
    rating: 4.9,
    bookingsCount: 22400,
    sampleType: "Blood Sample (Home Collection)",
    fastingRequired: "Fasting not required",
    reportTime: "Digital Report in 24 Hours",
    tag: "High Energy & Sleep",
    recommendedFor: "Working professionals experiencing chronic fatigue, brain fog, or burnout"
  },
  {
    id: "pkg-diabetes-ayur",
    title: "Ayurvedic Diabetes & Metabolic Screening Panel",
    subtitle: "Comprehensive Prameha risk evaluation for pre-diabetes and metabolic syndrome control",
    testsCount: 16,
    parameters: [
      "HbA1c Glycosylated Hemoglobin",
      "Fasting Blood Sugar & Post-Prandial Glucose",
      "Urine Microalbumin to Creatinine Ratio (Early Kidney Screen)",
      "High Density & Low Density Lipoproteins",
      "Serum Insulin Fasting Level"
    ],
    price: 499,
    originalPrice: 1199,
    rating: 4.7,
    bookingsCount: 19850,
    sampleType: "Blood & Urine Sample",
    fastingRequired: "10-12 hours overnight fasting",
    reportTime: "Digital Report in 18 Hours",
    tag: "Sugar Care Special",
    recommendedFor: "Pre-diabetic, diabetic individuals or family history of high blood sugar"
  }
];
