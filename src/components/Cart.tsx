import React from 'react';
import { CartItem } from '../types';
import { Minus, Plus, ShoppingBag } from 'lucide-react';

export function Cart({ cart, updateQuantity, setView }: { cart: CartItem[], updateQuantity: (id: string, variant: string | undefined, delta: number) => void, setView: (v: string) => void }) {
  const total = cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-5 pb-20 pt-32 text-center">
        <div className="w-20 h-20 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center text-gray-300 mb-6">
          <ShoppingBag size={32} strokeWidth={2} />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-gray-900 mb-2">Keranjang Kosong</h2>
        <p className="text-sm text-gray-500 mb-8 font-medium">Kamu belum memilih menu apapun.</p>
        <button onClick={() => setView('menu')} className="bg-[#D4FF00] text-[#06402B] px-8 py-3.5 rounded-2xl font-bold shadow-md hover:shadow-lg transition-all">
          Lihat Menu
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full pb-48">
      <div className="px-5 py-4 border-b border-gray-100 bg-[#FDFBF7] sticky top-0 z-50">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Keranjang</h1>
      </div>

      <div className="px-5 py-6 flex flex-col gap-4">
        {cart.map((item, idx) => (
          <div key={`${item.menuItem.id}-${item.variant || 'none'}-${idx}`} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-semibold text-gray-900 text-sm">
                  {item.menuItem.name} {item.variant && `(${item.variant})`}
                </span>
                <span className="text-xs text-gray-500 font-medium mt-1 block">Rp {item.menuItem.price.toLocaleString('id-ID')}</span>
              </div>
            </div>
            <div className="flex justify-between items-center mt-2 border-t border-gray-50 pt-3">
              <span className="text-base font-bold text-gray-900">Rp {(item.menuItem.price * item.quantity).toLocaleString('id-ID')}</span>
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-1 border border-gray-100">
                <button onClick={() => updateQuantity(item.menuItem.id, item.variant, -1)} className="w-8 h-8 flex items-center justify-center text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm">
                  <Minus size={16} strokeWidth={2} />
                </button>
                <span className="w-4 text-center font-bold text-sm text-gray-900">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.menuItem.id, item.variant, 1)} className="w-8 h-8 flex items-center justify-center text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm">
                  <Plus size={16} strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 p-5 pb-28 z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.03)]">
        <div className="flex justify-between items-center mb-5">
          <span className="text-gray-500 font-semibold text-sm">Total Pesanan</span>
          <span className="text-xl font-bold text-gray-900">Rp {total.toLocaleString('id-ID')}</span>
        </div>
        <button 
          onClick={() => setView('checkout')}
          className="w-full bg-[#06402B] text-white py-4 rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition-all"
        >
          Lanjut Pembayaran &rarr;
        </button>
      </div>
    </div>
  );
}
