export interface DoshaEffect {
  vata: 'increases' | 'decreases' | 'neutral';
  pitta: 'increases' | 'decreases' | 'neutral';
  kapha: 'increases' | 'decreases' | 'neutral';
}

export interface FoodItem {
  name: string;
  aliases: string[];
  category: string;
  dosha_effect: DoshaEffect;
  nature: string;
  health_rating: 'Healthy' | 'Moderate' | 'Indulgent';
  healthier_alternative: string;
  reason: string;
}

export interface RedFlagAdditive {
  ingredient: string;
  identifiers: string[];
  risk: 'High' | 'Moderate';
  ayurvedic_impact: string;
  better_swap: string;
}

export interface PackagedSnackData {
  product_name: string;
  brand: string;
  ingredients_text: string;
  flagged_ingredients: Array<{
    ingredient: string;
    risk: 'High' | 'Moderate';
    ayurvedic_impact: string;
    better_swap: string;
  }>;
  ayurvedic_verdict: string;
  dosha_impact: DoshaEffect;
  primary_concern: string;
  healthier_snack_alternatives: string[];
  student_tip: string;
}

export const FOODS_DB: FoodItem[] = [
  {
    name: "Samosa",
    aliases: ["aloo samosa", "singara", "punjabi samosa"],
    category: "Snacks & Street Food",
    dosha_effect: { vata: "decreases", pitta: "increases", kapha: "increases" },
    nature: "Heavy (Guru), Oily (Snigdha), Heating (Ushna)",
    health_rating: "Indulgent",
    healthier_alternative: "Air-fried or baked sweet potato & pea samosa with mint-coriander chutney instead of sweet tamarind sugar syrup.",
    reason: "Deep frying in refined oil and refined flour (maida) severely aggravates Pitta (acidity) and Kapha (sluggish digestion), while creating Ama (metabolic toxins)."
  },
  {
    name: "Chole Bhature",
    aliases: ["chana bhatura", "bhatura chana"],
    category: "North Indian Meals",
    dosha_effect: { vata: "neutral", pitta: "increases", kapha: "increases" },
    nature: "Extremely Heavy (Ati-Guru), Fermented, Heating",
    health_rating: "Indulgent",
    healthier_alternative: "Chole with whole wheat tandoori roti or roasted multigrain kulcha with soaked chickpeas cooked with cumin, ajwain and hing.",
    reason: "Fermented maida fried in oil combined with dense chickpeas taxes Mandagni (weak digestive fire) leading to bloating and sluggishness."
  },
  {
    name: "Khichdi",
    aliases: ["moong dal khichdi", "dal khichdi", "ayurvedic khichdi"],
    category: "Healing & Daily Meals",
    dosha_effect: { vata: "decreases", pitta: "decreases", kapha: "decreases" },
    nature: "Tridoshic (Sama), Light (Laghu), Nourishing (Sattvic)",
    health_rating: "Healthy",
    healthier_alternative: "Already the gold standard of Ayurvedic food! Add 1 tsp A2 cow ghee and tempered cumin for peak digestion.",
    reason: "Yellow split moong dal and aged rice cooked with turmeric, cumin, and rock salt is universally balancing, easily assimilable, and cleanses the gut."
  },
  {
    name: "Paratha",
    aliases: ["aloo paratha", "paneer paratha", "gobi paratha"],
    category: "Breakfast & Breads",
    dosha_effect: { vata: "decreases", pitta: "increases", kapha: "increases" },
    nature: "Heavy, Nourishing, Warming",
    health_rating: "Moderate",
    healthier_alternative: "Methi (fenugreek) or palak paratha roasted with minimal pure ghee on an iron tawa rather than swimming in refined oil.",
    reason: "Adding bitter greens like methi cuts the heavy Kapha nature of wheat, and roasted ghee digests much cleaner than burned seed oils."
  },
  {
    name: "Idli Sambar",
    aliases: ["idli", "steamed idli", "idli vada"],
    category: "South Indian Breakfast",
    dosha_effect: { vata: "decreases", pitta: "neutral", kapha: "neutral" },
    nature: "Light (Laghu), Fermented, Easily Digestible",
    health_rating: "Healthy",
    healthier_alternative: "Ragi or oats idli with moringa drumstick sambar and fresh coconut-curry leaf chutney.",
    reason: "Steaming makes it gentle on Agni; fermented rice and black gram nourish gut microbiome without creating heaviness."
  },
  {
    name: "Dosa",
    aliases: ["masala dosa", "plain dosa", "crispy dosa"],
    category: "South Indian",
    dosha_effect: { vata: "decreases", pitta: "increases", kapha: "neutral" },
    nature: "Crisp, Heating, Fermented",
    health_rating: "Moderate",
    healthier_alternative: "Pesarattu (whole green moong dosa) roasted with minimal ghee and ginger-chilli chutney.",
    reason: "Thin fermented batter is light, but heavy oil crisping and spiced potato filling increase Pitta heat."
  },
  {
    name: "Biryani",
    aliases: ["dum biryani", "chicken biryani", "veg biryani"],
    category: "Main Course",
    dosha_effect: { vata: "decreases", pitta: "increases", kapha: "increases" },
    nature: "Rich, Heavy, Heating, Aromatic",
    health_rating: "Indulgent",
    healthier_alternative: "Brown basmati or quinoa biryani layered with mint, saffron, and yogurt raita with roasted cumin.",
    reason: "Heavy fried onions, concentrated fats, and pungent garam masalas stimulate digestion but aggravate Pitta and Kapha when eaten frequently."
  },
  {
    name: "Poha",
    aliases: ["kanda poha", "flattened rice", "batata poha"],
    category: "Breakfast & Snacks",
    dosha_effect: { vata: "decreases", pitta: "neutral", kapha: "neutral" },
    nature: "Light, Dry, Sattvic",
    health_rating: "Healthy",
    healthier_alternative: "Add plenty of green peas, carrots, peanuts, and finish with fresh lemon juice and coriander.",
    reason: "Flattened rice is light on digestion; tempered mustard seeds and curry leaves ignite Jatharagni without overheating."
  },
  {
    name: "Maggi Noodles",
    aliases: ["instant noodles", "maggi masala", "ramen"],
    category: "Packaged Snacks",
    dosha_effect: { vata: "increases", pitta: "increases", kapha: "increases" },
    nature: "Extremely Heavy, Sticky (Pichhila), Chemically Pungent",
    health_rating: "Indulgent",
    healthier_alternative: "Whole wheat or millet vermicelli cooked with fresh veggies, turmeric, cumin, and rock salt.",
    reason: "Flash-fried maida and high sodium/additive seasoning coat the gut lining with sticky Ama, suppressing Agni."
  },
  {
    name: "Pav Bhaji",
    aliases: ["bombay pav bhaji", "butter pav bhaji"],
    category: "Street Food",
    dosha_effect: { vata: "neutral", pitta: "increases", kapha: "increases" },
    nature: "Heavy, Spicy, Sour, Oily",
    health_rating: "Indulgent",
    healthier_alternative: "Bhaji made with sweet potato, cauliflower, and beet puree; whole wheat pav toasted in A2 cow ghee.",
    reason: "Commercial butter drenched over mashed nightshades (potatoes, tomatoes) creates acidity and heavy lymphatic stagnation."
  },
  {
    name: "Palak Paneer",
    aliases: ["spinach cottage cheese", "saag paneer"],
    category: "Curries",
    dosha_effect: { vata: "decreases", pitta: "decreases", kapha: "increases" },
    nature: "Nourishing, Heavy, Cooling",
    health_rating: "Healthy",
    healthier_alternative: "Use fresh homemade paneer or tofu; add a pinch of nutmeg and black pepper to help digest paneer's heavy Kapha nature.",
    reason: "Spinach provides iron and chlorophyll, pacifying Pitta, while paneer nourishes bone and muscle tissues (Asthi & Mamsa Dhatus)."
  },
  {
    name: "Rajma Chawal",
    aliases: ["kidney beans with rice", "punjabi rajma"],
    category: "North Indian Meals",
    dosha_effect: { vata: "increases", pitta: "neutral", kapha: "neutral" },
    nature: "Heavy, Dense, Astringent",
    health_rating: "Moderate",
    healthier_alternative: "Soak kidney beans for 12 hours, cook thoroughly with generous ginger, garlic, hing, and ajwain, served with aged basmati.",
    reason: "Kidney beans have strong astringent taste (Kashaya) which can produce flatulence (Vata) if not well spiced."
  },
  {
    name: "Upma",
    aliases: ["rava upma", "sooji upma", "semolina upma"],
    category: "Breakfast",
    dosha_effect: { vata: "decreases", pitta: "decreases", kapha: "increases" },
    nature: "Warm, Moist, Nourishing",
    health_rating: "Healthy",
    healthier_alternative: "Oats upma or broken wheat (daliya) upma cooked with vegetables and ginger.",
    reason: "Semolina roasted with mustard seeds and curry leaves is soothing to the stomach and balances Vata dryness."
  },
  {
    name: "Curd Rice",
    aliases: ["thayir sadam", "dahi chawal", "yogurt rice"],
    category: "South Indian Staples",
    dosha_effect: { vata: "decreases", pitta: "decreases", kapha: "increases" },
    nature: "Cooling, Heavy, Probiotic",
    health_rating: "Healthy",
    healthier_alternative: "Consume fresh sweet curd during daytime with tempered curry leaves, ginger, and pomegranate arils. Avoid eating at night.",
    reason: "Fresh curd replenishes digestive microflora and pacifies summer Pitta heat, though heavy Kapha individuals should consume in moderation."
  },
  {
    name: "Chai with Parle-G",
    aliases: ["tea and biscuits", "masala chai with cookies"],
    category: "Snacks & Drinks",
    dosha_effect: { vata: "increases", pitta: "increases", kapha: "increases" },
    nature: "Heating, High Sugar, Processed",
    health_rating: "Indulgent",
    healthier_alternative: "Ginger-cardamom herbal tea sweetened with jaggery, paired with roasted makhana (foxnuts) or soaked almonds.",
    reason: "Refined sugar, empty carbohydrates, and excess black tea caffeine create rapid blood sugar spikes followed by crashes that destabilize Vata."
  },
  {
    name: "Pakora",
    aliases: ["bhajiya", "onion pakoda", "paneer pakora"],
    category: "Fried Snacks",
    dosha_effect: { vata: "decreases", pitta: "increases", kapha: "increases" },
    nature: "Deep Fried, Heavy, Heating",
    health_rating: "Indulgent",
    healthier_alternative: "Tawa-roasted spiced besan chilla strips or roasted air-fried vegetable fritters with mint-amla dip.",
    reason: "Reheated cooking oils produce oxidative stress and aggravate Rakta (blood tissue) and Pitta, triggering skin breakouts and acid reflux."
  },
  {
    name: "Dal Tadka",
    aliases: ["yellow dal", "toor dal", "arhar dal"],
    category: "Daily Staples",
    dosha_effect: { vata: "decreases", pitta: "decreases", kapha: "decreases" },
    nature: "Light, Nourishing, Sattvic",
    health_rating: "Healthy",
    healthier_alternative: "Temper with pure cow ghee, cumin, garlic, and turmeric for maximum bio-availability of protein.",
    reason: "Easily digestible plant protein that balances all bodily tissues (Dhatus) when tempered with anti-inflammatory spices."
  },
  {
    name: "Bhelpuri",
    aliases: ["bhel", "chaat", "sukha bhel"],
    category: "Street Food",
    dosha_effect: { vata: "increases", pitta: "increases", kapha: "neutral" },
    nature: "Dry, Light, Sour, Spicy",
    health_rating: "Moderate",
    healthier_alternative: "Sprouted moong chaat with chopped cucumbers, pomegranate, roasted cumin, and mint water (Pani Puri style).",
    reason: "Puffed rice and dry sev increase Vata dryness in the colon, while sour tamarind paste increases Pitta heat."
  },
  {
    name: "Vada Pav",
    aliases: ["batata vada with pav", "mumbai burger"],
    category: "Street Food",
    dosha_effect: { vata: "neutral", pitta: "increases", kapha: "increases" },
    nature: "Heavy, Fried, Fermented",
    health_rating: "Indulgent",
    healthier_alternative: "Pan-seared spiced potato-oat patty tucked in whole-grain bun with fresh green garlic-coriander chutney.",
    reason: "Combination of deep-fried starch with white bread creates an intense glycemic load and slows metabolic rate."
  },
  {
    name: "Gulab Jamun",
    aliases: ["jamun", "sweet dumpling"],
    category: "Desserts",
    dosha_effect: { vata: "decreases", pitta: "increases", kapha: "increases" },
    nature: "Extremely Heavy, Dense, Deeply Sweet (Ati-Madhura)",
    health_rating: "Indulgent",
    healthier_alternative: "Steamed Sandesh or date-and-fig ladoos (Khajoor roll) rolled in crushed pistachios.",
    reason: "Deep fried milk solids soaked in refined sugar syrup cause immediate insulin spikes and create heavy Ama in the lymphatic system."
  }
];

