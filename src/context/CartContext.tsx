import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, PRODUCTS } from '../data/products';
import { User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface CartItem {
  product: Product;
  qty: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQty: (productId: number, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  cartMrpTotal: number;
  cartSavings: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  // Prescription modal
  isPrescriptionOpen: boolean;
  openPrescription: () => void;
  closePrescription: () => void;
  // Location
  isLocationOpen: boolean;
  openLocation: () => void;
  closeLocation: () => void;
  city: string;
  pincode: string;
  setLocation: (city: string, pincode: string) => void;
  // Promo code
  couponCode: string;
  couponDiscount: number;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode; user?: FirebaseUser | null }> = ({ children, user }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('nexus_ayurve_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const [city, setCity] = useState(() => localStorage.getItem('nexus_city') || 'New Delhi');
  const [pincode, setPincode] = useState(() => localStorage.getItem('nexus_pincode') || '110001');

  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('nexus_ayurve_cart', JSON.stringify(cart));
  }, [cart]);

  // Sync with Firebase if user exists
  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
      if (docSnap.exists() && docSnap.data().cart && Array.isArray(docSnap.data().cart)) {
        // sync if remote cart is present
      }
    });
    return unsub;
  }, [user]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, qty: item.qty + quantity } : item
        );
      }
      return [...prev, { product, qty: quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQty = (productId: number, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, qty } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode('');
    setCouponDiscount(0);
  };

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'AYUR25') {
      setCouponCode('AYUR25');
      setCouponDiscount(0.25);
      return true;
    }
    if (clean === 'FIRST100' || clean === 'NEXUS100') {
      setCouponCode(clean);
      setCouponDiscount(100);
      return true;
    }
    return false;
  };

  const removeCoupon = () => {
    setCouponCode('');
    setCouponDiscount(0);
  };

  const setLocation = (newCity: string, newPincode: string) => {
    setCity(newCity);
    setPincode(newPincode);
    localStorage.setItem('nexus_city', newCity);
    localStorage.setItem('nexus_pincode', newPincode);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.product.price * item.qty, 0);
  const cartMrpTotal = cart.reduce((acc, item) => acc + item.product.originalPrice * item.qty, 0);
  const cartSavings = Math.max(0, cartMrpTotal - cartTotal);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        cartCount,
        cartTotal,
        cartMrpTotal,
        cartSavings,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        isPrescriptionOpen,
        openPrescription: () => setIsPrescriptionOpen(true),
        closePrescription: () => setIsPrescriptionOpen(false),
        isLocationOpen,
        openLocation: () => setIsLocationOpen(true),
        closeLocation: () => setIsLocationOpen(false),
        city,
        pincode,
        setLocation,
        couponCode,
        couponDiscount,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
