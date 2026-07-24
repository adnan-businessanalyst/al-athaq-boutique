import type { LocaleCode } from "@/lib/i18n/locales";

export type Dictionary = {
  nav: {
    featured: string;
    ourStory: string;
    products: string;
    discover: string;
    menu: string;
    closeMenu: string;
    language: string;
  };
  hero: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  featured: {
    eyebrow: string;
    heading: string;
    view: string;
    tiles: Record<string, { tag: string; title: string }>;
  };
  story: {
    eyebrow: string;
    heading: string;
    p1: string;
    p2: string;
    cta: string;
  };
  products: {
    eyebrow: string;
    heading: string;
    subtitle: string;
    items: Record<string, { name: string; description: string; category: string }>;
  };
  footer: {
    tagline: string;
    shop: string;
    boutique: string;
    follow: string;
    allProducts: string;
    featured: string;
    giftSets: string;
    ourStory: string;
    visit: string;
    contact: string;
    rights: string;
    privacy: string;
    terms: string;
  };
};

const en: Dictionary = {
  nav: {
    featured: "Featured",
    ourStory: "Our Story",
    products: "Products",
    discover: "Discover",
    menu: "Open menu",
    closeMenu: "Close menu",
    language: "Language",
  },
  hero: {
    eyebrow: "Incense & Middle Eastern Gifts",
    titleLine1: "Tradition you can",
    titleLine2: "carry home.",
    subtitle:
      "Hand-selected bakhoor, lanterns, textiles, and jewelry — crafted to bring the warmth of the souk into your everyday rituals.",
    ctaPrimary: "Discover our story",
    ctaSecondary: "Shop the collection",
  },
  featured: {
    eyebrow: "Featured",
    heading: "Chosen for the modern souk",
    view: "View",
    tiles: {
      LARGE: { tag: "Bakhoor", title: "Signature incense blends" },
      WIDE: { tag: "Lanterns", title: "Light for evening rituals" },
      SMALL_A: { tag: "Textiles", title: "Soft heritage weaves" },
      SMALL_B: { tag: "Jewelry", title: "Pieces with quiet meaning" },
    },
  },
  story: {
    eyebrow: "Boutique",
    heading: "Our Story",
    p1: "Al Athaq Boutique began as a love letter to the scents and craftsmanship of the Middle East — bakhoor that fills a room with memory, lanterns that softens evening light, textiles woven with patience, and jewelry that carries quiet meaning.",
    p2: "We curate pieces you can gift, keep, and return to: heritage forms rendered for modern homes. Every selection is chosen to feel personal — tradition you can carry home.",
    cta: "Explore the collection",
  },
  products: {
    eyebrow: "Collection",
    heading: "Gifts to carry home",
    subtitle:
      "Bakhoor, lanterns, textiles, and jewelry — curated with heritage warmth.",
    items: {
      "royal-oud-bakhoor": {
        name: "Royal Oud Bakhoor",
        description: "A deep, resinous blend for ceremonial evenings.",
        category: "Incense",
      },
      "amber-rose-incense": {
        name: "Amber Rose Incense",
        description: "Warm amber wrapped in soft floral notes.",
        category: "Incense",
      },
      "mashrabiya-lantern": {
        name: "Mashrabiya Lantern",
        description: "Pierced metalwork that casts patterned light.",
        category: "Lanterns",
      },
      "souk-textile-runner": {
        name: "Souk Textile Runner",
        description: "Handwoven warmth for tables and thresholds.",
        category: "Textiles",
      },
      "crescent-pendant": {
        name: "Crescent Pendant",
        description: "A refined everyday talisman in warm metal.",
        category: "Jewelry",
      },
      "desert-musk-set": {
        name: "Desert Musk Gift Set",
        description: "Bakhoor and burner, ready to give.",
        category: "Gifts",
      },
      "heritage-scarf": {
        name: "Heritage Scarf",
        description: "Light textile with a classic geometric border.",
        category: "Textiles",
      },
    },
  },
  footer: {
    tagline: "Tradition you can carry home.",
    shop: "Shop",
    boutique: "Boutique",
    follow: "Follow",
    allProducts: "All products",
    featured: "Featured",
    giftSets: "Gift sets",
    ourStory: "Our story",
    visit: "Visit",
    contact: "Contact",
    rights: "All rights reserved.",
    privacy: "Privacy",
    terms: "Terms",
  },
};

