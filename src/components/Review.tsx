import React from 'react';
import { MENU_ITEMS, ADMIN_WHATSAPP, ONLINE_ORDER_OPEN_HOUR, ONLINE_ORDER_CLOSE_HOUR, isOnlineOrderOpen } from '../data';
import { Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function Review({ name, whatsapp, paymentMethod, note, selectedBranch, cart, setView, clearCart, addToCart }: any) {
  const [isCopying, setIsCopying] = React.useState(false);
  const total = cart.reduce((sum: number, item: any) => sum + (item.menuItem.price * item.quantity), 0);
  const isStoreOpen = isOnlineOrderOpen(); // dihitung di zona Asia/Jakarta (WIB)

  const handleOrder = async () => {
    if (isCopying) return;
    
    const orderItems = cart.map((item: any) => `- ${item.quantity}x ${item.menuItem.name} ${item.variant ? `(${item.variant})` : ''} Rp ${(item.menuItem.price * item.quantity).toLocaleString('id-ID')}`).join('\n');
    
    const message = `Halo Admin Aminoto, saya mau pesan:
Nama: ${name}
Cabang: ${selectedBranch}
Pengantaran: Ambil Sendiri / Pesan Driver Sendiri
Pembayaran: ${paymentMethod}

Pesanan:
${orderItems}

Catatan: ${note || '-'}
Total Bayar: Rp ${total.toLocaleString('id-ID')}

Mohon segera diproses ya!`;
    
    const encodedMessage = encodeURIComponent(message);
    const adminPhone = ADMIN_WHATSAPP;
    const waUrl = `https://wa.me/${adminPhone}?text=${encodedMessage}`;
    
    setIsCopying(true);
    try {
      await navigator.clipboard.writeText(message);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }

    // Simpan order ke database untuk rekap admin. Gagal simpan tidak menghentikan alur WA.
    if (supabase) {
      supabase.from('orders').insert({
        customer_name: name,
        whatsapp,
        branch: selectedBranch,
        payment_method: paymentMethod,
        note: note || null,
        items: cart.map((item: any) => ({
          id: item.menuItem.id,
          name: item.menuItem.name,
          variant: item.variant || null,
          qty: item.quantity,
          price: item.menuItem.price,
        })),
        total,
      }).then(({ error }) => {
        if (error) console.error('Gagal simpan order: ', error);
      });
    }
    
    setTimeout(() => {
      setIsCopying(false);
      clearCart();
      setView('home');
      window.open(waUrl, '_blank');
    }, 300); // Tiny delay to ensure UI updates before opening new tab
  };

  return (
    <div className="flex flex-col min-h-full pb-64">
      <div className="px-5 py-4 border-b border-gray-100 bg-[#FDFBF7] sticky top-0 z-50">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Review Pesanan</h1>
      </div>

      <div className="px-5 py-6 flex flex-col gap-10">
        <div className="bg-[#FFFCF5] border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col gap-5 shadow-md relative">
          
          <div className="text-center pb-4 border-b-2 border-dashed border-gray-200 -mt-2">
            <span className="font-bold text-gray-800 text-[11px] tracking-widest uppercase">Nota Sementara</span>
          </div>
          
          <div className="flex flex-col border-b-2 border-dashed border-gray-200 pb-5">
            <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-2">Informasi Pengiriman</span>
            <span className="font-bold text-gray-900 text-lg mb-1 capitalize">{name.toLowerCase()}</span>
            <span className="text-sm text-gray-600 font-medium">{whatsapp}</span>
            <span className="text-[11px] text-gray-700 mt-3 font-semibold bg-white px-3 py-2 rounded-xl w-fit border border-gray-200 shadow-sm">
              CABANG: <span className="font-bold text-gray-900">{selectedBranch}</span>
            </span>
          </div>

          <div className="flex flex-col border-b-2 border-dashed border-gray-200 pb-5 gap-3">
            <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-1">Rincian Pesanan</span>
            {cart.map((item: any, idx: number) => (
              <div key={`${item.menuItem.id}-${item.variant || 'none'}-${idx}`} className="flex justify-between items-start text-sm">
                <span className="font-semibold text-gray-900 text-[13px] flex gap-2">
                  <span className="text-gray-500 font-bold">{item.quantity}x</span> 
                  {item.menuItem.name} {item.variant && `(${item.variant})`}
                </span>
                <span className="font-bold text-gray-900">Rp {(item.menuItem.price * item.quantity).toLocaleString('id-ID')}</span>
              </div>
            ))}
            {note && (
              <div className="mt-3 bg-white p-4 rounded-xl border border-gray-200 text-sm italic text-gray-600 leading-relaxed shadow-sm">
                <span className="font-semibold not-italic text-gray-500 uppercase text-[10px] tracking-widest block mb-1">Catatan</span>
                "{note}"
              </div>
            )}
          </div>

          <div className="flex flex-col pt-1">
            <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-2">Metode Pembayaran</span>
            <span className="font-bold text-gray-900 text-base">{paymentMethod}</span>
          </div>

        </div>
        
        {/* Rekomendasi Tambahan */}
        <div className="flex flex-col gap-3 mt-2">
          <span className="font-bold text-gray-900 text-sm">Biar makin mantap, tambah ini yuk:</span>
          <div className="flex overflow-x-auto hide-scrollbar gap-4 pb-2 w-full pr-5">
            {MENU_ITEMS.filter(item => ['t17', 't14', 'd2'].includes(item.id)).map(item => (
              <div key={`rec-${item.id}`} className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm w-40 flex flex-col gap-2 shrink-0">
                <span className="font-bold text-sm text-gray-900 leading-tight font-sans">{item.name}</span>
                <span className="font-bold text-[#06402B] text-xs font-sans">Rp {item.price.toLocaleString('id-ID')}</span>
                <button 
                  onClick={() => addToCart(item)}
                  className="mt-2 w-full py-2 bg-[#06402B] text-white hover:bg-[#042d1e] rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1 shadow-sm"
                >
                  <Plus size={14} strokeWidth={3} /> Tambah
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 p-5 pb-28 z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.03)]">
        <div className="flex justify-between items-center mb-3">
          <span className="text-gray-500 font-semibold text-sm">Total Pembayaran</span>
          <span className="text-2xl font-bold text-gray-900">Rp {total.toLocaleString('id-ID')}</span>
        </div>

        <p className="text-center text-[10px] text-gray-500 mb-3 font-medium">
          *Pemesanan online hanya dilayani pukul <strong className="text-gray-700">{`${ONLINE_ORDER_OPEN_HOUR}.00 - ${ONLINE_ORDER_CLOSE_HOUR}.00`}</strong> WIB
        </p>

        <button 
          onClick={handleOrder}
          disabled={isCopying || !isStoreOpen}
          className={`w-full py-4 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${isCopying || !isStoreOpen ? 'bg-gray-200 text-gray-500' : 'bg-[#06402B] text-white hover:shadow-lg'}`}
        >
          {!isStoreOpen ? `Order Online Tutup (Buka ${ONLINE_ORDER_OPEN_HOUR}.00 - ${ONLINE_ORDER_CLOSE_HOUR}.00 WIB)` : isCopying ? 'Membuka WhatsApp & Menyalin Pesanan...' : 'Pesan via WhatsApp \u2192'}
        </button>
      </div>
    </div>
  );
}
