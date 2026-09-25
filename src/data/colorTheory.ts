export interface ColorComboGuide {
  title: string;
  ruleName: string;
  tagline: string;
  explanation: string;
  exampleColors: { name: string; hex: string }[];
  visualTip: string;
  doText: string;
  avoidText: string;
  imageUrl: string;
}

export interface UndertoneGuide {
  tone: string;
  name: string;
  veinTest: string;
  jewelryMatch: string;
  bestColors: { name: string; hex: string }[];
  colorsToAvoid: { name: string; hex: string }[];
  stylingAdvice: string;
  imageUrl: string;
}

export const COLOR_RULES: ColorComboGuide[] = [
  {
    title: 'The Sandwich Rule',
    ruleName: 'Color Echo Framing',
    tagline: 'Match your top (or headwear) with your footwear color',
    explanation:
      'By matching the color of your top/jacket or hat to your shoes (e.g. white tee + dark pants + white sneakers, or camel sweater + black trousers + camel boots), you create an optical "sandwich" that frames the contrasting middle piece and brings instant symmetry to the human eye.',
    exampleColors: [
      { name: 'Off-White (Top)', hex: '#F8F8F6' },
      { name: 'Charcoal (Middle Pants)', hex: '#374151' },
      { name: 'Porcelain White (Shoes)', hex: '#F8F8F6' },
    ],
    visualTip: 'The eye travels naturally between the top and bottom endpoints, making you look taller and intentionally styled.',
    doText: 'Use with white sneakers and white t-shirts or camel overcoats and camel Chelsea boots.',
    avoidText: 'Avoid sandwiching with ultra-loud neon colors which look too deliberate or uniform-like.',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'The 3-Color Maximum Rule',
    ruleName: 'Visual Harmony Limit',
    tagline: 'Never exceed three distinct colors in a single outfit',
    explanation:
      'The human brain processes aesthetic balance in threes: 60% dominant base color (trousers or suit), 30% secondary supporting color (shirt or knitwear), and 10% accent color (belt, watch, scarf, or shoe detail). Anything more starts looking chaotic.',
    exampleColors: [
      { name: '60% Midnight Navy', hex: '#1B2A4A' },
      { name: '30% Crisp Ecru', hex: '#EFEFEA' },
      { name: '10% Cognac Leather', hex: '#9E5B32' },
    ],
    visualTip: 'Treat denim, white, and black as anchor neutrals that allow one vibrant statement shade to shine.',
    doText: 'Count jewelry and metal tones as part of your 10% accent allotment.',
    avoidText: 'Do not combine red, green, yellow, and blue in one look unless wearing intentional folk dress.',
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Monochromatic Tonal Layering',
    ruleName: 'Tone-on-Tone Depth',
    tagline: 'Vary shades and textures within a single color family',
    explanation:
      'Rather than wearing the exact same shade from head to toe, select 2 to 3 varying gradations of one hue (e.g., oatmeal knit + cream silk skirt + beige trench coat). The secret is mixing diverse textures (chunky wool, fluid silk, matte leather).',
    exampleColors: [
      { name: 'Oatmeal', hex: '#D8CEBE' },
      { name: 'Champagne Tan', hex: '#C5A880' },
      { name: 'Warm Cream', hex: '#F4EFE6' },
    ],
    visualTip: 'Monochrome creates an unbroken vertical line that makes the wearer look significantly taller and leaner.',
    doText: 'Juxtapose opposite finishes: matte with shiny, or chunky with smooth.',
    avoidText: 'Never wear mismatched blacks where one is washed-out brown and the other is blue-black.',
    imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'High-Low Formality Juxtaposition',
    ruleName: 'The Wrong Shoe Theory',
    tagline: 'Pair formal tailoring with relaxed casual counterparts',
    explanation:
      'The modern secret to looking effortlessly stylish: take a formal item (tailored blazer or silk slip dress) and pair it with an unexpectedly casual partner (white leather sneakers, graphic tee, or chunky loafers). It diffuses stuffiness.',
    exampleColors: [
      { name: 'Tailored Black', hex: '#1C1C1E' },
      { name: 'Washed Medium Denim', hex: '#3B5998' },
      { name: 'Sneaker White', hex: '#FFFFFF' },
    ],
    visualTip: 'Creates an aura of casual confidence—signaling that you dressed with intention but without anxiety.',
    doText: 'Keep the casual elements immaculately clean and well-maintained.',
    avoidText: 'Do not wear damaged, gym-worn running shoes with fine wool suits.',
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
  },
];