const ar: Dictionary = {
  nav: {
    featured: "مميز",
    ourStory: "قصتنا",
    products: "المنتجات",
    discover: "اكتشف",
    menu: "فتح القائمة",
    closeMenu: "إغلاق القائمة",
    language: "اللغة",
  },
  hero: {
    eyebrow: "البخور وهدايا الشرق الأوسط",
    titleLine1: "تراثٌ يمكنك",
    titleLine2: "أن تحمله إلى بيتك.",
    subtitle:
      "بخورٌ مختار بعناية، وفوانيس، ومنسوجات، ومجوهرات — لجلب دفء السوق إلى طقوسك اليومية.",
    ctaPrimary: "اكتشف قصتنا",
    ctaSecondary: "تسوق المجموعة",
  },
  featured: {
    eyebrow: "مميز",
    heading: "مختارات لسوق العصر الحديث",
    view: "عرض",
    tiles: {
      LARGE: { tag: "بخور", title: "خلطات البخور المميزة" },
      WIDE: { tag: "فوانيس", title: "نور لطقوس المساء" },
      SMALL_A: { tag: "منسوجات", title: "نسيج تراثي ناعم" },
      SMALL_B: { tag: "مجوهرات", title: "قطع بمعنًى هادئ" },
    },
  },
  story: {
    eyebrow: "البوتيك",
    heading: "قصتنا",
    p1: "بدأ بوتيك العثاق كرسالة حب لروائح وحِرَف الشرق الأوسط — بخور يملأ المكان بالذكرى، وفوانيس تُلطّف ضوء المساء، ومنسوجات تُحاك بالصبر، ومجوهرات تحمل معنًى هادئًا.",
    p2: "نختار قطعًا يمكنك إهداؤها والاحتفاظ بها والعودة إليها: أشكال تراثية لبيوت عصرية. كل اختيار شخصي — تراث تحمله إلى بيتك.",
    cta: "استكشف المجموعة",
  },
  products: {
    eyebrow: "المجموعة",
    heading: "هدايا تحملها إلى بيتك",
    subtitle: "بخور وفوانيس ومنسوجات ومجوهرات — بلمسة تراثية دافئة.",
    items: {
      "royal-oud-bakhoor": {
        name: "بخور العود الملكي",
        description: "خليط عميق راتنجي للأمسيات الاحتفالية.",
        category: "بخور",
      },
      "amber-rose-incense": {
        name: "بخور العنبر والورد",
        description: "عنبر دافئ ملفوف بنفحات زهرية ناعمة.",
        category: "بخور",
      },
      "mashrabiya-lantern": {
        name: "فانوس المشربية",
        description: "معدن مثقوب يرسم ضوءًا منقوشًا.",
        category: "فوانيس",
      },
      "souk-textile-runner": {
        name: "مفرش السوق",
        description: "دفء منسوج للطاولات والعتبات.",
        category: "منسوجات",
      },
      "crescent-pendant": {
        name: "قلادة الهلال",
        description: "تميمة يومية أنيقة بمعدن دافئ.",
        category: "مجوهرات",
      },
      "desert-musk-set": {
        name: "طقم مسك الصحراء",
        description: "بخور وموقد جاهزان للإهداء.",
        category: "هدايا",
      },
      "heritage-scarf": {
        name: "وشاح التراث",
        description: "نسيج خفيف بحافة هندسية كلاسيكية.",
        category: "منسوجات",
      },
    },
  },
  footer: {
    tagline: "تراثٌ يمكنك أن تحمله إلى بيتك.",
    shop: "تسوق",
    boutique: "البوتيك",
    follow: "تابعنا",
    allProducts: "كل المنتجات",
    featured: "مميز",
    giftSets: "أطقم الهدايا",
    ourStory: "قصتنا",
    visit: "زرنا",
    contact: "تواصل",
    rights: "جميع الحقوق محفوظة.",
    privacy: "الخصوصية",
    terms: "الشروط",
  },
};

const zhHans: Dictionary = {
  nav: {
    featured: "精选",
    ourStory: "我们的故事",
    products: "产品",
    discover: "探索",
    menu: "打开菜单",
    closeMenu: "关闭菜单",
    language: "语言",
  },
  hero: {
    eyebrow: "熏香与中东礼赠",
    titleLine1: "可以把传统",
    titleLine2: "带回家。",
    subtitle:
      "精选的巴胡尔、灯笼、织物与珠宝——把市集的温暖带入你的日常仪式。",
    ctaPrimary: "了解我们的故事",
    ctaSecondary: "选购系列",
  },
  featured: {
    eyebrow: "精选",
    heading: "为现代市集而生",
    view: "查看",
    tiles: {
      LARGE: { tag: "巴胡尔", title: "招牌熏香调和" },
      WIDE: { tag: "灯笼", title: "夜间仪式之光" },
      SMALL_A: { tag: "织物", title: "柔软的传统织纹" },
      SMALL_B: { tag: "珠宝", title: "静默而有意味的饰品" },
    },
  },
  story: {
    eyebrow: "精品店",
    heading: "我们的故事",
    p1: "Al Athaq Boutique 始于对中东气味与工艺的一封情书——充满记忆的巴胡尔、柔化夜光的灯笼、耐心织就的织物，以及带着安静意义的珠宝。",
    p2: "我们精选可赠予、可珍藏、可反复回味的物件：传统形态，为现代家居而生。每一次选择都更个人——传统，你可以带回家。",
    cta: "探索系列",
  },
  products: {
    eyebrow: "系列",
    heading: "可带回家的礼物",
    subtitle: "巴胡尔、灯笼、织物与珠宝——以传统温度精心策展。",
    items: {
      "royal-oud-bakhoor": {
        name: "皇家沉香巴胡尔",
        description: "仪式夜晚的深沉树脂调和。",
        category: "熏香",
      },
      "amber-rose-incense": {
        name: "琥珀玫瑰熏香",
        description: "温暖琥珀裹着柔和花香。",
        category: "熏香",
      },
      "mashrabiya-lantern": {
        name: "木格纹灯笼",
        description: "镂空金属投射出图案之光。",
        category: "灯笼",
      },
      "souk-textile-runner": {
        name: "市集织物桌旗",
        description: "为桌面与门槛织就的温暖。",
        category: "织物",
      },
      "crescent-pendant": {
        name: "新月吊坠",
        description: "温暖金属制成的日常护符。",
        category: "珠宝",
      },
      "desert-musk-set": {
        name: "沙漠麝香礼盒",
        description: "巴胡尔与香炉，礼赠即用。",
        category: "礼盒",
      },
      "heritage-scarf": {
        name: "传统围巾",
        description: "轻盈织物，经典几何镶边。",
        category: "织物",
      },
    },
  },
  footer: {
    tagline: "可以把传统带回家。",
    shop: "选购",
    boutique: "精品店",
    follow: "关注",
    allProducts: "全部产品",
    featured: "精选",
    giftSets: "礼盒",
    ourStory: "我们的故事",
    visit: "到访",
    contact: "联系",
    rights: "保留所有权利。",
    privacy: "隐私",
    terms: "条款",
  },
};

