"use strict";
// Dress Sense - weather labels and the rule-based recommendation engine (no DOM access)
function wx(c){if(c===0)return["Clear sky","☀️"];if(c<=2)return["Partly cloudy","⛅"];if(c===3)return["Overcast","☁️"];if(c<=48)return["Fog","🌫️"];if(c<=57)return["Drizzle","🌦️"];if(c<=67)return["Rain","🌧️"];if(c<=77)return["Snow","❄️"];if(c<=82)return["Rain showers","🌧️"];if(c<=86)return["Snow showers","🌨️"];return["Thunderstorm","⛈️"]}

// Slang descriptions for Gen Z mode
const PIECES={
  tshirt:{icon:"tshirt",vibe:"oversized boxy tee"},
  shirt:{icon:"shirt",vibe:"casual button-down overshirt"},
  formal_shirt:{icon:"shirt",vibe:"crisp formal dress shirt"},
  gym_tee:{icon:"tshirt",vibe:"dry-fit athletic pump-cover tee"},
  gym_shorts:{icon:"shorts",vibe:"athletic training gym shorts"},
  sweater:{icon:"sweater",vibe:"chunky knit sweater"},
  jacket:{icon:"jacket",vibe:"cropped bomber jacket"},
  thermal:{icon:"thermal",vibe:"thermal base with puffer coat"},
  shorts:{icon:"shorts",vibe:"baggy skater cargo shorts"},
  jeans:{icon:"jeans",vibe:"baggy straight-leg denim"},
  trousers:{icon:"trousers",vibe:"pleated wide-leg trousers"},
  sneakers:{icon:"sneakers",vibe:"chunky dad kicks"},
  sandals:{icon:"sandals",vibe:"slide sandals"},
  boots:{icon:"boots",vibe:"lug-sole combat boots"},
  loafers:{icon:"loafers",vibe:"leather penny loafers"},
  umbrella:{icon:"umbrella",vibe:"compact umbrella"},
  raincoat:{icon:"raincoat",vibe:"waterproof rain slicker"},
  sunglasses:{icon:"sunglasses",vibe:"retro round sunglasses"},
  cap:{icon:"cap",vibe:"dad baseball cap"},
  sunscreen:{icon:"sunscreen",vibe:"SPF 50 sunscreen stick"},
  windbreaker:{icon:"windbreaker",vibe:"nylon technical windbreaker"},
  scarf:{icon:"scarf",vibe:"chunky knit scarf"},
  beanie:{icon:"beanie",vibe:"ribbed cuffed beanie"},
  gloves:{icon:"gloves",vibe:"touchscreen tech gloves"}
};

