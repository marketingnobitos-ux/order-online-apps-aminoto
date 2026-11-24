import React from 'react';
import { Check, ReceiptText, Store, MessageCircle, Copy, Users, FileText } from 'lucide-react';
import { PesananTerakhir, PaymentMethod } from '../types';
import { ADMIN_WHATSAPP, KOMUNITAS_WA_URL } from '../data';

// ── Penyimpanan pesanan terakhir ──────────────────────────────────
// Disimpan di localStorage (bukan sessionStorage) supaya tetap ada walau pelanggan
// kembali lewat tab baru, misalnya dari link di WhatsApp. Kedaluwarsa setelah 3 jam.
const KUNCI_PESANAN = 'aminoto-pesanan-terakhir';
const BATAS_UMUR_MS = 3 * 60 * 60 * 1000;

export function bacaPesananTerakhir(): PesananTerakhir | null {
  try {
    const data = JSON.parse(localStorage.getItem(KUNCI_PESANAN) ?? 'null');
    if (!data || typeof data.waktu !== 'number' || !data.kode || !Array.isArray(data.items)) return null;
    const umur = Date.now() - data.waktu;
    if (umur < 0 || umur > BATAS_UMUR_MS) {
      localStorage.removeItem(KUNCI_PESANAN);
      return null;
    }
    return data as PesananTerakhir;
  } catch {
    return null;
  }
}

export function simpanPesananTerakhir(pesanan: PesananTerakhir) {
  try {
    localStorage.setItem(KUNCI_PESANAN, JSON.stringify(pesanan));
  } catch {
    // Penyimpanan diblokir browser (mis. mode private): halaman tetap tampil di tab ini saja.
  }
}

export function hapusPesananTerakhir() {
  try {
    localStorage.removeItem(KUNCI_PESANAN);
  } catch {
    // Abaikan: tidak ada yang perlu dihapus.
  }
}

// Kode pesanan dari jam:menit kirim dalam WIB, mis. AMN-1132. Dipakai admin & pelanggan
// untuk menyebut pesanan yang sama; bukan nomor antrean dari sistem.
export function buatKodePesanan(waktu: Date = new Date()): string {
  const jamMenit = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(waktu).replace(':', '');
  return `AMN-${jamMenit}`;
}

const LABEL_BAYAR: Record<PaymentMethod, string> = {
  'BCA': 'Transfer BCA',
  'QRIS': 'QRIS',
  'BAYAR DI TEMPAT': 'Bayar di tempat',
};

const PETUNJUK_BAYAR: Record<PaymentMethod, string> = {
  'BCA': 'Transfer setelah admin konfirmasi total, lalu kirim bukti transfer di chat WA.',
  'QRIS': 'Admin kirim QRIS lewat WA. Scan, bayar, lalu kirim bukti di chat.',
  'BAYAR DI TEMPAT': 'Bayar di kasir saat ambil pesanan. Sebutkan kode pesanan kamu.',
};

const rupiah = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;

const formatWaktu = (ms: number) =>
  new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(new Date(ms));