const zhHant: Dictionary = {
  nav: {
    featured: "精選",
    ourStory: "我哋嘅故事",
    products: "產品",
    discover: "探索",
    menu: "打開選單",
    closeMenu: "關閉選單",
    language: "語言",
  },
  hero: {
    eyebrow: "熏香同中東禮物",
    titleLine1: "傳統，你可以",
    titleLine2: "帶返屋企。",
    subtitle:
      "精心挑選嘅巴胡爾、燈籠、織品同珠寶——將市集嘅溫暖帶入你嘅日常儀式。",
    ctaPrimary: "了解我哋嘅故事",
    ctaSecondary: "選購系列",
  },
  featured: {
    eyebrow: "精選",
    heading: "為現代市集而設",
    view: "睇吓",
    tiles: {
      LARGE: { tag: "巴胡爾", title: "招牌熏香調和" },
      WIDE: { tag: "燈籠", title: "夜晚儀式之光" },
      SMALL_A: { tag: "織品", title: "柔軟傳統織紋" },
      SMALL_B: { tag: "珠寶", title: "安靜而有意味嘅飾物" },
    },
  },
  story: {
    eyebrow: "精品店",
    heading: "我哋嘅故事",
    p1: "Al Athaq Boutique 始於對中東氣味同工藝嘅一封情書——充滿記憶嘅巴胡爾、柔化夜光嘅燈籠、耐心織成嘅織品，同埋帶住安靜意義嘅珠寶。",
    p2: "我哋策展可以送禮、珍藏、反覆回味嘅物件：傳統形態，為現代家居而生。每一次選擇都更個人——傳統，你可以帶返屋企。",
    cta: "探索系列",
  },
  products: {
    eyebrow: "系列",
    heading: "可以帶返屋企嘅禮物",
    subtitle: "巴胡爾、燈籠、織品同珠寶——以傳統溫度精心策展。",
    items: {
      "royal-oud-bakhoor": {
        name: "皇家沉香巴胡爾",
        description: "儀式夜晚嘅深沉樹脂調和。",
        category: "熏香",
      },
      "amber-rose-incense": {
        name: "琥珀玫瑰熏香",
        description: "溫暖琥珀包住柔和花香。",
        category: "熏香",
      },
      "mashrabiya-lantern": {
        name: "木格紋燈籠",
        description: "鏤空金屬投射圖案之光。",
        category: "燈籠",
      },
      "souk-textile-runner": {
        name: "市集織品桌旗",
        description: "為桌面同門檻織就嘅溫暖。",
        category: "織品",
      },
      "crescent-pendant": {
        name: "新月吊墜",
        description: "溫暖金屬製成嘅日常護符。",
        category: "珠寶",
      },
      "desert-musk-set": {
        name: "沙漠麝香禮盒",
        description: "巴胡爾同香爐，送禮即用。",
        category: "禮盒",
      },
      "heritage-scarf": {
        name: "傳統圍巾",
        description: "輕盈織品，經典幾何鑲邊。",
        category: "織品",
      },
    },
  },
  footer: {
    tagline: "傳統，你可以帶返屋企。",
    shop: "選購",
    boutique: "精品店",
    follow: "追蹤",
    allProducts: "全部產品",
    featured: "精選",
    giftSets: "禮盒",
    ourStory: "我哋嘅故事",
    visit: "到訪",
    contact: "聯絡",
    rights: "保留所有權利。",
    privacy: "私隱",
    terms: "條款",
  },
};