// Plain, standard descriptions for Plain mode
const PLAIN_NAMES={
  tshirt:"cotton t-shirt",
  shirt:"casual button-down shirt",
  formal_shirt:"plain formal dress shirt",
  gym_tee:"athletic training t-shirt",
  gym_shorts:"athletic workout shorts",
  sweater:"wool knit sweater",
  jacket:"lightweight jacket",
  thermal:"thermal base layer",
  shorts:"cotton shorts",
  jeans:"denim jeans",
  trousers:"tailored trousers",
  sneakers:"sneakers",
  sandals:"sandals",
  boots:"boots",
  loafers:"leather loafers",
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

function recommend(w,act,bias,fmt,isGenZ=true){
  const why=[],acc=[];let f=w.feels+bias;
  if(bias)why.push(isGenZ?("Adjusted by "+(bias>0?"+":"")+bias+"° (you feel "+(bias>0?"hot":"cold")+" easily)."):("Adjusted feels-like temperature by "+(bias>0?"+":"")+bias+"° based on your personal "+(bias>0?"warmth":"cold")+" sensitivity preference."));
  if(act==="workout"){
    f+=5;
    why.push(isGenZ?"High heart rate & body heat: calibrated lighter so you don't overheat mid-set.":"Physical activity elevates body heat: recommendation is calibrated lighter than outdoor ambient temperature.");
  }

  let top,bottom,shoes,vibe;

  // 1. Meteorological baseline
  if(f>=32){
    top="tshirt";bottom="shorts";shoes="sandals";
    vibe=isGenZ?"beat-the-heat drip 🔥 — breezy fits only, main character in the sun"
               :"Summer Heat Guidance ☀️ — Lightweight breathable cotton with airy shorts and open sandals for maximum ventilation.";
  } else if(f>=27){
    top="tshirt";bottom="trousers";shoes="sneakers";
    vibe=isGenZ?"clean girl / clean boy energy ☀️ — light, easy, effortless"
               :"Warm Weather Standard 🌤️ — Light cotton t-shirt paired with breathable trousers and comfortable walking sneakers.";
  } else if(f>=20){
    top="shirt";bottom="jeans";shoes="sneakers";
    vibe=isGenZ?"normcore comfy fit 🍂 — casual shirt plus light denim, always valid"
               :"Mild Weather Layering 🍂 — Casual collared button-down shirt paired with durable denim jeans and sneakers.";
  } else if(f>=14){
    top="jacket";bottom="jeans";shoes="sneakers";
    vibe=isGenZ?"soft layer szn 🧥 — bomber over tee, casual but clean"
               :"Cool Weather Layering 🧥 — Lightweight jacket worn over a base layer with durable denim jeans.";
  } else if(f>=8){
    top="sweater";bottom="trousers";shoes="boots";acc.push("scarf");
    vibe=isGenZ?"cozycore fit 🍁 — sweater weather, chunky knit and warm"
               :"Cold Weather Protection 🍁 — Insulated wool knit sweater with warm trousers and closed boots.";
  } else {
    top="thermal";bottom="trousers";shoes="boots";acc.push("beanie","gloves","scarf");
    vibe=isGenZ?"gorpcore winter armor ❄️ — stack every layer, stay toasty"
               :"Winter Weather Gear ❄️ — Multi-layer thermal base, heavy winter coat, warm trousers, and protective accessories.";
  }

  if(isGenZ){
    why.push("Feels-like temperature is "+fmt(w.feels)+": maps to a "+PIECES[top].vibe+" and "+PIECES[bottom].vibe+".");
  } else {
    why.push("Current feels-like temperature is "+fmt(w.feels)+": calls for a "+(PLAIN_NAMES[top]||"top")+" paired with "+(PLAIN_NAMES[bottom]||"bottom")+".");
  }

  // 2. Activity-Specific Intelligence & Dress Protocols
  if(act==="casual"){
    // College / Campus setting
    if(f>=27){
      if(isGenZ){
        top = "tshirt";
        bottom = "jeans";
        shoes = "sneakers";
        vibe = "campus fresh drip 🎒 — oversized boxy tee with baggy denim & chunky kicks";
        why.push("College Gen Z fit: oversized streetwear graphic tee with baggy denim and chunky kicks for peak campus style.");
      } else {
        top = "shirt";
        bottom = "trousers";
        shoes = "sneakers";
        vibe = "Campus Classic Attire 📚 — Crisp button-down shirt paired with tailored chinos and clean sneakers.";
        why.push("Campus classic uniform: breathable button-down shirt with tailored chinos and clean sneakers for lecture halls.");
      }
    } else if(f>=20){
      if(isGenZ){
        top = "shirt";
        bottom = "jeans";
        shoes = "sneakers";
        vibe = "effortless college aesthetic 📚 — plaid flannel overshirt over tee with baggy denim & kicks";
        why.push("College Gen Z fit: casual plaid overshirt layered with baggy streetwear denim and chunky kicks.");
      } else {
        top = "shirt";
        bottom = "jeans";
        shoes = "sneakers";
        vibe = "Campus Smart Casual 🎒 — Classic oxford cotton shirt paired with straight-leg denim and walking shoes.";
        why.push("Campus protocol: classic oxford button-down shirt with straight-leg denim jeans and supportive sneakers.");
      }
    } else if(f>=14){
      if(isGenZ){
        top = "jacket";
        bottom = "jeans";
        shoes = "sneakers";
        vibe = "campus layer szn 🧥 — cropped flight bomber over tee with baggy denim & kicks";
        why.push("College Gen Z fit: cropped bomber jacket with relaxed denim keeps the fit trendy and library-ready.");
      } else {
        top = "jacket";
        bottom = "trousers";
        shoes = "sneakers";
        vibe = "Campus Autumn Layering 🧥 — Classic denim trucker jacket with khaki chinos and clean sneakers.";
        why.push("Campus classic layering: denim jacket layered over a t-shirt with durable chinos for cool weather.");
      }
    } else {
      if(isGenZ){
        top = (f<=8) ? "thermal" : "sweater";
        bottom = "jeans";
        shoes = "boots";
        vibe = "winter campus drip ❄️ — heavyweight boxy hoodie with baggy denim and combat stompers";
        why.push("College Gen Z fit: boxy hoodie with durable baggy denim and lug-sole combat boots.");
      } else {
        top = (f<=8) ? "thermal" : "sweater";
        bottom = "trousers";
        shoes = "boots";
        vibe = "Campus Winter Classic ❄️ — Chunky cable-knit wool sweater with warm trousers and classic leather boots.";
        why.push("Campus winter protocol: warm wool knit sweater and tailored trousers ensure thermal insulation on campus commutes.");
      }
    }
  } else if(act==="travel"){
    // Travel / Commute setting
    if(f>=25){
      if(isGenZ){
        top = "tshirt";
        bottom = "jeans";
        shoes = "sneakers";
        vibe = "jetsetter airport drip ✈️ — oversized graphic tee with baggy denim & chunky kicks";
        why.push("Travel Gen Z fit: relaxed oversized tee with baggy jeans for effortless airport and terminal mobility.");
      } else {
        top = "shirt";
        bottom = "trousers";
        shoes = "sneakers";
        vibe = "Transit & Travel Comfort ✈️ — Breathable linen button-down shirt with comfortable chinos and walking shoes.";
        why.push("Travel classic protocol: breathable button-down shirt with comfortable chinos prevents getting chilled in cold airplane/train cabins.");
      }
    } else if(f>=18){
      if(isGenZ){
        top = "shirt";
        bottom = "trousers";
        shoes = "sneakers";
        vibe = "transit layer drip 🚆 — plaid overshirt with wide-leg trousers & retro runners";
        why.push("Travel Gen Z fit: casual plaid overshirt and wide-leg trousers keep you stylish on long flights or trains.");
      } else {
        top = "shirt";
        bottom = "jeans";
        shoes = "sneakers";
        vibe = "Transit Layering 🚆 — Casual oxford shirt with comfortable stretch denim and walking sneakers.";
        why.push("Travel classic protocol: button-down shirt allows easy temperature regulation between warm stations and cold transport.");
      }
    } else {
      if(isGenZ){
        top = "jacket";
        bottom = "jeans";
        shoes = "sneakers";
        vibe = "transit layer szn 🚆 — bomber jacket over tee with baggy denim for quick cabin adjustments";
        why.push("Travel Gen Z fit: bomber jacket is easy to slip on or off when cabin temperature drops.");
      } else {
        top = "jacket";
        bottom = "trousers";
        shoes = "sneakers";
        vibe = "Travel Layering Jacket 🚆 — Classic casual jacket worn over a t-shirt with tailored trousers.";
        why.push("Travel classic protocol: comfortable jacket layer provides versatile temperature regulation during transit.");
      }
    }
  } else if(act==="workout"){
    // Workout / Sports setting
    top = "gym_tee";
    bottom = "gym_shorts";
    shoes = "sneakers";
    if(isGenZ){
      vibe = "gym rat fit 💪 — oversized pump cover tee, athletic running shorts & chunky trainers";
      why.push("Workout Gen Z fit: dry-fit athletic training tee with athletic shorts for intense gym sessions.");
    } else {
      vibe = "Athletic Performance Wear 🏃 — Moisture-wicking athletic t-shirt and breathable training shorts.";
      why.push("Workout protocol: moisture-wicking synthetic fabric and flexible training shorts prevent sweat buildup and chafing.");
    }
  } else if(act==="office"){
    // Office / Formal setting
    top = "formal_shirt";
    bottom = "trousers";
    shoes = "loafers";
    if(isGenZ){
      vibe = "corporate hustle drip 💼 — sky blue oxford dress shirt, pleated wide trousers and penny loafers";
      why.push("Office Gen Z fit: sharp tailored dress shirt paired with wide-leg pleated trousers and penny loafers.");
    } else {
      vibe = "Professional Business Attire 💼 — Crisp plain white formal dress shirt, tailored trousers, and polished leather loafers.";
      why.push("Office formal protocol: classic pressed white dress shirt, tailored charcoal trousers, and polished leather loafers.");
    }
  }

  if(w.rain>=60){
    acc.push("umbrella","raincoat");
    vibe += isGenZ ? " + rain-proofed 🌧️" : " (Rain Protection Included)";
    why.push(isGenZ ? "Rain chance is "+w.rain+"%: full water defense added." : "Precipitation probability is "+w.rain+"%: waterproof raincoat and umbrella are strongly recommended.");
  } else if(w.rain>=30){
    acc.push("umbrella");
    why.push(isGenZ ? "Rain chance is "+w.rain+"%: pack an umbrella just in case." : "Precipitation probability is "+w.rain+"%: carrying a compact umbrella is advised.");
  }
  if(w.uv>=6){
    acc.push("sunglasses","cap","sunscreen");
    why.push(isGenZ ? "UV index peaks at "+Math.round(w.uv)+": sun shield mandatory (sunglasses, cap, SPF)." : "UV index reaches "+Math.round(w.uv)+": UV protection (SPF sunscreen, sunglasses, and cap) is necessary.");
  }
  if(w.wind>=30){
    acc.push("windbreaker");
    why.push(isGenZ ? "Wind is "+Math.round(w.wind)+" km/h: windbreaker prevents wind chill." : "Wind speed is "+Math.round(w.wind)+" km/h: windbreaker layer reduces convective heat loss.");
  }
  if(w.hum>=75&&f>=27){
    why.push(isGenZ ? "High humidity ("+w.hum+"%): stick to loose, breathable cotton or linen." : "High relative humidity ("+w.hum+"%): lightweight natural fabrics such as cotton or linen facilitate evaporative cooling.");
  }
  if(w.code>=95){
    why.push(isGenZ ? "Thunderstorm alert: stay indoors and off open grounds." : "Severe thunderstorm warning: minimize outdoor exposure during active lightning.");
  }

  let s=100-Math.abs(f-22)*3-(w.rain>=60?15:0)-(w.uv>=8?8:0)-(w.wind>=40?10:0);
  return{top,bottom,shoes,acc:[...new Set(acc)],why,vibe,score:Math.max(5,Math.min(100,Math.round(s)))};
}
