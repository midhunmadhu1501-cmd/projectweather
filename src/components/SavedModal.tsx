import React from 'react';
import { OutfitAdvice, ClothingItem } from '../types/clothing';
import { X, Trash2, ArrowRight } from 'lucide-react';

interface SavedModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedOutfits: OutfitAdvice[];
  onRemoveOutfit: (id: string) => void;
  onSelectOutfit: (outfit: OutfitAdvice) => void;
  onInspectItem: (item: ClothingItem) => void;
}

export const SavedModal: React.FC<SavedModalProps> = ({
  isOpen,
  onClose,
  savedOutfits,
  onRemoveOutfit,
  onSelectOutfit,
  onInspectItem,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/75 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl border border-zinc-200 shadow-2xl p-6 md:p-8 max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div>
            <h3 className="text-xl font-serif font-bold text-zinc-900">
              Saved Outfits & Dressing Advice
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              {savedOutfits.length} saved visual ensemble{savedOutfits.length === 1 ? '' : 's'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-700 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="overflow-y-auto py-4 space-y-3 flex-1">
          {savedOutfits.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 text-sm">
              No outfits saved yet. Bookmark any outfit advice to review it here!
            </div>
          ) : (
            savedOutfits.map((outfit) => (
              <div
                key={outfit.id}
                className="flex items-center justify-between p-3.5 rounded-2xl border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/50 transition-all gap-4"
              >
                <div
                  className="flex items-center gap-3.5 flex-1 min-w-0 cursor-pointer"
                  onClick={() => {
                    onSelectOutfit(outfit);
                    onClose();
                  }}
                >
                  <img
                    src={outfit.fullLookImageUrl}
                    alt={outfit.title}
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-zinc-900 truncate">
                      {outfit.title}
                    </h4>
                    <p className="text-xs text-zinc-500 line-clamp-1">
                      {outfit.items.top.name} + {outfit.items.bottom.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onSelectOutfit(outfit);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onRemoveOutfit(outfit.id)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