const ja: Dictionary = {
  nav: {
    featured: "特集",
    ourStory: "私たちの物語",
    products: "商品",
    discover: "発見する",
    menu: "メニューを開く",
    closeMenu: "メニューを閉じる",
    language: "言語",
  },
  hero: {
    eyebrow: "お香と中東の贈り物",
    titleLine1: "伝統を、",
    titleLine2: "自宅へ。",
    subtitle:
      "厳選したバフール、ランタン、テキスタイル、ジュエリー。スークの温もりを日常の儀式へ。",
    ctaPrimary: "私たちの物語を知る",
    ctaSecondary: "コレクションを見る",
  },
  featured: {
    eyebrow: "特集",
    heading: "現代のスークのために",
    view: "見る",
    tiles: {
      LARGE: { tag: "バフール", title: "シグネチャー香りの調合" },
      WIDE: { tag: "ランタン", title: "宵の儀式のための光" },
      SMALL_A: { tag: "テキスタイル", title: "柔らかな伝統の織り" },
      SMALL_B: { tag: "ジュエリー", title: "静かな意味を宿す装身具" },
    },
  },
  story: {
    eyebrow: "ブティック",
    heading: "私たちの物語",
    p1: "Al Athaq Boutique は、中東の香りと職人技へのラブレターから始まりました。記憶を満たすバフール、夕光をやわらげるランタン、忍耐で織られた布、静かな意味を持つジュエリー。",
    p2: "贈れ、残せ、また手に取れるものだけを選びます。伝統の形を、現代の住まいへ。ひとつひとつが個人的で——伝統を、自宅へ。",
    cta: "コレクションを探る",
  },
  products: {
    eyebrow: "コレクション",
    heading: "自宅へ持ち帰れる贈り物",
    subtitle: "バフール、ランタン、テキスタイル、ジュエリー——伝統の温もりでキュレーション。",
    items: {
      "royal-oud-bakhoor": {
        name: "ロイヤル ウード バフール",
        description: "儀式の夜のための深い樹脂のブレンド。",
        category: "お香",
      },
      "amber-rose-incense": {
        name: "アンバーローズ インセンス",
        description: "温かなアンバーに柔らかな花の香り。",
        category: "お香",
      },
      "mashrabiya-lantern": {
        name: "マシュラビーヤ ランタン",
        description: "透かし金属が描く模様の光。",
        category: "ランタン",
      },
      "souk-textile-runner": {
        name: "スーク テキスタイル ランナー",
        description: "卓と敷居のための手織りの温もり。",
        category: "テキスタイル",
      },
      "crescent-pendant": {
        name: "クレセント ペンダント",
        description: "温かな金属の日常のお守り。",
        category: "ジュエリー",
      },
      "desert-musk-set": {
        name: "デザートムスク ギフトセット",
        description: "バフールとバーナー、すぐに贈れる。",
        category: "ギフト",
      },
      "heritage-scarf": {
        name: "ヘリテージ スカーフ",
        description: "クラシックな幾何学縁取りの軽い織物。",
        category: "テキスタイル",
      },
    },
  },
  footer: {
    tagline: "伝統を、自宅へ。",
    shop: "ショップ",
    boutique: "ブティック",
    follow: "フォロー",
    allProducts: "すべての商品",
    featured: "特集",
    giftSets: "ギフトセット",
    ourStory: "私たちの物語",
    visit: "来店",
    contact: "お問い合わせ",
    rights: "無断転載を禁じます。",
    privacy: "プライバシー",
    terms: "利用規約",
  },
};

const tl: Dictionary = {
  nav: {
    featured: "Tampok",
    ourStory: "Aming Kwento",
    products: "Mga Produkto",
    discover: "Tuklasin",
    menu: "Buksan ang menu",
    closeMenu: "Isara ang menu",
    language: "Wika",
  },
  hero: {
    eyebrow: "Insenso at Regalong Middle Eastern",
    titleLine1: "Tradisyon na",
    titleLine2: "madadala sa tahanan.",
    subtitle:
      "Piniling bakhoor, lantern, tela, at alahas — upang dalhin ang init ng souk sa pang-araw-araw na ritwal.",
    ctaPrimary: "Tuklasin ang aming kwento",
    ctaSecondary: "Mamili sa koleksyon",
  },
  featured: {
    eyebrow: "Tampok",
    heading: "Para sa makabagong souk",
    view: "Tingnan",
    tiles: {
      LARGE: { tag: "Bakhoor", title: "Pirmahang blend ng insenso" },
      WIDE: { tag: "Lantern", title: "Liwanag para sa gabing ritwal" },
      SMALL_A: { tag: "Tela", title: "Malambot na heritage weave" },
      SMALL_B: { tag: "Alahas", title: "Pirasong may tahimik na kahulugan" },
    },
  },
  story: {
    eyebrow: "Boutique",
    heading: "Aming Kwento",
    p1: "Nagsimula ang Al Athaq Boutique bilang liham ng pagmamahal sa mga amoy at gawa ng Middle East — bakhoor na pumupuno sa silid ng alaala, lantern na nagpapalambot ng gabi, telang hinabi nang may pasensya, at alahas na may tahimik na kahulugan.",
    p2: "Pinipili namin ang mga pirasong maipagkakaloob, mapapanatili, at maaaring balikan: anyong heritage para sa modernong tahanan. Bawat pagpili ay personal — tradisyon na madadala sa tahanan.",
    cta: "Tuklasin ang koleksyon",
  },
  products: {
    eyebrow: "Koleksyon",
    heading: "Mga regalong madadala sa tahanan",
    subtitle:
      "Bakhoor, lantern, tela, at alahas — kinurating may init ng heritage.",
    items: {
      "royal-oud-bakhoor": {
        name: "Royal Oud Bakhoor",
        description: "Malalim at resinous na blend para sa seremonyal na gabi.",
        category: "Insenso",
      },
      "amber-rose-incense": {
        name: "Amber Rose Incense",
        description: "Mainit na amber na nababalot ng malambot na bulaklak.",
        category: "Insenso",
      },
      "mashrabiya-lantern": {
        name: "Mashrabiya Lantern",
        description: "Tinutusok na metal na naglalabas ng patterned light.",
        category: "Lantern",
      },
      "souk-textile-runner": {
        name: "Souk Textile Runner",
        description: "Hinabing init para sa mesa at pintuan.",
        category: "Tela",
      },
      "crescent-pendant": {
        name: "Crescent Pendant",
        description: "Pang-araw-araw na anting sa mainit na metal.",
        category: "Alahas",
      },
      "desert-musk-set": {
        name: "Desert Musk Gift Set",
        description: "Bakhoor at burner, handa nang iregalo.",
        category: "Regalo",
      },
      "heritage-scarf": {
        name: "Heritage Scarf",
        description: "Magaan na tela na may klasikong geometric border.",
        category: "Tela",
      },
    },
  },
  footer: {
    tagline: "Tradisyon na madadala sa tahanan.",
    shop: "Tindahan",
    boutique: "Boutique",
    follow: "Sundan",
    allProducts: "Lahat ng produkto",
    featured: "Tampok",
    giftSets: "Mga gift set",
    ourStory: "Aming kwento",
    visit: "Bisitahin",
    contact: "Makipag-ugnayan",
    rights: "Nakalaan ang lahat ng karapatan.",
    privacy: "Privacy",
    terms: "Mga Tuntunin",
  },
};