export function PesananTerkirim({ pesanan, onSelesai }: { pesanan: PesananTerakhir; onSelesai: () => void }) {
  const [tersalin, setTersalin] = React.useState(false);
  const bayarDiTempat = pesanan.metodeBayar === 'BAYAR DI TEMPAT';

  const salinPesanan = async () => {
    try {
      await navigator.clipboard.writeText(pesanan.pesanWa);
      setTersalin(true);
      setTimeout(() => setTersalin(false), 2000);
    } catch {
      // Clipboard diblokir: tidak ada aksi lain.
    }
  };

  const langkah = [
    { label: 'Terkirim\nke WA', Ikon: Check, status: 'selesai' },
    { label: bayarDiTempat ? 'Konfirmasi\nadmin' : 'Konfirmasi\n& bayar', Ikon: ReceiptText, status: 'aktif' },
    { label: 'Ambil di\noutlet', Ikon: Store, status: 'nanti' },
  ] as const;

  return (
    <div className="flex flex-col min-h-full">
      <div className="bg-[#06402B] px-5 pt-5 pb-10 text-white">
        <p className="text-center text-sm font-semibold">Pesanan Terkirim</p>

        <div className="relative flex justify-between items-start mt-5">
          <div className="absolute top-5 left-[16.6%] right-[16.6%] h-0.5 bg-white/25" />
          <div className="absolute top-5 left-[16.6%] w-1/3 h-0.5 bg-[#D4FF00]" />
          {langkah.map(({ label, Ikon, status }) => (
            <div key={label} className="relative w-1/3 flex flex-col items-center text-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  status === 'selesai'
                    ? 'bg-[#D4FF00] text-[#06402B]'
                    : status === 'aktif'
                      ? 'bg-[#06402B] border-2 border-[#D4FF00] text-[#D4FF00]'
                      : 'bg-[#06402B] border-2 border-white/30 text-white/60'
                }`}
              >
                <Ikon size={18} strokeWidth={2.5} />
              </div>
              <p
                className={`mt-1.5 text-[11px] leading-tight whitespace-pre-line ${
                  status === 'aktif' ? 'text-[#D4FF00] font-semibold' : status === 'selesai' ? 'font-semibold' : 'text-white/60'
                }`}
              >
                {label}
              </p>
            </div>
          ))}
        </div>

        <p className="text-center text-[11px] text-white/70 mt-6">Kode pesanan</p>
        <p className="text-center text-4xl font-bold tracking-wider text-[#D4FF00]">{pesanan.kode}</p>
      </div>

      <div className="px-4 -mt-5 pb-6 flex flex-col gap-3">
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <p className="font-semibold text-sm text-gray-900">Tunggu balasan admin</p>
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
            Admin cek pesanan kamu, lalu kirim total dan info bayar lewat WhatsApp.
          </p>
          <div className="flex gap-2 mt-3">
            <a
              href={`https://wa.me/${ADMIN_WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[#06402B] text-[#06402B] text-xs font-semibold"
            >
              <MessageCircle size={14} strokeWidth={2.5} /> Buka chat lagi
            </a>
            <button
              onClick={salinPesanan}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs font-semibold"
            >
              {tersalin ? <Check size={14} strokeWidth={2.5} /> : <Copy size={14} strokeWidth={2.5} />}
              {tersalin ? 'Tersalin' : 'Salin pesanan'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <p className="text-[11px] text-gray-500">Metode bayar kamu</p>
          <div className="flex justify-between items-center mt-0.5">
            <span className="font-semibold text-sm text-gray-900">{LABEL_BAYAR[pesanan.metodeBayar] ?? pesanan.metodeBayar}</span>
            <span className="font-bold text-base text-[#06402B]">{rupiah(pesanan.total)}</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed">{PETUNJUK_BAYAR[pesanan.metodeBayar]}</p>
        </div>

        {KOMUNITAS_WA_URL && (
          <div className="bg-[#06402B] rounded-2xl p-4 text-white">
            <div className="flex gap-3 items-start">
              <div className="w-11 h-11 rounded-xl bg-[#D4FF00] text-[#06402B] flex items-center justify-center shrink-0">
                <Users size={22} strokeWidth={2.5} />
              </div>
              <div>
                <p className="font-bold text-[15px] text-[#D4FF00]">Gabung Komunitas Aminoto</p>
                <p className="text-xs text-white/85 mt-0.5 leading-relaxed">
                  Info menu baru, promo khusus member, dan kabar outlet duluan.
                </p>
              </div>
            </div>
            <a
              href={KOMUNITAS_WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#D4FF00] text-[#06402B] font-bold text-sm"
            >
              <MessageCircle size={18} strokeWidth={2.5} /> Masuk grup komunitas
            </a>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
            <span className="flex items-center gap-1.5 font-semibold text-[13px] text-gray-900">
              <FileText size={16} strokeWidth={2.5} /> Detail pesanan
            </span>
            <span className="text-[11px] text-gray-500">{formatWaktu(pesanan.waktu)}</span>
          </div>
          <div className="px-4 py-3 text-xs flex flex-col gap-1.5">
            <div className="flex justify-between gap-3">
              <span className="text-gray-500">Nama</span>
              <span className="font-semibold text-gray-900 capitalize text-right">{pesanan.nama.toLowerCase()}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-gray-500">Ambil di</span>
              <span className="font-semibold text-gray-900 text-right">{pesanan.cabang}</span>
            </div>
            <div className="border-t border-dashed border-gray-200 my-1.5" />
            {pesanan.items.map((item, idx) => (
              <div key={`${item.nama}-${item.varian ?? ''}-${idx}`} className="flex justify-between gap-3 text-gray-900">
                <span>
                  {item.jumlah}x {item.nama} {item.varian && `(${item.varian})`}
                </span>
                <span className="shrink-0">{rupiah(item.subtotal)}</span>
              </div>
            ))}
            {pesanan.catatan && (
              <p className="mt-1.5 text-gray-500 italic">Catatan: {pesanan.catatan}</p>
            )}
            <div className="border-t border-dashed border-gray-200 my-1.5" />
            <div className="flex justify-between font-bold text-gray-900 text-[13px]">
              <span>Total</span>
              <span>{rupiah(pesanan.total)}</span>
            </div>
          </div>
        </div>

        <button onClick={onSelesai} className="py-3 text-sm font-semibold text-[#06402B]">
          Kembali ke beranda
        </button>
      </div>
    </div>
  );
}
