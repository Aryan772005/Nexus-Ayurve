import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Activity, Ribbon, Heart, Scale, Shield, Coffee, ChevronLeft, ChevronRight, TrendingDown, TrendingUp, Utensils } from 'lucide-react';
import { motion } from 'framer-motion';

const TOPIC_META: Record<string, { shortDesc: string; colorCls: string; iconBg: string; borderCls: string }> = {
  'weight-loss':      { shortDesc: 'Triphala, Guggulu, Kapalbhati & Kapha diet for sustainable fat loss.', colorCls: 'text-emerald-400', iconBg: 'bg-emerald-500/20 border-emerald-500/30', borderCls: 'border-emerald-500/20' },
  'gain-weight':      { shortDesc: 'Ashwagandha milk, Shatavari, Chyawanprash & Abhyanga for healthy mass.', colorCls: 'text-blue-400', iconBg: 'bg-blue-500/20 border-blue-500/30', borderCls: 'border-blue-500/20' },
  'calorie-reduction':{ shortDesc: '10 Q&As: meal timing, low-cal foods, herbs & intermittent fasting.', colorCls: 'text-orange-400', iconBg: 'bg-orange-400/20 border-orange-400/30', borderCls: 'border-orange-400/20' },
  'immunity':         { shortDesc: 'Chyawanprash, Giloy, Golden Milk & Sattvic living to build strong Ojas.', colorCls: 'text-purple-400', iconBg: 'bg-purple-500/20 border-purple-500/30', borderCls: 'border-purple-500/20' },
  'liver':            { shortDesc: 'Kutki, Bhumi Amla & Aloe Vera for liver protection and detoxification.', colorCls: 'text-teal-400', iconBg: 'bg-teal-500/20 border-teal-500/30', borderCls: 'border-teal-500/20' },
  'sexual-wellness':  { shortDesc: 'Shilajit, Safed Musli, Shatavari & Ashwagandha for vitality & hormones.', colorCls: 'text-rose-400', iconBg: 'bg-rose-500/20 border-rose-500/30', borderCls: 'border-rose-500/20' },
  'hangover':         { shortDesc: 'Coconut water, CCF tea, grape juice & Aloe Vera to flush toxins fast.', colorCls: 'text-amber-400', iconBg: 'bg-amber-400/20 border-amber-400/30', borderCls: 'border-amber-400/20' },
  'cancer':           { shortDesc: 'Ashwagandha, Turmeric, Tulsi & Sattvic diet as holistic complementary support.', colorCls: 'text-violet-400', iconBg: 'bg-violet-500/20 border-violet-500/30', borderCls: 'border-violet-500/20' },
  'weight':           { shortDesc: 'Triphala, Guggulu & Kapha-pacifying strategies for weight management.', colorCls: 'text-lime-400', iconBg: 'bg-lime-500/20 border-lime-500/30', borderCls: 'border-lime-500/20' },
};

const RELATED_TOPICS: Record<string, string[]> = {
  'weight':            ['weight-loss', 'gain-weight', 'calorie-reduction'],
  'weight-loss':       ['gain-weight', 'calorie-reduction', 'immunity'],
  'gain-weight':       ['weight-loss', 'calorie-reduction', 'immunity'],
  'calorie-reduction': ['weight-loss', 'gain-weight', 'immunity'],
  'immunity':          ['liver', 'cancer', 'hangover'],
  'liver':             ['immunity', 'hangover', 'cancer'],
  'sexual-wellness':   ['immunity', 'gain-weight', 'weight-loss'],
  'hangover':          ['liver', 'immunity', 'calorie-reduction'],
  'cancer':            ['immunity', 'liver', 'sexual-wellness'],
};

