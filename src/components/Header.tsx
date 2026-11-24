import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingBag, Menu } from 'lucide-react';
import { CartItem } from '../types';

export function Header({ view, setView, cart }: { view: string, setView: (v: string) => void, cart?: CartItem[] }) {
  const handleBack = () => {
    if (view === 'menu') setView('home');
    if (view === 'cart') setView('menu');
    if (view === 'checkout') setView('cart');
    if (view === 'review') setView('checkout');
    if (view === 'faq') setView('home');
    if (view === 'terkirim') setView('home');
  };

  const cartCount = cart ? cart.reduce((acc, item) => acc + item.quantity, 0) : 0;

  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (cartCount > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  return (
    <div className="w-full h-16 bg-[#FDFBF7] flex items-center justify-between px-5 z-50 shrink-0 border-b border-gray-100">
      <div className="flex items-center gap-3">
        {view !== 'home' ? (
          <button onClick={handleBack} className="p-1 -ml-1 text-[#06402B] hover:opacity-70 transition-opacity shrink-0">
            <ArrowLeft size={24} strokeWidth={2.5} />
          </button>
        ) : (
          <button onClick={() => setView('menu')} className="p-1 -ml-1 text-[#06402B] hover:opacity-70 transition-opacity shrink-0">
            <Menu size={24} strokeWidth={2.5} />
          </button>
        )}
        <span className="font-extrabold text-[#06402B] text-lg tracking-tight uppercase">
          AMINOTO
        </span>
      </div>
      
      <button 
        onClick={() => setView('cart')}
        className={`relative flex items-center justify-center p-1 -mr-1 text-[#06402B] hover:opacity-70 transition-all shrink-0 ${isAnimating ? 'animate-bounce' : ''}`}
      >
        <ShoppingBag size={24} strokeWidth={2.5} />
        {cartCount > 0 && (
          <span className="absolute top-0 right-0 translate-x-1 -translate-y-1 bg-[#800000] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#FDFBF7]">
            {cartCount}
          </span>
        )}
      </button>
    </div>
  );
}
