import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Star, ShieldCheck, Truck, Sparkles,
  FileText, Stethoscope, ShoppingBag, Activity, Brain, Camera,
  CheckCircle2, ArrowRight, Clock, Award, Users, HeartHandshake,
  Percent, AlertCircle, PhoneCall, Plus, Minus, Check, ExternalLink
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { PRODUCTS, CATEGORIES_WITH_IMAGES, Product } from '../data/products';
import { LAB_PACKAGES, LabPackage } from '../data/labTests';
import { doctors } from '../data/doctors';

export default function HomePage({ onLogin, user }: { onLogin: () => void; user: any }) {
  const navigate = useNavigate();
  const { addToCart, updateQty, cart, openPrescription, city, pincode } = useCart();

  // Hero Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      id: 1,
      badge: "Pure & Handcrafted Formulation",
      title: "Authentic Ayurvedic Medicines for Modern Living",
      subtitle: "Pure Himalayan Shilajit, KSM-66 Ashwagandha, Amla Chyawanprash & Saffron Oil. 100% ethically wildcrafted.",
      offer: "Flat 25% OFF with code AYUR25",
      image: "/images/hero-banner-ayurveda.jpg",
      primaryCta: { label: "Shop Herbal Pharmacy", link: "/shop" },
      secondaryCta: { label: "Order with Prescription", action: openPrescription }
    },
    {
      id: 2,
      badge: "Verified BAMS Doctors",
      title: "Consult Certified Ayurvedic Physicians Online",
      subtitle: "Get personalized herbal remedies, dosha balance analysis & diet plans starting @ just ₹1.",
      offer: "Instant Audio/Video Consultation",
      image: "/images/banner-doctor-consult.jpg",
      primaryCta: { label: "Consult Doctors for ₹1", link: "/doctors" },
      secondaryCta: { label: "View Specialists", link: "/doctors" }
    },
    {
      id: 3,
      badge: "NABL Certified Labs",
      title: "Ayur-Prakriti Full Body Health Screening",
      subtitle: "Comprehensive 64 vital parameters including Liver, Kidney, Thyroid, CBC & Dosha risk assessment.",
      offer: "Free Home Sample Collection · Report in 24 Hrs",
      image: "/images/banner-lab-tests.jpg",
      primaryCta: { label: "Book Health Package @ ₹999", link: "/shop?filter=lab-tests" },
      secondaryCta: { label: "Compare Tests", link: "/shop?filter=lab-tests" }
    },
    {
      id: 4,
      badge: "Doorstep Pharmacy Delivery",
      title: "Quick Buy: Order Ayurvedic Medicines with Prescription",
      subtitle: "Simply upload your prescription and our registered Ayurvedic Vaidyas will assemble and deliver your medicines.",
      offer: "Free Delivery Above ₹499",
      image: "/images/banner-prescription.jpg",
      primaryCta: { label: "Upload Prescription Now", action: openPrescription },
      secondaryCta: { label: "Explore Store", link: "/shop" }
    }
  ];

  // Auto rotate hero carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  // Helper to check if product is in cart
  const getProductCartQty = (id: number) => {
    const found = cart.find((item) => item.product.id === id);
    return found ? found.qty : 0;
  };

  // Quick Services Tiles (1mg Signature)
  const quickServices = [
    { label: "Order Medicines", icon: ShoppingBag, color: "bg-emerald-500", text: "100% Genuine", link: "/shop" },
    { label: "Lab Tests & Scans", icon: Activity, color: "bg-sky-500", text: "Home Sample Pickup", link: "/shop?filter=lab-tests" },
    { label: "Consult Doctors", icon: Stethoscope, color: "bg-amber-500", text: "Starting @ ₹1", link: "/doctors" },
    { label: "AyurCoach AI", icon: Sparkles, color: "bg-orange-500", text: "Food & Dosha AI", link: "/ayurcoach" },
    { label: "Meal Analyser", icon: Camera, color: "bg-teal-500", text: "Instant Plate Scan", link: "/meal-analysis" },
    { label: "Upload Rx", icon: FileText, color: "bg-emerald-700", text: "Quick Delivery", action: openPrescription }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-slate-900">
      
      {/* ══════════════════════════════════════════════
          1. HERO CAROUSEL BANNER (Tata 1mg Style)
      ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
          <div className="relative rounded-3xl overflow-hidden shadow-md border border-slate-200 aspect-[16/9] sm:aspect-[21/9] md:aspect-[24/9] min-h-[360px] md:min-h-[420px] bg-slate-950">
            <AnimatePresence mode="wait">
              {heroSlides.map((slide, idx) => {
                if (idx !== currentSlide) return null;
                return (
                  <motion.div
                    key={slide.id}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0"
                  >
                    {/* Real Photography Background */}
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover object-center"
                    />

                    {/* Gradient Overlay for Crisp Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent sm:to-slate-950/15" />

                    {/* Banner Content */}
                    <div className="relative h-full flex flex-col justify-center px-6 sm:px-12 md:px-16 max-w-2xl text-white z-10 space-y-3.5">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold w-fit backdrop-blur-md">
                        <Sparkles size={13} className="text-amber-300" />
                        {slide.badge}
                      </div>

                      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight font-display">
                        {slide.title}
                      </h2>

                      <p className="text-xs sm:text-sm md:text-base text-slate-200 line-clamp-2 max-w-xl">
                        {slide.subtitle}
                      </p>

                      <div className="inline-block px-3 py-1 rounded-lg bg-amber-400/20 border border-amber-300/30 text-amber-300 text-xs font-bold w-fit">
                        {slide.offer}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        {slide.primaryCta.link ? (
                          <Link
                            to={slide.primaryCta.link}
                            className="px-6 py-2.5 sm:py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition shadow-lg shadow-emerald-900/30 active:scale-95"
                          >
                            {slide.primaryCta.label}
                          </Link>
                        ) : (
                          <button
                            onClick={slide.primaryCta.action}
                            className="px-6 py-2.5 sm:py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition shadow-lg shadow-emerald-900/30 active:scale-95"
                          >
                            {slide.primaryCta.label}
                          </button>
                        )}

                        {slide.secondaryCta && (
                          slide.secondaryCta.link ? (
                            <Link
                              to={slide.secondaryCta.link}
                              className="px-5 py-2.5 sm:py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm backdrop-blur-md transition"
                            >
                              {slide.secondaryCta.label}
                            </Link>
                          ) : (
                            <button
                              onClick={slide.secondaryCta.action}
                              className="px-5 py-2.5 sm:py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm backdrop-blur-md transition"
                            >
                              {slide.secondaryCta.label}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Carousel Navigation Arrows */}
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/40 hover:bg-slate-900/70 text-white flex items-center justify-center backdrop-blur-sm transition z-20"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/40 hover:bg-slate-900/70 text-white flex items-center justify-center backdrop-blur-sm transition z-20"
            >
              <ChevronRight size={22} />
            </button>

            {/* Carousel Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-2 rounded-full transition-all ${
                    currentSlide === i ? 'w-8 bg-emerald-400' : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          2. QUICK SERVICES STRIP (Tata 1mg Quick Pills)
      ══════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 -mt-2 md:-mt-3 relative z-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickServices.map((service, index) => {
            const Content = (
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-400 hover:-translate-y-0.5 transition-all flex items-center gap-3 cursor-pointer group">
                <div className={`w-11 h-11 rounded-xl ${service.color} text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform`}>
                  <service.icon size={20} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate leading-snug">{service.label}</h4>
                  <p className="text-[10px] text-slate-500 font-medium truncate">{service.text}</p>
                </div>
              </div>
            );

            return service.link ? (
              <Link key={index} to={service.link}>
                {Content}
              </Link>
            ) : (
              <button key={index} onClick={service.action} className="w-full text-left">
                {Content}
              </button>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          3. UPLOAD PRESCRIPTION BANNER (1mg Signature)
      ══════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Background herbal motif */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-3 max-w-xl z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
              <FileText size={14} />
              Quick Order with Prescription
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-display leading-tight">
              Don't have time to search medicines? Just upload your prescription!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Our registered Ayurvedic Vaidyas & pharmacists will verify your prescription, arrange genuine handcrafted formulations, and deliver to <strong className="text-white">{city} ({pincode})</strong>.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-200 pt-1">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-400" /> 100% Genuine Medicines
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-400" /> Free Doctor Verification
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-400" /> Express Doorstep Delivery
              </span>
            </div>
          </div>

          <div className="z-10 flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={openPrescription}
              className="px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm transition shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center gap-2"
            >
              Upload Prescription Now <ArrowRight size={16} />
            </button>
            <Link
              to="/doctors"
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm transition text-center"
            >
              Consult Doctor for ₹1
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          4. SHOP BY CATEGORY (Roundels with Real Photos)
      ══════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
              Shop by Ayurvedic Health Need
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Authentic handcrafted herbal formulations categorised by traditional Chikitsa
            </p>
          </div>
          <Link
            to="/shop"
            className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            View All <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES_WITH_IMAGES.map((cat, i) => (
            <Link
              key={i}
              to={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-emerald-500 hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center group"
            >
              {/* Circular Real Image with Herb */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-emerald-100 p-1 mb-3 group-hover:border-emerald-500 transition-colors shadow-xs bg-slate-50">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug group-hover:text-emerald-700 transition">
                {cat.name}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{cat.desc}</p>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-2">
                {cat.count}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          5. DEALS OF THE DAY / FEATURED MEDICINES (1mg Grid)
      ══════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider">
                Deals of the Day
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock size={13} /> Ends in 8h 42m
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
              Handcrafted Ayurvedic Formulations
            </h3>
          </div>
          <Link
            to="/shop"
            className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            See All Deals <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {PRODUCTS.slice(0, 8).map((product) => {
            const qtyInCart = getProductCartQty(product.id);
            const discountPercent = Math.round(
              ((product.originalPrice - product.price) / product.originalPrice) * 100
            );

            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-emerald-400 transition-all duration-300 flex flex-col justify-between p-3.5 sm:p-4 group relative"
              >
                {/* Badge */}
                {product.badge && (
                  <span className="absolute top-3 left-3 z-10 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow-xs">
                    {product.badge}
                  </span>
                )}

                {/* Product Image */}
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 mb-3 border border-slate-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-[11px] font-bold">
                    <Star size={11} className="text-amber-400 fill-amber-400" />
                    <span>{product.rating}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-1 flex-1">
                  <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                    {product.brand}
                  </p>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-emerald-700 transition">
                    {product.name}
                  </h4>
                  <p className="text-[11px] text-slate-400">{product.packSize}</p>

                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-semibold pt-1">
                    <Truck size={12} />
                    <span>{product.deliveryTime}</span>
                  </div>
                </div>

                {/* Price and Cart Action */}
                <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base sm:text-lg font-bold text-slate-900 font-display">
                        ₹{product.price}
                      </span>
                      <span className="text-[11px] text-slate-400 line-through">
                        ₹{product.originalPrice}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600">
                      {discountPercent}% OFF
                    </span>
                  </div>

                  {/* 1mg Style ADD Button / Quantity Stepper */}
                  {qtyInCart === 0 ? (
                    <button
                      onClick={() => addToCart(product)}
                      className="px-4 py-1.5 rounded-xl border-2 border-emerald-600 text-emerald-700 font-extrabold text-xs hover:bg-emerald-600 hover:text-white transition active:scale-95"
                    >
                      ADD
                    </button>
                  ) : (
                    <div className="flex items-center border border-emerald-600 rounded-xl bg-emerald-50 overflow-hidden">
                      <button
                        onClick={() => updateQty(product.id, qtyInCart - 1)}
                        className="px-2 py-1 text-emerald-800 hover:bg-emerald-200 transition"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="px-2 py-0.5 text-xs font-bold text-emerald-900 bg-white">
                        {qtyInCart}
                      </span>
                      <button
                        onClick={() => updateQty(product.id, qtyInCart + 1)}
                        className="px-2 py-1 text-emerald-800 hover:bg-emerald-200 transition"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          6. POPULAR HEALTH CHECKUPS / LAB TESTS (1mg Style)
      ══════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold mb-2">
                <Activity size={13} />
                NABL & ICMR Certified Diagnostics
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                Popular Health Checkup Packages
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Preventive health packages with 100% Free Home Sample Collection & 24h Digital Reports
              </p>
            </div>
            <Link
              to="/shop?filter=lab-tests"
              className="px-5 py-2.5 rounded-xl border border-sky-300 text-sky-700 hover:bg-sky-50 font-bold text-xs sm:text-sm transition w-fit"
            >
              View All Health Packages
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {LAB_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className="rounded-2xl border border-slate-200 p-5 bg-slate-50/50 hover:bg-white hover:border-sky-400 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {pkg.tag && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md mb-2 inline-block">
                      {pkg.tag}
                    </span>
                  )}
                  <h4 className="text-sm font-bold text-slate-900 leading-snug mb-1">
                    {pkg.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                    {pkg.subtitle}
                  </p>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-100 space-y-1.5 text-xs text-slate-600 mb-3">
                    <p className="font-bold text-emerald-800">Includes {pkg.testsCount} Vital Parameters:</p>
                    <ul className="text-[11px] text-slate-500 space-y-0.5 list-disc pl-4">
                      {pkg.parameters.slice(0, 3).map((param, pi) => (
                        <li key={pi} className="truncate">{param}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1 text-[11px] text-slate-500">
                    <p>🧪 <strong>Sample:</strong> {pkg.sampleType}</p>
                    <p>⚡ <strong>Report:</strong> {pkg.reportTime}</p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-bold text-slate-900 font-display">₹{pkg.price}</span>
                      <span className="text-xs text-slate-400 line-through">₹{pkg.originalPrice}</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600">
                      {Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)}% OFF
                    </span>
                  </div>
                  <Link
                    to="/shop?filter=lab-tests"
                    className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition active:scale-95 shadow-sm shadow-sky-600/20"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          7. TOP AYURVEDIC DOCTORS (1mg Doctor Consult)
      ══════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
              <Stethoscope size={13} />
              Specialist BAMS & MD Ayurveda Practitioners
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
              Consult Top Ayurvedic Doctors Online
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Verified clinical experts with 10+ years experience. Instant video/audio consultations.
            </p>
          </div>
          <Link
            to="/doctors"
            className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            View All Doctors <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {doctors.slice(0, 4).map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-emerald-400 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center gap-3.5 mb-3">
                  <div className="relative">
                    <img
                      src={doc.imageUrl}
                      alt={doc.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-100 group-hover:border-emerald-500 transition shadow-xs"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-0.5">
                      <CheckCircle2 size={12} />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">{doc.name}</h4>
                    <p className="text-[11px] text-emerald-700 font-semibold">{doc.specialization}</p>
                    <p className="text-[10px] text-slate-400">{doc.experience} Experience</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                  {doc.about}
                </p>

                <div className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="flex items-center gap-1 text-slate-700 font-bold">
                    <Star size={12} className="text-amber-400 fill-amber-400" /> {doc.rating}
                    <span className="text-[10px] text-slate-400 font-normal">({doc.reviews})</span>
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {doc.languages.join(', ')}
                  </span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">Consult Fee</span>
                  <p className="text-base font-bold text-emerald-700 font-display">₹1 Only</p>
                </div>
                <Link
                  to="/doctors"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition active:scale-95 shadow-xs"
                >
                  Consult Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          8. THE HANDCRAFTED AYURVEDA PROMISE (Authenticity)
      ══════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30 uppercase tracking-widest inline-block mb-3">
              The Nexus Ayurve Standard
            </span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display">
              Handcrafted with Classical Rigor & Modern Science
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              Every formulation is created following classical Charaka Samhita guidelines and verified by rigorous laboratory testing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Award,
                title: "100% Ethically Sourced",
                desc: "Wildcrafted herbs gathered sustainably from Himalayan slopes and Western Ghats sanctuaries."
              },
              {
                icon: ShieldCheck,
                title: "Ayush & GMP Certified",
                desc: "Manufactured in government-certified facilities adhering to world-class Ayurvedic Good Manufacturing Practices."
              },
              {
                icon: HeartHandshake,
                title: "Vaidya Formulated",
                desc: "Recipes fine-tuned by lineage Ayurvedic physicians for optimal bio-absorption and zero synthetic fillers."
              },
              {
                icon: Truck,
                title: "Fast, Safe Delivery",
                desc: "Tamper-evident, temperature-controlled packaging ensuring potency reaches your doorstep fresh."
              }
            ].map((p, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm hover:bg-white/10 transition"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                  <p.icon size={20} />
                </div>
                <h4 className="text-sm font-bold text-white mb-1.5">{p.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          9. CUSTOMER HEALTH STORIES & TESTIMONIALS
      ══════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
            Real Transformations, Real Stories
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Over 500,000+ patients across India trust Nexus Ayurve for their holistic wellness journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              name: "Meera Kulkarni",
              loc: "Pune",
              avatar: "M",
              text: "The pure KSM-66 Ashwagandha transformed my sleep. I used to wake up exhausted, but within 3 weeks my energy and cortisol levels are back to normal!",
              verified: "Verified Buyer · Ashwagandha KSM-66"
            },
            {
              name: "Rohit Singhania",
              loc: "New Delhi",
              avatar: "R",
              text: "The ₹1 consultation with Dr. Shyam Prasad was incredible. He spent 20 minutes explaining my Pitta imbalance and prescribed custom diet modifications that cleared my acid reflux.",
              verified: "Verified Patient · Kayachikitsa"
            },
            {
              name: "Anita Panicker",
              loc: "Bengaluru",
              avatar: "A",
              text: "The Ayur-Prakriti Lab test phlebotomist arrived right on time at 7 AM. Digital reports were ready the same evening with clear Ayurvedic dosha indicators. Super convenient!",
              verified: "Verified Booking · Full Body Screen"
            }
          ].map((t, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition space-y-4"
            >
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                "{t.text}"
              </p>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">{t.name}, {t.loc}</p>
                  <p className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle2 size={11} /> {t.verified}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                  {t.avatar}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          10. DOWNLOAD APP & EMERGENCY VAIDYA HELPLINE
      ══════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 py-8 mb-12">
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-white rounded-3xl p-6 sm:p-10 border border-emerald-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-lg">
            <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold">
              24x7 Ayurvedic Helpline
            </span>
            <h4 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
              Need personalized guidance on Ayurvedic medicines?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600">
              Speak directly with our senior Ayurvedic pharmacologists. Free dosage & medicine guidance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="tel:+919475002048"
              className="px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm transition flex items-center gap-2 shadow-sm"
            >
              <PhoneCall size={16} /> Call +91 94750 02048
            </a>
            <Link
              to="/ayurcoach"
              className="px-6 py-3 rounded-2xl bg-white border border-emerald-300 text-emerald-800 font-bold text-xs sm:text-sm hover:bg-emerald-50 transition"
            >
              Launch AyurCoach AI
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
