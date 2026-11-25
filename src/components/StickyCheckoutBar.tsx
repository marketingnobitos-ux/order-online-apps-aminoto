import React, { useState, useEffect } from 'react';
import { CartItem } from '../types';

export function StickyCheckoutBar({ cart, setView, view }: { cart: CartItem[], setView: (v: string) => void, view: string }) {
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);

  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (itemCount > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [itemCount, total]);

  if (cart.length === 0 || !['home', 'menu'].includes(view)) {
    return null;
  }

  return (
    <div className={`fixed bottom-[68px] left-0 right-0 max-w-md mx-auto bg-[#06402B] rounded-3xl mx-3 mb-3 px-6 py-4 flex justify-between items-center shadow-[0_10px_40px_rgba(0,0,0,0.3)] z-[60] transition-transform duration-300 ${isAnimating ? 'scale-105' : 'scale-100'}`}>
      <div className="flex flex-col text-white">
        <span className="text-xs font-medium text-white/80 tracking-wide mb-0.5">Total Harga:</span>
        <span className="text-xl font-bold leading-none">Rp {total.toLocaleString('id-ID')}</span>
      </div>
      
      <button 
        onClick={() => setView('cart')}
        className="bg-[#D4FF00] text-[#06402B] hover:bg-[#cbf200] px-6 py-3 rounded-full font-bold text-sm shadow-md transition-all active:scale-95"
      >
        Lanjut Pesan
      </button>
    </div>
  );
}
