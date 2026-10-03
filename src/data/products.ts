export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  packSize: string;
  description: string;
  benefits: string[];
  dosage: string;
  deliveryTime: string;
  badge?: string;
  inStock: boolean;
  link?: string;
  handmade?: boolean;
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Ashwagandha KSM-66 Premium Root Extract",
    brand: "Veda Herbals",
    price: 349,
    originalPrice: 550,
    image: "/images/product-ashwagandha.jpg",
    rating: 4.8,
    reviews: 14280,
    category: "Stress & Sleep",
    packSize: "bottle of 60 veg capsules (500mg)",
    description: "Handcrafted pure full-spectrum KSM-66 Ashwagandha root extract. Clinically proven to reduce cortisol, boost stamina, enhance deep REM sleep, and support hormonal balance.",
    benefits: ["Lowers stress & cortisol levels", "Enhances stamina & muscle recovery", "Promotes restorative deep sleep", "Boosts cognitive focus"],
    dosage: "1 capsule twice daily with warm milk or water after meals",
    deliveryTime: "Delivery by Tomorrow, 2 PM",
    badge: "Bestseller",
    inStock: true,
    handmade: true
  },
  {
    id: 2,
    name: "Traditional Ayurvedic Chyawanprash with Fresh Amla",
    brand: "Nexus Ayurve Originals",
    price: 389,
    originalPrice: 599,
    image: "/images/product-chyawanprash.jpg",
    rating: 4.9,
    reviews: 28400,
    category: "Immunity & Vitality",
    packSize: "jar of 500g handcrafted paste",
    description: "Slow-cooked according to classical Charaka Samhita recipes using wild forest Amla, organic desi cow ghee, Kashmiri saffron, and 42 therapeutic Himalayan herbs.",
    benefits: ["3x clinically enhanced immune defense", "Rich natural source of Vitamin C", "Strengthens respiratory system & lungs", "Rejuvenates vitality across all ages"],
    dosage: "1–2 teaspoons twice daily with warm milk or lukewarm water",
    deliveryTime: "Delivery by Tomorrow, 11 AM",
    badge: "Handcrafted Pure",
    inStock: true,
    handmade: true
  },
  {
    id: 3,
    name: "Pure Himalayan Shilajit Gold Resin (Grade A+)",
    brand: "Himalayan Wellness Co.",
    price: 899,
    originalPrice: 1499,
    image: "/images/product-shilajit.jpg",
    rating: 4.9,
    reviews: 11950,
    category: "Vitality & Strength",
    packSize: "glass jar of 30g pure resin + brass spoon",
    description: "Ethically harvested from 18,000+ ft Himalayan altitude. Purified with classical Agni-tapi method. Rich in 84+ ionic trace minerals and 75% fulvic acid for peak strength and longevity.",
    benefits: ["Maximizes physical stamina & power", "Enhances mitochondrial cellular ATP", "Natural adaptogen for male & female vitality", "Accelerates post-workout recovery"],
    dosage: "Pea-sized portion (300-500mg) dissolved in warm milk or green tea daily",
    deliveryTime: "Delivery in 24 hours",
    badge: "100% Pure Himalayan",
    inStock: true,
    handmade: true
  },
  {
    id: 4,
    name: "Kumkumadi Tailam — Kashmiri Saffron Radiance Elixir",
    brand: "Vedic Essence",
    price: 649,
    originalPrice: 1100,
    image: "/images/product-kumkumadi.jpg",
    rating: 4.9,
    reviews: 8640,
    category: "Skin & Hair",
    packSize: "glass dropper bottle of 30ml",
    description: "Classical Ayurvedic golden facial oil prepared with Grade-1 Kashmiri Mogra Saffron, Red Sandalwood, Manjistha, and goat's milk. Revitalizes dull skin, reduces pigmentation, and imparts a natural glow.",
    benefits: ["Fades dark spots & hyperpigmentation", "Natural anti-aging & collagen booster", "Deeply hydrates without clogging pores", "Imparts luminous dewy complexion"],
    dosage: "Apply 3–4 drops onto cleansed face every night before sleep",
    deliveryTime: "Delivery by Tomorrow, 4 PM",
    badge: "Ayurvedic Luxury",
    inStock: true,
    handmade: true
  },
  {
    id: 5,
    name: "Organic Triphala Churna & Bio-Extract",
    brand: "Dabur Ayurvedic",
    price: 195,
    originalPrice: 290,
    image: "/images/product-triphala.jpg",
    rating: 4.7,
    reviews: 16820,
    category: "Digestion & Gut",
    packSize: "pack of 200g stone-ground powder",
    description: "Equi-ratio formulation of wild Haritaki, Bibhitaki, and Amalaki. Cleanses toxins (Ama) from the digestive tract, supports healthy bowel movements, and nourishes the gut microbiome.",
    benefits: ["Relieves chronic constipation & bloating", "Colon cleanse & toxin elimination", "Enhances nutrient absorption", "Gentle non-habit-forming digestive aid"],
    dosage: "1 teaspoon (3-5g) stirred in a glass of warm water before bedtime",
    deliveryTime: "Delivery by Tomorrow, 10 AM",
    badge: "Doctor Recommended",
    inStock: true,
    handmade: true
  },
  {
    id: 6,
    name: "Turmeric Curcumin 95% with Black Pepper Extract",
    brand: "Himalaya Wellness",
    price: 320,
    originalPrice: 480,
    image: "/images/product-turmeric.jpg",
    rating: 4.8,
    reviews: 9540,
    category: "Joint & Pain",
    packSize: "bottle of 60 capsules (600mg)",
    description: "High-potency wild golden Curcuminoid complex standardized to 95% Curcumin, combined with Piperine for 2000% higher bioavailability. Relieves joint stiffness and systemic inflammation.",
    benefits: ["Soothes knee, back & joint pain", "Potent natural antioxidant defense", "Supports heart & cardiovascular health", "Promotes healthy inflammatory response"],
    dosage: "1 capsule twice daily with meals",
    deliveryTime: "Delivery by Tomorrow, 3 PM",
    badge: "Fast Acting",
    inStock: true,
    handmade: true
  },
  {
    id: 7,
    name: "Brahmi Memory & Cognitive Focus Capsules",
    brand: "Himalaya",
    price: 245,
    originalPrice: 380,
    image: "/brahmi.png",
    rating: 4.7,
    reviews: 7320,
    category: "Brain & Sleep",
    packSize: "bottle of 60 veg capsules",
    description: "Pure Bacopa Monnieri plant extract known in Ayurveda as Medhya Rasayana. Enhances recall ability, concentration, mental alertness, and calms an overactive nervous system.",
    benefits: ["Improves memory recall & retention", "Sharpens attention span & focus", "Reduces mental fatigue during work/study", "Soothes neuro-tension and anxiety"],
    dosage: "1 capsule twice daily after meals",
    deliveryTime: "Delivery in 24 hours",
    badge: "Top Rated",
    inStock: true,
    handmade: true
  },
  {
    id: 8,
    name: "Panch Tulsi Holy Basil Concentrated Drops",
    brand: "Organic India",
    price: 215,
    originalPrice: 340,
    image: "/tulsi.png",
    rating: 4.8,
    reviews: 13900,
    category: "Immunity & Vitality",
    packSize: "dropper bottle of 30ml",
    description: "Synergistic liquid concentrate extracted from 5 sacred varieties of Tulsi: Rama, Shyama, Vana, Shukla, and Surasa Tulsi. Provides instant throat soothe and respiratory defense.",
    benefits: ["Rapid relief from seasonal cold & cough", "Protects respiratory tract & airways", "Natural adaptogen & bio-protectant", "Purifies water & drinks with herbal zest"],
    dosage: "4–5 drops in a cup of lukewarm water, green tea, or herbal kadha twice daily",
    deliveryTime: "Delivery by Tomorrow, 11 AM",
    badge: "100% Organic",
    inStock: true,
    handmade: true
  },
  {
    id: 9,
    name: "Neem Purifying Blood & Skin Detox Capsules",
    brand: "Organic India",
    price: 240,
    originalPrice: 360,
    image: "/med-neem.png",
    rating: 4.6,
    reviews: 6180,
    category: "Skin & Hair",
    packSize: "bottle of 60 veg capsules",
    description: "Certified organic Azadirachta Indica (Neem) leaf and soft twig extract. Revered as Sarva Roga Nivarini for purifying blood, clearing stubborn acne, and promoting healthy glowing skin.",
    benefits: ["Purifies blood and clears skin blemishes", "Prevents recurring acne and redness", "Supports healthy liver and metabolic function", "Natural antibacterial and antimicrobial"],
    dosage: "1 capsule twice daily after meals",
    deliveryTime: "Delivery by Tomorrow, 5 PM",
    badge: "Pure Organic",
    inStock: true,
    handmade: true
  }
];

export const CATEGORIES_WITH_IMAGES = [
  { name: "Immunity & Vitality", image: "/images/product-chyawanprash.jpg", desc: "Chyawanprash, Tulsi, Giloy", count: "48+ Products", query: "Immunity" },
  { name: "Stress & Sleep", image: "/images/product-ashwagandha.jpg", desc: "Ashwagandha, Brahmi, Jatamansi", count: "36+ Products", query: "Stress" },
  { name: "Digestion & Gut", image: "/images/product-triphala.jpg", desc: "Triphala, Hingwashtak, Isabgol", count: "52+ Products", query: "Digestion" },
  { name: "Joint & Pain Relief", image: "/images/product-turmeric.jpg", desc: "Turmeric, Shallaki, Guggulu", count: "30+ Products", query: "Joint" },
  { name: "Skin & Hair Radiance", image: "/images/product-kumkumadi.jpg", desc: "Kumkumadi, Neem, Bhringraj", count: "42+ Products", query: "Skin" },
  { name: "Pure Shilajit & Strength", image: "/images/product-shilajit.jpg", desc: "Himalayan Gold Resin & Herbs", count: "24+ Products", query: "Vitality" },
];
