import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Tag, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQty,
    clearCart,
    cartCount,
    cartTotal,
    cartMrpTotal,
    cartSavings,
    couponCode,
    couponDiscount,
    applyCoupon,
    removeCoupon,
    city,
    pincode,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [orderRef, setOrderRef] = useState('');

  if (!isCartOpen) return null;

  const FREE_DELIVERY_THRESHOLD = 499;
  const deliveryFee = cartTotal >= FREE_DELIVERY_THRESHOLD || cartTotal === 0 ? 0 : 40;
  const calculatedDiscount =
    couponDiscount < 1
      ? Math.round(cartTotal * couponDiscount)
      : Math.min(cartTotal, couponDiscount);
  const finalPayable = Math.max(0, cartTotal - calculatedDiscount + deliveryFee);
  const totalSavingsCombined = cartSavings + calculatedDiscount;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const ok = applyCoupon(inputCoupon);
    if (!ok) {
      setCouponError('Invalid code. Try "AYUR25" or "FIRST100"');
    } else {
      setCouponError('');
      setInputCoupon('');
    }
  };

  const handleCheckout = () => {
    const id = 'ORD-AYUR-' + Math.floor(100000 + Math.random() * 900000);
    setOrderRef(id);
    setCheckoutComplete(true);
    clearCart();
  };

  const handleClose = () => {
    setCheckoutComplete(false);
    closeCart();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Drawer Window */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="relative w-full max-w-md bg-white h-full shadow-2xl z-10 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ShoppingBag size={18} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 font-display">My Cart ({cartCount})</h3>
                <p className="text-[11px] text-slate-500">Delivering to {city} ({pincode})</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-slate-200/70 text-slate-600 hover:text-slate-900 flex items-center justify-center transition"
            >
              <X size={16} />
            </button>
          </div>

          {!checkoutComplete ? (
            <>
              {cart.length > 0 ? (
                <>
                  {/* Free Delivery Bar */}
                  <div className="bg-emerald-50 px-4 py-2.5 border-b border-emerald-100 text-xs flex items-center justify-between">
                    {cartTotal >= FREE_DELIVERY_THRESHOLD ? (
                      <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                        <Check size={14} className="text-emerald-600" />
                        Yay! You unlocked FREE Delivery on this order.
                      </span>
                    ) : (
                      <span className="text-emerald-800">
                        Add <strong className="text-emerald-950 font-bold">₹{FREE_DELIVERY_THRESHOLD - cartTotal}</strong> more for <strong>FREE Delivery</strong>
                      </span>
                    )}
                  </div>

                  {/* Items Scroll Area */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-100">
                    {cart.map(({ product, qty }) => (
                      <div key={product.id} className="pt-3 first:pt-0 flex gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-18 h-18 rounded-xl object-cover border border-slate-100 shrink-0 bg-slate-50"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">{product.brand}</p>
                          <h4 className="text-xs font-bold text-slate-900 truncate leading-snug">{product.name}</h4>
                          <p className="text-[11px] text-slate-400 mb-1.5">{product.packSize}</p>

                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-sm font-bold text-slate-900">₹{product.price * qty}</span>
                              <span className="text-[11px] text-slate-400 line-through">₹{product.originalPrice * qty}</span>
                            </div>

                            {/* Stepper */}
                            <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
                              <button
                                onClick={() => updateQty(product.id, qty - 1)}
                                className="px-2 py-1 text-slate-600 hover:bg-slate-200 transition"
                              >
                                {qty === 1 ? <Trash2 size={12} className="text-rose-500" /> : <Minus size={12} />}
                              </button>
                              <span className="px-2.5 py-0.5 text-xs font-bold text-slate-800 bg-white">
                                {qty}
                              </span>
                              <button
                                onClick={() => updateQty(product.id, qty + 1)}
                                className="px-2 py-1 text-slate-600 hover:bg-slate-200 transition"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Promo & Summary section */}
                  <div className="p-4 border-t border-slate-200 bg-slate-50/50 space-y-3.5">
                    {/* Coupon Input */}
                    {!couponCode ? (
                      <form onSubmit={handleApplyCoupon} className="space-y-1">
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="text"
                              value={inputCoupon}
                              onChange={(e) => setInputCoupon(e.target.value)}
                              placeholder="Coupon code (e.g. AYUR25)"
                              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-emerald-500 uppercase"
                            />
                          </div>
                          <button
                            type="submit"
                            className="px-3.5 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition"
                          >
                            Apply
                          </button>
                        </div>
                        {couponError && <p className="text-[11px] text-rose-500">{couponError}</p>}
                        <div className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Sparkles size={11} className="text-amber-500" />
                          Try code <span className="font-bold text-emerald-700">AYUR25</span> for 25% OFF
                        </div>
                      </form>
                    ) : (
                      <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Tag size={14} className="text-emerald-700" />
                          <div>
                            <span className="font-bold text-emerald-900">{couponCode} applied</span>
                            <p className="text-[10px] text-emerald-700">You saved ₹{calculatedDiscount}!</p>
                          </div>
                        </div>
                        <button
                          onClick={removeCoupon}
                          className="text-[11px] font-bold text-rose-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    )}

                    {/* Bill breakdown */}
                    <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-200/80 pt-2.5">
                      <div className="flex justify-between">
                        <span>Total MRP</span>
                        <span className="line-through text-slate-400">₹{cartMrpTotal}</span>
                      </div>
                      <div className="flex justify-between text-emerald-700 font-medium">
                        <span>Price Discount</span>
                        <span>- ₹{cartSavings}</span>
                      </div>
                      {couponCode && (
                        <div className="flex justify-between text-emerald-700 font-medium">
                          <span>Coupon Discount ({couponCode})</span>
                          <span>- ₹{calculatedDiscount}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span>{deliveryFee === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${deliveryFee}`}</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-slate-900 pt-1.5 border-t border-slate-200">
                        <span>To Pay</span>
                        <span>₹{finalPayable}</span>
                      </div>
                      <div className="text-[11px] font-bold text-emerald-700 bg-emerald-100/60 p-1.5 rounded-lg text-center">
                        Total Savings on this order: ₹{totalSavingsCombined}
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <button
                      onClick={handleCheckout}
                      className="w-full py-3 rounded-2xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 active:scale-98 transition shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
                    >
                      Checkout · ₹{finalPayable} <ArrowRight size={16} />
                    </button>
                  </div>
                </>
              ) : (
                /* Empty Cart State */
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                    <ShoppingBag size={28} />
                  </div>
                  <h4 className="text-base font-bold text-slate-800 font-display mb-1">Your cart is empty</h4>
                  <p className="text-xs text-slate-500 max-w-xs mb-5">
                    Browse our handcrafted herbal pharmacy and authentic wellness remedies.
                  </p>
                  <Link
                    to="/shop"
                    onClick={handleClose}
                    className="px-6 py-2.5 rounded-full bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition"
                  >
                    Explore Ayurvedic Store
                  </Link>
                </div>
              )}
            </>
          ) : (
            /* Order Placed Success */
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Check size={32} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 font-display">Order Confirmed!</h4>
              <p className="text-xs text-slate-500">
                Order Reference: <strong className="text-emerald-700 font-mono">{orderRef}</strong>
              </p>
              <p className="text-xs text-slate-600 max-w-xs">
                Your authentic handcrafted medicines are being carefully packed at our certified Ayurvedic pharmacy and will be dispatched to <strong className="text-slate-800">{city} ({pincode})</strong>.
              </p>
              <div className="pt-2">
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-full bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}

          {/* Footer badge */}
          <div className="p-3 bg-slate-100/70 border-t border-slate-200 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck size={14} className="text-emerald-600" />
            100% Genuine Ayurvedic Medicines · Safe Delivery
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