const TOPIC_CONTENT: Record<string, any> = {
  'liver': {
    title: 'Liver Care & Detoxification',
    icon: Activity,
    dosha: 'Pitta Dominant',
    content: `In Ayurveda, the liver (Yakrit) is considered the seat of Pitta dosha—the element of fire and water responsible for digestion, metabolism, and detoxification.

    When Pitta is imbalanced, the liver becomes sluggish, leading to skin inflammation, digestive issues, and anger. 
    
    ### Ayurvedic Remedies for the Liver
    • **Kutki (Picrorhiza kurroa):** A powerful hepatoprotective herb that stimulates bile secretion and protects liver cells.
    • **Bhumi Amla:** Traditionally used to manage liver disorders and support natural detox.
    • **Aloe Vera Juice:** Cooling and soothing for an overheated liver.
    • **Diet:** Favor cooling, bitter, and astringent foods like leafy greens. Avoid alcohol, deep-fried foods, and excessive spicy heat.`,
  },
  'cancer': {
    title: 'Holistic Support for Cellular Health (Cancer)',
    icon: Ribbon,
    dosha: 'Tridoshic Focus',
    content: `Ayurveda views cancer (Arbuda) as an imbalance of all three doshas (Vata, Pitta, Kapha), leading to the accumulation of Ama (toxins) and loss of Ojas (vital immunity).

    *Note: Ayurvedic therapies are complementary and should be used alongside standard oncological treatments, not as a replacement.*
    
    ### Supportive Ayurvedic Practices
    • **Ashwagandha:** An adaptogen that may help manage stress and fatigue associated with treatments.
    • **Turmeric (Curcumin):** Known for its powerful anti-inflammatory and antioxidant properties.
    • **Tulsi (Holy Basil):** Helps purify the blood and support immune function.
    • **Panchakarma:** Gentle detox processes can help remove Ama under the strict guidance of an Ayurvedic doctor.
    • **Diet:** Follow a strict Sattvic (pure, fresh, easily digestible) diet to nourish the tissues (Dhatus) without feeding the toxins.`,
  },
  'sexual-wellness': {
    title: 'Vajikarana: Sexual Wellness & Vitality',
    icon: Heart,
    dosha: 'Shukra Dhatu Focus',
    content: `Vajikarana is a major branch of Ayurveda dedicated to aphrodisiacs, sexual health, vitality, and healthy progeny. It focuses on nourishing the Shukra Dhatu (reproductive tissue).

    ### Ayurvedic Enhancers for Vitality
    • **Shilajit:** A mineral-rich resin known as the "destroyer of weakness," excellent for stamina and vigor.
    • **Safed Musli:** A potent herb for improving male sexual health and performance.
    • **Shatavari:** The premier herb for female reproductive health and hormonal balance.
    • **Ashwagandha & Gokshura:** Used together to boost testosterone, reduce stress, and improve physical endurance.
    • **Lifestyle:** Adequate sleep, stress management, and a nourishing diet containing milk, ghee, and almonds are highly recommended.`,
  },
  'weight': {
    title: 'Weight Management & Metabolism',
    icon: Scale,
    dosha: 'Kapha Pacifying',
    content: `Excess weight (Sthaulya) is primarily seen as an imbalance of Kapha dosha and a slow digestive fire (Agni). When Agni is weak, food turns into Ama (toxins) and fat (Meda dhatu) rather than energy.

    ### Ayurvedic Weight Loss Strategies
    • **Triphala:** A classic blend of three fruits that gently cleanses the colon and supports fat metabolism.
    • **Guggulu:** Renowned for scraping away excess fat and regulating cholesterol levels.
    • **Warm Lemon & Honey Water:** Start your day with this to kickstart digestion and flush toxins.
    • **Diet:** Emphasize warm, light, spicy, and bitter foods. Heavy, cold, sweet, and oily foods (which increase Kapha) should be minimized.
    • **Exercise:** Vigorous exercise (Vyayama) during the Kapha time of day (6 AM - 10 AM) is most effective for weight loss.`,
  },
  'immunity': {
    title: 'Building Ojas (Immunity & Resilience)',
    icon: Shield,
    dosha: 'Ojas Enhancing',
    content: `Immunity in Ayurveda is known as "Ojas," the subtle essence of all bodily tissues. Strong Ojas provides protection against diseases, glowing skin, and a calm mind.

    ### How to Build Ojas
    • **Chyawanprash:** A traditional Ayurvedic jam made from Amla (Indian gooseberry) and dozens of herbs, rich in Vitamin C and antioxidants.
    • **Giloy (Guduchi):** An immunomodulator that helps manage recurrent fevers and infections.
    • **Golden Milk:** Warm milk mixed with turmeric, black pepper, and a pinch of nutmeg before bed promotes restorative sleep and healing.
    • **Diet & Lifestyle:** Consuming fresh, Prana-rich foods (fruits, nuts, whole grains), practicing daily meditation, and maintaining a regular daily routine (Dinacharya).`,
  },
  'hangover': {
    title: 'Ayurvedic Hangover Fix & Recovery',
    icon: Coffee,
    dosha: 'Pitta & Vata Pacifying',
    content: `Alcohol (Madya) is considered heating, drying, and toxic in massive quantities. It heavily aggravates Pitta (causing acidity/liver stress) and Vata (causing dehydration/headaches).

    ### Natural Hangover Remedies
    • **Hydration & Electrolytes:** Coconut water is the ultimate Pitta-pacifying drink that rapidly rehydrates the body and restores electrolytes.
    • **Grape Juice Reset:** Fresh, sweet grape juice or raisins soaked in water overnight help cool the liver and flush out alcohol toxins.
    • **Cumin, Coriander, Fennel (CCF) Tea:** Sipping this warm tea restores the digestive fire (Agni) and clears nausea without acidity.
    • **Aloe Vera:** 2 tablespoons of aloe vera juice helps heal the stomach lining and cool the digestive tract.
    • **Sleep:** Deep rest is essential. Avoid heavy, greasy "hangover foods" which only create more Ama (toxins); instead, eat light, warm soups or Khichdi.`,
  },
  'weight-loss': {
    title: 'Weight Loss & Body Transformation',
    icon: TrendingDown,
    dosha: 'Kapha Pacifying',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80',
    imageAlt: 'Woman measuring her waist with a tape measure after weight loss',
    imageLabel: 'Ayurvedic Body Transformation',
    content: `Weight management in Ayurveda is a holistic science — not just about calories, but about balancing your body's natural intelligence (Prakriti), strengthening your digestive fire (Agni), and eliminating the root cause of excess fat accumulation.

    Excess weight (Sthaulya) is primarily caused by a Kapha imbalance and weakened Agni. When digestion is sluggish, food converts into Ama (toxins) and Meda dhatu (fat tissue) instead of energy.

    ### How to Lose Weight — Ayurvedic Approach
    • **Start With Warm Water:** Every morning on an empty stomach, drink warm water with fresh lemon juice and a teaspoon of raw honey. This kindles Agni, flushes toxins, and jumpstarts fat metabolism.
    • **Triphala at Night:** Take 1 tsp of Triphala powder with warm water before bed. It gently cleanses the colon, reduces Ama, and supports fat metabolism over time.
    • **Guggulu Supplement:** Guggulu (Commiphora mukul) is a clinically-studied Ayurvedic resin that actively scrapes away Ama and excess Meda (fat) from tissues while balancing cholesterol.
    • **Intermittent Eating:** Eat your largest meal at noon (when the sun is highest and Agni is strongest). Have a light breakfast and a very light dinner before 7 PM. Avoid snacking between meals.
    • **Kapha-Pacifying Diet:** Favor warm, light, spicy, and bitter foods — think ginger, pepper, turmeric, leafy greens, lentils, and barley. Strictly reduce heavy, cold, sweet, oily, and dairy-heavy foods.
    • **Kapalbhati Pranayama:** Practice 10–15 minutes of this powerful breathing technique each morning. It directly massages the abdominal organs, boosts metabolism, and burns visceral fat.
    • **Surya Namaskar:** 12 rounds of Sun Salutation every morning activates all major muscle groups, stimulates the lymphatic system, and is one of the most effective full-body fat-burning practices.
    • **Vigorous Exercise in Kapha Hours:** Exercise between 6 AM and 10 AM (Kapha time of day) for maximum fat-burning effect. Walking, cycling, swimming, and strength training are all excellent.
    • **Avoid Day Sleep:** Daytime sleeping greatly increases Kapha and slows metabolism. Stay active during the day.
    • **Manage Stress:** High cortisol triggers fat storage around the belly. Practice 10 min of daily meditation (Dhyana) to regulate stress hormones.

    ### How to Gain Weight — Ayurvedic Approach
    • **Ashwagandha with Warm Milk:** Take 1 tsp of Ashwagandha powder in warm whole milk with a pinch of saffron before bed. This builds Ojas, reduces cortisol, and promotes healthy muscle and tissue growth.
    • **Shatavari for Nourishment:** Shatavari is a premier tonic for building body mass, particularly for women. It nourishes all seven body tissues (Sapta Dhatus).
    • **Chyawanprash Daily:** 1–2 tsp of Chyawanprash in the morning provides dense nourishment, boosts immunity, and supports healthy weight gain through Ojas building.
    • **Eat More Sattvic Fats:** Include healthy fats like pure ghee, soaked almonds, soaked walnuts, avocado, and coconut in every meal to provide calorie-dense, nourishing fuel.
    • **Eat Every 3 Hours:** For weight gain, never allow Agni to burn without fuel. Eat small, frequent, nutritious meals throughout the day — include dates, bananas, sweet potatoes, and whole grains.
    • **Strength Training:** Resistance training 4–5 times per week stimulates muscle growth. Compound lifts like squats and deadlifts are most effective for healthy mass gain.
    • **Abhyanga (Oil Massage):** Daily self-massage with warm sesame oil before your bath nourishes the skin, builds tissues, and calms Vata which is often the cause of underweight conditions.
    • **Adequate Rest:** Sleep 8–9 hours to allow your body to repair, rebuild, and absorb nutrients. Growth hormone peaks during deep sleep.

    *Note: Consult an Ayurvedic practitioner for a personalized plan before starting any herbal supplement regimen.*`,
  },
  'gain-weight': {
    title: 'Gain Weight & Build Healthy Mass',
    icon: TrendingUp,
    dosha: 'Vata & Kapha Nourishing',
    image: 'https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?w=900&q=80',
    imageAlt: 'Person eating a healthy nourishing Ayurvedic meal to gain weight',
    imageLabel: 'Ayurvedic Mass Building',
    content: `Underweight conditions (Karshya) in Ayurveda are primarily caused by an aggravated Vata dosha and weak Agni (digestive fire). When Vata is excess, it dries and depletes the body tissues (Dhatus), leading to low body weight, fatigue, anxiety, and poor absorption of nutrients.

    The goal is not just to gain weight but to build strong, nourishing Ojas — the essence of vitality that makes tissue dense and immunity strong.

    ### Step-by-Step Ayurvedic Guide to Gain Weight
    • **Ashwagandha with Warm Whole Milk:** Take 1 tsp of Ashwagandha (Withania somnifera) powder in a glass of warm full-fat milk with a pinch of saffron and 1 tsp of raw honey before bed. This is the most powerful Ayurvedic combination for building Ojas, reducing cortisol, and promoting healthy lean mass.
    • **Shatavari — The Great Nourisher:** 1 tsp of Shatavari (Asparagus racemosus) powder in warm milk daily. Shatavari nourishes all seven body tissues (Sapta Dhatus), especially reproductive and muscle tissue. Especially effective for women.
    • **Chyawanprash Every Morning:** Take 1–2 tsp of Chyawanprash in warm milk every morning. This dense Ayurvedic formulation contains Amla, Ashwagandha, and 40+ herbs that rapidly build Ojas and support healthy weight gain.
    • **Eat Every 3 Hours — Never Let Agni Go Empty:** For healthy weight gain, keep your Agni (digestive fire) consistently fueled. Eat 5–6 small meals throughout the day — including soaked dates, bananas, sweet potatoes, whole grains, and warm khichdi.
    • **Add Pure Ghee to Every Meal:** Pure desi ghee (clarified butter) is the supreme Ayurvedic food for gaining healthy weight. It nourishes all tissues, lubricates the digestive tract, and is easily absorbed. Add 1–2 tsp to rice, dal, or roti at every meal.
    • **Soaked Almonds and Walnuts:** Eat 8–10 soaked almonds and 4 walnuts every morning. Soaking removes enzyme inhibitors and makes them much easier to digest. These provide healthy fats, protein, and micronutrients critical for tissue building.
    • **Banana with Milk Shake:** A banana + full-fat milk + 1 tsp of Ashwagandha blended smoothie is an excellent high-calorie, nutritious snack. Add a teaspoon of natural peanut butter or tahini for even more calorie density.
    • **Strengthen Agni First:** Weak digestion is often the root cause of being underweight. Before eating large meals, take a thin slice of fresh ginger with a pinch of rock salt and a few drops of lemon juice 15 minutes before meals to kindle your Agni.
    • **Abhyanga (Daily Oil Self-Massage):** Warm sesame oil self-massage before your morning bath deeply nourishes all body tissues, calms Vata, improves circulation, and over time visibly fills out the body. This is a critical and often overlooked practice for weight gain.
    • **Strength Training 4–5x Per Week:** Resistance training is essential to direct incoming calories into muscle rather than fat. Focus on compound lifts — squats, deadlifts, bench press, and rows. Aim for progressive overload each week.
    • **Sleep 8–9 Hours:** Growth hormone is secreted in highest amounts during deep sleep (11 PM–3 AM). Sleeping early and waking at a regular time maximizes tissue repair and muscle growth overnight.
    • **Avoid Excessive Cardio:** Too much running or intense cardio burns calories you need for building mass. Limit cardio to 20 min of light walking. Focus your energy on lifting and rest.

    ### Best Foods for Weight Gain
    • **Dates, Raisins, Figs:** Nature's calorie-dense Ayurvedic superfoods. Soak 5–6 dates overnight and eat them in the morning with warm milk. Rich in natural sugars, iron, and minerals.
    • **Full-Fat Dairy:** Whole milk, paneer, curd (yogurt), and ghee are the cornerstone of Ayurvedic weight gain diets. Easy to digest and extremely nourishing to body tissues.
    • **Rice, Urad Dal, Rajma:** White rice cooked with ghee, urad dal (black lentil) soup, and kidney beans are classical Kapha-building foods that add healthy body mass.
    • **Avocado and Coconut:** High in healthy monounsaturated fats that promote tissue nourishment without inflammation.

    *Note: Consult an Ayurvedic practitioner before starting any herbal protocol. Results take 2–3 months of consistent practice.*`,
  },
  'calorie-reduction': {
    title: 'How to Reduce Calories — Q&A Guide',
    icon: Utensils,
    dosha: 'Agni Balancing',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=900&q=80',
    imageAlt: 'Healthy low-calorie meal with fresh vegetables, grains and herbs',
    imageLabel: 'Ayurvedic Calorie Guide',
    content: `Reducing calorie intake does not mean starving. In Ayurveda, it means eating the right foods, at the right times, in the right amounts — aligned with your body's natural rhythms and digestive strength (Agni).

    Here are the most common questions answered about reducing calories the Ayurvedic way.

    ### Q&A — Everything You Need to Know

    • **How many calories should I eat to lose weight?:** Rather than counting calories, Ayurveda recommends eating until you are 75% full (Mitahara). This naturally keeps you in a calorie deficit without feeling deprived.

    • **What time should I eat my biggest meal?:** Always at noon (12–1 PM). The sun is highest and your digestive fire (Agni) is strongest then. A large dinner is one of the biggest causes of fat accumulation.

    • **What are the lowest-calorie, most filling Ayurvedic foods?:** Moong dal soup, barley, bitter gourd (karela), bottle gourd (lauki), cucumber, spinach, methi, and warm ginger-cumin water — light, easy to digest, and extremely filling.

    • **Should I skip breakfast to reduce calories?:** No. A light warm breakfast between 7–9 AM is ideal. Try warm lemon water with honey, then a small bowl of Poha, Upma, or fruit. Skipping breakfast increases cortisol and leads to overeating later.

    • **Can I eat rice and roti while reducing calories?:** Yes. Favor red or brown rice in small portions. Use ragi (finger millet) or jowar (sorghum) rotis — high in fibre, more filling, and lower in net calories than refined wheat.

    • **What drinks help reduce calorie intake naturally?:** Jeera (cumin) water in the morning, CCF tea (cumin-coriander-fennel) before meals to suppress appetite, warm ginger-lemon water, and Amla juice. Avoid packaged juices, sodas, and sweetened chai.

    • **How do I handle cravings for sweets and snacks?:** Sweet cravings often signal low blood sugar or Vata imbalance. Keep soaked dates or a small piece of jaggery handy. For snacks, try soaked almonds, walnuts, or warm buttermilk (Takra).

    • **Does eating slowly actually help reduce calories?:** Absolutely. Eating in silence, chewing each bite 20–30 times, and eating without screens gives your brain time to register fullness. Studies show people eat 20–30% fewer calories simply by slowing down.

    • **Which Ayurvedic herbs help suppress appetite?:** Triphala (regulates appetite and digestion), Vijaysar (balances blood sugar), Fenugreek seeds soaked overnight (creates fullness), and Garcinia Cambogia (Vrikshamla — a traditional natural appetite suppressant).

    • **Is intermittent fasting compatible with Ayurveda?:** Yes — but Ayurveda prefers a natural eating window. Eat between 8 AM and 7 PM (13-hour overnight fast). This aligns with solar rhythms, lets Agni rest at night, and results in sustainable calorie reduction without stress.

    *Note: Consult an Ayurvedic practitioner for a personalized calorie plan based on your Prakriti (body type) and health goals.*`,
  },
};

