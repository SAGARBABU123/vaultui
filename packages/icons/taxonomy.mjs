/**
 * Vault Icons — master taxonomy.
 *
 * Ten development categories, evaluated in priority order (first match wins).
 * Every icon lands in exactly one category, so the inventory can never lose an
 * icon to a "misc" bucket.
 */

export const CATEGORIES = [
  {
    id: "core-ui",
    label: "Core UI & Interface",
    blurb: "Menus, navigation chrome, actions, users and account affordances.",
  },
  {
    id: "arrows-navigation",
    label: "Arrows & Navigation",
    blurb: "Directional arrows, carets, chevrons, resize and movement.",
  },
  {
    id: "alerts-status",
    label: "Alerts & Status",
    blurb: "Warnings, confirmations, shields, timers and system state.",
  },
  {
    id: "dev-data",
    label: "Development & Data",
    blurb: "Code, terminals, databases, servers, git and cloud plumbing.",
  },
  {
    id: "text-editing",
    label: "Text Editing",
    blurb: "Typography controls, formatting, links and writing tools.",
  },
  {
    id: "media-devices",
    label: "Media & Devices",
    blurb: "Playback, audio, capture, screens and hardware.",
  },
  {
    id: "files-folders",
    label: "Files & Folders",
    blurb: "Documents, archives, books, folders and storage.",
  },
  {
    id: "commerce-finance",
    label: "Commerce & Finance",
    blurb: "Carts, currency, charts, wallets and pricing.",
  },
  {
    id: "communication",
    label: "Communication",
    blurb: "Mail, chat, telephony, broadcast and social.",
  },
  {
    id: "objects-life",
    label: "Objects & Lifestyle",
    blurb: "Transport, food, nature, sports, health, household and people.",
  },
];

export const CATEGORY_IDS = CATEGORIES.map((c) => c.id);

const SOCIAL = [
  "behance", "discord", "dribbble", "facebook", "fediverse", "goodreads",
  "instagram", "lastfm", "linkedin", "linktree", "mastodon", "medium",
  "messenger", "meta", "patreon", "pinterest", "reddit", "skype", "slack",
  "snapchat", "soundcloud", "spotify", "steam", "telegram", "threads",
  "tiktok", "tumblr", "twitch", "twitter", "wechat", "whatsapp", "x", "youtube",
  "tidal", "pix", "read-cv", "ny-times",
];

const DEV_BRANDS = [
  "android", "apple", "app-store", "coda", "codepen", "codesandbox", "dev-to",
  "dropbox", "figma", "framer", "github", "gitlab", "google", "google-chrome",
  "google-drive", "google-play", "linux", "markdown", "matrix", "notion",
  "open-ai", "phosphor", "replit", "sketch", "stack-overflow", "windows",
  "microsoft", "npm", "docker", "supabase", "vercel",
];

const FINANCE_BRANDS = ["amazon", "paypal", "stripe", "visa", "mastercard"];

/** token === name or name.startsWith(token + "-") */
const prefix = (name, token) => name === token || name.startsWith(token + "-");
const anyPrefix = (name, tokens) => tokens.some((t) => prefix(name, t));

