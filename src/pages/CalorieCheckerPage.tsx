import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Utensils, Zap, Flame, Info, ChevronRight, X, Activity, Scale, Heart, Apple, Coffee, Pizza, Cherry as CherryIcon } from 'lucide-react';

const indianFoods = [
  { name: "Dal Makhani (1 bowl)", cal: 300, protein: 12, carbs: 35, fats: 15, type: "Heavy (Kapha increasing)", nature: "Warming" },
  { name: "Chapati (1 piece)", cal: 70, protein: 3, carbs: 15, fats: 1, type: "Balanced (Tridoshic)", nature: "Neutral" },
  { name: "Palak Paneer (1 bowl)", cal: 280, protein: 14, carbs: 12, fats: 22, type: "Cooling (Pitta pacifying)", nature: "Cooling" },
  { name: "Khichdi (1 bowl)", cal: 200, protein: 8, carbs: 32, fats: 5, type: "Healing (Tridoshic)", nature: "Nourishing" },
  { name: "Rajma Chawal (1 plate)", cal: 420, protein: 15, carbs: 65, fats: 12, type: "Heavy (Kapha increasing)", nature: "Grounding" },
  { name: "Chole Bhature (1 plate)", cal: 550, protein: 12, carbs: 70, fats: 25, type: "Heavy (Kapha & Pitta)", nature: "Heating" },
  { name: "Idli (2 pieces)", cal: 120, protein: 4, carbs: 24, fats: 0, type: "Light (Vata pacifying)", nature: "Refreshing" },
  { name: "Dosa (1 plain)", cal: 130, protein: 4, carbs: 26, fats: 2, type: "Light (Tridoshic)", nature: "Light" },
  { name: "Biryani Chicken (1 plate)", cal: 500, protein: 22, carbs: 55, fats: 20, type: "Hot (Pitta increasing)", nature: "Heating" },
  { name: "Paneer Tikka (6 pieces)", cal: 320, protein: 18, carbs: 8, fats: 24, type: "Heavy (Kapha increasing)", nature: "Nourishing" },
  { name: "Poha (1 bowl)", cal: 180, protein: 4, carbs: 35, fats: 4, type: "Light (Vata pacifying)", nature: "Dry" },
  { name: "Samosa (1 piece)", cal: 260, protein: 4, carbs: 24, fats: 18, type: "Heavy (Kapha & Pitta)", nature: "Heavy" },
  { name: "Lassi Sweet (1 glass)", cal: 180, protein: 6, carbs: 28, fats: 5, type: "Cooling (Pitta pacifying)", nature: "Cooling" },
  { name: "Roti (1 piece)", cal: 60, protein: 2, carbs: 13, fats: 0.5, type: "Balanced (Tridoshic)", nature: "Neutral" },
  { name: "Rice Steamed (1 bowl)", cal: 200, protein: 4, carbs: 45, fats: 0, type: "Cooling (Pitta pacifying)", nature: "Cooling" },
];

