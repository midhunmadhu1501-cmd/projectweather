import React from 'react';
import { Sparkles, Bookmark, Shirt, Palette, MessageSquareText, Layers } from 'lucide-react';

interface NavbarProps {
  activeTab: 'advisor' | 'builder' | 'ask' | 'colors';
  setActiveTab: (tab: 'advisor' | 'builder' | 'ask' | 'colors') => void;
  savedCount: number;
  onOpenSaved: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  onOpenSaved,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('advisor')}>
            <div className="w-10 h-10 rounded-2xl bg-zinc-950 flex items-center justify-center text-white shadow-md">
              <Shirt className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-serif font-black tracking-tight text-zinc-950">
                  DressSense
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Visual Styling
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-normal">
                Expert Clothing Advice with Visual Garment References
              </p>
            </div>
          </div>

          {/* Navigation Controls (Clean segmented buttons, zero pills) */}
          <nav className="hidden md:flex items-center gap-1 p-1.5 bg-zinc-100 rounded-2xl border border-zinc-200">
            <button
              onClick={() => setActiveTab('advisor')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'advisor'
                  ? 'bg-white text-zinc-950 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-white/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Outfit Advisor</span>
            </button>

            <button
              onClick={() => setActiveTab('builder')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'builder'
                  ? 'bg-white text-zinc-950 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-white/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-zinc-600" />
              <span>Wardrobe Mixer</span>
            </button>

            <button
              onClick={() => setActiveTab('ask')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'ask'
                  ? 'bg-white text-zinc-950 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-white/50'
              }`}
            >
              <MessageSquareText className="w-3.5 h-3.5 text-zinc-600" />
              <span>Ask Custom Advice</span>
            </button>

            <button
              onClick={() => setActiveTab('colors')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'colors'
                  ? 'bg-white text-zinc-950 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-white/50'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-zinc-600" />
              <span>Color Rules & Tones</span>
            </button>
          </nav>

          {/* Right Action: Saved Looks */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSaved}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-800 text-xs font-medium transition-all shadow-2xs cursor-pointer"
            >
              <Bookmark className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline">Saved Looks</span>
              <span className="px-1.5 py-0.2 bg-zinc-200 text-zinc-800 rounded text-[11px] font-bold">
                {savedCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Subnav */}
        <div className="flex md:hidden overflow-x-auto py-2.5 gap-2 border-t border-zinc-100 no-scrollbar">
          <button
            onClick={() => setActiveTab('advisor')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 ${
              activeTab === 'advisor' ? 'bg-zinc-950 text-white' : 'bg-zinc-100 text-zinc-700'
            }`}
          >
            Outfit Advisor
          </button>
          <button
            onClick={() => setActiveTab('builder')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 ${
              activeTab === 'builder' ? 'bg-zinc-950 text-white' : 'bg-zinc-100 text-zinc-700'
            }`}
          >
            Wardrobe Mixer
          </button>
          <button
            onClick={() => setActiveTab('ask')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 ${
              activeTab === 'ask' ? 'bg-zinc-950 text-white' : 'bg-zinc-100 text-zinc-700'
            }`}
          >
            Ask Stylist
          </button>
          <button
            onClick={() => setActiveTab('colors')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 ${
              activeTab === 'colors' ? 'bg-zinc-950 text-white' : 'bg-zinc-100 text-zinc-700'
            }`}
          >
            Color Rules
          </button>
        </div>
      </div>
    </header>
  );
};