const fr: Dictionary = {
  nav: {
    featured: "Sélection",
    ourStory: "Notre histoire",
    products: "Produits",
    discover: "Découvrir",
    menu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    language: "Langue",
  },
  hero: {
    eyebrow: "Encens & cadeaux du Moyen-Orient",
    titleLine1: "Une tradition",
    titleLine2: "à emporter chez soi.",
    subtitle:
      "Bakhoor, lanternes, textiles et bijoux sélectionnés — pour apporter la chaleur du souk à vos rituels quotidiens.",
    ctaPrimary: "Découvrir notre histoire",
    ctaSecondary: "Voir la collection",
  },
  featured: {
    eyebrow: "Sélection",
    heading: "Choisis pour le souk moderne",
    view: "Voir",
    tiles: {
      LARGE: { tag: "Bakhoor", title: "Mélanges d'encens signature" },
      WIDE: { tag: "Lanternes", title: "Lumière pour les soirs" },
      SMALL_A: { tag: "Textiles", title: "Tissages patrimoniaux doux" },
      SMALL_B: { tag: "Bijoux", title: "Pièces au sens discret" },
    },
  },
  story: {
    eyebrow: "Boutique",
    heading: "Notre histoire",
    p1: "Al Athaq Boutique est née comme une lettre d'amour aux parfums et au savoir-faire du Moyen-Orient — bakhoor qui remplit une pièce de mémoire, lanternes qui adoucissent le soir, textiles tissés avec patience, bijoux au sens silencieux.",
    p2: "Nous sélectionnons des pièces à offrir, à garder et à retrouver : des formes patrimoniales pour des maisons modernes. Chaque choix est personnel — une tradition à emporter chez soi.",
    cta: "Explorer la collection",
  },
  products: {
    eyebrow: "Collection",
    heading: "Des cadeaux à emporter",
    subtitle:
      "Bakhoor, lanternes, textiles et bijoux — curatés avec la chaleur du patrimoine.",
    items: {
      "royal-oud-bakhoor": {
        name: "Bakhoor Oud Royal",
        description: "Un mélange profond et résineux pour les soirs de cérémonie.",
        category: "Encens",
      },
      "amber-rose-incense": {
        name: "Encens Ambre Rose",
        description: "Ambre chaleureux enveloppé de notes florales douces.",
        category: "Encens",
      },
      "mashrabiya-lantern": {
        name: "Lanterne Mashrabiya",
        description: "Métal ajouré qui projette une lumière dessinées.",
        category: "Lanternes",
      },
      "souk-textile-runner": {
        name: "Chemin de table Souk",
        description: "Chaleur tissée pour tables et seuils.",
        category: "Textiles",
      },
      "crescent-pendant": {
        name: "Pendentif Croissant",
        description: "Un talisman quotidien en métal chaud.",
        category: "Bijoux",
      },
      "desert-musk-set": {
        name: "Coffret Musc du Désert",
        description: "Bakhoor et brûleur, prêts à offrir.",
        category: "Cadeaux",
      },
      "heritage-scarf": {
        name: "Écharpe Héritage",
        description: "Textile léger à bordure géométrique classique.",
        category: "Textiles",
      },
    },
  },
  footer: {
    tagline: "Une tradition à emporter chez soi.",
    shop: "Boutique",
    boutique: "Maison",
    follow: "Suivre",
    allProducts: "Tous les produits",
    featured: "Sélection",
    giftSets: "Coffrets cadeaux",
    ourStory: "Notre histoire",
    visit: "Visiter",
    contact: "Contact",
    rights: "Tous droits réservés.",
    privacy: "Confidentialité",
    terms: "Conditions",
  },
};

