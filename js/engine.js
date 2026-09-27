"use strict";
// Dress Sense - weather labels and the rule-based recommendation engine (no DOM access)
function wx(c){if(c===0)return["Clear sky","☀️"];if(c<=2)return["Partly cloudy","⛅"];if(c===3)return["Overcast","☁️"];if(c<=48)return["Fog","🌫️"];if(c<=57)return["Drizzle","🌦️"];if(c<=67)return["Rain","🌧️"];if(c<=77)return["Snow","❄️"];if(c<=82)return["Rain showers","🌧️"];if(c<=86)return["Snow showers","🌨️"];return["Thunderstorm","⛈️"]}

// Slang descriptions for Gen Z mode (Male & Female completely separated, plus dedicated Formal & Gym cold-weather gear)
const PIECES={
  // Male Casual & Travel pieces
  tshirt:{icon:"tshirt",vibe:"oversized boxy streetwear tee"},
  shirt:{icon:"shirt",vibe:"casual plaid / oxford button-down overshirt"},
  linen_shirt:{icon:"shirt",vibe:"breezy camp-collar linen shirt"},
  sweater:{icon:"sweater",vibe:"heavyweight boxy knit sweater / fleece hoodie"},
  jacket:{icon:"jacket",vibe:"cropped flight bomber / denim trucker jacket"},
  thermal:{icon:"thermal",vibe:"thermal base with heavy down puffer coat"},
  shorts:{icon:"shorts",vibe:"baggy utility cargo shorts"},
  jeans:{icon:"jeans",vibe:"baggy straight-leg streetwear denim"},
  trousers:{icon:"trousers",vibe:"pleated wide-leg tailored trousers"},
  sneakers:{icon:"sneakers",vibe:"chunky retro dad kicks"},
  sandals:{icon:"sandals",vibe:"cork / minimal slide sandals"},
  boots:{icon:"boots",vibe:"lug-sole leather boots"},
  loafers:{icon:"loafers",vibe:"polished leather penny loafers"},

  // Male Dedicated Formal / Office pieces (Warm, Cool & Cold)
  formal_shirt:{icon:"shirt",vibe:"crisp tailored oxford formal dress shirt"},
  formal_blazer:{icon:"jacket",vibe:"tailored navy wool suit blazer over dress shirt & tie"},
  formal_overcoat:{icon:"jacket",vibe:"camel & charcoal wool winter overcoat over suit & tie"},

  // Male Dedicated Gym / Workout pieces (Hot, Mild, Cool & Cold)
  gym_tee:{icon:"tshirt",vibe:"dry-fit athletic pump-cover tee"},
  gym_hoodie:{icon:"sweater",vibe:"performance quarter-zip track top & tech-fleece running hoodie"},
  gym_shorts:{icon:"shorts",vibe:"above-knee 5-inch athletic running shorts"},
  gym_joggers:{icon:"trousers",vibe:"tapered technical athletic training joggers & track pants"},

  // Female Casual, Formal & Gym pieces (100% distinct from Male)
  f_midi_dress:{icon:"shirt",vibe:"breezy pleated linen sundress / midi co-ord"},
  f_kurti_top:{icon:"shirt",vibe:"embroidered pastel kurti tunic / floral puff-sleeve blouse"},
  f_top_blouse:{icon:"shirt",vibe:"sage ribbed cropped cardigan & fitted baby tee"},
  f_jacket_trench:{icon:"jacket",vibe:"chic camel belted trench / cropped women's denim jacket"},
  f_sweater_knit:{icon:"sweater",vibe:"blush & cream chunky cable-knit turtleneck / wrap cardigan"},
  f_winter_puffer:{icon:"thermal",vibe:"pearl-ivory belted down puffer coat & fleece thermal"},
  f_skirt_shorts:{icon:"shorts",vibe:"high-waisted pleated tennis skirt / tailored linen shorts"},
  f_wide_jeans:{icon:"jeans",vibe:"women's high-waisted light-wash wide-leg denim"},
  f_palazzo_trousers:{icon:"trousers",vibe:"high-waisted flowy cream palazzos / espresso wide slacks"},
  f_sandals_flats:{icon:"sandals",vibe:"tan strappy leather sandals / pointed ballet flats"},
  f_heels_mules:{icon:"loafers",vibe:"block-heel office mules & pointed slingback flats"},
  f_sneakers:{icon:"sneakers",vibe:"pastel-rose & white platform fashion sneakers"},
  f_ankle_boots:{icon:"boots",vibe:"tan suede heeled Chelsea ankle boots"},

  // Female Dedicated Formal / Office pieces (Warm, Cool & Cold)
  f_formal_blouse:{icon:"shirt",vibe:"ivory silk button-down blouse & draped linen blazer"},
  f_formal_coat:{icon:"jacket",vibe:"tailored long espresso/camel wool overcoat over merino turtleneck & blazer"},

  // Female Dedicated Gym / Workout pieces (Hot, Warm/Mild, Cool & Freezing Cold)
  f_gym_top_summer:{icon:"tshirt",vibe:"berry-lilac seamless ribbed sports tank & black racerback gym tee"},
  f_activewear:{icon:"tshirt",vibe:"dusty-rose sculpted moisture-wicking gym top"},
  f_gym_jacket:{icon:"jacket",vibe:"sculpted sage/rose Define zip-up running jacket & thumbhole top"},
  f_gym_hoodie:{icon:"sweater",vibe:"quarter-zip scuba fleece gym hoodie & thermal compression pullover"},
  f_gym_shorts_biker:{icon:"shorts",vibe:"high-waisted 5-inch seamless biker shorts & lilac running shorts"},
  f_gym_leggings:{icon:"trousers",vibe:"high-waisted full-length charcoal & sage compression gym leggings"},
  f_gym_joggers:{icon:"trousers",vibe:"high-waisted tapered tech-fleece gym joggers & thermal track pants"},
  f_gym_runners:{icon:"sneakers",vibe:"cushioned white, silver & blush athletic running & cross-training shoes"},

  // Weather Accessories
  umbrella:{icon:"umbrella",vibe:"compact travel umbrella"},
  raincoat:{icon:"raincoat",vibe:"waterproof rain slicker"},
  sunglasses:{icon:"sunglasses",vibe:"retro tinted UV sunglasses"},
  cap:{icon:"cap",vibe:"washed cotton baseball cap"},
  sunscreen:{icon:"sunscreen",vibe:"SPF 50+ invisible sunscreen"},
  windbreaker:{icon:"windbreaker",vibe:"technical windbreaker shell"},
  scarf:{icon:"scarf",vibe:"soft wool knit winter scarf"},
  beanie:{icon:"beanie",vibe:"ribbed cuffed knit beanie"},
  gloves:{icon:"gloves",vibe:"touchscreen winter knit gloves"}
};