export default function CalorieCheckerPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFoods, setFilteredFoods] = useState(indianFoods);
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [cart, setCart] = useState<{item: any, quantity: number}[]>([]);

  useEffect(() => {
    const results = indianFoods.filter(food => 
      food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFoods(results);
  }, [searchTerm]);

  const addToCart = (food: any) => {
    const existing = cart.find(c => c.item.name === food.name);
    if (existing) {
      setCart(cart.map(c => c.item.name === food.name ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { item: food, quantity: 1 }]);
    }
  };

  const totalCalories = cart.reduce((acc, curr) => acc + (curr.item.cal * curr.quantity), 0);
  const totalProtein = cart.reduce((acc, curr) => acc + (curr.item.protein * curr.quantity), 0);

  return (
    <div className="min-h-screen pt-24 pb-20 bg-forest relative overflow-hidden">
      {/* Dynamic background */}
      <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] rounded-full filter blur-[100px] opacity-10 pointer-events-none bg-emerald-accent" />
      <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] rounded-full filter blur-[120px] opacity-[0.05] pointer-events-none bg-amber-500" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <header className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 bg-emerald-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-accent/20 shadow-lg shadow-emerald-accent/10"
          >
            <Utensils className="text-emerald-accent" size={40} />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-display font-bold text-cream mb-4">Calorie <span className="text-emerald-accent">Checker</span></h1>
          <p className="text-emerald-accent/60 text-lg max-w-2xl mx-auto font-medium">Track your meal analytics with Ayurvedic wisdom. Search 50+ common Indian dishes for instant nutritional insights.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* SEARCH & RECENT */}
          <div className="lg:col-span-8 space-y-8">
            <div className="relative">
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search food (e.g. Biryani, Dal, Poha...)"
                className="w-full bg-forest/50 border border-white/10 rounded-[30px] p-6 pl-14 text-cream focus:border-emerald-accent focus:ring-4 ring-emerald-accent/10 outline-none transition-all text-lg shadow-xl backdrop-blur-md"
              />
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-accent" size={24} />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-white"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence>
                {filteredFoods.map((food, i) => (
                  <motion.div 
                    key={food.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-moss/30 border border-white/5 rounded-3xl p-6 hover:border-emerald-accent/30 transition-all group flex flex-col justify-between"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-cream group-hover:text-emerald-accent transition-colors">{food.name}</h3>
                        <p className="text-xs text-emerald-accent/60 font-bold uppercase tracking-widest mt-1">{food.type}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-2xl font-display font-bold text-cream">{food.cal}</span>
                        <span className="text-[10px] text-emerald-accent/40 uppercase font-bold tracking-tighter">kcal</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 mb-6">
                      <div className="flex-1 bg-forest/40 rounded-xl p-3 text-center border border-white/5">
                        <p className="text-[10px] text-emerald-accent/40 uppercase font-bold mb-1">Protein</p>
                        <p className="text-sm font-bold text-cream">{food.protein}g</p>
                      </div>
                      <div className="flex-1 bg-forest/40 rounded-xl p-3 text-center border border-white/5">
                        <p className="text-[10px] text-amber-500/40 uppercase font-bold mb-1">Carbs</p>
                        <p className="text-sm font-bold text-cream">{food.carbs}g</p>
                      </div>
                      <div className="flex-1 bg-forest/40 rounded-xl p-3 text-center border border-white/5">
                        <p className="text-[10px] text-rose-400/40 uppercase font-bold mb-1">Fats</p>
                        <p className="text-sm font-bold text-cream">{food.fats}g</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => addToCart(food)}
                      className="w-full bg-emerald-accent text-forest font-bold py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-white transition-all shadow-lg shadow-emerald-accent/5 active:scale-95"
                    >
                      <Zap size={16} /> Add to Meal
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* MEAL OVERVIEW (SIDEBAR) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-32">
            <div className="bg-moss/40 backdrop-blur-xl border border-white/10 rounded-[40px] p-8 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Flame size={120} />
              </div>
              
              <h2 className="text-2xl font-display font-bold text-cream mb-6 flex items-center gap-2">
                <Flame size={24} className="text-amber-500" /> Current Meal
              </h2>

              <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-emerald-accent/30 text-sm italic">No items added to your meal yet.</p>
                  </div>
                ) : (
                  cart.map((c, i) => (
                    <div key={i} className="flex justify-between items-center bg-forest/30 p-4 rounded-2xl border border-white/5">
                      <div>
                        <p className="text-cream font-bold text-sm">{c.item.name}</p>
                        <p className="text-emerald-accent/40 text-[10px] font-bold">Qty: {c.quantity} × {c.item.cal} kcal</p>
                      </div>
                      <button 
                        onClick={() => setCart(cart.filter((_, idx) => idx !== i))}
                        className="text-white/20 hover:text-rose-400"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-white/10 pt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-emerald-accent/60 font-bold uppercase tracking-widest text-xs">Total Calories</span>
                  <span className="text-4xl font-display font-bold text-white">{totalCalories} <span className="text-xs text-white/40">kcal</span></span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-emerald-accent/60 font-bold uppercase tracking-widest text-xs">Total Protein</span>
                  <span className="text-xl font-bold text-amber-500">{totalProtein}g</span>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                 <button 
                  disabled={cart.length === 0}
                  className="w-full bg-gradient-to-r from-emerald-accent to-teal-400 text-forest font-bold py-4 rounded-2xl shadow-xl hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Save to Health History
                </button>
              </div>
            </div>

            {/* AYURVEDIC TIP BOX */}
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               whileHover={{ y: -5 }}
               className="bg-blue-600/10 border border-blue-500/20 rounded-[30px] p-6 relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 p-3 text-blue-500/20">
                  <Info size={40} />
               </div>
               <h3 className="text-blue-400 font-bold text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
                   Ayurvedic Tip
               </h3>
               <p className="text-blue-100/70 text-sm leading-relaxed">
                  Avoid drinking chilled water during meals as it douses the digestive fire (**Agni**). Opt for lukewarm water or herbal tea.
               </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