const es: Dictionary = {
  nav: {
    featured: "Destacados",
    ourStory: "Nuestra historia",
    products: "Productos",
    discover: "Descubrir",
    menu: "Abrir menú",
    closeMenu: "Cerrar menú",
    language: "Idioma",
  },
  hero: {
    eyebrow: "Incienso y regalos de Oriente Medio",
    titleLine1: "Tradición que puedes",
    titleLine2: "llevar a casa.",
    subtitle:
      "Bakhoor, faroles, textiles y joyería seleccionados — para llevar el calor del zoco a tus rituales cotidianos.",
    ctaPrimary: "Descubre nuestra historia",
    ctaSecondary: "Ver la colección",
  },
  featured: {
    eyebrow: "Destacados",
    heading: "Elegidos para el zoco moderno",
    view: "Ver",
    tiles: {
      LARGE: { tag: "Bakhoor", title: "Mezclas de incienso exclusivas" },
      WIDE: { tag: "Faroles", title: "Luz para rituales nocturnos" },
      SMALL_A: { tag: "Textiles", title: "Tejidos heredados suaves" },
      SMALL_B: { tag: "Joyería", title: "Piezas de significado sereno" },
    },
  },
  story: {
    eyebrow: "Boutique",
    heading: "Nuestra historia",
    p1: "Al Athaq Boutique nació como una carta de amor a los aromas y el oficio de Oriente Medio: bakhoor que llena una habitación de memoria, faroles que suavizan la noche, textiles tejidos con paciencia y joyas de significado silencioso.",
    p2: "Seleccionamos piezas para regalar, conservar y volver a ellas: formas heredadas para hogares modernos. Cada elección es personal — tradición que puedes llevar a casa.",
    cta: "Explorar la colección",
  },
  products: {
    eyebrow: "Colección",
    heading: "Regalos para llevar a casa",
    subtitle:
      "Bakhoor, faroles, textiles y joyería — curados con calor patrimonial.",
    items: {
      "royal-oud-bakhoor": {
        name: "Bakhoor Oud Real",
        description: "Una mezcla profunda y resinosa para noches ceremoniales.",
        category: "Incienso",
      },
      "amber-rose-incense": {
        name: "Incienso Ámbar Rosa",
        description: "Ámbar cálido envuelto en notas florales suaves.",
        category: "Incienso",
      },
      "mashrabiya-lantern": {
        name: "Farol Mashrabiya",
        description: "Metal calado que proyecta luz con dibujo.",
        category: "Faroles",
      },
      "souk-textile-runner": {
        name: "Camino de mesa Souk",
        description: "Calor tejido para mesas y umbrales.",
        category: "Textiles",
      },
      "crescent-pendant": {
        name: "Colgante Luna Creciente",
        description: "Un talismán cotidiano en metal cálido.",
        category: "Joyería",
      },
      "desert-musk-set": {
        name: "Set Almizcle del Desierto",
        description: "Bakhoor y quemador, listos para regalar.",
        category: "Regalos",
      },
      "heritage-scarf": {
        name: "Pañuelo Patrimonio",
        description: "Tejido ligero con borde geométrico clásico.",
        category: "Textiles",
      },
    },
  },
  footer: {
    tagline: "Tradición que puedes llevar a casa.",
    shop: "Tienda",
    boutique: "Boutique",
    follow: "Seguir",
    allProducts: "Todos los productos",
    featured: "Destacados",
    giftSets: "Sets de regalo",
    ourStory: "Nuestra historia",
    visit: "Visitar",
    contact: "Contacto",
    rights: "Todos los derechos reservados.",
    privacy: "Privacidad",
    terms: "Términos",
  },
};

const de: Dictionary = {
  nav: {
    featured: "Empfohlen",
    ourStory: "Unsere Geschichte",
    products: "Produkte",
    discover: "Entdecken",
    menu: "Menü öffnen",
    closeMenu: "Menü schließen",
    language: "Sprache",
  },
  hero: {
    eyebrow: "Weihrauch & Geschenke aus dem Nahen Osten",
    titleLine1: "Tradition, die du",
    titleLine2: "nach Hause trägst.",
    subtitle:
      "Sorgfältig ausgewählter Bakhoor, Laternen, Textilien und Schmuck — die Wärme des Souks für deine Alltagrituale.",
    ctaPrimary: "Unsere Geschichte entdecken",
    ctaSecondary: "Kollektion ansehen",
  },
  featured: {
    eyebrow: "Empfohlen",
    heading: "Für den modernen Souk gewählt",
    view: "Ansehen",
    tiles: {
      LARGE: { tag: "Bakhoor", title: "Signatur-Weihrauchmischungen" },
      WIDE: { tag: "Laternen", title: "Licht für Abendrituale" },
      SMALL_A: { tag: "Textilien", title: "Weiche Erbe-Webarten" },
      SMALL_B: { tag: "Schmuck", title: "Stücke mit stiller Bedeutung" },
    },
  },
  story: {
    eyebrow: "Boutique",
    heading: "Unsere Geschichte",
    p1: "Al Athaq Boutique begann als Liebesbrief an die Düfte und Handwerkskunst des Nahen Ostens — Bakhoor, der einen Raum mit Erinnerung füllt, Laternen, die das Abendlicht weicher machen, geduldig gewebte Textilien und Schmuck mit stiller Bedeutung.",
    p2: "Wir kuratieren Stücke zum Schenken, Bewahren und Wiederfinden: Erbformen für moderne Häuser. Jede Auswahl ist persönlich — Tradition, die du nach Hause trägst.",
    cta: "Kollektion erkunden",
  },
  products: {
    eyebrow: "Kollektion",
    heading: "Geschenke zum Mitnehmen",
    subtitle:
      "Bakhoor, Laternen, Textilien und Schmuck — kuratiert mit der Wärme des Erbes.",
    items: {
      "royal-oud-bakhoor": {
        name: "Royal Oud Bakhoor",
        description: "Eine tiefe, harzige Mischung für zeremonielle Abende.",
        category: "Weihrauch",
      },
      "amber-rose-incense": {
        name: "Amber Rose Weihrauch",
        description: "Warmer Amber, gehüllt in sanfte Blütennoten.",
        category: "Weihrauch",
      },
      "mashrabiya-lantern": {
        name: "Mashrabiya-Laterne",
        description: "Durchbrochenes Metall wirft gemustertes Licht.",
        category: "Laternen",
      },
      "souk-textile-runner": {
        name: "Souk-Textilläufer",
        description: "Gewebte Wärme für Tische und Schwellen.",
        category: "Textilien",
      },
      "crescent-pendant": {
        name: "Sichelmond-Anhänger",
        description: "Ein feiner Alltags-Talisman aus warmem Metall.",
        category: "Schmuck",
      },
      "desert-musk-set": {
        name: "Wüstenmoschus-Geschenkset",
        description: "Bakhoor und Brenner, bereit zum Verschenken.",
        category: "Geschenke",
      },
      "heritage-scarf": {
        name: "Heritage-Schal",
        description: "Leichtes Textil mit klassischem geometrischem Rand.",
        category: "Textilien",
      },
    },
  },
  footer: {
    tagline: "Tradition, die du nach Hause trägst.",
    shop: "Shop",
    boutique: "Boutique",
    follow: "Folgen",
    allProducts: "Alle Produkte",
    featured: "Empfohlen",
    giftSets: "Geschenksets",
    ourStory: "Unsere Geschichte",
    visit: "Besuchen",
    contact: "Kontakt",
    rights: "Alle Rechte vorbehalten.",
    privacy: "Datenschutz",
    terms: "Bedingungen",
  },
};

