/* ==========================================================================
   VOCAL LOCAL — 3D-Styled Visual Product Assets (images.js)
   Copy and save this file as: images.js
   ========================================================================== */

function make3dProductCardSvg(emoji, title, subtitle, bgLight, bgDark, accent) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 260">
    <defs>
      <radialGradient id="bg_${title.replace(/[^a-zA-Z]/g, '')}" cx="50%" cy="38%" r="65%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="52%" stop-color="${bgLight}"/>
        <stop offset="100%" stop-color="${bgDark}"/>
      </radialGradient>
      <linearGradient id=" badge_${title.replace(/[^a-zA-Z]/g, '')}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0f172a"/>
        <stop offset="100%" stop-color="#1e1b4b"/>
      </linearGradient>
    </defs>
    <rect width="260" height="260" rx="30" fill="url(#bg_${title.replace(/[^a-zA-Z]/g, '')})"/>
    <circle cx="215" cy="42" r="28" fill="${accent}" opacity="0.18"/>
    <circle cx="42" cy="60" r="18" fill="#ffffff" opacity="0.45"/>
    <ellipse cx="130" cy="172" rx="68" ry="15" fill="#0f172a" opacity="0.22"/>
    <circle cx="130" cy="110" r="64" fill="#ffffff" opacity="0.94" stroke="${accent}" stroke-width="4"/>
    <text x="130" y="134" font-size="76" text-anchor="middle">${emoji}</text>
    <rect x="16" y="190" width="228" height="54" rx="16" fill="url(# badge_${title.replace(/[^a-zA-Z]/g, '')})"/>
    <text x="130" y="214" font-family="Inter, sans-serif" font-size="15" font-weight="900" fill="#fbbf24" text-anchor="middle">${title}</text>
    <text x="130" y="233" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="#e2e8f0" text-anchor="middle">${subtitle}</text>
  </svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

const ITEM_IMAGES = {
  terracotta: make3dProductCardSvg("🏺", "TERRACOTTA POT & DIYAS", "మట్టి కుండ • मिट्टी का मटका", "#ffedd5", "#ea580c", "#9a3412"),
  woodtoys: make3dProductCardSvg("🪆", "ETIKOPPAKA WOOD TOYS", "ఏటికొప్పాక బొమ్మలు • खिलौने", "#fef3c7", "#d97706", "#b45309"),
  bamboo: make3dProductCardSvg("🧺", "BAMBOO CANE BASKETS", "వెదురు బుట్టలు • बांस टोकरी", "#fef9c3", "#ca8a04", "#854d0e"),
  kalamkari: make3dProductCardSvg("🎨", "KALAMKARI HANDLOOM", "కలంకారీ వస్త్రం • कलमकारी", "#ede9fe", "#7c3aed", "#5b21b6"),
  brasslamp: make3dProductCardSvg("🪔", "BRASS PEACOCK DEEPAM", "ఇత్తడి దీపం • पीतल दीपक", "#fef08a", "#eab308", "#a16207"),
  jutebag: make3dProductCardSvg("👜", "EMBROIDERY JUTE BAG", "జూట్ చేతి సంచి • जूट बैग", "#fce7f3", "#db2777", "#9d174d"),
  woodcarving: make3dProductCardSvg("🐘", "CARVED WOOD ELEPHANT", "చెక్క ఏనుగు • नक्काशी हाथी", "#ffedd5", "#c2410c", "#7c2d12"),
  craftkit: make3dProductCardSvg("🧵", "SILK THREADS & BEADS", "పట్టు దారాలు • रेशम धागे", "#fae8ff", "#c026d3", "#86198f"),
  folkart: make3dProductCardSvg("🎭", "KONDAPALLI FOLK ART", "కొండపల్లి బొమ్మలు • लोक कला", "#e0e7ff", "#4f46e5", "#3730a3"),
  bangles: make3dProductCardSvg("📿", "LAC BANGLES & JHUMKAS", "లక్క గాజులు • लाख चूड़ियाँ", "#ffe4e6", "#e11d48", "#9f1239"),
  soap: make3dProductCardSvg("🧼", "NEEM TURMERIC SOAP", "వేప పసుపు సబ్బు • हर्बल साबुन", "#dcfce7", "#16a34a", "#166534"),
  honey: make3dProductCardSvg("🍯", "FOREST HONEY & INCENSE", "అడవి తేనె • शहद अगरबत्ती", "#fef3c7", "#f59e0b", "#b45309"),
  spices: make3dProductCardSvg("🌶️", "CHILLI, TURMERIC & SPICES", "మిర్చి & పసుపు • मसाले", "#fee2e2", "#dc2626", "#991b1b"),
  fruits: make3dProductCardSvg("🥭", "MANGO, APPLE & COCONUT", "మామిడి & పండ్లు • ताजे फल", "#fef9c3", "#65a30d", "#3f6212"),
  bakery: make3dProductCardSvg("🍞", "FRESH BREAD, BISCUITS & TEA", "బ్రెడ్ & టీ • ब्रेड और चाय", "#ffedd5", "#d97706", "#92400e"),
  tomato: make3dProductCardSvg("🍅", "FRESH RED TOMATOES", "ఎర్ర టమాటా • ताज़ा टमाटर", "#fee2e2", "#ef4444", "#b91c1c"),
  milk: make3dProductCardSvg("🥛", "FRESH FARM MILK", "తాజా పాలు • ताज़ा दूध", "#e0f2fe", "#0284c7", "#0369a1"),
  rice: make3dProductCardSvg("🌾", "SONA MASOORI RICE", "సోనా మసూరి బియ్యం • चावल", "#fef3c7", "#eab308", "#854d0e"),
  oil: make3dProductCardSvg("🌻", "SUNFLOWER COOKING OIL", "వంట నూనె • सूरजमुखी तेल", "#fef9c3", "#f59e0b", "#b45309"),
  onion: make3dProductCardSvg("🧅", "FRESH RED ONIONS", "ఉల్లిపాయలు • लाल प्याज", "#fce7f3", "#be185d", "#831843"),
  potato: make3dProductCardSvg("🥔", "FRESH GOLDEN POTATOES", "ఆలుగడ్డ • ताज़ा आलू", "#fef3c7", "#b45309", "#78350f"),
  banana: make3dProductCardSvg("🍌", "RIPE BANANAS & EGGS", "అరటిపండ్లు • केला और अंडे", "#fef08a", "#ca8a04", "#713f12"),
  egg: make3dProductCardSvg("🥚", "COUNTRY FARM EGGS", "కోడి గుడ్లు • देसी अंडे", "#ffedd5", "#ea580c", "#9a3412"),
  dal: make3dProductCardSvg("🥣", "TOOR DAL & JAGGERY", "కందిపప్పు • तूर दाल", "#fef3c7", "#d97706", "#92400e"),
  sugar: make3dProductCardSvg("🍬", "JAGGERY & CRYSTAL SUGAR", "బెల్లం & పంచదార • चीनी", "#e0f2fe", "#0284c7", "#075985")
};