// Plain, standard descriptions for Classic Plain mode
const PLAIN_NAMES={
  // Male Casual & Travel
  tshirt:"cotton crewneck t-shirt",
  shirt:"casual button-down shirt",
  linen_shirt:"breathable linen shirt",
  sweater:"wool cable-knit sweater",
  jacket:"classic bomber / denim jacket",
  thermal:"thermal base layer & winter puffer coat",
  shorts:"tailored cotton cargo shorts",
  jeans:"straight-leg blue denim jeans",
  trousers:"tailored dress trousers / chinos",
  sneakers:"walking / running sneakers",
  sandals:"slide sandals",
  boots:"leather ankle / combat boots",
  loafers:"polished leather penny loafers",

  // Male Dedicated Formal / Office
  formal_shirt:"crisp formal dress shirt",
  formal_blazer:"tailored navy wool suit blazer, dress shirt & tie",
  formal_overcoat:"tailored wool winter overcoat, merino sweater & dress shirt",

  // Male Dedicated Gym / Workout
  gym_tee:"moisture-wicking athletic t-shirt",
  gym_hoodie:"performance quarter-zip track pullover & tech-fleece hoodie",
  gym_shorts:"athletic running shorts",
  gym_joggers:"tapered technical athletic training joggers",

  // Female Casual, Formal & Gym
  f_midi_dress:"breathable linen midi sundress / co-ord",
  f_kurti_top:"embroidered cotton kurti tunic / floral blouse",
  f_top_blouse:"pastel knit cardigan & cotton top",
  f_formal_blouse:"ivory silk formal blouse & tailored blazer",
  f_formal_coat:"tailored long wool winter coat over merino turtleneck & blazer",
  f_gym_top_summer:"women's breathable seamless ribbed sports tank & racerback gym tee",
  f_activewear:"women's moisture-wicking sculpted athletic workout top",
  f_gym_jacket:"women's fitted zip-up athletic running jacket & thermal thumbhole top",
  f_gym_hoodie:"women's quarter-zip scuba fleece gym hoodie & thermal running pullover",
  f_jacket_trench:"women's camel belted trench / denim jacket",
  f_sweater_knit:"women's cable-knit turtleneck sweater",
  f_winter_puffer:"women's belted down puffer coat & thermal top",
  f_skirt_shorts:"women's pleated skirt / tailored linen shorts",
  f_wide_jeans:"women's high-waisted wide-leg denim jeans",
  f_palazzo_trousers:"women's flowy pleated palazzos / formal slacks",
  f_gym_shorts_biker:"women's high-waisted 5-inch seamless biker shorts & running shorts",
  f_gym_leggings:"women's high-waisted full-length compression gym leggings",
  f_gym_joggers:"women's high-waisted tapered tech-fleece athletic joggers",
  f_sandals_flats:"women's strappy leather sandals / ballet flats",
  f_heels_mules:"women's block-heel office mules / slingbacks",
  f_sneakers:"women's platform walking sneakers",
  f_gym_runners:"women's cushioned athletic running & cross-training shoes",
  f_ankle_boots:"women's suede heeled Chelsea ankle boots",

  // Accessories
  umbrella:"umbrella",
  raincoat:"raincoat",
  sunglasses:"sunglasses",
  cap:"baseball cap",
  sunscreen:"sunscreen",
  windbreaker:"windbreaker",
  scarf:"scarf",
  beanie:"beanie",
  gloves:"gloves"
};

