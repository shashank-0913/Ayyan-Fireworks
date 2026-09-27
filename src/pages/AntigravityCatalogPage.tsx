import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import Matter from 'matter-js';
import { 
  Sparkles, 
  RotateCcw, 
  Zap, 
  Search, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  X, 
  Phone,
  ArrowLeft,
  CalendarCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Link } from 'react-router-dom';
import { WHATSAPP_CONTACT } from '../lib/utils';

export interface AyyanCatalogItem {
  code: string;
  name: string;
  category: 'Maroons' | 'Sparklers' | 'Chakkars' | 'Wheels' | 'Fountains' | 'Rockets' | 'Cakes' | 'Matches';
  icon: string;
  rate: number;
  per: string;
  description?: string;
  soundLevel?: 'Low / Silent' | 'Medium' | 'High Spectacle';
}

// COMPLETE CATALOG FROM OFFICIAL AYYAN PRICE LISTS
export const OFFICIAL_AYYAN_CATALOG: AyyanCatalogItem[] = [
  // 1. Maroons
  { code: "0801", name: "Ganesh Crackers", category: "Maroons", icon: "🧨", rate: 3605, per: "100 Pkts", description: "Authentic Sivakasi traditional red maroons with crisp gunpowder report.", soundLevel: "High Spectacle" },
  { code: "0803", name: "Lakshmi Crackers", category: "Maroons", icon: "🧨", rate: 2070, per: "100 Pkts", description: "Classic single-sound festive crackers with loud sharp burst.", soundLevel: "High Spectacle" },
  { code: "0802", name: "Bengal Prince Crackers", category: "Maroons", icon: "🧨", rate: 3605, per: "100 Pkts", description: "Royal-grade sound crackers with supreme decibel clarity.", soundLevel: "High Spectacle" },
  { code: "0804", name: "King Crackers", category: "Maroons", icon: "🧨", rate: 2070, per: "100 Pkts", description: "High-decibel celebration crackers for Diwali & auspicious occasions.", soundLevel: "High Spectacle" },
  { code: "0805", name: "Jawan Crackers", category: "Maroons", icon: "🧨", rate: 1615, per: "100 Pkts", description: "Medium-range family crackers with reliable fast ignition.", soundLevel: "Medium" },
  { code: "0806", name: "Bird Crackers", category: "Maroons", icon: "🧨", rate: 835, per: "100 Pkts", description: "Compact quick-burst family celebration sound crackers.", soundLevel: "Medium" },

  // 2. Sparklers
  { code: "0101", name: "7 cm Electric Sparklers", category: "Sparklers", icon: "✨", rate: 1175, per: "100 Boxes", description: "Pure silver glitter sparklers with smokeless formula.", soundLevel: "Low / Silent" },
  { code: "0102", name: "7 cm Coloured Sparklers", category: "Sparklers", icon: "✨", rate: 1325, per: "100 Boxes", description: "Vibrant multi-colored sparkling handheld sticks.", soundLevel: "Low / Silent" },
  { code: "0103", name: "9 cm Electric Sparklers", category: "Sparklers", icon: "✨", rate: 1325, per: "100 Boxes", description: "Extended duration gold and silver sparkling star discharge.", soundLevel: "Low / Silent" },
  { code: "0104", name: "9 cm Coloured Sparklers", category: "Sparklers", icon: "✨", rate: 1500, per: "100 Boxes", description: "Rich emerald, ruby, and golden star bursts safe for kids.", soundLevel: "Low / Silent" },
  { code: "0105", name: "10 cm Ruby Sparklers", category: "Sparklers", icon: "✨", rate: 210, per: "10 Boxes", description: "Deep ruby red sparkling glow with minimal smoke.", soundLevel: "Low / Silent" },
  { code: "0109", name: "12 cm Electric Sparklers", category: "Sparklers", icon: "✨", rate: 180, per: "10 Boxes", description: "Bright white electric sparklers with steady burn.", soundLevel: "Low / Silent" },
  { code: "0110", name: "12 cm Coloured Sparklers", category: "Sparklers", icon: "✨", rate: 240, per: "10 Boxes", description: "4-color changing dazzling handheld fireworks.", soundLevel: "Low / Silent" },
  { code: "0111", name: "15 cm Electric Sparklers", category: "Sparklers", icon: "✨", rate: 400, per: "10 Boxes", description: "Long glitter sticks for weddings, parties, and festive entrances.", soundLevel: "Low / Silent" },
  { code: "0112", name: "15 cm Coloured Sparklers", category: "Sparklers", icon: "✨", rate: 530, per: "10 Boxes", description: "Heavy multi-color sparkle discharge with long burning time.", soundLevel: "Low / Silent" },
  { code: "0115", name: "15 cm Panchavarnam 5 In 1", category: "Sparklers", icon: "✨", rate: 460, per: "10 Boxes", description: "5 distinct color transformations in a single sparkle stick.", soundLevel: "Low / Silent" },
  { code: "0116", name: "30 cm Electric Sparklers", category: "Sparklers", icon: "✨", rate: 400, per: "10 Boxes", description: "Extra-long mega burning family sparkler sticks.", soundLevel: "Low / Silent" },
  { code: "0117", name: "30 cm Coloured Sparklers", category: "Sparklers", icon: "✨", rate: 530, per: "10 Boxes", description: "Vibrant multi-color 30cm sparklers with long burn.", soundLevel: "Low / Silent" },
  { code: "0118", name: "50 cm Electric Sparklers", category: "Sparklers", icon: "✨", rate: 1020, per: "10 Boxes", description: "Giant 50cm sparklers with over 3 minutes of continuous burn.", soundLevel: "Low / Silent" },
  { code: "0119", name: "50 cm Coloured Sparklers", category: "Sparklers", icon: "✨", rate: 1260, per: "10 Boxes", description: "Mega colored sparkling sticks for extended celebrations.", soundLevel: "Low / Silent" },
  { code: "0120", name: "75 cm Electric Sparklers", category: "Sparklers", icon: "✨", rate: 1700, per: "10 Boxes", description: "Giant 75cm mega handheld fireworks.", soundLevel: "Low / Silent" },
  { code: "0123", name: "Rajadhani Sparklers (5 Varieties)", category: "Sparklers", icon: "✨", rate: 238, per: "Box", description: "Assorted 5 premium varieties in single pack.", soundLevel: "Low / Silent" },

  // 3. Chakkars
  { code: "0201", name: "Ground Chakkar Medium", category: "Chakkars", icon: "🌀", rate: 248, per: "4 Boxes", description: "High-speed golden rotating wheel on smooth ground.", soundLevel: "Low / Silent" },
  { code: "0202", name: "Ground Chakkar Big", category: "Chakkars", icon: "🌀", rate: 350, per: "4 Boxes", description: "Wide-radius silver spinner with rapid rotational velocity.", soundLevel: "Low / Silent" },
  { code: "0203", name: "Ground Chakkar Special", category: "Chakkars", icon: "🌀", rate: 820, per: "10 Boxes", description: "Special long-running sparkling ground spinner.", soundLevel: "Low / Silent" },
  { code: "0204", name: "Ground Chakkar Deluxe", category: "Chakkars", icon: "🌀", rate: 1450, per: "10 Boxes", description: "Deluxe dual-color rotational fireworks wheel.", soundLevel: "Low / Silent" },
  { code: "0205", name: "Krishna Chakkar Big", category: "Chakkars", icon: "🌀", rate: 440, per: "4 Boxes", description: "Legendary Bunny Brand Krishna design with brilliant aura.", soundLevel: "Low / Silent" },
  { code: "0206", name: "Krishna Chakkar Special", category: "Chakkars", icon: "🌀", rate: 860, per: "10 Boxes", description: "Extended duration rotating ground fireworks.", soundLevel: "Low / Silent" },

  // 4. Wheels
  { code: "0208", name: "Giant Wheel", category: "Wheels", icon: "🎡", rate: 103, per: "Box", description: "Dynamic rotating wheel with dual-color aura.", soundLevel: "Low / Silent" },
  { code: "0209", name: "Joke Wheel", category: "Wheels", icon: "🎡", rate: 103, per: "Box", description: "Whimsical spinning wheel with surprise crackling finish.", soundLevel: "Low / Silent" },
  { code: "0210", name: "Star Wheel", category: "Wheels", icon: "🎡", rate: 88, per: "Box", description: "Brilliant star-shaped spinning ground wheel.", soundLevel: "Low / Silent" },
  { code: "0211", name: "Classic Wheel", category: "Wheels", icon: "🎡", rate: 174, per: "Box", description: "High rotational speed with gold aura.", soundLevel: "Low / Silent" },
  { code: "0212", name: "Whistling Wheel", category: "Wheels", icon: "🎡", rate: 112, per: "Box", description: "Auditory spinning wheel producing a pleasant musical whistle.", soundLevel: "Medium" },
  { code: "0215", name: "Glittering Wheel", category: "Wheels", icon: "🎡", rate: 100, per: "Box", description: "Multi-color glittering rotation effect.", soundLevel: "Low / Silent" },
  { code: "0221", name: "Lotus Wheel", category: "Wheels", icon: "🎡", rate: 70, per: "Box", description: "Petal-shaped floral fountain spinner mimicking a blooming lotus.", soundLevel: "Low / Silent" },

  // 5. Fountains
  { code: "0301", name: "Flower Pots Small", category: "Fountains", icon: "🌋", rate: 500, per: "10 Boxes", description: "Golden shower fountain shooting 8 feet high.", soundLevel: "Low / Silent" },
  { code: "0302", name: "Flower Pots Big", category: "Fountains", icon: "🌋", rate: 800, per: "10 Boxes", description: "Volcanic gold and silver sparkling shower with wide canopy.", soundLevel: "Low / Silent" },
  { code: "0303", name: "Flower Pots Special", category: "Fountains", icon: "🌋", rate: 1250, per: "10 Boxes", description: "Extra high sparkling canopy cone fountain.", soundLevel: "Low / Silent" },
  { code: "0304", name: "Flower Pots Giant", category: "Fountains", icon: "🌋", rate: 265, per: "Box", description: "Towering 15-foot sparkling fountain spray.", soundLevel: "Low / Silent" },
  { code: "0307", name: "Flower Pots Red", category: "Fountains", icon: "🌋", rate: 1430, per: "10 Boxes", description: "Deep ruby red sparkling shower.", soundLevel: "Low / Silent" },
  { code: "0309", name: "Tri Colour Fountain", category: "Fountains", icon: "🌋", rate: 215, per: "Box", description: "Three distinct sequential color bursts.", soundLevel: "Low / Silent" },
  { code: "0310", name: "Rangoli", category: "Fountains", icon: "🌋", rate: 136, per: "Box", description: "Floral pattern sparkling stage fountain.", soundLevel: "Low / Silent" },
  { code: "0325", name: "Colour Koti Deluxe", category: "Fountains", icon: "🌋", rate: 368, per: "Box", description: "High power mega canopy fountain.", soundLevel: "Low / Silent" },
  { code: "0311", name: "Jadugar", category: "Fountains", icon: "🪄", rate: 155, per: "Box", description: "Multi-color morphing stage fountain with ruby-to-emerald transitions.", soundLevel: "Low / Silent" },
  { code: "0312", name: "Manoranjan", category: "Fountains", icon: "🪄", rate: 155, per: "Box", description: "Colorful family celebration stage effect.", soundLevel: "Low / Silent" },
  { code: "0313", name: "Roopkhela", category: "Fountains", icon: "🪄", rate: 270, per: "Box", description: "Multi-shade sparkling fountain.", soundLevel: "Low / Silent" },
  { code: "0314", name: "Varnajal", category: "Fountains", icon: "🪄", rate: 242, per: "Box", description: "Vibrant shower cascade.", soundLevel: "Low / Silent" },
  { code: "0322", name: "Fire Drops", category: "Fountains", icon: "🔥", rate: 74, per: "Box", description: "Cascading golden rain drops with red strobe accents.", soundLevel: "Low / Silent" },
  { code: "0323", name: "Snow Patrol", category: "Fountains", icon: "🔥", rate: 74, per: "Box", description: "Silver white sparkling shower effect.", soundLevel: "Low / Silent" },
  { code: "0336", name: "Mega Peacock", category: "Fountains", icon: "🦚", rate: 288, per: "Box", description: "Broad multi-nozzle fan fountain mimicking majestic peacock feathers.", soundLevel: "Low / Silent" },

  // 6. Rockets
  { code: "1202", name: "Colour Rocket", category: "Rockets", icon: "🚀", rate: 650, per: "10 Boxes", description: "High-altitude vertical ascent with starry color parachute.", soundLevel: "High Spectacle" },
  { code: "1203", name: "Rocket Bomb", category: "Rockets", icon: "🚀", rate: 794, per: "10 Boxes", description: "Fast whistling ascent ending in heavy aerial salute report.", soundLevel: "High Spectacle" },
  { code: "1204", name: "Flower Missile", category: "Rockets", icon: "🚀", rate: 750, per: "10 Boxes", description: "Rocket with sparkling floral spray trailing the sky.", soundLevel: "High Spectacle" },
  { code: "1205", name: "Sound Missile", category: "Rockets", icon: "🚀", rate: 930, per: "10 Boxes", description: "Whistling high report aerial missile.", soundLevel: "High Spectacle" },
  { code: "1210", name: "Parachute Rocket", category: "Rockets", icon: "🪂", rate: 215, per: "Box", description: "Ascends 100+ meters and slowly descends with a glowing color flare.", soundLevel: "Low / Silent" },
  { code: "1213", name: "Air Whistle", category: "Rockets", icon: "🚀", rate: 145, per: "Box", description: "Auditory whistling sky rocket.", soundLevel: "Medium" },

  // 7. Cakes
  { code: "1701", name: "Dekhe Man - 12 Star", category: "Cakes", icon: "🎆", rate: 120, per: "Box", description: "Sequential 12-star multi-color night sky barrage.", soundLevel: "High Spectacle" },
  { code: "1770", name: "Daisy Bees - 12 Star Yellow", category: "Cakes", icon: "🎆", rate: 127, per: "Box", description: "Dancing yellow comet stars with crackling.", soundLevel: "High Spectacle" },
  { code: "1705", name: "Sky Storm - 12 Shot", category: "Cakes", icon: "🎆", rate: 128, per: "Box", description: "Thunderous aerial breaks with palm tree brocade effects.", soundLevel: "High Spectacle" },
  { code: "1702", name: "Chal Mere Sath - 25 Shot", category: "Cakes", icon: "🎆", rate: 238, per: "Box", description: "25-shot rapid-fire canopy filled with golden willow stars.", soundLevel: "High Spectacle" },
  { code: "1712", name: "Thor - 25 Shots", category: "Cakes", icon: "🎆", rate: 310, per: "Box", description: "Heavy caliber thunder shots with titanium salute bursts.", soundLevel: "High Spectacle" },
  { code: "1703", name: "Dil Maange More - 50 Shots", category: "Cakes", icon: "🎆", rate: 416, per: "Box", description: "50-shot non-stop aerial fiesta with glitter and strobe effects.", soundLevel: "High Spectacle" },
  { code: "1731", name: "Wonder Night - 60 Shots", category: "Cakes", icon: "🎆", rate: 825, per: "Box", description: "60-shot sequential multi-color barrage.", soundLevel: "High Spectacle" },
  { code: "1744", name: "Subha Mangal - 500 Shots", category: "Cakes", icon: "🎆", rate: 7500, per: "Box", description: "Grand finale 500-shot non-stop pyrotechnic display cake.", soundLevel: "High Spectacle" },
  { code: "1745", name: "Sarva Mangal - 1000 Shots", category: "Cakes", icon: "🎆", rate: 15000, per: "Box", description: "Grand pyrotechnic 1000-shot finale display.", soundLevel: "High Spectacle" },

  // 8. Matches
  { code: "0103-M", name: "Camel POPS Matches", category: "Matches", icon: "🔥", rate: 2090, per: "600 Boxes", description: "Safe color-flame friction safety match lights.", soundLevel: "Low / Silent" },
  { code: "0104-M", name: "Camel NINJA Matches", category: "Matches", icon: "🔥", rate: 3595, per: "600 Boxes", description: "Heavy glow stormproof ignition matches for fireworks.", soundLevel: "Low / Silent" },
  { code: "0205-M", name: "Ayyan TWYLA Matches 5 Colours", category: "Matches", icon: "🔥", rate: 1950, per: "600 Boxes", description: "5 color flame friction match lights.", soundLevel: "Low / Silent" }
];

