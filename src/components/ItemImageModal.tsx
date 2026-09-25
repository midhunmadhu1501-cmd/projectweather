import React from 'react';
import { X, ZoomIn, Sparkles, Tag, CheckCircle2 } from 'lucide-react';
import { ClothingItem } from '../types/clothing';

interface ItemImageModalProps {
  item: ClothingItem | null;
  onClose: () => void;
  onSelectAlternative?: (altName: string) => void;
}

export const ItemImageModal: React.FC<ItemImageModalProps> = ({ item, onClose, onSelectAlternative }) => {
  if (!item) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/75 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl overflow-hidden bg-white rounded-2xl shadow-2xl border border-zinc-200 transition-all max-h-[90vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-10 p-2 text-zinc-500 hover:text-zinc-900 bg-white/90 hover:bg-white rounded-full shadow-md transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Clothing Image View */}
        <div className="relative md:w-1/2 bg-zinc-100 min-h-[320px] md:min-h-[460px] flex items-center justify-center overflow-hidden group">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute bottom-3 left-3 bg-zinc-900/80 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-md flex items-center gap-1.5">
            <ZoomIn className="w-3.5 h-3.5" />
            <span>High-Res Fashion Reference</span>
          </div>
        </div>

        {/* Clothing Item Details & Styling Advice */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs uppercase tracking-widest font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200/60">
              {item.category.toUpperCase()}
            </span>
            <span className="text-xs text-zinc-400">·</span>
            <span className="text-xs text-zinc-500 capitalize">{item.gender}</span>
          </div>

          <h3 className="text-2xl font-serif font-bold text-zinc-900 mb-2 leading-snug">
            {item.name}
          </h3>

          {/* Color & Fabric */}
          <div className="flex flex-wrap items-center gap-4 py-3 border-y border-zinc-100 my-3 text-sm text-zinc-600">
            <div className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded-full border border-zinc-300 shadow-sm inline-block"
                style={{ backgroundColor: item.colorHex }}
              />
              <span className="font-medium text-zinc-900">{item.colorName}</span>
            </div>
            <span className="text-zinc-300">|</span>
            <div className="flex items-center gap-1.5 text-zinc-700">
              <Tag className="w-3.5 h-3.5 text-zinc-400" />
              <span>{item.fabric}</span>
            </div>
          </div>

          {/* Fit & Cut */}
          <div className="mb-4">
            <h4 className="text-xs uppercase font-semibold text-zinc-400 tracking-wider mb-1">
              Cut & Silhouette
            </h4>
            <p className="text-sm text-zinc-700 leading-relaxed">
              {item.fitDescription}
            </p>
          </div>

          {/* Dress Sense Styling Tip */}
          <div className="p-3.5 bg-amber-50/70 border border-amber-200/70 rounded-xl mb-5">
            <div className="flex items-center gap-1.5 text-amber-900 font-semibold text-xs mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>How To Style This Garment</span>
            </div>
            <p className="text-xs md:text-sm text-amber-950/90 leading-relaxed">
              {item.stylingTip}
            </p>
          </div>

          {/* Alternative Garments */}
          {item.alternatives && item.alternatives.length > 0 && (
            <div className="mt-auto pt-2">
              <h4 className="text-xs uppercase font-semibold text-zinc-400 tracking-wider mb-2">
                Versatile Alternatives
              </h4>
              <div className="flex flex-wrap gap-2">
                {item.alternatives.map((alt, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectAlternative && onSelectAlternative(alt)}
                    className="text-xs px-2.5 py-1 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3 h-3 text-zinc-400" />
                    <span>{alt}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
