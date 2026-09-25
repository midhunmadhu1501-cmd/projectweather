"use strict";
// Dress Sense - UI, API calls and rendering (uses engine.js)
const $=id=>document.getElementById(id);let F=false,W=null,place="";
const deg=c=>F?Math.round(c*9/5+32)+"°F":Math.round(c)+"°C";
const cleanCity=s=>s.replace(/[^\p{L}\p{N}\s,.'-]/gu,"").trim().slice(0,60);
function say(m,e){const s=$("status");s.textContent=m;s.className=e?"err":""}
async function getJSON(u){const r=await fetch(u);if(!r.ok)throw new Error("Network error "+r.status);return r.json()}
async function byCity(n){const d=await getJSON("https://geocoding-api.open-meteo.com/v1/search?count=1&name="+encodeURIComponent(n));if(!d.results||!d.results.length)throw new Error("City not found. Check the spelling and try again.");const p=d.results[0];return{lat:p.latitude,lon:p.longitude,name:p.name+(p.country?", "+p.country:"")}}
const forecast=(la,lo)=>getJSON("https://api.open-meteo.com/v1/forecast?latitude="+la+"&longitude="+lo+"&timezone=auto&forecast_days=6&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max");

// Clothing catalog with multiple authentic style variations per garment (supports Plain & Gen Z modes)
const CLOTHING_VARIANTS={
  tshirt:{
    genzDefault: 0,
    plainDefault: 2,
    items:[
      { src:"/images/tshirt.jpg", plainTitle:"Charcoal Graphic T-Shirt", genzTitle:"Vintage Washed Oversized Graphic Tee", plainStyle:"Casual", genzStyle:"🔥 Streetwear" },
      { src:"/images/shirt_flannel.jpg", plainTitle:"Plaid Button-Down Shirt", genzTitle:"Casual Plaid Button-Down Overshirt", plainStyle:"Casual", genzStyle:"🎒 Campus Casual" },
      { src:"/images/tshirt_white.jpg", plainTitle:"White Boxy Crewneck T-Shirt", genzTitle:"Boxy Drop-Shoulder Minimalist Tee", plainStyle:"Minimalist", genzStyle:"✨ Clean Minimal" },
      { src:"/images/shirt_oxford.jpg", plainTitle:"Oxford Cotton Collared Shirt", genzTitle:"Classic Oxford Button-Down Overshirt", plainStyle:"Smart Casual", genzStyle:"📚 Smart Aesthetic" },
      { src:"/images/tshirt_vintage.jpg", plainTitle:"Dark Grey Acid-Wash T-Shirt", genzTitle:"Retro Acid-Wash Graphic Pocket Tee", plainStyle:"Vintage", genzStyle:"🛹 Retro Vibe" }
    ]
  },
  shorts:{
    genzDefault: 1,
    plainDefault: 0,
    items:[
      { src:"/images/shorts.jpg", plainTitle:"Khaki Cargo Shorts", genzTitle:"Khaki Utility Multi-Pocket Cargo Shorts", plainStyle:"Casual", genzStyle:"🪖 Utility Drip" },
      { src:"/images/shorts_black.jpg", plainTitle:"Black Casual Shorts", genzTitle:"Matte Black Streetwear Cargo Shorts", plainStyle:"Casual", genzStyle:"🔥 Streetwear" }
    ]
  },
  jeans:{
    genzDefault: 1,
    plainDefault: 0,
    items:[
      { src:"/images/jeans.jpg", plainTitle:"Straight-Leg Blue Denim Jeans", genzTitle:"Classic Straight-Leg Mid-Blue Denim", plainStyle:"Classic", genzStyle:"👖 Everyday Drip" },
      { src:"/images/jeans_black.jpg", plainTitle:"Washed Black Denim Jeans", genzTitle:"Washed Black Baggy Relaxed Denim", plainStyle:"Casual", genzStyle:"🔥 Baggy Streetwear" }
    ]
  },
  trousers:{
    genzDefault: 0,
    plainDefault: 1,
    items:[
      { src:"/images/trousers.jpg", plainTitle:"Charcoal Pleated Trousers", genzTitle:"Tailored Pleated Charcoal Wide Trousers", plainStyle:"Smart Casual", genzStyle:"✨ Old Money Minimal" },
      { src:"/images/trousers_beige.jpg", plainTitle:"Beige Chino Trousers", genzTitle:"Relaxed Fit Khaki Beige Chinos", plainStyle:"Casual", genzStyle:"🎒 Campus Clean" }
    ]
  },
  sneakers:{
    genzDefault: 0,
    plainDefault: 1,
    items:[
      { src:"/images/sneakers.jpg", plainTitle:"White & Grey Sneakers", genzTitle:"Chunky White & Grey Dad Kicks", plainStyle:"Standard", genzStyle:"👟 Chunky Kicks" },
      { src:"/images/sneakers_retro.jpg", plainTitle:"Suede Low-Top Sneakers", genzTitle:"Retro Suede Runner Kicks (Gum Sole)", plainStyle:"Retro", genzStyle:"🛹 Vintage Runner" }
    ]
  },
  sandals:{
    genzDefault: 0,
    plainDefault: 1,
    items:[
      { src:"/images/sandals.jpg", plainTitle:"Slide Sandals", genzTitle:"Contemporary Minimalist Slide Sandals", plainStyle:"Casual", genzStyle:"🩴 Chill Slides" },
      { src:"/images/sandals_cork.jpg", plainTitle:"Cork Footbed Slide Sandals", genzTitle:"Double-Buckle Cork Slide Sandals", plainStyle:"Classic", genzStyle:"✨ Heritage Vibe" }
    ]
  },
  shirt:{
    genzDefault: 0,
    plainDefault: 2,
    items:[
      { src:"/images/shirt_flannel.jpg", plainTitle:"Plaid Button-Down Shirt", genzTitle:"Casual Plaid Button-Down Overshirt", plainStyle:"Casual", genzStyle:"🎒 Campus Plaid" },
      { src:"/images/tshirt.jpg", plainTitle:"Oversized Graphic T-Shirt", genzTitle:"Vintage Washed Oversized Graphic Tee", plainStyle:"Casual", genzStyle:"🔥 Streetwear" },
      { src:"/images/shirt_oxford.jpg", plainTitle:"Oxford Cotton Shirt", genzTitle:"Classic Oxford Cotton Button-Down Shirt", plainStyle:"Smart Casual", genzStyle:"✨ Smart Casual" },
      { src:"/images/tshirt_white.jpg", plainTitle:"Boxy White Cotton T-Shirt", genzTitle:"Boxy Drop-Shoulder Minimal Tee", plainStyle:"Minimalist", genzStyle:"✨ Clean Minimal" },
      { src:"/images/shirt_linen.jpg", plainTitle:"Beige Linen Shirt", genzTitle:"Breathable Camp-Collar Linen Shirt", plainStyle:"Breezy", genzStyle:"🌴 Vacation Drip" }
    ]
  },
  formal_shirt:{
    genzDefault: 1,
    plainDefault: 0,
    items:[
      { src:"/images/formal_shirt_white.jpg", plainTitle:"Plain White Formal Dress Shirt", genzTitle:"Crisp Plain White Formal Dress Shirt", plainStyle:"Formal", genzStyle:"💼 Corporate Hustle" },
      { src:"/images/formal_shirt_blue.jpg", plainTitle:"Plain Sky Blue Formal Dress Shirt", genzTitle:"Sky Blue Formal Oxford Dress Shirt", plainStyle:"Formal", genzStyle:"💼 Executive Clean" }
    ]
  },
  gym_tee:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/gym_tee.jpg", plainTitle:"Athletic Workout T-Shirt", genzTitle:"Moisture-Wicking Dry-Fit Pump Cover Tee", plainStyle:"Sportswear", genzStyle:"💪 Gym Rat Fit" }
    ]
  },
  gym_shorts:{
    genzDefault: 0,
    plainDefault: 1,
    items:[
      { src:"/images/gym_shorts.jpg", plainTitle:"Black Athletic Running Shorts", genzTitle:"Above-the-Knee Athletic Gym Shorts", plainStyle:"Sportswear", genzStyle:"💪 Gym Performance" },
      { src:"/images/gym_shorts_grey.jpg", plainTitle:"Grey Workout Shorts", genzTitle:"Heather Grey Training Workout Shorts", plainStyle:"Sportswear", genzStyle:"💪 Athletic Drip" }
    ]
  },
  jacket:{
    genzDefault: 0,
    plainDefault: 1,
    items:[
      { src:"/images/jacket.jpg", plainTitle:"Black Casual Jacket", genzTitle:"Cropped Flight Bomber Jacket", plainStyle:"Casual", genzStyle:"🔥 Streetwear" },
      { src:"/images/jacket_denim.jpg", plainTitle:"Blue Denim Jacket", genzTitle:"Classic Blue Denim Trucker Jacket", plainStyle:"Classic", genzStyle:"✨ Heritage Vibe" }
    ]
  },
  sweater:{
    genzDefault: 1,
    plainDefault: 0,
    items:[
      { src:"/images/sweater.jpg", plainTitle:"Cable-Knit Wool Sweater", genzTitle:"Chunky Cable-Knit Wool Sweater", plainStyle:"Warm Knit", genzStyle:"☕ Cozycore" },
      { src:"/images/sweater_hoodie.jpg", plainTitle:"Grey Fleece Hoodie", genzTitle:"Heavyweight Boxy Fleece Hoodie", plainStyle:"Casual", genzStyle:"🔥 Streetwear" }
    ]
  },
  boots:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/boots.jpg", plainTitle:"Black Leather Boots", genzTitle:"Black Lug-Sole Combat Boots", plainStyle:"Standard", genzStyle:"🥾 Lug-Sole Stompers" }
    ]
  },
  loafers:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/loafers.jpg", plainTitle:"Leather Penny Loafers", genzTitle:"Polished Leather Penny Loafers", plainStyle:"Formal", genzStyle:"✨ Old Money Ivy" }
    ]
  },
  umbrella:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/umbrella.jpg", plainTitle:"Compact Umbrella", genzTitle:"Sleek Black Travel Umbrella", plainStyle:"Utility", genzStyle:"🌧️ Drip Shield" }
    ]
  },
  raincoat:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/raincoat.jpg", plainTitle:"Waterproof Raincoat", genzTitle:"Waterproof Yellow Rain Slicker", plainStyle:"Weatherproof", genzStyle:"🌧️ Rain Proof" }
    ]
  },
  sunglasses:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/sunglasses.jpg", plainTitle:"Dark Tint Sunglasses", genzTitle:"Retro Round Tinted Sunglasses", plainStyle:"Accessory", genzStyle:"🕶️ Retro Shades" }
    ]
  },
  cap:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/cap.jpg", plainTitle:"Cotton Baseball Cap", genzTitle:"Washed Cotton Dad Baseball Cap", plainStyle:"Casual", genzStyle:"🧢 Dad Cap Drip" }
    ]
  },
  sunscreen:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/sunscreen.jpg", plainTitle:"Sunscreen SPF 50+", genzTitle:"Invisible SPF 50+ Sunscreen Stick", plainStyle:"Skincare", genzStyle:"☀️ Sun Shield" }
    ]
  },
  windbreaker:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/windbreaker.jpg", plainTitle:"Nylon Windbreaker Jacket", genzTitle:"Nylon Technical Windbreaker Shell", plainStyle:"Weatherproof", genzStyle:"🏔️ Gorpcore Shell" }
    ]
  },
  scarf:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/scarf.jpg", plainTitle:"Wool Knit Scarf", genzTitle:"Soft Wool Knit Long Scarf", plainStyle:"Winter Wear", genzStyle:"🧣 Cozycore" }
    ]
  },
  beanie:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/beanie.jpg", plainTitle:"Ribbed Knit Beanie", genzTitle:"Heather Grey Ribbed Cuffed Beanie", plainStyle:"Winter Wear", genzStyle:"❄️ Beanie Vibe" }
    ]
  },
  gloves:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/gloves.jpg", plainTitle:"Knit Winter Gloves", genzTitle:"Touchscreen Knit Winter Tech Gloves", plainStyle:"Winter Wear", genzStyle:"🧤 Winter Utility" }
    ]
  },
  thermal:{
    genzDefault: 0,
    plainDefault: 0,
    items:[
      { src:"/images/thermal.jpg", plainTitle:"Thermal Base Layer & Heavy Coat", genzTitle:"Thermal Base Layer & Puffer Down", plainStyle:"Sub-Zero", genzStyle:"❄️ Heavy Armor" }
    ]
  }
};