export const CATEGORIES_LIST = [
  'ALL',
  'Maroons',
  'Sparklers',
  'Chakkars',
  'Wheels',
  'Fountains',
  'Rockets',
  'Cakes',
  'Matches'
] as const;

// Synthesized Sound Effects
function playSynthesizedTone(type: 'pop' | 'blast' | 'chime', soundEnabled = true) {
  if (!soundEnabled) return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === 'pop') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320 + Math.random() * 180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } else if (type === 'blast') {
      // Deep bass rumble + high sizzle
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } else if (type === 'chime') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch (e) {
    // AudioContext blocked
  }
}

export const AntigravityCatalogPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Filter and Interactive State
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [gravityMode, setGravityMode] = useState<'antigravity' | 'zero' | 'earth' | 'moon'>('antigravity');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [activeModalProduct, setActiveModalProduct] = useState<AyyanCatalogItem | null>(null);

  // Matter.js Refs
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const nodesRef = useRef<{ body: Matter.Body; el: HTMLDivElement }[]>([]);
  const wallsRef = useRef<Matter.Body[]>([]);

  // Filtered Items
  const filteredItems = useMemo(() => {
    return OFFICIAL_AYYAN_CATALOG.filter(item => {
      if (selectedCategory !== 'ALL' && item.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = item.name.toLowerCase().includes(q);
        const matchCode = item.code.toLowerCase().includes(q);
        const matchCat = item.category.toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchCat) return false;
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  // Adjust gravity on mode change
  useEffect(() => {
    if (!engineRef.current) return;
    switch (gravityMode) {
      case 'antigravity':
        engineRef.current.gravity.y = -0.035;
        engineRef.current.gravity.x = 0;
        break;
      case 'zero':
        engineRef.current.gravity.y = 0;
        engineRef.current.gravity.x = 0;
        break;
      case 'moon':
        engineRef.current.gravity.y = 0.18;
        engineRef.current.gravity.x = 0;
        break;
      case 'earth':
        engineRef.current.gravity.y = 0.85;
        engineRef.current.gravity.x = 0;
        break;
    }
  }, [gravityMode]);

  // Radial Firework Shockwave Blast
  const triggerFireworkBlast = useCallback(() => {
    if (!engineRef.current) return;

    confetti({
      particleCount: 160,
      spread: 140,
      origin: { y: 0.5 },
      colors: ['#ffcc00', '#ff5500', '#ff0055', '#00e5ff', '#ffffff']
    });

    playSynthesizedTone('blast', soundEnabled);

    const centerX = window.innerWidth / 2;
    const centerY = (window.innerHeight - 70) / 2;

    nodesRef.current.forEach(({ body }) => {
      const dx = body.position.x - centerX;
      const dy = body.position.y - centerY;
      const dist = Math.max(60, Math.sqrt(dx * dx + dy * dy));
      const forceMagnitude = (0.09 + Math.random() * 0.08) * (body.mass || 1);

      Matter.Body.applyForce(body, body.position, {
        x: (dx / dist) * forceMagnitude,
        y: (dy / dist) * forceMagnitude - 0.02
      });
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.4);
    });
  }, [soundEnabled]);

  // Re-cluster items into an orderly galaxy vortex
  const resetClusters = useCallback(() => {
    const w = window.innerWidth;
    const h = window.innerHeight - 70;
    const centerX = w / 2;
    const centerY = h / 2;

    nodesRef.current.forEach(({ body }, index) => {
      const angle = index * 0.45;
      const radius = 60 + index * 10;
      const targetX = Math.max(80, Math.min(w - 80, centerX + Math.cos(angle) * radius));
      const targetY = Math.max(80, Math.min(h - 80, centerY + Math.sin(angle) * radius));

      Matter.Body.setPosition(body, { x: targetX, y: targetY });
      Matter.Body.setVelocity(body, { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 });
      Matter.Body.setAngle(body, (Math.random() - 0.5) * 0.3);
    });
    playSynthesizedTone('chime', soundEnabled);
  }, [soundEnabled]);

  // Setup Matter.js Physics Engine and Sync with DOM cards
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    stage.innerHTML = '';
    nodesRef.current = [];

    const { Engine, Runner, Bodies, Composite, Mouse, MouseConstraint, Events } = Matter;

    const engine = Engine.create();
    engine.gravity.y = gravityMode === 'antigravity' ? -0.035 : gravityMode === 'zero' ? 0 : gravityMode === 'moon' ? 0.18 : 0.85;
    engine.gravity.x = 0;
    engineRef.current = engine;

    const w = stage.clientWidth || window.innerWidth;
    const h = stage.clientHeight || window.innerHeight - 70;

    // Boundary walls enclosing the viewport
    const wallT = 100;
    const walls = [
      Bodies.rectangle(w / 2, -wallT / 2, w * 2, wallT, { isStatic: true }), // top
      Bodies.rectangle(w / 2, h + wallT / 2, w * 2, wallT, { isStatic: true }), // bottom
      Bodies.rectangle(-wallT / 2, h / 2, wallT, h * 2, { isStatic: true }), // left
      Bodies.rectangle(w + wallT / 2, h / 2, wallT, h * 2, { isStatic: true }) // right
    ];
    wallsRef.current = walls;
    Composite.add(engine.world, walls);

    const CARD_W = window.innerWidth < 640 ? 122 : 140;
    const CARD_H = window.innerWidth < 640 ? 138 : 155;

    // Spawn floating cards
    filteredItems.forEach((item) => {
      const spawnX = Math.random() * (w - CARD_W - 60) + 30;
      const spawnY = Math.random() * (h - CARD_H - 60) + 30;

      const body = Bodies.rectangle(spawnX, spawnY, CARD_W, CARD_H, {
        chamfer: { radius: 16 },
        restitution: 0.85,
        frictionAir: 0.02,
        density: 0.001
      });

      // Subtle initial floating drift
      Matter.Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 2.5,
        y: (Math.random() - 0.5) * 2.5
      });

      // Construct DOM card
      const el = document.createElement('div');
      el.className = 'ayyan-floating-card';
      el.style.width = `${CARD_W}px`;
      el.style.height = `${CARD_H}px`;

      const googleQuery = encodeURIComponent(`Ayyan Fireworks ${item.name} Sivakasi`);
      const googleImgSearchUrl = `https://www.google.com/search?tbm=isch&q=${googleQuery}`;

      el.innerHTML = `
        <span class="card-badge">${item.category}</span>
        <div class="card-icon">${item.icon}</div>
        <div class="card-title">${item.name}</div>
        <div class="card-code">Code: ${item.code}</div>
        <div class="card-price-row">
          <span class="card-price">₹${item.rate}</span>
          <a class="card-link" href="${googleImgSearchUrl}" target="_blank" rel="noopener noreferrer" title="View Ayyan photo on Google">Photo ↗</a>
        </div>
      `;

      // Distinguish click vs drag
      let dragDistance = 0;
      let startMouse = { x: 0, y: 0 };

      el.addEventListener('mousedown', (e) => {
        startMouse = { x: e.clientX, y: e.clientY };
        dragDistance = 0;
      });

      el.addEventListener('mouseup', (e) => {
        const dx = e.clientX - startMouse.x;
        const dy = e.clientY - startMouse.y;
        dragDistance = Math.sqrt(dx * dx + dy * dy);
        // If it was a click without substantial drag and not clicking the direct link
        const target = e.target as HTMLElement;
        if (dragDistance < 6 && !target.classList.contains('card-link')) {
          setActiveModalProduct(item);
          playSynthesizedTone('pop', soundEnabled);
        }
      });

      stage.appendChild(el);
      nodesRef.current.push({ body, el });
      Composite.add(engine.world, body);
    });

    // Mouse Drag Interaction via MouseConstraint
    const mouse = Mouse.create(stage);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: { stiffness: 0.2, render: { visible: false } }
    });
    Composite.add(engine.world, mouseConstraint);

    // Collision sound trigger
    Events.on(engine, 'collisionStart', (event) => {
      if (event.pairs.length > 0 && Math.random() < 0.2) {
        playSynthesizedTone('pop', soundEnabled);
      }
    });

    // Animation Render Loop: Sync Matter Body with DOM transform
    Events.on(engine, 'afterUpdate', () => {
      nodesRef.current.forEach(({ body, el }) => {
        const x = body.position.x - CARD_W / 2;
        const y = body.position.y - CARD_H / 2;
        el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${body.angle}rad)`;
      });
    });

    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    const handleResize = () => {
      const newW = stage.clientWidth || window.innerWidth;
      const newH = stage.clientHeight || window.innerHeight - 70;
      Matter.Body.setPosition(walls[0], { x: newW / 2, y: -wallT / 2 });
      Matter.Body.setPosition(walls[1], { x: newW / 2, y: newH + wallT / 2 });
      Matter.Body.setPosition(walls[2], { x: -wallT / 2, y: newH / 2 });
      Matter.Body.setPosition(walls[3], { x: newW + wallT / 2, y: newH / 2 });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      Runner.stop(runner);
      Engine.clear(engine);
    };
  }, [filteredItems, soundEnabled]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[100vh] min-h-[600px] overflow-hidden select-none font-sans text-white"
      style={{
        background: 'radial-gradient(circle at 50% 30%, #151d2a 0%, #080a0f 100%)',
        touchAction: 'none'
      }}
    >
      {/* Dynamic Background Stardust & Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[120px] filter" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-orange-600/10 blur-[120px] filter" />
      </div>

      {/* ========================================================================= */}
      {/* 1. TOP NAVIGATION & CONTROLS HEADER BAR                                   */}
      {/* ========================================================================= */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-[#0a0e17]/85 backdrop-blur-md border-b border-amber-500/20 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand Title & Back Button */}
        <div className="flex items-center gap-3">
          <Link
            to="/catalogue"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white flex items-center gap-1.5 text-xs font-bold transition-all"
            title="Return to standard 2026 catalogue"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Grid View</span>
          </Link>

          <div>
            <h1 className="text-base sm:text-lg font-extrabold tracking-wide text-amber-400 uppercase flex items-center gap-2">
              <span className="text-lg">💥</span>
              <span>Ayyan Fireworks Factory</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">
              Interactive Floating Price List • Drag & Toss Items ({filteredItems.length} Products)
            </p>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0 no-scrollbar">
          {CATEGORIES_LIST.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
              }`}
            >
              {cat === 'ALL' ? 'All Items' : cat}
            </button>
          ))}
        </div>

        {/* Right Tools: Shockwave, Reset, Sound & Fullscreen */}
        <div className="flex items-center gap-2">
          {/* Shockwave Blast */}
          <button
            onClick={triggerFireworkBlast}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
            title="Ignite Radial Shockwave"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span className="hidden md:inline">Ignite Blast!</span>
          </button>

          {/* Reset Cluster */}
          <button
            onClick={resetClusters}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs transition-colors"
            title="Reset to Galaxy Spiral"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border text-xs transition-colors ${
              soundEnabled ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-white/5 border-white/10 text-slate-400'
            }`}
            title={soundEnabled ? 'Audio Sound Effects Active' : 'Audio Muted'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs transition-colors hidden sm:block"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-amber-400" /> : <Maximize2 className="w-3.5 h-3.5 text-amber-400" />}
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MATTER.JS PHYSICS & STAGE CANVAS                                        */}
      {/* ========================================================================= */}
      <div 
        ref={stageRef}
        id="stage"
        className="absolute top-[70px] left-0 w-full overflow-hidden"
        style={{ height: 'calc(100vh - 70px)' }}
      />

      {/* ========================================================================= */}
      {/* 3. FLOATING GRAVITY & SEARCH DOCK (BOTTOM OVERLAY)                        */}
      {/* ========================================================================= */}
      <div className="absolute bottom-4 inset-x-4 sm:inset-x-8 z-40 pointer-events-none flex flex-col items-center gap-2">
        <div className="px-3.5 py-1 rounded-full bg-black/60 border border-amber-500/20 backdrop-blur-md text-[10px] sm:text-xs text-amber-300/90 font-medium flex items-center gap-1.5 shadow-sm">
          <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
          <span>Click any floating card for full piece counts & WhatsApp direct inquiry</span>
        </div>

        <div className="p-2 sm:p-2.5 rounded-2xl bg-[#0a0e17]/85 border border-amber-500/30 backdrop-blur-xl shadow-2xl pointer-events-auto flex items-center gap-3">
          {/* Gravity Selector */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-0.5 text-[11px] font-bold">
            <button
              onClick={() => setGravityMode('antigravity')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                gravityMode === 'antigravity' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Gentle Antigravity Float (-0.035)"
            >
              Anti-Gravity
            </button>
            <button
              onClick={() => setGravityMode('zero')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                gravityMode === 'zero' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Zero Gravity Float (0.0)"
            >
              Zero-G
            </button>
            <button
              onClick={() => setGravityMode('moon')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                gravityMode === 'moon' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Moon Gravity (0.18)"
            >
              Moon
            </button>
            <button
              onClick={() => setGravityMode('earth')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                gravityMode === 'earth' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Earth Normal Gravity (0.85)"
            >
              Earth
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search code / name..."
              className="w-32 sm:w-44 bg-white/5 border border-white/10 rounded-xl pl-8 pr-2.5 py-1 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. PRODUCT DETAIL MODAL (ON CARD CLICK)                                   */}
      {/* ========================================================================= */}
      {activeModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div 
            className="w-full max-w-md rounded-3xl bg-gradient-to-b from-[#182230] via-[#101724] to-[#0a0d14] border-2 border-amber-400 p-6 sm:p-7 shadow-2xl space-y-5 text-white relative animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveModalProduct(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-4">
              <div className="w-18 h-18 text-4xl rounded-2xl bg-black/60 p-3 border border-amber-400/40 shrink-0 shadow-lg flex items-center justify-center">
                <span>{activeModalProduct.icon}</span>
              </div>

              <div>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  CODE: #{activeModalProduct.code}
                </span>
                <h3 className="text-lg font-black text-white mt-1 leading-tight">
                  {activeModalProduct.name}
                </h3>
                <p className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                  {activeModalProduct.category}
                </p>
              </div>
            </div>

            {/* Price & Specs Box */}
            <div className="p-4 rounded-2xl bg-black/50 border border-amber-500/25 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Official Rate</span>
                <span className="text-xl font-black text-emerald-400">
                  ₹{activeModalProduct.rate.toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Pack / Quantity</span>
                <span className="text-sm font-bold text-slate-200">
                  {activeModalProduct.per}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Sound Profile</span>
                <span className="text-xs font-semibold text-amber-300">
                  {activeModalProduct.soundLevel || 'Medium'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Factory Quality</span>
                <span className="text-xs font-semibold text-emerald-300">
                  PESO Certified
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-300 leading-relaxed">
              {activeModalProduct.description || 'Authentic Sivakasi Bunny Brand formulation manufactured by Ayyan Fireworks under strict quality control.'}
            </p>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <a
                href={`https://wa.me/${WHATSAPP_CONTACT.number}?text=${encodeURIComponent(`Hi! I am inquiring about ${activeModalProduct.name} (Code: #${activeModalProduct.code}, Rate: ₹${activeModalProduct.rate} / ${activeModalProduct.per}) from Ayyan Fireworks.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <Phone className="w-4 h-4" />
                <span>WhatsApp Inquiry</span>
              </a>

              <Link
                to="/book-slot"
                className="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-gold-400 hover:from-amber-400 hover:to-gold-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Book VIP Slot</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. FLOATING CARD CSS                                                      */}
      {/* ========================================================================= */}
      <style>{`
        .ayyan-floating-card {
          position: absolute;
          top: 0;
          left: 0;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 10px 8px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
          cursor: grab;
          user-select: none;
          transform-origin: center center;
          will-change: transform;
          transition: border-color 0.25s, box-shadow 0.25s;
        }
        .ayyan-floating-card:hover {
          border-color: #ff9800;
          box-shadow: 0 0 25px rgba(255, 152, 0, 0.65);
        }
        .ayyan-floating-card:active {
          cursor: grabbing;
        }
        .card-badge {
          font-size: 8.5px;
          font-weight: 700;
          background: rgba(255, 152, 0, 0.2);
          color: #ffb74d;
          border: 1px solid rgba(255, 152, 0, 0.4);
          padding: 1px 6px;
          border-radius: 10px;
          text-transform: uppercase;
        }
        .card-icon {
          font-size: 32px;
          line-height: 1;
          margin: 4px 0;
          filter: drop-shadow(0 2px 8px rgba(255, 200, 0, 0.4));
          pointer-events: none;
        }
        .card-title {
          font-size: 11px;
          font-weight: 600;
          text-align: center;
          line-height: 1.2;
          color: #f8fafc;
          max-height: 26px;
          overflow: hidden;
          pointer-events: none;
        }
        .card-code {
          font-size: 9px;
          color: #94a3b8;
          font-family: monospace;
          pointer-events: none;
        }
        .card-price-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 0 4px;
          margin-top: 2px;
        }
        .card-price {
          font-size: 12px;
          font-weight: 700;
          color: #4ade80;
        }
        .card-link {
          font-size: 9px;
          color: #38bdf8;
          text-decoration: none;
          background: rgba(56, 189, 248, 0.15);
          padding: 2px 6px;
          border-radius: 4px;
          transition: background 0.2s;
        }
        .card-link:hover {
          background: rgba(56, 189, 248, 0.35);
        }
      `}</style>
    </div>
  );
};