const tr: Dictionary = {
  nav: {
    featured: "Öne çıkan",
    ourStory: "Hikâyemiz",
    products: "Ürünler",
    discover: "Keşfet",
    menu: "Menüyü aç",
    closeMenu: "Menüyü kapat",
    language: "Dil",
  },
  hero: {
    eyebrow: "Tütsü ve Orta Doğu hediyeleri",
    titleLine1: "Eve götürebileceğin",
    titleLine2: "bir gelenek.",
    subtitle:
      "Özenle seçilmiş bakhoor, fenerler, tekstiller ve mücevherler — souk sıcaklığını günlük ritüellerinize taşır.",
    ctaPrimary: "Hikâyemizi keşfedin",
    ctaSecondary: "Koleksiyonu inceleyin",
  },
  featured: {
    eyebrow: "Öne çıkan",
    heading: "Modern souk için seçildi",
    view: "Görüntüle",
    tiles: {
      LARGE: { tag: "Bakhoor", title: "İmza tütsü karışımları" },
      WIDE: { tag: "Fenerler", title: "Akşam ritüelleri için ışık" },
      SMALL_A: { tag: "Tekstiller", title: "Yumuşak miras dokumalar" },
      SMALL_B: { tag: "Mücevher", title: "Sakin anlam taşıyan parçalar" },
    },
  },
  story: {
    eyebrow: "Butik",
    heading: "Hikâyemiz",
    p1: "Al Athaq Boutique, Orta Doğu'nun kokularına ve zanaatına yazılmış bir aşk mektubu olarak doğdu — bir odayı anıyla dolduran bakhoor, akşam ışığını yumuşatan fenerler, sabırla dokunan tekstiller ve sakin anlam taşıyan mücevherler.",
    p2: "Hediye edilebilecek, saklanabilecek ve yeniden dönülebilecek parçalar seçiyoruz: modern evler için miras formlar. Her seçim kişisel — eve götürebileceğin bir gelenek.",
    cta: "Koleksiyonu keşfet",
  },
  products: {
    eyebrow: "Koleksiyon",
    heading: "Eve götürülecek hediyeler",
    subtitle:
      "Bakhoor, fenerler, tekstiller ve mücevherler — miras sıcaklığıyla kürate edildi.",
    items: {
      "royal-oud-bakhoor": {
        name: "Kraliyet Ud Bakhoor",
        description: "Tören akşamları için derin, reçineli bir karışım.",
        category: "Tütsü",
      },
      "amber-rose-incense": {
        name: "Amber Gül Tütsü",
        description: "Yumuşak çiçek notalarıyla sarılmış sıcak amber.",
        category: "Tütsü",
      },
      "mashrabiya-lantern": {
        name: "Mashrabiya Fener",
        description: "Desenli ışık yansıtan delikli metal işi.",
        category: "Fenerler",
      },
      "souk-textile-runner": {
        name: "Souk Tekstil Runner",
        description: "Masalar ve eşikler için dokunmuş sıcaklık.",
        category: "Tekstiller",
      },
      "crescent-pendant": {
        name: "Hilal Kolye Ucu",
        description: "Sıcak metalden zarif bir günlük tılsım.",
        category: "Mücevher",
      },
      "desert-musk-set": {
        name: "Çöl Miski Hediye Seti",
        description: "Bakhoor ve buhurdanlık, hediye etmeye hazır.",
        category: "Hediyeler",
      },
      "heritage-scarf": {
        name: "Miras Şal",
        description: "Klasik geometrik kenarlı hafif tekstil.",
        category: "Tekstiller",
      },
    },
  },
  footer: {
    tagline: "Eve götürebileceğin bir gelenek.",
    shop: "Mağaza",
    boutique: "Butik",
    follow: "Takip et",
    allProducts: "Tüm ürünler",
    featured: "Öne çıkan",
    giftSets: "Hediye setleri",
    ourStory: "Hikâyemiz",
    visit: "Ziyaret",
    contact: "İletişim",
    rights: "Tüm hakları saklıdır.",
    privacy: "Gizlilik",
    terms: "Koşullar",
  },
};