// Tracks user-selected variant index for each garment key separately for Gen Z and Plain
const selectedVariantsGenZ={};
const selectedVariantsPlain={};

function getVariant(key){
  const data=CLOTHING_VARIANTS[key];
  if(!data)return null;
  const list=data.items||data;
  if(!list||!list.length)return null;

  const store=genZ?selectedVariantsGenZ:selectedVariantsPlain;
  const defaultIdx=genZ?(data.genzDefault??0):(data.plainDefault??0);
  const idx=(store[key]!==undefined?store[key]:defaultIdx)%list.length;
  const item=list[idx];

  return{
    ...item,
    title: genZ ? item.genzTitle : item.plainTitle,
    style: genZ ? item.genzStyle : item.plainStyle,
    index: idx,
    total: list.length,
    all: list
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

// Small line-icon set for clothing pieces (drawn as plain SVG, no external images/fonts).
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
  tshirt:"Cotton T-Shirt",
  shirt:"Casual Button-Down Shirt",
  formal_shirt:"Plain Formal Dress Shirt",
  gym_tee:"Moisture-Wicking Athletic Tee",
  sweater:"Wool Knit Sweater",
  jacket:"Lightweight Jacket",
  thermal:"Thermal Base Layer & Heavy Coat"
};
const PLAIN_BOTTOM={
  shorts:"Cotton Shorts",
  gym_shorts:"Athletic Workout Shorts",
  jeans:"Straight-Leg Denim Jeans",
  trousers:"Tailored Trousers or Chinos"
};
const PLAIN_SHOES={
  sneakers:"Sneakers",
  sandals:"Slide Sandals",
  boots:"Closed Boots",
  loafers:"Leather Loafers"
};
const PLAIN_ACC={
  umbrella:"Umbrella",
  raincoat:"Raincoat",
  sunglasses:"Sunglasses",
  cap:"Baseball Cap",
  sunscreen:"Sunscreen SPF 30+",
  windbreaker:"Windbreaker",
  scarf:"Warm Scarf",
  beanie:"Knit Beanie",
  gloves:"Warm Gloves"
};

function svgIcon(key){
  const mapped=(key==="gym_tee"||key==="formal_shirt")?(key==="gym_tee"?"tshirt":"shirt"):(key==="gym_shorts"?"shorts":key);
  const d=ICONS[mapped];if(!d)return "";
  return '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="'+d+'"/></svg>';
}
// Slang label for a piece key, used only in Gen Z mode.
function pieceLabel(key,plain){ return genZ? (PIECES[key]?PIECES[key].vibe:plain) : plain; }
let genZ=true;

function row(k,v,iconKey){
  const d=document.createElement("div");d.className="item";
  const a=document.createElement("span");a.textContent=k;
  const b=document.createElement("span");b.className="ival";

  // Display example clothing image if available
  const variant=iconKey?getVariant(iconKey):null;
  if(variant){
    const im=document.createElement("img");
    im.className="cloth-img";
    im.src=variant.src;
    im.alt=variant.title;
    im.loading="lazy";
    im.title="Click to view style details & alternatives";
    im.onclick=()=>showPreview(iconKey, v);
    b.append(im);
  } else if(iconKey){
    const ic=document.createElement("span");
    ic.className="icn";
    ic.innerHTML=svgIcon(iconKey);
    b.append(ic);
  }

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
      <span class="lbl">${genZ?"Aesthetic Variations":"Style Options"} (${cur.total} available · tap to switch):</span>
      <div class="pop-var-list">
        ${cur.all.map((item,idx)=>`
          <div class="pop-var-item ${idx===cur.index?'active':''}" onclick="setVariant('${key}',${idx})">
            <img src="${item.src}" alt="${genZ?item.genzTitle:item.plainTitle}">
            <span>${genZ?item.genzStyle:item.plainStyle}</span>
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
  selectedVariants[key]=idx;
  render();
  showPreview(key, (genZ?PIECES[key].vibe:PLAIN_TOP[key]||PLAIN_BOTTOM[key]||PLAIN_SHOES[key]||PLAIN_ACC[key]||key));
}

function setSky(){
  const c=W.code;let k="clear";
  if(c>=95)k="storm";else if((c>=71&&c<=77)||c===85||c===86)k="snow";
  else if((c>=51&&c<=67)||(c>=80&&c<=82))k="rain";
  else if(!W.day)k="night";else if(c===3||(c>=45&&c<=48))k="cloudy";
  $("advisor").dataset.sky=k}

function render(){
  if(!W)return;setSky();const[l,i]=wx(W.code);
  $("place").textContent=place;$("temp").textContent=deg(W.temp);$("cond").textContent=i+" "+l+" · feels like "+deg(W.feels);
  const st=$("stats");st.textContent="";
  [["Humidity",W.hum+"%"],["Wind",Math.round(W.wind)+" km/h"],["Rain chance",W.rain+"%"],["UV index",Math.round(W.uv)]].forEach(([k,v])=>{const d=document.createElement("div");d.append(k+": ");const b=document.createElement("b");b.textContent=v;d.append(b);st.append(d)});
  
  const r=recommend(W,$("act").value,parseInt($("sens").value,10),deg,genZ);
  const o=$("outfit");o.textContent="";
  const topTxt=genZ?PIECES[r.top].vibe:PLAIN_TOP[r.top];
  const bottomTxt=genZ?PIECES[r.bottom].vibe:PLAIN_BOTTOM[r.bottom];
  const shoesTxt=genZ?PIECES[r.shoes].vibe:PLAIN_SHOES[r.shoes];
  const accTxt=r.acc.length?r.acc.map(k=>genZ?PIECES[k].vibe:PLAIN_ACC[k]).join(", "):(genZ?"nothing extra, you're set":"None required");

  // Dynamic header titles based on mode
  const ft=$("fitTitle");if(ft)ft.textContent=genZ?"Fit Check of the Day 🔥":"Recommended Outfit 👔";
  const wt=$("whyTitle");if(wt)wt.textContent=genZ?"Why this fit hits 💡":"Weather & Styling Rationale 📋";
  const shf=$("shuffleFitBtn");if(shf){shf.onclick=shuffleOutfit;shf.title=genZ?"Shuffle aesthetic variations":"Shuffle style options";}

  // Stylist / Vibe banner
  const vb=$("vibe");
  if(vb){
    vb.className="vibe "+(genZ?"genz":"plain");
    vb.innerHTML=genZ?`<span class="vibe-tag-lbl">Vibe Check</span>${r.vibe}`:`<span class="vibe-tag-lbl">Stylist Guidance</span>${r.vibe}`;
    vb.classList.remove("hide");
  }

  // Toggle button styling
  const vt=$("vibeToggle");
  if(vt){
    vt.textContent=genZ?"Vibe: Gen Z 😎":"Mode: Classic Plain 📝";
    vt.className="alt "+(genZ?"active-genz":"active-plain");
  }

  // Visual Clothes Gallery Breakdown (shows example images of all items in the outfit)
  const gallery=document.createElement("div");
  gallery.className="outfit-gallery";

  const cards=[
    { role:genZ?"Top Piece":"Top", key:r.top, label:topTxt },
    { role:genZ?"Bottoms":"Bottom", key:r.bottom, label:bottomTxt },
    { role:genZ?"Kicks":"Footwear", key:r.shoes, label:shoesTxt },
    ...(r.acc.length ? [{ role:genZ?"Accessories":"Accessories", key:r.acc[0], label:r.acc.map(k=>genZ?PIECES[k].vibe:PLAIN_ACC[k])[0] }] : [])
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
      img.src=v.src;
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
  o.append(row(genZ?"Top Piece":"Top",topTxt,r.top),row(genZ?"Bottoms":"Bottom",bottomTxt,r.bottom),row(genZ?"Kicks":"Footwear",shoesTxt,r.shoes),row(genZ?"Carry":"Carry",accTxt,r.acc[0]||null));
  const ul=$("why");ul.textContent="";r.why.forEach(t=>{const li=document.createElement("li");li.textContent=t;ul.append(li)});
  $("bar").style.width=r.score+"%";$("sc").textContent=r.score+"/100";
  const fc=$("fc");fc.textContent="";
  W.days.forEach(d=>{const e=document.createElement("div");e.textContent=new Date(d.date).toLocaleDateString(undefined,{weekday:"short"})+" "+wx(d.code)[1]+" "+deg(d.max)+" / "+deg(d.min)+" · "+d.rain+"% rain";fc.append(e)});
  $("out").classList.remove("hide");
}

async function run(la,lo,name){
  say("Fetching weather…");
  try{const d=await forecast(la,lo),c=d.current,y=d.daily;
    W={temp:c.temperature_2m,feels:c.apparent_temperature,hum:c.relative_humidity_2m,wind:c.wind_speed_10m,code:c.weather_code,day:c.is_day!==0,rain:y.precipitation_probability_max[0]||0,uv:y.uv_index_max[0]||0,
      days:y.time.slice(1).map((t,i)=>({date:t,code:y.weather_code[i+1],max:y.temperature_2m_max[i+1],min:y.temperature_2m_min[i+1],rain:y.precipitation_probability_max[i+1]||0}))};
    place=name;render();say("");try{localStorage.setItem("lastCity",name)}catch(e){}
  }catch(e){say(e.message||"Could not load weather. Check your internet connection.",true)}
}
$("go").onclick=async()=>{const c=cleanCity($("city").value);if(!c){say("Enter a city name first.",true);return}
  try{say("Finding "+c+"…");const p=await byCity(c);await run(p.lat,p.lon,p.name)}catch(e){say(e.message,true)}};
$("city").addEventListener("keydown",e=>{if(e.key==="Enter")$("go").click()});
$("loc").onclick=()=>{if(!navigator.geolocation){say("Location is not supported in this browser.",true);return}
  say("Waiting for location permission…");navigator.geolocation.getCurrentPosition(p=>run(p.coords.latitude,p.coords.longitude,"Your location"),()=>say("Location was blocked. Type a city name instead.",true),{timeout:10000})};
$("unit").onclick=()=>{F=!F;$("unit").textContent=F?"Switch to °C":"Switch to °F";render()};
$("vibeToggle").onclick=()=>{genZ=!genZ;render()};
$("act").onchange=$("sens").onchange=render;
try{const l=localStorage.getItem("lastCity");if(l)$("city").value=cleanCity(l.split(",")[0])}catch(e){}