export const PACKAGED_RED_FLAGS: RedFlagAdditive[] = [
  {
    ingredient: "Maida (Refined Wheat Flour)",
    identifiers: ["maida", "refined wheat flour", "bleached flour", "wheat flour (60%)", "refined flour"],
    risk: "High",
    ayurvedic_impact: "Sticky (Pichhila), heavy (Guru), causes severe constipation and blocks the micro-channels (Srotas).",
    better_swap: "Whole wheat, ragi, jowar, or oats."
  },
  {
    ingredient: "Palm Oil / Palmolein",
    identifiers: ["palm oil", "palmolein", "hydrogenated palm", "fractionated palm", "edible vegetable oil (palmolein)"],
    risk: "High",
    ayurvedic_impact: "Extremely heavy to metabolize; aggravates Kapha and triggers Vidaha (internal inflammation).",
    better_swap: "Cold-pressed mustard oil, sesame oil, or pure cow ghee."
  },
  {
    ingredient: "High Fructose Corn Syrup / Invert Syrup",
    identifiers: ["high fructose corn syrup", "invert syrup", "liquid glucose", "corn syrup", "invert sugar syrup"],
    risk: "High",
    ayurvedic_impact: "Unnatural sweet rasa that over-stimulates Kapha and fatty tissue (Meda Dhatu).",
    better_swap: "Raw honey, desi khand, or organic jaggery."
  },
  {
    ingredient: "INS 621 / INS 635 (Flavour Enhancers)",
    identifiers: ["ins 621", "ins 627", "ins 631", "ins 635", "msg", "monosodium glutamate", "flavor enhancer", "flavour enhancer"],
    risk: "Moderate",
    ayurvedic_impact: "Hyper-excites the nervous system (Vata) and induces artificial thirst and Pitta irritability.",
    better_swap: "Naturally umami spices like roasted cumin, rock salt, and nutritional yeast."
  },
  {
    ingredient: "Synthetic Food Colors (Tartrazine / Sunset Yellow)",
    identifiers: ["ins 102", "ins 110", "tartrazine", "sunset yellow", "artificial color", "synthetic food colour"],
    risk: "High",
    ayurvedic_impact: "Acts as Garavisha (slow chemical toxin) accumulating in the liver (Yakrit).",
    better_swap: "Natural colors derived from turmeric, beetroot, and saffron."
  },
  {
    ingredient: "Artificial Preservatives (BHA / BHT / Benzoates)",
    identifiers: ["ins 320", "ins 321", "bha", "bht", "ins 211", "sodium benzoate", "potassium sorbate"],
    risk: "High",
    ayurvedic_impact: "Dampens digestive fire (Mandagni) and disrupts the gut microbiome flora.",
    better_swap: "Natural preservation via rock salt, turmeric, and airtight glass storage."
  }
];

