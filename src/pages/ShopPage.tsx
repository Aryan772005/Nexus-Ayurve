import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, ShoppingBag, Star, Truck, ShieldCheck,
  CheckCircle2, Plus, Minus, X, ArrowRight, Tag, Activity,
  FileText, Sparkles, HeartHandshake, ChevronDown, Eye
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { PRODUCTS, Product } from '../data/products';
import { LAB_PACKAGES, LabPackage } from '../data/labTests';

export default function ShopPage({ user, onLogin }: { user: any; onLogin: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart, updateQty, cart, openPrescription, openCart, city, pincode } = useCart();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'price-low' | 'price-high' | 'rating'
  const [selectedProductModal, setSelectedProductModal] = useState<Product | null>(null);

  // Check URL params for filters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    const categoryParam = params.get('category');
    const filterParam = params.get('filter');

    if (searchParam) setSearchQuery(searchParam);
    if (categoryParam) setSelectedCategory(categoryParam);
    if (filterParam === 'lab-tests') setSelectedCategory('Lab Tests');
  }, [location.search]);

  const categories = [
    'All',
    'Immunity & Vitality',
    'Stress & Sleep',
    'Digestion & Gut',
    'Joint & Pain',
    'Skin & Hair',
    'Vitality & Strength',
    'Lab Tests'
  ];

  const brands = [
    'All',
    'Veda Herbals',
    'Nexus Ayurve Originals',
    'Himalayan Wellness Co.',
    'Vedic Essence',
    'Dabur Ayurvedic',
    'Himalaya Wellness',
    'Organic India'
  ];

  // Helper to check cart qty
  const getProductCartQty = (id: number) => {
    const found = cart.find((item) => item.product.id === id);
    return found ? found.qty : 0;
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    if (selectedCategory !== 'All' && selectedCategory !== 'Lab Tests') {
      result = result.filter((p) =>
        p.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    if (selectedBrand !== 'All') {
      result = result.filter((p) => p.brand === selectedBrand);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      // Popular (rating * reviews)
      result.sort((a, b) => b.reviews - a.reviews);
    }

    return result;
  }, [selectedCategory, selectedBrand, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-slate-900 pb-16">
      
      {/* ── TOP BREADCRUMB & PRESCRIPTION NOTICE ── */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <span>Home</span>
            <span>/</span>
            <span className="text-slate-800 font-bold">Ayurvedic Pharmacy & Store</span>
            <span>/</span>
            <span className="text-emerald-700 font-semibold">{selectedCategory}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-500">
              Delivering genuine Ayurvedic formulations to: <strong className="text-slate-800">{city} ({pincode})</strong>
            </span>
          </div>
        </div>
      </div>

      {/* ── 1MG UPLOAD PRESCRIPTION STRIP ── */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl p-4 sm:p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center shrink-0">
              <FileText size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold font-display">Have an Ayurvedic Prescription?</h4>
              <p className="text-xs text-emerald-100">Upload now and let our certified Ayurvedic Vaidyas prepare your medicines.</p>
            </div>
          </div>
          <button
            onClick={openPrescription}
            className="px-5 py-2.5 rounded-xl bg-white text-emerald-900 font-extrabold text-xs hover:bg-emerald-50 transition active:scale-95 shrink-0 shadow-sm"
          >
            Upload Prescription
          </button>
        </div>
      </div>

      {/* ── STORE HEADER & SEARCH ── */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Ayurvedic Pharmacy & Health Products
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Handcrafted medicines, pure herbal extracts & certified health checkup packages
            </p>
          </div>

          {/* Search within store */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search within medicines..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Sort Select */}
            <div className="relative shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="popular">Sort: Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Category Pills Strip */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2 mb-4">
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-400 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Brand Filter Pills */}
        {selectedCategory !== 'Lab Tests' && (
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-3 text-xs mb-6">
            <span className="text-slate-400 font-semibold shrink-0">Brands:</span>
            {brands.map((b) => {
              const active = selectedBrand === b;
              return (
                <button
                  key={b}
                  onClick={() => setSelectedBrand(b)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-medium transition whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-slate-800 text-white font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {b}
                </button>
              );
            })}
          </div>
        )}

        {/* ── LAB TESTS VIEW (If selected) ── */}
        {selectedCategory === 'Lab Tests' ? (
          <div className="space-y-6">
            <div className="bg-sky-50 rounded-2xl p-4 border border-sky-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-sky-900">Preventive Ayur-Prakriti Diagnostic Packages</h3>
                <p className="text-xs text-sky-700">Home sample collection by certified phlebotomists. 100% NABL compliant.</p>
              </div>
              <span className="text-xs font-bold text-sky-800 bg-white px-3 py-1 rounded-full border border-sky-200">
                4 Certified Packages
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {LAB_PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  className="rounded-3xl border border-slate-200 p-5 bg-white shadow-xs hover:border-sky-400 hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  <div>
                    {pkg.tag && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-2.5 py-0.5 rounded-md mb-2 inline-block">
                        {pkg.tag}
                      </span>
                    )}
                    <h4 className="text-sm font-bold text-slate-900 leading-snug mb-1">{pkg.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3">{pkg.subtitle}</p>

                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1 text-xs text-slate-600 mb-3">
                      <p className="font-bold text-emerald-800">Parameters Tested ({pkg.testsCount}):</p>
                      <ul className="text-[11px] text-slate-500 space-y-0.5 list-disc pl-4">
                        {pkg.parameters.slice(0, 3).map((param, pi) => (
                          <li key={pi} className="truncate">{param}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-1 text-[11px] text-slate-500">
                      <p>🧪 {pkg.sampleType}</p>
                      <p>⚡ {pkg.reportTime}</p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-bold text-slate-900 font-display">₹{pkg.price}</span>
                        <span className="text-xs text-slate-400 line-through">₹{pkg.originalPrice}</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600">
                        {Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)}% OFF
                      </span>
                    </div>
                    <button
                      onClick={() => alert(`Health package ${pkg.title} booked for home collection in ${city}! Our diagnostic team will call you to confirm your slot.`)}
                      className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition active:scale-95 shadow-sm"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* ── MEDICINES PRODUCT GRID ── */
          <>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((product) => {
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

                      {/* Quick view button */}
                      <button
                        onClick={() => setSelectedProductModal(product)}
                        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-600 hover:text-emerald-700 flex items-center justify-center shadow-xs border border-slate-100 opacity-0 group-hover:opacity-100 transition"
                        title="View details"
                      >
                        <Eye size={14} />
                      </button>

                      {/* Product Image */}
                      <div
                        onClick={() => setSelectedProductModal(product)}
                        className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 mb-3 border border-slate-100 cursor-pointer"
                      >
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
                        <h3
                          onClick={() => setSelectedProductModal(product)}
                          className="text-xs sm:text-sm font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-emerald-700 transition cursor-pointer"
                        >
                          {product.name}
                        </h3>
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
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <ShoppingBag size={40} className="mx-auto text-slate-300 mb-3" />
                <h4 className="text-base font-bold text-slate-800 mb-1">No medicines found</h4>
                <p className="text-xs text-slate-500 mb-4">
                  No matching Ayurvedic formulations found for your current filter or search criteria.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedBrand('All');
                    setSearchQuery('');
                  }}
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── PRODUCT DETAILS MODAL (When clicked) ── */}
      <AnimatePresence>
        {selectedProductModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProductModal(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 max-h-[90vh] flex flex-col md:flex-row"
            >
              {/* Image Column */}
              <div className="md:w-1/2 p-6 bg-slate-50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-xs border border-slate-100">
                  <img
                    src={selectedProductModal.image}
                    alt={selectedProductModal.name}
                    className="w-full h-full object-cover"
                  />
                  {selectedProductModal.badge && (
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-xs">
                      {selectedProductModal.badge}
                    </span>
                  )}
                </div>

                <div className="mt-4 p-3 bg-white rounded-xl border border-slate-100 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                    <ShieldCheck size={14} />
                    <span>Classical Charaka Formulation</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    100% natural, lab-tested for purity & zero heavy metals.
                  </p>
                </div>
              </div>

              {/* Info Column */}
              <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                        {selectedProductModal.brand}
                      </p>
                      <h3 className="text-lg font-bold text-slate-900 font-display">
                        {selectedProductModal.name}
                      </h3>
                      <p className="text-xs text-slate-400">{selectedProductModal.packSize}</p>
                    </div>
                    <button
                      onClick={() => setSelectedProductModal(null)}
                      className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center gap-1">
                      <Star size={11} className="fill-white" /> {selectedProductModal.rating}
                    </span>
                    <span className="text-xs text-slate-500">({selectedProductModal.reviews} verified reviews)</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-slate-900 font-display">
                      ₹{selectedProductModal.price}
                    </span>
                    <span className="text-sm text-slate-400 line-through">
                      ₹{selectedProductModal.originalPrice}
                    </span>
                    <span className="text-xs font-bold text-emerald-600">
                      {Math.round(((selectedProductModal.originalPrice - selectedProductModal.price) / selectedProductModal.originalPrice) * 100)}% OFF
                    </span>
                  </div>

                  {/* Description */}
                  <div>
                    <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">About Formulation</h5>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {selectedProductModal.description}
                    </p>
                  </div>

                  {/* Key Benefits */}
                  <div>
                    <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Key Health Benefits</h5>
                    <ul className="text-xs text-slate-600 space-y-1">
                      {selectedProductModal.benefits.map((b, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Dosage */}
                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs">
                    <strong className="text-amber-900">Recommended Dosage:</strong>
                    <p className="text-amber-800 text-[11px] mt-0.5">{selectedProductModal.dosage}</p>
                  </div>
                </div>

                {/* Bottom Add Action */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-3">
                  <button
                    onClick={() => {
                      addToCart(selectedProductModal);
                      setSelectedProductModal(null);
                    }}
                    className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <ShoppingBag size={16} /> Add to Cart · ₹{selectedProductModal.price}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
