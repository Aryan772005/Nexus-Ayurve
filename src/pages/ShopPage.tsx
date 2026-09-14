import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Star, ExternalLink, Search, Filter, X, Check, Minus, Plus, Package, Truck, Shield, Activity } from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc, onSnapshot, addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface Medicine {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  description: string;
  benefits: string[];
  dosage: string;
  link: string;
  badge?: string;
}

const MEDICINES: Medicine[] = [
  {
    id: 1,
    name: "Ashwagandha KSM-66 Capsules",
    brand: "Himalaya Wellness",
    price: 299,
    originalPrice: 450,
    image: "/med-ashwagandha.png",
    rating: 4.7,
    reviews: 12840,
    category: "Stress & Energy",
    description: "Pure KSM-66 Ashwagandha root extract for stress relief, improved energy levels, and enhanced vitality. Clinically tested formula.",
    benefits: ["Reduces stress & anxiety", "Boosts stamina", "Improves sleep quality"],
    dosage: "1 capsule twice daily after meals",
    link: "https://www.1mg.com/search/all?name=ashwagandha",
    badge: "Bestseller"
  },
  {
    id: 2,
    name: "Triphala Tablets",
    brand: "Dabur",
    price: 210,
    originalPrice: 320,
    image: "/med-triphala.png",
    rating: 4.5,
    reviews: 8920,
    category: "Digestion",
    description: "Traditional Ayurvedic formula combining Amla, Haritaki & Bibhitaki for complete digestive wellness and natural detoxification.",
    benefits: ["Improves digestion", "Natural detox", "Supports gut health"],
    dosage: "2 tablets before bedtime with warm water",
    link: "https://www.1mg.com/search/all?name=triphala" },
  {
    id: 3,
    name: "Chyawanprash — Immunity Booster",
    brand: "Dabur",
    price: 350,
    originalPrice: 499,
    image: "/med-chyawanprash.png",
    rating: 4.8,
    reviews: 25600,
    category: "Immunity",
    description: "India's #1 Chyawanprash with 40+ Ayurvedic herbs including Amla. Clinically proven to strengthen immunity 3x more.",
    benefits: ["3x stronger immunity", "Rich in Vitamin C", "All-age wellness"],
    dosage: "1–2 teaspoons daily with warm milk",
    link: "https://www.1mg.com/search/all?name=chyawanprash",
    badge: "Most Popular"
  },
  {
    id: 4,
    name: "Brahmi Memory Capsules",
    brand: "Himalaya",
    price: 245,
    originalPrice: 380,
    image: "/med-brahmi.png",
    rating: 4.6,
    reviews: 6530,
    category: "Brain Health",
    description: "Brahmi (Bacopa Monnieri) capsules to enhance memory, focus, and cognitive function. Ideal for students and professionals.",
    benefits: ["Sharpens memory", "Improves concentration", "Reduces mental fatigue"],
    dosage: "1 capsule twice daily after meals",
    link: "https://www.1mg.com/search/all?name=brahmi" },
  {
    id: 5,
    name: "Tulsi Drops — Holy Basil Extract",
    brand: "Organic India",
    price: 220,
    originalPrice: 350,
    image: "/med-tulsi.png",
    rating: 4.6,
    reviews: 9410,
    category: "Immunity",
    description: "Pure Tulsi extract drops for daily immunity support. Made from 5 varieties of sacred Tulsi grown organically in India.",
    benefits: ["Daily immunity boost", "Respiratory health", "Natural antioxidant"],
    dosage: "5 drops in tea or warm water, twice daily",
    link: "https://www.1mg.com/search/all?name=tulsi+drops" },
  {
    id: 6,
    name: "Shilajit Gold Resin",
    brand: "Zandu",
    price: 399,
    originalPrice: 599,
    image: "/med-shilajit.png",
    rating: 4.4,
    reviews: 4820,
    category: "Stress & Energy",
    description: "Himalayan Shilajit Gold with Swarna Bhasma for enhanced vitality, strength, and stamina. 100% pure lab-tested resin.",
    benefits: ["Boosts energy & stamina", "Enhances vitality", "Anti-aging properties"],
    dosage: "Pea-sized amount with warm milk, once daily",
    link: "https://www.1mg.com/search/all?name=shilajit",
    badge: "Premium"
  },
  {
    id: 7,
    name: "Turmeric Curcumin Capsules",
    brand: "Himalaya",
    price: 275,
    originalPrice: 400,
    image: "/med-turmeric.png",
    rating: 4.5,
    reviews: 7650,
    category: "Joint & Pain",
    description: "High-potency Curcumin extract with Piperine for maximum absorption. Powerful natural anti-inflammatory for joint health.",
    benefits: ["Joint pain relief", "Anti-inflammatory", "Antioxidant support"],
    dosage: "1 capsule twice daily after meals",
    link: "https://www.1mg.com/search/all?name=turmeric+curcumin" },
  {
    id: 8,
    name: "Neem Capsules — Skin & Detox",
    brand: "Organic India",
    price: 230,
    originalPrice: 340,
    image: "/med-neem.png",
    rating: 4.3,
    reviews: 5120,
    category: "Skin & Detox",
    description: "Pure Neem leaf extract capsules for clear skin, blood purification, and natural detoxification. Certified organic.",
    benefits: ["Clear skin", "Blood purification", "Natural detox"],
    dosage: "1 capsule twice daily before meals",
    link: "https://www.1mg.com/search/all?name=neem+capsules" },
];

