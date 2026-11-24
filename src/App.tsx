import React, { useState, useEffect, useRef } from 'react';
import { ViewState, CartItem, PaymentMethod, PesananTerakhir } from './types';
import { Home } from './components/Home';
import { Menu } from './components/Menu';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { Review } from './components/Review';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { StickyCheckoutBar } from './components/StickyCheckoutBar';
import { FAQ } from './components/FAQ';
import { PesananTerkirim, bacaPesananTerakhir, simpanPesananTerakhir, hapusPesananTerakhir } from './components/PesananTerkirim';
// Admin di-lazy load agar supabase-js tidak ikut bundle pelanggan.
const Admin = React.lazy(() => import('./components/Admin').then(m => ({ default: m.Admin })));

// HP bisa membuang tab saat pelanggan pindah ke WhatsApp. Simpan sesi di sessionStorage
// supaya saat kembali halaman, keranjang, dan isian tidak hilang.
const KUNCI_SESI = 'aminoto-sesi';
const bacaSesi = () => {
  try {
    return JSON.parse(sessionStorage.getItem(KUNCI_SESI) ?? '{}') ?? {};
  } catch {
    return {};
  }
};
const simpanSesi = (data: object) => {
  try {
    sessionStorage.setItem(KUNCI_SESI, JSON.stringify(data));
  } catch {
    // Penyimpanan diblokir browser: app tetap jalan, hanya sesi tidak dipulihkan.
  }
};

export default function App() {
  const [sesi] = useState(bacaSesi);
  // Pesanan yang sudah dikirim ke WA (maks. 3 jam). Tab baru tanpa sesi langsung
  // membuka halaman Pesanan Terkirim selama pesanan ini masih berlaku.
  const [pesananTerakhir, setPesananTerakhir] = useState<PesananTerakhir | null>(bacaPesananTerakhir);
  const [view, setView] = useState<ViewState>(() => {
    const awal: ViewState = sesi.view ?? (pesananTerakhir ? 'terkirim' : 'home');
    return awal === 'terkirim' && !pesananTerakhir ? 'home' : awal;
  });
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0);
    }
  }, [view]);

  const [cart, setCart] = useState<CartItem[]>(sesi.cart ?? []);
  
  const [name, setName] = useState<string>(sesi.name ?? '');
  const [whatsapp, setWhatsapp] = useState<string>(sesi.whatsapp ?? '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>(sesi.paymentMethod ?? '');
  const [note, setNote] = useState<string>(sesi.note ?? '');
  const [selectedBranch, setSelectedBranch] = useState<string>(sesi.selectedBranch ?? 'Aminoto Cipto');

  useEffect(() => {
    simpanSesi({ view, cart, name, whatsapp, paymentMethod, note, selectedBranch });
  }, [view, cart, name, whatsapp, paymentMethod, note, selectedBranch]);

  const addToCart = (menuItem: any, variant?: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.menuItem.id === menuItem.id && item.variant === variant);
      if (existing) {
        return prev.map(item => (item.menuItem.id === menuItem.id && item.variant === variant) ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { menuItem, quantity: 1, variant }];
    });
  };

  const updateQuantity = (id: string, variant: string | undefined, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.menuItem.id === id && item.variant === variant) {
        return { ...item, quantity: Math.max(0, item.quantity + delta) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  // Dipanggil Review tepat sebelum WhatsApp dibuka. Sesi ditulis langsung (tidak menunggu
  // useEffect) karena browser bisa meninggalkan halaman sebelum React sempat render ulang.
  const catatPesananTerkirim = (pesanan: PesananTerakhir) => {
    simpanPesananTerakhir(pesanan);
    simpanSesi({ view: 'terkirim', cart: [], name, whatsapp, paymentMethod, note, selectedBranch });
    setPesananTerakhir(pesanan);
    setCart([]);
    setView('terkirim');
  };

  const selesaiPesanan = () => {
    hapusPesananTerakhir();
    setPesananTerakhir(null);
    setView('home');
  };

  // Halaman admin terpisah dari alur customer (URL /admin, tanpa tombol di menu).
  if (window.location.pathname.startsWith('/admin')) {
    return (
      <React.Suspense fallback={<div className="p-6 text-sm text-gray-500">Memuat…</div>}>
        <Admin />
      </React.Suspense>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] w-full overflow-hidden bg-gray-50 items-center justify-center">
      <div className="flex flex-col h-full w-full max-w-md bg-[#FDFBF7] shadow-xl relative overflow-hidden">
        <Header view={view} setView={setView} cart={cart} />
        
        <main ref={mainRef} className="flex-1 overflow-y-auto w-full relative pb-24">
          {view === 'home' && <Home setView={setView} />}
          {view === 'menu' && <Menu addToCart={addToCart} selectedBranch={selectedBranch} setSelectedBranch={setSelectedBranch} />}
          {view === 'cart' && <Cart cart={cart} updateQuantity={updateQuantity} setView={setView} />}
          {view === 'checkout' && (
            <Checkout 
              name={name} setName={setName}
              whatsapp={whatsapp} setWhatsapp={setWhatsapp}
              paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod}
              note={note} setNote={setNote}
              selectedBranch={selectedBranch} setSelectedBranch={setSelectedBranch}
              setView={setView}
              cart={cart}
            />
          )}
          {view === 'review' && (
            <Review 
              name={name} whatsapp={whatsapp} paymentMethod={paymentMethod as PaymentMethod} 
              note={note} selectedBranch={selectedBranch} cart={cart} 
              onTerkirim={catatPesananTerkirim} addToCart={addToCart}
            />
          )}
          {view === 'faq' && <FAQ />}
          {view === 'terkirim' && pesananTerakhir && (
            <PesananTerkirim pesanan={pesananTerakhir} onSelesai={selesaiPesanan} />
          )}
        </main>
        
        <StickyCheckoutBar cart={cart} setView={setView} view={view} />
        <BottomNav view={view} setView={setView} />
      </div>
    </div>
  );
}