export const UNDERTONE_GUIDES: UndertoneGuide[] = [
  {
    tone: 'warm_golden',
    name: 'Warm Undertone (Golden & Peachy)',
    veinTest: 'Veins appear greenish or olive on wrist; skin tans easily to golden hue',
    jewelryMatch: 'Yellow Gold, Brass, and Warm Copper',
    bestColors: [
      { name: 'Camel Tan', hex: '#C19A6B' },
      { name: 'Olive Green', hex: '#556B2F' },
      { name: 'Terracotta', hex: '#E2725B' },
      { name: 'Warm Cream', hex: '#F5F2EB' },
      { name: 'Mustard Amber', hex: '#D4AF37' },
    ],
    colorsToAvoid: [
      { name: 'Icy Blue', hex: '#D0E0E3' },
      { name: 'Stark Optic White', hex: '#FFFFFF' },
      { name: 'Magenta Pink', hex: '#D60270' },
    ],
    stylingAdvice:
      'Earthy, warm pigments harmonize with the natural carotenoids and melanin in your skin, making you glow without makeup.',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  },
  {
    tone: 'cool_rosy',
    name: 'Cool Undertone (Rosy & Blue-Pink)',
    veinTest: 'Veins appear blueish or purple; skin burns easily before tanning',
    jewelryMatch: 'Bright Silver, White Gold, and Platinum',
    bestColors: [
      { name: 'Cobalt / Navy', hex: '#1B2A4A' },
      { name: 'Emerald Jewel', hex: '#097969' },
      { name: 'Berry Burgundy', hex: '#800020' },
      { name: 'Crisp Optic White', hex: '#FFFFFF' },
      { name: 'Cool Slate Grey', hex: '#708090' },
    ],
    colorsToAvoid: [
      { name: 'Warm Orange', hex: '#FFA500' },
      { name: 'Mustard Yellow', hex: '#D4AF37' },
      { name: 'Muddy Khaki', hex: '#8B864E' },
    ],
    stylingAdvice:
      'High-contrast jewel tones and stark whites contrast beautifully with cool pink or blue undertones, preventing a sallow appearance.',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
  },
  {
    tone: 'deep_rich',
    name: 'Deep Rich & Melanin-Rich Tones',
    veinTest: 'Rich espresso, bronze, or mahogany skin depth with warm or cool reflections',
    jewelryMatch: 'High-shine Yellow Gold, Rose Gold, and Polished Brass',
    bestColors: [
      { name: 'Royal Cobalt Blue', hex: '#002366' },
      { name: 'Vibrant Ochre', hex: '#CC7722' },
      { name: 'Crisp Porcelain White', hex: '#FDFDFD' },
      { name: 'Rich Fuchsia Plum', hex: '#722F37' },
      { name: 'Emerald Green', hex: '#1B4D3E' },
    ],
    colorsToAvoid: [
      { name: 'Muddy Grey-Brown', hex: '#5C5446' },
      { name: 'Washed Out Beige', hex: '#C2B280' },
    ],
    stylingAdvice:
      'High saturation jewel tones and crisp whites illuminate deep skin tones with breathtaking contrast. Avoid mid-tone washed out browns that match your skin too closely.',
    imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80',
  },
  {
    tone: 'olive',
    name: 'Olive Undertone (Subtle Greenish & Neutral-Warm)',
    veinTest: 'Veins appear blue-green; skin has a slight greenish or neutral cast',
    jewelryMatch: 'Rose Gold, Antique Brass, and Burnished Silver',
    bestColors: [
      { name: 'Sage & Forest', hex: '#4A5D4E' },
      { name: 'Charcoal Black', hex: '#2B2B2B' },
      { name: 'Dusty Rose', hex: '#DCAE96' },
      { name: 'Cognac Leather', hex: '#9E5B32' },
      { name: 'Champagne Taupe', hex: '#B38B6D' },
    ],
    colorsToAvoid: [
      { name: 'Lime Green', hex: '#32CD32' },
      { name: 'Neon Pastels', hex: '#FF69B4' },
    ],
    stylingAdvice:
      'Muted earth tones, sage, cognac, and deep navy complement olive tones without drawing out sickly yellow reflections.',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
  },
];