export default function TopicPage() {
  const { id } = useParams<{ id: string }>();
  const topic = id ? TOPIC_CONTENT[id] : null;

  if (!topic) {
    return <Navigate to="/guides" replace />;
  }

  const Icon = topic.icon;
  const relatedIds = (id ? RELATED_TOPICS[id] : []) || [];

  return (
    <div className="min-h-screen pt-48 pb-20 px-6 max-w-4xl mx-auto">
      <Link to="/guides" className="inline-flex items-center gap-2 text-emerald-accent/60 hover:text-emerald-accent mb-8 transition-colors">
        <ChevronLeft size={20} /> Back to Guides
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-moss/30 border border-white/5 p-8 md:p-12 rounded-[40px] shadow-2xl relative overflow-hidden"
      >
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="flex items-center gap-4 mb-6 relative">
          <div className="w-16 h-16 bg-emerald-accent/20 rounded-2xl flex items-center justify-center border border-emerald-accent/30 shrink-0">
            <Icon className="w-8 h-8 text-emerald-accent" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-accent/60 bg-forest/40 px-3 py-1 rounded-full border border-white/5">{topic.dosha}</span>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-cream mt-3">{topic.title}</h1>
          </div>
        </div>

        {/* Hero Image (if topic has one) */}
        {topic.image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative w-full h-72 md:h-96 rounded-3xl overflow-hidden mb-8 border border-white/5 shadow-2xl"
          >
            <img
              src={topic.image}
              alt={topic.imageAlt}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-moss/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-6">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-accent/80 bg-forest/70 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                {topic.imageLabel || topic.dosha}
              </span>
            </div>
          </motion.div>
        )}

        <div className="prose prose-invert prose-emerald prose-lg max-w-none mt-8 text-cream/80 relative">
          {topic.content.split('\n').map((line: string, i: number) => {
            if (line.trim().startsWith('###')) {
              return <h3 key={i} className="text-2xl font-display font-bold text-cream mt-8 mb-4">{line.replace('###', '').trim()}</h3>;
            }
            if (line.trim().startsWith('•')) {
              // Match pattern: • **Label:** rest  (works for both normal bullets and Q&A)
              const match = line.trim().match(/^•\s*\*\*(.+?)\*\*:?\s*(.*)$/);
              if (match) {
                const [, boldPart, restPart] = match;
                return (
                  <p key={i} className="flex gap-3 my-3">
                    <span className="text-emerald-accent mt-1 shrink-0">•</span>
                    <span><strong className="text-cream">{boldPart}:</strong> {restPart}</span>
                  </p>
                );
              }
              return <p key={i} className="flex gap-3 my-3"><span className="text-emerald-accent mt-1">•</span><span>{line.trim().replace('• ', '')}</span></p>;
            }
            if (line.trim().startsWith('*Note:')) {
              return <p key={i} className="text-sm italic text-emerald-accent/60 my-6 bg-forest/40 p-4 border-l-4 border-emerald-accent rounded-r-xl">{line.trim()}</p>;
            }
            return line.trim() ? <p key={i} className="my-4 leading-relaxed">{line.trim()}</p> : null;
          })}
        </div>
      </motion.div>

      {/* Consult CTA */}
      <div className="mt-12 text-center bg-forest border border-white/5 p-10 rounded-[32px]">
        <h3 className="text-2xl font-display font-bold text-cream mb-2">Need Personalized Care?</h3>
        <p className="text-emerald-accent/60 mb-6 max-w-lg mx-auto">Connect with a verified Ayurvedic doctor to get a customized treatment plan for your specific health goals.</p>
        <Link to="/doctors" className="inline-block bg-emerald-accent text-forest px-8 py-4 rounded-2xl font-bold hover:bg-emerald-accent/90 transition-colors shadow-lg shadow-emerald-accent/20">
          Book a ₹1 Consultation
        </Link>
      </div>

      {/* Related Guides — full image cards */}
      {relatedIds.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-14"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-emerald-accent/50 px-5 py-2 rounded-full border border-white/5 bg-forest/70 whitespace-nowrap">
              Continue Your Journey
            </span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <h2 className="text-3xl font-display font-bold text-cream text-center mb-8">
            Explore Related Guides
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedIds.map((relId) => {
              const relTopic = TOPIC_CONTENT[relId];
              const relMeta = TOPIC_META[relId];
              if (!relTopic || !relMeta) return null;
              const RelIcon = relTopic.icon;
              return (
                <Link
                  key={relId}
                  to={`/topic/${relId}`}
                  className={`group bg-moss/20 border ${relMeta.borderCls} rounded-[28px] overflow-hidden hover:-translate-y-2 transition-all duration-300 flex flex-col shadow-xl`}
                >
                  {/* Image */}
                  {relTopic.image ? (
                    <div className="relative h-44 w-full overflow-hidden shrink-0">
                      <img
                        src={relTopic.image}
                        alt={relTopic.imageAlt || relTopic.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/30 to-transparent" />
                      <span className={`absolute top-3 left-3 text-xs font-bold uppercase tracking-widest backdrop-blur-sm px-2.5 py-1 rounded-full border ${relMeta.iconBg}`}>
                        <span className={relMeta.colorCls}>{relTopic.dosha}</span>
                      </span>
                    </div>
                  ) : (
                    <div className={`h-20 w-full ${relMeta.iconBg} flex items-center justify-center`}>
                      <RelIcon className={`w-10 h-10 ${relMeta.colorCls} opacity-40`} />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className={`w-10 h-10 ${relMeta.iconBg} border rounded-xl flex items-center justify-center mb-3 shrink-0`}>
                      <RelIcon className={`w-5 h-5 ${relMeta.colorCls}`} />
                    </div>
                    <h3 className="font-bold text-base text-cream leading-snug mb-1">{relTopic.title}</h3>
                    <p className="text-xs text-cream/50 leading-relaxed flex-1">{relMeta.shortDesc}</p>
                    <span className={`text-sm font-bold ${relMeta.colorCls} flex items-center gap-1.5 mt-4`}>
                      Read Full Guide <ChevronRight size={14} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
