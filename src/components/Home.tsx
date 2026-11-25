import React from 'react';
import { BRANCHES, ADMIN_WHATSAPP, JAM_ORDER_ONLINE, ONLINE_ORDER_OPEN_FRIDAY, JAM_OUTLET, OUTLET_OPEN_FRIDAY, ULASAN, formatJam, isOutletOpen } from '../data';
import { ArrowRight, Instagram, Facebook, MapPin, Star, Clock, RotateCcw } from 'lucide-react';
import { PesanUlang } from '../pesanUlang';

export function Home({ setView, pesanUlang, onPesanLagi }: {
  setView: (v: string) => void;
  pesanUlang: PesanUlang | null;
  onPesanLagi: () => void;
}) {
  const outletBuka = isOutletOpen(); // dihitung di zona Asia/Jakarta (WIB)
  const ringkasanPesanUlang = pesanUlang?.items
    .map(c => `${c.menuItem.name}${c.variant ? ` (${c.variant})` : ''} ×${c.quantity}`)
    .join(', ');
  return (
    <div className="flex flex-col">
      {/* Header section in Home */}
      <div className="px-5 py-6 flex flex-col items-start gap-2 text-gray-900">
        <h1 className="text-4xl font-bold tracking-tight leading-none">Pecel Lele Aminoto</h1>
        <p className="text-sm opacity-80 font-medium max-w-[250px] leading-snug">
          Pesan langsung dari outlet Aminoto terdekat dari rumahmu.
        </p>
        <button 
          onClick={() => setView('menu')}
          className="mt-4 bg-[#D4FF00] text-[#06402B] px-8 py-3.5 rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
          Pesan Sekarang <ArrowRight size={18} />
        </button>
        <div className="mt-3 flex items-center gap-1.5 text-gray-500">
          <Clock size={13} strokeWidth={2.5} className="shrink-0" />
          <span className="text-[11px] font-semibold">
            Pemesanan online: {JAM_ORDER_ONLINE} WIB (Jumat mulai {formatJam(ONLINE_ORDER_OPEN_FRIDAY)})
          </span>
        </div>
      </div>

      {/* Pesan lagi: muncul kalau HP ini pernah mengirim pesanan */}
      {pesanUlang && (
        <div className="px-5 pb-2">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#06402B] text-[#D4FF00] flex items-center justify-center shrink-0">
                <RotateCcw size={18} strokeWidth={2.5} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Pesanan terakhirmu</p>
                <p className="text-[13px] font-semibold text-gray-900 leading-snug line-clamp-2 mt-0.5">{ringkasanPesanUlang}</p>
                <p className="text-[13px] font-bold text-[#06402B] mt-1">Rp {pesanUlang.total.toLocaleString('id-ID')}</p>
              </div>
            </div>
            <button
              onClick={onPesanLagi}
              className="w-full bg-[#06402B] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            >
              Pesan lagi <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Cabang Kami */}
      <div className="py-6">
        <div className="px-5 mb-4 flex justify-between items-end">
          <h2 className="text-xl font-bold tracking-tight text-gray-900">Cabang Kami</h2>
        </div>
        <div className="flex flex-row gap-2 px-4 pb-4 w-full">
          {BRANCHES.map(b => (
            <div key={b.id} className="bg-white rounded-xl p-1.5 flex flex-col h-full border border-gray-200 shadow-sm relative flex-1 min-w-0">
              <div className="flex flex-col flex-1 mb-2">
                <h3 className="font-bold text-gray-900 text-[10px] leading-snug mb-1.5 truncate">{b.name}</h3>
                <span className={`inline-flex w-max text-[8px] px-1.5 py-0.5 rounded-full font-bold items-center gap-1 ${outletBuka ? 'bg-[#D4FF00] text-[#06402B]' : 'bg-gray-200 text-gray-600'}`}>
                  <span className={`w-1 h-1 rounded-full shrink-0 ${outletBuka ? 'bg-[#06402B]' : 'bg-gray-500'}`}></span> {outletBuka ? 'BUKA' : 'TUTUP'}
                </span>
              </div>
              <div className="flex justify-between items-end border-t border-gray-100 pt-1.5 mt-auto">
                <div className="flex flex-col overflow-hidden pr-1">
                  <span className="text-[7px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Jam Buka</span>
                  <span className="text-[9px] font-bold text-gray-700 truncate">{JAM_OUTLET}</span>
                  <span className="text-[7px] font-semibold text-gray-500 truncate">Jumat mulai {formatJam(OUTLET_OPEN_FRIDAY)}</span>
                </div>
                {b.mapsUrl ? (
                  <a href={b.mapsUrl} target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-md bg-gray-50 border border-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-100 hover:text-[#06402B] hover:border-gray-300 transition-all shrink-0">
                    <MapPin size={12} strokeWidth={2.5} />
                  </a>
                ) : (
                  <div className="w-6 h-6 shrink-0"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Promo Catering Banner */}
      <div className="px-5 mb-4">
        <div className="relative rounded-2xl overflow-hidden shadow-md flex flex-col justify-end min-h-[170px] p-5">
          {/* Background Image */}
          <img
            src="/foto-catering.webp"
            alt="Sajian catering Aminoto: nasi box, sate, kangkung, dan sambal"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
          
          {/* Content */}
          <div className="relative z-10 flex flex-col gap-2">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight mb-1">Paket Catering Aminoto</h2>
              <p className="text-[11px] text-gray-200 font-medium leading-snug">Pilihan tepat untuk segala acaramu! Lebih praktis, lebih lezat.</p>
            </div>
            
            <div className="flex flex-wrap gap-1.5 mb-2 mt-1">
              <span className="text-[9px] font-bold bg-[#D4FF00] text-[#06402B] px-2 py-1 rounded-md uppercase tracking-wider shadow-sm">Mulai Rp 20rb-an/box</span>
              <span className="text-[9px] font-bold bg-white/20 text-white backdrop-blur-md px-2 py-1 rounded-md uppercase tracking-wider border border-white/20">Min. Order 10 Box</span>
            </div>
            
            <a 
              href={`https://wa.me/${ADMIN_WHATSAPP}?text=Halo%20Admin%20Catering%20Aminoto!%20Saya%20mau%20tanya-tanya%20soal%20paket%20catering%20untuk%20acara%20nih.%20Boleh%20minta%20detail%20pilihan%20menu%20dan%20harganya%3F`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-max bg-white text-[#06402B] px-4 py-2 rounded-xl font-bold text-[11px] shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
            >
              Pesan Catering Sekarang
            </a>
          </div>
        </div>
      </div>

      {/* Information Banner (Capsule) */}
      <div className="px-5 mb-8">
        <div className="bg-[#06402B] rounded-full py-2 px-4 text-white flex flex-row items-center justify-between relative overflow-hidden shadow-sm">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-16 bg-[#D4FF00] opacity-10 rounded-full -mr-4"></div>
          <div className="z-10 flex flex-col py-0.5">
            <h2 className="text-[9px] font-bold text-[#D4FF00] tracking-wider uppercase mb-0.5">#WargaAminoto</h2>
            <p className="text-[11px] font-semibold leading-tight text-white/90">Info promo & menu baru</p>
          </div>
          <a href="https://whatsapp.com/channel/0029VbD8HhwCxoAvHkviC43D" target="_blank" rel="noopener noreferrer" className="z-10 bg-[#D4FF00] text-[#06402B] px-4 py-1.5 rounded-full font-bold text-[10px] shadow-sm hover:bg-[#cbf200] transition-colors whitespace-nowrap shrink-0">
            Gabung &rarr;
          </a>
        </div>
      </div>

      {/* Kata #WargaAminoto: hanya review asli dari Google Maps (ULASAN di data.ts).
          Kosong = bagian ini disembunyikan. */}
      {ULASAN.length > 0 && (
        <div className="py-2 mb-4">
          <div className="px-5 mb-3 flex justify-between items-end gap-3">
            <h2 className="text-base font-bold tracking-tight text-gray-900">Kata #WargaAminoto</h2>
            {BRANCHES[0].mapsUrl && (
              <a href={BRANCHES[0].mapsUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold text-[#06402B] underline underline-offset-2 shrink-0">
                Lihat di Google Maps
              </a>
            )}
          </div>
          <div className="flex overflow-x-auto hide-scrollbar gap-3 px-5 pb-4 w-full">
            {ULASAN.map((ulasan, i) => (
              <div key={i} className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm min-w-[220px] max-w-[240px] flex flex-col gap-2 shrink-0">
                <div className="flex gap-1 text-yellow-400" aria-label={`${ulasan.bintang} dari 5 bintang`}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} size={12} fill="currentColor" strokeWidth={0} className={star <= ulasan.bintang ? '' : 'text-gray-200'} />
                  ))}
                </div>
                <p className="text-xs font-medium text-gray-700 italic leading-snug flex-1">
                  "{ulasan.teks}"
                </p>
                <div className="flex flex-col mt-auto pt-2 border-t border-gray-100">
                  <span className="text-xs font-bold text-gray-900">{ulasan.nama}</span>
                  <span className="text-[9px] text-gray-500 font-semibold">Google Maps · {ulasan.cabang}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Kunjungi Sosial Media Kami */}
      <div className="px-5 pb-8">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-6">Kunjungi Sosial Media Kami</h2>
        <div className="flex flex-wrap justify-center gap-2">
          <a href="https://www.instagram.com/pecellele.aminoto/" target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[100px] flex flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md hover:bg-gray-50 active:scale-[0.98] transition-all">
            <Instagram className="text-pink-600" size={16} strokeWidth={2} />
            <span className="text-xs font-semibold text-gray-700">Instagram</span>
          </a>
          <a href="https://www.facebook.com/pecelelesambeldadakaminoto/?locale=id_ID" target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[100px] flex flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md hover:bg-gray-50 active:scale-[0.98] transition-all">
            <Facebook className="text-blue-600" size={16} strokeWidth={2} />
            <span className="text-xs font-semibold text-gray-700">Facebook</span>
          </a>
          <a href="https://www.tiktok.com/@pecellele.aminoto" target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[100px] flex flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md hover:bg-gray-50 active:scale-[0.98] transition-all">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black">
              <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
            </svg>
            <span className="text-xs font-semibold text-gray-700">TikTok</span>
          </a>
        </div>
      </div>

      {/* Spacer to prevent content from being hidden behind Bottom Nav & Floating Cart */}
    </div>
  );
}
