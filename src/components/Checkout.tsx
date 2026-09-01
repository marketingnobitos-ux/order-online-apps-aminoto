import React, { useState, useRef } from 'react';
import { BRANCHES } from '../data';
import { PaymentMethod } from '../types';
import { Bike } from 'lucide-react';

export function Checkout(props: any) {
  const { name, setName, whatsapp, setWhatsapp, paymentMethod, setPaymentMethod, note, setNote, selectedBranch, setSelectedBranch, setView, cart } = props;
  
  const [errors, setErrors] = useState({ name: false, whatsapp: false, paymentMethod: false });
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Nomor WA Indonesia yang wajar: hanya angka (boleh diawali +),
  // dan 9-15 digit. Menangkap ketikan seperti "abc" atau "12".
  const isValidWhatsapp = (v: string) => {
    const digits = v.replace(/[\s-]/g, '').replace(/^\+/, '');
    return /^[0-9]{9,15}$/.test(digits);
  };

  const handleNext = () => {
    const isNameEmpty = name.trim() === '';
    const isWhatsappInvalid = !isValidWhatsapp(whatsapp);
    const isPaymentEmpty = paymentMethod === '';

    setErrors({
      name: isNameEmpty,
      whatsapp: isWhatsappInvalid,
      paymentMethod: isPaymentEmpty
    });

    if (isNameEmpty) {
      nameInputRef.current?.focus();
      return;
    }

    if (!isNameEmpty && !isWhatsappInvalid && !isPaymentEmpty) {
      setView('review');
    }
  };

  const total = cart.reduce((sum: number, item: any) => sum + (item.menuItem.price * item.quantity), 0);
  const isNameEmpty = name.trim() === '';

  return (
    <div className="flex flex-col min-h-full pb-48">
      <div className="px-5 py-4 border-b border-gray-100 bg-[#FDFBF7] sticky top-0 z-50">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Checkout</h1>
      </div>

      <div className="px-5 py-6 flex flex-col gap-8">
        
        {/* Formulir Pemesan */}
        <section className="flex flex-col gap-6">
          <h2 className="text-lg font-bold text-gray-900">Informasi Pemesan</h2>
          
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-700">Nama Pemesan <span className="text-red-500">*</span></label>
            <input 
              ref={nameInputRef}
              type="text" 
              value={name} 
              onChange={e => { setName(e.target.value); setErrors(p => ({...p, name: false})); }}
              className={`w-full bg-white border ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-100'} rounded-xl py-3.5 px-4 text-sm font-medium outline-none transition-all shadow-sm`}
              placeholder="Masukkan nama lengkap"
            />
            {errors.name && <span className="text-[10px] text-red-500 font-medium mt-1">Maaf, nama wajib diisi dulu ya!</span>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-700">Nomor WhatsApp <span className="text-red-500">*</span></label>
            <input 
              type="tel" 
              value={whatsapp} 
              onChange={e => { setWhatsapp(e.target.value); setErrors(p => ({...p, whatsapp: false})); }}
              className={`w-full bg-white border ${errors.whatsapp ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-100'} rounded-xl py-3.5 px-4 text-sm font-medium outline-none transition-all shadow-sm`}
              placeholder="Contoh: 081234567890"
            />
            {errors.whatsapp && <span className="text-[10px] text-red-500 font-medium mt-1">Masukkan nomor WhatsApp yang valid (contoh: 081234567890)</span>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-700">Pilih Cabang <span className="text-red-500">*</span></label>
            <select 
              value={selectedBranch}
              onChange={e => setSelectedBranch(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl py-3.5 px-4 text-sm font-medium outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-100 shadow-sm"
            >
              {BRANCHES.map(b => (
                <option key={b.id} value={b.name}>{b.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-3 mt-2">
            <label className="text-xs font-semibold text-gray-700">Pengantaran</label>
            <label className="relative p-4 rounded-2xl border flex items-center gap-4 cursor-pointer transition-all border-[#06402B] bg-[#06402B]/5 shadow-sm">
              <input type="radio" checked readOnly className="hidden" />
              <div className="w-5 h-5 flex-shrink-0 rounded-full border flex items-center justify-center border-[#06402B]">
                <div className="w-2.5 h-2.5 bg-[#06402B] rounded-full"></div>
              </div>
              <span className="font-bold text-gray-900 text-sm">Ambil Sendiri / Pesan Driver Sendiri</span>
            </label>

            <div className="bg-yellow-50 p-4 rounded-xl border-2 border-yellow-400 shadow-md flex items-start gap-3 mt-2">
              <Bike className="text-yellow-600 shrink-0 mt-0.5" size={24} strokeWidth={2.5} />
              <div className="flex flex-col gap-1">
                <span className="font-bold text-yellow-900 text-[14px] uppercase tracking-wide">Driver Dipesan Customer</span>
                <p className="text-[12px] text-yellow-800 font-medium leading-relaxed">
                  Outlet tidak menyediakan layanan driver. Silakan pesan Gojek/Grab sendiri setelah melakukan pemesanan.
                </p>
                <p className="text-[11px] text-yellow-700 font-semibold leading-snug mt-1 bg-yellow-100/50 p-2 rounded-lg">
                  *Customer bertanggung jawab memesan driver dan menentukan titik pengambilan di outlet.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <label className="text-xs font-semibold text-gray-700">Catatan Pesanan <span className="text-gray-400 font-normal">(Opsional)</span></label>
            <textarea 
              value={note} 
              onChange={e => setNote(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl py-3.5 px-4 text-sm font-medium outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-100 transition-all resize-none shadow-sm"
              placeholder="Contoh: Sambal pisah, ayam dibakar, dll"
              rows={3}
            />
          </div>
        </section>

        {/* Pilih Pembayaran */}
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-bold text-gray-900">Pilih Pembayaran <span className="text-red-500">*</span></h2>
            {errors.paymentMethod && <span className="text-[10px] text-red-500 font-medium">Silakan pilih metode pembayaran</span>}
            <select 
              value={paymentMethod}
              onChange={e => { setPaymentMethod(e.target.value); setErrors(p => ({...p, paymentMethod: false})); }}
              className="w-full bg-white border border-gray-200 rounded-xl py-3.5 px-4 text-sm font-medium outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-100 shadow-sm"
            >
              <option value="" disabled>Pilih Metode Pembayaran</option>
              <option value="BCA">Transfer BCA</option>
              <option value="QRIS">QRIS</option>
              <option value="BAYAR DI TEMPAT">Bayar di Tempat</option>
            </select>
          </div>
        </section>

      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 p-5 pb-28 z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.03)]">
         <div className="flex justify-between items-center mb-5">
          <span className="text-gray-500 font-semibold text-sm">Total Pembayaran</span>
          <span className="text-xl font-bold text-gray-900">Rp {total.toLocaleString('id-ID')}</span>
        </div>
        <button 
          onClick={handleNext}
          className={`w-full py-4 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${isNameEmpty ? 'bg-gray-300 text-gray-500' : 'bg-[#06402B] text-white hover:shadow-lg'}`}
        >
          Review Pesanan &rarr;
        </button>
      </div>
    </div>
  );
}
