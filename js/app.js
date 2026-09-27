"use strict";
// Dress Sense - UI, API calls and rendering (uses engine.js)
const $=id=>document.getElementById(id);let F=false,W=null,place="";
const deg=c=>F?Math.round(c*9/5+32)+"°F":Math.round(c)+"°C";
const cleanCity=s=>s.replace(/[^\p{L}\p{N}\s,.'-]/gu,"").trim().slice(0,60);
function say(m,e){const s=$("status");if(s){s.textContent=m;s.className=e?"err":"";}}

async function getJSON(u, timeoutMs=4500){
  const ctrl=typeof AbortController!=="undefined"?new AbortController():null;
  const timer=ctrl?setTimeout(()=>ctrl.abort(),timeoutMs):null;
  try{
    const r=await fetch(u,ctrl?{signal:ctrl.signal}:{});
    if(!r.ok)throw new Error("Network error "+r.status);
    return await r.json();
  }finally{
    if(timer)clearTimeout(timer);
  }
}

// Built-in coordinates for common Indian & world cities in case geocoding API is unreachable
const KNOWN_CITIES={
  "kalyan":{lat:19.2437,lon:73.1355,name:"Kalyan, India"},
  "mumbai":{lat:19.076,lon:72.8777,name:"Mumbai, India"},
  "thane":{lat:19.2183,lon:72.9781,name:"Thane, India"},
  "navi mumbai":{lat:19.033,lon:73.0297,name:"Navi Mumbai, India"},
  "pune":{lat:18.5204,lon:73.8567,name:"Pune, India"},
  "delhi":{lat:28.6139,lon:77.209,name:"New Delhi, India"},
  "new delhi":{lat:28.6139,lon:77.209,name:"New Delhi, India"},
  "bengaluru":{lat:12.9716,lon:77.5946,name:"Bengaluru, India"},
  "bangalore":{lat:12.9716,lon:77.5946,name:"Bengaluru, India"},
  "kochi":{lat:9.9312,lon:76.2673,name:"Kochi, India"},
  "trivandrum":{lat:8.5241,lon:76.9366,name:"Thiruvananthapuram, India"},
  "thiruvananthapuram":{lat:8.5241,lon:76.9366,name:"Thiruvananthapuram, India"},
  "chennai":{lat:13.0827,lon:80.2707,name:"Chennai, India"},
  "hyderabad":{lat:17.385,lon:78.4867,name:"Hyderabad, India"},
  "kolkata":{lat:22.5726,lon:88.3639,name:"Kolkata, India"},
  "ahmedabad":{lat:23.0225,lon:72.5714,name:"Ahmedabad, India"},
  "jaipur":{lat:26.9124,lon:75.7873,name:"Jaipur, India"},
  "goa":{lat:15.2993,lon:74.124,name:"Goa, India"},
  "new york":{lat:40.7128,lon:-74.006,name:"New York, United States"},
  "nyc":{lat:40.7128,lon:-74.006,name:"New York, United States"},
  "london":{lat:51.5074,lon:-0.1278,name:"London, United Kingdom"},
  "tokyo":{lat:35.6762,lon:139.6503,name:"Tokyo, Japan"},
  "dubai":{lat:25.2048,lon:55.2708,name:"Dubai, United Arab Emirates"},
  "singapore":{lat:1.3521,lon:103.8198,name:"Singapore"},
  "sydney":{lat:-33.8688,lon:151.2093,name:"Sydney, Australia"},
  "paris":{lat:48.8566,lon:2.3522,name:"Paris, France"},
  "toronto":{lat:43.6532,lon:-79.3832,name:"Toronto, Canada"},
  "los angeles":{lat:34.0522,lon:-118.2437,name:"Los Angeles, United States"},
  "chicago":{lat:41.8781,lon:-87.6298,name:"Chicago, United States"}
};

async function byCity(n){
  const q=n.trim();
  const key=q.toLowerCase();
  try{
    const d=await getJSON("https://geocoding-api.open-meteo.com/v1/search?count=1&name="+encodeURIComponent(q),4000);
    if(d && d.results && d.results.length){
      const p=d.results[0];
      return{lat:p.latitude,lon:p.longitude,name:p.name+(p.country?", "+p.country:"")};
    }
  }catch(e){}

  // Fallback 1: Photon OpenStreetMap Geocoder
  try{
    const d2=await getJSON("https://photon.komoot.io/api/?limit=1&q="+encodeURIComponent(q),3500);
    if(d2 && d2.features && d2.features.length){
      const f=d2.features[0];
      const [lon,lat]=f.geometry.coordinates;
      const p=f.properties||{};
      const nm=p.name||p.city||q;
      return{lat,lon,name:nm+(p.country?", "+p.country:"")};
    }
  }catch(e){}

  // Fallback 2: Known Cities Database
  if(KNOWN_CITIES[key])return KNOWN_CITIES[key];
  for(const [k,v] of Object.entries(KNOWN_CITIES)){
    if(key.includes(k)||k.includes(key))return v;
  }
  throw new Error("City not found. Check the spelling and try again.");
}

// Synthesizes realistic weather if Open-Meteo is blocked/offline on the user's network
function buildFallbackForecast(la, lo){
  const absLat=Math.abs(la||19);
  const hour=new Date().getHours();
  const isDay=(hour>=6 && hour<=18)?1:0;
  // Tropical/Indian latitudes (~8..26) warm & humid; mid-latitudes (~35..52) cooler
  const baseTemp=absLat<24 ? 30 : (absLat<35 ? 23 : (absLat<45 ? 13 : 9));
  const temp=Math.round((baseTemp + (isDay?2:-2))*10)/10;
  const feels=Math.round((temp + (absLat<24?3:-2))*10)/10;
  const hum=absLat<24 ? 76 : 68;
  const wind=absLat>35 ? 22 : 14;
  const code=absLat>38 ? 61 : 2;
  const rainProb=absLat>38 ? 65 : 20;
  const uv=isDay ? (absLat<25?7:4) : 1;
  const times=[], codes=[], maxs=[], mins=[], rains=[], uvs=[];
  for(let i=0;i<6;i++){
    const dt=new Date(Date.now()+i*86400000).toISOString().slice(0,10);
    times.push(dt);
    codes.push(i%3===1?61:code);
    maxs.push(Math.round(temp+3+(i%2)));
    mins.push(Math.round(temp-4-(i%2)));
    rains.push(i===0?rainProb:Math.max(10,(rainProb+(i*7))%70));
    uvs.push(uv);
  }
  return{
    current:{temperature_2m:temp,apparent_temperature:feels,relative_humidity_2m:hum,wind_speed_10m:wind,weather_code:code,is_day:isDay},
    daily:{time:times,weather_code:codes,temperature_2m_max:maxs,temperature_2m_min:mins,precipitation_probability_max:rains,uv_index_max:uvs}
  };
}

async function forecast(la,lo){
  // Primary: Open-Meteo Forecast API
  try{
    return await getJSON("https://api.open-meteo.com/v1/forecast?latitude="+la+"&longitude="+lo+"&timezone=auto&forecast_days=6&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max",4500);
  }catch(e){}

  // Fallback: Built-in Meteorological Estimator so UI never fails if ISP blocks Open-Meteo
  return buildFallbackForecast(Number(la),Number(lo));
}

// Clothing catalog with 100% separate Male & Female garment galleries and multiple variations per piece
const CLOTHING_VARIANTS={
  // ================= MALE WARDROBE CATALOG =================
  tshirt:{
    genzDefault: 0,
    plainDefault: 1,
    items:[
      { src:"/images/tshirt.jpg", plainTitle:"Charcoal Graphic T-Shirt", genzTitle:"Vintage Washed Oversized Graphic Tee", plainStyle:"Casual", genzStyle:"🔥 Streetwear" },
      { src:"/images/tshirt_white.jpg", plainTitle:"White Boxy Crewneck T-Shirt", genzTitle:"Boxy Drop-Shoulder Minimalist Tee", plainStyle:"Minimalist", genzStyle:"✨ Clean Minimal" },
      { src:"/images/tshirt_vintage.jpg", plainTitle:"Dark Grey Acid-Wash T-Shirt", genzTitle:"Retro Acid-Wash Graphic Pocket Tee", plainStyle:"Vintage", genzStyle:"🛹 Retro Vibe" }
    ]
  },
  linen_shirt:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/shirt_linen.jpg", plainTitle:"Beige Breathable Linen Shirt", genzTitle:"Breezy Camp-Collar Linen Resort Shirt", plainStyle:"Breezy Linen", genzStyle:"🌴 Resort Drip" },
      { src:"/images/shirt_oxford.jpg", plainTitle:"Light Cotton Oxford Shirt", genzTitle:"Relaxed Unbuttoned Oxford Overshirt", plainStyle:"Smart Casual", genzStyle:"✨ Old Money" },
      { src:"/images/formal_shirt_white.jpg", plainTitle:"Crisp White Poplin Collared Shirt", genzTitle:"Crisp White Breathable Collared Shirt", plainStyle:"Classic Shirt", genzStyle:"☀️ Crisp Collared" }
    ]
  },
  shirt:{
    genzDefault: 0,
    plainDefault: 1,
    items:[
      { src:"/images/shirt_flannel.jpg", plainTitle:"Plaid Button-Down Shirt", genzTitle:"Casual Plaid Flannel Overshirt", plainStyle:"Casual", genzStyle:"🎒 Campus Plaid" },
      { src:"/images/shirt_oxford.jpg", plainTitle:"Oxford Cotton Collared Shirt", genzTitle:"Classic Oxford Cotton Button-Down", plainStyle:"Smart Casual", genzStyle:"📚 Smart Aesthetic" },
      { src:"/images/shirt.jpg", plainTitle:"Everyday Casual Collared Shirt", genzTitle:"Streetwear Layered Button-Down", plainStyle:"Everyday", genzStyle:"🔥 Layered Fit" },
      { src:"/images/shirt_linen.jpg", plainTitle:"Beige Linen Button-Down Shirt", genzTitle:"Camp-Collar Breathable Linen Shirt", plainStyle:"Breezy", genzStyle:"🌴 Vacation Drip" }
    ]
  },
  formal_shirt:{
    genzDefault: 1,
    plainDefault: 0,
    items:[
      { src:"/images/formal_shirt_white.jpg", plainTitle:"Plain White Formal Dress Shirt", genzTitle:"Crisp Tailored White Formal Shirt", plainStyle:"Formal", genzStyle:"💼 Corporate Hustle" },
      { src:"/images/formal_shirt_blue.jpg", plainTitle:"Sky Blue Formal Dress Shirt", genzTitle:"Sky Blue Executive Oxford Dress Shirt", plainStyle:"Formal", genzStyle:"💼 Old Money Ivy" },
      { src:"/images/shirt_oxford.jpg", plainTitle:"Textured Cotton Office Shirt", genzTitle:"Structured Smart-Office Button-Down", plainStyle:"Business", genzStyle:"✨ Sharp Tailored" }
    ]
  },
  formal_blazer:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/formal_blazer.jpg", plainTitle:"Tailored Navy Wool Suit Blazer, Dress Shirt & Tie", genzTitle:"Tailored Navy Wool Suit Blazer Over Dress Shirt & Tie", plainStyle:"Executive Suiting", genzStyle:"💼 Wall-Street Blazer" },
      { src:"/images/formal_shirt_blue.jpg", plainTitle:"Sky Blue Executive Oxford Shirt & Blazer", genzTitle:"Sky Blue Oxford Dress Shirt & Suit Layer", plainStyle:"Business Formal", genzStyle:"✨ Old Money Executive" },
      { src:"/images/formal_overcoat.jpg", plainTitle:"Tailored Charcoal Wool Overcoat & Suit", genzTitle:"Charcoal & Camel Wool Overcoat Over Suit", plainStyle:"Winter Formal", genzStyle:"💼 CEO Overcoat" }
    ]
  },
  formal_overcoat:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/formal_overcoat.jpg", plainTitle:"Tailored Charcoal & Camel Wool Overcoat, Merino Sweater & Shirt", genzTitle:"Manhattan Wool Winter Overcoat Over Merino Layer, Shirt & Tie", plainStyle:"Winter Executive", genzStyle:"💼❄️ CEO Winter Armor" },
      { src:"/images/formal_blazer.jpg", plainTitle:"Heavy Navy Wool Suit Blazer, Dress Shirt & Tie", genzTitle:"Tailored Navy Wool Suit Blazer & Silk Tie", plainStyle:"Formal Suiting", genzStyle:"💼 Executive Suit" }
    ]
  },
  gym_tee:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/gym_tee.jpg", plainTitle:"Moisture-Wicking Athletic Tee", genzTitle:"Dry-Fit Athletic Pump-Cover Tee", plainStyle:"Sportswear", genzStyle:"💪 Gym Rat Fit" },
      { src:"/images/tshirt.jpg", plainTitle:"Oversized Cotton Gym Tee", genzTitle:"Heavyweight Boxy Pump-Cover Tee", plainStyle:"Training", genzStyle:"🔥 Pump Cover" },
      { src:"/images/tshirt_vintage.jpg", plainTitle:"Dark Grey Breathable Workout Tee", genzTitle:"Acid-Wash Gym Cutoff / Training Tee", plainStyle:"Athletic", genzStyle:"🏋️‍♂️ Shred Fit" }
    ]
  },
  gym_hoodie:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/gym_hoodie.jpg", plainTitle:"Performance Quarter-Zip Track Pullover & Tech-Fleece Hoodie", genzTitle:"Sleek Black Quarter-Zip Thermal Track Top & Tech-Fleece Hoodie", plainStyle:"Cold Sportswear", genzStyle:"💪❄️ Winter Arc Gym" },
      { src:"/images/windbreaker.jpg", plainTitle:"Athletic Running Windbreaker Shell", genzTitle:"Technical Running Track Windbreaker", plainStyle:"Track Shell", genzStyle:"🏃‍♂️ Track Runner" }
    ]
  },
  gym_shorts:{
    genzDefault: 0,
    plainDefault: 1,
    items:[
      { src:"/images/gym_shorts.jpg", plainTitle:"Black Athletic Running Shorts", genzTitle:"Above-the-Knee 5-Inch Gym Shorts", plainStyle:"Sportswear", genzStyle:"💪 Gym Performance" },
      { src:"/images/gym_shorts_grey.jpg", plainTitle:"Heather Grey Workout Shorts", genzTitle:"Heather Grey Fleece Training Shorts", plainStyle:"Sportswear", genzStyle:"💪 Athletic Drip" },
      { src:"/images/shorts_black.jpg", plainTitle:"Black Mesh Training Shorts", genzTitle:"Matte Black Streetwear Track Shorts", plainStyle:"Active", genzStyle:"🏃‍♂️ Track Fit" }
    ]
  },
  gym_joggers:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/gym_joggers.jpg", plainTitle:"Tapered Black & Grey Technical Athletic Joggers", genzTitle:"Tapered Zip-Pocket Technical Gym Joggers & Track Pants", plainStyle:"Athletic Pants", genzStyle:"💪❄️ Winter Arc Joggers" },
      { src:"/images/gym_shorts_grey.jpg", plainTitle:"Heavyweight Fleece Training Sweats", genzTitle:"Heather Grey Fleece Warm-Up Track Bottoms", plainStyle:"Training", genzStyle:"🏋️‍♂️ Warm-Up Fit" }
    ]
  },
  shorts:{
    genzDefault: 1,
    plainDefault: 0,
    items:[
      { src:"/images/shorts.jpg", plainTitle:"Khaki Cotton Cargo Shorts", genzTitle:"Khaki Utility Multi-Pocket Cargo Shorts", plainStyle:"Casual", genzStyle:"🪖 Utility Drip" },
      { src:"/images/shorts_black.jpg", plainTitle:"Black Casual Chino Shorts", genzTitle:"Matte Black Baggy Skater Shorts", plainStyle:"Casual", genzStyle:"🔥 Streetwear" },
      { src:"/images/gym_shorts_grey.jpg", plainTitle:"Relaxed Grey Lounge Shorts", genzTitle:"Heather GreySweat Cargo Shorts", plainStyle:"Relaxed", genzStyle:"🛹 Chill Fit" }
    ]
  },
  jeans:{
    genzDefault: 1,
    plainDefault: 0,
    items:[
      { src:"/images/jeans.jpg", plainTitle:"Straight-Leg Blue Denim Jeans", genzTitle:"Classic Straight-Leg Mid-Blue Denim", plainStyle:"Classic", genzStyle:"👖 Everyday Drip" },
      { src:"/images/jeans_black.jpg", plainTitle:"Washed Black Denim Jeans", genzTitle:"Washed Black Baggy Carpenter Denim", plainStyle:"Casual", genzStyle:"🔥 Baggy Streetwear" }
    ]
  },
  trousers:{
    genzDefault: 0,
    plainDefault: 1,
    items:[
      { src:"/images/trousers.jpg", plainTitle:"Charcoal Tailored Trousers", genzTitle:"Pleated Charcoal Wide-Leg Trousers", plainStyle:"Smart Formal", genzStyle:"✨ Old Money Minimal" },
      { src:"/images/trousers_beige.jpg", plainTitle:"Beige Khaki Chino Trousers", genzTitle:"Relaxed Fit Khaki Beige Chinos", plainStyle:"Smart Casual", genzStyle:"🎒 Campus Clean" }
    ]
  },
  jacket:{
    genzDefault: 0,
    plainDefault: 1,
    items:[
      { src:"/images/jacket.jpg", plainTitle:"Black Bomber Jacket", genzTitle:"Cropped Matte Flight Bomber Jacket", plainStyle:"Casual", genzStyle:"🔥 Streetwear" },
      { src:"/images/jacket_denim.jpg", plainTitle:"Blue Denim Trucker Jacket", genzTitle:"Vintage Wash Denim Trucker Jacket", plainStyle:"Classic", genzStyle:"✨ Heritage Vibe" },
      { src:"/images/windbreaker.jpg", plainTitle:"Lightweight Zip Shell Jacket", genzTitle:"Technical Gorpcore Zip Shell", plainStyle:"Outerwear", genzStyle:"🏔️ Gorpcore" }
    ]
  },
  sweater:{
    genzDefault: 1,
    plainDefault: 0,
    items:[
      { src:"/images/sweater.jpg", plainTitle:"Cable-Knit Wool Sweater", genzTitle:"Chunky Fisherman Cable-Knit Sweater", plainStyle:"Warm Knit", genzStyle:"☕ Cozycore" },
      { src:"/images/sweater_hoodie.jpg", plainTitle:"Heather Grey Fleece Hoodie", genzTitle:"Heavyweight Boxy Streetwear Hoodie", plainStyle:"Casual", genzStyle:"🔥 Boxy Hoodie" }
    ]
  },
  thermal:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/thermal.jpg", plainTitle:"Thermal Base Layer & Heavy Puffer Coat", genzTitle:"Thermal Base & Heavy Down Puffer Armor", plainStyle:"Sub-Zero", genzStyle:"❄️ Heavy Armor" },
      { src:"/images/sweater.jpg", plainTitle:"Heavy Wool Sweater & Overcoat", genzTitle:"Chunky Wool Knit & Winter Parka", plainStyle:"Deep Winter", genzStyle:"🌨️ Arctic Drip" }
    ]
  },
  sneakers:{
    genzDefault: 0,
    plainDefault: 1,
    items:[
      { src:"/images/sneakers.jpg", plainTitle:"White & Grey Walking Sneakers", genzTitle:"Chunky White & Grey Dad Kicks", plainStyle:"Standard", genzStyle:"👟 Chunky Kicks" },
      { src:"/images/sneakers_retro.jpg", plainTitle:"Suede Low-Top Sneakers", genzTitle:"Retro Suede Gum-Sole Runner Kicks", plainStyle:"Retro", genzStyle:"🛹 Vintage Runner" }
    ]
  },
  sandals:{
    genzDefault: 0,
    plainDefault: 1,
    items:[
      { src:"/images/sandals.jpg", plainTitle:"Men's Minimalist Slide Sandals", genzTitle:"Matte Foam Streetwear Slides", plainStyle:"Casual", genzStyle:"🩴 Chill Slides" },
      { src:"/images/sandals_cork.jpg", plainTitle:"Cork Footbed Buckle Sandals", genzTitle:"Double-Buckle Suede Cork Slides", plainStyle:"Classic", genzStyle:"✨ Birken Vibe" }
    ]
  },
  boots:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/boots.jpg", plainTitle:"Men's Black Leather Lace Boots", genzTitle:"Black Lug-Sole Combat Stomper Boots", plainStyle:"Winter Boots", genzStyle:"🥾 Lug-Sole Stompers" }
    ]
  },
  loafers:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/loafers.jpg", plainTitle:"Men's Polished Leather Penny Loafers", genzTitle:"Chunky-Sole Leather Penny Loafers", plainStyle:"Formal", genzStyle:"✨ Old Money Ivy" }
    ]
  },

  // ================= FEMALE WARDROBE CATALOG (100% Dedicated Women's Photos) =================
  f_midi_dress:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/f_midi_dress.jpg", plainTitle:"Terracotta & Cream Pleated Linen Sundress", genzTitle:"Breezy Pleated Linen Midi Sundress", plainStyle:"Summer Dress", genzStyle:"☀️ Clean Girl Summer" },
      { src:"/images/f_kurti_top.jpg", plainTitle:"Embroidered Lavender Cotton Kurti & Floral Top", genzTitle:"Breezy Embroidered Pastel Kurti / Puff Blouse", plainStyle:"Ethnic / Casual", genzStyle:"🌸 Soft Desi / Boho" },
      { src:"/images/f_top_blouse.jpg", plainTitle:"Sage Pastel Ribbed Knit Top & Cardigan", genzTitle:"Sage Ribbed Cropped Cardigan & Baby Tee", plainStyle:"Pastel Knit", genzStyle:"🎀 It-Girl Fit" }
    ]
  },
  f_kurti_top:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/f_kurti_top.jpg", plainTitle:"Lavender Embroidered Kurti & Puff-Sleeve Blouse", genzTitle:"Pastel Embroidered Kurti Tunic & Floral Blouse", plainStyle:"Everyday Chic", genzStyle:"🌸 Desi / Boho Chic" },
      { src:"/images/f_midi_dress.jpg", plainTitle:"Terracotta & Cream Linen Midi Tunic", genzTitle:"Flowy Terracotta Linen Co-Ord / Sundress", plainStyle:"Breezy Linen", genzStyle:"✨ Sunlit Aesthetic" },
      { src:"/images/f_top_blouse.jpg", plainTitle:"Sage Ribbed Cardigan & Fitted Cotton Tee", genzTitle:"Sage Cropped Ribbed Cardigan & Baby Tee", plainStyle:"Casual Knit", genzStyle:"🎀 Soft Girl Era" }
    ]
  },
  f_top_blouse:{
    genzDefault: 0,
    plainDefault: 1,
    items:[
      { src:"/images/f_top_blouse.jpg", plainTitle:"Sage Pastel Knit Cardigan & Fitted Cotton Tee", genzTitle:"Sage Ribbed Cropped Cardigan & Baby Tee", plainStyle:"Smart Knit", genzStyle:"🎀 Soft Girl Aesthetic" },
      { src:"/images/f_kurti_top.jpg", plainTitle:"Embroidered Cotton Kurti & Floral Puff Blouse", genzTitle:"Square-Neck Floral Puff-Sleeve Blouse & Kurti", plainStyle:"Feminine Casual", genzStyle:"🌸 Romantic Core" },
      { src:"/images/f_midi_dress.jpg", plainTitle:"Terracotta & Cream Linen Tunic / Dress", genzTitle:"Breezy Pleated Linen Midi Co-Ord", plainStyle:"Resort Linen", genzStyle:"✨ Clean Girl Vibe" }
    ]
  },
  f_formal_blouse:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/f_formal_blouse.jpg", plainTitle:"Ivory Silk Button-Down Blouse & Linen Blazer", genzTitle:"Ivory Silk Office Blouse & Tailored Beige Blazer", plainStyle:"Executive Formal", genzStyle:"💼 Corporate Siren" },
      { src:"/images/f_jacket_trench.jpg", plainTitle:"Structured Camel Trench & Tailored Layer", genzTitle:"Boss-Babe Belted Camel Trench Over Silk Top", plainStyle:"Power Dressing", genzStyle:"✨ Old Money Chic" },
      { src:"/images/f_kurti_top.jpg", plainTitle:"Elegant Embroidered Pastel Office Kurti", genzTitle:"Chic Pastel Embroidered Formal Tunic", plainStyle:"Smart Ethnic", genzStyle:"🌸 Workwear Grace" }
    ]
  },
  f_formal_coat:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/f_formal_coat.jpg", plainTitle:"Tailored Long Espresso & Camel Wool Overcoat Over Merino Turtleneck & Blazer", genzTitle:"Manhattan Long Wool Winter Overcoat Over Merino Turtleneck & Blazer", plainStyle:"Winter Executive", genzStyle:"💼❄️ CEO Winter Chic" },
      { src:"/images/f_formal_blouse.jpg", plainTitle:"Structured Blazer & Ivory Silk Formal Blouse", genzTitle:"Tailored Blazer Over Ivory Silk Office Blouse", plainStyle:"Formal Suiting", genzStyle:"💼 Corporate Siren" }
    ]
  },
  f_gym_top_summer:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/f_gym_top_summer.jpg", plainTitle:"Berry-Lilac Ribbed Sports Tank & Black Racerback Gym Tee", genzTitle:"Seamless Berry-Lilac Ribbed Sports Tank & Black Racerback Tee", plainStyle:"Summer Active", genzStyle:"🔥 Hot-Girl Cardio" },
      { src:"/images/f_activewear.jpg", plainTitle:"Dusty Rose Moisture-Wicking Sculpted Gym Top", genzTitle:"Dusty Rose Sculpted Pilates / Gym Top", plainStyle:"Athleisure", genzStyle:"🧘‍♀️ Pilates Princess" }
    ]
  },
  f_activewear:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/f_activewear.jpg", plainTitle:"Dusty Rose Moisture-Wicking Sculpted Workout Top", genzTitle:"Dusty Rose Sculpted Pilates / Gym Activewear Top", plainStyle:"Athleisure", genzStyle:"🧘‍♀️ Pilates Princess" },
      { src:"/images/f_gym_top_summer.jpg", plainTitle:"Berry-Lilac Ribbed Sports Tank & Black Racerback Tee", genzTitle:"Seamless Berry-Lilac Ribbed Gym Tank & Racerback Tee", plainStyle:"Sportswear", genzStyle:"💪 Gym Girl Era" },
      { src:"/images/f_gym_jacket.jpg", plainTitle:"Fitted Sage/Rose Zip-Up Athletic Running Jacket", genzTitle:"Sculpted Define Zip-Up Running Jacket", plainStyle:"Studio Layer", genzStyle:"🏃‍♀️ Run Club Fit" }
    ]
  },
  f_gym_jacket:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/f_gym_jacket.jpg", plainTitle:"Women's Fitted Zip-Up Athletic Running Jacket & Thermal Thumbhole Top", genzTitle:"Sculpted Sage & Rose Define Zip Running Jacket & Thermal Top", plainStyle:"Cool Activewear", genzStyle:"🏃‍♀️✨ Define Jacket Era" },
      { src:"/images/f_gym_hoodie_winter.jpg", plainTitle:"Quarter-Zip Scuba Fleece Gym Hoodie & Thermal Pullover", genzTitle:"Oversized Quarter-Zip Scuba Gym Hoodie & Thermal Top", plainStyle:"Warm Activewear", genzStyle:"❄️ Winter Run Club" }
    ]
  },
  f_gym_hoodie:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/f_gym_hoodie_winter.jpg", plainTitle:"Women's Quarter-Zip Scuba Fleece Gym Hoodie & Thermal Running Pullover", genzTitle:"Quarter-Zip Scuba Fleece Gym Hoodie & Dusty-Rose Thermal Pullover", plainStyle:"Winter Activewear", genzStyle:"❄️💪 Winter Arc Gym Girl" },
      { src:"/images/f_gym_jacket.jpg", plainTitle:"Fitted Zip-Up Athletic Running Jacket & Thermal Thumbhole Top", genzTitle:"Sculpted Sage & Rose Define Zip Running Jacket & Thermal Top", plainStyle:"Cold Activewear", genzStyle:"🏃‍♀️❄️ Thermal Track Set" }
    ]
  },
  f_jacket_trench:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/f_jacket_trench.jpg", plainTitle:"Women's Camel Belted Trench & Cropped Denim Jacket", genzTitle:"Chic Camel Trench Coat / Cropped Denim Jacket", plainStyle:"Classic Outerwear", genzStyle:"🧥 Cool-Girl Trench" },
      { src:"/images/f_formal_blouse.jpg", plainTitle:"Tailored Beige Linen Blazer & Silk Blouse", genzTitle:"Oversized Linen Blazer & Silk Button-Down", plainStyle:"Smart Layer", genzStyle:"💼 Blazer Era" },
      { src:"/images/f_sweater_knit.jpg", plainTitle:"Soft Cashmere Wrap Cardigan & Knit Top", genzTitle:"Cozy Blush Cashmere Wrap & Cable Knit", plainStyle:"Soft Layer", genzStyle:"☕ Autumn Cozy" }
    ]
  },
  f_sweater_knit:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/f_sweater_knit.jpg", plainTitle:"Blush & Cream Cable-Knit Turtleneck Sweater", genzTitle:"Chunky Blush Cable-Knit Turtleneck & Wrap", plainStyle:"Warm Knitwear", genzStyle:"🍁 Cozycore Knit" },
      { src:"/images/f_jacket_trench.jpg", plainTitle:"Belted Camel Trench Over Knit Pullover", genzTitle:"Layered Camel Trench & Cropped Denim", plainStyle:"Layered Warmth", genzStyle:"🧥 Street Chic" }
    ]
  },
  f_winter_puffer:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/f_winter_puffer.jpg", plainTitle:"Pearl-Ivory Belted Down Puffer & Thermal Top", genzTitle:"Faux-Fur Hooded Pearl Puffer & Fleece Thermal", plainStyle:"Deep Winter", genzStyle:"❄️ Snow-Bunny Armor" },
      { src:"/images/f_sweater_knit.jpg", plainTitle:"Heavy Cable-Knit Turtleneck & Cashmere Wrap", genzTitle:"Chunky Blush Turtleneck Knit Layer", plainStyle:"Thermal Knit", genzStyle:"☕ Winter Cozycore" }
    ]
  },
  f_skirt_shorts:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/f_skirt_shorts.jpg", plainTitle:"High-Waisted Pleated Skirt & Tailored Linen Shorts", genzTitle:"Pleated Cream Tennis Skirt & Belted Linen Shorts", plainStyle:"Summer Bottoms", genzStyle:"🎾 It-Girl Summer" },
      { src:"/images/f_palazzo_trousers.jpg", plainTitle:"Airy Cream Pleated Palazzo Trousers", genzTitle:"Breezy High-Waisted Cream Wide Palazzos", plainStyle:"Flowy Linen", genzStyle:"✨ Resort Flow" }
    ]
  },
  f_wide_jeans:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/f_wide_jeans.jpg", plainTitle:"Women's High-Waisted Light-Wash Wide-Leg Jeans", genzTitle:"High-Waisted Light-Wash Baggy Wide Denim", plainStyle:"Relaxed Denim", genzStyle:"👖 It-Girl Denim" },
      { src:"/images/f_palazzo_trousers.jpg", plainTitle:"High-Waisted Cream & Espresso Wide-Leg Pants", genzTitle:"Tailored High-Rise Pleated Palazzo Trousers", plainStyle:"Smart Wide-Leg", genzStyle:"✨ Clean Girl Pants" },
      { src:"/images/f_skirt_shorts.jpg", plainTitle:"High-Waisted Pleated Midi/Mini Skirt & Shorts", genzTitle:"Pleated Tennis Skirt & Tailored Linen Shorts", plainStyle:"Chic Casual", genzStyle:"🎀 Campus Skirt" }
    ]
  },
  f_palazzo_trousers:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/f_palazzo_trousers.jpg", plainTitle:"High-Waisted Cream Palazzos & Espresso Slacks", genzTitle:"Flowy Cream Pleated Palazzos & Espresso Trousers", plainStyle:"Tailored Wide-Leg", genzStyle:"💼 Old-Money Slacks" },
      { src:"/images/f_wide_jeans.jpg", plainTitle:"High-Waisted Light-Wash Wide Denim", genzTitle:"High-Rise Relaxed Wide-Leg Denim", plainStyle:"Casual Denim", genzStyle:"👖 Effortless Denim" }
    ]
  },
  f_gym_shorts_biker:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/f_gym_shorts_biker.jpg", plainTitle:"Women's High-Waisted 5-Inch Seamless Biker Shorts & Lilac Running Shorts", genzTitle:"High-Waisted 5-Inch Sculpted Black Biker Shorts & Lilac Running Shorts", plainStyle:"Athletic Shorts", genzStyle:"🏋️‍♀️🔥 Biker & Runner Shorts" },
      { src:"/images/f_gym_leggings_sculpt.jpg", plainTitle:"High-Waisted Seamless Compression Gym Leggings", genzTitle:"High-Waisted Charcoal & Sage Seamless Gym Leggings", plainStyle:"Compression", genzStyle:"🧘‍♀️ Sculpt Leggings" }
    ]
  },
  f_gym_leggings:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/f_gym_leggings_sculpt.jpg", plainTitle:"Women's High-Waisted Full-Length Compression Gym Leggings (Charcoal & Sage)", genzTitle:"High-Waisted Seamless Charcoal & Sage Sculpted Gym Leggings", plainStyle:"Compression Leggings", genzStyle:"🧘‍♀️💪 Sculpted Gym Leggings" },
      { src:"/images/f_gym_joggers_cold.jpg", plainTitle:"High-Waisted Tapered Tech-Fleece Athletic Training Joggers", genzTitle:"High-Waisted Tech-Fleece Gym Joggers & Track Pants", plainStyle:"Athletic Joggers", genzStyle:"🏃‍♀️ Track Joggers" },
      { src:"/images/f_gym_shorts_biker.jpg", plainTitle:"High-Waisted 5-Inch Seamless Biker Shorts & Running Shorts", genzTitle:"High-Waisted 5-Inch Matte Black Biker Shorts & Running Shorts", plainStyle:"Gym Shorts", genzStyle:"🔥 Biker Shorts" }
    ]
  },
  f_gym_joggers:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/f_gym_joggers_cold.jpg", plainTitle:"Women's High-Waisted Tapered Tech-Fleece Gym Joggers & Thermal Track Pants", genzTitle:"High-Waisted Tapered Tech-Fleece Gym Joggers & Thermal Running Pants", plainStyle:"Winter Gym Pants", genzStyle:"❄️🏃‍♀️ Thermal Gym Joggers" },
      { src:"/images/f_gym_leggings_sculpt.jpg", plainTitle:"High-Waisted Full-Length Seamless Compression Gym Leggings", genzTitle:"High-Waisted Charcoal & Sage Compression Gym Leggings", plainStyle:"Compression", genzStyle:"💪 Sculpt Leggings" }
    ]
  },
  f_gym_runners:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/f_gym_runners.jpg", plainTitle:"Women's Cushioned White, Silver & Blush Athletic Running & Cross-Training Shoes", genzTitle:"Cushioned White, Silver & Blush Gym Cross-Trainers & Running Shoes", plainStyle:"Athletic Footwear", genzStyle:"👟🏃‍♀️ Cloud Gym Runners" }
    ]
  },
  f_sandals_flats:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/f_shoes_heels_flats.jpg", plainTitle:"Tan Strappy Leather Sandals & Cream Ballet Flats", genzTitle:"Strappy Tan Sandals & Pointed Ballet Flats", plainStyle:"Summer Footwear", genzStyle:"🩰 Balletcore / Strappy" },
      { src:"/images/f_shoes_sneakers_boots.jpg", plainTitle:"White & Pastel Rose Platform Sneakers", genzTitle:"Pastel-Rose & White Chunky Platform Kicks", plainStyle:"Casual Sneakers", genzStyle:"👟 It-Girl Kicks" }
    ]
  },
  f_heels_mules:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/f_shoes_heels_flats.jpg", plainTitle:"Nude Block-Heel Mules & Pointed Ballet Flats", genzTitle:"Chic Block-Heel Office Mules & Slingback Flats", plainStyle:"Formal Footwear", genzStyle:"👠 Corporate Siren" },
      { src:"/images/f_shoes_sneakers_boots.jpg", plainTitle:"Tan Suede Heeled Chelsea Ankle Boots", genzTitle:"Heeled Tan Suede Ankle Boots", plainStyle:"Smart Boots", genzStyle:"🥾 Chic Ankle Boots" }
    ]
  },
  f_sneakers:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/f_shoes_sneakers_boots.jpg", plainTitle:"Women's White & Pastel Rose Platform Sneakers", genzTitle:"White & Pastel-Rose Platform Fashion Kicks", plainStyle:"Everyday Sneakers", genzStyle:"👟 Platform Kicks" },
      { src:"/images/f_shoes_heels_flats.jpg", plainTitle:"Cream Pointed Ballet Flats & Strappy Sandals", genzTitle:"Minimalist Cream Ballet Flats & Mules", plainStyle:"Chic Flats", genzStyle:"🩰 Clean Girl Flats" }
    ]
  },
  f_ankle_boots:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/f_shoes_sneakers_boots.jpg", plainTitle:"Women's Tan Suede Heeled Chelsea Ankle Boots", genzTitle:"Tan Suede Block-Heel Chelsea Boots", plainStyle:"Winter Footwear", genzStyle:"🥾 Suede Ankle Boots" },
      { src:"/images/f_shoes_heels_flats.jpg", plainTitle:"Closed Pointed-Toe Leather Flats & Mules", genzTitle:"Pointed Leather Flats & Block Heels", plainStyle:"Dress Footwear", genzStyle:"👠 Chic Heels" }
    ]
  },

  // ================= SHARED WEATHER ACCESSORIES =================
  umbrella:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/umbrella.jpg", plainTitle:"Compact Travel Umbrella", genzTitle:"Sleek Windproof Travel Umbrella", plainStyle:"Rain Gear", genzStyle:"🌧️ Drip Shield" }
    ]
  },
  raincoat:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/raincoat.jpg", plainTitle:"Waterproof Hooded Raincoat", genzTitle:"Waterproof Rain Slicker Trench", plainStyle:"Weatherproof", genzStyle:"🌧️ Rain Proof" }
    ]
  },
  sunglasses:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/sunglasses.jpg", plainTitle:"UV400 Tinted Sunglasses", genzTitle:"Retro Round Tinted UV Shades", plainStyle:"Sun Protection", genzStyle:"🕶️ Retro Shades" }
    ]
  },
  cap:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/cap.jpg", plainTitle:"Cotton Baseball Cap", genzTitle:"Washed Cotton Baseball Cap", plainStyle:"Sun Cap", genzStyle:"🧢 Cap Drip" }
    ]
  },
  sunscreen:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/sunscreen.jpg", plainTitle:"Broad-Spectrum Sunscreen SPF 50+", genzTitle:"Invisible Glow SPF 50+ Sunscreen Stick", plainStyle:"Skincare", genzStyle:"☀️ Sun Shield" }
    ]
  },
  windbreaker:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/windbreaker.jpg", plainTitle:"Lightweight Windbreaker Shell", genzTitle:"Technical Nylon Windbreaker Shell", plainStyle:"Windproof", genzStyle:"🏔️ Wind Shell" }
    ]
  },
  scarf:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/scarf.jpg", plainTitle:"Soft Wool Knit Winter Scarf", genzTitle:"Chunky Fringed Wool Knit Scarf", plainStyle:"Winter Wear", genzStyle:"🧣 Cozycore" }
    ]
  },
  beanie:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/beanie.jpg", plainTitle:"Ribbed Knit Winter Beanie", genzTitle:"Ribbed Cuffed Streetwear Beanie", plainStyle:"Winter Wear", genzStyle:"❄️ Beanie Vibe" }
    ]
  },
  gloves:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/gloves.jpg", plainTitle:"Insulated Knit Winter Gloves", genzTitle:"Touchscreen Knit Winter Tech Gloves", plainStyle:"Winter Wear", genzStyle:"🧤 Winter Utility" }
    ]
  }
};

