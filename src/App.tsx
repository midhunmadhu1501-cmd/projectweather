import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AdviceDisplay } from './components/AdviceDisplay';
import { OutfitBuilder } from './components/OutfitBuilder';
import { ColorGuide } from './components/ColorGuide';
import { AskStylist } from './components/AskStylist';
import { ItemImageModal } from './components/ItemImageModal';
import { SavedModal } from './components/SavedModal';
import { OUTFIT_ADVICE_DATABASE } from './data/outfitAdviceDatabase';
import { OutfitAdvice, ClothingItem, GenderStyle, OccasionType } from './types/clothing';
import { Sparkles, Filter, ChevronRight, Check } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'advisor' | 'builder' | 'ask' | 'colors'>('advisor');
  const [selectedAdviceId, setSelectedAdviceId] = useState<string>(OUTFIT_ADVICE_DATABASE[0].id);

  // Filters for Advisor tab
  const [genderFilter, setGenderFilter] = useState<GenderStyle | 'all'>('all');
  const [occasionFilter, setOccasionFilter] = useState<OccasionType | 'all'>('all');

  // Inspected Item Lightbox Modal
  const [inspectedItem, setInspectedItem] = useState<ClothingItem | null>(null);

  // Saved outfits (stored in localStorage)
  const [savedOutfits, setSavedOutfits] = useState<OutfitAdvice[]>([]);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem('dress_sense_saved');
      if (stored) {
        setSavedOutfits(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const toggleSaveOutfit = (outfit: OutfitAdvice) => {
    setSavedOutfits((prev) => {
      const exists = prev.some((o) => o.id === outfit.id);
      let next: OutfitAdvice[];
      if (exists) {
        next = prev.filter((o) => o.id !== outfit.id);
        showToast('Removed from saved looks');
      } else {
        next = [...prev, outfit];
        showToast('Saved to your style lookbook');
      }
      try {
        localStorage.setItem('dress_sense_saved', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const removeSavedOutfit = (id: string) => {
    setSavedOutfits((prev) => {
      const next = prev.filter((o) => o.id !== id);
      try {
        localStorage.setItem('dress_sense_saved', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Filtered outfit list
  const filteredOutfits = OUTFIT_ADVICE_DATABASE.filter((o) => {
    if (genderFilter !== 'all' && o.gender !== genderFilter && o.gender !== 'unisex') return false;
    if (occasionFilter !== 'all' && o.occasion !== occasionFilter) return false;
    return true;
  });

  // Active outfit
  const currentAdvice =
    OUTFIT_ADVICE_DATABASE.find((o) => o.id === selectedAdviceId) ||
    filteredOutfits[0] ||
    OUTFIT_ADVICE_DATABASE[0];

  const isCurrentSaved = savedOutfits.some((o) => o.id === currentAdvice.id);

  return (
    <div className="min-h-screen bg-stone-100/60 text-zinc-900 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedOutfits.length}
        onOpenSaved={() => setIsSavedModalOpen(true)}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10">
        {/* TAB 1: OUTFIT ADVISOR */}
        {activeTab === 'advisor' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header Kicker */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-zinc-200">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>Curated Visual Dressing Advice</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-serif font-black text-zinc-950 tracking-tight">
                  The Sartorial Advisor
                </h1>
                <p className="text-sm md:text-base text-zinc-600 mt-1 max-w-2xl">
                  Explore complete outfit recommendations with visual images of every garment piece, fabric recommendations, and color harmony rules.
                </p>
              </div>

              {/* Quick Status / Item count */}
              <div className="text-xs text-zinc-500 font-medium">
                Showing {filteredOutfits.length} curated masterclass look{filteredOutfits.length === 1 ? '' : 's'}
              </div>
            </div>

            {/* Filter Bar: Segmented controls (zero-pill design) */}
            <div className="p-4 bg-white rounded-2xl border border-zinc-200 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
              {/* Gender style filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 mr-1.5 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-zinc-500" /> Style:
                </span>
                {(['all', 'womens', 'mens', 'unisex'] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGenderFilter(g)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                      genderFilter === g
                        ? 'bg-zinc-950 text-white shadow-2xs'
                        : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                    }`}
                  >
                    {g === 'all' ? 'All Styles' : g}
                  </button>
                ))}
              </div>

              {/* Occasion filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 mr-1.5">
                  Occasion:
                </span>
                {[
                  { id: 'all', label: 'All Occasions' },
                  { id: 'smart_casual', label: 'Smart Casual' },
                  { id: 'business_formal', label: 'Executive' },
                  { id: 'date_night', label: 'Date Night' },
                  { id: 'summer_vacation', label: 'Resort Linen' },
                  { id: 'autumn_winter', label: 'Autumn Chic' },
                ].map((occ) => (
                  <button
                    key={occ.id}
                    onClick={() => setOccasionFilter(occ.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                      occasionFilter === occ.id
                        ? 'bg-amber-100 text-amber-950 border border-amber-300/80'
                        : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                    }`}
                  >
                    {occ.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Curated Outfits Carousel / Look Picker */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Browse Visual Looks & Advice Collections
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {filteredOutfits.map((look) => (
                  <button
                    key={look.id}
                    onClick={() => setSelectedAdviceId(look.id)}
                    className={`group text-left rounded-2xl p-2 transition-all border cursor-pointer flex flex-col justify-between ${
                      selectedAdviceId === look.id
                        ? 'bg-white border-amber-600 ring-2 ring-amber-600/20 shadow-md'
                        : 'bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-zinc-100 mb-2">
                      <img
                        src={look.fullLookImageUrl}
                        alt={look.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-1.5 left-1.5 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-zinc-950/80 text-white backdrop-blur-xs">
                        {look.occasion.replace('_', ' ')}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900 group-hover:text-amber-800 transition-colors line-clamp-1">
                        {look.title}
                      </h4>
                      <p className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5 capitalize">
                        {look.gender} · {look.weather.replace('_', ' ')}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* The Flagship Advice Display */}
            {currentAdvice && (
              <AdviceDisplay
                advice={currentAdvice}
                isSaved={isCurrentSaved}
                onToggleSave={toggleSaveOutfit}
                onInspectItem={(item) => setInspectedItem(item)}
              />
            )}
          </div>
        )}

        {/* TAB 2: WARDROBE MIXER / BUILDER */}
        {activeTab === 'builder' && (
          <div className="animate-fadeIn">
            <OutfitBuilder onInspectItem={(item) => setInspectedItem(item)} />
          </div>
        )}

        {/* TAB 3: ASK CUSTOM ADVICE */}
        {activeTab === 'ask' && (
          <div className="animate-fadeIn">
            <AskStylist onInspectItem={(item) => setInspectedItem(item)} />
          </div>
        )}

        {/* TAB 4: COLOR SCIENCE & UNDERTONES */}
        {activeTab === 'colors' && (
          <div className="animate-fadeIn">
            <ColorGuide />
          </div>
        )}
      </main>

      {/* Item Image Lightbox Modal */}
      <ItemImageModal
        item={inspectedItem}
        onClose={() => setInspectedItem(null)}
      />

      {/* Saved Looks Drawer/Modal */}
      <SavedModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedOutfits={savedOutfits}
        onRemoveOutfit={removeSavedOutfit}
        onSelectOutfit={(outfit) => {
          setSelectedAdviceId(outfit.id);
          setActiveTab('advisor');
        }}
        onInspectItem={(item) => setInspectedItem(item)}
      />

      {/* Floating Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-zinc-950 text-white px-4 py-2.5 rounded-xl shadow-xl border border-zinc-800 text-xs font-medium animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-zinc-800">DressSense</span>
            <span>·</span>
            <span>Visual Clothing & Wardrobe Intelligence Engine</span>
          </div>
          <div>
            <span>Curated with real fashion garments, optical color theory, and rule-of-thirds styling.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