const CATEGORIES = ["All", "Stress & Energy", "Immunity", "Digestion", "Brain Health", "Joint & Pain", "Skin & Detox"];

interface CartItem {
  medicine: Medicine;
  qty: number;
}

export default function ShopPage({ user, onLogin }: { user: FirebaseUser | null, onLogin: () => void }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedMed, setSelectedMed] = useState<Medicine | null>(null);
  const [addedId, setAddedId] = useState<number | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutProcessing, setCheckoutProcessing] = useState(false);
  const [orderSaved, setOrderSaved] = useState(false);

  useEffect(() => {
    if (!user) {
      setCart([]);
      return;
    }
    const unsub = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
      if (docSnap.exists() && docSnap.data().cart) {
        setCart(docSnap.data().cart);
      } else {
        setCart([]);
      }
    });
    return unsub;
  }, [user]);

  const saveCartToDb = async (newCart: CartItem[]) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'users', user.uid), { cart: newCart }, { merge: true });
    } catch (err) {
      console.error("Failed to save cart to Firebase", err);
    }
  };

  const filtered = MEDICINES.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase())
      || m.brand.toLowerCase().includes(search.toLowerCase())
      || m.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || m.category === category;
    return matchSearch && matchCat;
  });

  const addToCart = (med: Medicine) => {
    if (!user) {
      onLogin();
      return;
    }
    const newCart = [...cart];
    const existing = newCart.find(c => c.medicine.id === med.id);
    if (existing) {
      existing.qty += 1;
    } else {
      newCart.push({ medicine: med, qty: 1 });
    }
    setCart(newCart);
    saveCartToDb(newCart);

    setAddedId(med.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  const updateQty = (id: number, delta: number) => {
    if (!user) return;
    const newCart = cart.map(c =>
      c.medicine.id === id ? { ...c, qty: Math.max(0, c.qty + delta) } : c
    ).filter(c => c.qty > 0);
    setCart(newCart);
    saveCartToDb(newCart);
  };

  const cartTotal = cart.reduce((sum, c) => sum + c.medicine.price * c.qty, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);

  const handleCheckout = () => {
    if (!user) { onLogin(); return; }
    if (cart.length > 0) setShowCheckoutModal(true);
  };

  const handleConfirmCheckout = async () => {
    if (!user || cart.length === 0) return;
    setCheckoutProcessing(true);
    try {
      // Save real order to Firestore
      await addDoc(collection(db, 'orders'), {
        userId: user.uid,
        createdAt: new Date().toISOString(),
        status: 'ordered',
        total: cartTotal,
        items: cart.map(c => ({
          name: c.medicine.name,
          brand: c.medicine.brand,
          qty: c.qty,
          price: c.medicine.price })) });
      // Clear cart in Firestore
      await setDoc(doc(db, 'users', user.uid), { cart: [] }, { merge: true });
      setCart([]);
      setOrderSaved(true);
      setCheckoutProcessing(false);
      // Open 1mg after a short delay
      setTimeout(() => {
        const searchTerms = cart.map(c => c.medicine.name.split(' ')[0]).join('+');
        window.open(`https://www.1mg.com/search/all?name=${searchTerms}`, '_blank');
        setShowCheckoutModal(false);
        setOrderSaved(false);
      }, 1800);
    } catch (err) {
      console.error('Order save failed:', err);
      setCheckoutProcessing(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-10 md:pt-24 md:pb-20 px-4 md:px-6 relative overflow-hidden">
      <div className="fixed inset-0 -z-10 bg-cover bg-center bg-scroll bg-no-repeat" style={{ backgroundImage: "url('/bg-page-shop.png')" }}>
        <div className="absolute inset-0 page-bg-overlay" />
      </div>

      {/* ── Checkout Confirmation Modal ── */}
      <AnimatePresence>
        {showCheckoutModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[99999]"
              onClick={() => { if (!checkoutProcessing) setShowCheckoutModal(false); }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 40 }}
              transition={{ type: 'spring', damping: 22, stiffness: 280 }}
              className="fixed inset-0 z-[100000] flex items-center justify-center p-4"
            >
              <div
                style={{
                  background: 'linear-gradient(145deg, #1b4332 0%, #0f2d1e 100%)',
                  border: '1px solid rgba(52,211,153,0.25)',
                  borderRadius: '24px',
                  padding: '36px 28px',
                  maxWidth: '420px',
                  width: '100%',
                  boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}
                onClick={e => e.stopPropagation()}
              >
                {orderSaved ? (
                  <div className="text-center">
                    <div style={{
                      width: 72, height: 72, borderRadius: '50%',
                      background: 'rgba(52,211,153,0.15)', border: '2px solid rgba(52,211,153,0.4)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 16px' }}>
                      <Check style={{ color: '#34d399', width: 36, height: 36 }} />
                    </div>
                    <h2 style={{ fontSize: 20, fontWeight: 800, color: '#ecfdf5', marginBottom: 8 }}>Order Recorded! 🎉</h2>
                    <p style={{ color: 'rgba(52,211,153,0.7)', fontSize: 13 }}>
                      Saved to your dashboard. Opening 1mg.com to complete purchase…
                    </p>
                  </div>
                ) : (
                  <>
                    <h2 style={{ fontSize: 20, fontWeight: 800, color: '#ecfdf5', marginBottom: 4 }}>Confirm Order</h2>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 20 }}>
                      This will save the order to your Nexus Ayurve dashboard and open 1mg.com for payment.
                    </p>
                    {/* Items summary */}
                    <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 12, padding: 14, marginBottom: 16, border: '1px solid rgba(52,211,153,0.1)' }}>
                      {cart.map(item => (
                        <div key={item.medicine.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                          <span style={{ color: 'rgba(255,255,255,0.7)' }}>{item.medicine.name} ×{item.qty}</span>
                          <span style={{ color: '#ecfdf5', fontWeight: 700 }}>₹{item.medicine.price * item.qty}</span>
                        </div>
                      ))}
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(52,211,153,0.15)' }}>
                        <span style={{ color: 'rgba(52,211,153,0.8)', fontSize: 13, fontWeight: 700 }}>Total</span>
                        <span style={{ color: '#34d399', fontSize: 16, fontWeight: 800 }}>₹{cartTotal}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button
                        onClick={() => setShowCheckoutModal(false)}
                        style={{
                          flex: 1, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)',
                          border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '11px',
                          fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleConfirmCheckout}
                        disabled={checkoutProcessing}
                        style={{
                          flex: 2,
                          background: checkoutProcessing ? 'rgba(52,211,153,0.4)' : 'linear-gradient(135deg, #34d399, #059669)',
                          color: '#052e16', border: 'none', borderRadius: 12, padding: '11px',
                          fontSize: 13, fontWeight: 800, cursor: checkoutProcessing ? 'not-allowed' : 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                      >
                        {checkoutProcessing ? 'Saving Order…' : '✓ Confirm & Buy on 1mg'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>


      {/* Static background glow — no infinite animation */}
      <div
        className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-emerald-accent/5 rounded-full blur-[100px] pointer-events-none"
      />

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 md:mb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6 md:mb-10">
          <div className="inline-flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-emerald-accent/10 text-emerald-accent text-[10px] md:text-sm font-bold mb-4 md:mb-6 border border-emerald-accent/20">
            <Package size={14} className="md:w-4 md:h-4" /> Ayurvedic Medicine Shop
          </div>
          <h1 className="text-3xl md:text-6xl font-display font-bold text-gradient mb-3 md:mb-4">
            Shop Ayurvedic Medicines
          </h1>
          <p className="text-xs md:text-lg text-cream/60 max-w-2xl mx-auto px-2">
            Curated collection of certified Ayurvedic medicines from trusted Indian brands.
            Buy directly from our trusted partners with safe delivery to your doorstep.
          </p>
        </motion.div>

        {/* Trust badges */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex flex-wrap items-center justify-center gap-3 md:gap-6 mb-6 md:mb-12 px-2">
          {[
            { icon: <Shield size={16} className="md:w-[18px] md:h-[18px]" />, text: "100% Authentic" },
            { icon: <Truck size={16} className="md:w-[18px] md:h-[18px]" />, text: "Fast Delivery" },
            { icon: <Package size={16} className="md:w-[18px] md:h-[18px]" />, text: "Secure Packaging" },
            { icon: <Star size={16} className="md:w-[18px] md:h-[18px]" />, text: "Top Rated" },
          ].map((b, i) => (
            <div key={i} className="flex items-center gap-1.5 md:gap-2 text-emerald-accent/70 text-[10px] md:text-sm font-semibold">
              {b.icon} {b.text}
            </div>
          ))}
        </motion.div>

        {/* Search & Filter Bar */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center mb-6 md:mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 md:left-4 top-1/2 -translate-y-1/2 text-emerald-accent/40 w-[16px] h-[16px] md:w-[20px] md:h-[20px]" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search medicines, brands..."
              className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl bg-moss/40 border border-white/10 text-cream text-[13px] md:text-base placeholder:text-cream/30 focus:border-emerald-accent/40 focus:outline-none transition-colors"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${category === cat
                  ? 'bg-emerald-accent text-forest shadow-lg shadow-emerald-accent/20'
                  : 'bg-moss/40 text-cream/60 border border-white/5 hover:border-emerald-accent/30 hover:text-cream'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
          {filtered.map((med, i) => (
            <motion.div
              key={med.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="group bg-moss/30 backdrop-blur-xl border border-white/5 rounded-[20px] md:rounded-3xl overflow-hidden hover:border-emerald-accent/25 transition-all hover:-translate-y-1 md:shadow-xl shadow-black/10 flex flex-col"
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-forest/60 cursor-pointer" onClick={() => setSelectedMed(med)}>
                <img
                  src={med.image}
                  alt={med.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-transparent to-transparent" />
                {med.badge && (
                  <div className="absolute top-2 left-2 md:top-3 md:left-3 px-2 md:px-3 py-0.5 md:py-1 rounded-full bg-emerald-accent text-forest text-[9px] md:text-xs font-bold shadow-lg">
                    {med.badge}
                  </div>
                )}
                <div className="absolute top-2 right-2 md:top-3 md:right-3 flex items-center gap-1 px-1.5 md:px-2.5 py-0.5 md:py-1 rounded-full bg-forest/80 backdrop-blur-sm border border-white/10">
                  <Star size={10} className="md:w-[12px] md:h-[12px] text-yellow-400 fill-yellow-400" />
                  <span className="text-cream text-[10px] md:text-xs font-bold">{med.rating}</span>
                </div>
              </div>

              {/* Info */}
              <div className="p-3 md:p-5 flex-1 flex flex-col">
                <p className="text-emerald-accent/50 text-[9px] md:text-xs font-semibold uppercase tracking-wider mb-1">{med.brand}</p>
                <h3 className="text-cream font-bold text-[11px] md:text-base mb-1 md:mb-1.5 leading-snug cursor-pointer hover:text-emerald-accent transition-colors truncate md:whitespace-normal" onClick={() => setSelectedMed(med)}>
                  {med.name}
                </h3>
                <p className="text-cream/40 text-[10px] md:text-xs mb-2 md:mb-3 line-clamp-2 md:line-clamp-3 leading-tight">{med.description}</p>

                <div className="mt-auto">
                  <div className="flex items-baseline md:flex-row flex-col sm:flex-row gap-1 sm:gap-2 mb-2 md:mb-3">
                    <span className="text-[15px] md:text-2xl font-display font-bold text-cream">₹{med.price}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] md:text-sm text-cream/30 line-through">₹{med.originalPrice}</span>
                      <span className="text-[8px] md:text-xs font-bold text-emerald-accent bg-emerald-accent/10 px-1.5 py-0.5 rounded-full">
                        {Math.round((1 - med.price / med.originalPrice) * 100)}% OFF
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-1 md:gap-2">
                    <button
                      onClick={() => addToCart(med)}
                      className={`flex-1 py-1.5 md:py-2.5 rounded-lg md:rounded-xl font-bold text-[10px] md:text-sm transition-all flex items-center justify-center gap-1 md:gap-2 ${addedId === med.id
                        ? 'bg-green-500 text-white'
                        : 'bg-emerald-accent text-forest hover:bg-emerald-accent/90 hover:shadow-lg hover:shadow-emerald-accent/20'
                        }`}
                    >
                      {addedId === med.id ? <><Check size={11} className="md:w-[16px] md:h-[16px]" /> Added</> : <><ShoppingCart size={11} className="md:w-[16px] md:h-[16px]" /> Add</>}
                    </button>
                    <a
                      href={med.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 md:p-2.5 rounded-lg md:rounded-xl bg-moss/60 border border-white/10 text-cream/60 hover:text-emerald-accent hover:border-emerald-accent/30 transition-all"
                      title="Buy Now"
                    >
                      <ExternalLink size={13} className="md:w-[16px] md:h-[16px]" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-cream/40">
            <Package size={48} className="mx-auto mb-4 text-emerald-accent/20" />
            <p className="text-xl font-bold">No medicines found</p>
            <p className="text-sm mt-2">Try a different search or category</p>
          </div>
        )}
      </div>

      {/* Info Banner */}
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        className="max-w-5xl mx-auto mt-8 md:mt-16 p-5 md:p-8 rounded-[20px] md:rounded-3xl bg-moss/30 border border-white/5 text-center"
      >
        
        <h3 className="text-lg md:text-xl font-display font-bold text-cream mb-1.5 md:mb-2">Secure & Authentic</h3>
        <p className="text-cream/50 text-[11px] md:text-sm max-w-xl mx-auto leading-relaxed">
          All purchases are securely processed through our certified pharmacy partners.
          We curate the finest Ayurvedic medicines so you get genuine products every time.
        </p>
      </motion.div>

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setShowCart(true)}
          className="fixed bottom-48 left-6 z-40 bg-emerald-accent text-forest w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-accent/30 hover:scale-110 transition-transform"
        >
          <ShoppingCart size={24} />
          <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        </motion.button>
      )}

      {/* Cart Drawer */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowCart(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-forest border-l border-white/10 z-50 flex flex-col shadow-2xl"
            >
              {/* Cart Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-xl font-display font-bold text-cream flex items-center gap-2">
                  <ShoppingCart size={20} className="text-emerald-accent" />
                  Your Cart ({cartCount})
                </h2>
                <button onClick={() => setShowCart(false)} className="text-cream/40 hover:text-cream transition-colors">
                  <X size={24} />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-16 text-cream/30">
                    <ShoppingCart size={48} className="mx-auto mb-4" />
                    <p className="font-bold">Your cart is empty</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.medicine.id} className="flex gap-4 bg-moss/30 rounded-2xl p-4 border border-white/5">
                      <img src={item.medicine.image} alt="" className="w-16 h-16 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-cream text-sm font-bold truncate">{item.medicine.name}</h4>
                        <p className="text-emerald-accent/50 text-xs">{item.medicine.brand}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-cream font-bold">₹{item.medicine.price * item.qty}</span>
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateQty(item.medicine.id, -1)}
                              className="w-7 h-7 rounded-lg bg-forest border border-white/10 flex items-center justify-center text-cream/60 hover:text-cream transition-colors">
                              <Minus size={14} />
                            </button>
                            <span className="text-cream text-sm font-bold w-6 text-center">{item.qty}</span>
                            <button onClick={() => updateQty(item.medicine.id, 1)}
                              className="w-7 h-7 rounded-lg bg-forest border border-white/10 flex items-center justify-center text-cream/60 hover:text-cream transition-colors">
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-white/10 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-cream/60 text-sm">Subtotal</span>
                    <span className="text-2xl font-display font-bold text-cream">₹{cartTotal}</span>
                  </div>
                  <p className="text-emerald-accent/40 text-xs text-center">Secure checkout — Free delivery on orders above ₹499</p>
                  <button
                    onClick={handleCheckout}
                    className="w-full py-4 rounded-2xl bg-emerald-accent text-forest font-bold text-lg hover:bg-emerald-accent/90 transition-all shadow-lg shadow-emerald-accent/20 flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout <ExternalLink size={18} />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedMed && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedMed(null)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[680px] md:max-h-[85vh] bg-forest border border-white/10 rounded-3xl z-50 overflow-y-auto shadow-2xl"
            >
              <button
                onClick={() => setSelectedMed(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-forest/80 backdrop-blur-sm border border-white/10 flex items-center justify-center text-cream/60 hover:text-cream transition-colors"
              >
                <X size={20} />
              </button>

              <div className="md:flex">
                <div className="md:w-1/2 aspect-square relative">
                  <img src={selectedMed.image} alt={selectedMed.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest via-transparent to-transparent md:bg-gradient-to-r" />
                  {selectedMed.badge && (
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-emerald-accent text-forest text-xs font-bold">
                      {selectedMed.badge}
                    </span>
                  )}
                </div>
                <div className="p-6 md:p-8 md:w-1/2 flex flex-col">
                  <p className="text-emerald-accent/60 text-xs font-semibold uppercase tracking-wider mb-1">{selectedMed.brand}</p>
                  <h2 className="text-2xl font-display font-bold text-cream mb-2">{selectedMed.name}</h2>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-cream text-sm font-bold">{selectedMed.rating}</span>
                    </div>
                    <span className="text-cream/30 text-xs">({selectedMed.reviews.toLocaleString()} reviews)</span>
                  </div>
                  <p className="text-cream/50 text-sm mb-4 leading-relaxed">{selectedMed.description}</p>

                  <div className="mb-4">
                    <p className="text-cream/60 text-xs font-bold uppercase tracking-wider mb-2">Benefits</p>
                    <div className="space-y-1.5">
                      {selectedMed.benefits.map((b, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-cream/70">
                          <Check size={14} className="text-emerald-accent shrink-0" /> {b}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6 p-3 rounded-xl bg-moss/40 border border-white/5">
                    <p className="text-cream/40 text-xs font-bold uppercase tracking-wider mb-1">Dosage</p>
                    <p className="text-cream/80 text-sm">{selectedMed.dosage}</p>
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-3xl font-display font-bold text-cream">₹{selectedMed.price}</span>
                      <span className="text-base text-cream/30 line-through">₹{selectedMed.originalPrice}</span>
                      <span className="text-xs font-bold text-emerald-accent bg-emerald-accent/10 px-2 py-0.5 rounded-full">
                        {Math.round((1 - selectedMed.price / selectedMed.originalPrice) * 100)}% OFF
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => { addToCart(selectedMed); setSelectedMed(null); }}
                        className="flex-1 py-3 rounded-xl bg-emerald-accent text-forest font-bold text-sm hover:bg-emerald-accent/90 transition-all flex items-center justify-center gap-2"
                      >
                        <ShoppingCart size={16} /> Add to Cart
                      </button>
                      <a
                        href={selectedMed.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-3 px-5 rounded-xl bg-moss/60 border border-white/10 text-cream font-bold text-sm hover:border-emerald-accent/30 transition-all flex items-center gap-2"
                      >
                        <ExternalLink size={16} /> Buy Now
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