function recommend(w,act,bias,fmt,isGenZ=true,gender="male"){
  const why=[],acc=[];
  const isFem=(gender==="female");
  let f=w.feels+bias;

  // Explain personal thermal sensitivity bias clearly
  if(bias<0){
    why.push(isGenZ
      ? `You feel cold easily (${bias}° offset): shifted to warmer, more insulated layers and fuller coverage.`
      : `Personal Cold Sensitivity (${bias}° adjustment): upgraded outfit with extra insulation, sleeves, and ankle coverage.`);
  } else if(bias>0){
    why.push(isGenZ
      ? `You feel hot easily (+${bias}° offset): shifted to breezier, ultra-breathable fabrics and lighter silhouettes.`
      : `Personal Heat Sensitivity (+${bias}° adjustment): selected lighter, high-ventilation fabrics to prevent overheating.`);
  }

  if(act==="workout"){
    why.push(isGenZ
      ? "Workout / Sports mode: uses 100% dedicated technical sportswear & active stretch bottoms (never stiff jeans, wool sweaters, or formal slacks)."
      : "Workout / Sports protocol: selects dedicated technical activewear (moisture-wicking tops, running shorts, or tapered athletic joggers/leggings).");
  } else if(act==="office"){
    why.push(isGenZ
      ? "Office / Formal mode: calibrated for sharp corporate dress codes across all temperatures (tailored shirts, blazers, wool overcoats & formal slacks)."
      : "Office / Formal protocol: maintains professional business attire scaled to temperature (dress shirts, suit blazers, and tailored wool overcoats).");
  }

  let top,bottom,shoes,vibe;

  // =========================================================================
  // FEMALE WARDROBE ENGINE (100% Dedicated Women's Tops, Bottoms & Footwear)
  // =========================================================================
  if(isFem){
    if(act==="casual"){
      if(f>=32){
        top = "f_midi_dress";
        bottom = "f_skirt_shorts";
        shoes = "f_sandals_flats";
        vibe = isGenZ
          ? "clean girl heatwave aesthetic ☀️ — breezy linen sundress, pleated tennis skirt/linen shorts & strappy sandals"
          : "Women's High-Heat Casual ☀️ — Airy terracotta linen sundress or tunic paired with linen shorts/skirt and strappy leather sandals.";
      } else if(f>=27){
        top = (bias>0) ? "f_midi_dress" : "f_kurti_top";
        bottom = (bias>0) ? "f_skirt_shorts" : "f_palazzo_trousers";
        shoes = (bias>0) ? "f_sandals_flats" : "f_sneakers";
        vibe = isGenZ
          ? "effortless campus summer 🌸 — pastel embroidered kurti / floral puff blouse with flowy cream palazzos & platform kicks"
          : "Women's Warm Campus Attire 🌸 — Breathable embroidered cotton kurti or floral blouse with flowy palazzos and platform sneakers.";
      } else if(f>=21){
        top = (bias<0) ? "f_jacket_trench" : "f_top_blouse";
        bottom = "f_wide_jeans";
        shoes = "f_sneakers";
        vibe = isGenZ
          ? "it-girl college aesthetic 🎀 — sage ribbed cropped cardigan & baby tee with high-waisted light-wash wide denim"
          : "Women's Mild Weather Smart Casual 🎒 — Soft pastel ribbed cardigan & cotton tee with high-waisted wide-leg denim and sneakers.";
      } else if(f>=15){
        top = "f_jacket_trench";
        bottom = "f_wide_jeans";
        shoes = (bias<0) ? "f_ankle_boots" : "f_sneakers";
        vibe = isGenZ
          ? "cool-girl autumn layer szn 🧥 — camel belted trench or cropped denim jacket with high-waisted wide-leg jeans"
          : "Women's Cool Weather Layering 🧥 — Chic camel trench or cropped denim jacket over a knit top with wide-leg denim.";
      } else if(f>=9){
        top = "f_sweater_knit";
        bottom = "f_wide_jeans";
        shoes = "f_ankle_boots";
        acc.push("scarf");
        vibe = isGenZ
          ? "cozycore autumn aesthetic 🍁 — blush cable-knit turtleneck sweater, high-waisted wide denim & suede Chelsea ankle boots"
          : "Women's Chilly Weather Casual 🍁 — Chunky cable-knit turtleneck or cashmere wrap cardigan with high-waisted denim and ankle boots.";
      } else {
        top = "f_winter_puffer";
        bottom = "f_wide_jeans";
        shoes = "f_ankle_boots";
        acc.push("beanie","gloves","scarf");
        vibe = isGenZ
          ? "snow-bunny winter armor ❄️ — pearl-ivory belted down puffer coat, fleece thermal, warm denim & suede boots"
          : "Women's Deep Winter Casual ❄️ — Belted down puffer coat over a fleece-lined thermal top with warm denim and suede ankle boots.";
      }
    } else if(act==="office"){
      // FEMALE OFFICE / FORMAL (Distinct across Hot, Warm, Cool & Cold!)
      if(f>=30){
        top = "f_kurti_top";
        bottom = "f_palazzo_trousers";
        shoes = "f_sandals_flats";
        vibe = isGenZ
          ? "summer corporate chic 💼 — breathable pastel cotton kurti/blouse, airy cream palazzos & pointed ballet flats"
          : "Women's Warm-Weather Office Attire 💼 — Breathable cotton tunic/blouse paired with flowy cream palazzo trousers and pointed ballet flats.";
      } else if(f>=20){
        top = "f_formal_blouse";
        bottom = "f_palazzo_trousers";
        shoes = "f_heels_mules";
        vibe = isGenZ
          ? "corporate siren / old-money aesthetic 💼 — ivory silk blouse, draped linen blazer, espresso wide slacks & block-heel mules"
          : "Women's Executive Business Attire 💼 — Ivory silk button-down blouse with a tailored beige blazer, formal wide-leg slacks, and block-heel mules.";
      } else if(f>=12){
        top = (bias<0) ? "f_formal_coat" : "f_formal_blouse";
        bottom = "f_palazzo_trousers";
        shoes = (bias<0) ? "f_ankle_boots" : "f_heels_mules";
        vibe = isGenZ
          ? "autumn executive blazer fit 💼 — structured blazer & silk blouse with tailored espresso wide-leg formal slacks & mules"
          : "Women's Cool-Weather Business Formal 💼 — Structured blazer layered over an ivory silk blouse with tailored formal slacks and closed mules.";
      } else {
        // Cold weather formal (e.g. New York in cold/winter) -> Long tailored wool overcoat + merino turtleneck + blazer!
        top = "f_formal_coat";
        bottom = "f_palazzo_trousers";
        shoes = "f_ankle_boots";
        acc.push("scarf");
        if(f<5)acc.push("gloves");
        vibe = isGenZ
          ? "manhattan winter executive 💼❄️ — tailored long espresso/camel wool overcoat over merino turtleneck & blazer with formal slacks & heeled boots"
          : "Women's Cold-Weather Executive Overcoat 💼❄️ — Tailored long wool winter coat layered over a cream merino turtleneck, blazer, formal slacks, and heeled dress boots.";
      }
    } else if(act==="workout"){
      // FEMALE WORKOUT / GYM (4 Distinct Climate Tiers — 100% Dedicated Women's Gym Tops, Bottoms & Running Trainers!)
      if(f>=28){
        // Tier 1: Hot Climate (>= 28°C) -> Ribbed Sports Tank / Racerback Tee + Seamless Biker Shorts / Running Shorts + Cushioned Running Shoes
        top = "f_gym_top_summer";
        bottom = "f_gym_shorts_biker";
        shoes = "f_gym_runners";
        vibe = isGenZ
          ? "hot-girl summer cardio / gym era 🔥🏋️‍♀️ — berry-lilac seamless ribbed sports tank & black racerback tee with 5-inch sculpted biker shorts & cushioned runners"
          : "Women's High-Heat Athletic Gear 🏃‍♀️☀️ — Breathable seamless ribbed sports tank and moisture-wicking racerback tee paired with 5-inch biker/running shorts and cushioned running trainers.";
      } else if(f>=20){
        // Tier 2: Warm / Mild Climate (20–27°C) -> Sculpted Dusty-Rose Gym Top + Full-Length Compression Gym Leggings + Cushioned Running Shoes
        top = (bias>0) ? "f_gym_top_summer" : "f_activewear";
        bottom = (bias>0) ? "f_gym_shorts_biker" : "f_gym_leggings";
        shoes = "f_gym_runners";
        vibe = isGenZ
          ? "pilates princess / gym girl era 🧘‍♀️💪 — dusty-rose sculpted moisture-wicking gym top with high-waisted charcoal/sage compression leggings & cross-trainers"
          : "Women's Performance Gym & Studio Wear 🧘‍♀️ — Four-way stretch moisture-wicking workout top paired with high-waisted full-length seamless compression leggings and cross-training shoes.";
      } else if(f>=12){
        // Tier 3: Cool Climate (12–19°C) -> Fitted Define Zip-Up Running Jacket & Thumbhole Top + Full-Length Compression Gym Leggings + Running Shoes
        top = (bias<0) ? "f_gym_hoodie" : "f_gym_jacket";
        bottom = (bias<0) ? "f_gym_joggers" : "f_gym_leggings";
        shoes = "f_gym_runners";
        vibe = isGenZ
          ? "cool-morning run club / Define jacket era 🏃‍♀️✨ — sculpted sage & dusty-rose zip-up Define running jacket & thumbhole top with compression gym leggings & runners"
          : "Women's Cool-Weather Running & Gym Layer 🏃‍♀️ — Fitted zip-up athletic track jacket and long-sleeve thumbhole top paired with high-waisted compression leggings and stability running shoes.";
      } else {
        // Tier 4: Cold / Winter Climate (< 12°C, e.g. New York Winter) -> Quarter-Zip Scuba Fleece Gym Hoodie & Thermal Pullover + Tapered Tech-Fleece Joggers + Running Shoes
        top = "f_gym_hoodie";
        bottom = "f_gym_joggers";
        shoes = "f_gym_runners";
        if(f<8)acc.push("beanie","gloves");
        vibe = isGenZ
          ? "winter arc gym girl / cold-weather run fit ❄️💪 — quarter-zip scuba fleece gym hoodie & thermal compression pullover with high-waisted tech-fleece joggers & runners"
          : "Women's Cold-Weather Winter Training Set 🏃‍♀️❄️ — Insulated quarter-zip scuba fleece gym hoodie and thermal compression pullover paired with tapered tech-fleece training joggers and running trainers.";
      }
    } else {
      // FEMALE TRAVEL / COMMUTE
      if(f>=28){
        top = (bias>0) ? "f_midi_dress" : "f_kurti_top";
        bottom = "f_palazzo_trousers";
        shoes = (bias>0) ? "f_sandals_flats" : "f_sneakers";
        vibe = isGenZ
          ? "resort jetsetter fit ✈️ — breezy cotton kurti / linen co-ord with flowy cream palazzos & comfy slides/sneakers"
          : "Women's Warm Transit Comfort ✈️ — Breathable linen/cotton tunic with wide-leg palazzo pants for effortless long-distance travel.";
      } else if(f>=19){
        top = "f_top_blouse";
        bottom = "f_wide_jeans";
        shoes = "f_sneakers";
        vibe = isGenZ
          ? "airport it-girl lounge fit ✈️ — sage ribbed cardigan over baby tee with high-waisted wide-leg denim & platform kicks"
          : "Women's Cabin-Ready Travel Outfit ✈️ — Soft knit cardigan over a cotton tee with relaxed wide-leg denim for AC temperature swings.";
      } else if(f>=11){
        top = "f_jacket_trench";
        bottom = "f_wide_jeans";
        shoes = "f_sneakers";
        vibe = isGenZ
          ? "euro-trip transit trench 🚆 — camel belted trench jacket with wide-leg travel denim & platform sneakers"
          : "Women's Cool-Weather Transit Layering 🚆 — Belted trench or denim jacket with comfortable wide-leg jeans and walking sneakers.";
      } else {
        top = (f<6 || bias<0) ? "f_winter_puffer" : "f_sweater_knit";
        bottom = "f_wide_jeans";
        shoes = "f_ankle_boots";
        acc.push("scarf");
        vibe = isGenZ
          ? "winter flight cozycore ❄️ — belted down puffer / chunky turtleneck knit with wide-leg denim & warm ankle boots"
          : "Women's Winter Commute & Travel ❄️ — Insulated knit sweater or down puffer coat with warm denim and suede boots.";
      }
    }
  }
  // =========================================================================
  // MALE WARDROBE ENGINE (100% Dedicated Men's Tops, Bottoms & Footwear)
  // =========================================================================
  else {
    if(act==="casual"){
      if(f>=32){
        top = (bias>0) ? "linen_shirt" : "tshirt";
        bottom = "shorts";
        shoes = "sandals";
        vibe = isGenZ
          ? "beat-the-heat summer drip 🔥 — breezy camp-collar linen or graphic tee with cargo shorts & slides"
          : "Men's High-Heat Casual ☀️ — Breathable linen or lightweight cotton t-shirt paired with airy cargo shorts and slide sandals.";
      } else if(f>=27){
        top = (bias<0) ? "linen_shirt" : "tshirt";
        bottom = (bias>0) ? "shorts" : "jeans";
        shoes = (bias>0) ? "sandals" : "sneakers";
        vibe = isGenZ
          ? "campus fresh summer drip 🎒 — oversized vintage graphic tee with relaxed denim/shorts & chunky kicks"
          : "Men's Warm Campus Casual 📚 — Breathable cotton t-shirt or linen shirt paired with relaxed denim and clean sneakers.";
      } else if(f>=21){
        top = "shirt";
        bottom = "jeans";
        shoes = "sneakers";
        vibe = isGenZ
          ? "effortless college aesthetic 📚 — plaid flannel or oxford overshirt over tee with baggy streetwear denim & kicks"
          : "Men's Mild Weather Smart Casual 🎒 — Classic button-down shirt layered over a tee with straight-leg denim and sneakers.";
      } else if(f>=15){
        top = "jacket";
        bottom = "jeans";
        shoes = "sneakers";
        vibe = isGenZ
          ? "campus layer szn 🧥 — cropped flight bomber or denim trucker jacket with baggy denim & retro runners"
          : "Men's Cool Weather Layering 🧥 — Bomber or denim trucker jacket worn over a t-shirt with durable denim jeans.";
      } else if(f>=9){
        top = "sweater";
        bottom = "jeans";
        shoes = "boots";
        acc.push("scarf");
        vibe = isGenZ
          ? "cozycore autumn street drip 🍁 — heavyweight boxy fleece hoodie / cable-knit sweater, baggy denim & combat boots"
          : "Men's Chilly Weather Casual 🍁 — Insulated wool cable-knit sweater or fleece hoodie with straight-leg denim and leather boots.";
      } else {
        top = "thermal";
        bottom = "jeans";
        shoes = "boots";
        acc.push("beanie","gloves","scarf");
        vibe = isGenZ
          ? "gorpcore winter armor ❄️ — thermal base layer, heavy down puffer coat, heavyweight denim & lug-sole stompers"
          : "Men's Deep Winter Casual ❄️ — Thermal base layer, heavy insulated puffer coat, heavyweight denim, and leather winter boots.";
      }
    } else if(act==="office"){
      // MALE OFFICE / FORMAL (Uses Suit Blazers & Wool Overcoats in cool/cold weather — never casual sweaters!)
      if(f>=30){
        top = "linen_shirt";
        bottom = "trousers";
        shoes = "loafers";
        vibe = isGenZ
          ? "summer old-money executive 💼 — breathable beige linen/oxford shirt, lightweight khaki chinos & penny loafers"
          : "Men's Warm-Weather Business Casual 💼 — Breathable linen or lightweight cotton shirt with tailored beige chinos and loafers.";
      } else if(f>=20){
        top = "formal_shirt";
        bottom = "trousers";
        shoes = "loafers";
        vibe = isGenZ
          ? "corporate hustle drip 💼 — crisp sky-blue or white oxford dress shirt, pleated charcoal trousers & penny loafers"
          : "Men's Professional Business Attire 💼 — Crisp formal dress shirt paired with tailored charcoal trousers and polished leather loafers.";
      } else if(f>=12){
        // Cool weather formal (e.g. 12–19°C) -> Tailored Navy Wool Suit Blazer + Dress Shirt + Tie!
        top = (bias<0) ? "formal_overcoat" : "formal_blazer";
        bottom = "trousers";
        shoes = "loafers";
        vibe = isGenZ
          ? "wall-street suit blazer fit 💼 — tailored navy wool suit blazer over crisp white dress shirt & silk tie with charcoal slacks & loafers"
          : "Men's Cool-Weather Executive Suiting 💼 — Tailored navy wool suit blazer worn over a crisp dress shirt and tie with pleated dress trousers.";
      } else {
        // Cold weather formal (e.g. New York < 12°C) -> Tailored Wool Overcoat + Merino Dress Layer + Suit Shirt & Tie!
        top = "formal_overcoat";
        bottom = "trousers";
        shoes = "boots";
        acc.push("scarf");
        if(f<5)acc.push("gloves");
        vibe = isGenZ
          ? "manhattan winter executive armor 💼❄️ — tailored camel/charcoal wool overcoat over merino dress layer, shirt & tie with wool slacks & dress boots"
          : "Men's Winter Formal Overcoat & Suiting 💼❄️ — Tailored wool winter overcoat layered over a fine merino dress sweater, shirt, tie, wool dress trousers, and leather dress boots.";
      }
    } else if(act==="workout"){
      // MALE WORKOUT / GYM (100% Technical Activewear — Quarter-Zip Track Pullover & Tapered Joggers in cold weather, NEVER sweaters or dress trousers!)
      if(f>=26){
        top = "gym_tee";
        bottom = "gym_shorts";
        shoes = "sneakers";
        vibe = isGenZ
          ? "high-heat shred fit 💪 — ultra-light moisture-wicking dry-fit tee, above-knee 5-inch running shorts & trainers"
          : "Men's Hot-Weather Athletic Wear 🏃 — Ultra-breathable moisture-wicking training t-shirt and lightweight running shorts.";
      } else if(f>=17){
        top = "gym_tee";
        bottom = (bias<0) ? "gym_joggers" : "gym_shorts";
        shoes = "sneakers";
        vibe = isGenZ
          ? "gym rat pump-cover fit 💪 — oversized dry-fit pump-cover tee, athletic training shorts/joggers & chunky trainers"
          : "Men's Standard Performance Workout 🏃 — Moisture-wicking synthetic training t-shirt and flexible workout shorts.";
      } else {
        // Cool & Cold Workout (e.g. New York < 17°C) -> Performance Quarter-Zip Track Top / Tech-Fleece Running Hoodie + Tapered Athletic Joggers!
        top = "gym_hoodie";
        bottom = "gym_joggers";
        shoes = "sneakers";
        if(f<8)acc.push("beanie","gloves");
        vibe = isGenZ
          ? "winter arc / cold-weather run fit 💪❄️ — sleek black performance quarter-zip track top & tech-fleece hoodie with tapered zip-pocket gym joggers & runners"
          : "Men's Cold-Weather Athletic Training Set 🏃❄️ — Technical quarter-zip thermal running top and moisture-wicking tech-fleece hoodie paired with tapered athletic training joggers.";
      }
    } else {
      // MALE TRAVEL / COMMUTE
      if(f>=28){
        top = (bias>0) ? "tshirt" : "linen_shirt";
        bottom = (bias>0) ? "shorts" : "trousers";
        shoes = "sneakers";
        vibe = isGenZ
          ? "summer jetsetter drip ✈️ — breezy camp-collar linen shirt or boxy tee with relaxed chinos/shorts & kicks"
          : "Men's Warm-Weather Transit Comfort ✈️ — Breathable linen shirt with lightweight chinos and cushioned walking sneakers.";
      } else if(f>=19){
        top = "shirt";
        bottom = "jeans";
        shoes = "sneakers";
        vibe = isGenZ
          ? "transit layer drip 🚆 — plaid flannel or oxford overshirt with relaxed denim & retro suede runners"
          : "Men's Cabin-Ready Travel Layering 🚆 — Button-down shirt over a tee with stretch denim for easy AC temperature regulation.";
      } else if(f>=11){
        top = "jacket";
        bottom = "trousers";
        shoes = "sneakers";
        vibe = isGenZ
          ? "airport bomber szn ✈️ — flight bomber or denim jacket over tee with relaxed chinos & chunky kicks"
          : "Men's Cool-Weather Travel Jacket ✈️ — Versatile casual jacket over a t-shirt with comfortable travel trousers.";
      } else {
        top = (f<6 || bias<0) ? "thermal" : "sweater";
        bottom = "jeans";
        shoes = "boots";
        acc.push("scarf");
        vibe = isGenZ
          ? "winter transit armor ❄️ — heavyweight puffer coat / fleece hoodie with durable denim & lug-sole boots"
          : "Men's Winter Commute & Travel ❄️ — Insulated wool sweater or heavy winter coat with denim jeans and leather boots.";
      }
    }
  }

  // Detect active precipitation from weather_code as well as forecast probability
  const isStorm = w.code>=95;
  const isHeavyRainCode = (w.code>=63 && w.code<=67) || (w.code>=81 && w.code<=82) || isStorm;
  const isRainCode = (w.code>=51 && w.code<=67) || (w.code>=80 && w.code<=82) || isStorm;
  const isSnowCode = (w.code>=71 && w.code<=77) || w.code===85 || w.code===86;
  const [condLabel] = wx(w.code);

  // Wet / snowy footwear protection: avoid open sandals in rain, and use boots in cool/cold rain or snow
  if((isRainCode || w.rain>=50) && act!=="workout"){
    if(shoes==="sandals"){
      shoes="sneakers";
      why.push("Wet weather adjustment: swapped open sandals for closed-toe sneakers to keep feet dry and prevent slipping.");
    } else if(shoes==="f_sandals_flats"){
      shoes="f_sneakers";
      why.push("Wet weather adjustment: swapped open sandals for closed-toe sneakers to keep feet dry in the rain.");
    } else if(f<16 && (act==="casual" || act==="travel")){
      if(!isFem && shoes==="sneakers"){
        shoes="boots";
        why.push("Cold & wet conditions: upgraded footwear to weather-resistant leather boots for warmth and puddle protection.");
      } else if(isFem && shoes==="f_sneakers"){
        shoes="f_ankle_boots";
        why.push("Cold & wet conditions: upgraded footwear to ankle boots for warmth and wet-pavement protection.");
      }
    }
  }

  // Explain primary selection
  if(isGenZ){
    why.push(`Effective temperature is ${fmt(f)} (ambient feels-like ${fmt(w.feels)}): matched with ${PIECES[top].vibe} + ${PIECES[bottom].vibe}.`);
  } else {
    why.push(`Effective temperature is ${fmt(f)} (ambient feels-like ${fmt(w.feels)}): recommends a ${PLAIN_NAMES[top]||"top"} paired with ${PLAIN_NAMES[bottom]||"bottom"}.`);
  }

  // Weather-specific add-ons (Rain, Drizzle, Snow, UV, Wind, Humidity)
  if(w.rain>=60 || isHeavyRainCode){
    acc.unshift("umbrella","raincoat");
    vibe += isGenZ ? " + rain-proofed 🌧️" : " (Umbrella & Raincoat Included ☔)";
    const reasonPrefix = isRainCode ? `Active ${condLabel.toLowerCase()} (${w.rain}% rain chance)` : `High precipitation probability (${w.rain}%)`;
    why.push(`${reasonPrefix}: both a compact umbrella and a waterproof raincoat are included.`);
  } else if(w.rain>=25 || isRainCode){
    if(w.wind>=25){
      acc.unshift("umbrella","raincoat");
      vibe += isGenZ ? " + rain & wind shield ☔" : " (Umbrella & Raincoat Included ☔)";
      why.push(`${isRainCode ? "Active "+condLabel.toLowerCase() : "Rain chance of "+w.rain+"%"} with ${Math.round(w.wind)} km/h wind: added both an umbrella and a waterproof raincoat.`);
    } else {
      acc.unshift("umbrella");
      vibe += isGenZ ? " + umbrella packed ☂️" : " (Umbrella Included ☂️)";
      why.push(`${isRainCode ? "Active "+condLabel.toLowerCase()+" outdoors" : "Precipitation probability is "+w.rain+"%"}: carrying a compact umbrella is recommended.`);
    }
  }

  if(isSnowCode){
    if(!acc.includes("beanie"))acc.push("beanie");
    if(!acc.includes("gloves"))acc.push("gloves");
    if(!acc.includes("scarf"))acc.push("scarf");
    if(!acc.includes("umbrella") && w.feels>=-2)acc.unshift("umbrella");
    why.push(`Active ${condLabel.toLowerCase()} conditions: thermal winter accessories (beanie, gloves, and wool scarf) are included for snow protection.`);
  }

  if(w.uv>=6){
    acc.push("sunglasses","cap","sunscreen");
    why.push("UV index reaches "+Math.round(w.uv)+": full sun protection (UV sunglasses, baseball cap, and SPF 50+ sunscreen) is included.");
  } else if(w.uv>=3 && w.day && w.code<=2 && !isRainCode){
    acc.push("sunglasses");
    why.push("Sunny daytime conditions (UV "+Math.round(w.uv)+"): UV-protective sunglasses added for glare and eye comfort.");
  }

  if(w.wind>=30 || (w.wind>=22 && f<14)){
    acc.push("windbreaker");
    why.push("Wind speed is "+Math.round(w.wind)+" km/h: windbreaker shell added to block wind chill and convective heat loss.");
  }

  if(w.hum>=75&&f>=26){
    why.push("High relative humidity ("+w.hum+"%): lightweight breathable fabrics facilitate evaporative cooling.");
  }
  if(isStorm){
    why.push("Severe thunderstorm alert: minimize outdoor exposure during active lightning.");
  }

  // Raw outdoor weather comfort score (based on raw ambient w.feels + active rain/snow/wind/UV)
  const rainPenalty = (w.rain>=60 || isHeavyRainCode) ? 15 : ((w.rain>=25 || isRainCode || isSnowCode) ? 8 : 0);
  let s=100-Math.abs(w.feels-22)*3-rainPenalty-(w.uv>=8?8:0)-(w.wind>=40?10:(w.wind>=28?5:0));
  // Variant offset based on "I usually feel" sensitivity so photos shift when user toggles Normal / Cold easily / Hot easily
  const sensVariantShift = bias < 0 ? 1 : (bias > 0 ? 2 : 0);

  return{top,bottom,shoes,acc:[...new Set(acc)],why,vibe,sensVariantShift,score:Math.max(5,Math.min(100,Math.round(s)))};
}
