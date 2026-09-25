import { OutfitAdvice } from '../types/clothing';
import { CLOTHING_ITEMS } from './clothingCatalog';

export const OUTFIT_ADVICE_DATABASE: OutfitAdvice[] = [
  {
    id: 'look_smart_casual_mens',
    title: 'The Modern Tailored Smart-Casual',
    subtitle: 'High-contrast texture play balancing boardroom polish with everyday comfort',
    gender: 'mens',
    occasion: 'smart_casual',
    weather: 'mild_spring',
    formalityScore: 3,
    vibe: 'Refined, effortless, cosmopolitan',
    fullLookImageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
    summary:
      'The quintessential contemporary standard. By trading rigid suit trousers for muted olive cotton chinos and swapping dress shoes for immaculate porcelain leather sneakers, the unstructured navy blazer becomes approachable rather than stiff.',
    whyItWorks:
      'The deep navy jacket frames the face while the crisp optic white shirt provides high contrast. Olive green functions as a grounded earthy neutral that softens the formal authority of the blazer. The minimal white sneaker echoes the shirt collar, creating the classic "Sandwich Rule" balance.',
    items: {
      top: CLOTHING_ITEMS['m_top_oxford_white'],
      bottom: CLOTHING_ITEMS['m_bottom_chinos_olive'],
      outerwear: CLOTHING_ITEMS['m_outer_blazer_navy'],
      footwear: CLOTHING_ITEMS['u_shoes_sneaker_white'],
      accessory: CLOTHING_ITEMS['u_acc_watch_leather'],
    },
    colorPalette: [
      { name: 'Navy Blue', hex: '#1B2A4A', role: 'primary' },
      { name: 'Bright White', hex: '#FDFDFD', role: 'secondary' },
      { name: 'Olive Green', hex: '#556B2F', role: 'accent' },
      { name: 'Cognac Leather', hex: '#9E5B32', role: 'neutral' },
    ],
    colorHarmonyType: 'Split-Complementary (Navy & Olive with White Contrast)',
    colorAdvice:
      'Stick to 3 core colors maximum. Let navy dominate 50% of the visual field, olive 35%, and bright white 15% as the highlight.',
    proportionTip:
      'Ensure the blazer covers 80% of your buttocks. Trouser hem should have a slight no-break finish to highlight the sneaker collar.',
    fabricTextures: [
      'Italian Wool Hopsack (textured breathable weave)',
      'Oxford Cloth (sturdy pin-point cotton)',
      'Garment-Dyed Cotton Twill (matte tactile feel)',
      'Smooth Calfskin Leather',
    ],
    dos: [
      'Keep the white sneakers scuff-free and laces clean',
      'Unbutton the lowest button of the blazer at all times',
      'Keep your watch strap leather in the same warm brown family as your belt',
    ],
    donts: [
      'Do not wear athletic gym sneakers; choose sleek, unbranded minimalist leather',
      'Avoid high-contrast athletic socks; wear no-show invisible socks or dark olive ribbed socks',
      'Do not button the collar button unless wearing a knitted tie',
    ],
    tags: ['Workplace', 'Client Lunch', 'Weekend Gallery', 'Travel'],
  },
  {
    id: 'look_smart_casual_womens',
    title: 'The Architectural Parisian Silhouette',
    subtitle: 'Elongated wide-leg tailoring grounded by crisp linen and warm leather tones',
    gender: 'womens',
    occasion: 'smart_casual',
    weather: 'mild_spring',
    formalityScore: 3,
    vibe: 'Sophisticated, effortless, art-directed',
    fullLookImageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
    summary:
      'A masterclass in proportions. High-waisted wide-leg charcoal trousers construct an elongated lower vertical line, while a softly unbuttoned French linen shirt keeps the overall energy relaxed and breezy.',
    whyItWorks:
      'The Rule of Thirds is strictly honored: high-rise trousers allocate 2/3 of the vertical frame to the legs, instantly lengthening your silhouette. The camel trench coat adds warm architectural lines when walking.',
    items: {
      top: CLOTHING_ITEMS['w_top_linen_white'],
      bottom: CLOTHING_ITEMS['w_bottom_trousers_charcoal'],
      outerwear: CLOTHING_ITEMS['w_outer_trench_camel'],
      footwear: CLOTHING_ITEMS['u_shoes_sneaker_white'],
      accessory: CLOTHING_ITEMS['w_acc_bag_crossbody'],
    },
    colorPalette: [
      { name: 'Slate Charcoal', hex: '#374151', role: 'primary' },
      { name: 'Warm Camel', hex: '#C19A6B', role: 'secondary' },
      { name: 'Soft Ecru', hex: '#F5F5F0', role: 'neutral' },
      { name: 'Caramel Saddle', hex: '#A0522D', role: 'accent' },
    ],
    colorHarmonyType: 'Tonal Neutral Warmth over Cool Charcoal',
    colorAdvice:
      'Warm camel outerwear softens deep charcoal trousers. The caramel leather bag ties in the warm undertone of the coat.',
    proportionTip:
      'Do a relaxed French tuck with the linen shirt front, letting the sides drape naturally to define the waistline without feeling restricted.',
    fabricTextures: [
      'Fluid Wool-Blend Twill with slight stretch',
      'Airy Organic French Linen',
      'Dense Cotton Gabardine',
      'Supple Grained Leather',
    ],
    dos: [
      'Tuck shirt in cleanly at the front to reveal the trouser waist pleats',
      'Push trench coat sleeves up to the elbows for a nonchalant drape',
      'Add a delicate gold chain necklace to draw the eye to the neckline',
    ],
    donts: [
      'Avoid bulky shoes that fight with the wide-leg trouser hem',
      'Do not buckle the trench coat tightly unless it is actively raining—tie it behind you',
      'Never wear oversized tops untucked over wide-leg trousers (causes boxiness)',
    ],
    tags: ['Office', 'City Exploration', 'Coffee Meeting', 'Weekend'],
  },
  {
    id: 'look_date_night_womens',
    title: 'The Liquid Satin & Cashmere Romance',
    subtitle: 'Sensual textural juxtaposition between liquid silk drape and plush knit softness',
    gender: 'womens',
    occasion: 'date_night',
    weather: 'crisp_autumn',
    formalityScore: 4,
    vibe: 'Intimate, romantic, quietly magnetic',
    fullLookImageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
    summary:
      'Balancing allure with warmth. A bias-cut liquid satin midi skirt catches candle and city lights with every step, balanced by a slouchy oatmeal cashmere sweater and pointed black ankle boots.',
    whyItWorks:
      'Monochrome and tonal neutral pairings look inherently luxurious. Juxtaposing the high sheen of silk satin against the matte, fuzzy softness of cashmere creates tactile depth without needing loud prints or logos.',
    items: {
      top: CLOTHING_ITEMS['w_top_cashmere_cream'],
      bottom: CLOTHING_ITEMS['w_bottom_skirt_satin'],
      outerwear: CLOTHING_ITEMS['w_outer_trench_camel'],
      footwear: CLOTHING_ITEMS['w_shoes_ankle_boot'],
      accessory: CLOTHING_ITEMS['w_acc_jewelry_gold'],
    },
    colorPalette: [
      { name: 'Oatmeal Heather', hex: '#D8CEBE', role: 'primary' },
      { name: 'Champagne Bronze', hex: '#BFA888', role: 'secondary' },
      { name: 'Midnight Black', hex: '#111111', role: 'accent' },
      { name: '18k Yellow Gold', hex: '#D4AF37', role: 'accent' },
    ],
    colorHarmonyType: 'Warm Monochromatic Tonal Gradient',
    colorAdvice:
      'Keeping the top and skirt within the same warm oatmeal and bronze palette elongates the body uninterrupted.',
    proportionTip:
      'Tuck the front hem of the cashmere sweater into your bra band or belt to create an effortless cropped proportion over the midi skirt.',
    fabricTextures: [
      'Liquid Viscose Silk Satin (high refractive sheen)',
      'Lofty 2-Ply Mongolian Cashmere (matte soft cloud)',
      'Polished Glazed Calf Leather',
      'Gleaming 18k Gold Vermeil',
    ],
    dos: [
      'Wear pointed-toe boots to maintain a long, continuous vertical line beneath the midi hem',
      'Wear seamless nude undergarments to prevent lines under bias-cut satin',
      'Layer warm gold jewelry near the face to reflect warm candlelight',
    ],
    donts: [
      'Avoid flat round-toe shoes which truncate the calf length',
      'Do not spray perfume directly onto delicate silk fabric',
      'Avoid stiff cotton denim jackets with satin skirts (textures clash harshly)',
    ],
    tags: ['Dinner Date', 'Cocktail Lounge', 'Anniversary', 'Evening Arts'],
  },
  {
    id: 'look_date_night_mens',
    title: 'The Stealth Cafe Racer & Selvedge Denim',
    subtitle: 'Understated masculinity with precision leather tailoring and dark indigo contrast',
    gender: 'mens',
    occasion: 'date_night',
    weather: 'crisp_autumn',
    formalityScore: 3,
    vibe: 'Confident, ruggedly refined, timeless',
    fullLookImageUrl: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1200&q=80',
    summary:
      'The quintessential masculine evening ensemble. A supple lambskin racer jacket over a heavyweight jet black supima tee, anchored by raw Japanese selvedge denim and rich cigar suede Chelsea boots.',
    whyItWorks:
      'Leather communicates strength and intention. By selecting a clean cafe-racer cut without extraneous zippers or heavy belt hardware, the jacket reads sleek and modern rather than costumey.',
    items: {
      top: CLOTHING_ITEMS['m_top_tee_black'],
      bottom: CLOTHING_ITEMS['m_bottom_denim_selvedge'],
      outerwear: CLOTHING_ITEMS['m_outer_leather_biker'],
      footwear: CLOTHING_ITEMS['m_shoes_chelsea_boots'],
      accessory: CLOTHING_ITEMS['u_acc_watch_leather'],
    },
    colorPalette: [
      { name: 'Matte Black', hex: '#1C1C1E', role: 'primary' },
      { name: 'Dark Indigo', hex: '#1A233A', role: 'secondary' },
      { name: 'Snuff Suede Brown', hex: '#5C4033', role: 'accent' },
      { name: 'Steel & Silver', hex: '#D1D5DB', role: 'neutral' },
    ],
    colorHarmonyType: 'Low-Key Moody Shadow Harmony',
    colorAdvice:
      'Dark indigo and black create a slimming, unified column of color. The cigar brown suede footwear breaks up the darkness with organic warmth.',
    proportionTip:
      'The leather jacket hem should terminate precisely at your belt line. Anything longer disrupts torso proportions.',
    fabricTextures: [
      'Full-Grain Matte Lambskin',
      '13.5oz Rigid Japanese Kurabo Denim',
      'Waxed English Calf Suede',
      'Heavyweight 240 GSM Supima Cotton',
    ],
    dos: [
      'Ensure the tee fits snug around the biceps and shoulders with zero bunching in the torso',
      'Keep suede boots brushed with a brass suede brush',
      'Maintain an upright posture to allow the jacket shoulders to sit naturally',
    ],
    donts: [
      'Avoid distressed or acid-washed jeans on a date; raw dark indigo is vastly more respectful and chic',
      'Do not wear bulky running trainers with a sleek leather jacket',
      'Avoid loud graphic prints under the jacket',
    ],
    tags: ['Dinner', 'Wine Bar', 'Speakeasy', 'Concert'],
  },
  {
    id: 'look_summer_resort_unisex',
    title: 'The Mediterranean Linen Resort Look',
    subtitle: 'Breathable natural fibers, sun-drenched neutrals, and unpretentious luxury',
    gender: 'unisex',
    occasion: 'summer_vacation',
    weather: 'warm_summer',
    formalityScore: 2,
    vibe: 'Sun-kissed, relaxed, effortless coastal',
    fullLookImageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
    summary:
      'Engineered for warm coastal breezes and golden hour strolls. Pure open-weave linen keeps body temperature down while natural slub textures convey casual elegance.',
    whyItWorks:
      'Embracing the natural crinkle of flax linen shows confidence. Combining cream, warm sand, and tortoiseshell evokes vintage Riviera cinema.',
    items: {
      top: CLOTHING_ITEMS['w_top_linen_white'],
      bottom: CLOTHING_ITEMS['w_bottom_linen_pants'],
      outerwear: CLOTHING_ITEMS['w_outer_trench_camel'],
      footwear: CLOTHING_ITEMS['u_shoes_sneaker_white'],
      accessory: CLOTHING_ITEMS['u_acc_sunglasses_tortoise'],
    },
    colorPalette: [
      { name: 'Crisp Off-White', hex: '#F5F5F0', role: 'primary' },
      { name: 'Desert Sand', hex: '#E6DEC9', role: 'secondary' },
      { name: 'Havana Tortoise', hex: '#654321', role: 'accent' },
      { name: 'Warm Gold', hex: '#D4AF37', role: 'neutral' },
    ],
    colorHarmonyType: 'Sunlight Tone-on-Tone Monochromatic',
    colorAdvice:
      'Never match whites exactly; pairing bright white with ecru and sandy wheat creates intentional, layered depth.',
    proportionTip:
      'When wearing wide linen bottoms, keep the top either slightly unbuttoned and tucked or knot it at the natural waist.',
    fabricTextures: [
      '100% French Flax Linen (slubby breathable weave)',
      'Polished Italian Cellulose Acetate',
      'Smooth Nappa Leather',
    ],
    dos: [
      'Embrace gentle wrinkles in linen—it signals organic quality',
      'Wear skin-tone undergarments under white linen to avoid see-through contrast',
      'Carry tortoiseshell sunglasses for instant vintage gravitas',
    ],
    donts: [
      'Avoid synthetic polyester blends in high humidity (they trap sweat and heat)',
      'Do not iron linen bone-flat with heavy starch; steam lightly for natural drape',
    ],
    tags: ['Resort', 'Vacation', 'Brunch', 'Beachside Dining'],
  },
  {
    id: 'look_business_executive_mens',
    title: 'The Modern Power Tailored Ensemble',
    subtitle: 'Immaculate wool drape with subtle color temperature balance and bespoke details',
    gender: 'mens',
    occasion: 'business_formal',
    weather: 'crisp_autumn',
    formalityScore: 5,
    vibe: 'Authoritative, sharp, commanding',
    fullLookImageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=80',
    summary:
      'Commanding boardroom respect without feeling antiquated. Super 120s wool flannel trousers in midnight navy meet an unstructured Italian hopsack blazer and Goodyear-welted burnished espresso loafers.',
    whyItWorks:
      'Navy and rich espresso brown are universally acknowledged as the most trustworthy color combination in menswear. The white Oxford shirt acts as a beacon reflecting light back onto the face.',
    items: {
      top: CLOTHING_ITEMS['m_top_oxford_white'],
      bottom: CLOTHING_ITEMS['m_bottom_trousers_navy'],
      outerwear: CLOTHING_ITEMS['m_outer_blazer_navy'],
      footwear: CLOTHING_ITEMS['m_shoes_loafer_brown'],
      accessory: CLOTHING_ITEMS['u_acc_belt_leather'],
    },
    colorPalette: [
      { name: 'Midnight Navy', hex: '#1E293B', role: 'primary' },
      { name: 'Optic White', hex: '#FDFDFD', role: 'secondary' },
      { name: 'Burnished Espresso', hex: '#3D2314', role: 'accent' },
      { name: 'Brushed Brass', hex: '#C5A059', role: 'neutral' },
    ],
    colorHarmonyType: 'Authoritative Classic High-Contrast',
    colorAdvice:
      'Ensure the brown of your belt exactly matches your dress shoes in hue and finish level.',
    proportionTip:
      'Show exactly 1/2 inch of shirt cuff beneath the blazer sleeve. Trousers should feature a crisp front crease.',
    fabricTextures: [
      'Super 120s Italian Wool Flannel',
      'Pinpoint 100% 2-ply Cotton',
      'Box Calf Full-Grain Leather',
      'Hand-Burnished Vegetable Tanned Leather',
    ],
    dos: [
      'Shine your leather shoes before critical meetings',
      'Ensure shirt collar stays are inserted to prevent collar curl',
      'Stand tall: tailored suits look their best with active shoulder engagement',
    ],
    donts: [
      'Never fasten the bottom button of a two-button blazer',
      'Avoid novelty socks with cartoon prints in executive settings',
      'Do not wear a black belt with brown shoes',
    ],
    tags: ['Boardroom', 'Investment Pitch', 'Contract Signing', 'Keynote'],
  },
  {
    id: 'look_autumn_chic_womens',
    title: 'The Downtown Tailored Houndstooth & Denim',
    subtitle: 'Classic British tailoring disrupted by raw indigo and pointed boot drama',
    gender: 'womens',
    occasion: 'autumn_winter',
    weather: 'crisp_autumn',
    formalityScore: 3,
    vibe: 'Edgy, intellectual, chic gallery owner',
    fullLookImageUrl: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1200&q=80',
    summary:
      'The modern urban uniform. An oversized houndstooth wool blazer injects instant structured prestige over a clean boatneck top, while straight-leg medium indigo denim and pointed black boots keep it firmly grounded.',
    whyItWorks:
      'The oversized boxy cut of the jacket is balanced by the straight, high-waisted denim silhouette. The pointed ankle boots slice through the hem with sharp intentionality.',
    items: {
      top: CLOTHING_ITEMS['w_top_breton_stripe'],
      bottom: CLOTHING_ITEMS['w_bottom_denim_straight'],
      outerwear: CLOTHING_ITEMS['w_outer_blazer_oversized'],
      footwear: CLOTHING_ITEMS['w_shoes_ankle_boot'],
      accessory: CLOTHING_ITEMS['w_acc_bag_crossbody'],
    },
    colorPalette: [
      { name: 'Beige & Black Micro-Check', hex: '#8C7B68', role: 'primary' },
      { name: 'Medium Indigo', hex: '#3B5998', role: 'secondary' },
      { name: 'Midnight Black', hex: '#111111', role: 'neutral' },
      { name: 'Caramel Saddle', hex: '#A0522D', role: 'accent' },
    ],
    colorHarmonyType: 'Pattern Play on Heritage Neutrals',
    colorAdvice:
      'When wearing a micro-pattern jacket (houndstooth), keep your base layers either subtle stripes or pure solid neutrals.',
    proportionTip:
      'Balance oversized shoulder pads by showing ankle or wrist skin (cuff sleeves to 3/4 length).',
    fabricTextures: [
      'Heavy Wool Twill Check',
      'Rigid 100% Cotton Denim',
      'Heavy Combed Cotton Jersey',
      'Smooth Calfskin',
    ],
    dos: [
      'Roll blazer sleeves slightly and push them up to break masculine boxiness',
      'Wear pointed-toe boots to elongate legs',
      'Let the crossbody bag hang right at the hip bone',
    ],
    donts: [
      'Avoid pairing an oversized blazer with wide slouchy sweatpants (causes shapeless look)',
      'Do not choose distressed ripped jeans with formal houndstooth',
    ],
    tags: ['Gallery Opening', 'Weekend Lunch', 'Creative Work', 'Travel'],
  }
];