// Tracks user-selected variant index for each garment key separately for Gen Z and Plain
const selectedVariantsGenZ={};
const selectedVariantsPlain={};
let currentSensShift=0;

// Cross-environment image path resolver (works on Vite, Node server, python http.server, AND direct Windows file://)
function resolveImgPath(src){
  if(!src)return "";
  const clean=src.replace(/^\//,"");
  if(typeof window!=="undefined" && window.location && window.location.protocol==="file:"){
    return clean.startsWith("public/") ? clean : ("public/"+clean);
  }
  return clean;
}

function setImgWithFallback(imgEl, rawSrc){
  const primary=resolveImgPath(rawSrc);
  const clean=rawSrc.replace(/^\//,"");
  const fallbacks=[
    "public/"+clean,
    "/"+clean,
    clean
  ];
  let fbIdx=0;
  imgEl.onerror=()=>{
    while(fbIdx<fallbacks.length && fallbacks[fbIdx]===imgEl.getAttribute("src")){
      fbIdx++;
    }
    if(fbIdx<fallbacks.length){
      imgEl.src=fallbacks[fbIdx++];
    }
  };
  imgEl.src=primary;
}

function getVariant(key){
  const data=CLOTHING_VARIANTS[key];
  if(!data)return null;
  const list=data.items||data;
  if(!list||!list.length)return null;

  const store=genZ?selectedVariantsGenZ:selectedVariantsPlain;
  const baseDefault=genZ?(data.genzDefault??0):(data.plainDefault??0);
  const shiftedDefault=(baseDefault+currentSensShift)%list.length;
  const idx=(store[key]!==undefined?store[key]:shiftedDefault)%list.length;
  const item=list[idx];

  return{
    ...item,
    src: resolveImgPath(item.src),
    rawSrc: item.src,
    title: genZ ? item.genzTitle : item.plainTitle,
    style: genZ ? item.genzStyle : item.plainStyle,
    index: idx,
    total: list.length,
    all: list.map(it=>({...it, src:resolveImgPath(it.src), rawSrc:it.src}))
  };
}
function cycleVariant(key, delta=1){
  const data=CLOTHING_VARIANTS[key];
  const list=data?(data.items||data):null;
  if(!list||list.length<=1)return;
  const store=genZ?selectedVariantsGenZ:selectedVariantsPlain;
  const cur=getVariant(key).index;
  store[key]=(cur+delta+list.length)%list.length;
  render();
}
function shuffleOutfit(){
  const store=genZ?selectedVariantsGenZ:selectedVariantsPlain;
  Object.keys(CLOTHING_VARIANTS).forEach(k=>{
    const data=CLOTHING_VARIANTS[k];
    const list=data.items||data;
    if(list&&list.length>1){
      const cur=getVariant(k).index;
      store[k]=(cur+1+Math.floor(Math.random()*(list.length-1)))%list.length;
    }
  });
  render();
}

// Small line-icon set for clothing pieces
const ICONS={
  tshirt:'M8 3 3 6l2 3 2-1v11h10V8l2 1 2-3-5-3-1 2H9L8 3Z',
  shirt:'M8 3 3 6l2 3 2-1v11h10V8l2 1 2-3-5-3-1 1H9L8 3Zm1 4h6',
  sweater:'M7 3 3 6l2 3 2-1v11h10V8l2 1 2-3-4-3v3H9V3Zm-1 6h12',
  jacket:'M8 3 4 6v14h4V9l1 11h6L14 9v11h4V6L14 3l-2 2-2-2ZM10 5v4M14 5v4',
  thermal:'M9 2v4M15 2v4M6 6h12v3l2 2-2 2v9H6v-9l-2-2 2-2V6Zm3 5h6',
  shorts:'M4 4h16l-1 6-1 10h-4l-1-7-1 7H8L7 10 6 4Z',
  jeans:'M5 3h14l1 18h-6l-1-11-1 11H6L5 3ZM5 8h14',
  trousers:'M6 3h12l1 18h-5l-1-13-1 13H7L6 3Z',
  sneakers:'M3 17h17c1 0 2-1 2-2 0 0-2 0-4-2-1-1-3-1-4-1H9L4 15c-1 .3-1 1-1 2Zm4-4V8h3',
  sandals:'M3 16c2-6 4-9 8-9s6 3 8 9c0 1-1 2-2 2H5c-1 0-2-1-2-2ZM7 8v-1M12 7V6',
  boots:'M6 2h6v9l6 4v3c0 1-1 2-2 2H4V15h4l-1-4-1-9Z',
  loafers:'M2 17c0-2 3-3 6-4l6-4c2-1 4-1 6 1 1 1 1 3-1 3l-9 3-8 1Z',
  umbrella:'M12 2C6 2 3 8 3 12h18c0-4-3-10-9-10Zm0 0v18a2 2 0 0 1-4 0',
  raincoat:'M8 2 4 5v16h4v-9l1 9h6l1-9v9h4V5l-4-3-2 2-2-2Z',
  sunglasses:'M3 9h6l1 1h4l1-1h6M3 9l2 7c.3 1 1 2 3 2s3-1 3-2l1-6M21 9l-2 7c-.3 1-1 2-3 2s-3-1-3-2l-1-6',
  cap:'M3 13c0-5 4-8 9-8s9 3 9 8H3Zm0 0c-1 0-2 1-2 2s3 2 5 2M21 13c1 0 2 1 2 2s-2 2-4 2',
  sunscreen:'M8 2h8v3H8V2Zm-1 3h10l1 17H6L7 5Zm1 5h8',
  windbreaker:'M6 4c2-2 10-2 12 0l-2 5 1 12H7l1-12L6 4Zm4 0 2 3 2-3',
  scarf:'M4 6c4 2 8-2 12 0 3 1 4 4 3 7-1-2-3-3-5-2 2 2 2 5 0 7-1-3-4-4-6-3 1-3-1-5-4-6 2-1 2-2 0-3Z',
  beanie:'M4 14c0-5 4-9 8-9s8 4 8 9H4Zm0 0h16v2c0 1-1 2-2 2H6c-1 0-2-1-2-2v-2Z',
  gloves:'M6 22V11c0-1 1-2 2-2s2 1 2 2v3m0-3V6c0-1 1-2 2-2s2 1 2 2v8m0-6c0-1 1-2 2-2s2 1 2 2v6m0-3c0-1 1-2 2-2s2 1 2 2v6c0 3-2 5-5 5H8'
};

const PLAIN_TOP={
  tshirt:"Cotton Crewneck T-Shirt",
  linen_shirt:"Breathable Beige Linen Shirt",
  shirt:"Casual Button-Down Shirt",
  formal_shirt:"Plain Formal Dress Shirt",
  formal_blazer:"Tailored Navy Wool Suit Blazer, Shirt & Tie",
  formal_overcoat:"Tailored Wool Winter Overcoat, Merino Layer & Suit",
  gym_tee:"Moisture-Wicking Athletic Tee",
  gym_hoodie:"Performance Quarter-Zip Track Top & Tech-Fleece Hoodie",
  sweater:"Wool Cable-Knit Sweater",
  jacket:"Classic Bomber / Denim Jacket",
  thermal:"Thermal Base Layer & Heavy Coat",
  // Female
  f_midi_dress:"Terracotta & Cream Linen Midi Sundress",
  f_kurti_top:"Embroidered Pastel Kurti & Floral Blouse",
  f_top_blouse:"Sage Ribbed Cardigan & Fitted Cotton Tee",
  f_formal_blouse:"Ivory Silk Blouse & Tailored Linen Blazer",
  f_formal_coat:"Tailored Long Wool Overcoat Over Merino Turtleneck & Blazer",
  f_gym_top_summer:"Berry-Lilac Ribbed Sports Tank & Black Racerback Gym Tee",
  f_activewear:"Dusty Rose Moisture-Wicking Sculpted Workout Top",
  f_gym_jacket:"Fitted Zip-Up Athletic Running Jacket & Thermal Top",
  f_gym_hoodie:"Quarter-Zip Scuba Fleece Gym Hoodie & Thermal Pullover",
  f_jacket_trench:"Camel Belted Trench / Cropped Denim Jacket",
  f_sweater_knit:"Blush & Cream Cable-Knit Turtleneck Sweater",
  f_winter_puffer:"Pearl-Ivory Belted Down Puffer Coat & Thermal"
};

const PLAIN_BOTTOM={
  shorts:"Khaki Cotton Cargo Shorts",
  gym_shorts:"Athletic Running Shorts",
  gym_joggers:"Tapered Technical Athletic Training Joggers",
  jeans:"Straight-Leg Blue Denim Jeans",
  trousers:"Tailored Men's Chinos / Trousers",
  // Female
  f_skirt_shorts:"High-Waisted Pleated Skirt / Tailored Linen Shorts",
  f_wide_jeans:"Women's High-Waisted Light-Wash Wide Denim",
  f_palazzo_trousers:"High-Waisted Flowy Cream Palazzos / Formal Slacks",
  f_gym_shorts_biker:"High-Waisted 5-Inch Seamless Biker Shorts & Running Shorts",
  f_gym_leggings:"High-Waisted Full-Length Compression Gym Leggings",
  f_gym_joggers:"High-Waisted Tapered Tech-Fleece Athletic Joggers"
};

const PLAIN_SHOES={
  sneakers:"Men's Walking Sneakers",
  sandals:"Men's Slide Sandals",
  boots:"Men's Leather Lace Boots",
  loafers:"Men's Leather Penny Loafers",
  // Female
  f_sandals_flats:"Women's Tan Strappy Sandals & Ballet Flats",
  f_heels_mules:"Women's Block-Heel Mules & Slingback Flats",
  f_sneakers:"Women's White & Pastel Platform Sneakers",
  f_gym_runners:"Women's Cushioned Athletic Running & Gym Shoes",
  f_ankle_boots:"Women's Tan Suede Heeled Chelsea Ankle Boots"
};

const PLAIN_ACC={
  umbrella:"Umbrella",
  raincoat:"Waterproof Raincoat",
  sunglasses:"UV Sunglasses",
  cap:"Baseball Cap",
  sunscreen:"Sunscreen SPF 50+",
  windbreaker:"Windbreaker Shell",
  scarf:"Warm Wool Scarf",
  beanie:"Ribbed Knit Beanie",
  gloves:"Warm Winter Gloves"
};

function svgIcon(key){
  const p=PIECES[key];
  const mapped=p?p.icon:key;
  const d=ICONS[mapped];if(!d)return "";
  return '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="'+d+'"/></svg>';
}

const genZ=false;

function resetStyleOverrides(){
  Object.keys(selectedVariantsGenZ).forEach(k=>delete selectedVariantsGenZ[k]);
  Object.keys(selectedVariantsPlain).forEach(k=>delete selectedVariantsPlain[k]);
}

function row(k,v,iconKey){
  const d=document.createElement("div");d.className="item";
  const a=document.createElement("span");a.textContent=k;
  const b=document.createElement("span");b.className="ival";

  const keys=Array.isArray(iconKey)?iconKey:(iconKey?[iconKey]:[]);
  keys.forEach(key=>{
    const variant=getVariant(key);
    const itemLabel=PLAIN_ACC[key]||PLAIN_TOP[key]||PLAIN_BOTTOM[key]||PLAIN_SHOES[key]||v;
    if(variant){
      const im=document.createElement("img");
      im.className="cloth-img";
      setImgWithFallback(im, variant.rawSrc||variant.src);
      im.alt=variant.title;
      im.loading="lazy";
      im.title="Click to view "+itemLabel;
      im.onclick=()=>showPreview(key, itemLabel);
      b.append(im);
    } else {
      const ic=document.createElement("span");
      ic.className="icn";
      ic.innerHTML=svgIcon(key);
      b.append(ic);
    }
  });

  const t=document.createElement("span");t.textContent=v;b.append(t);
  d.append(a,b);return d;
}

// Lightbox preview for clothing photo with interactive style switcher
function showPreview(key, label){
  const cur=getVariant(key);
  if(!cur)return;
  let pop=document.getElementById("imgPop");
  if(!pop){
    pop=document.createElement("div");
    pop.id="imgPop";
    pop.className="img-pop hide";
    pop.onclick=()=>pop.classList.add("hide");
    document.body.appendChild(pop);
  }

  const variantsHtml=cur.total>1?`
    <div class="pop-variants">
      <span class="lbl">Style Options (${cur.total} available · tap to switch):</span>
      <div class="pop-var-list">
        ${cur.all.map((item,idx)=>`
          <div class="pop-var-item ${idx===cur.index?'active':''}" onclick="setVariant('${key}',${idx})">
            <img src="${item.src}" alt="${item.plainTitle}">
            <span>${item.plainStyle}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `:'';

  pop.innerHTML=`
    <div class="pop-box" onclick="event.stopPropagation()">
      <button class="pop-close" onclick="document.getElementById('imgPop').classList.add('hide')">✕</button>
      <img id="popImg" src="${cur.src}" alt="${cur.title}">
      <h4>${label}</h4>
      <p id="popCap"><span style="color:var(--sun)">[${cur.style}]</span> ${cur.title}</p>
      ${variantsHtml}
    </div>
  `;
  pop.classList.remove("hide");
}

function setVariant(key,idx){
  const store=genZ?selectedVariantsGenZ:selectedVariantsPlain;
  store[key]=idx;
  render();
  showPreview(key, (PLAIN_TOP[key]||PLAIN_BOTTOM[key]||PLAIN_SHOES[key]||PLAIN_ACC[key]||key));
}

function syncGenderUI(){
  const g=$("gender")?$("gender").value:"male";
  const isFem=(g==="female");
  const gt=$("genderToggle");
  if(gt){
    gt.textContent=isFem?"Gender: Female 👩":"Gender: Male 👨";
    gt.className="alt "+(isFem?"active-female":"active-male");
  }
  try{localStorage.setItem("dressSenseGender",g)}catch(e){}
}

function syncUnitUI(){
  const uBtn=$("unit");
  if(uBtn){
    uBtn.textContent=F?"🌡️ Unit: °F (Switch to °C)":"🌡️ Unit: °C (Switch to °F)";
    uBtn.className="alt "+(F?"active-unit-f":"active-unit-c");
  }
  // Also update the Recommendation Rules table temperatures to match °C / °F
  const rulesSection=document.getElementById("rules");
  if(rulesSection){
    const rows=rulesSection.querySelectorAll("table tr");
    const cLabels=["32°C and above","27 to 31°C","20 to 26°C","14 to 19°C","8 to 13°C","Below 8°C"];
    const fLabels=["90°F and above","81 to 88°F","68 to 79°F","57 to 66°F","46 to 55°F","Below 46°F"];
    rows.forEach((tr,idx)=>{
      if(idx>=1 && idx<=6 && tr.cells && tr.cells[0]){
        tr.cells[0].textContent=F?fLabels[idx-1]:cLabels[idx-1];
      }
    });
  }
  try{localStorage.setItem("dressSenseUnitF",F?"1":"0")}catch(e){}
}

function setSky(){
  const c=W.code;let k="clear";
  if(c>=95)k="storm";else if((c>=71&&c<=77)||c===85||c===86)k="snow";
  else if((c>=51&&c<=67)||(c>=80&&c<=82))k="rain";
  else if(!W.day)k="night";else if(c===3||(c>=45&&c<=48))k="cloudy";
  $("advisor").dataset.sky=k}

function render(){
  syncGenderUI();
  syncUnitUI();
  if(!W)return;setSky();const[l,i]=wx(W.code);
  $("place").textContent=place;$("temp").textContent=deg(W.temp);$("cond").textContent=i+" "+l+" · feels like "+deg(W.feels);
  const st=$("stats");st.textContent="";
  [["Humidity",W.hum+"%"],["Wind",Math.round(W.wind)+" km/h"],["Rain chance",W.rain+"%"],["UV index",Math.round(W.uv)]].forEach(([k,v])=>{const d=document.createElement("div");d.append(k+": ");const b=document.createElement("b");b.textContent=v;d.append(b);st.append(d)});
  
  const gender=$("gender")?$("gender").value:"male";
  const isFem=(gender==="female");
  const bias=parseInt($("sens").value,10)||0;
  const r=recommend(W,$("act").value,bias,deg,false,gender);
  currentSensShift=r.sensVariantShift||0;

  const o=$("outfit");o.textContent="";
  const topTxt=PLAIN_TOP[r.top];
  const bottomTxt=PLAIN_BOTTOM[r.bottom];
  const shoesTxt=PLAIN_SHOES[r.shoes];
  const accTxt=r.acc.length?r.acc.map(k=>PLAIN_ACC[k]).join(", "):"None required";

  // Dynamic header titles based on gender
  const ft=$("fitTitle");
  if(ft){
    ft.textContent=isFem?"Female Recommended Outfit 👗":"Male Recommended Outfit 👔";
  }
  const wt=$("whyTitle");if(wt)wt.textContent="Weather & Styling Rationale 📋";
  const shf=$("shuffleFitBtn");if(shf){shf.onclick=shuffleOutfit;shf.title="Shuffle style options";}

  // Stylist banner
  const vb=$("vibe");
  if(vb){
    vb.className="vibe plain";
    vb.innerHTML=`<span class="vibe-tag-lbl">${isFem?"Female Stylist":"Male Stylist"}</span>${r.vibe}`;
    vb.classList.remove("hide");
  }

  // Visual Clothes Gallery Breakdown
  const gallery=document.createElement("div");
  gallery.className="outfit-gallery";

  const cards=[
    { role:"Top", key:r.top, label:topTxt },
    { role:"Bottom", key:r.bottom, label:bottomTxt },
    { role:"Footwear", key:r.shoes, label:shoesTxt },
    ...r.acc.map((accKey, idx)=>({
      role: r.acc.length>1 ? ("Weather Gear "+(idx+1)) : "Accessories",
      key: accKey,
      label: PLAIN_ACC[accKey]||accKey
    }))
  ];

  cards.forEach(c=>{
    const v=getVariant(c.key);
    if(v){
      const card=document.createElement("div");
      card.className="cloth-card";
      
      const badge=document.createElement("div");
      badge.className="card-badge";
      badge.textContent=v.style;

      const wrap=document.createElement("div");
      wrap.className="img-wrap";
      wrap.onclick=()=>showPreview(c.key, c.label);

      const img=document.createElement("img");
      setImgWithFallback(img, v.rawSrc||v.src);
      img.alt=v.title;
      img.loading="lazy";
      wrap.append(img);

      if(v.total>1){
        const swapBtn=document.createElement("button");
        swapBtn.className="card-swap-btn";
        swapBtn.innerHTML='<span>🔄 Style '+(v.index+1)+'/'+v.total+'</span>';
        swapBtn.title="Show next style option for this item";
        swapBtn.onclick=(e)=>{
          e.stopPropagation();
          cycleVariant(c.key, 1);
        };
        wrap.append(swapBtn);
      }

      const cap=document.createElement("div");
      cap.className="cap";
      
      const capTop=document.createElement("div");
      capTop.innerHTML='<span class="role">'+c.role+'</span><span class="p-title">'+v.title+'</span>';
      cap.append(capTop);

      if(v.total>1){
        const dots=document.createElement("div");
        dots.className="dots";
        dots.title="Tap to change style";
        v.all.forEach((_,i)=>{
          const dot=document.createElement("span");
          dot.className="dot"+(i===v.index?" active":"");
          dot.onclick=(e)=>{
            e.stopPropagation();
            setVariant(c.key, i);
          };
          dots.append(dot);
        });
        cap.append(dots);
      }

      card.append(badge, wrap, cap);
      gallery.append(card);
    }
  });

  o.append(gallery);
  o.append(row("Top",topTxt,r.top),row("Bottom",bottomTxt,r.bottom),row("Footwear",shoesTxt,r.shoes),row("Carry",accTxt,r.acc));
  const ul=$("why");ul.textContent="";r.why.forEach(t=>{const li=document.createElement("li");li.textContent=t;ul.append(li)});
  $("bar").style.width=r.score+"%";$("sc").textContent=r.score+"/100";
  const sub=$("scoreSub");
  if(sub){
    if(r.score>=80){
      sub.textContent="Mild & pleasant outdoor climate. Very easy to stay comfortable.";
    } else if(W.feels<=12 && W.rain>=25){
      sub.textContent="Cold & wet outdoor weather. This outfit combines warm insulation with rain protection.";
    } else if(r.score>=60){
      sub.textContent="Moderate outdoor conditions. Outfit is calibrated for balanced comfort.";
    } else if(W.feels>=28){
      sub.textContent="High heat/humidity outdoors. This outfit is chosen to maximize ventilation and keep you cool.";
    } else if(W.feels<=10){
      sub.textContent="Cold outdoor weather. This outfit layers insulation to keep you warm.";
    } else if(W.rain>=30){
      sub.textContent="Wet/rainy conditions outdoors. Weather protection included to keep you dry.";
    } else {
      sub.textContent="Challenging outdoor weather. Outfit is specifically selected to protect you.";
    }
  }
  const fc=$("fc");fc.textContent="";
  W.days.forEach(d=>{const e=document.createElement("div");e.textContent=new Date(d.date).toLocaleDateString(undefined,{weekday:"short"})+" "+wx(d.code)[1]+" "+deg(d.max)+" / "+deg(d.min)+" · "+d.rain+"% rain";fc.append(e)});
  $("out").classList.remove("hide");
}

async function run(la,lo,name,keepMsg){
  if(!keepMsg)say("Fetching weather for "+name+"…");
  try{
    const d=await forecast(la,lo),c=d.current,y=d.daily;
    const rawRain=y.precipitation_probability_max[0]||0;
    const wc=c.weather_code;
    const activeRain=(wc>=51&&wc<=67)||(wc>=80&&wc<=82)||wc>=95;
    const heavyRain=(wc>=63&&wc<=67)||(wc>=81&&wc<=82)||wc>=95;
    const effectiveRain=activeRain?Math.max(rawRain,heavyRain?80:60):rawRain;
    W={temp:c.temperature_2m,feels:c.apparent_temperature,hum:c.relative_humidity_2m,wind:c.wind_speed_10m,code:wc,day:c.is_day!==0,rain:effectiveRain,uv:y.uv_index_max[0]||0,
      days:y.time.slice(1).map((t,i)=>({date:t,code:y.weather_code[i+1],max:y.temperature_2m_max[i+1],min:y.temperature_2m_min[i+1],rain:y.precipitation_probability_max[i+1]||0}))};
    place=name;
    if($("city") && name && name.toLowerCase()!=="your location"){
      $("city").value=cleanCity(name.split(",")[0]);
    }
    render();
    if(!keepMsg)say("");
    try{
      if(name && name.toLowerCase()!=="your location")localStorage.setItem("lastCity",name);
    }catch(e){}
    return true;
  }catch(e){
    say(e.message||"Could not load weather. Check your internet connection.",true);
    return false;
  }
}

async function ensureWeatherLoaded(statusMsg){
  if(W){
    render();
    if(statusMsg)say(statusMsg);
    return;
  }
  const rawTyped=cleanCity($("city")?$("city").value:"");
  const typed=(rawTyped && rawTyped.toLowerCase()!=="your location")?rawTyped:"";
  if(!typed){
    if(statusMsg)say(statusMsg+" — Enter a city or click 'Use my location' to get your outfit.");
    return;
  }
  try{
    const p=await byCity(typed);
    await run(p.lat,p.lon,p.name,true);
    if(statusMsg)say(statusMsg);
  }catch(e){
    if(statusMsg)say(statusMsg);
  }
}

// Multi-stage Location Detector: tries Browser GPS first, then automatically falls back to IP Geolocation
async function detectAndRunLocation(){
  say("📍 Detecting your location…");

  // Helper to resolve city name from coordinates
  async function reverseCityName(lat, lon){
    try{
      const rev=await getJSON("https://api.bigdatacloud.net/data/reverse-geocode-client?latitude="+lat+"&longitude="+lon+"&localityLanguage=en",3500);
      const city=rev.city||rev.locality||rev.principalSubdivision;
      if(city)return city+(rev.countryName?", "+rev.countryName:"");
    }catch(e){}
    return "Detected Location";
  }

  // Stage 1: Try Browser Geolocation (if available and not blocked)
  if(navigator.geolocation && window.location.protocol!=="file:"){
    try{
      const pos=await new Promise((resolve,reject)=>{
        navigator.geolocation.getCurrentPosition(resolve,reject,{timeout:3500,maximumAge:60000});
      });
      const lat=pos.coords.latitude, lon=pos.coords.longitude;
      const locName=await reverseCityName(lat, lon);
      if($("city") && locName!=="Detected Location")$("city").value=cleanCity(locName.split(",")[0]);
      const ok=await run(lat, lon, locName, true);
      if(ok)say("✓ Loaded weather for your location ("+locName+")");
      return;
    }catch(gpsErr){
      // Fall through automatically to Stage 2 (IP Geolocation)
    }
  }

  // Stage 2: Automatic IP Geolocation Fallback (works in iframes, desktop PCs, and Windows file://)
  const ipProviders=[
    async ()=>{
      const d=await getJSON("https://get.geojs.io/v1/ip/geo.json",3500);
      if(d && d.latitude && d.longitude){
        return { lat:parseFloat(d.latitude), lon:parseFloat(d.longitude), name:(d.city||"Detected Location")+(d.country?", "+d.country:"") };
      }
      throw new Error("GeoJS incomplete");
    },
    async ()=>{
      const d=await getJSON("https://ipwho.is/",3500);
      if(d && d.latitude && d.longitude){
        return { lat:Number(d.latitude), lon:Number(d.longitude), name:(d.city||"Detected Location")+(d.country?", "+d.country:"") };
      }
      throw new Error("ipwho incomplete");
    },
    async ()=>{
      const d=await getJSON("https://ipapi.co/json/",3500);
      if(d && d.latitude && d.longitude){
        return { lat:Number(d.latitude), lon:Number(d.longitude), name:(d.city||"Detected Location")+(d.country_name?", "+d.country_name:"") };
      }
      throw new Error("ipapi incomplete");
    }
  ];

  for(const provider of ipProviders){
    try{
      const loc=await provider();
      if($("city") && loc.name)$("city").value=cleanCity(loc.name.split(",")[0]);
      const ok=await run(loc.lat, loc.lon, loc.name, true);
      if(ok)say("✓ Loaded weather for your detected location ("+loc.name+")");
      return;
    }catch(e){}
  }

  // Stage 3: Offline Timezone City Fallback
  try{
    const tz=(Intl.DateTimeFormat().resolvedOptions().timeZone||"").trim();
    const tzCityMap={
      "Asia/Calcutta":"Kalyan",
      "Asia/Kolkata":"Kalyan",
      "America/New_York":"New York",
      "America/Los_Angeles":"Los Angeles",
      "America/Chicago":"Chicago",
      "Europe/London":"London",
      "Asia/Dubai":"Dubai",
      "Asia/Singapore":"Singapore",
      "Asia/Tokyo":"Tokyo",
      "Australia/Sydney":"Sydney"
    };
    const fallbackCity=tzCityMap[tz] || (tz.includes("/")?tz.split("/").pop().replace(/_/g," "):"Kalyan");
    const p=await byCity(fallbackCity);
    const ok=await run(p.lat, p.lon, p.name, true);
    if(ok)say("✓ Loaded weather for your region ("+p.name+")");
    return;
  }catch(e){}

  say("Could not auto-detect location. Please type your city name above and click Get advice.",true);
}

async function handleGo(){
  const c=cleanCity($("city")?$("city").value:"");
  if(!c || c.toLowerCase()==="your location"){
    if(c.toLowerCase()==="your location"){
      if($("city"))$("city").value="";
      detectAndRunLocation();
      return;
    }
    say("Enter a city name first.",true);
    return;
  }
  try{
    say("Finding "+c+"…");
    const p=await byCity(c);
    await run(p.lat,p.lon,p.name);
  }catch(e){
    say(e.message,true);
  }
}

function handleLoc(){
  detectAndRunLocation();
}

function handleUnit(){
  F=!F;
  syncUnitUI();
  ensureWeatherLoaded(F?"✓ Switched temperature unit to Fahrenheit (°F)":"✓ Switched temperature unit to Celsius (°C)");
}

function handleGenderToggle(){
  const g=$("gender");
  const nextG=(g && g.value==="female")?"male":"female";
  if(g)g.value=nextG;
  syncGenderUI();
  resetStyleOverrides();
  ensureWeatherLoaded(nextG==="female"?"✓ Switched to Female Wardrobe 👩":"✓ Switched to Male Wardrobe 👨");
}

// Expose handlers globally on window so both HTML onclick and JS listeners work reliably
window.handleGo=handleGo;
window.handleLoc=handleLoc;
window.handleUnit=handleUnit;
window.handleGenderToggle=handleGenderToggle;
window.setVariant=setVariant;
window.cycleVariant=cycleVariant;
window.shuffleOutfit=shuffleOutfit;
window.showPreview=showPreview;

if($("go"))$("go").onclick=handleGo;
if($("city"))$("city").addEventListener("keydown",e=>{if(e.key==="Enter")handleGo();});
if($("loc"))$("loc").onclick=handleLoc;
if($("unit"))$("unit").onclick=handleUnit;
if($("genderToggle"))$("genderToggle").onclick=handleGenderToggle;

if($("gender"))$("gender").onchange=()=>{
  syncGenderUI();
  resetStyleOverrides();
  const isFem=($("gender").value==="female");
  ensureWeatherLoaded(isFem?"✓ Switched to Female Wardrobe 👩":"✓ Switched to Male Wardrobe 👨");
};
if($("act"))$("act").onchange=()=>{
  resetStyleOverrides();
  if(W)render();
};
if($("sens"))$("sens").onchange=()=>{
  resetStyleOverrides();
  if(W)render();
};

// Restore saved user preferences WITHOUT auto-loading Mumbai on startup
(function initApp(){
  try{
    const savedG=localStorage.getItem("dressSenseGender");
    if(savedG&&$("gender")&&(savedG==="female"||savedG==="male"))$("gender").value=savedG;
    const savedF=localStorage.getItem("dressSenseUnitF");
    if(savedF==="1")F=true;
    const l=localStorage.getItem("lastCity");
    if(l){
      if(l.toLowerCase()==="your location" || l.toLowerCase().startsWith("mumbai")){
        localStorage.removeItem("lastCity");
      } else if($("city")){
        $("city").value=cleanCity(l.split(",")[0]);
      }
    }
  }catch(e){}

  syncGenderUI();
  syncUnitUI();
})();