const hi: Dictionary = {
  nav: {
    featured: "विशेष",
    ourStory: "हमारी कहानी",
    products: "उत्पाद",
    discover: "खोजें",
    menu: "मेनू खोलें",
    closeMenu: "मेनू बंद करें",
    language: "भाषा",
  },
  hero: {
    eyebrow: "धूप और मध्य पूर्वी उपहार",
    titleLine1: "परंपरा जिसे आप",
    titleLine2: "घर ले जा सकते हैं।",
    subtitle:
      "चयनित बखूर, लालटेन, वस्त्र और आभूषण — सूक की गर्माहट आपके दैनिक अनुष्ठानों तक।",
    ctaPrimary: "हमारी कहानी जानें",
    ctaSecondary: "संग्रह देखें",
  },
  featured: {
    eyebrow: "विशेष",
    heading: "आधुनिक सूक के लिए चुना गया",
    view: "देखें",
    tiles: {
      LARGE: { tag: "बखूर", title: "विशेष धूप मिश्रण" },
      WIDE: { tag: "लालटेन", title: "संध्या अनुष्ठानों का प्रकाश" },
      SMALL_A: { tag: "वस्त्र", title: "कोमल विरासत बुनावट" },
      SMALL_B: { tag: "आभूषण", title: "शांत अर्थ वाले टुकड़े" },
    },
  },
  story: {
    eyebrow: "बुटीक",
    heading: "हमारी कहानी",
    p1: "अल अथाक बुटीक मध्य पूर्व की सुगंधों और शिल्प के प्रेमपत्र से शुरू हुआ — स्मृति से भरा बखूर, संध्या को मृदु करने वाली लालटेन, धैर्य से बुने वस्त्र, और शांत अर्थ वाले आभूषण।",
    p2: "हम ऐसे टुकड़े चुनते हैं जिन्हें आप दे सकें, रख सकें और लौट सकें: आधुनिक घरों के लिए विरासत रूप। हर चयन व्यक्तिगत है — परंपरा जिसे आप घर ले जा सकते हैं।",
    cta: "संग्रह देखें",
  },
  products: {
    eyebrow: "संग्रह",
    heading: "घर ले जाने योग्य उपहार",
    subtitle:
      "बखूर, लालटेन, वस्त्र और आभूषण — विरासत की गर्माहट के साथ चुने गए।",
    items: {
      "royal-oud-bakhoor": {
        name: "रॉयल ऊद बखूर",
        description: "औपचारिक संध्याओं के लिए गहरा, रालयुक्त मिश्रण।",
        category: "धूप",
      },
      "amber-rose-incense": {
        name: "अम्बर गुलाब धूप",
        description: "कोमल पुष्प नोट्स में लिपटा गर्म अम्बर।",
        category: "धूप",
      },
      "mashrabiya-lantern": {
        name: "मशरबिया लालटेन",
        description: "छिद्रित धातु जो पैटर्नयुक्त प्रकाश फैलाती है।",
        category: "लालटेन",
      },
      "souk-textile-runner": {
        name: "सूक टेक्सटाइल रनर",
        description: "मेज़ और देहलियों के लिए बुनी गर्माहट।",
        category: "वस्त्र",
      },
      "crescent-pendant": {
        name: "क्रेसेंट पेंडेंट",
        description: "गर्म धातु में एक परिष्कृत दैनिक ताबीज।",
        category: "आभूषण",
      },
      "desert-musk-set": {
        name: "डेजर्ट मस्क उपहार सेट",
        description: "बखूर और बर्नर, देने के लिए तैयार।",
        category: "उपहार",
      },
      "heritage-scarf": {
        name: "हेरिटेज स्कार्फ",
        description: "क्लासिक ज्यामितीय किनारे वाला हल्का वस्त्र।",
        category: "वस्त्र",
      },
    },
  },
  footer: {
    tagline: "परंपरा जिसे आप घर ले जा सकते हैं।",
    shop: "दुकान",
    boutique: "बुटीक",
    follow: "फॉलो करें",
    allProducts: "सभी उत्पाद",
    featured: "विशेष",
    giftSets: "उपहार सेट",
    ourStory: "हमारी कहानी",
    visit: "आएँ",
    contact: "संपर्क",
    rights: "सर्वाधिकार सुरक्षित।",
    privacy: "गोपनीयता",
    terms: "नियम",
  },
};

export const dictionaries: Record<LocaleCode, Dictionary> = {
  en,
  ar,
  "zh-Hans": zhHans,
  "zh-Hant": zhHant,
  ja,
  tl,
  fr,
  es,
  de,
  tr,
  hi,
};

export function getDictionary(locale: LocaleCode): Dictionary {
  return dictionaries[locale] ?? dictionaries.en;
}
