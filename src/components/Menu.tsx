import React, { useState, useMemo } from 'react';
import { MENU_ITEMS, BRANCHES } from '../data';
import { Search, Plus } from 'lucide-react';
import { MenuItem } from '../types';

const TABS = ['Semua', 'Makanan', 'Minuman'];

export function Menu({ addToCart, selectedBranch, setSelectedBranch }: { addToCart: (item: MenuItem, variant?: string) => void; selectedBranch: string; setSelectedBranch: (v: string) => void; }) {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('Semua');
  
  const [variantModalItem, setVariantModalItem] = useState<MenuItem | null>(null);
  const [selectedCooking, setSelectedCooking] = useState<string | null>(null);
  const [selectedCut, setSelectedCut] = useState<string | null>(null);

  const filteredMenu = useMemo(() => {
    return MENU_ITEMS.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || (item.description && item.description.toLowerCase().includes(search.toLowerCase()));
      const matchTab = activeTab === 'Semua' || item.category === activeTab;
      return matchSearch && matchTab;
    });
  }, [search, activeTab]);

  const handleAddClick = (item: MenuItem) => {
    const nameLower = item.name.toLowerCase();
    const needsVariant = ['gurame', 'nila', 'ayam negri', 'ayam kampung', 'bebek'].includes(nameLower);
    
    if (needsVariant) {
      setVariantModalItem(item);
      setSelectedCooking(null);
      setSelectedCut(null);
    } else {
      addToCart(item);
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      <div className="sticky top-0 bg-[#FDFBF7] z-50 border-b border-gray-100 px-5 pt-4 pb-2 shadow-sm">
        <div className="flex justify-between items-center mb-5">
          <span className="text-gray-500 font-semibold text-sm">Pilih Pesanan Anda</span>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            aria-label="Pilih cabang"
            className="bg-gray-100 text-gray-800 text-[10px] font-bold pl-3 pr-2 py-1.5 rounded-full border border-gray-200 outline-none focus:border-[#06402B] focus:ring-1 focus:ring-[#06402B] transition-all"
          >
            {BRANCHES.map(b => (
              <option key={b.id} value={b.name}>{b.name}</option>
            ))}
          </select>
        </div>
        
        <div className="relative mb-5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} strokeWidth={2} />
          <input 
            type="text" 
            placeholder="Cari menu favoritmu di sini..." 
            className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-11 pr-4 text-sm font-medium focus:outline-none focus:border-[#06402B] focus:ring-1 focus:ring-[#06402B] transition-all shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-1">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 px-4 py-2 rounded-xl text-[13px] font-bold whitespace-nowrap transition-all border ${activeTab === tab ? 'bg-[#06402B] text-white border-transparent shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 flex flex-col mt-4">
        {TABS.filter(c => c !== 'Semua').map(category => {
          const categoryItems = filteredMenu.filter(item => item.category === category);
          
          if (categoryItems.length === 0) return null;

          return (
            <div key={category} className="mb-6 last:mb-0">
              <h2 className="text-lg font-bold text-gray-900 mb-3">{category}</h2>
              <div className="flex flex-col gap-3">
                {categoryItems.map(item => (
                  <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex justify-between items-stretch gap-3">
                    <div className="flex flex-col flex-1 justify-between min-h-[76px]">
                      <div className="mb-2">
                        <span className="text-[15px] font-bold text-gray-900 leading-tight block">{item.name}</span>
                        {item.description && <span className="text-[13px] font-medium text-gray-500 mt-1 leading-snug block">{item.description}</span>}
                      </div>
                      <span className="font-bold text-[#06402B] text-[15px] mt-auto block">Rp {item.price.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex items-end justify-end flex-shrink-0">
                      <button 
                        onClick={() => handleAddClick(item)}
                        className="w-9 h-9 rounded-full bg-[#06402B] flex items-center justify-center text-[#D4FF00] shadow-sm hover:shadow-md active:scale-95 transition-all"
                      >
                        <Plus size={20} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {filteredMenu.length === 0 && (
          <div className="text-center py-10 text-gray-400 font-medium text-sm">
            Menu tidak ditemukan.
          </div>
        )}
      </div>

      <div className="px-5 mt-8">
        <div className="bg-[#06402B] rounded-2xl p-4 flex gap-3 items-center text-white border-l-8 border-[#D4FF00] shadow-sm">
          <span className="text-[11px] font-semibold leading-relaxed">
            <strong className="text-[#D4FF00]">BISA DIBAKAR</strong> UNTUK MENU IKAN GURAME, NILA, AYAM & BEBEK (+ Rp2.000)
          </span>
        </div>
      </div>

      {/* Spacer to prevent content from being hidden behind Bottom Nav & Floating Cart */}
      <div className="h-48 w-full shrink-0"></div>

      {variantModalItem && (() => {
        const nameLower = variantModalItem.name.toLowerCase();
        const needsCut = ['ayam negri', 'ayam kampung', 'bebek'].includes(nameLower);
        const finalPrice = variantModalItem.price + (selectedCooking === 'Bakar' ? 2000 : 0);
        const isReadyToAdd = selectedCooking && (!needsCut || selectedCut);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-sm rounded-3xl border border-gray-100 p-6 shadow-2xl flex flex-col gap-6">
              <div className="flex flex-col gap-1 text-center">
                <h3 className="font-bold text-xl text-gray-900 tracking-tight">{variantModalItem.name}</h3>
                <p className="text-sm font-medium text-gray-500">Sesuaikan pesanan Anda</p>
              </div>
              
              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-bold text-gray-900">Cara Masak</h4>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setSelectedCooking('Goreng')}
                    className={`flex-1 py-3 px-3 rounded-2xl border flex flex-col items-center justify-center transition-all ${selectedCooking === 'Goreng' ? 'border-[#06402B] bg-[#F4FBF4] shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                  >
                    <span className={`font-bold text-sm ${selectedCooking === 'Goreng' ? 'text-[#06402B]' : 'text-gray-700'}`}>Goreng</span>
                  </button>
                  <button 
                    onClick={() => setSelectedCooking('Bakar')}
                    className={`flex-1 py-3 px-3 rounded-2xl border flex flex-col items-center justify-center transition-all ${selectedCooking === 'Bakar' ? 'border-[#06402B] bg-[#F4FBF4] shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                  >
                    <span className={`font-bold text-sm ${selectedCooking === 'Bakar' ? 'text-[#06402B]' : 'text-gray-700'}`}>Bakar</span>
                    <span className={`font-semibold text-[11px] ${selectedCooking === 'Bakar' ? 'text-[#06402B]' : 'text-gray-500'}`}>+ Rp 2.000</span>
                  </button>
                </div>
              </div>

              {needsCut && (
                <div className="flex flex-col gap-3">
                  <h4 className="text-sm font-bold text-gray-900">Pilihan Potongan</h4>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setSelectedCut('Paha')}
                      className={`flex-1 py-3 px-3 rounded-2xl border flex flex-col items-center justify-center transition-all ${selectedCut === 'Paha' ? 'border-[#06402B] bg-[#F4FBF4] shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                    >
                      <span className={`font-bold text-sm ${selectedCut === 'Paha' ? 'text-[#06402B]' : 'text-gray-700'}`}>Paha</span>
                    </button>
                    <button 
                      onClick={() => setSelectedCut('Dada')}
                      className={`flex-1 py-3 px-3 rounded-2xl border flex flex-col items-center justify-center transition-all ${selectedCut === 'Dada' ? 'border-[#06402B] bg-[#F4FBF4] shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                    >
                      <span className={`font-bold text-sm ${selectedCut === 'Dada' ? 'text-[#06402B]' : 'text-gray-700'}`}>Dada</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3 mt-2">
                <button 
                  onClick={() => {
                    if (isReadyToAdd) {
                      const finalItem = { ...variantModalItem };
                      finalItem.price = finalPrice;
                      const variantString = needsCut ? `${selectedCooking}, ${selectedCut}` : selectedCooking;
                      addToCart(finalItem, variantString as string);
                      setVariantModalItem(null);
                    }
                  }}
                  disabled={!isReadyToAdd}
                  className={`w-full py-4 rounded-xl font-bold text-sm transition-all ${isReadyToAdd ? 'bg-[#06402B] text-white shadow-md hover:shadow-lg' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                >
                  Tambah ke Keranjang - Rp {finalPrice.toLocaleString('id-ID')}
                </button>
                <button 
                  onClick={() => setVariantModalItem(null)}
                  className="w-full py-3 rounded-xl font-bold text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
