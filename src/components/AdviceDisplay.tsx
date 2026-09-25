import React, { useState } from 'react';
import {
  OutfitAdvice,
  ClothingItem
} from '../types/clothing';
import {
  Sparkles,
  Check,
  X as XIcon,
  Layers,
  ZoomIn,
  Bookmark,
  BookmarkCheck,
  Share2,
  Palette,
  Compass,
  Shirt,
  Info
} from 'lucide-react';

interface AdviceDisplayProps {
  advice: OutfitAdvice;
  isSaved?: boolean;
  onToggleSave?: (advice: OutfitAdvice) => void;
  onInspectItem: (item: ClothingItem) => void;
}

export const AdviceDisplay: React.FC<AdviceDisplayProps> = ({
  advice,
  isSaved = false,
  onToggleSave,
  onInspectItem
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const text = `Dress Sense: ${advice.title}\n${advice.summary}\nWhy it works: ${advice.whyItWorks}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const garmentEntries = [
    { label: 'Top Garment', item: advice.items.top, icon: Shirt },
    { label: 'Trousers / Bottom', item: advice.items.bottom, icon: Layers },
    ...(advice.items.outerwear ? [{ label: 'Outerwear / Layer', item: advice.items.outerwear, icon: Layers }] : []),
    { label: 'Footwear', item: advice.items.footwear, icon: Compass },
    { label: 'Signature Accent', item: advice.items.accessory, icon: Sparkles },
  ];

  return (
    <article className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden transition-all duration-300">
      {/* Editorial Header / Hero Outfit Look */}
      <div className="relative w-full h-80 md:h-[420px] bg-zinc-950 overflow-hidden group">
        <img
          src={advice.fullLookImageUrl}
          alt={advice.title}
          className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700 opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

        {/* Top Badges & Actions */}
        <div className="absolute top-5 inset-x-5 flex items-center justify-between z-10">
          <div className="flex items-center gap-2 text-xs text-white/90 bg-zinc-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
            <span className="font-semibold uppercase tracking-wider">{advice.gender}</span>
            <span className="text-white/40">·</span>
            <span className="capitalize">{advice.occasion.replace('_', ' ')}</span>
            <span className="text-white/40">·</span>
            <span className="capitalize">{advice.weather.replace('_', ' ')}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2.5 rounded-full bg-zinc-900/80 hover:bg-zinc-900 text-white backdrop-blur-md border border-white/10 transition-colors shadow-md cursor-pointer"
              title="Copy Outfit Advice"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            {onToggleSave && (
              <button
                onClick={() => onToggleSave(advice)}
                className={`p-2.5 rounded-full backdrop-blur-md border transition-all shadow-md cursor-pointer ${
                  isSaved
                    ? 'bg-amber-500 text-zinc-950 border-amber-400'
                    : 'bg-zinc-900/80 hover:bg-zinc-900 text-white border-white/10'
                }`}
                title={isSaved ? 'Remove from saved' : 'Save outfit to collection'}
              >
                {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="absolute bottom-6 inset-x-6 z-10 text-white">
          <div className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Complete Ensemble Advice</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-serif font-bold text-white tracking-tight mb-2">
            {advice.title}
          </h2>
          <p className="text-sm md:text-base text-zinc-300 max-w-2xl font-light leading-relaxed">
            {advice.subtitle}
          </p>
        </div>
      </div>

      <div className="p-6 md:p-10 space-y-10">
        {/* Core Advice Summary & Sartorial Rationale */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-widest">
              <Info className="w-4 h-4 text-zinc-500" />
              <span>Stylist Recommendation</span>
            </div>
            <p className="text-base md:text-lg text-zinc-800 leading-relaxed font-normal">
              {advice.summary}
            </p>
            <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200/80">
              <h4 className="text-xs uppercase font-bold text-stone-900 tracking-wider mb-1 flex items-center gap-2">
                <span>The Sartorial Science: Why This Combination Works</span>
              </h4>
              <p className="text-sm text-stone-700 leading-relaxed">
                {advice.whyItWorks}
              </p>
            </div>
          </div>

          {/* Color Palette Swatch Card */}
          <div className="lg:col-span-5 p-6 bg-zinc-50/80 rounded-2xl border border-zinc-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-600">
                <Palette className="w-4 h-4 text-zinc-700" />
                <span>Color Palette</span>
              </div>
              <span className="text-xs font-serif italic text-zinc-500">
                {advice.colorHarmonyType}
              </span>
            </div>

            {/* Visual Swatches */}
            <div className="grid grid-cols-4 gap-2.5">
              {advice.colorPalette.map((swatch, idx) => (
                <div key={idx} className="flex flex-col items-center text-center group">
                  <div
                    className="w-full aspect-square rounded-xl border border-zinc-300/80 shadow-sm transition-transform group-hover:scale-105"
                    style={{ backgroundColor: swatch.hex }}
                  />
                  <span className="text-xs font-medium text-zinc-800 mt-1.5 truncate w-full">
                    {swatch.name}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {swatch.hex}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed pt-2 border-t border-zinc-200/60">
              <span className="font-semibold text-zinc-900">Color Tip: </span>
              {advice.colorAdvice}
            </p>
          </div>
        </div>

        {/* SECTION: VISUAL CLOTHING ITEMS BREAKDOWN WITH EXAMPLE IMAGES */}
        <div className="space-y-4 pt-4 border-t border-zinc-200">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 mb-1">
                <Shirt className="w-4 h-4" />
                <span>Garment-By-Garment Visual Breakdown</span>
              </div>
              <h3 className="text-2xl font-serif font-bold text-zinc-900">
                Recommended Clothing Pieces & Visual References
              </h3>
            </div>
            <p className="text-xs text-zinc-500 italic">
              Click any garment photo to inspect close-up fabric details & styling tips
            </p>
          </div>

          {/* Grid of Garment Cards with Photos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {garmentEntries.map((entry, idx) => (
              <div
                key={idx}
                onClick={() => onInspectItem(entry.item)}
                className="group relative bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:border-zinc-400 hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
              >
                {/* Garment Image */}
                <div className="relative aspect-[4/5] bg-zinc-100 overflow-hidden">
                  <img
                    src={entry.item.imageUrl}
                    alt={entry.item.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-xs text-white font-medium flex items-center gap-1.5 bg-zinc-900/80 px-2.5 py-1 rounded-md backdrop-blur-sm">
                      <ZoomIn className="w-3.5 h-3.5" />
                      Inspect Fabric & Cut
                    </span>
                  </div>

                  {/* Category Pill Tag */}
                  <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider text-zinc-700 border border-zinc-200 shadow-xs">
                    {entry.label}
                  </div>
                </div>

                {/* Garment Card Info */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className="w-3 h-3 rounded-full border border-zinc-300 shadow-2xs shrink-0"
                        style={{ backgroundColor: entry.item.colorHex }}
                      />
                      <span className="text-xs font-medium text-zinc-600 truncate">
                        {entry.item.colorName}
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-zinc-900 group-hover:text-amber-800 transition-colors line-clamp-1">
                      {entry.item.name}
                    </h4>

                    <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
                      {entry.item.fabric}
                    </p>
                  </div>

                  {/* Quick Styling Tip Snippet */}
                  <div className="pt-2 border-t border-zinc-100 text-[11px] text-zinc-600 line-clamp-2 italic">
                    "{entry.item.stylingTip}"
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Proportion, Texture, and Do's & Don'ts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-200">
          {/* Proportion Rules & Fabric Textures */}
          <div className="space-y-4">
            <div className="p-5 bg-amber-50/50 rounded-2xl border border-amber-200/60">
              <h4 className="text-xs uppercase font-bold text-amber-900 tracking-wider mb-1 flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-amber-700" />
                <span>Silhouette & Rule of Thirds Proportion</span>
              </h4>
              <p className="text-sm text-amber-950/90 leading-relaxed">
                {advice.proportionTip}
              </p>
            </div>

            <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-200">
              <h4 className="text-xs uppercase font-bold text-zinc-700 tracking-wider mb-2 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-zinc-600" />
                <span>Textural & Material Chemistry</span>
              </h4>
              <ul className="space-y-1.5 text-xs md:text-sm text-zinc-600">
                {advice.fabricTextures.map((texture, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-2 shrink-0" />
                    <span>{texture}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Do's and Don'ts */}
          <div className="space-y-4">
            <div className="p-5 bg-emerald-50/60 rounded-2xl border border-emerald-200/80">
              <h4 className="text-xs uppercase font-bold text-emerald-900 tracking-wider mb-2 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Stylist Do's for this Look</span>
              </h4>
              <ul className="space-y-2 text-xs md:text-sm text-emerald-950/90">
                {advice.dos.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 mt-1 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 bg-rose-50/60 rounded-2xl border border-rose-200/80">
              <h4 className="text-xs uppercase font-bold text-rose-900 tracking-wider mb-2 flex items-center gap-2">
                <XIcon className="w-4 h-4 text-rose-600" />
                <span>Stylist Pitfalls to Avoid</span>
              </h4>
              <ul className="space-y-2 text-xs md:text-sm text-rose-950/90">
                {advice.donts.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <XIcon className="w-3.5 h-3.5 text-rose-500 mt-1 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
