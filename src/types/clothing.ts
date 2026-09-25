export type GenderStyle = 'womens' | 'mens' | 'unisex';

export type OccasionType =
  | 'smart_casual'
  | 'business_formal'
  | 'date_night'
  | 'casual_weekend'
  | 'summer_vacation'
  | 'wedding_guest'
  | 'autumn_winter'
  | 'job_interview'
  | 'cocktail_evening'
  | 'athleisure_travel';

export type WeatherSeason = 'warm_summer' | 'crisp_autumn' | 'chilly_winter' | 'mild_spring' | 'rainy';

export type BodyTypeFit = 'athletic' | 'petite' | 'tall_lean' | 'curvy' | 'classic_regular' | 'relaxed_oversized';

export type Undertone = 'warm_golden' | 'cool_rosy' | 'neutral' | 'deep_rich' | 'olive';

export interface ClothingItem {
  id: string;
  name: string;
  category: 'top' | 'bottom' | 'outerwear' | 'footwear' | 'accessory';
  gender: 'womens' | 'mens' | 'unisex';
  imageUrl: string;
  secondaryImageUrl?: string;
  colorName: string;
  colorHex: string;
  fabric: string;
  fitDescription: string;
  stylingTip: string;
  alternatives?: string[];
}

export interface ColorSwatch {
  name: string;
  hex: string;
  role: 'primary' | 'secondary' | 'accent' | 'neutral';
}

export interface StylingRule {
  title: string;
  explanation: string;
}

export interface OutfitAdvice {
  id: string;
  title: string;
  subtitle: string;
  gender: GenderStyle;
  occasion: OccasionType;
  weather: WeatherSeason;
  formalityScore: number; // 1 to 5
  vibe: string;
  fullLookImageUrl: string;
  summary: string;
  whyItWorks: string;
  items: {
    top: ClothingItem;
    bottom: ClothingItem;
    outerwear?: ClothingItem;
    footwear: ClothingItem;
    accessory: ClothingItem;
  };
  colorPalette: ColorSwatch[];
  colorHarmonyType: string;
  colorAdvice: string;
  proportionTip: string;
  fabricTextures: string[];
  dos: string[];
  donts: string[];
  tags: string[];
}

export interface CustomAdviceResult {
  title: string;
  summary: string;
  stylePersona: string;
  fullOutfitRecommendation: string;
  items: {
    role: string;
    item: ClothingItem;
    specificTip: string;
  }[];
  palette: ColorSwatch[];
  keyStylingRule: string;
  doAvoidTip: string;
}
