import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      q: 'Jam operasional Aminoto?',
      a: 'Berikut jam operasional Aminoto setiap harinya:\n• Order Online: 10.00 - 20.00\n• Outlet (Makan di Tempat): 10.00 - 22.00\n\nJangan sampai kelewatan jamnya ya, #WargaAminoto!',
    },
    {
      q: 'Apakah bisa pesan untuk katering/acara?',
      a: 'Bisa! Silakan hubungi langsung cabang terdekat untuk pemesanan dalam jumlah besar.',
    },
    {
      q: 'Metode pembayaran apa saja yang tersedia?',
      a: 'Kami menerima pembayaran melalui BCA, QRIS, dan Bayar di Tempat (Tunai).',
    },
    {
      q: 'Berapa lama estimasi pesanan diproses dan dikirim?',
      a: 'Waktu untuk mempersiapkan pesanan adalah kurang lebih 25 menit. Lama pengiriman selanjutnya akan menyesuaikan dengan jarak dari cabang ke lokasimu ya, #WargaAminoto!',
    }
  ];

  return (
    <div className="flex flex-col min-h-full bg-gray-50 p-5 pb-24">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Pertanyaan Umum (FAQ)</h2>
      
      <div className="flex flex-col gap-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <button 
              onClick={() => toggleFAQ(idx)}
              className="w-full text-left p-4 flex justify-between items-center bg-white"
            >
              <h3 className="font-bold text-gray-900 text-sm pr-4">{faq.q}</h3>
              <ChevronDown 
                className={`w-5 h-5 text-gray-500 transition-transform duration-300 shrink-0 ${openIndex === idx ? 'rotate-180' : ''}`} 
              />
            </button>
            <div 
              className={`transition-all duration-300 ease-in-out ${openIndex === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <div className="p-4 pt-0 border-t border-gray-50">
                <p className="text-gray-600 text-[13px] leading-relaxed whitespace-pre-line">{faq.a}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