export const KNOWN_PACKAGED_SNACKS: Record<string, PackagedSnackData> = {
  // Maggi 2-Minute Masala Noodles
  "8901030383709": {
    product_name: "Maggi 2-Minute Masala Noodles",
    brand: "Nestle India",
    ingredients_text: "Refined wheat flour (Maida), Palm oil, Iodised salt, Wheat gluten, Thickeners (508, 412), Acidity regulators (501(i), 500(i)), Humectant (451(i)), Mixed spices (onion powder, coriander, turmeric, red chilli, garlic, cumin, aniseed, fenugreek, ginger, black pepper, clove, nutmeg, cardamom), Sugar, Edible starch, Flavour enhancer (INS 635).",
    flagged_ingredients: [
      {
        ingredient: "Maida (Refined Wheat Flour)",
        risk: "High",
        ayurvedic_impact: "Sticky (Pichhila), heavy (Guru), causes severe constipation and creates sticky Ama in gut microvilli.",
        better_swap: "Millet (ragi/jowar) noodles or homemade whole wheat sevai."
      },
      {
        ingredient: "Palm Oil / Palmolein",
        risk: "High",
        ayurvedic_impact: "Dense reheated fat that severely dampens Agni (digestive fire) and creates toxic Ama.",
        better_swap: "Cold-pressed sesame oil or pure cow ghee."
      },
      {
        ingredient: "INS 635 (Flavour Enhancer)",
        risk: "Moderate",
        ayurvedic_impact: "Artificially stimulates taste receptors, sparking false cravings and destabilizing Vata signaling.",
        better_swap: "Natural spices: roasted cumin, hing, and rock salt."
      }
    ],
    ayurvedic_verdict: "Maggi pairs fried refined wheat (maida) with heavy palm oil, coating the gut lining with sticky Ama. It slows digestive fire and causes mental lethargy 45 minutes later.",
    dosha_impact: { vata: "increases", pitta: "increases", kapha: "increases" },
    primary_concern: "Deep-fried Maida and heavy palm oil creating sticky digestive toxins (Ama).",
    healthier_snack_alternatives: [
      "Millet or Ragi Hakka noodles tossed with fresh garlic, carrots, and cold-pressed oil",
      "Roasted poha chivda or vegetable vermicelli (sevai upma) with peanuts"
    ],
    student_tip: "In a hostel room: discard half the tastemaker packet, boil with lots of chopped onions/carrots, and stir in 1/2 tsp ghee to lubricate digestion!"
  },

  // Haldiram's Nagpur Bhujia
  "8901491101837": {
    product_name: "Haldiram's Nagpur Bhujia Sev",
    brand: "Haldiram's",
    ingredients_text: "Tepary beans (Moth dal) flour (43%), Edible vegetable oil (Cottonseed oil, Corn oil and Palmolein oil), Bengal gram (Besan) flour (12%), Iodised salt, Red chilli powder, Black pepper powder, Ginger powder, Clove powder, Cardamom powder, Nutmeg powder, Bay leaves.",
    flagged_ingredients: [
      {
        ingredient: "Palmolein & Cottonseed Vegetable Oil",
        risk: "High",
        ayurvedic_impact: "Commercial deep-frying at high heat oxidizes polyunsaturated fats, aggravating Rakta (blood tissue) and Pitta heat.",
        better_swap: "Dry-roasted chana or air-roasted snacks."
      },
      {
        ingredient: "High Sodium & Sharp Chilli",
        risk: "Moderate",
        ayurvedic_impact: "Excess Lavana (salty) and Katu (pungent) rasas cause dehydration and trigger severe heartburn.",
        better_swap: "Lightly salted roasted makhana with Kala Namak."
      }
    ],
    ayurvedic_verdict: "While besan and moth dal provide plant protein, the deep frying in commercial seed oils creates intense Pitta heat and acid reflux. A spoonful is fine, but snacking from the packet burns your stomach lining.",
    dosha_impact: { vata: "decreases", pitta: "increases", kapha: "increases" },
    primary_concern: "Deep industrial frying oil absorption and intense sodium causing acid irritation.",
    healthier_snack_alternatives: [
      "Roasted Chana (Bhuna Chana) spiced with roasted cumin and Kala Namak",
      "Air-roasted Makhana (Fox nuts) with turmeric and a drop of cow ghee"
    ],
    student_tip: "Never eat Bhujia on an empty stomach with chai — the tannin + hot oil combo triggers instant acidity. Pair with buttermilk if eating."
  },

  // Parle-G Original Gluco Biscuits
  "8901719101050": {
    product_name: "Parle-G Original Gluco Biscuits",
    brand: "Parle",
    ingredients_text: "Refined Wheat Flour (Maida) (67%), Sugar (24%), Refined Palm Oil, Invert Sugar Syrup (2%), Raising Agents [INS 503(ii), INS 500(ii)], Salt, Milk Solids (0.6%), Emulsifier (INS 322), Added Flavours.",
    flagged_ingredients: [
      {
        ingredient: "Maida (Refined Wheat Flour)",
        risk: "High",
        ayurvedic_impact: "Devoid of fiber; coats gut microvilli and creates Kapha mucus stagnation.",
        better_swap: "Whole wheat, oats, or ragi biscuits."
      },
      {
        ingredient: "High Refined Sugar & Invert Syrup",
        risk: "High",
        ayurvedic_impact: "Spikes blood glucose instantaneously, followed by an afternoon energy crash and brain fog.",
        better_swap: "Jaggery (Gud) or dates for natural sweetness."
      },
      {
        ingredient: "Palm Oil",
        risk: "High",
        ayurvedic_impact: "Heavy, sluggish lipid profile that dampens digestive fire (Mandagni).",
        better_swap: "Pure butter or cold-pressed coconut oil."
      }
    ],
    ayurvedic_verdict: "Classic nostalgia, but nutrition-wise Parle-G is essentially baked maida, refined sugar, and palm oil. Dipping 5-6 biscuits in tea causes a massive glucose surge followed by lethargy and cravings within an hour.",
    dosha_impact: { vata: "increases", pitta: "increases", kapha: "increases" },
    primary_concern: "High glycemic refined flour and sugar driving insulin resistance and Kapha stagnation.",
    healthier_snack_alternatives: [
      "Whole grain multigrain or ragi cookies sweetened with jaggery",
      "Soaked almonds and walnuts with 2 soft Medjool dates"
    ],
    student_tip: "If you need a chai dipping snack during late-night exam prep, swap biscuits for roasted makhana or whole-wheat khakhra."
  },

  // Kurkure Masala Munch
  "8901491503020": {
    product_name: "Kurkure Masala Munch",
    brand: "PepsiCo India",
    ingredients_text: "Rice Meal (42.8%), Edible Vegetable Oil (Palmolein), Corn Meal (19.8%), Gram Meal (3.3%), Spices and Condiments (Onion Powder, Chilli Powder, Amchur, Coriander Powder, Ginger Powder, Garlic Powder, Black Pepper, Turmeric), Salt, Acidity Regulators (330, 296), Flavor Enhancers (627, 631).",
    flagged_ingredients: [
      {
        ingredient: "Palm Oil / Palmolein",
        risk: "High",
        ayurvedic_impact: "Reheated industrial frying oil that burdens the liver (Yakrit) and increases systemic Pitta heat.",
        better_swap: "Roasted snacks cooked with mustard oil or ghee."
      },
      {
        ingredient: "INS 627, 631 (Flavour Enhancers)",
        risk: "Moderate",
        ayurvedic_impact: "Artificial neuro-stimulants that cause compulsive over-snacking and hyper-excite Vata.",
        better_swap: "Natural chaat masala with amla powder and rock salt."
      }
    ],
    ayurvedic_verdict: "Puffed corn and rice are light, but frying in palmolein and coating with synthetic acidity regulators turns this into an ultra-processed Pitta irritant.",
    dosha_impact: { vata: "increases", pitta: "increases", kapha: "neutral" },
    primary_concern: "Concentrated industrial palmolein and artificial acid regulators causing gastritis.",
    healthier_snack_alternatives: [
      "Roasted Masala Makhana with black salt, cumin, and dry mango powder",
      "Roasted murmura (puffed rice) tossed with roasted peanuts and green chillies"
    ],
    student_tip: "Drink a cup of room-temperature fennel seed water (Saunf water) after eating to neutralize Pitta burning."
  },

  // Lay's India's Magic Masala
  "8901491001014": {
    product_name: "Lay's India's Magic Masala Potato Chips",
    brand: "PepsiCo India",
    ingredients_text: "Potato (52%), Edible Vegetable Oil (Palmolein), Spices & Condiments (Onion Powder, Chilli Powder, Dry Mango, Coriander, Pepper, Ginger, Garlic, Clove, Cinnamon), Salt, Sugar, Maltodextrin, Acidity Regulators (330, 334), Flavour Enhancers (627, 631).",
    flagged_ingredients: [
      {
        ingredient: "Palmolein Oil",
        risk: "High",
        ayurvedic_impact: "High heat oxidized fats that form arterial plaque and damp digestive fire.",
        better_swap: "Baked potato or sweet potato wedges."
      },
      {
        ingredient: "Maltodextrin & Sugar",
        risk: "Moderate",
        ayurvedic_impact: "Super-fast glycemic starch that triggers sudden insulin release and increases Kapha.",
        better_swap: "Natural whole spices and unrefined rock salt."
      }
    ],
    ayurvedic_verdict: "Thin potato crisps fried in palmolein create intense dry Vata qualities while the spicy masala inflames Pitta. Causes dry throat and sluggish gut motility.",
    dosha_impact: { vata: "increases", pitta: "increases", kapha: "neutral" },
    primary_concern: "High acrylamide and palmolein frying oils with excessive sodium.",
    healthier_snack_alternatives: [
      "Home-baked sweet potato wedges seasoned with chaat masala",
      "Air-popped lotus seeds or roasted chana"
    ],
    student_tip: "Instead of finishing a 50g packet, mix a handful with roasted peanuts and cucumbers to reduce the glycemic blow."
  }
};
