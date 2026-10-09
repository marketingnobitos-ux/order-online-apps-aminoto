import React, { useState, useEffect, useRef } from 'react';
import { ViewState, CartItem, PaymentMethod } from './types';
import { Home } from './components/Home';
import { Menu } from './components/Menu';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { Review } from './components/Review';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { StickyCheckoutBar } from './components/StickyCheckoutBar';
import { FAQ } from './components/FAQ';
// Admin di-lazy load agar supabase-js tidak ikut bundle pelanggan.
const Admin = React.lazy(() => import('./components/Admin').then(m => ({ default: m.Admin })));

export default function App() {
  const [view, setView] = useState<ViewState>('home');
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0);
    }
  }, [view]);

  const [cart, setCart] = useState<CartItem[]>([]);
  
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>('');
  const [note, setNote] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('Aminoto Cipto');

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

  const clearCart = () => setCart([]);

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
              setView={setView} clearCart={clearCart} addToCart={addToCart}
            />
          )}
          {view === 'faq' && <FAQ />}
        </main>
        
        <StickyCheckoutBar cart={cart} setView={setView} view={view} />
        <BottomNav view={view} setView={setView} />
      </div>
    </div>
  );
}