const RULES = [
  { id: "communication", match: (n) => anyPrefix(n, SOCIAL) },
  { id: "commerce-finance", match: (n) => anyPrefix(n, FINANCE_BRANDS) },
  { id: "dev-data", match: (n) => anyPrefix(n, DEV_BRANDS) },

  {
    id: "commerce-finance",
    match: (n) =>
      anyPrefix(n, [
        "currency", "shopping", "bag", "basket", "handbag", "coin", "coins",
        "money", "piggy-bank", "wallet", "bank", "credit-card", "cart",
        "hand-coins", "hand-deposit", "hand-withdraw",
        "cash-register", "calculator",
        "percent", "tag", "gift", "medal", "trophy", "trend", "chart", "graph",
        "ranking", "invoice", "receipt", "scales", "storefront", "ticket",
        "barcode", "qr-code", "tip-jar", "treasure-chest", "sales", "discount",
        "coupon", "pricing", "cardholder", "contactless-payment", "charging-station",
      ]),
  },
  {
    id: "communication",
    match: (n) =>
      anyPrefix(n, [
        "envelope", "mail", "mailbox", "chat", "chats", "paper-plane", "phone",
        "broadcast", "cell-tower", "cell-signal", "megaphone", "rss",
        "voicemail", "at", "hash", "translate", "user-sound", "share-network",
        "share-fat", "share", "message", "send", "smiley", "mask-happy",
        "mask-sad",
      ]),
  },
  {
    id: "media-devices",
    match: (n) =>
      anyPrefix(n, [
        "play", "pause", "stop", "skip", "rewind", "fast-forward", "speaker",
        "microphone", "video", "camera", "image", "images", "film", "television",
        "radio", "screencast", "airplay", "headphones", "headset", "music",
        "guitar", "piano", "metronome", "disc", "vinyl", "cassette", "equalizer",
        "waveform", "subtitles", "closed-captioning", "eject", "record", "gif",
        "picture-in-picture", "webcam", "projector", "slideshow", "presentation",
        "high-definition", "standard-definition", "playlist", "game-controller",
        "joystick", "virtual-reality", "drone", "boombox", "amplifier",
        "video-conference", "monitor-play", "cast", "wave-sine", "wave-square",
        "wave-sawtooth", "wave-triangle", "waves", "aperture", "crop",
        "disco-ball", "eyedropper", "headphone", "mouse", "panorama", "power",
        "printer", "security-camera", "vignette",
      ]),
  },
  {
    id: "arrows-navigation",
    match: (n) => anyPrefix(n, ["map-pin"]),
  },
  {
    id: "files-folders",
    match: (n) =>
      anyPrefix(n, [
        "file", "files", "folder", "folders", "archive", "book", "books",
        "notebook", "bookmark", "bookmarks", "briefcase", "map", "package",
        "tray", "certificate", "identification", "vault", "cabinet", "lockers",
        "address-book", "floppy-disk",
      ]),
  },
  {
    id: "text-editing",
    match: (n) =>
      anyPrefix(n, [
        "text", "align", "article", "paragraph", "quotes", "link", "scissors",
        "clipboard", "paperclip", "highlighter", "pencil", "pen", "marker",
        "eraser", "signature", "ruler", "list", "indent", "outdent", "backspace",
        "keyboard", "cursor-text", "note", "notepad", "newspaper", "exam",
        "chalkboard", "log", "line-segment", "line-segments", "spell", "type",
      ]),
  },
  {
    id: "dev-data",
    match: (n) =>
      anyPrefix(n, [
        "code", "terminal", "database", "server", "hard-drive", "hard-drives",
        "cpu", "memory", "graphics-card", "git", "cube", "stack", "layout",
        "monitor", "desktop", "laptop", "device", "devices", "computer-tower",
        "cloud", "activity", "pulse", "webhooks", "brackets", "bug", "binary",
        "tree-structure", "tree-view", "network", "globe", "plug", "plugs",
        "usb", "wifi",
        "bluetooth", "browser", "browsers", "app-window", "rows", "columns",
        "grid", "kanban", "function", "matrix", "command", "option", "sim-card",
        "vibrate", "scan", "flow-arrow", "sidebar", "queue", "circuitry",
        "blueprint", "bounding-box", "gradient", "vector", "bezier", "path",
        "polygon", "shapes", "perspective", "three-d", "anchor", "linktree",
      ]),
  },
  {
    id: "alerts-status",
    match: (n) =>
      anyPrefix(n, [
        "warning", "check", "seal", "shield", "flag", "timer", "clock",
        "hourglass", "spinner", "siren", "alarm", "prohibit", "info", "question",
        "first-aid", "heartbeat", "bell", "notification", "lifebuoy", "battery",
        "lock", "gauge", "speedometer", "traffic", "radioactive", "biohazard", "sos",
      ]),
  },
  {
    id: "arrows-navigation",
    match: (n) =>
      anyPrefix(n, [
        "arrow", "arrows", "caret", "chevron", "corner", "corners", "resize",
        "navigation", "compass", "sign-in", "sign-out", "repeat", "refresh",
        "rotate", "shuffle", "swap", "sort", "flip", "split-horizontal",
        "split-vertical", "signpost",
        "stairs", "escalator", "elevator", "road-horizon", "gps", "crosshair",
      ]),
  },
  {
    id: "objects-life",
    match: (n) =>
      anyPrefix(n, [
        // transport
        "airplane", "air-traffic-control", "car", "bus", "truck", "van", "taxi",
        "train", "tram", "subway", "boat", "sailboat", "bicycle", "motorcycle",
        "scooter", "moped", "jeep", "ambulance", "rocket", "tractor",
        "bulldozer", "crane", "forklift", "traffic-cone", "traffic-sign",
        "gas-pump", "gas-can", "tire", "steering-wheel", "seatbelt", "engine",
        "headlights", "bridge", "wheelchair", "footprints", "parachute",
        "flying-saucer", "cable-car", "park", "garage", "charging-station",
        // food & drink
        "bread", "cake", "coffee", "cookie", "pizza", "hamburger", "ice-cream",
        "bowl-food", "bowl-steam", "fork-knife", "wine", "beer-bottle",
        "beer-stein", "brandy", "martini", "champagne", "cooking-pot", "oven",
        "carrot", "pepper", "orange", "cherries", "avocado", "fish", "shrimp",
        "egg", "cheese", "popcorn", "popsicle", "onigiri", "grains", "jar",
        "tea-bag", "pint-glass", "coffee-bean", "hamburger",
        // nature & weather
        "cat", "dog", "bird", "butterfly", "rabbit", "horse", "cow", "paw-print",
        "bone", "tree", "plant", "leaf", "flower", "cactus", "mountains",
        "island", "campfire", "sun", "moon", "snowflake", "rainbow", "tornado",
        "hurricane", "wind", "fire", "flame", "drop", "meteor", "planet",
        "shooting-star", "sparkle", "lightning", "umbrella", "tent", "tipi",
        "lighthouse", "windmill", "barn", "farm", "factory", "warehouse",
        "building", "buildings", "city", "church", "mosque", "synagogue",
        "castle-turret", "tower",
        // sports & games
        "baseball", "basketball", "football", "soccer-ball", "tennis-ball",
        "volleyball", "golf", "hockey", "boxing-glove", "barbell", "ping-pong",
        "bowling-ball", "racquet", "cricket", "boules", "court-basketball",
        "beach-ball", "dice", "cards", "puzzle-piece", "lego", "poker-chip",
        "balloon", "confetti", "pinwheel", "sword", "cross", "crown",
        // clothing & personal
        "shirt", "t-shirt", "hoodie", "pants", "dress", "sock", "sneaker",
        "boot", "high-heel", "coat-hanger", "backpack", "handbag", "belt",
        "beanie", "baseball-cap", "eyeglasses", "sunglasses", "goggles", "watch",
        "visor", "diaper", "baby",
        // health
        "pill", "syringe", "stethoscope", "thermometer", "hospital", "brain",
        "tooth", "bandaids", "face-mask", "virus", "dna", "first-aid-kit",
        "wheelchair-motion", "asclepius", "skull", "potted-plant",
        // household & tools
        "armchair", "couch", "bed", "chair", "desk", "dresser", "lamp", "rug",
        "toilet", "shower", "bathtub", "washing-machine", "fan", "hair-dryer",
        "broom", "toolbox", "wrench", "hammer", "screwdriver", "axe", "shovel",
        "ladder", "pipe-wrench", "paint-brush", "paint-roller", "paint-bucket",
        "palette", "magnet", "flashlight", "fire-extinguisher", "needle",
        "binoculars", "lasso", "anchor-simple", "sketch", "chair",
        // assorted objects that would otherwise fall through to Core UI
        "acorn", "alien", "atom", "bomb", "clover", "club", "spade",
        "cigarette", "cowboy-hat", "detective", "finn-the-human", "ghost",
        "knife", "robot", "feather", "flask", "gavel", "graduation-cap",
        "hard-hat", "head-circuit", "lectern", "microscope", "stamp",
        "sticker", "suitcase", "tote", "recycle", "scroll", "barricade",
        // household, people, health & infrastructure
        "chef-hat", "cheers", "checkerboard", "strategy", "student", "trolley",
        "door", "office-chair", "stool", "seat", "picnic-table", "towel", "wall",
        "swimming-pool", "spray-bottle", "test-tube", "yarn",
        "shipping-container", "solar", "nuclear-plant", "hand", "ear", "eyes",
        "heart", "person", "gender",
      ]),
  },
  // Wave 1-4 routing (batches bd-cn). Evaluated after every existing rule,
  // so only icons that would otherwise fall through to core-ui are affected.
  // Tokens are full names or hyphenated stems; none is a prefix of a
  // pre-existing icon name, so no icon from batches <= bc can move.
  {
    id: "objects-life",
    match: (n) =>
      anyPrefix(n, [
        "airport", "museum", "stadium", "castle", "temple", "dam",
        "observatory", "zoo", "library", "courthouse", "market", "school",
        "hotel", "cinema", "station", "ferry", "tunnel", "hut", "cityscape",
        "circus", "carousel", "national-park", "desert", "desert-island",
        "kaaba", "japanese", "shinto", "hindu", "classical-building",
        "derelict-house", "place-of-worship", "house-with-garden",
        "beach-with-umbrella", "chimney", "fountain", "mountain-cableway",
        "mountain-railway", "aerial-tramway", "monorail", "trolleybus",
        "helicopter", "locomotive", "minibus", "bullet-train",
        "auto-rickshaw", "pickup-truck", "delivery-truck", "motor-boat",
        "passenger-ship", "speedboat", "canoe", "suspension-railway",
        "railway-car", "railway-track", "sled", "skateboard",
        "roller-skate", "roller-coaster", "surfboard", "kick-scooter",
        "sport-utility-vehicle",
        // food & drink
        "bagel", "bento-box", "sushi", "taco", "waffle", "teapot", "teacup",
        "tumbler-glass", "plate", "spoon", "chopsticks", "straw", "cup",
        "soup", "salad", "sandwich", "sauce", "salt", "salt-shaker",
        "spice", "sugar", "flour", "honey", "jam", "juice", "milk",
        "milkshake", "smoothie", "sake", "beer-mug", "banana", "bacon",
        "baguette-bread", "beans", "blueberries", "broccoli", "brownie",
        "bubble", "burrito", "butter", "candy", "chestnut", "chicken",
        "chocolate-bar", "clinking", "coconut", "croissant", "cupcake",
        "curry-rice", "custard", "dango", "dates", "doughnut", "dumpling",
        "eggplant", "falafel", "flatbread", "fondue", "fortune-cookie",
        "french-fries", "frying-pan", "garlic", "glass-of-milk", "grapes",
        "green-salad", "grill", "honeydew", "hot", "kettle", "kiwi-fruit",
        "ladle", "lemon", "lollipop", "lunchbox", "mango", "meat-on-bone",
        "melon", "mushroom", "mustard", "noodles", "oden", "olive", "onion",
        "oyster", "pancakes", "pasta", "pea-pod", "peach", "peanuts",
        "pear", "peeler", "persimmon", "pineapple", "potato", "pretzel",
        "rice", "roasted-sweet-potato", "root-vegetable", "scoop",
        "shaved-ice", "sheaf-of-rice", "shortcake", "soft-ice-cream",
        "spaghetti", "spatula", "strawberry", "takeout-box", "tamale",
        "tangerine", "tart", "tomato", "vinegar", "watermelon", "whisk",
        "bowl-with-spoon", "ice-skate",
        // animals
        "ant", "badger", "beaver", "bee", "bison", "boar", "buffalo",
        "camel", "caterpillar", "centipede", "chick", "chipmunk", "crab",
        "crocodile", "deer", "dodo", "dolphin", "donkey", "dove", "dragon",
        "duck", "eagle", "elephant", "ewe", "flamingo", "fly", "fox",
        "frog", "giraffe", "goat", "goose", "gorilla", "hamster", "hare",
        "hedgehog", "hippopotamus", "hummingbird", "jellyfish", "kangaroo",
        "koala", "lady-beetle", "leopard", "lion", "lizard", "llama",
        "lobster", "mammoth", "monkey", "moose", "mosquito", "octopus",
        "orangutan", "ostrich", "otter", "worm",
        // plants & nature
        "bamboo", "bonsai", "fern", "moss", "vine", "herb", "hibiscus",
        "hyacinth", "maple-leaf", "palm-tree", "seedling", "shamrock",
        "sunflower", "wilted-flower", "comet", "galaxy", "earth", "night",
        "storm", "thunder", "milky-way", "crescent-moon", "full-moon",
        "new-moon", "sunrise", "sunset", "snow-capped-mountain", "volcano",
        // clothing & personal care
        "apron", "ballet-shoes", "bikini", "billed-cap", "duffel-bag",
        "flat-shoe", "gloves", "high-heeled-shoe", "hiking-boot", "jeans",
        "kimono", "lab-coat", "lipstick", "military-helmet", "necklace",
        "purse", "sandal", "scarf", "shorts", "skirt", "stocking", "suit",
        "sweater", "swimsuit", "tie", "top-hat", "toothbrush", "uniform",
        "vest", "wedding-dress", "zipper", "comb", "mirror", "clutch-bag",
        "bow",
        // office, school & stationery
        "abacus", "binder", "card-file-box", "card-index", "diploma",
        "ledger", "stapler", "protractor", "triangle-ruler", "whiteboard",
        "easel", "quill", "typewriter", "round-pushpin", "sticky-note",
        "linked-paperclips", "crate", "peg", "shelf", "spool", "clamp",
        "crayon", "sewing-needle",
        // household & tools
        "alembic", "basin", "bench", "blender", "candle", "curtain",
        "cushion", "doorknob", "drawer", "dustpan", "faucet", "garbage",
        "heater", "hinge", "hose", "iron", "jug", "lantern", "mattress",
        "mop", "oil-drum", "parasol", "refrigerator", "sink", "toaster",
        "vacuum", "vase", "wastebasket", "watering-can", "fishbowl",
        "teddy-bear", "doll", "nesting-dolls", "pinata", "sparkler",
        "party-horn", "kite", "boomerang", "yo-yo", "barrel", "chains",
        "rosette", "stopwatch", "treadmill", "dumbbell", "jump-rope",
        // health & medical
        "blood-pressure", "crutch", "defibrillator", "ecg", "mri",
        "forceps", "hearing-aid", "iv-drip", "medical-symbol",
        "medical-bag", "oxygen-tank", "patient-chart", "pharmacy-cross",
        "posture-check", "scalpel", "ultrasound", "vaccination",
        "vaccine-vial", "walker", "adhesive-bandage", "ct-scan",
        // sport, music & games
        "accordion", "archery", "badminton", "banjo", "cello", "chess",
        "dart", "diving-mask", "drum", "field-hockey", "fishing-pole",
        "flute", "harmonica", "harp", "mallet", "maracas", "match",
        "paddle", "rugby-football", "saxophone", "shuttlecock", "snowman",
        "trombone", "trumpet", "violin", "whistle", "slot-machine",
        "ferris-wheel", "crystal-ball", "gem-stone", "scale",
        "children-crossing", "carp-streamer", "diya-lamp", "fleur-de-lis",
        "menorah", "firecracker",
        // mixed objects & culture
        "wing", "wood", "bubbles", "ear-of-corn", "love-letter",
        "white-cane", "splatter", "spiral-calendar", "spiral-notepad",
        "stop-sign", "tear-off-calendar", "umbrella-on-ground",
        "water-pistol", "wind-chime", "roll-of-paper", "baggage-claim",
        "customs", "convenience-store", "horizontal-traffic-light",
        "left-luggage", "luggage", "passport-control", "post-office",
        "playground-slide", "police-car-light", "satellite", "ship",
        "small-airplane", "ballot-box", "black-nib", "pushpin",
        "ink-bottle", "microbe", "petri-dish", "contact-lens", "cane",
        "ring", "american-football", "bottle-with-popping-cork",
        "brown-mushroom", "amphora", "ketchup", "muffin", "dragonfly",
        "droplet", "rock", "canvas", "cartridge", "dagger", "drill", "hook",
        "level", "mousetrap", "nail", "bolt", "bottle-opener", "crowbar",
      ]),
  },
  {
    id: "dev-data",
    match: (n) =>
      anyPrefix(n, [
        // domain, DNS & hosting
        "domain", "domain-check", "domain-plus", "domain-x", "domain-email",
        "dns", "dns-record", "mx-record", "name-server", "registrar",
        "whois", "ssl", "tls", "hosting", "data-center", "cdn",
        "load-balancer",
        // network & perimeter
        "firewall", "vpn", "router", "gateway", "subnet", "packet",
        "packet-capture", "proxy", "reverse-proxy", "topology", "ethernet",
        "fiber", "bandwidth", "latency", "hub", "modem", "wireless",
        "edge-computing",
        // website & site administration
        "website", "website-settings", "website-builder", "cms",
        "admin-panel", "landing-page", "media-library", "seo", "sitemap",
        "robots", "canonical", "backlink", "keyword", "search-engine",
        "search-console", "og-image", "meta-tags", "social-share",
        "analytics", "conversion", "form", "contact-form", "comments",
        "moderation", "breadcrumb", "footer", "header", "theme", "branding",
        "visitors", "plans", "extension", "multisite", "page", "pages",
        "menu-simple", "image-optimization", "api-key", "integration",
        "plugin", "wysiwyg", "responsive", "cross-browser",
        "mobile-friendly", "site-search", "site-health",
        // release, ops & health
        "deploy", "staging", "production", "environment", "version",
        "rollback", "draft", "publish", "purge-cache", "cache",
        "maintenance", "uptime", "downtime", "status-page", "performance",
        "web-vitals", "error-tracking", "error-404", "error-500",
        "ab-testing", "feature-flag", "monitoring", "failover",
        "disaster-recovery", "backup", "restore", "patch",
        "patch-management",
        // integrity & mail authentication
        "checksum", "integrity", "cmdb", "spf", "dkim", "dmarc",
        "ip-address", "ipv6", "ips", "port", "port-scan", "access-point",
        "feed",
        // domain and hosting extras
        "subdomain", "redirect", "rack", "favicon",
      ]),
  },
  {
    id: "alerts-status",
    match: (n) =>
      anyPrefix(n, [
        // threats & malware
        "threat", "threat-intel", "threat-hunting", "malware", "ransomware",
        "phishing", "smishing", "spear-phishing", "honeypot", "adware",
        "spyware", "rootkit", "trojan", "keylogger", "botnet", "backdoor",
        "antivirus", "spam", "scam", "cyber-attack", "attack-surface",
        "kill-chain", "brute-force", "exploit", "pentest", "vulnerability",
        "vulnerability-scan", "zero-day", "zero-trust", "cve",
        // security operations
        "siem", "soar", "soc", "edr", "xdr", "waf", "dlp", "iam", "pam",
        "hsm", "tpm", "ids",
        // crypto & privacy
        "encryption", "decryption", "e2e-encryption", "cipher", "privacy",
        "redact", "anonymize", "dark-web", "secrets", "key-rotation",
        "digital-signature", "secure-boot", "secure-messaging",
        "secure-file-transfer", "security-key", "quarantine",
        "risk-assessment", "containment", "endpoint", "endpoint-protection",
        "exfiltration", "hacker",
        // abuse & bot defence
        "bot-protection", "captcha", "blue-team", "red-team", "purple-team",
        // attack extras
        "ddos", "casb", "data-leak", "alert-settings",
      ]),
  },
  {
    id: "core-ui",
    match: () => true,
  },
];

