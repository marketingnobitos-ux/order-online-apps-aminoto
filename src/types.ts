export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: 'Makanan' | 'Minuman';
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  variant?: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  mapsUrl?: string;
  status: string;
  hours: string;
}

export type ViewState = 'home' | 'menu' | 'cart' | 'checkout' | 'review' | 'faq';

export type PaymentMethod = 'BCA' | 'QRIS' | 'BAYAR DI TEMPAT';
