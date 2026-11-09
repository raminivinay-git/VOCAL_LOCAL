/* ==========================================================================
   VOCAL LOCAL — Main Application Logic (app.js)
   Copy and save this file as: app.js
   ========================================================================== */

// ITEM_IMAGES is loaded from images.js

    // 2. MULTILINGUAL VOICE & UI TEXT DICTIONARY
    const LANG_DATA = {
      te: {
        welcomeVoice: "వోకల్ లోకల్ యాప్ కి స్వాగతం! చిత్రాలను చూసి సులభంగా ఆర్డర్ చేయండి లేదా మైక్ నొక్కి మాట్లాడండి.",
        vendorVoiceHelp: "మీ దుకాణంలో ఉన్న వస్తువు పేరు మరియు ధర తెలుగులో చెప్పండి. ఉదాహరణకు: ఉల్లిపాయలు 35 రూపాయలు.",
        custVoiceHelp: "మీకు కావాల్సిన వస్తువుల పేర్లు చెప్పండి లేదా క్రింద ఉన్న చిత్రాలను నొక్కండి.",
        speechLang: "te-IN"
      },
      hi: {
        welcomeVoice: "वोकल लोकल ऐप में आपका स्वागत है! चित्र देखकर आसानी से ऑर्डर करें या माइक दबाकर बोलें।",
        vendorVoiceHelp: "अपनी दुकान के सामान का नाम और दाम हिंदी में बोलें। जैसे आलू 30 रुपये किलो।",
        custVoiceHelp: "सामान का नाम बोलें या नीचे दिए गए चित्रों को दबाएं।",
        speechLang: "hi-IN"
      },
      ta: {
        welcomeVoice: "வோக்கல் லோக்கல் செயலிக்கு வரவேற்கிறோம்! படங்களைப் பார்த்து எளிதாக ஆர்டர் செய்யுங்கள்.",
        vendorVoiceHelp: "உங்கள் கடையில் உள்ள பொருளின் பெயர் மற்றும் விலையை தமிழில் சொல்லுங்கள்.",
        custVoiceHelp: "தேவையான பொருட்களை குரல் மூலம் சொல்லுங்கள் அல்லது படத்தை அழுத்துங்கள்.",
        speechLang: "ta-IN"
      },
      en: {
        welcomeVoice: "Welcome to Vocal Local! Tap any picture or microphone button to shop, sell, or deliver easily.",
        vendorVoiceHelp: "Tap the microphone and speak your item name and price in your mother tongue. AI will add it and ask for confirmation.",
        custVoiceHelp: "Use the search bar or tap the microphone to order items by voice, then confirm with the green OK button.",
        speechLang: "en-IN"
      }
    };

    // 3. APPLICATION STATE
    let state = {
      currentRole: 'vendor', // 'vendor' | 'customer' | 'delivery'
      language: 'te',
      vendorIsDeliveryPartner: false,
      vendorPayoutCycle: 'Daily', // 'Daily' | 'Weekly' | 'Monthly'
      vendorPendingCod: 340,
      selectedVendorIcon: 'terracotta',
      activeCategory: 'all',
      pendingVendorItem: null,
      selectedPaymentMethod: 'COD', // 'COD' | 'ONLINE'

      // Separate Wallets for all 3 Roles
      wallets: {
        vendor: 2450,
        customer: 1500,
        delivery: 680
      },

      // Security Profile & Verified ID Cards for Delivery Partner (Trust with Vendor & Partner)
      deliveryPartnerProfile: {
        name: 'Raju Kumar (రాజు కుమార్)',
        phone: '+91 98480 22334',
        vehicle: 'Hero Electric Scooter (AP 31 EA 4022)',
        dlNumber: 'AP-31-2022-0048921',
        dlStatus: 'VERIFIED & ACTIVE (Valid till 2038)',
        dlType: 'Commercial Transport & Two-Wheeler (MCWG/LMV)',
        idType: 'Aadhaar Card (UIDAI Verified)',
        idNumber: 'XXXX-XXXX-6819',
        panNumber: 'BKPPR9412M',
        verificationBadge: 'Government Verified ✅',
        policeClearance: 'Passed (Clear Record)',
        vendorTrustScore: '99.4% (500+ Local Kirana Deliveries)'
      },

      // Live Map GPS Tracking State
      mapTracking: {
        active: false,
        driverProgress: 40, // 0 to 100%
        driverLat: 17.8185,
        driverLng: 83.3440,
        currentMilestone: 'On the Way with Groceries',
        etaMinutes: 12,
        speedKmH: 28,
        batteryPercent: 88,
        statusLabel: '🛵 Out for Delivery • Moving along Madhuravada Main Road',
        historyLocations: [
          { name: '1. Vendor Store (Sri Lakshmi Kirana)', time: '8:30 PM', done: true },
          { name: '2. Madhuravada Junction', time: '8:34 PM', done: true },
          { name: '3. Midhilapuri Colony Arch (Moving)', time: '8:38 PM', current: true },
          { name: '4. Customer Doorstep (House #42)', time: '8:44 PM (Est)', done: false }
        ]
      },

      // Generated Invoice State
      activeInvoice: null,

      // Store Catalog with Hyper-Realistic 3D-Animation Product Images (Artisans, Handcraft Materials & Groceries)
      items: [
        {
          id: 'item_woodtoys',
          key: 'woodtoys',
          category: 'artisan',
          badge: '🏺 Artisan Craft',
          name: 'Etikoppaka Wooden Lacquer Toys',
          regionalName: 'ఏటికొప్పాక చెక్క బొమ్మలు • लकड़ी के खिलौने • மர பொம்மைகள்',
          price: 250,
          unit: '1 Craft Set', quantity: 25, inStock: true,
          image: ITEM_IMAGES.woodtoys
        },
        {
          id: 'item_terracotta',
          key: 'terracotta',
          category: 'artisan',
          badge: '🏺 Clay Artisan',
          name: 'Terracotta Clay Matka & Painted Diyas',
          regionalName: 'మట్టి కుండ & దీపాలు • मिट्टी का मटका और दीये • மண் பானை',
          price: 180,
          unit: '1 Set', quantity: 25, inStock: true,
          image: ITEM_IMAGES.terracotta
        },
        {
          id: 'item_kalamkari',
          key: 'kalamkari',
          category: 'materials',
          badge: '🧵 Handcraft Material',
          name: 'Kalamkari Block-Print Fabric & Dye Blocks',
          regionalName: 'కలంకారీ చేనేత వస్త్రం • कलमकारी कपड़ा और ब्लॉक • கலம்காரி துணி',
          price: 420,
          unit: '2 Meters + Blocks', quantity: 25, inStock: true,
          image: ITEM_IMAGES.kalamkari
        },
        {
          id: 'item_craftkit',
          key: 'craftkit',
          category: 'materials',
          badge: '🧵 Handcraft Material',
          name: 'Silk Zari Threads, Mirrors & Beads Kit',
          regionalName: 'పట్టు దారాలు, అద్దాలు & పూసలు • रेशम धागे और मोती • பட்டு நூல்',
          price: 150,
          unit: '1 Full Box', quantity: 25, inStock: true,
          image: ITEM_IMAGES.craftkit
        },
        {
          id: 'item_bamboo',
          key: 'bamboo',
          category: 'materials',
          badge: '🧺 Cane & Bamboo',
          name: 'Handwoven Bamboo Baskets & Cane Strips',
          regionalName: 'వెదురు బుట్టలు & పేడు • बांस की टोकरी • மூங்கில் கூடை',
          price: 120,
          unit: 'Pair (2 Pcs)', quantity: 25, inStock: true,
          image: ITEM_IMAGES.bamboo
        },
        {
          id: 'item_brasslamp',
          key: 'brasslamp',
          category: 'artisan',
          badge: '🪔 Metal Artisan',
          name: 'Handcrafted Brass Peacock Deepam & Urli',
          regionalName: 'ఇత్తడి నెమలి దీపం • पीतल का दीपक • பித்தளை விளக்கு',
          price: 550,
          unit: '1 Piece', quantity: 25, inStock: true,
          image: ITEM_IMAGES.brasslamp
        },
        {
          id: 'item_jutebag',
          key: 'jutebag',
          category: 'artisan',
          badge: '👜 Jute Handcraft',
          name: 'Mirror-Embroidery Handmade Jute Tote Bag',
          regionalName: 'జూట్ చేతి సంచి • जूट कढ़ाई बैग • சணல் பை',
          price: 220,
          unit: '1 Bag', quantity: 25, inStock: true,
          image: ITEM_IMAGES.jutebag
        },
        {
          id: 'item_woodcarving',
          key: 'woodcarving',
          category: 'materials',
          badge: '🪵 Wood Craft Material',
          name: 'Carved Rosewood Elephant & Sandalwood Blocks',
          regionalName: 'చెక్క ఏనుగు & గంధపు చెక్క • नक्काशीदार हाथी • மர யானை',
          price: 380,
          unit: '1 Set', quantity: 25, inStock: true,
          image: ITEM_IMAGES.woodcarving
        },
        {
          id: 'item_folkart',
          key: 'folkart',
          category: 'artisan',
          badge: '🎨 Folk Art Craft',
          name: 'Kondapalli Dolls & Painted Ceramic Plates',
          regionalName: 'కొండపల్లి బొమ్మలు & ప్లేట్లు • लोक कला प्लेटें • கொண்டப்பள்ளி பொம்மை',
          price: 310,
          unit: '1 Art Set', quantity: 25, inStock: true,
          image: ITEM_IMAGES.folkart
        },
        {
          id: 'item_tomato',
          key: 'tomato',
          category: 'grocery',
          badge: '🍅 Farm Fresh',
          name: 'Fresh Red Tomatoes',
          regionalName: 'టమాటా • टमाटर • தக்காளி',
          price: 40,
          unit: '1 kg', quantity: 25, inStock: true,
          image: ITEM_IMAGES.tomato
        },
        {
          id: 'item_milk',
          key: 'milk',
          category: 'grocery',
          badge: '🥛 Daily Dairy',
          name: 'Fresh Farm Milk',
          regionalName: 'పాలు • ताज़ा दूध • பால்',
          price: 32,
          unit: '1 Liter', quantity: 25, inStock: true,
          image: ITEM_IMAGES.milk
        },
        {
          id: 'item_rice',
          key: 'rice',
          category: 'grocery',
          badge: '🌾 Village Staple',
          name: 'Sona Masoori Rice',
          regionalName: 'బియ్యం • बासमती चावल • அரிசி',
          price: 60,
          unit: '1 kg', quantity: 25, inStock: true,
          image: ITEM_IMAGES.rice
        },
        {
          id: 'item_oil',
          key: 'oil',
          category: 'grocery',
          badge: '🌻 Pure Oil',
          name: 'Sunflower Cooking Oil',
          regionalName: 'వంట నూనె • सूरजमुखी तेल • எண்ணெய்',
          price: 135,
          unit: '1 Liter', quantity: 25, inStock: true,
          image: ITEM_IMAGES.oil
        },
        {
          id: 'item_dal',
          key: 'dal',
          category: 'grocery',
          badge: '🥣 Organic Pulse',
          name: 'Toor Dal & Organic Jaggery',
          regionalName: 'కందిపప్పు & బెల్లం • तूर दाल और गुड़ • துவரம் பருப்பு',
          price: 110,
          unit: '1 kg', quantity: 25, inStock: true,
          image: ITEM_IMAGES.dal
        },
        {
          id: 'item_onion',
          key: 'onion',
          category: 'grocery',
          badge: '🧅 Farm Harvest',
          name: 'Fresh Red Onions & Golden Potatoes',
          regionalName: 'ఉల్లిపాయలు & ఆలుగడ్డ • प्याज और आलू • வெங்காயம்',
          price: 35,
          unit: '1 kg', quantity: 25, inStock: true,
          image: ITEM_IMAGES.onion
        },
        {
          id: 'item_banana',
          key: 'banana',
          category: 'grocery',
          badge: '🍌 Farm Fresh',
          name: 'Ripe Bananas & Country Farm Eggs',
          regionalName: 'అరటిపండ్లు & కోడి గుడ్లు • केला और अंडे • வாழைப்பழம்',
          price: 55,
          unit: '1 Dozen', quantity: 25, inStock: true,
          image: ITEM_IMAGES.banana
        },
        {
          id: 'item_sugar',
          key: 'sugar',
          category: 'grocery',
          badge: '🍬 Pure Sweetener',
          name: 'Organic Jaggery & Crystal Sugar',
          regionalName: 'బెల్లం & పంచదార • गुड़ और चीनी • சர்க்கரை',
          price: 44,
          unit: '1 kg', quantity: 25, inStock: true,
          image: ITEM_IMAGES.sugar
        },
        {
          id: 'item_potato',
          key: 'potato',
          category: 'grocery',
          badge: '🥔 Farm Harvest',
          name: 'Fresh Golden Potatoes',
          regionalName: 'ఆలుగడ్డ • आलू • உருளைக்கிழங்கு',
          price: 30,
          unit: '1 kg', quantity: 25, inStock: true,
          image: ITEM_IMAGES.potato
        },
        {
          id: 'item_bangles',
          key: 'bangles',
          category: 'artisan',
          badge: '📿 Artisan Jewelry',
          name: 'Handcrafted Lac Bangles & Terracotta Jhumkas',
          regionalName: 'లక్క గాజులు & బుట్టలు • लाख की चूड़ियाँ • வளையல்கள்',
          price: 190,
          unit: '1 Set', quantity: 25, inStock: true,
          image: ITEM_IMAGES.bangles
        },
        {
          id: 'item_soap',
          key: 'soap',
          category: 'artisan',
          badge: '🧼 Herbal Craft',
          name: 'Handmade Neem-Turmeric Soap & Coconut Oil',
          regionalName: 'వేప పసుపు సబ్బు • नीम हल्दी साबुन • மூலிகை சோப்பு',
          price: 95,
          unit: 'Combo Pack', quantity: 25, inStock: true,
          image: ITEM_IMAGES.soap
        },
        {
          id: 'item_honey',
          key: 'honey',
          category: 'artisan',
          badge: '🍯 Forest & Pooja',
          name: 'Wild Forest Honey, Incense & Marigold Flowers',
          regionalName: 'అడవి తేనె & అగర్‌బత్తి • शहद और अगरबत्ती • ಕಾಡು தேன்',
          price: 210,
          unit: '1 Jar + Pack', quantity: 25, inStock: true,
          image: ITEM_IMAGES.honey
        },
        {
          id: 'item_spices',
          key: 'spices',
          category: 'grocery',
          badge: '🌶️ Village Masala',
          name: 'Red Chillies, Turmeric, Ginger & Garlic Pack',
          regionalName: 'మిర్చి, పసుపు, అల్లం & వెల్లుల్లి • मिर्च हल्दी अदरक • மசாலா',
          price: 85,
          unit: '500 g Pack', quantity: 25, inStock: true,
          image: ITEM_IMAGES.spices
        },
        {
          id: 'item_fruits',
          key: 'fruits',
          category: 'grocery',
          badge: '🥭 Fresh Orchard',
          name: 'Alphonso Mangoes, Apples, Oranges & Coconut',
          regionalName: 'మామిడి, ఆపిల్ & కొబ్బరికాయ • आम, सेब और नारियल • மாம்பழம்',
          price: 160,
          unit: '1 Basket', quantity: 25, inStock: true,
          image: ITEM_IMAGES.fruits
        },
        {
          id: 'item_bakery',
          key: 'bakery',
          category: 'grocery',
          badge: '🍞 Bakery & Chai',
          name: 'Fresh Milk Bread, Butter Biscuits & Chai Tea',
          regionalName: 'బ్రెడ్, బిస్కెట్లు & టీ పొడి • ब्रेड, बिस्कुट और चाय • రൊಟ್ಟಿ',
          price: 65,
          unit: '1 Combo', quantity: 25, inStock: true,
          image: ITEM_IMAGES.bakery
        }
      ],

      // Customer Cart: { itemId: quantity }
      cart: {
        'item_woodtoys': 1,
        'item_terracotta': 1
      },

      // Active Order & 10-Minute Forgotten Items Timer
      activeOrder: null,
      tenMinSecondsLeft: 0,
      tenMinIntervalId: null,

      // Delivery Order Queue / Active Notification
      loggedInUser: {
        email: 'padma.amma@vocallocal.in',
        method: 'One-Time Login',
        isLoggedIn: false
      },
      editingVendorItemId: null,
      deliveryOrder: {
        id: 'ORD-8042',
        otp: '4829',
        otpVerified: false,
        vendorName: 'Sri Lakshmi Kirana Store',
        vendorLocation: 'Shop #12, Madhuravada Main Road (1.1 km away)',
        customerName: 'Padma Amma',
        customerLocation: 'House #42, Midhilapuri Colony, Near Water Tank (2.3 km)',
        estimatedTime: '18 Mins',
        commission: 40,
        orderAmount: 172,
        paymentType: 'COD',
        itemsSummary: 'Fresh Red Tomatoes (1 kg), Fresh Farm Milk (1 L), Sona Masoori Rice (1 kg)',
        status: 'PENDING_ACCEPT' // 'PENDING_ACCEPT' | 'ACCEPTED' | 'PICKED_UP' | 'DELIVERED' | 'DECLINED' | 'CANCELLED_30'
      },
      deliveryCompletedToday: 4,

      // Chat Messages between Customer & Delivery Partner
      chatMessages: [
        {
          sender: 'delivery',
          senderName: 'Delivery Partner Raju 🛵',
          text: 'Namaste! I am at Sri Lakshmi Kirana Store picking up your Tomatoes and Milk.',
          regionalVoice: 'నమస్తే! నేను దుకాణం దగ్గర మీ టమాటా మరియు పాలు తీసుకుంటున్నాను. Namaste! I am picking up your order at the shop.',
          time: '8:32 PM'
        },
        {
          sender: 'delivery',
          senderName: 'Delivery Partner Raju 🛵',
          text: 'I will reach your house gate in 15 minutes. Tap the speaker icon to hear this message!',
          regionalVoice: 'నేను 15 నిమిషాల్లో మీ ఇంటి గేట్ దగ్గరికి వస్తాను. I will reach your house gate in 15 minutes.',
          time: '8:34 PM'
        }
      ],

      // Wallet & Day Statement Transactions
      transactions: [
        { id: 'TX-101', role: 'vendor', type: 'Online Order Instant Credit', amount: 240, sign: '+', time: '6:15 PM', note: 'Order #ORD-8038 (Online UPI)' },
        { id: 'TX-102', role: 'delivery', type: 'Delivery Commission Earned', amount: 35, sign: '+', time: '6:40 PM', note: 'Order #ORD-8038 (2.1 km)' },
        { id: 'TX-103', role: 'vendor', type: '30% Doorstep Cancel Compensation', amount: 60, sign: '+', time: '7:10 PM', note: 'Order #ORD-8039 Cancelled at Doorstep (30% of ₹200)' },
        { id: 'TX-104', role: 'customer', type: 'Grocery Purchase (Online)', amount: 240, sign: '-', time: '6:15 PM', note: 'Rice, Milk & Tomatoes' }
      ],

      // AI Helper Chatbot Messages
      botMessages: [
        {
          sender: 'bot',
          text: 'Namaste! Welcome to VOCAL LOCAL 🎙️. Tap any question below or speak in your language. Tap 🔊 on any reply to hear it aloud!'
        }
      ]
    };

    // 4. ELDER-FRIENDLY TELUGU VOICE ENGINE (TEXT-TO-SPEECH FOR OLDER & UNEDUCATED USERS)
    const TELUGU_PHRASE_REPLACEMENTS = [
      ['AI understood:', 'నమస్కారం! మీరు చెప్పిన వస్తువు:'],
      ['Press green OK button to add to your store, or red NO button to cancel.', 'మీ దుకాణంలో చేర్చడానికి ఆకుపచ్చ ఓకే బటన్ నొక్కండి, వద్దు అనుకుంటే ఎరుపు నో బటన్ నొక్కండి.'],
      ['Press the green OK button to place order, or red NO button to cancel.', 'ఆర్డర్ చేయడానికి ఆకుపచ్చ ఓకే బటన్ నొక్కండి, రద్దు చేయడానికి ఎరుపు నో బటన్ నొక్కండి.'],
      ['Please press the green OK button to confirm!', 'దయచేసి ఆకుపచ్చ ఓకే బటన్ నొక్కి కన్ఫర్మ్ చేయండి!'],
      ['Voice order recognized:', 'మీ వాయిస్ ఆర్డర్ గుర్తించబడింది:'],
      ['Added', 'బాస్కెట్‌లో చేర్చబడింది:'],
      ['to your basket.', 'మీ బుట్టలో వేయబడింది.'],
      ['You have', 'మీ బాస్కెట్‌లో'],
      ['items in your basket.', 'వస్తువులు ఉన్నాయి.'],
      ['Total amount is', 'మొత్తం బిల్లు'],
      ['Order confirmed!', 'శుభవార్త! మీ ఆర్డర్ కన్ఫర్మ్ అయింది!'],
      ['You now have a 10 minute timer to add any forgotten items.', 'మీరు ఏదైనా వస్తువు మర్చిపోతే, 10 నిమిషాల్లోపు ఇదే ఆర్డర్‌లో కలుపుకోవచ్చు.'],
      ['You can also chat or call the delivery partner and listen to messages using the speaker button.', 'డెలివరీ బాబుతో మాట్లాడవచ్చు మరియు స్పీకర్ బటన్ నొక్కి తెలుగులో వినవచ్చు.'],
      ['Selected Cash on Delivery.', 'చేతికి డబ్బులు ఇచ్చే క్యాష్ ఆన్ డెలివరీ ఎంచుకున్నారు.'],
      ['Selected Online Payment. Money goes straight to the shopkeeper account.', 'ఆన్‌లైన్ పేమెంట్ ఎంచుకున్నారు. డబ్బులు నేరుగా దుకాణదారుని ఖాతాలోకి వెళ్తాయి.'],
      ['is now IN STOCK', 'ఇప్పుడు దుకాణంలో అందుబాటులో ఉంది'],
      ['is now OUT OF STOCK', 'ఇప్పుడు స్టాక్ అయిపోయింది'],
      ['In Stock', 'అందుబాటులో ఉంది'],
      ['Out of Stock', 'స్టాక్ లేదు'],
      ['rupees per', 'రూపాయలు, ప్రతి'],
      ['rupees for', 'రూపాయలు,'],
      ['rupees', 'రూపాయలు'],
      ['wallet balance is', 'వాలెట్ బ్యాలెన్స్'],
      ['Delivery Order', 'డెలివరీ ఆర్డర్'],
      ['Pickup from', 'పికప్ దుకాణం:'],
      ['Deliver to', 'కస్టమర్ ఇల్లు:'],
      ['Estimated time', 'అంచనా సమయం'],
      ['Your commission is', 'మీ కమిషన్'],
      ['Press green Accept or red Decline.', 'ఒప్పుకోవడానికి ఆకుపచ్చ బటన్, వద్దు అనుకుంటే ఎరుపు బటన్ నొక్కండి.'],
      ['You accepted the order!', 'మీరు ఆర్డర్ అంగీకరించారు!'],
      ['Order delivered!', 'డెలివరీ విజయవంతంగా పూర్తయింది!'],
      ['Live GPS tracking:', 'లైవ్ మ్యాప్ సమాచారం:'],
      ['price', 'ధర'],
      ['Fresh Red Tomatoes', 'తాజా ఎర్ర టమాటాలు'],
      ['Fresh Farm Milk', 'తాజా పాలు'],
      ['Sona Masoori Rice', 'సోనా మసూరి బియ్యం'],
      ['Sunflower Cooking Oil', 'సన్‌ఫ్లవర్ వంట నూనె'],
      ['Etikoppaka Wooden Lacquer Toys', 'ఏటికొప్పాక చెక్క బొమ్మలు'],
      ['Terracotta Clay Matka & Painted Diyas', 'మట్టి కుండ మరియు దీపాలు'],
      ['Kalamkari Block-Print Fabric & Dye Blocks', 'కలంకారీ చేనేత వస్త్రం'],
      ['Silk Zari Threads, Mirrors & Beads Kit', 'పట్టు దారాలు మరియు పూసల బాక్స్'],
      ['Handwoven Bamboo Baskets & Cane Strips', 'వెదురు బుట్టలు'],
      ['Handcrafted Brass Peacock Deepam & Urli', 'ఇత్తడి నెమలి దీపం'],
      ['Mirror-Embroidery Handmade Jute Tote Bag', 'జూట్ చేతి సంచి'],
      ['Carved Rosewood Elephant & Sandalwood Blocks', 'చెక్క ఏనుగు మరియు గంధపు చెక్క'],
      ['Kondapalli Dolls & Painted Ceramic Plates', 'కొండపల్లి బొమ్మలు మరియు ప్లేట్లు'],
      ['Handcrafted Lac Bangles & Terracotta Jhumkas', 'లక్క గాజులు మరియు బుట్టలు'],
      ['Handmade Neem-Turmeric Soap & Coconut Oil', 'వేప పసుపు సబ్బు మరియు కొబ్బరి నూనె'],
      ['Wild Forest Honey, Incense & Marigold Flowers', 'అడవి తేనె మరియు అగర్‌బత్తి'],
      ['Red Chillies, Turmeric, Ginger & Garlic Pack', 'మిర్చి, పసుపు, అల్లం మరియు వెల్లుల్లి'],
      ['Alphonso Mangoes, Apples, Oranges & Coconut', 'మామిడి పండ్లు, ఆపిల్ మరియు కొబ్బరికాయ'],
      ['Fresh Milk Bread, Butter Biscuits & Chai Tea', 'మిల్క్ బ్రెడ్, బిస్కెట్లు మరియు టీ'],
      ['Toor Dal & Organic Jaggery', 'కందిపప్పు మరియు బెల్లం'],
      ['Fresh Red Onions & Golden Potatoes', 'ఉల్లిపాయలు మరియు ఆలుగడ్డ'],
      ['Ripe Bananas & Country Farm Eggs', 'అరటిపండ్లు మరియు కోడి గుడ్లు'],
      ['Organic Jaggery & Crystal Sugar', 'బెల్లం మరియు పంచదార'],
      ['Fresh Golden Potatoes', 'తాజా ఆలుగడ్డలు']
    ];

    function toElderFriendlyTelugu(rawText) {
      let out = String(rawText || '');
      if (state.language !== 'te') return out;
      for (let i = 0; i < TELUGU_PHRASE_REPLACEMENTS.length; i++) {
        const [enStr, teStr] = TELUGU_PHRASE_REPLACEMENTS[i];
        out = out.split(enStr).join(teStr);
      }
      return out;
    }

    function speakText(text) {
      if (!text) return;
      const spokenText = toElderFriendlyTelugu(text);
      showToast('🔊 తెలుగు వాయిస్: "' + spokenText.slice(0, 75) + (spokenText.length > 75 ? '..."' : '"'), '🔊');
      try {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utter = new SpeechSynthesisUtterance(spokenText);
          const langCode = (LANG_DATA[state.language] && LANG_DATA[state.language].speechLang) || 'te-IN';
          utter.lang = langCode;
          // Slower, warmer pace (0.84) so older people can understand every word clearly
          utter.rate = 0.84;
          utter.pitch = 1.0;
          const voices = window.speechSynthesis.getVoices ? window.speechSynthesis.getVoices() : [];
          if (voices && voices.length > 0) {
            const teVoice = voices.find(v => v.lang && v.lang.toLowerCase().includes('te')) ||
                            voices.find(v => v.lang && v.lang.toLowerCase().includes('in'));
            if (teVoice) utter.voice = teVoice;
          }
          window.speechSynthesis.speak(utter);
        }
      } catch (e) {
        // Visual toast fallback already shown
      }
    }

    function speakOtpInTelugu() {
      const otp = (state.deliveryOrder && state.deliveryOrder.otp) ? String(state.deliveryOrder.otp) : '4829';
      const digitMap = { '0': 'సున్నా', '1': 'ఒకటి', '2': 'రెండు', '3': 'మూడు', '4': 'నాలుగు', '5': 'ఐదు', '6': 'ఆరు', '7': 'ఏడు', '8': 'ఎనిమిది', '9': 'తొమ్మిది' };
      const teDigits = otp.split('').map(d => digitMap[d] || d).join(', ');
      speakText('నమస్కారం అమ్మ! మీ డెలివరీ ఓటిపి నంబర్: ' + otp + ' (' + teDigits + '). డెలివరీ బాబు మీ ఇంటి వద్దకు వచ్చినప్పుడు ఈ ఓటిపి చెప్పండి.');
    }

    function getLangText(key) {
      const pack = LANG_DATA[state.language] || LANG_DATA.en;
      return pack[key] || LANG_DATA.en[key];
    }

    function changeLanguage(lang) {
      state.language = lang;
      speakText(getLangText('welcomeVoice'));
      renderAll();
    }

    function speakCurrentRoleGuide() {
      if (state.currentRole === 'vendor') {
        speakText(getLangText('vendorVoiceHelp'));
      } else if (state.currentRole === 'customer') {
        speakText(getLangText('custVoiceHelp'));
      } else {
        speakDeliveryNotification();
      }
    }

    // 5. TOAST HELPER
    let toastTimer = null;
    function showToast(message, icon) {
      const banner = document.getElementById('toastBanner');
      const msgEl = document.getElementById('toastMessage');
      const iconEl = document.getElementById('toastIcon');
      if (!banner || !msgEl || !iconEl) return;
      iconEl.textContent = icon || '✅';
      msgEl.textContent = message;
      banner.classList.remove('hidden');
      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(hideToast, 4000);
    }

    function hideToast() {
      const banner = document.getElementById('toastBanner');
      if (banner) banner.classList.add('hidden');
    }

    // 6. ROLE SWITCHING (VENDOR / CUSTOMER / DELIVERY PARTNER)
    function switchRole(role) {
      state.currentRole = role;
      const views = {
        vendor: document.getElementById('viewVendor'),
        customer: document.getElementById('viewCustomer'),
        delivery: document.getElementById('viewDelivery')
      };
      const tabs = {
        vendor: document.getElementById('tabBtnVendor'),
        customer: document.getElementById('tabBtnCustomer'),
        delivery: document.getElementById('tabBtnDelivery')
      };

      Object.keys(views).forEach(k => {
        if (k === role) {
          views[k].classList.remove('hidden');
          tabs[k].className = "flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 py-2.5 px-2 rounded-2xl font-black transition-all border-2 tap-card bg-white text-indigo-950 border-amber-400 shadow-lg";
        } else {
          views[k].classList.add('hidden');
          tabs[k].className = "flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 py-2.5 px-2 rounded-2xl font-black transition-all border-2 tap-card bg-indigo-950/60 text-white border-white/20 hover:bg-indigo-950";
        }
      });

      // Update Role Banner
      const avatarEl = document.getElementById('roleBannerAvatar');
      const titleEl = document.getElementById('roleBannerTitle');
      const descEl = document.getElementById('roleBannerDesc');
      if (role === 'vendor') {
        avatarEl.textContent = '🏪';
        titleEl.textContent = '1. Shopkeeper (Vendor) Interface';
        descEl.textContent = 'Add items by Mother-Tongue Voice or Typing • Toggle Stock ON/OFF • Choose Daily/Weekly/Monthly COD Payouts';
      } else if (role === 'customer') {
        avatarEl.textContent = '🛒';
        titleEl.textContent = '2. Customer Shopping Interface';
        descEl.textContent = 'Tap Large Item Pictures or Speak Order • Green OK / Red NO Confirmation • 10-Min Add Item Timer • Chat with 🔊 Speaker';
      } else {
        avatarEl.textContent = '🛵';
        titleEl.textContent = state.vendorIsDeliveryPartner ? '3. Delivery Partner (Vendor Self-Delivery Mode Active!)' : '3. Delivery Partner Interface';
        descEl.textContent = 'See Shop & Customer Location, Estimated Delivery Time, and Commission • Accept (OK) or Decline (NO)';
      }

      renderAll();
    }

    // 7. VENDOR SELF-DELIVERY TOGGLE (Vendor can also become Delivery Partner)
    function toggleVendorAsDelivery() {
      state.vendorIsDeliveryPartner = !state.vendorIsDeliveryPartner;
      const btn = document.getElementById('btnToggleSelfDelivery');
      const panel = document.getElementById('vendorSelfDeliveryPanel');
      if (state.vendorIsDeliveryPartner) {
        btn.textContent = 'ON ✅';
        btn.className = 'px-3 py-1.5 rounded-xl font-black text-xs border-2 transition-all tap-card bg-emerald-600 text-white border-emerald-300';
        panel.classList.remove('hidden');
        speakText('Self Delivery Partner Mode is now ON! You can deliver orders yourself and earn delivery commission.');
      } else {
        btn.textContent = 'OFF';
        btn.className = 'px-3 py-1.5 rounded-xl font-black text-xs border-2 transition-all tap-card bg-slate-200 text-slate-800 border-slate-400';
        panel.classList.add('hidden');
        showToast('Vendor Self-Delivery Mode turned OFF', '🏪');
      }
      renderDeliveryView();
    }

    // 8. VENDOR ADD ITEMS: VOICE (MOTHER TONGUE) & TYPING + AI CONFIRMATION
    // SMART MULTILINGUAL KEYWORD DICTIONARY FOR ALL 25+ ITEM FAMILIES
    const ITEM_KEYWORD_MAP = [
      { key: 'woodtoys', category: 'artisan', defaultPrice: 250, defaultUnit: '1 Craft Set', label: 'Etikoppaka Wooden Lacquer Toys', keywords: ['toy', 'toys', 'etikoppaka', 'channapatna', 'wooden toy', 'lacquer', 'bomma', 'bommalu', 'బొమ్మ', 'బొమ్మలు', 'ఏటికొప్పాక', 'खिलौना', 'खिलौने', 'பொம்மை', 'spinning top', 'puppet'] },
      { key: 'terracotta', category: 'artisan', defaultPrice: 180, defaultUnit: '1 Set', label: 'Terracotta Clay Matka & Painted Diyas', keywords: ['terracotta', 'clay', 'pot', 'pots', 'matka', 'pottery', 'diya', 'diyas', 'earthen', 'ceramic', 'vase', 'kulhad', 'kunda', 'matti', 'కుండ', 'మట్టి', 'దీపాలు', 'मटका', 'मिट्टी', 'दीया', 'दीये', 'பானை', 'மண்'] },
      { key: 'kalamkari', category: 'materials', defaultPrice: 420, defaultUnit: '2 Meters', label: 'Kalamkari Block-Print Fabric & Dye Blocks', keywords: ['kalamkari', 'fabric', 'cloth', 'handloom', 'saree', 'sari', 'pochampally', 'ikat', 'cotton', 'silk cloth', 'dupatta', 'shawl', 'textile', 'dye', 'block print', 'vastram', 'battalu', 'chira', 'చీర', 'కలంకారీ', 'వస్త్రం', 'చేనేత', 'బట్ట', 'कलमकारी', 'कपड़ा', 'साड़ी', 'हथकरघा', 'கலம்காரி', 'துணி', 'புடவை'] },
      { key: 'craftkit', category: 'materials', defaultPrice: 150, defaultUnit: '1 Full Box', label: 'Silk Zari Threads, Mirrors & Beads Kit', keywords: ['thread', 'threads', 'silk', 'zari', 'bead', 'beads', 'mirror', 'embroidery', 'macrame', 'cord', 'rope', 'wool', 'yarn', 'needle', 'knitting', 'stitching', 'lace', 'button', 'sequin', 'craft', 'material', 'raw material', 'handcraft material', 'daram', 'daralu', 'pusalu', 'పట్టు', 'దారాలు', 'పూసలు', 'అద్దాలు', 'धागा', 'धागे', 'मोती', 'जरी', 'நூல்', 'மணி'] },
      { key: 'bamboo', category: 'materials', defaultPrice: 120, defaultUnit: 'Pair (2 Pcs)', label: 'Handwoven Bamboo Baskets & Cane Strips', keywords: ['bamboo', 'cane', 'basket', 'baskets', 'weave', 'woven', 'wicker', 'reed', 'mat', 'chatai', 'broom', 'winnow', 'fan', 'veduru', 'butta', 'buttalu', 'chapa', 'వెదురు', 'బుట్ట', 'బుట్టలు', 'చాప', 'बांस', 'टोकरी', 'चटाई', 'மூங்கில்', 'கூடை'] },
      { key: 'brasslamp', category: 'artisan', defaultPrice: 550, defaultUnit: '1 Piece', label: 'Handcrafted Brass Peacock Deepam & Urli', keywords: ['brass', 'lamp', 'deepam', 'urli', 'metal', 'bronze', 'copper', 'bell', 'idol', 'statue', 'peacock lamp', 'vilakku', 'kalash', 'puja vessel', 'ittadi', 'ragi', 'ఇత్తడి', 'దీపం', 'రాగి', 'पीतल', 'दीपक', 'तांबा', 'பித்தளை', 'விளக்கு'] },
      { key: 'jutebag', category: 'artisan', defaultPrice: 220, defaultUnit: '1 Bag', label: 'Mirror-Embroidery Handmade Jute Tote Bag', keywords: ['jute', 'bag', 'bags', 'tote', 'handbag', 'purse', 'pouch', 'wallet', 'clutch', 'backpack', 'sling', 'sanchi', 'జూట్', 'సంచి', 'బ్యాగ్', 'जूट', 'बैग', 'थैला', 'சணல்', 'பை'] },
      { key: 'woodcarving', category: 'materials', defaultPrice: 380, defaultUnit: '1 Set', label: 'Carved Rosewood Elephant & Sandalwood Blocks', keywords: ['carved', 'carving', 'rosewood', 'sandalwood', 'teak', 'wood', 'wooden', 'elephant', 'wood block', 'timber', 'sculpture', 'figurine', 'frame', 'chisel', 'enugu', 'gandham', 'chekka', 'చెక్క', 'ఏనుగు', 'గంధపు', 'नक्काशी', 'हाथी', 'चंदन', 'लकड़ी', 'யானை', 'சந்தனம்', 'மரம்'] },
      { key: 'folkart', category: 'artisan', defaultPrice: 310, defaultUnit: '1 Art Set', label: 'Kondapalli Dolls & Painted Ceramic Plates', keywords: ['kondapalli', 'folk', 'madhubani', 'warli', 'tanjore', 'cheriyal', 'plate', 'plates', 'painting', 'painted', 'wall art', 'canvas', 'color', 'paint', 'brush', 'mask', 'doll', 'dolls', 'artisan', 'handicraft', 'కొండపల్లి', 'ప్లేట్లు', 'చిత్రం', 'लोक कला', 'प्लेट', 'पेंटिंग', 'கொண்டப்பள்ளி'] },
      { key: 'bangles', category: 'artisan', defaultPrice: 190, defaultUnit: '1 Set', label: 'Handcrafted Lac Bangles & Terracotta Jhumkas', keywords: ['bangle', 'bangles', 'jewelry', 'jewellery', 'earring', 'earrings', 'jhumka', 'necklace', 'anklet', 'ring', 'bracelet', 'ornament', 'terracotta jewelry', 'lac', 'glass bangle', 'gajulu', 'buttalu', 'గాజులు', 'నగలు', 'చెవి దిద్దులు', 'चूड़ी', 'चूड़ियाँ', 'गहने', 'झुमका', 'வளையல்', 'நகை'] },
      { key: 'soap', category: 'artisan', defaultPrice: 95, defaultUnit: 'Combo Pack', label: 'Handmade Neem-Turmeric Soap & Coconut Oil', keywords: ['soap', 'soaps', 'herbal', 'neem', 'shampoo', 'shikakai', 'aloe', 'cosmetic', 'lotion', 'cream', 'face pack', 'sandal soap', 'hair oil', 'coconut oil', 'sabbu', 'సబ్బు', 'వేప', 'साबुन', 'नीम', 'சோப்பு'] },
      { key: 'honey', category: 'artisan', defaultPrice: 210, defaultUnit: '1 Jar + Pack', label: 'Wild Forest Honey, Incense & Marigold Flowers', keywords: ['honey', 'incense', 'agarbatti', 'dhoop', 'camphor', 'kumkum', 'flower', 'flowers', 'marigold', 'garland', 'pooja', 'puja', 'candle', 'wax', 'tene', 'puvvulu', 'agarbathi', 'తేనె', 'పూలు', 'అగర్‌బత్తి', 'కర్పూరం', 'शहद', 'अगरबत्ती', 'फूल', 'कपूर', 'தேன்', 'பூக்கள்', 'ஊதுபத்தி'] },
      { key: 'spices', category: 'grocery', defaultPrice: 85, defaultUnit: '500 g Pack', label: 'Red Chillies, Turmeric, Ginger & Garlic Pack', keywords: ['spice', 'spices', 'masala', 'chilli', 'chili', 'chillies', 'mirchi', 'turmeric', 'haldi', 'pasupu', 'garlic', 'ginger', 'pepper', 'jeera', 'cumin', 'coriander', 'mustard', 'cardamom', 'clove', 'cinnamon', 'salt', 'tamarind', 'pickle', 'achaar', 'karam', 'allam', 'vellulli', 'uppu', 'చింతపండు', 'మిర్చి', 'కారం', 'పసుపు', 'అల్లం', 'వెల్లుల్లి', 'ఉప్పు', 'మసాలా', 'मिर्च', 'हल्दी', 'अदरक', 'लहसुन', 'मसाला', 'नमक', 'மிளகாய்', 'மஞ்சள்', 'இஞ்சி', 'பூண்டு', 'உப்பு'] },
      { key: 'fruits', category: 'grocery', defaultPrice: 160, defaultUnit: '1 Basket', label: 'Alphonso Mangoes, Apples, Oranges & Coconut', keywords: ['mango', 'mangoes', 'apple', 'apples', 'orange', 'oranges', 'pomegranate', 'coconut', 'guava', 'papaya', 'grapes', 'watermelon', 'lemon', 'lime', 'fruit', 'fruits', 'mamidi', 'kobbari', 'pandlu', 'మామిడి', 'ఆపిల్', 'కొబ్బరి', 'కొబ్బరికాయ', 'పండ్లు', 'జామ', 'నిమ్మకాయ', 'आम', 'सेब', 'संतरा', 'नारियल', 'अनार', 'नींबू', 'फल', 'மாம்பழம்', 'ஆப்பிள்', 'தேங்காய்', 'பழம்'] },
      { key: 'bakery', category: 'grocery', defaultPrice: 65, defaultUnit: '1 Combo', label: 'Fresh Milk Bread, Butter Biscuits & Chai Tea', keywords: ['bread', 'biscuit', 'biscuits', 'cookie', 'cookies', 'cake', 'rusk', 'bun', 'snack', 'snacks', 'samosa', 'chips', 'namkeen', 'murukku', 'mixture', 'noodles', 'maggi', 'pasta', 'chocolate', 'tea', 'chai', 'coffee', 'rotis', 'బ్రెడ్', 'బిస్కెట్', 'టీ', 'కాఫీ', 'బ्रेड', 'बिस्कुट', 'चाय', 'कॉफी', 'ரொட்டி', 'பிஸ்கட்', 'தேநீர்', 'காபி'] },
      { key: 'milk', category: 'grocery', defaultPrice: 32, defaultUnit: '1 Liter', label: 'Fresh Farm Milk', keywords: ['milk', 'dairy', 'curd', 'yogurt', 'buttermilk', 'paneer', 'cheese', 'ghee', 'butter', 'cream', 'lassi', 'palu', 'perugu', 'negyi', 'neyyi', 'majjiga', 'పాలు', 'పెరుగు', 'నెయ్యి', 'మజ్జిగ', 'పన్నీర్', 'दूध', 'दही', 'पनीर', 'घी', 'मक्खन', 'பால்', 'தயிர்', 'நெய்'] },
      { key: 'rice', category: 'grocery', defaultPrice: 60, defaultUnit: '1 kg', label: 'Sona Masoori Rice', keywords: ['rice', 'basmati', 'sona masoori', 'paddy', 'grain', 'atta', 'flour', 'wheat', 'maida', 'sooji', 'rava', 'idli rava', 'millet', 'ragi', 'jowar', 'poha', 'oats', 'biyyam', 'godhuma', 'pindi', 'బియ్యం', 'గోధుమ', 'పిండి', 'రవ్వ', 'రాగి', 'चावल', 'आटा', 'मैदा', 'सूजी', 'அரிசி', 'மாவு'] },
      { key: 'oil', category: 'grocery', defaultPrice: 135, defaultUnit: '1 Liter', label: 'Sunflower Cooking Oil', keywords: ['oil', 'sunflower', 'groundnut', 'peanut oil', 'cooking oil', 'mustard oil', 'sesame oil', 'gingelly', 'refined oil', 'nune', 'నూనె', 'వంట నూనె', 'तेल', 'எண்ணெய்'] },
      { key: 'dal', category: 'grocery', defaultPrice: 110, defaultUnit: '1 kg', label: 'Toor Dal & Organic Pulses', keywords: ['dal', 'daal', 'toor', 'lentil', 'lentils', 'pulses', 'moong', 'chana', 'urad', 'masoor', 'rajma', 'chickpea', 'gram', 'groundnut', 'peanut', 'cashew', 'almond', 'dry fruit', 'pappu', 'kandipappu', 'minapappu', 'pesarapappu', 'senagapappu', 'కందిపప్పు', 'పప్పు', 'మినపప్పు', 'పెసరపప్పు', 'శనగపప్పు', 'दाल', 'तूर', 'चना', 'मूंग', 'उड़द', 'பருப்பு'] },
      { key: 'sugar', category: 'grocery', defaultPrice: 44, defaultUnit: '1 kg', label: 'Organic Jaggery & Crystal Sugar', keywords: ['sugar', 'jaggery', 'sweet', 'sweets', 'laddu', 'mysore pak', 'gur', 'bellam', 'panchadara', 'చక్కెర', 'పంచదార', 'బెల్లం', 'స్వీట్', 'चीनी', 'गुड़', 'शक्कर', 'मिठाई', 'சர்க்கரை', 'வெல்லம்'] },
      { key: 'onion', category: 'grocery', defaultPrice: 35, defaultUnit: '1 kg', label: 'Fresh Red Onions', keywords: ['onion', 'onions', 'shallot', 'ullipaya', 'ullipayalu', 'erragadda', 'ఉల్లిపాయ', 'ఉల్లిపాయలు', 'ఉల్లి', 'प्याज', 'कांदा', 'வெங்காயம்'] },
      { key: 'potato', category: 'grocery', defaultPrice: 30, defaultUnit: '1 kg', label: 'Fresh Golden Potatoes', keywords: ['potato', 'potatoes', 'aloo', 'alu', 'alugadda', 'bangaladumpa', 'sweet potato', 'ఆలుగడ్డ', 'బంగాళాదుంప', 'ఆలు', 'आलू', 'உருளைக்கிழங்கு'] },
      { key: 'banana', category: 'grocery', defaultPrice: 55, defaultUnit: '1 Dozen', label: 'Ripe Bananas', keywords: ['banana', 'bananas', 'plantain', 'aratipandu', 'aratipandlu', 'అరటి', 'అరటిపండ్లు', 'అరటికాయ', 'केला', 'केले', 'வாழைப்பழம்'] },
      { key: 'egg', category: 'grocery', defaultPrice: 72, defaultUnit: '12 Eggs', label: 'Country Farm Eggs', keywords: ['egg', 'eggs', 'poultry', 'chicken', 'meat', 'mutton', 'fish', 'prawns', 'guddu', 'gudlu', 'kodi', 'chepa', 'కోడి గుడ్లు', 'గుడ్లు', 'గుడ్డు', 'చికెన్', 'చేప', 'अंडा', 'अंडे', 'चिकन', 'मछली', 'முட்டை', 'மீன்'] },
      { key: 'tomato', category: 'grocery', defaultPrice: 40, defaultUnit: '1 kg', label: 'Fresh Red Tomatoes', keywords: ['tomato', 'tomatoes', 'tamata', 'tamatar', 'vegetable', 'vegetables', 'veggies', 'greens', 'spinach', 'palak', 'brinjal', 'eggplant', 'okra', 'bhindi', 'ladyfinger', 'cabbage', 'cauliflower', 'carrot', 'beans', 'gourd', 'cucumber', 'drumstick', 'కూరగాయలు', 'టమాటా', 'టమోటా', 'వంకాయ', 'బెండకాయ', 'ఆకుకూర', 'टमाटर', 'सब्जी', 'बैंगन', 'भिंडी', 'पालक', 'गाजर', 'தக்காளி', 'காய்கறி'] }
    ];

    function detectItemsFromSpeechOrText(rawText) {
      const text = (rawText || '').trim();
      const lower = text.toLowerCase();
      if (!lower) return [];

      let matchedKeys = [];
      ITEM_KEYWORD_MAP.forEach(entry => {
        for (let i = 0; i < entry.keywords.length; i++) {
          const kw = entry.keywords[i].toLowerCase();
          if (lower.includes(kw)) {
            if (!matchedKeys.includes(entry.key)) {
              matchedKeys.push(entry.key);
            }
            break;
          }
        }
      });

      // Also check existing store items by name or regionalName
      state.items.forEach(it => {
        if (lower.includes(it.name.toLowerCase()) || lower.includes(it.key.toLowerCase())) {
          if (!matchedKeys.includes(it.key)) matchedKeys.push(it.key);
        }
      });

      return matchedKeys;
    }

    function getBestVisualMatch(rawText) {
      const keys = detectItemsFromSpeechOrText(rawText);
      if (keys.length > 0) {
        const k = keys[0];
        const meta = ITEM_KEYWORD_MAP.find(m => m.key === k);
        return {
          key: k,
          image: ITEM_IMAGES[k] || ITEM_IMAGES.terracotta,
          category: meta ? meta.category : 'artisan',
          defaultPrice: meta ? meta.defaultPrice : 120,
          defaultUnit: meta ? meta.defaultUnit : '1 Piece',
          label: meta ? meta.label : rawText
        };
      }
      // If user typed something completely novel, pick the closest visual family or rich 3D illustrated card
      return {
        key: 'custom_' + Date.now(),
        image: createDynamicSvgForCustomItem(rawText),
        category: 'artisan',
        defaultPrice: 120,
        defaultUnit: '1 Piece',
        label: rawText || 'Store Item'
      };
    }

    function updateVendorLivePreview() {
      const inp = document.getElementById('vendorInputName');
      const imgEl = document.getElementById('vendorLivePreviewImg');
      const lblEl = document.getElementById('vendorLivePreviewLabel');
      const priceInput = document.getElementById('vendorInputPrice');
      if (!inp || !imgEl || !lblEl) return;

      const val = (inp.value || '').trim();
      if (!val) {
        const curKey = state.selectedVendorIcon || 'terracotta';
        imgEl.src = ITEM_IMAGES[curKey] || ITEM_IMAGES.terracotta;
        lblEl.textContent = curKey.toUpperCase();
        return;
      }

      const match = getBestVisualMatch(val);
      imgEl.src = match.image;
      lblEl.textContent = val;
      if (ITEM_IMAGES[match.key]) {
        state.selectedVendorIcon = match.key;
        document.querySelectorAll('.vendor-icon-btn').forEach(btn => {
          if (btn.getAttribute('data-icon') === match.key) {
            btn.className = 'vendor-icon-btn p-1.5 rounded-xl border-2 border-indigo-600 bg-indigo-50 text-xl flex items-center justify-center';
          } else {
            btn.className = 'vendor-icon-btn p-1.5 rounded-xl border-2 border-transparent hover:bg-slate-200 text-xl flex items-center justify-center';
          }
        });
      }
      if (priceInput && (priceInput.value === '45' || priceInput.value === '100')) {
        priceInput.value = match.defaultPrice;
      }
    }

    function createDynamicSvgForCustomItem(itemName) {
      const lower = (itemName || '').toLowerCase();
      // First check if any keyword in ITEM_KEYWORD_MAP matches so we return a real 3D photo whenever possible!
      for (let i = 0; i < ITEM_KEYWORD_MAP.length; i++) {
        const entry = ITEM_KEYWORD_MAP[i];
        for (let j = 0; j < entry.keywords.length; j++) {
          if (lower.includes(entry.keywords[j].toLowerCase())) {
            return ITEM_IMAGES[entry.key];
          }
        }
      }
      // Rich 3D-styled illustrated icon dictionary for any other specific item
      let emoji = '🏺';
      let bg1 = '#fde68a';
      let bg2 = '#f59e0b';
      if (lower.includes('book') || lower.includes('pen') || lower.includes('paper') || lower.includes('pencil')) { emoji = '📚'; bg1 = '#bfdbfe'; bg2 = '#3b82f6'; }
      else if (lower.includes('shoe') || lower.includes('slipper') || lower.includes('chappal') || lower.includes('sandal')) { emoji = '🩴'; bg1 = '#fed7aa'; bg2 = '#ea580c'; }
      else if (lower.includes('umbrella') || lower.includes('rain')) { emoji = '☂️'; bg1 = '#ddd6fe'; bg2 = '#7c3aed'; }
      else if (lower.includes('bucket') || lower.includes('mug') || lower.includes('plastic')) { emoji = '🪣'; bg1 = '#bae6fd'; bg2 = '#0284c7'; }
      else if (lower.includes('lock') || lower.includes('key') || lower.includes('tool') || lower.includes('hammer')) { emoji = '🛠️'; bg1 = '#e2e8f0'; bg2 = '#475569'; }
      else if (lower.includes('candle') || lower.includes('light') || lower.includes('torch') || lower.includes('bulb')) { emoji = '🕯️'; bg1 = '#fef08a'; bg2 = '#ca8a04'; }
      else if (lower.includes('ice') || lower.includes('kulfi') || lower.includes('juice') || lower.includes('drink') || lower.includes('water') || lower.includes('soda')) { emoji = '🥤'; bg1 = '#a5f3fc'; bg2 = '#0891b2'; }
      else if (lower.includes('dress') || lower.includes('shirt') || lower.includes('kurta') || lower.includes('lungi') || lower.includes('towel')) { emoji = '👘'; bg1 = '#fbcfe8'; bg2 = '#db2777'; }

      const clean = (itemName || 'Artisan Item').replace(/[<>&"']/g, '').slice(0, 20);
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
        <defs>
          <radialGradient id="g1" cx="50%" cy="42%" r="60%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="55%" stop-color="${bg1}"/>
            <stop offset="100%" stop-color="${bg2}"/>
          </radialGradient>
        </defs>
        <rect width="240" height="240" rx="28" fill="url(#g1)"/>
        <ellipse cx="120" cy="158" rx="62" ry="14" fill="#0f172a" opacity="0.18"/>
        <circle cx="120" cy="102" r="58" fill="#ffffff" opacity="0.92"/>
        <text x="120" y="124" font-size="68" text-anchor="middle">${emoji}</text>
        <rect x="16" y="176" width="208" height="46" rx="14" fill="#0f172a" opacity="0.88"/>
        <text x="120" y="205" font-family="sans-serif" font-size="16" font-weight="bold" fill="#fbbf24" text-anchor="middle">${clean.toUpperCase()}</text>
      </svg>`;
      return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
    }

    let userManuallyClickedVendorIcon = false;
    function selectVendorIcon(iconKey) {
      state.selectedVendorIcon = iconKey;
      userManuallyClickedVendorIcon = true;
      document.querySelectorAll('.vendor-icon-btn').forEach(btn => {
        if (btn.getAttribute('data-icon') === iconKey) {
          btn.className = 'vendor-icon-btn p-1.5 rounded-xl border-2 border-indigo-600 bg-indigo-50 text-xl flex items-center justify-center';
        } else {
          btn.className = 'vendor-icon-btn p-1.5 rounded-xl border-2 border-transparent hover:bg-slate-200 text-xl flex items-center justify-center';
        }
      });
      const imgEl = document.getElementById('vendorLivePreviewImg');
      const lblEl = document.getElementById('vendorLivePreviewLabel');
      if (imgEl && ITEM_IMAGES[iconKey]) {
        imgEl.src = ITEM_IMAGES[iconKey];
      }
      if (lblEl) {
        const meta = ITEM_KEYWORD_MAP.find(m => m.key === iconKey);
        lblEl.textContent = meta ? meta.label.split(' ')[0] : iconKey;
      }
    }

    let activeVoiceModalMode = 'customer'; // 'vendor' | 'customer'
    function openVoicePromptModal(mode) {
      activeVoiceModalMode = mode;
      const modal = document.getElementById('modalVoicePrompt');
      const titleEl = document.getElementById('voiceModalTitle');
      const subEl = document.getElementById('voiceModalSub');
      const inp = document.getElementById('voiceModalInput');
      const grid = document.getElementById('voiceModalQuickGrid');

      if (mode === 'vendor') {
        titleEl.textContent = '🎙️ Shopkeeper Voice Input (Mother Tongue AI)';
        subEl.textContent = 'Speak or type any item name & price (e.g. "Bamboo Basket 120", "Kalamkari 420", "Milk 32")';
        inp.placeholder = 'e.g. Etikoppaka Toys 250, Terracotta Pot 180, Milk 32...';
      } else {
        titleEl.textContent = '🎙️ Customer Voice Order (Speak Any Item)';
        subEl.textContent = 'Speak, type, or tap any item below to add it to your basket!';
        inp.placeholder = 'e.g. Bamboo Basket, Wooden Toys, Kalamkari, Milk, Rice...';
      }
      inp.value = '';

      grid.innerHTML = state.items.map(it => `
        <button type="button" onclick="pickVoiceModalItem('${it.key}')"
          class="bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-400 rounded-xl p-1.5 flex flex-col items-center text-center tap-card">
          <img src="${it.image}" alt="${it.name}" class="w-12 h-12 rounded-lg object-cover mb-1" />
          <span class="text-[10px] font-black text-slate-800 leading-tight line-clamp-1">${it.name.split(' ')[0]} ${it.name.split(' ')[1] || ''}</span>
          <span class="text-[10px] font-bold text-emerald-700">₹${it.price}</span>
        </button>
      `).join('');

      modal.classList.remove('hidden');
      setTimeout(() => inp.focus(), 80);
    }

    function closeVoicePromptModal() {
      document.getElementById('modalVoicePrompt').classList.add('hidden');
    }

    function pickVoiceModalItem(itemKey) {
      closeVoicePromptModal();
      const found = state.items.find(i => i.key === itemKey);
      if (activeVoiceModalMode === 'vendor') {
        if (found) {
          simulateVendorVoicePhrase(found.regionalName.split('•')[0].trim() + ' ₹' + found.price, found.name, found.price, found.unit, found.key);
        }
      } else {
        if (found) {
          runCustomerVoiceCommand(found.name, [found.key]);
        }
      }
    }

    function confirmVoicePromptModal() {
      const inp = document.getElementById('voiceModalInput');
      const text = (inp.value || '').trim();
      closeVoicePromptModal();
      if (!text) return;
      if (activeVoiceModalMode === 'vendor') {
        processVendorSpokenTranscript(text);
      } else {
        processCustomerSpokenTranscript(text);
      }
    }

    function startVendorVoiceAdd() {
      // First check if vendor already typed something in vendorInputName
      const typedVal = (document.getElementById('vendorInputName').value || '').trim();
      if (typedVal) {
        submitVendorTypedItem();
        return;
      }

      const micBtn = document.getElementById('btnVendorVoiceMic');
      const statusEl = document.getElementById('vendorVoiceStatus');
      const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;

      micBtn.classList.add('mic-pulse');
      statusEl.textContent = '🎙️ Listening in Mother Tongue... Speak item name & price now!';

      if (SpeechRec) {
        try {
          const rec = new SpeechRec();
          rec.lang = (LANG_DATA[state.language] && LANG_DATA[state.language].speechLang) || 'te-IN';
          let handled = false;
          rec.onresult = function(ev) {
            handled = true;
            micBtn.classList.remove('mic-pulse');
            const transcript = ev.results[0][0].transcript;
            processVendorSpokenTranscript(transcript);
          };
          rec.onerror = function() {
            if (!handled) {
              handled = true;
              micBtn.classList.remove('mic-pulse');
              openVoicePromptModal('vendor');
            }
          };
          rec.start();
          return;
        } catch (e) {
          micBtn.classList.remove('mic-pulse');
          openVoicePromptModal('vendor');
          return;
        }
      }

      micBtn.classList.remove('mic-pulse');
      openVoicePromptModal('vendor');
    }

    function processVendorSpokenTranscript(transcript) {
      const matchedKeys = detectItemsFromSpeechOrText(transcript);
      const priceMatch = transcript.match(/\d+/);

      if (matchedKeys.length > 0) {
        const key = matchedKeys[0];
        const meta = ITEM_KEYWORD_MAP.find(m => m.key === key);
        const price = priceMatch ? parseInt(priceMatch[0], 10) : (meta ? meta.defaultPrice : 100);
        const unit = meta ? meta.defaultUnit : '1 Piece';
        const label = meta ? meta.label + ' (' + transcript + ')' : transcript;
        simulateVendorVoicePhrase(transcript, label, price, unit, key);
      } else {
        // Brand-new custom item spoken by Vendor! Never force tomato!
        const price = priceMatch ? parseInt(priceMatch[0], 10) : 120;
        const cleanName = transcript.replace(/\d+/g, '').replace(/rupees|rs|రూపాయలు|रुपये/gi, '').trim() || transcript;
        const customImg = createDynamicSvgForCustomItem(cleanName);
        state.pendingVendorItem = {
          spokenPhrase: transcript,
          name: cleanName,
          regionalName: transcript,
          price: price,
          unit: '1 Piece',
          key: 'custom_' + Date.now(),
          category: 'artisan',
          image: customImg
        };
        openVendorConfirmModal();
      }
    }

    
    const VENDOR_VOICE_PRESETS = {
      woodtoys: { phrase: 'ఏటికొప్పాక బొమ్మలు 250 రూపాయలు సెట్', name: 'Etikoppaka Wooden Toys - ఏటికొప్పాక బొమ్మలు', price: 250, unit: '1 Craft Set', icon: 'woodtoys', category: 'artisan' },
      terracotta: { phrase: 'मिट्टी का मटका और दीये 180 रुपये', name: 'Terracotta Clay Pot & Diyas - మట్టి కుండ', price: 180, unit: '1 Set', icon: 'terracotta', category: 'artisan' },
      craftkit: { phrase: 'పట్టు దారాలు మరియు పూసల బాక్స్ 150 రూపాయలు', name: 'Silk Zari Threads & Beads Kit - క్రాఫ్ట్ సెట్', price: 150, unit: '1 Full Box', icon: 'craftkit', category: 'materials' },
      kalamkari: { phrase: 'கலம்காரி கைத்தறி துணி 420 ரூபாய்', name: 'Kalamkari Handloom Fabric - కలంకారీ వస్త్రం', price: 420, unit: '2 Meters', icon: 'kalamkari', category: 'materials' },
      onion: { phrase: 'ఉల్లిపాయలు 35 రూపాయలు కిలో', name: 'Red Onions & Potatoes - ఉల్లిపాయలు', price: 35, unit: '1 kg', icon: 'onion', category: 'grocery' },
      potato: { phrase: 'आलू 30 रुपये किलो', name: 'Fresh Potatoes - ఆలుగడ్డ / आलू', price: 30, unit: '1 kg', icon: 'potato', category: 'grocery' },
      banana: { phrase: 'అరటిపండ్లు 50 రూపాయలు డజను', name: 'Ripe Bananas & Eggs - అరటిపండ్లు', price: 50, unit: '1 Dozen', icon: 'banana', category: 'grocery' },
      egg: { phrase: 'நாட்டு முட்டை 72 ரூபாய்', name: 'Farm Eggs - కోడి గుడ్లు / अंडे', price: 72, unit: '12 Eggs', icon: 'egg', category: 'grocery' }
    };

    function setCategoryFilter(cat) {
      state.activeCategory = cat;
      document.querySelectorAll('.cat-filter-btn').forEach(btn => {
        if (btn.getAttribute('data-cat') === cat) {
          btn.className = 'cat-filter-btn bg-indigo-900 text-white font-black px-3.5 py-2 rounded-2xl text-xs sm:text-sm flex items-center gap-1.5 shadow tap-card';
        } else {
          btn.className = 'cat-filter-btn bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3.5 py-2 rounded-2xl text-xs sm:text-sm flex items-center gap-1.5 border border-slate-300 tap-card';
        }
      });
      renderVendorItems();
      renderCustomerCatalog();
    }

    function simulateVendorVoicePreset(key) {
      const p = VENDOR_VOICE_PRESETS[key] || VENDOR_VOICE_PRESETS.banana;
      simulateVendorVoicePhrase(p.phrase, p.name, p.price, p.unit, p.icon);
    }

    function simulateVendorVoicePhrase(spokenPhrase, recognizedName, price, unit, iconKey) {
      const statusEl = document.getElementById('vendorVoiceStatus');
      statusEl.textContent = '🤖 AI Thinking: "' + spokenPhrase + '" → Matching Picture & Price...';
      state.pendingVendorItem = {
        spokenPhrase: spokenPhrase,
        name: recognizedName,
        regionalName: spokenPhrase,
        price: price,
        unit: unit,
        key: iconKey,
        image: ITEM_IMAGES[iconKey] || ITEM_IMAGES.tomato
      };
      openVendorConfirmModal();
    }

    function submitVendorTypedItem() {
      const nameInput = document.getElementById('vendorInputName');
      const priceInput = document.getElementById('vendorInputPrice');
      const unitInput = document.getElementById('vendorInputUnit');
      const rawName = (nameInput.value || '').trim();
      if (!rawName) {
        speakText('Please type an item name or tap a picture icon first.');
        nameInput.focus();
        return;
      }
      const price = Math.max(1, parseInt(priceInput.value, 10) || 100);
      const unit = unitInput.value || '1 Piece';

      // Auto-detect matching image from typed text unless user explicitly clicked a different icon
      const detectedKeys = detectItemsFromSpeechOrText(rawName);
      let iconKey = null;
      let itemImage = null;
      let itemCategory = 'artisan';

      if (detectedKeys.length > 0) {
        iconKey = detectedKeys[0];
        itemImage = ITEM_IMAGES[iconKey];
        const meta = ITEM_KEYWORD_MAP.find(m => m.key === iconKey);
        if (meta) itemCategory = meta.category;
        selectVendorIcon(iconKey);
        userManuallyClickedVendorIcon = false;
      } else if (userManuallyClickedVendorIcon && state.selectedVendorIcon) {
        iconKey = state.selectedVendorIcon;
        itemImage = ITEM_IMAGES[iconKey];
      } else {
        iconKey = 'custom_' + Date.now();
        itemImage = createDynamicSvgForCustomItem(rawName);
      }

      state.pendingVendorItem = {
        spokenPhrase: rawName + ' - ₹' + price + ' / ' + unit,
        name: rawName,
        regionalName: rawName,
        price: price,
        unit: unit,
        key: iconKey,
        category: itemCategory,
        image: itemImage
      };
      userManuallyClickedVendorIcon = false;
      openVendorConfirmModal();
    }

    function updatePendingItemPrice(val) {
      if (!state.pendingVendorItem) return;
      const p = parseInt(val, 10);
      if (!isNaN(p) && p > 0) {
        state.pendingVendorItem.price = p;
      }
    }

    function updatePendingItemUnit(u) {
      if (!state.pendingVendorItem) return;
      state.pendingVendorItem.unit = u;
    }

    function openVendorConfirmModal() {
      const item = state.pendingVendorItem;
      if (!item) return;
      const modal = document.getElementById('modalVendorConfirm');
      const card = document.getElementById('vendorConfirmPreviewCard');
      card.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="img-3d-anim w-36 h-36 object-cover rounded-2xl shadow-lg border-4 border-white mb-3" />
        <div class="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full mb-1">
          🎙️ Voice Input: "${item.spokenPhrase}"
        </div>
        <div class="text-lg font-black text-slate-900 mt-1">${item.name}</div>
        
        <!-- Interactive Price Setting & Voice Recognized Price Confirmation -->
        <div class="bg-amber-50 border-2 border-amber-300 rounded-2xl p-3 my-2 w-full text-left space-y-2">
          <div class="flex items-center justify-between">
            <label for="pendingPriceInput" class="text-xs font-black text-amber-950 uppercase">Set / Confirm Price (₹):</label>
            <span class="text-[10px] bg-amber-400 text-indigo-950 font-black px-2 py-0.5 rounded-full">Voice Recognized</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xl font-black text-emerald-700">₹</span>
            <input id="pendingPriceInput" type="number" min="1" value="${item.price}" oninput="updatePendingItemPrice(this.value)"
              class="flex-1 px-3 py-2 rounded-xl border-2 border-slate-300 font-black text-lg text-emerald-700 focus:border-indigo-600 focus:outline-none" />
            <select onchange="updatePendingItemUnit(this.value)" class="px-2.5 py-2 rounded-xl border-2 border-slate-300 font-bold text-xs bg-white">
              <option value="${item.unit}">${item.unit}</option>
              <option value="1 kg">1 kg</option>
              <option value="1 Piece">1 Piece</option>
              <option value="1 Craft Set">1 Craft Set</option>
              <option value="1 Liter">1 Liter</option>
              <option value="1 Dozen">1 Dozen</option>
            </select>
          </div>
        </div>
      `;
      modal.classList.remove('hidden');
      speakVendorPendingItem();
    }

    function speakVendorPendingItem() {
      const item = state.pendingVendorItem;
      if (!item) return;
      speakText('AI understood: ' + item.name + ', price ' + item.price + ' rupees per ' + item.unit + '. Press green OK button to add to your store, or red NO button to cancel.');
    }

    function confirmVendorAddItem(isConfirmed) {
      const modal = document.getElementById('modalVendorConfirm');
      modal.classList.add('hidden');
      if (!isConfirmed || !state.pendingVendorItem) {
        showToast('❌ Cancelled adding item', '❌');
        state.pendingVendorItem = null;
        return;
      }
      const p = state.pendingVendorItem;
      const resolvedImage = p.image || getBestVisualMatch(p.name).image;

      // Always switch category filter to 'all' so the newly added item is immediately visible at the very top!
      setCategoryFilter('all');

      const existingIdx = state.items.findIndex(it => it.name.toLowerCase() === p.name.toLowerCase());
      if (existingIdx !== -1) {
        const existing = state.items.splice(existingIdx, 1)[0];
        existing.price = p.price;
        existing.unit = p.unit;
        existing.inStock = true;
        existing.image = resolvedImage;
        existing.badge = '✨ Updated Just Now';
        state.items.unshift(existing);
      } else {
        state.items.unshift({
          id: 'item_' + Date.now(),
          key: p.key || 'custom_' + Date.now(),
          category: p.category || 'artisan',
          badge: '✨ Newly Added',
          name: p.name,
          regionalName: p.regionalName || p.name,
          price: p.price,
          unit: p.unit,
          inStock: true,
          image: resolvedImage
        });
      }
      document.getElementById('vendorInputName').value = '';
      updateVendorLivePreview();
      state.pendingVendorItem = null;
      speakText(p.name + ' added to your store with picture!');
      renderAll();
    }

    function toggleItemStock(itemId) {
      const item = state.items.find(i => i.id === itemId);
      if (!item) return;
      item.inStock = !item.inStock;
      if (!item.inStock && state.cart[itemId]) {
        delete state.cart[itemId];
      }
      speakText(item.name + (item.inStock ? ' is now IN STOCK' : ' is now OUT OF STOCK'));
      renderAll();
    }

    // 9. VENDOR PAYOUT SCHEDULE (DAILY / WEEKLY / MONTHLY FOR COD ONLY)
    function setVendorPayout(cycle) {
      state.vendorPayoutCycle = cycle;
      ['Daily', 'Weekly', 'Monthly'].forEach(c => {
        const btn = document.getElementById('payoutBtn' + c);
        if (!btn) return;
        if (c === cycle) {
          btn.className = 'py-2 px-1 rounded-xl border-2 border-emerald-600 bg-emerald-50 text-emerald-950 font-black text-xs flex flex-col items-center tap-card';
        } else {
          btn.className = 'py-2 px-1 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-700 font-bold text-xs flex flex-col items-center tap-card';
        }
      });
      document.getElementById('vendorPayoutCycleLabel').textContent = cycle + ' Payout (COD)';
      const modalCycle = document.getElementById('walletModalCodCycle');
      if (modalCycle) modalCycle.textContent = cycle;
      speakText('Cash on Delivery payout set to ' + cycle + '. Online payments are credited to your wallet immediately.');
    }

    function settleVendorCodPayoutNow() {
      if (state.vendorPendingCod <= 0) {
        showToast('No pending Cash-on-Delivery balance to settle!', 'ℹ️');
        return;
      }
      const amt = state.vendorPendingCod;
      state.vendorPendingCod = 0;
      state.wallets.vendor += amt;
      state.transactions.unshift({
        id: 'TX-' + Math.floor(100 + Math.random() * 899),
        role: 'vendor',
        type: state.vendorPayoutCycle + ' COD Payout Settlement',
        amount: amt,
        sign: '+',
        time: 'Just Now',
        note: 'Cash-on-Delivery Pool Settled (' + state.vendorPayoutCycle + ' Schedule)'
      });
      speakText('Settled ' + amt + ' rupees of Cash on Delivery orders into your Vendor Wallet!');
      renderAll();
    }

    // 10. CUSTOMER INTERFACE: CART, VOICE SEARCH, CONFIRMATION (OK/NO), 10-MIN TIMER
    function changeCartQty(itemId, delta) {
      const item = state.items.find(i => i.id === itemId);
      if (!item || !item.inStock) {
        speakText('Sorry, this item is currently out of stock.');
        return;
      }

      // If 10-minute timer is active and customer clicks + on an item, offer instant addition to active order!
      const current = state.cart[itemId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        delete state.cart[itemId];
      } else {
        state.cart[itemId] = next;
      }

      if (delta > 0) {
        showToast('Added ' + item.name + ' (₹' + item.price + ') to basket', '🛒');
      }
      renderAll();
    }

    function addForgottenItemToActiveOrder(itemId) {
      const item = state.items.find(i => i.id === itemId);
      if (!item || !item.inStock || !state.activeOrder || state.tenMinSecondsLeft <= 0) return;

      state.activeOrder.total += item.price;
      state.activeOrder.itemsCount += 1;
      state.deliveryOrder.orderAmount += item.price;
      state.deliveryOrder.itemsSummary += ', ' + item.name + ' (' + item.unit + ')';

      if (state.activeOrder.paymentMethod === 'ONLINE') {
        state.wallets.customer = Math.max(0, state.wallets.customer - item.price);
        state.wallets.vendor += item.price;
        state.transactions.unshift({
          id: 'TX-' + Math.floor(100 + Math.random() * 899),
          role: 'vendor',
          type: '10-Min Window Extra Item (Online Instant Credit)',
          amount: item.price,
          sign: '+',
          time: 'Just Now',
          note: 'Added ' + item.name + ' within 10-min window'
        });
      } else {
        state.vendorPendingCod += item.price;
      }

      speakText('Added ' + item.name + ' to your confirmed order inside the 10 minute window!');
      renderAll();
    }

    function filterCustomerCatalog() {
      renderCustomerCatalog();
    }

    function clearCustomerSearch() {
      const inp = document.getElementById('customerSearchInput');
      if (inp) inp.value = '';
      renderCustomerCatalog();
    }

    function addSearchedCustomerItems() {
      const inp = document.getElementById('customerSearchInput');
      const q = (inp ? inp.value : '').trim();
      if (!q) return;
      processCustomerSpokenTranscript(q);
    }

    function processCustomerSpokenTranscript(transcript) {
      // Reset category filter & clear search bar so the full catalog + added item stay visible!
      setCategoryFilter('all');
      const inp = document.getElementById('customerSearchInput');
      if (inp) inp.value = '';

      const matchedKeys = detectItemsFromSpeechOrText(transcript);
      if (matchedKeys.length > 0) {
        // Ensure all matched keys exist in state.items (if any key isn't in state.items yet, add it with its 3D image)
        matchedKeys.forEach(k => {
          const exists = state.items.find(it => it.key === k);
          if (!exists && ITEM_IMAGES[k]) {
            const meta = ITEM_KEYWORD_MAP.find(m => m.key === k);
            state.items.unshift({
              id: 'item_' + k + '_' + Date.now(),
              key: k,
              category: meta ? meta.category : 'artisan',
              badge: '✨ Matched Item',
              name: meta ? meta.label : transcript,
              regionalName: transcript,
              price: meta ? meta.defaultPrice : 120,
              unit: meta ? meta.defaultUnit : '1 Piece',
              inStock: true,
              image: ITEM_IMAGES[k]
            });
          }
        });
        runCustomerVoiceCommand(transcript, matchedKeys);
        return;
      }

      // If the customer asked for an item not yet in the store catalog, dynamically add it with the best matched visual!
      const cleanName = transcript.trim();
      const best = getBestVisualMatch(cleanName);
      const newId = 'item_custom_' + Date.now();
      const newKey = 'custom_' + Date.now();
      const newItem = {
        id: newId,
        key: newKey,
        category: best.category,
        badge: '✨ Added by Request',
        name: cleanName,
        regionalName: cleanName,
        price: best.defaultPrice,
        unit: best.defaultUnit,
        inStock: true,
        image: best.image
      };
      state.items.unshift(newItem);
      runCustomerVoiceCommand(transcript, [newKey]);
    }

    function startCustomerVoiceOrder() {
      // If the user already typed something in the search bar, process that exact item immediately!
      const searchVal = (document.getElementById('customerSearchInput').value || '').trim();
      if (searchVal) {
        processCustomerSpokenTranscript(searchVal);
        return;
      }

      const btn = document.getElementById('btnCustomerVoiceMic');
      btn.classList.add('mic-pulse');
      const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRec) {
        try {
          const rec = new SpeechRec();
          rec.lang = (LANG_DATA[state.language] && LANG_DATA[state.language].speechLang) || 'te-IN';
          let handled = false;
          rec.onresult = function(ev) {
            handled = true;
            btn.classList.remove('mic-pulse');
            const t = ev.results[0][0].transcript;
            processCustomerSpokenTranscript(t);
          };
          rec.onerror = function() {
            if (!handled) {
              handled = true;
              btn.classList.remove('mic-pulse');
              openVoicePromptModal('customer');
            }
          };
          rec.start();
          return;
        } catch (e) {
          btn.classList.remove('mic-pulse');
          openVoicePromptModal('customer');
          return;
        }
      }
      btn.classList.remove('mic-pulse');
      openVoicePromptModal('customer');
    }

    function runCustomerVoiceCommand(phrase, itemKeys) {
      // If itemKeys wasn't passed or we want to also include any items detected in phrase:
      let keysToUse = Array.isArray(itemKeys) && itemKeys.length > 0 ? itemKeys : detectItemsFromSpeechOrText(phrase);
      let addedNames = [];
      keysToUse.forEach(k => {
        const found = state.items.find(it => it.key === k);
        if (found) {
          found.inStock = true;
          state.cart[found.id] = (state.cart[found.id] || 0) + 1;
          addedNames.push(found.name);
        }
      });
      renderAll();
      if (addedNames.length > 0) {
        speakText('Voice order recognized: "' + phrase + '". Added ' + addedNames.join(' and ') + ' to your basket. Please press the green OK button to confirm!');
        openOrderConfirmationModal();
      } else {
        speakText('Could not find matching item for ' + phrase);
      }
    }

    function getCartSummaryData() {
      let subtotal = 0;
      let count = 0;
      let lines = [];
      Object.keys(state.cart).forEach(itemId => {
        const qty = state.cart[itemId];
        const item = state.items.find(i => i.id === itemId);
        if (item && item.inStock && qty > 0) {
          const lineTotal = item.price * qty;
          subtotal += lineTotal;
          count += qty;
          lines.push({ item, qty, lineTotal });
        }
      });
      const deliveryFee = count > 0 ? 35 : 0;
      return { subtotal, deliveryFee, total: subtotal + deliveryFee, count, lines };
    }

    function selectPaymentMethod(method) {
      state.selectedPaymentMethod = method;
      const btnCod = document.getElementById('payBtnCOD');
      const btnOnline = document.getElementById('payBtnOnline');
      if (method === 'COD') {
        btnCod.className = 'p-3 rounded-2xl border-4 border-emerald-600 bg-emerald-50 text-slate-900 flex flex-col items-center gap-1 tap-card';
        btnOnline.className = 'p-3 rounded-2xl border-4 border-slate-200 bg-white text-slate-900 flex flex-col items-center gap-1 tap-card';
        speakText('Selected Cash on Delivery.');
      } else {
        btnOnline.className = 'p-3 rounded-2xl border-4 border-emerald-600 bg-emerald-50 text-slate-900 flex flex-col items-center gap-1 tap-card';
        btnCod.className = 'p-3 rounded-2xl border-4 border-slate-200 bg-white text-slate-900 flex flex-col items-center gap-1 tap-card';
        speakText('Selected Online Payment. Money goes straight to the shopkeeper account.');
      }
    }

    function openOrderConfirmationModal() {
      const summary = getCartSummaryData();
      if (summary.count === 0) {
        speakText('Your basket is empty! Please tap an item picture or speak your order first.');
        return;
      }

      const listEl = document.getElementById('customerConfirmItemsList');
      listEl.innerHTML = summary.lines.map(line => `
        <div class="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200">
          <div class="flex items-center gap-2.5">
            <img src="${line.item.image}" alt="${line.item.name}" class="w-12 h-12 rounded-xl object-cover border border-slate-200" />
            <div>
              <div class="text-sm font-black text-slate-900">${line.item.name}</div>
              <div class="text-xs font-bold text-slate-500">${line.qty} × ₹${line.item.price} (${line.item.unit})</div>
            </div>
          </div>
          <div class="text-base font-black text-emerald-700">₹${line.lineTotal}</div>
        </div>
      `).join('');

      document.getElementById('customerConfirmTotalAmount').textContent = '₹' + summary.total;
      document.getElementById('modalCustomerConfirm').classList.remove('hidden');
      speakCustomerOrderSummary();
    }

    function speakCustomerOrderSummary() {
      const summary = getCartSummaryData();
      speakText('You have ' + summary.count + ' items in your basket. Total amount is ' + summary.total + ' rupees. Press the green OK button to place order, or red NO button to cancel.');
    }

    function confirmCustomerOrder(isOk, simulatePaymentFailure) {
      const modal = document.getElementById('modalCustomerConfirm');
      modal.classList.add('hidden');
      if (!isOk) {
        speakText('Order cancelled. You can change items in your basket.');
        return;
      }

      const summary = getCartSummaryData();
      if (summary.count === 0) return;

      // Spec #4: If payment fails, 30% of the amount is paid to the vendor!
      if (simulatePaymentFailure) {
        triggerDoorstepCancelOrFail('payment_failed', summary.total);
        return;
      }

      const orderId = 'ORD-' + Math.floor(8050 + Math.random() * 900);
      const itemsText = summary.lines.map(l => l.item.name + ' (×' + l.qty + ')').join(', ');

      // Spec #3: Online payment goes directly to Vendor's account; COD goes to Vendor's COD Payout Pool (Daily/Weekly/Monthly)
      if (state.selectedPaymentMethod === 'ONLINE') {
        state.wallets.customer = Math.max(0, state.wallets.customer - summary.total);
        state.wallets.vendor += summary.subtotal;
        state.transactions.unshift({
          id: 'TX-' + Math.floor(100 + Math.random() * 899),
          role: 'vendor',
          type: 'Online Payment Instant Credit',
          amount: summary.subtotal,
          sign: '+',
          time: 'Just Now',
          note: 'Order #' + orderId + ' (' + itemsText + ')'
        });
        state.transactions.unshift({
          id: 'TX-' + Math.floor(100 + Math.random() * 899),
          role: 'customer',
          type: 'Online Order Paid',
          amount: summary.total,
          sign: '-',
          time: 'Just Now',
          note: 'Order #' + orderId + ' via Online UPI'
        });
      } else {
        state.vendorPendingCod += summary.subtotal;
        state.transactions.unshift({
          id: 'TX-' + Math.floor(100 + Math.random() * 899),
          role: 'customer',
          type: 'COD Order Placed (' + state.vendorPayoutCycle + ' Vendor Payout)',
          amount: summary.total,
          sign: '-',
          time: 'Just Now',
          note: 'Order #' + orderId + ' (Cash on Delivery)'
        });
      }

      // Create Active Order & Start 10-Minute Forgotten Items Timer
      state.activeOrder = {
        id: orderId,
        total: summary.total,
        subtotal: summary.subtotal,
        itemsCount: summary.count,
        paymentMethod: state.selectedPaymentMethod,
        itemsText: itemsText
      };

      const generatedOtp = String(Math.floor(1000 + Math.random() * 9000));
      // Populate Delivery Partner Notification with 4-digit Customer Verification OTP
      state.deliveryOrder = {
        id: orderId,
        otp: generatedOtp,
        otpVerified: false,
        vendorName: 'Sri Lakshmi Kirana Store',
        vendorLocation: 'Shop #12, Madhuravada Main Road (1.1 km away)',
        customerName: 'Padma Amma',
        customerLocation: 'House #42, Midhilapuri Colony, Near Water Tank (2.3 km)',
        estimatedTime: '18 Mins',
        commission: 40,
        orderAmount: summary.total,
        paymentType: state.selectedPaymentMethod,
        itemsSummary: itemsText,
        status: 'PENDING_ACCEPT'
      };

      // Automatically generate official GST Bill / Invoice for this order
      generateInvoiceFromOrder(summary);

      // Clear cart and start 10-minute (600 seconds) timer
      state.cart = {};
      startTenMinuteOrderTimer();

      speakText('Order confirmed! You now have a 10 minute timer to add any forgotten items. You can also chat or call the delivery partner and listen to messages using the speaker button.');
      renderAll();
    }

    function startTenMinuteOrderTimer() {
      if (state.tenMinIntervalId) clearInterval(state.tenMinIntervalId);
      state.tenMinSecondsLeft = 600; // 10 minutes = 600 seconds
      const banner = document.getElementById('customerTenMinBanner');
      if (banner) banner.classList.remove('hidden');
      updateTenMinTimerUI();

      state.tenMinIntervalId = setInterval(function() {
        if (state.tenMinSecondsLeft > 0) {
          state.tenMinSecondsLeft -= 1;
          updateTenMinTimerUI();
        } else {
          clearInterval(state.tenMinIntervalId);
          state.tenMinIntervalId = null;
        }
      }, 1000);
    }

    function updateTenMinTimerUI() {
      const mins = Math.floor(state.tenMinSecondsLeft / 60);
      const secs = state.tenMinSecondsLeft % 60;
      const formatted = String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
      const d1 = document.getElementById('tenMinTimerDisplay');
      const d2 = document.getElementById('tenMinTimerInline');
      if (d1) d1.textContent = formatted;
      if (d2) d2.textContent = formatted;
    }

    // 11. SPEC #4: 30% COMPENSATION TO VENDOR ON PAYMENT FAILURE OR DOORSTEP CANCELLATION
    function triggerDoorstepCancelOrFail(reasonType, customBaseAmount) {
      const baseAmount = customBaseAmount || (state.activeOrder ? state.activeOrder.total : state.deliveryOrder.orderAmount) || 200;
      const vendorComp = Math.round(baseAmount * 0.30);

      state.wallets.vendor += vendorComp;
      state.wallets.customer = Math.max(0, state.wallets.customer - vendorComp);

      const label = reasonType === 'payment_failed'
        ? '30% Compensation (Payment Failed)'
        : '30% Compensation (Customer Cancelled at Doorstep)';

      state.transactions.unshift({
        id: 'TX-' + Math.floor(100 + Math.random() * 899),
        role: 'vendor',
        type: label,
        amount: vendorComp,
        sign: '+',
        time: 'Just Now',
        note: '30% of ₹' + baseAmount + ' Order Value credited to Vendor Wallet'
      });

      state.transactions.unshift({
        id: 'TX-' + Math.floor(100 + Math.random() * 899),
        role: 'customer',
        type: reasonType === 'payment_failed' ? 'Failed Payment 30% Vendor Fee' : 'Doorstep Cancel 30% Fee',
        amount: vendorComp,
        sign: '-',
        time: 'Just Now',
        note: 'Paid ₹' + vendorComp + ' (30% of ₹' + baseAmount + ') to Vendor'
      });

      if (state.deliveryOrder) {
        state.deliveryOrder.status = 'CANCELLED_30';
      }
      if (state.tenMinIntervalId) {
        clearInterval(state.tenMinIntervalId);
        state.tenMinIntervalId = null;
      }
      const banner = document.getElementById('customerTenMinBanner');
      if (banner) banner.classList.add('hidden');

      speakText('Attention! Because of ' + (reasonType === 'payment_failed' ? 'payment failure' : 'cancellation at the doorstep') + ', 30 percent of the order amount, which is ' + vendorComp + ' rupees, has been credited to the Shopkeeper Vendor wallet.');
      renderAll();
    }

    // 12. CUSTOMER <-> DELIVERY CHAT & SPEAKER ("LISTEN" 🔊)
    function openCustomerChatModal() {
      document.getElementById('modalCustomerChat').classList.remove('hidden');
      renderChatMessages();
    }

    function closeCustomerChatModal() {
      document.getElementById('modalCustomerChat').classList.add('hidden');
    }

    function sendCustomerChatMessage(msgText) {
      if (!msgText) return;
      state.chatMessages.push({
        sender: 'customer',
        senderName: 'You (Customer) 🛒',
        text: msgText,
        regionalVoice: msgText,
        time: 'Just Now'
      });
      renderChatMessages();

      // Automatic helpful reply from Delivery Partner with Speaker button
      setTimeout(function() {
        const reply = 'OK Amma! I heard your message. I am reaching your doorstep in 5 minutes with your groceries! 🛵';
        state.chatMessages.push({
          sender: 'delivery',
          senderName: 'Delivery Partner Raju 🛵',
          text: reply,
          regionalVoice: 'సరే అమ్మ! నేను 5 నిమిషాల్లో మీ ఇంటి వద్దకు చేరుకుంటున్నాను. ' + reply,
          time: 'Just Now'
        });
        renderChatMessages();
      }, 700);
    }

    function sendCustomerTypedChat() {
      const inp = document.getElementById('customerChatInput');
      const val = (inp.value || '').trim();
      if (!val) return;
      inp.value = '';
      sendCustomerChatMessage(val);
    }

    function sendDeliveryMessage(msgText) {
      if (!msgText) return;
      state.chatMessages.push({
        sender: 'delivery',
        senderName: state.vendorIsDeliveryPartner ? 'Shopkeeper Self-Delivery 🏪🛵' : 'Delivery Partner Raju 🛵',
        text: msgText,
        regionalVoice: msgText,
        time: 'Just Now'
      });
      showToast('💬 Sent to Customer (with 🔊 Listen button)', '🛵');
      renderChatMessages();
    }

    function sendDeliveryCustomMessage() {
      const inp = document.getElementById('deliveryChatInput');
      const val = (inp.value || '').trim();
      if (!val) return;
      inp.value = '';
      sendDeliveryMessage(val);
    }

    function simulatePhoneCall(targetName) {
      speakText('Calling ' + targetName + ' now. Ringing...');
    }

    // 13. DELIVERY PARTNER ORDER NOTIFICATION & WORKFLOW
    function speakDeliveryNotification() {
      const ord = state.deliveryOrder;
      if (!ord) return;
      speakText('Delivery Order ' + ord.id + '. Pickup from ' + ord.vendorName + ' at ' + ord.vendorLocation + '. Deliver to ' + ord.customerName + ' at ' + ord.customerLocation + '. Estimated time ' + ord.estimatedTime + '. Your commission is ' + ord.commission + ' rupees. Press green Accept or red Decline.');
    }

    function respondDeliveryOrder(isAccepted) {
      const ord = state.deliveryOrder;
      if (!ord) return;
      if (isAccepted) {
        ord.status = 'ACCEPTED';
        speakText('You accepted the order! Proceed to ' + ord.vendorName + ' for pickup.');
      } else {
        ord.status = 'DECLINED';
        speakText('Order declined. Waiting for next nearby order.');
      }
      renderAll();
    }

    function autoFillDeliveryOtp() {
      const inp = document.getElementById('deliveryOtpInput');
      if (inp && state.deliveryOrder) {
        inp.value = state.deliveryOrder.otp || '4829';
        showToast('🔐 OTP ' + inp.value + ' entered!', '🔐');
      }
    }

    function completeDeliveryOrder() {
      const ord = state.deliveryOrder;
      if (!ord) return;
      const otpInput = document.getElementById('deliveryOtpInput');
      const enteredOtp = otpInput ? (otpInput.value || '').trim() : (ord.otp || '4829');
      const expectedOtp = String(ord.otp || '4829');
      if (enteredOtp !== expectedOtp) {
        speakText('ఓటిపి తప్పుగా ఉంది! కస్టమర్ ఓటిపి ' + expectedOtp + ' నమోదు చేయండి.');
        showToast('❌ Invalid OTP! Customer OTP is ' + expectedOtp, '❌');
        return;
      }
      ord.otpVerified = true;
      ord.status = 'DELIVERED';
      state.deliveryCompletedToday += 1;

      if (state.vendorIsDeliveryPartner) {
        // Vendor is acting as Delivery Partner too! Commission goes to Vendor Wallet
        state.wallets.vendor += ord.commission;
        state.transactions.unshift({
          id: 'TX-' + Math.floor(100 + Math.random() * 899),
          role: 'vendor',
          type: 'Self-Delivery Commission Earned (🏪➡️🛵)',
          amount: ord.commission,
          sign: '+',
          time: 'Just Now',
          note: 'Vendor delivered Order #' + ord.id + ' personally'
        });
        speakText('Order delivered! As Shopkeeper and Delivery Partner, ' + ord.commission + ' rupees commission was added to your Vendor Wallet!');
      } else {
        state.wallets.delivery += ord.commission;
        state.transactions.unshift({
          id: 'TX-' + Math.floor(100 + Math.random() * 899),
          role: 'delivery',
          type: 'Delivery Commission Credited',
          amount: ord.commission,
          sign: '+',
          time: 'Just Now',
          note: 'Order #' + ord.id + ' delivered on time'
        });
        speakText('Order delivered! ' + ord.commission + ' rupees commission added to your Delivery Partner Wallet!');
      }
      renderAll();
    }

    function resetSampleDeliveryOrder() {
      state.deliveryOrder = {
        id: 'ORD-' + Math.floor(8100 + Math.random() * 800),
        otp: String(Math.floor(1000 + Math.random() * 9000)),
        otpVerified: false,
        vendorName: 'Sri Lakshmi Kirana Store',
        vendorLocation: 'Shop #12, Madhuravada Main Road (1.1 km away)',
        customerName: 'Ramesh Babu',
        customerLocation: 'Flat 204, Sai Priya Residency, Madhuravada (1.9 km)',
        estimatedTime: '15 Mins',
        commission: 45,
        orderAmount: 230,
        paymentType: 'COD',
        itemsSummary: 'Sona Masoori Rice (1 kg), Sunflower Oil (1 L), Red Onions (1 kg)',
        status: 'PENDING_ACCEPT'
      };
      speakDeliveryNotification();
      renderAll();
    }

    // 14. WALLETS & STATEMENTS MODALS
    function openWalletModal() {
      document.getElementById('modalWallets').classList.remove('hidden');
      renderWalletsUI();
    }

    function closeWalletModal() {
      document.getElementById('modalWallets').classList.add('hidden');
    }

    function speakWalletBalance(role) {
      const bal = state.wallets[role] || 0;
      const names = { vendor: 'Shopkeeper Vendor', customer: 'Customer', delivery: 'Delivery Partner' };
      speakText(names[role] + ' wallet balance is ' + bal + ' rupees.');
    }

    function addSampleFunds(role, amount) {
      state.wallets[role] += amount;
      state.transactions.unshift({
        id: 'TX-' + Math.floor(100 + Math.random() * 899),
        role: role,
        type: 'Wallet Top-Up / Deposit',
        amount: amount,
        sign: '+',
        time: 'Just Now',
        note: 'Direct Wallet Credit'
      });
      speakWalletBalance(role);
      renderAll();
    }

    let currentStatementRole = 'vendor';
    function openStatementModal() {
      currentStatementRole = state.currentRole || 'vendor';
      document.getElementById('modalStatements').classList.remove('hidden');
      renderStatementForRole(currentStatementRole);
    }

    function closeStatementModal() {
      document.getElementById('modalStatements').classList.add('hidden');
    }

    function renderStatementForRole(role) {
      currentStatementRole = role;
      ['vendor', 'customer', 'delivery'].forEach(r => {
        const tab = document.getElementById('stmtTab' + r.charAt(0).toUpperCase() + r.slice(1));
        if (!tab) return;
        if (r === role) {
          tab.className = 'py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm bg-indigo-900 text-white flex items-center justify-center gap-1.5 shadow';
        } else {
          tab.className = 'py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm bg-slate-100 text-slate-800 flex items-center justify-center gap-1.5';
        }
      });

      const roleTx = state.transactions.filter(t => t.role === role);
      const roleLabels = {
        vendor: '🏪 Shopkeeper (Vendor) Day Statement',
        customer: '🛒 Customer Day Statement',
        delivery: '🛵 Delivery Partner Day Statement'
      };

      const box = document.getElementById('statementSummaryBox');
      box.innerHTML = `
        <div class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
          <div>
            <div class="text-base font-black text-slate-900">${roleLabels[role]}</div>
            <div class="text-xs text-slate-500 font-bold">Date: Today • Vocal Local Verified Statement</div>
          </div>
          <div class="bg-emerald-100 text-emerald-950 font-black px-3.5 py-1.5 rounded-xl text-sm">
            Closing Wallet Balance: ₹${state.wallets[role]}
          </div>
        </div>
        <div class="space-y-2 max-h-56 overflow-y-auto custom-scroll">
          ${roleTx.map(t => `
            <div class="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
              <div>
                <div class="text-xs font-black text-slate-900">${t.type} <span class="text-slate-400">(${t.id})</span></div>
                <div class="text-[11px] text-slate-500 font-semibold">${t.note} • ${t.time}</div>
              </div>
              <div class="text-sm font-black ${t.sign === '+' ? 'text-emerald-700' : 'text-rose-600'}">
                ${t.sign}₹${t.amount}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    function speakStatementSummary() {
      const role = currentStatementRole;
      const roleTx = state.transactions.filter(t => t.role === role);
      speakText('Today statement for ' + role + '. Closing wallet balance is ' + state.wallets[role] + ' rupees, with ' + roleTx.length + ' recorded transactions. Click Download Statement to save your copy.');
    }

    function downloadDayStatement(format) {
      const role = currentStatementRole;
      const roleTx = state.transactions.filter(t => t.role === role);
      let content = '';
      let mime = 'text/plain;charset=utf-8';
      let ext = 'txt';

      if (format === 'csv') {
        mime = 'text/csv;charset=utf-8';
        ext = 'csv';
        content = 'Transaction_ID,Role,Type,Sign,Amount_INR,Time,Details\n';
        roleTx.forEach(t => {
          content += `"${t.id}","${t.role}","${t.type}","${t.sign}","${t.amount}","${t.time}","${t.note}"\n`;
        });
        content += `\n"CLOSING_BALANCE","${role}","Wallet Balance","","${state.wallets[role]}","End of Day","COD Cycle: ${state.vendorPayoutCycle}"\n`;
      } else {
        content = `====================================================\n`;
        content += `   VOCAL LOCAL (🎙️) - END OF DAY STATEMENT\n`;
        content += `   Role: ${role.toUpperCase()}\n`;
        content += `   Closing Wallet Balance: INR ${state.wallets[role]}\n`;
        content += `   Vendor COD Payout Schedule: ${state.vendorPayoutCycle}\n`;
        content += `====================================================\n\n`;
        roleTx.forEach(t => {
          content += `[${t.time}] ${t.id} | ${t.type}: ${t.sign}INR ${t.amount} (${t.note})\n`;
        });
      }

      const blob = new Blob([content], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vocal_local_${role}_day_statement.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('📥 Downloaded ' + role.toUpperCase() + ' Day Statement (.' + ext.toUpperCase() + ')', '📥');
    }

    // 15. AI VOICE & TEXT CHATBOT
    function toggleChatbot() {
      const panel = document.getElementById('chatbotPanel');
      panel.classList.toggle('hidden');
      renderChatbotMessages();
    }

    function askBotQuestion(question) {
      state.botMessages.push({ sender: 'user', text: question });
      const q = question.toLowerCase();
      let reply = '';

      if (q.includes('30%') || q.includes('cancel') || q.includes('fail')) {
        reply = '🛡️ 30% Vendor Protection Rule: If a customer cancels an order at the doorstep or if payment fails, 30% of the total order amount is automatically credited to the Shopkeeper Vendor wallet!';
      } else if (q.includes('payout') || q.includes('cod') || q.includes('daily') || q.includes('weekly')) {
        reply = '💰 Vendor Payouts: For Cash-on-Delivery (COD), the Vendor can choose Daily, Weekly, or Monthly payouts. For Online Payments, the money is added to the Vendor wallet immediately!';
      } else if (q.includes('delivery') || q.includes('self')) {
        reply = '🏪➡️🛵 Vendor as Delivery Partner: A shopkeeper can turn ON "Vendor = Delivery Partner" at the top to deliver orders personally and earn the delivery commission!';
      } else if (q.includes('10') || q.includes('timer') || q.includes('forgot')) {
        reply = '⏱️ 10-Minute Forgotten Items Timer: Right after confirming an order with the green OK button, customers get a 10-minute countdown timer to add any forgotten items to the same order!';
      } else {
        reply = '🎙️ Vocal Local helps Shopkeepers, Customers, and Delivery Partners use pictures and voice in their mother tongue! Every screen has a 🔊 Listen speaker button and separate wallets + downloadable day statements.';
      }

      state.botMessages.push({ sender: 'bot', text: reply });
      renderChatbotMessages();
      speakText(reply);
    }

    function sendBotUserText() {
      const inp = document.getElementById('chatbotInput');
      const val = (inp.value || '').trim();
      if (!val) return;
      inp.value = '';
      askBotQuestion(val);
    }

    function startBotVoiceQuestion() {
      askBotQuestion('How does 30% doorstep cancel and COD payout work?');
    }

    // 16. RENDER FUNCTIONS FOR ALL 3 INTERFACES
    function renderVendorItems() {
      const grid = document.getElementById('vendorItemsGrid');
      if (!grid) return;

      const inStockCount = state.items.filter(i => i.inStock).length;
      const counter = document.getElementById('vendorStockCounter');
      if (counter) counter.textContent = `${inStockCount} / ${state.items.length} In Stock`;

      const visibleItems = state.items.filter(it => {
        if (!state.activeCategory || state.activeCategory === 'all') return true;
        return (it.category || 'artisan') === state.activeCategory;
      });

      grid.innerHTML = visibleItems.map(item => `
        <div class="rounded-3xl border-4 ${item.inStock ? 'border-emerald-400 bg-white' : 'border-rose-300 bg-rose-50/50'} p-3.5 shadow-md flex flex-col justify-between">
          <div>
            <div class="relative overflow-hidden rounded-2xl bg-slate-900/5">
              <img src="${item.image}" alt="${item.name}" class="img-3d-anim w-full h-44 object-cover rounded-2xl border border-slate-200 ${item.inStock ? '' : 'grayscale opacity-70'}" />
              <span class="absolute top-2 left-2 bg-indigo-950/85 text-amber-300 font-black px-2.5 py-0.5 rounded-full text-[10px] shadow">
                ${item.badge || '✨ 3D Artisan'}
              </span>
              <button type="button" onclick="speakText('${item.name.replace(/'/g, '')}, ${item.price} rupees per ${item.unit}, ${item.inStock ? 'In Stock' : 'Out of Stock'}')"
                class="absolute top-2 right-2 bg-white/95 hover:bg-white text-slate-900 font-black px-2.5 py-1 rounded-full text-xs shadow">
                🔊
              </button>
              <span class="absolute bottom-2 left-2 px-2.5 py-1 rounded-full text-xs font-black ${item.inStock ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}">
                ${item.inStock ? '✅ IN STOCK' : '❌ OUT OF STOCK'}
              </span>
            </div>
            <div class="mt-3 space-y-1">
              <div class="text-base font-black text-slate-900 leading-snug">${item.name}</div>
              <div class="text-xs font-bold text-indigo-700 truncate">${item.regionalName}</div>
              <div class="flex items-center justify-between pt-1">
                <span class="text-xl font-black text-emerald-700">₹${item.price}</span>
                <span class="text-xs font-bold text-slate-500">per ${item.unit}</span>
              </div>
            </div>
          </div>

          <!-- Vendor Full Control Box: Stock Toggle, Quantity Increase/Decrease & Delete Item -->
          <div class="mt-3 space-y-2 pt-2 border-t border-slate-200">
            <!-- Stock Toggle Button -->
            <button type="button" onclick="toggleItemStock('${item.id}')"
              class="w-full py-2 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow tap-card ${item.inStock ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-rose-600 hover:bg-rose-500 text-white'}">
              <span>${item.inStock ? '✅ IN STOCK (Active)' : '❌ OUT OF STOCK'}</span>
            </button>

            <!-- Quantity Controls (Increase / Decrease Stock Quantity) -->
            <div class="flex items-center justify-between bg-slate-100 rounded-xl p-1.5 border border-slate-200 text-xs">
              <span class="font-extrabold text-slate-600 uppercase text-[10px]">Stock Qty:</span>
              <div class="flex items-center gap-1.5">
                <button type="button" onclick="changeVendorItemQty('${item.id}', -5)" class="w-7 h-7 rounded-lg bg-slate-300 hover:bg-slate-400 font-black text-sm flex items-center justify-center tap-card">−</button>
                <span class="font-black text-sm px-1.5 text-slate-900">${item.quantity !== undefined ? item.quantity : 25}</span>
                <button type="button" onclick="changeVendorItemQty('${item.id}', 5)" class="w-7 h-7 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm flex items-center justify-center tap-card">+</button>
              </div>
            </div>

            <!-- Edit Price & Delete Option -->
            <div class="grid grid-cols-2 gap-1.5">
              <button type="button" onclick="promptEditVendorItemPrice('${item.id}')"
                class="py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-950 font-black rounded-lg text-xs border border-indigo-200 tap-card flex items-center justify-center gap-1">
                ✏️ Edit Price
              </button>
              <button type="button" onclick="deleteVendorItem('${item.id}')"
                class="py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-black rounded-lg text-xs border border-rose-200 tap-card flex items-center justify-center gap-1">
                🗑️ Delete Item
              </button>
            </div>
          </div>
        </div>
      `).join('');
    }

    function renderCustomerCatalog() {
      const grid = document.getElementById('customerCatalogGrid');
      if (!grid) return;

      const rawQuery = ((document.getElementById('customerSearchInput') || {}).value || '').trim();
      const query = rawQuery.toLowerCase();
      const detectedKeysFromQuery = query ? detectItemsFromSpeechOrText(query) : [];
      const queryTokens = query.split(/\s+/).filter(t => t.length > 1 && !['kg', 'liter', 'pack', 'set', 'piece', 'and', 'for', 'the'].includes(t));

      let filtered = state.items.filter(it => {
        const catMatch = (!state.activeCategory || state.activeCategory === 'all') || ((it.category || 'artisan') === state.activeCategory);
        if (!query) return catMatch;
        // When searching, search across ALL categories so nothing is hidden!
        const hay = (it.name + ' ' + it.regionalName + ' ' + it.key + ' ' + (it.badge || '')).toLowerCase();
        if (hay.includes(query)) return true;
        if (detectedKeysFromQuery.includes(it.key)) return true;
        if (queryTokens.length > 0 && queryTokens.some(tok => hay.includes(tok))) return true;
        return false;
      });

      const timerActive = state.activeOrder && state.tenMinSecondsLeft > 0;

      // If the user typed a novel item name in the search bar that isn't in state.items yet, show an instant visual card for it with its matched 3D image!
      if (query && filtered.length === 0) {
        const match = getBestVisualMatch(rawQuery);
        grid.innerHTML = `
          <div class="col-span-full bg-indigo-50 border-4 border-indigo-400 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
            <div class="flex items-center gap-4">
              <img src="${match.image}" alt="${rawQuery}" class="img-3d-anim w-28 h-28 object-cover rounded-2xl border-2 border-white shadow-lg" />
              <div>
                <span class="bg-amber-400 text-indigo-950 font-black px-2.5 py-0.5 rounded-full text-xs">✨ AI Matched Item &amp; Picture</span>
                <div class="text-xl font-black text-slate-900 mt-1">${rawQuery}</div>
                <div class="text-sm font-bold text-emerald-700">₹${match.defaultPrice} / ${match.defaultUnit}</div>
              </div>
            </div>
            <button type="button" onclick="processCustomerSpokenTranscript('${rawQuery.replace(/'/g, '')}')"
              class="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-6 py-4 rounded-2xl shadow-lg text-base flex items-center gap-2 tap-card">
              <span>➕</span> <span>Add "${rawQuery}" to Basket</span>
            </button>
          </div>
        `;
        return;
      }

      grid.innerHTML = filtered.map(item => {
        const qty = state.cart[item.id] || 0;
        return `
          <div class="rounded-3xl border-4 ${qty > 0 ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-200 bg-white'} p-3.5 shadow-md flex flex-col justify-between">
            <div>
              <div class="relative overflow-hidden rounded-2xl bg-slate-900/5">
                <img src="${item.image}" alt="${item.name}" class="img-3d-anim w-full h-44 object-cover rounded-2xl border border-slate-200 ${item.inStock ? '' : 'grayscale opacity-60'}" />
                <span class="absolute top-2 left-2 bg-indigo-950/85 text-amber-300 font-black px-2.5 py-0.5 rounded-full text-[10px] shadow">
                  ${item.badge || '✨ 3D Artisan'}
                </span>
                <button type="button" onclick="speakText('${item.name.replace(/'/g, '')}, ${item.price} rupees for ${item.unit}')"
                  class="absolute top-2 right-2 bg-white/95 hover:bg-white text-indigo-950 font-black px-3 py-1 rounded-full text-xs shadow">
                  🔊 Listen
                </button>
                ${!item.inStock ? `<span class="absolute inset-0 bg-slate-950/60 rounded-2xl flex items-center justify-center text-white font-black text-sm">❌ OUT OF STOCK</span>` : ''}
              </div>

              <div class="mt-3">
                <div class="text-base font-black text-slate-900">${item.name}</div>
                <div class="text-xs font-bold text-indigo-700">${item.regionalName}</div>
                <div class="mt-1 flex items-center justify-between">
                  <span class="text-2xl font-black text-emerald-700">₹${item.price}</span>
                  <span class="bg-slate-100 text-slate-700 text-xs font-extrabold px-2.5 py-0.5 rounded-full">${item.unit}</span>
                </div>
              </div>
            </div>

            <div class="mt-3 space-y-1.5">
              ${item.inStock ? `
                <div class="flex items-center justify-between bg-slate-100 rounded-2xl p-1.5 border border-slate-200">
                  <button type="button" onclick="changeCartQty('${item.id}', -1)"
                    class="w-11 h-11 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xl flex items-center justify-center shadow tap-card">−</button>
                  <div class="text-center">
                    <div class="text-base font-black text-slate-900">${qty}</div>
                    <div class="text-[10px] font-bold text-slate-500 uppercase">In Basket</div>
                  </div>
                  <button type="button" onclick="changeCartQty('${item.id}', 1)"
                    class="w-11 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xl flex items-center justify-center shadow tap-card">+</button>
                </div>
                ${timerActive ? `
                  <button type="button" onclick="addForgottenItemToActiveOrder('${item.id}')"
                    class="w-full py-2 bg-amber-400 hover:bg-amber-300 text-indigo-950 font-black rounded-xl text-xs shadow tap-card">
                    ⏱️ ➕ Add to Confirmed Order
                  </button>
                ` : ''}
              ` : `
                <div class="w-full py-2.5 bg-slate-200 text-slate-500 font-black rounded-2xl text-xs text-center">
                  Unavailable Right Now
                </div>
              `}
            </div>
          </div>
        `;
      }).join('');
    }

    function removeCartItemCompletely(itemId) {
      const item = state.items.find(i => i.id === itemId);
      delete state.cart[itemId];
      if (item) {
        speakText(item.name + ' బాస్కెట్ నుండి తీసివేయబడింది.');
      }
      renderAll();
    }

    function clearEntireCart() {
      state.cart = {};
      speakText('మీ బాస్కెట్ ఖాళీ చేయబడింది.');
      renderAll();
    }

    function openDashboardCartModal() {
      renderCustomerCart();
      document.getElementById('modalDashboardCart').classList.remove('hidden');
    }

    function closeDashboardCartModal() {
      document.getElementById('modalDashboardCart').classList.add('hidden');
    }

    function renderCustomerCart() {
      const summary = getCartSummaryData();
      const badge = document.getElementById('customerCartBadge');
      const hdrSummary = document.getElementById('headerCartSummary');
      if (hdrSummary) {
        hdrSummary.textContent = summary.count > 0 ? (summary.count + ' Items • ₹' + summary.total) : '0 Items';
      }
      if (badge) {
        if (summary.count > 0) {
          badge.textContent = summary.count;
          badge.classList.remove('hidden');
        } else {
          badge.classList.add('hidden');
        }
      }

      // Sync OTP displays across Customer UI
      const otpVal = (state.deliveryOrder && state.deliveryOrder.otp) ? state.deliveryOrder.otp : '4829';
      ['customerBannerOtpCode', 'customerCardOtpDisplay', 'cartModalOtpCode'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = otpVal;
      });

      const listEl = document.getElementById('customerCartList');
      const totalEl = document.getElementById('customerCartTotal');
      const modalListEl = document.getElementById('dashboardCartModalList');
      const modalTotalEl = document.getElementById('dashboardCartModalTotal');

      if (totalEl) totalEl.textContent = '₹' + summary.total;
      if (modalTotalEl) modalTotalEl.textContent = '₹' + summary.total;

      if (summary.lines.length === 0) {
        if (listEl) listEl.innerHTML = `<div class="text-xs text-emerald-200/80 py-3 text-center">బాస్కెట్ ఖాళీగా ఉంది • Tap + on any picture below!</div>`;
        if (modalListEl) modalListEl.innerHTML = `<div class="text-sm font-bold text-slate-400 py-8 text-center">🛒 మీ బాస్కెట్ ఖాళీగా ఉంది (Your cart is empty). Tap any item picture to add!</div>`;
        return;
      }

      if (listEl) {
        listEl.innerHTML = summary.lines.map(l => `
          <div class="flex items-center justify-between bg-white/15 rounded-xl p-2 text-xs border border-white/15 gap-2">
            <img src="${l.item.image}" alt="${l.item.name}" class="w-9 h-9 rounded-lg object-cover shrink-0 border border-white/40" />
            <div class="flex-1 min-w-0">
              <div class="font-black text-white truncate">${l.item.name}</div>
              <div class="text-[10px] text-amber-300 font-bold">₹${l.item.price} × ${l.qty} = ₹${l.lineTotal}</div>
            </div>
            <div class="flex items-center gap-1 shrink-0">
              <button type="button" onclick="changeCartQty('${l.item.id}', -1)" title="Decrease Quantity"
                class="w-6 h-6 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-black flex items-center justify-center">−</button>
              <span class="font-black text-xs px-1">${l.qty}</span>
              <button type="button" onclick="changeCartQty('${l.item.id}', 1)" title="Increase Quantity"
                class="w-6 h-6 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black flex items-center justify-center">+</button>
              <button type="button" onclick="removeCartItemCompletely('${l.item.id}')" title="Remove Item from Cart"
                class="w-6 h-6 rounded-lg bg-white/20 hover:bg-rose-600 text-white text-xs flex items-center justify-center ml-0.5">🗑️</button>
            </div>
          </div>
        `).join('');
      }

      if (modalListEl) {
        modalListEl.innerHTML = summary.lines.map(l => `
          <div class="flex items-center justify-between bg-slate-50 rounded-2xl p-3 border-2 border-slate-200 gap-3">
            <img src="${l.item.image}" alt="${l.item.name}" class="w-14 h-14 rounded-xl object-cover border border-slate-300 shrink-0" />
            <div class="flex-1 min-w-0">
              <div class="text-sm font-black text-slate-900 truncate">${l.item.name}</div>
              <div class="text-xs font-bold text-indigo-700 truncate">${l.item.regionalName || ''}</div>
              <div class="text-xs font-black text-emerald-700 mt-0.5">₹${l.item.price} × ${l.qty} = ₹${l.lineTotal}</div>
            </div>
            <div class="flex items-center gap-1.5 shrink-0">
              <button type="button" onclick="changeCartQty('${l.item.id}', -1)"
                class="w-9 h-9 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black text-lg flex items-center justify-center tap-card">−</button>
              <span class="font-black text-base px-1.5 text-slate-900">${l.qty}</span>
              <button type="button" onclick="changeCartQty('${l.item.id}', 1)"
                class="w-9 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg flex items-center justify-center tap-card">+</button>
              <button type="button" onclick="removeCartItemCompletely('${l.item.id}')"
                class="w-9 h-9 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 font-black text-sm flex items-center justify-center tap-card" title="Delete from Cart">🗑️</button>
            </div>
          </div>
        `).join('');
      }
    }

    function renderDeliveryView() {
      const container = document.getElementById('deliveryOrderCardContainer');
      const badge = document.getElementById('deliveryAlertBadge');
      const ord = state.deliveryOrder;
      if (!container || !ord) return;

      if (badge) {
        badge.textContent = ord.status === 'PENDING_ACCEPT' ? '1' : '0';
      }

      document.getElementById('deliveryViewWalletBalance').textContent = '₹' + state.wallets.delivery;
      document.getElementById('deliveryCompletedCount').textContent = state.deliveryCompletedToday + ' Orders';

      container.innerHTML = `
        <div class="space-y-4">
          <!-- Order ID & Payment Badge -->
          <div class="flex flex-wrap items-center justify-between gap-2 bg-slate-100 p-3 rounded-2xl">
            <div class="font-black text-sm text-slate-900">Order #${ord.id} • ${ord.itemsSummary}</div>
            <span class="bg-indigo-900 text-amber-300 font-black text-xs px-3 py-1 rounded-full">
              Bill: ₹${ord.orderAmount} (${ord.paymentType})
            </span>
          </div>

          <!-- Delivery Partner Verified Security Credentials (DL, Aadhaar, PAN) for Trust -->
          <div class="bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border-2 border-emerald-400 rounded-2xl p-4 shadow-sm">
            <div class="flex items-center justify-between mb-2 pb-2 border-b border-emerald-200">
              <div class="flex items-center gap-2">
                <span class="text-2xl">🪪🛡️</span>
                <div>
                  <h4 class="text-sm font-black text-slate-900">Verified Security &amp; Trust Credentials</h4>
                  <p class="text-[11px] text-emerald-800 font-bold">Government ID &amp; Driving Licence Verified for Vendor &amp; Customer Trust</p>
                </div>
              </div>
              <span class="bg-emerald-600 text-white text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1">
                ✅ TRUSTED PARTNER
              </span>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <!-- Column 1: Driving Licence -->
              <div class="bg-white p-2.5 rounded-xl border border-emerald-300 shadow-sm">
                <div class="text-[10px] uppercase font-black text-indigo-700 flex items-center gap-1">
                  <span>🚗</span> <span>1. Driving Licence (DL)</span>
                </div>
                <div class="font-black text-slate-900 text-xs mt-0.5" id="dlDisplayNumber">AP-31-2022-0048921</div>
                <div class="text-[10px] text-emerald-700 font-extrabold mt-0.5">Status: Valid (Transport/2W) ✅</div>
              </div>

              <!-- Column 2: Aadhaar Card / National ID -->
              <div class="bg-white p-2.5 rounded-xl border border-emerald-300 shadow-sm">
                <div class="text-[10px] uppercase font-black text-emerald-700 flex items-center gap-1">
                  <span>🪪</span> <span>2. Aadhaar Card (UIDAI)</span>
                </div>
                <div class="font-black text-slate-900 text-xs mt-0.5" id="aadhaarDisplayNumber">XXXX-XXXX-6819</div>
                <div class="text-[10px] text-emerald-700 font-extrabold mt-0.5">Biometric Verified ✅</div>
              </div>

              <!-- Column 3: PAN Card & Police Clearance -->
              <div class="bg-white p-2.5 rounded-xl border border-emerald-300 shadow-sm">
                <div class="text-[10px] uppercase font-black text-amber-700 flex items-center gap-1">
                  <span>💳</span> <span>3. PAN &amp; Police Verification</span>
                </div>
                <div class="font-black text-slate-900 text-xs mt-0.5" id="panDisplayNumber">PAN: BKPPR9412M</div>
                <div class="text-[10px] text-emerald-700 font-extrabold mt-0.5">Police Clearance: Clean ✅</div>
              </div>
            </div>
          </div>

          <!-- 4 Visual Information Cards Required by Spec -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <!-- 1. Vendor's Location -->
            <div class="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-3.5 flex items-start gap-3">
              <span class="text-3xl">🏪</span>
              <div>
                <div class="text-[11px] font-extrabold uppercase text-indigo-700">1. Vendor (Shop) Location</div>
                <div class="text-sm font-black text-slate-900">${ord.vendorName}</div>
                <div class="text-xs font-semibold text-slate-600">${ord.vendorLocation}</div>
              </div>
            </div>

            <!-- 2. Customer's Location -->
            <div class="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-3.5 flex items-start gap-3">
              <span class="text-3xl">🏠</span>
              <div>
                <div class="text-[11px] font-extrabold uppercase text-emerald-800">2. Customer Drop Location</div>
                <div class="text-sm font-black text-slate-900">${ord.customerName}</div>
                <div class="text-xs font-semibold text-slate-600">${ord.customerLocation}</div>
              </div>
            </div>

            <!-- 3. Estimated Time to Delivery -->
            <div class="bg-amber-50 border-2 border-amber-200 rounded-2xl p-3.5 flex items-center gap-3">
              <span class="text-3xl">⏱️</span>
              <div>
                <div class="text-[11px] font-extrabold uppercase text-amber-900">3. Estimated Time to Delivery</div>
                <div class="text-xl font-black text-slate-900">${ord.estimatedTime}</div>
              </div>
            </div>

            <!-- 4. Commission for This Order -->
            <div class="bg-green-100 border-2 border-green-400 rounded-2xl p-3.5 flex items-center gap-3">
              <span class="text-3xl">💰</span>
              <div>
                <div class="text-[11px] font-extrabold uppercase text-green-900">4. Your Order Commission</div>
                <div class="text-2xl font-black text-green-950">₹${ord.commission}</div>
              </div>
            </div>
          </div>

          <!-- Action Buttons Based on Order Status -->
          ${ord.status === 'PENDING_ACCEPT' ? `
            <div class="grid grid-cols-2 gap-4 pt-2">
              <button type="button" onclick="respondDeliveryOrder(true)"
                class="py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-lg text-lg flex flex-col items-center justify-center border-4 border-emerald-300 tap-card">
                <span class="text-3xl">✅</span>
                <span>ACCEPT ORDER</span>
                <span class="text-xs opacity-90">సరే • स्वीकार करें</span>
              </button>
              <button type="button" onclick="respondDeliveryOrder(false)"
                class="py-4 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-2xl shadow-lg text-lg flex flex-col items-center justify-center border-4 border-rose-300 tap-card">
                <span class="text-3xl">❌</span>
                <span>DECLINE ORDER</span>
                <span class="text-xs opacity-90">వద్దు • अस्वीकार</span>
              </button>
            </div>
          ` : ord.status === 'ACCEPTED' ? `
            <div class="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-4 space-y-3 text-center">
              <div class="text-base font-black text-emerald-950">🛵 Order Accepted! Delivering to ${ord.customerName}</div>

              <!-- Customer & Delivery Partner OTP Verification Box -->
              <div class="bg-white border-2 border-indigo-400 rounded-2xl p-3.5 text-left space-y-2 shadow-sm">
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div class="text-xs font-black text-indigo-950 uppercase">🔐 Customer Delivery OTP Verification</div>
                    <div class="text-[11px] font-bold text-slate-600">Ask customer for their 4-digit OTP (${ord.otp || '4829'}) at doorstep:</div>
                  </div>
                  <button type="button" onclick="autoFillDeliveryOtp()"
                    class="bg-amber-400 hover:bg-amber-300 text-indigo-950 font-black px-2.5 py-1 rounded-xl text-xs tap-card">
                    ⚡ Auto-Fill OTP (${ord.otp || '4829'})
                  </button>
                </div>
                <div class="flex items-center gap-2">
                  <input id="deliveryOtpInput" type="text" maxlength="4" value="${ord.otp || '4829'}"
                    placeholder="Enter 4-digit OTP"
                    class="flex-1 px-4 py-2.5 rounded-xl border-2 border-indigo-500 font-black text-xl tracking-widest text-center text-indigo-950 focus:outline-none" />
                  <button type="button" onclick="speakOtpInTelugu()"
                    class="bg-indigo-100 hover:bg-indigo-200 text-indigo-950 font-black px-3 py-2.5 rounded-xl text-xs">
                    🔊 OTP వినండి
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button type="button" onclick="completeDeliveryOrder()"
                  class="py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow text-sm tap-card">
                  ✅ Verify OTP &amp; Claim ₹${ord.commission} Commission
                </button>
                <button type="button" onclick="triggerDoorstepCancelOrFail('doorstep_cancel', ${ord.orderAmount})"
                  class="py-3 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-2xl shadow text-sm tap-card">
                  🚪❌ Customer Cancelled at Doorstep (30% to Vendor)
                </button>
              </div>
            </div>
          ` : `
            <div class="bg-slate-100 rounded-2xl p-4 text-center space-y-2">
              <div class="text-base font-black text-slate-800">
                Status: ${ord.status === 'DELIVERED' ? '✅ Delivered & Commission Paid!' : ord.status === 'CANCELLED_30' ? '⚠️ Cancelled at Doorstep (30% Credited to Vendor Wallet)' : '❌ Order Declined'}
              </div>
              <button type="button" onclick="resetSampleDeliveryOrder()"
                class="bg-indigo-700 hover:bg-indigo-600 text-white font-black px-4 py-2 rounded-xl text-xs tap-card">
                🔔 Simulate Next Incoming Order Notification
              </button>
            </div>
          `}
        </div>
      `;
    }

    function renderChatMessages() {
      const container = document.getElementById('chatMessagesContainer');
      const deliveryContainer = document.getElementById('deliveryChatMessagesContainer');

      const htmlMarkup = state.chatMessages.map((m, idx) => {
        let displayText = m.text;
        if (currentChatLang && currentChatLang !== 'en' && CHAT_TRANSLATIONS[currentChatLang]) {
          displayText = CHAT_TRANSLATIONS[currentChatLang][m.text] || m.regionalVoice || m.text;
        }
        const isCust = m.sender === 'customer';
        return `
          <div class="flex flex-col ${isCust ? 'items-end' : 'items-start'}">
            <div class="max-w-[90%] rounded-2xl p-2.5 border-2 ${isCust ? 'bg-emerald-900 text-white border-emerald-500' : 'bg-amber-50 text-slate-900 border-amber-300'}">
              <div class="flex items-center justify-between gap-2 mb-1">
                <span class="text-[11px] font-black ${isCust ? 'text-amber-300' : 'text-indigo-900'}">
                  ${isCust ? '🟢 Customer Reply: ' : ''}${m.senderName}
                </span>
                <button type="button" onclick="speakChatMessage(${idx})"
                  class="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-2 py-0.5 rounded-full text-[11px] flex items-center gap-1 shadow tap-card">
                  <span>🔊</span> <span>Listen</span>
                </button>
              </div>
              <div class="text-xs sm:text-sm font-bold leading-snug">${displayText}</div>
              ${m.text !== displayText ? `<div class="text-[10px] opacity-75 italic mt-0.5">EN: ${m.text}</div>` : ''}
              <div class="text-[10px] opacity-65 mt-1 text-right">${m.time}</div>
            </div>
          </div>
        `;
      }).join('');

      if (container) {
        container.innerHTML = htmlMarkup;
        container.scrollTop = container.scrollHeight;
      }
      if (deliveryContainer) {
        deliveryContainer.innerHTML = htmlMarkup;
        deliveryContainer.scrollTop = deliveryContainer.scrollHeight;
      }
    }

    function speakChatMessage(index) {
      const msg = state.chatMessages[index];
      if (!msg) return;
      speakText(msg.regionalVoice || msg.text);
    }

    function renderWalletsUI() {
      const activeBal = state.wallets[state.currentRole] || 0;
      const roleNames = { vendor: 'Vendor Wallet', customer: 'Customer Wallet', delivery: 'Delivery Wallet' };
      document.getElementById('headerWalletLabel').textContent = roleNames[state.currentRole];
      document.getElementById('headerWalletBalance').textContent = '₹' + activeBal;

      document.getElementById('miniWalletVendor').textContent = '₹' + state.wallets.vendor;
      document.getElementById('miniWalletCustomer').textContent = '₹' + state.wallets.customer;
      document.getElementById('miniWalletDelivery').textContent = '₹' + state.wallets.delivery;
      document.getElementById('vendorPendingCodAmount').textContent = '₹' + state.vendorPendingCod;

      const vCard = document.getElementById('walletCardVendorAmt');
      const cCard = document.getElementById('walletCardCustomerAmt');
      const dCard = document.getElementById('walletCardDeliveryAmt');
      const pCod = document.getElementById('walletModalPendingCod');
      if (vCard) vCard.textContent = '₹' + state.wallets.vendor;
      if (cCard) cCard.textContent = '₹' + state.wallets.customer;
      if (dCard) dCard.textContent = '₹' + state.wallets.delivery;
      if (pCod) pCod.textContent = '₹' + state.vendorPendingCod;

      const txList = document.getElementById('walletTransactionsList');
      if (txList) {
        txList.innerHTML = state.transactions.map(t => `
          <div class="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200 text-xs">
            <div>
              <span class="font-black uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-800 mr-1.5">${t.role}</span>
              <span class="font-bold text-slate-900">${t.type}</span>
              <div class="text-[11px] text-slate-500 mt-0.5">${t.note} • ${t.time}</div>
            </div>
            <div class="text-sm font-black ${t.sign === '+' ? 'text-emerald-700' : 'text-rose-600'}">
              ${t.sign}₹${t.amount}
            </div>
          </div>
        `).join('');
      }
    }

    function renderChatbotMessages() {
      const list = document.getElementById('chatbotMessagesList');
      if (!list) return;
      list.innerHTML = state.botMessages.map((m, idx) => `
        <div class="flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}">
          <div class="max-w-[88%] rounded-2xl p-2.5 text-xs font-bold ${m.sender === 'user' ? 'bg-indigo-700 text-white' : 'bg-white text-slate-900 border border-slate-200 shadow-sm'}">
            <div>${m.text}</div>
            ${m.sender === 'bot' ? `
              <button type="button" onclick="speakBotMessage(${idx})"
                class="mt-1.5 bg-amber-400 text-indigo-950 font-black px-2 py-0.5 rounded-full text-[10px] inline-flex items-center gap-1">
                🔊 Listen
              </button>
            ` : ''}
          </div>
        </div>
      `).join('');
      list.scrollTop = list.scrollHeight;
    }

    function speakBotMessage(idx) {
      const m = state.botMessages[idx];
      if (m) speakText(m.text);
    }

    function renderAll() {
      renderVendorItems();
      renderCustomerCatalog();
      renderCustomerCart();
      renderDeliveryView();
      renderWalletsUI();
      renderChatMessages();
    }


    // ---------------------------------------------------------
    // VENDOR FULL ACCESS: QUANTITY CHANGE, PRICE EDIT, DELETE
    // ---------------------------------------------------------
    function changeVendorItemQty(itemId, delta) {
      const item = state.items.find(i => i.id === itemId);
      if (!item) return;
      item.quantity = Math.max(0, (item.quantity !== undefined ? item.quantity : 25) + delta);
      if (item.quantity === 0) item.inStock = false;
      else if (delta > 0 && !item.inStock) item.inStock = true;
      speakText(item.name + ' stock updated to ' + item.quantity + ' ' + item.unit);
      renderAll();
    }

    function promptEditVendorItemPrice(itemId) {
      const item = state.items.find(i => i.id === itemId);
      if (!item) return;
      state.editingVendorItemId = itemId;
      document.getElementById('editModalItemImg').src = item.image;
      document.getElementById('editModalItemName').value = item.name;
      document.getElementById('editModalItemPrice').value = item.price;
      document.getElementById('editModalItemUnit').value = item.unit || '1 kg';
      document.getElementById('editModalItemQty').value = item.quantity !== undefined ? item.quantity : 25;
      document.getElementById('modalVendorEditItem').classList.remove('hidden');
      speakText(item.name + ' ధర మార్చడానికి కొత్త ధర నమోదు చేసి సేవ్ బటన్ నొక్కండి.');
    }

    function stepEditModalPrice(delta) {
      const inp = document.getElementById('editModalItemPrice');
      if (!inp) return;
      const cur = parseInt(inp.value, 10) || 0;
      inp.value = Math.max(1, cur + delta);
    }

    function closeVendorEditModal() {
      document.getElementById('modalVendorEditItem').classList.add('hidden');
      state.editingVendorItemId = null;
    }

    function saveVendorEditedItem() {
      const item = state.items.find(i => i.id === state.editingVendorItemId);
      if (!item) {
        closeVendorEditModal();
        return;
      }
      const newName = (document.getElementById('editModalItemName').value || '').trim();
      const newPrice = Math.max(1, parseInt(document.getElementById('editModalItemPrice').value, 10) || item.price);
      const newUnit = document.getElementById('editModalItemUnit').value || item.unit;
      const newQty = Math.max(0, parseInt(document.getElementById('editModalItemQty').value, 10) || 0);

      if (newName) item.name = newName;
      item.price = newPrice;
      item.unit = newUnit;
      item.quantity = newQty;
      item.inStock = newQty > 0;

      closeVendorEditModal();
      speakText(item.name + ' కొత్త ధర ' + item.price + ' రూపాయలుగా సేవ్ చేయబడింది!');
      renderAll();
    }

    // SWIGGY-STYLE ONE-TIME LOGIN HANDLERS
    function openSwiggyLoginModal() {
      document.getElementById('modalSwiggyLogin').classList.remove('hidden');
    }

    function completeSwiggyLogin(method) {
      const emailVal = (document.getElementById('loginEmailInput').value || '').trim() || 'user@vocallocal.in';
      state.loggedInUser = {
        email: emailVal,
        method: method,
        isLoggedIn: true
      };
      try {
        localStorage.setItem('vocal_local_one_time_login', JSON.stringify(state.loggedInUser));
      } catch (e) {}

      const hdrName = document.getElementById('headerUserName');
      const hdrStatus = document.getElementById('headerUserStatus');
      if (hdrName) hdrName.textContent = method === 'Google' ? 'Google Verified' : emailVal.split('@')[0];
      if (hdrStatus) hdrStatus.textContent = '✅ Logged In';

      document.getElementById('modalSwiggyLogin').classList.add('hidden');
      speakText('నమస్కారం! మీరు వోకల్ లోకల్ యాప్ లో విజయవంతంగా లాగిన్ అయ్యారు.');
    }

    function checkOneTimeLoginOnBoot() {
      try {
        const saved = localStorage.getItem('vocal_local_one_time_login');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.isLoggedIn) {
            state.loggedInUser = parsed;
            const hdrName = document.getElementById('headerUserName');
            if (hdrName) hdrName.textContent = parsed.email ? parsed.email.split('@')[0] : 'Verified User';
            return;
          }
        }
      } catch (e) {}
      // Show One-Time Swiggy-Style Login Page on first visit
      openSwiggyLoginModal();
    }

    function deleteVendorItem(itemId) {
      const item = state.items.find(i => i.id === itemId);
      if (!item) return;
      state.items = state.items.filter(i => i.id !== itemId);
      if (state.cart[itemId]) delete state.cart[itemId];
      speakText(item.name + ' deleted from your store.');
      showToast('🗑️ Deleted ' + item.name + ' from store', '🗑️');
      renderAll();
    }

    // ---------------------------------------------------------
    // CHAT MESSAGE TRANSLATION ENGINE (English -> Regional Languages)
    // ---------------------------------------------------------
    let currentChatLang = 'te';

    const CHAT_TRANSLATIONS = {
      te: {
        'Namaste! I am at Sri Lakshmi Kirana Store picking up your Tomatoes and Milk.': 'నమస్తే! నేను శ్రీ లక్ష్మి కిరాణా దుకాణంలో మీ వస్తువులను పికప్ చేసుకుంటున్నాను.',
        'I will reach your house gate in 15 minutes. Tap the speaker icon to hear this message!': 'నేను 15 నిమిషాల్లో మీ ఇంటి గేటు వద్దకు చేరుకుంటాను. వినడానికి స్పీకర్ చిహ్నాన్ని నొక్కండి!',
        'I have picked up your items from the shop and am on the way! 🛵': 'నేను దుకాణం నుండి మీ వస్తువులను తీసుకున్నాను, దారిలో ఉన్నాను! 🛵',
        'I have reached near your house gate. Please come to collect! 🏠': 'నేను మీ ఇంటి గేటు వద్దకు చేరుకున్నాను. దయచేసి వచ్చి అందుకోండి! 🏠',
        'Please keep Cash ready or UPI open. Thank you! 🙏': 'దయచేసి నగదు సిద్ధంగా ఉంచుకోండి లేదా UPI సిద్ధం చేయండి. ధన్యవాదాలు! 🙏',
        'Please come fast! 🛵💨': 'దయచేసి త్వరగా రండి! 🛵💨',
        'I am waiting at the front gate 🏠': 'నేను ముందు గేటు వద్ద వేచి ఉన్నాను 🏠',
        'Call me when you arrive 📞': 'మీరు చేరుకున్నప్పుడు నాకు కాల్ చేయండి 📞'
      },
      hi: {
        'Namaste! I am at Sri Lakshmi Kirana Store picking up your Tomatoes and Milk.': 'नमस्ते! मैं श्री लक्ष्मी किराना स्टोर से आपका सामान उठा रहा हूँ।',
        'I will reach your house gate in 15 minutes. Tap the speaker icon to hear this message!': 'मैं 15 मिनट में आपके घर के गेट पर पहुंच जाऊंगा। सुनने के लिए स्पीकर दबाएं!',
        'I have picked up your items from the shop and am on the way! 🛵': 'मैंने दुकान से आपका सामान ले लिया है और रास्ते में हूँ! 🛵',
        'I have reached near your house gate. Please come to collect! 🏠': 'मैं आपके घर के गेट के पास पहुँच गया हूँ। कृपया लेने आएं! 🏠',
        'Please keep Cash ready or UPI open. Thank you! 🙏': 'कृपया नकद तैयार रखें या UPI खोलें। धन्यवाद! 🙏',
        'Please come fast! 🛵💨': 'कृपया जल्दी आएं! 🛵💨',
        'I am waiting at the front gate 🏠': 'मैं सामने वाले गेट पर इंतजार कर रहा हूँ 🏠',
        'Call me when you arrive 📞': 'पहुँचने पर मुझे कॉल करें 📞'
      },
      ta: {
        'Namaste! I am at Sri Lakshmi Kirana Store picking up your Tomatoes and Milk.': 'வணக்கம்! ஸ்ரீ லக்ஷ்மி மளிகைக் கடையில் உங்கள் பொருட்களை எடுக்கிறேன்.',
        'I will reach your house gate in 15 minutes. Tap the speaker icon to hear this message!': '15 நிமிடங்களில் உங்கள் வீட்டின் வாயிலை அடைந்து விடுவேன். கேட்க ஸ்பீக்கரை அழுத்தவும்!',
        'I have picked up your items from the shop and am on the way! 🛵': 'கடையிலிருந்து பொருட்களை எடுத்துக்கொண்டு கிளம்பிவிட்டேன்! 🛵',
        'I have reached near your house gate. Please come to collect! 🏠': 'உங்கள் வீட்டின் வாயிலுக்கு வந்துவிட்டேன். தயவுசெய்து வந்து வாங்கிக்கொள்ளுங்கள்! 🏠',
        'Please keep Cash ready or UPI open. Thank you! 🙏': 'தயவுசெய்து பணத்தை தயாராக வைக்கவும் அல்லது UPI திறக்கவும். நன்றி! 🙏',
        'Please come fast! 🛵💨': 'தயவுசெய்து சீக்கிரம் வாருங்கள்! 🛵💨',
        'I am waiting at the front gate 🏠': 'நான் முன் வாயிலில் காத்திருக்கிறேன் 🏠',
        'Call me when you arrive 📞': 'வந்ததும் எனக்கு கால் செய்யுங்கள் 📞'
      }
    };

    function translateAllChatMessages(lang) {
      currentChatLang = lang;
      renderChatMessages();
      const langNames = { te: 'తెలుగు (Telugu)', hi: 'हिन्दी (Hindi)', ta: 'தமிழ் (Tamil)', en: 'English' };
      showToast('🌐 Chat translated to ' + (langNames[lang] || lang), '🌐');
    }

    // ---------------------------------------------------------
    // OFFICIAL BILL / INVOICE GENERATOR FUNCTIONS
    // ---------------------------------------------------------
    function generateInvoiceFromOrder(orderData) {
      const summary = orderData || getCartSummaryData();
      state.activeInvoice = {
        invoiceNumber: 'INV-' + (state.activeOrder ? state.activeOrder.id : 'ORD-8042'),
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        customerName: 'Padma Amma',
        customerAddress: 'House #42, Midhilapuri Colony, Madhuravada, Visakhapatnam',
        paymentMethod: state.selectedPaymentMethod || 'Online UPI',
        items: summary.lines && summary.lines.length > 0 ? summary.lines : [
          { item: state.items[0], qty: 1, lineTotal: state.items[0].price },
          { item: state.items[1], qty: 1, lineTotal: state.items[1].price }
        ],
        subtotal: summary.subtotal || 172,
        deliveryFee: 35,
        total: summary.total || 207
      };
      return state.activeInvoice;
    }

    function openInvoiceModal() {
      const inv = generateInvoiceFromOrder();
      document.getElementById('invNumber').textContent = inv.invoiceNumber;
      document.getElementById('invDate').textContent = inv.date;
      document.getElementById('invPaymentMode').textContent = inv.paymentMethod === 'ONLINE' ? 'Online UPI (Direct to Vendor)' : 'Cash on Delivery (COD)';
      
      const tbody = document.getElementById('invoiceTableBody');
      tbody.innerHTML = inv.items.map((line, idx) => `
        <tr class="hover:bg-slate-50">
          <td class="p-2.5 text-slate-500">${idx + 1}</td>
          <td class="p-2.5">
            <div class="font-black text-slate-900">${line.item.name}</div>
            <div class="text-[10px] text-indigo-700">${line.item.regionalName || ''}</div>
          </td>
          <td class="p-2.5 text-center text-slate-700">₹${line.item.price}</td>
          <td class="p-2.5 text-center font-bold text-slate-900">${line.qty}</td>
          <td class="p-2.5 text-right font-black text-emerald-700">₹${line.lineTotal}</td>
        </tr>
      `).join('');

      document.getElementById('invSubtotal').textContent = '₹' + inv.subtotal;
      document.getElementById('invGst').textContent = '₹' + Math.round(inv.subtotal * 0.05);
      document.getElementById('invGrandTotal').textContent = '₹' + inv.total;

      document.getElementById('modalInvoice').classList.remove('hidden');
    }

    function closeInvoiceModal() {
      document.getElementById('modalInvoice').classList.add('hidden');
    }

    function speakInvoiceSummary() {
      const inv = state.activeInvoice || generateInvoiceFromOrder();
      speakText('Bill Invoice ' + inv.invoiceNumber + '. Total amount is ' + inv.total + ' rupees including delivery fee and GST. Verified delivery partner Raju Kumar.');
    }

    function printInvoiceBill() {
      showToast('🖨️ Opening print dialog...', '🖨️');
      window.print();
    }

    function downloadInvoiceText() {
      const inv = state.activeInvoice || generateInvoiceFromOrder();
      let txt = "========================================================\n";
      txt += "         VOCAL LOCAL - OFFICIAL RETAIL INVOICE\n";
      txt += "  Sri Lakshmi Kirana & Handcraft Store, Madhuravada\n";
      txt += "========================================================\n";
      txt += "Invoice No: " + inv.invoiceNumber + " | Date: " + inv.date + "\n";
      txt += "Customer: " + inv.customerName + " (" + inv.customerAddress + ")\n";
      txt += "Payment Mode: " + inv.paymentMethod + "\n";
      txt += "Verified Delivery Partner: Raju Kumar (DL: AP-31-2022-0048921)\n";
      txt += "--------------------------------------------------------\n";
      inv.items.forEach((it, i) => {
        txt += (i+1) + ". " + it.item.name + " x " + it.qty + " = INR " + it.lineTotal + "\n";
      });
      txt += "--------------------------------------------------------\n";
      txt += "Subtotal: INR " + inv.subtotal + "\n";
      txt += "Delivery Fee: INR 35\n";
      txt += "Grand Total: INR " + inv.total + "\n";
      txt += "========================================================\n";
      txt += "30% Protection Active on Doorstep Cancellations.\n";

      const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice_${inv.invoiceNumber}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('📥 Downloaded Invoice File', '📥');
    }

    // ---------------------------------------------------------
    // LIVE GPS MAP TRACKING CONTROLS & SIMULATION
    // ---------------------------------------------------------
    let mapSimInterval = null;

    function openLiveMapModal() {
      document.getElementById('modalLiveMap').classList.remove('hidden');
      updateLiveMapMarkerUI();
      speakMapTrackingStatus();
    }

    function closeLiveMapModal() {
      document.getElementById('modalLiveMap').classList.add('hidden');
    }

    function updateLiveMapMarkerUI() {
      const g = document.getElementById('driverMapMarker');
      const statusEl = document.getElementById('mapStatusText');
      const etaEl = document.getElementById('mapEtaDisplay');
      if (!g || !statusEl) return;

      const progress = state.mapTracking.driverProgress; // 0 to 100
      // Calculate coordinates along Q curve from (100, 240) to (600, 80)
      const t = progress / 100;
      const x = 100 + t * 500;
      const y = 240 - t * 160 + Math.sin(t * Math.PI) * 20;

      g.setAttribute('transform', `translate(${x}, ${y})`);

      if (progress >= 95) {
        statusEl.textContent = '🏠 Raju is AT YOUR GATE! Please come to collect!';
        if (etaEl) etaEl.textContent = 'Arrived!';
      } else if (progress >= 60) {
        statusEl.textContent = '🛵 Raju reached Midhilapuri Colony Road (0.6 km away)';
        if (etaEl) etaEl.textContent = '5 Mins';
      } else if (progress >= 30) {
        statusEl.textContent = '🛵 Raju on Madhuravada Main Road (1.2 km away)';
        if (etaEl) etaEl.textContent = '10 Mins';
      } else {
        statusEl.textContent = '🏪 Raju picking up items at Kirana Store';
        if (etaEl) etaEl.textContent = '15 Mins';
      }
    }

    function advanceLiveMapSimulation() {
      state.mapTracking.driverProgress = (state.mapTracking.driverProgress + 25);
      if (state.mapTracking.driverProgress > 100) state.mapTracking.driverProgress = 20;
      updateLiveMapMarkerUI();
      speakMapTrackingStatus();
    }

    function speakMapTrackingStatus() {
      const statusEl = document.getElementById('mapStatusText');
      const text = statusEl ? statusEl.textContent : 'Raju is delivering your order';
      speakText('Live GPS tracking: ' + text);
    }

    window.onload = function() {
      renderAll();
      checkOneTimeLoginOnBoot();
    };