export function classify(name) {
  for (const rule of RULES) {
    if (rule.match(name)) return rule.id;
  }
  return "core-ui";
}

/**
 * Search aliases reconcile the shared nomenclature (lucide/heroicons style,
 * e.g. "menu", "close", "log-in") with the canonical geometry names.
 */
export const ALIASES = {
  menu: ["list", "sidebar"],
  "menu-alt": ["sidebar-simple"],
  close: ["x"],
  "close-circle": ["x-circle"],
  search: ["magnifying-glass"],
  "zoom-in": ["magnifying-glass-plus"],
  "zoom-out": ["magnifying-glass-minus"],
  settings: ["gear-six"],
  cog: ["gear"],
  sliders: ["sliders-horizontal"],
  filter: ["funnel"],
  grid: ["grid-four", "squares-four"],
  list: ["list"],
  "more-horizontal": ["dots-three"],
  "more-vertical": ["dots-three-vertical"],
  "external-link": ["arrow-square-out"],
  share: ["share-network"],
  download: ["download-simple"],
  upload: ["upload-simple"],
  trash: ["trash", "trash-simple"],
  edit: ["pencil-simple"],
  copy: ["copy-simple"],
  save: ["floppy-disk"],
  "eye-off": ["eye-slash"],
  unlock: ["lock-simple-open"],
  home: ["house"],
  dashboard: ["squares-four"],
  "refresh-cw": ["arrows-clockwise"],
  "refresh-ccw": ["arrows-counter-clockwise"],
  "rotate-cw": ["arrow-clockwise"],
  "log-in": ["sign-in"],
  "log-out": ["sign-out"],
  maximize: ["corners-out"],
  minimize: ["corners-in"],
  "dollar-sign": ["currency-dollar"],
  euro: ["currency-eur"],
  pound: ["currency-gbp"],
  bitcoin: ["currency-btc"],
  award: ["medal"],
  "trending-up": ["trend-up"],
  "trending-down": ["trend-down"],
  "pie-chart": ["chart-pie"],
  "bar-chart": ["chart-bar"],
  "bar-chart-2": ["chart-bar-horizontal"],
  mail: ["envelope-simple"],
  "message-circle": ["chat-circle"],
  "message-square": ["chat-centered"],
  send: ["paper-plane-tilt"],
  "phone-missed": ["phone-x"],
  "phone-off": ["phone-slash"],
  contact: ["address-book"],
  "radio-tower": ["cell-tower"],
  "chat-bubble": ["chat-teardrop"],
  server: ["hard-drives"],
  webhook: ["webhooks-logo"],
  api: ["plug"],
  container: ["cube", "shipping-container"],
  bracket: ["brackets-curly"],
  bold: ["text-b"],
  italic: ["text-italic"],
  type: ["text-t"],
  "align-center": ["text-align-center"],
  "align-justify": ["text-align-justify"],
  "align-left": ["text-align-left"],
  "align-right": ["text-align-right"],
  "list-ordered": ["list-numbers"],
  "list-unordered": ["list-bullets"],
  "link-2": ["link-simple"],
  "edit-2": ["pencil"],
  "edit-3": ["pencil-line"],
  quote: ["quotes"],
  indent: ["text-indent"],
  outdent: ["text-outdent"],
  volume: ["speaker-high"],
  "volume-1": ["speaker-low"],
  "volume-2": ["speaker-high"],
  "volume-x": ["speaker-x"],
  mic: ["microphone"],
  "mic-off": ["microphone-slash"],
  "video-off": ["video-camera-slash"],
  tv: ["television"],
  "file-text": ["file-text"],
  "folder-zip": ["file-zip"],
  "shield-alert": ["shield-warning"],
  "shield-check": ["shield-check"],
  "alert-circle": ["warning-circle"],
  "alert-triangle": ["warning"],
  "check-circle": ["check-circle"],
  "help-circle": ["question"],
  "loader": ["spinner"],
  "warning-hex": ["warning-diamond"],
  "x-octagon": ["x-circle"],

  // navigation & window actions
  "rotate-ccw": ["arrow-counter-clockwise"],
  expand: ["corners-out"],
  collapse: ["corners-in"],
  fullscreen: ["corners-out"],
  external: ["arrow-square-out"],
  "share-2": ["share-network"],
  wifi: ["wifi-high"],
  "wifi-off": ["wifi-slash"],

  // accounts & people
  people: ["users"],
  "add-user": ["user-plus"],
  "remove-user": ["user-minus"],
  "check-user": ["user-check"],

  // files & documents
  document: ["file-text"],
  "file-upload": ["file-arrow-up"],
  "file-download": ["file-arrow-down"],
  "file-search": ["file-magnifying-glass"],
  "folder-add": ["folder-plus"],
  "folder-remove": ["folder-minus"],
  "archive-box": ["archive"],
  map: ["map-trifold"],

  // development, git & cloud
  "pull-request": ["git-pull-request"],
  pr: ["git-pull-request"],
  "source-control": ["git-branch"],
  merge: ["git-merge"],
  commit: ["git-commit"],
  branch: ["git-branch"],
  fork: ["git-fork"],
  diff: ["git-diff"],
  "cloud-upload": ["cloud-arrow-up"],
  "cloud-download": ["cloud-arrow-down"],

  // currency shorthand
  usd: ["currency-dollar"],
  eur: ["currency-eur"],
  gbp: ["currency-gbp"],
  btc: ["currency-btc"],
  yen: ["currency-jpy"],
  rupee: ["currency-inr"],

  // media & audio
  film: ["film-reel", "film-strip"],
  cast: ["airplay", "screencast"],
  speaker: ["speaker-high", "speaker-hifi"],
  headphone: ["headphones"],
  "volume-off": ["speaker-slash"],
  mute: ["speaker-x"],
  "bell-off": ["bell-slash"],

  // editing & destructive actions
  underline: ["text-underline"],
  "trash-2": ["trash-simple"],
  delete: ["trash"],
};
