import React, { useState, useMemo } from 'react';
import { CLOTHING_ITEMS } from '../data/clothingCatalog';
import { ClothingItem } from '../types/clothing';
import { Sparkles, RefreshCw, CheckCircle, AlertCircle, Shirt, Layers, Compass, ZoomIn } from 'lucide-react';

interface OutfitBuilderProps {
  onInspectItem: (item: ClothingItem) => void;
}

export const OutfitBuilder: React.FC<OutfitBuilderProps> = ({ onInspectItem }) => {
  const allItems = useMemo(() => Object.values(CLOTHING_ITEMS), []);

  const tops = useMemo(() => allItems.filter((i) => i.category === 'top'), [allItems]);
  const bottoms = useMemo(() => allItems.filter((i) => i.category === 'bottom'), [allItems]);
  const outers = useMemo(() => allItems.filter((i) => i.category === 'outerwear'), [allItems]);
  const shoes = useMemo(() => allItems.filter((i) => i.category === 'footwear'), [allItems]);
  const accessories = useMemo(() => allItems.filter((i) => i.category === 'accessory'), [allItems]);

  // Selected items
  const [selectedTopId, setSelectedTopId] = useState<string>(tops[0]?.id || '');
  const [selectedBottomId, setSelectedBottomId] = useState<string>(bottoms[0]?.id || '');
  const [selectedOuterId, setSelectedOuterId] = useState<string>(outers[0]?.id || '');
  const [selectedShoeId, setSelectedShoeId] = useState<string>(shoes[0]?.id || '');
  const [selectedAccId, setSelectedAccId] = useState<string>(accessories[0]?.id || '');

  const selectedTop = CLOTHING_ITEMS[selectedTopId] || tops[0];
  const selectedBottom = CLOTHING_ITEMS[selectedBottomId] || bottoms[0];
  const selectedOuter = CLOTHING_ITEMS[selectedOuterId] || outers[0];
  const selectedShoe = CLOTHING_ITEMS[selectedShoeId] || shoes[0];
  const selectedAcc = CLOTHING_ITEMS[selectedAccId] || accessories[0];

  // Dynamic compatibility evaluation
  const evaluation = useMemo(() => {
    let score = 88;
    const tips: string[] = [];
    const cautions: string[] = [];

    // Check color contrasts
    const isTopLight = ['#F5F5F0', '#FDFDFD', '#EFE8DC', '#D8CEBE', '#FFFFFF'].includes(selectedTop.colorHex);
    const isBottomDark = ['#374151', '#1E293B', '#1A233A', '#111111', '#121212'].includes(selectedBottom.colorHex);
    const isShoeLight = ['#FFFFFF', '#FDFDFD', '#F5F5F0'].includes(selectedShoe.colorHex);

    if (isTopLight && isBottomDark) {
      score += 6;
      tips.push('Classic contrast between light top and dark bottom creates grounded, authoritative visual weight.');
    }

    if (isTopLight && isShoeLight) {
      score += 5;
      tips.push('Sandwich Rule achieved! Matching light footwear with light upper layer frames your silhouette.');
    }

    if (selectedTop.fabric.includes('Linen') && selectedBottom.fabric.includes('Linen')) {
      score += 4;
      tips.push('Resort Harmony: Matching natural linen slub texture yields effortless summer coastal elegance.');
    }

    if (selectedOuter.fabric.includes('Leather') && selectedShoe.name.toLowerCase().includes('sneaker')) {
      tips.push('High-Low Mix: Leather jacket paired with casual sneakers creates contemporary street swagger.');
    }

    if (tips.length === 0) {
      tips.push('Harmonious neutral palette provides a calm, timeless appearance suitable for versatile settings.');
    }

    return {
      score: Math.min(score, 99),
      tips,
      cautions,
    };
  }, [selectedTop, selectedBottom, selectedOuter, selectedShoe, selectedAcc]);

  const randomize = () => {
    setSelectedTopId(tops[Math.floor(Math.random() * tops.length)].id);
    setSelectedBottomId(bottoms[Math.floor(Math.random() * bottoms.length)].id);
    setSelectedOuterId(outers[Math.floor(Math.random() * outers.length)].id);
    setSelectedShoeId(shoes[Math.floor(Math.random() * shoes.length)].id);
    setSelectedAccId(accessories[Math.floor(Math.random() * accessories.length)].id);
  };

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-3xl border border-zinc-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Interactive Visual Wardrobe Mixer</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-zinc-900">
            Mix & Match Real Clothing Images
          </h2>
          <p className="text-sm text-zinc-500 mt-0.5">
            Select items across each tier to preview live clothing photos and see their compatibility score.
          </p>
        </div>

        <button
          onClick={randomize}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium transition-colors shadow-xs shrink-0 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Shuffle Outfit Idea</span>
        </button>
      </div>

      {/* Main Grid: Visual Wardrobe Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: The Active Outfit Moodboard (Visual Gallery of Chosen Clothes) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {/* Top Card */}
            <div
              onClick={() => onInspectItem(selectedTop)}
              className="group relative bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:shadow-md transition-all cursor-pointer flex flex-col"
            >
              <div className="relative aspect-[4/5] bg-zinc-100 overflow-hidden">
                <img
                  src={selectedTop.imageUrl}
                  alt={selectedTop.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-zinc-800">
                  Top
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-xs text-white flex items-center gap-1 font-medium bg-black/60 px-2 py-1 rounded">
                    <ZoomIn className="w-3.5 h-3.5" /> Zoom
                  </span>
                </div>
              </div>
              <div className="p-3">
                <h4 className="text-xs font-semibold text-zinc-900 truncate">{selectedTop.name}</h4>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2.5 h-2.5 rounded-full border border-zinc-300" style={{ backgroundColor: selectedTop.colorHex }} />
                  <span className="text-[11px] text-zinc-500 truncate">{selectedTop.colorName}</span>
                </div>
              </div>
            </div>

            {/* Bottom Card */}
            <div
              onClick={() => onInspectItem(selectedBottom)}
              className="group relative bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:shadow-md transition-all cursor-pointer flex flex-col"
            >
              <div className="relative aspect-[4/5] bg-zinc-100 overflow-hidden">
                <img
                  src={selectedBottom.imageUrl}
                  alt={selectedBottom.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-zinc-800">
                  Bottom
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-xs text-white flex items-center gap-1 font-medium bg-black/60 px-2 py-1 rounded">
                    <ZoomIn className="w-3.5 h-3.5" /> Zoom
                  </span>
                </div>
              </div>
              <div className="p-3">
                <h4 className="text-xs font-semibold text-zinc-900 truncate">{selectedBottom.name}</h4>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2.5 h-2.5 rounded-full border border-zinc-300" style={{ backgroundColor: selectedBottom.colorHex }} />
                  <span className="text-[11px] text-zinc-500 truncate">{selectedBottom.colorName}</span>
                </div>
              </div>
            </div>

            {/* Outerwear Card */}
            <div
              onClick={() => onInspectItem(selectedOuter)}
              className="group relative bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:shadow-md transition-all cursor-pointer flex flex-col"
            >
              <div className="relative aspect-[4/5] bg-zinc-100 overflow-hidden">
                <img
                  src={selectedOuter.imageUrl}
                  alt={selectedOuter.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-zinc-800">
                  Layer
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-xs text-white flex items-center gap-1 font-medium bg-black/60 px-2 py-1 rounded">
                    <ZoomIn className="w-3.5 h-3.5" /> Zoom
                  </span>
                </div>
              </div>
              <div className="p-3">
                <h4 className="text-xs font-semibold text-zinc-900 truncate">{selectedOuter.name}</h4>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2.5 h-2.5 rounded-full border border-zinc-300" style={{ backgroundColor: selectedOuter.colorHex }} />
                  <span className="text-[11px] text-zinc-500 truncate">{selectedOuter.colorName}</span>
                </div>
              </div>
            </div>

            {/* Footwear Card */}
            <div
              onClick={() => onInspectItem(selectedShoe)}
              className="group relative bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:shadow-md transition-all cursor-pointer flex flex-col"
            >
              <div className="relative aspect-[4/5] bg-zinc-100 overflow-hidden">
                <img
                  src={selectedShoe.imageUrl}
                  alt={selectedShoe.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-zinc-800">
                  Footwear
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-xs text-white flex items-center gap-1 font-medium bg-black/60 px-2 py-1 rounded">
                    <ZoomIn className="w-3.5 h-3.5" /> Zoom
                  </span>
                </div>
              </div>
              <div className="p-3">
                <h4 className="text-xs font-semibold text-zinc-900 truncate">{selectedShoe.name}</h4>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2.5 h-2.5 rounded-full border border-zinc-300" style={{ backgroundColor: selectedShoe.colorHex }} />
                  <span className="text-[11px] text-zinc-500 truncate">{selectedShoe.colorName}</span>
                </div>
              </div>
            </div>

            {/* Accessory Card */}
            <div
              onClick={() => onInspectItem(selectedAcc)}
              className="group relative bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:shadow-md transition-all cursor-pointer flex flex-col"
            >
              <div className="relative aspect-[4/5] bg-zinc-100 overflow-hidden">
                <img
                  src={selectedAcc.imageUrl}
                  alt={selectedAcc.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-zinc-800">
                  Accent
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-xs text-white flex items-center gap-1 font-medium bg-black/60 px-2 py-1 rounded">
                    <ZoomIn className="w-3.5 h-3.5" /> Zoom
                  </span>
                </div>
              </div>
              <div className="p-3">
                <h4 className="text-xs font-semibold text-zinc-900 truncate">{selectedAcc.name}</h4>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2.5 h-2.5 rounded-full border border-zinc-300" style={{ backgroundColor: selectedAcc.colorHex }} />
                  <span className="text-[11px] text-zinc-500 truncate">{selectedAcc.colorName}</span>
                </div>
              </div>
            </div>

            {/* Palette Summary Card */}
            <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Live Palette</span>
                <h5 className="text-xs font-semibold text-stone-900 mt-1 mb-2">Selected Color Harmony</h5>
                <div className="flex items-center gap-2">
                  {[selectedTop, selectedBottom, selectedOuter, selectedShoe, selectedAcc].map((item, idx) => (
                    <div
                      key={idx}
                      className="w-5 h-5 rounded-full border border-zinc-300 shadow-2xs shrink-0"
                      style={{ backgroundColor: item.colorHex }}
                      title={`${item.name} (${item.colorName})`}
                    />
                  ))}
                </div>
              </div>
              <div className="pt-2 border-t border-stone-200/60 text-[11px] text-stone-600">
                Cohesive tones balanced across 5 pieces.
              </div>
            </div>
          </div>

          {/* Real-time Stylist Feedback on this Combination */}
          <div className="p-6 bg-white border border-zinc-200 rounded-3xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-700">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Stylist Harmony Feedback</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                <span>Compatibility: {evaluation.score}/100</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              {evaluation.tips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs md:text-sm text-zinc-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>{tip}</span>
                </div>
              ))}
              {evaluation.cautions.map((caution, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs md:text-sm text-amber-700">
                  <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  <span>{caution}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Garment Selection Selectors with Thumbnails */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 bg-white border border-zinc-200 rounded-3xl space-y-4 max-h-[720px] overflow-y-auto">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900">
              Wardrobe Selectors
            </h3>

            {/* Top selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-600 flex items-center gap-1.5">
                <Shirt className="w-3.5 h-3.5" /> Top Garment
              </label>
              <div className="grid grid-cols-2 gap-2">
                {tops.map((top) => (
                  <button
                    key={top.id}
                    onClick={() => setSelectedTopId(top.id)}
                    className={`flex items-center gap-2 p-1.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedTopId === top.id
                        ? 'border-amber-600 bg-amber-50/50 ring-1 ring-amber-600'
                        : 'border-zinc-200 hover:border-zinc-300 bg-white'
                    }`}
                  >
                    <img src={top.imageUrl} alt={top.name} className="w-9 h-9 object-cover rounded-lg shrink-0" />
                    <span className="text-[11px] font-medium text-zinc-800 line-clamp-2 leading-tight">
                      {top.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom selector */}
            <div className="space-y-1.5 pt-3 border-t border-zinc-100">
              <label className="text-xs font-semibold text-zinc-600 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> Bottoms / Trousers
              </label>
              <div className="grid grid-cols-2 gap-2">
                {bottoms.map((bottom) => (
                  <button
                    key={bottom.id}
                    onClick={() => setSelectedBottomId(bottom.id)}
                    className={`flex items-center gap-2 p-1.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedBottomId === bottom.id
                        ? 'border-amber-600 bg-amber-50/50 ring-1 ring-amber-600'
                        : 'border-zinc-200 hover:border-zinc-300 bg-white'
                    }`}
                  >
                    <img src={bottom.imageUrl} alt={bottom.name} className="w-9 h-9 object-cover rounded-lg shrink-0" />
                    <span className="text-[11px] font-medium text-zinc-800 line-clamp-2 leading-tight">
                      {bottom.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Outerwear selector */}
            <div className="space-y-1.5 pt-3 border-t border-zinc-100">
              <label className="text-xs font-semibold text-zinc-600 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> Outerwear Layer
              </label>
              <div className="grid grid-cols-2 gap-2">
                {outers.map((outer) => (
                  <button
                    key={outer.id}
                    onClick={() => setSelectedOuterId(outer.id)}
                    className={`flex items-center gap-2 p-1.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedOuterId === outer.id
                        ? 'border-amber-600 bg-amber-50/50 ring-1 ring-amber-600'
                        : 'border-zinc-200 hover:border-zinc-300 bg-white'
                    }`}
                  >
                    <img src={outer.imageUrl} alt={outer.name} className="w-9 h-9 object-cover rounded-lg shrink-0" />
                    <span className="text-[11px] font-medium text-zinc-800 line-clamp-2 leading-tight">
                      {outer.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Footwear selector */}
            <div className="space-y-1.5 pt-3 border-t border-zinc-100">
              <label className="text-xs font-semibold text-zinc-600 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" /> Footwear
              </label>
              <div className="grid grid-cols-2 gap-2">
                {shoes.map((shoe) => (
                  <button
                    key={shoe.id}
                    onClick={() => setSelectedShoeId(shoe.id)}
                    className={`flex items-center gap-2 p-1.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedShoeId === shoe.id
                        ? 'border-amber-600 bg-amber-50/50 ring-1 ring-amber-600'
                        : 'border-zinc-200 hover:border-zinc-300 bg-white'
                    }`}
                  >
                    <img src={shoe.imageUrl} alt={shoe.name} className="w-9 h-9 object-cover rounded-lg shrink-0" />
                    <span className="text-[11px] font-medium text-zinc-800 line-clamp-2 leading-tight">
                      {shoe.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
