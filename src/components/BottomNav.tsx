import React from 'react';
import { Home, Utensils, HelpCircle } from 'lucide-react';
import { ViewState } from '../types';

export function BottomNav({ view, setView }: { view: ViewState, setView: (v: ViewState) => void }) {
  return (
    <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-[60]">
      <button 
        onClick={() => setView('home')} 
        className={`flex flex-col items-center gap-1 w-16 transition-colors ${view === 'home' ? 'text-[#06402B]' : 'text-gray-400 hover:text-gray-600'}`}
      >
        <Home className="w-6 h-6" strokeWidth={view === 'home' ? 2.5 : 2} />
        <span className="text-[10px] font-semibold">Beranda</span>
      </button>

      <button 
        onClick={() => setView('menu')} 
        className={`flex flex-col items-center gap-1 w-16 transition-colors ${view === 'menu' ? 'text-[#06402B]' : 'text-gray-400 hover:text-gray-600'}`}
      >
        <Utensils className="w-6 h-6" strokeWidth={view === 'menu' ? 2.5 : 2} />
        <span className="text-[10px] font-semibold">Menu</span>
      </button>

      <button 
        onClick={() => setView('faq')} 
        className={`flex flex-col items-center gap-1 w-16 transition-colors ${view === 'faq' ? 'text-[#06402B]' : 'text-gray-400 hover:text-gray-600'}`}
      >
        <HelpCircle className="w-6 h-6" strokeWidth={view === 'faq' ? 2.5 : 2} />
        <span className="text-[10px] font-semibold">FAQ</span>
      </button>
    </div>
  );
}
