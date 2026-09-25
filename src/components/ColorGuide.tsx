import React, { useState } from 'react';
import { COLOR_RULES, UNDERTONE_GUIDES, UndertoneGuide } from '../data/colorTheory';
import { Sparkles, Palette, HelpCircle, Check, X as XIcon } from 'lucide-react';

export const ColorGuide: React.FC = () => {
  const [selectedToneId, setSelectedToneId] = useState<string>('warm_golden');
  const activeTone = UNDERTONE_GUIDES.find((t) => t.tone === selectedToneId) || UNDERTONE_GUIDES[0];

  return (
    <div className="space-y-12">
      {/* Intro Header */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-zinc-200">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 mb-1">
          <Palette className="w-4 h-4" />
          <span>Color Theory & Satorial Rules</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-zinc-900 mb-2">
          The Science of Clothing Colors & Undertones
        </h2>
        <p className="text-sm md:text-base text-zinc-600 max-w-3xl leading-relaxed">
          Great dress sense isn't luck—it follows optical principles. Discover the framing rules professional stylists use to create effortless visual cohesion and find the colors that illuminate your complexion.
        </p>
      </div>

      {/* Part 1: The Essential Fashion Color Rules */}
      <section className="space-y-6">
        <div>
          <h3 className="text-xl font-serif font-bold text-zinc-900">
            Core Dressing & Framing Laws
          </h3>
          <p className="text-xs md:text-sm text-zinc-500 mt-1">
            Proven optical techniques that balance silhouettes and elevate simple basics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {COLOR_RULES.map((rule, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-xs flex flex-col justify-between"
            >
              {/* Photo & Rule Tag */}
              <div className="relative h-56 bg-zinc-900 overflow-hidden group">
                <img
                  src={rule.imageUrl}
                  alt={rule.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
                <div className="absolute top-4 left-4 bg-zinc-900/80 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-medium border border-white/10">
                  {rule.ruleName}
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h4 className="text-lg font-serif font-bold">{rule.title}</h4>
                  <p className="text-xs text-zinc-300">{rule.tagline}</p>
                </div>
              </div>

              {/* Rule Body & Swatches */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <p className="text-xs md:text-sm text-zinc-700 leading-relaxed">
                  {rule.explanation}
                </p>

                {/* Example Swatch Demo */}
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                  <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider block mb-2">
                    Visual Formula
                  </span>
                  <div className="flex items-center gap-3">
                    {rule.exampleColors.map((color, cIdx) => (
                      <div key={cIdx} className="flex items-center gap-1.5">
                        <span
                          className="w-4 h-4 rounded-full border border-zinc-300 shadow-2xs shrink-0"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-xs font-medium text-zinc-800">{color.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Do & Avoid */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-100 text-xs">
                  <div className="text-emerald-800 bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-100 flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span>{rule.doText}</span>
                  </div>
                  <div className="text-rose-800 bg-rose-50/70 p-2.5 rounded-lg border border-rose-100 flex items-start gap-1.5">
                    <XIcon className="w-3.5 h-3.5 text-rose-500 mt-0.5 shrink-0" />
                    <span>{rule.avoidText}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Part 2: Skin Undertone Matrix */}
      <section className="bg-white p-6 md:p-10 rounded-3xl border border-zinc-200 space-y-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Personalized Palette Discovery</span>
          </div>
          <h3 className="text-2xl font-serif font-bold text-zinc-900">
            Find Your Skin Undertone & Most Flattering Colors
          </h3>
          <p className="text-sm text-zinc-500 mt-0.5">
            Select your undertone below to see your optimal color pairings and metals.
          </p>
        </div>

        {/* Tone Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {UNDERTONE_GUIDES.map((item) => (
            <button
              key={item.tone}
              onClick={() => setSelectedToneId(item.tone)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                selectedToneId === item.tone
                  ? 'border-amber-600 bg-amber-50/50 ring-2 ring-amber-600/30'
                  : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/50'
              }`}
            >
              <h4 className="text-xs font-bold text-zinc-900 line-clamp-1">{item.name.split(' (')[0]}</h4>
              <p className="text-[11px] text-zinc-500 mt-0.5">Tap to explore palette</p>
            </button>
          ))}
        </div>

        {/* Active Undertone Detail Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 bg-stone-50 rounded-2xl border border-stone-200/80">
          <div className="lg:col-span-4 relative aspect-[4/5] rounded-2xl overflow-hidden shadow-md">
            <img
              src={activeTone.imageUrl}
              alt={activeTone.name}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent flex items-end p-4">
              <span className="text-xs text-white font-medium">
                {activeTone.name}
              </span>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-5">
            <div>
              <h4 className="text-xl font-serif font-bold text-zinc-900 mb-1">
                {activeTone.name}
              </h4>
              <p className="text-xs text-zinc-500 italic">
                Vein identification: {activeTone.veinTest}
              </p>
            </div>

            <p className="text-sm text-zinc-700 leading-relaxed">
              {activeTone.stylingAdvice}
            </p>

            <div className="p-3 bg-white rounded-xl border border-zinc-200 text-xs flex items-center justify-between">
              <span className="font-semibold text-zinc-700">Best Jewelry & Watch Metal:</span>
              <span className="font-medium text-amber-800">{activeTone.jewelryMatch}</span>
            </div>

            {/* Best Colors */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Flattering Colors for You
              </span>
              <div className="flex flex-wrap gap-2.5">
                {activeTone.bestColors.map((c, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-zinc-200 text-xs shadow-2xs">
                    <span className="w-3.5 h-3.5 rounded-full border border-zinc-300" style={{ backgroundColor: c.hex }} />
                    <span className="font-medium text-zinc-800">{c.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Colors to Avoid */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-800 mb-2 flex items-center gap-1.5">
                <XIcon className="w-3.5 h-3.5 text-rose-500" />
                Colors to Use with Caution or Avoid Near the Face
              </span>
              <div className="flex flex-wrap gap-2.5">
                {activeTone.colorsToAvoid.map((c, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-zinc-200 text-xs opacity-75">
                    <span className="w-3.5 h-3.5 rounded-full border border-zinc-300" style={{ backgroundColor: c.hex }} />
                    <span className="text-zinc-600 line-through">{c.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
