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
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Link } from 'react-router-dom';
import { WHATSAPP_CONTACT } from '../lib/utils';

import { INITIAL_PRODUCTS } from '../lib/initialData';

export interface AyyanCatalogItem {
  code: string;
  name: string;
  category: string;
  icon: string;
  rate: number;
  per: string;
  description?: string;
  soundLevel?: 'Low / Silent' | 'Medium' | 'High Spectacle' | string;
}

const getProductCategoryGroup = (category: string): string => {
  const cat = category.toLowerCase();
  if (cat.includes('novelty') || cat.includes('novelties')) return 'Novelties';
  if (cat.includes('shell')) return 'Shells';
  if (cat.includes('mega') || cat.includes('display')) return 'Mega Displays';
  if (cat.includes('cake') || cat.includes('shot') || cat.includes('repeater') || cat.includes('multi-shot')) return 'Cakes';
  if (cat.includes('maroon') || cat.includes('cracker')) return 'Maroons';
  if (cat.includes('sparkler')) return 'Sparklers';
  if (cat.includes('chakkar')) return 'Chakkars';
  if (cat.includes('wheel')) return 'Wheels';
  if (cat.includes('fountain') || cat.includes('flower pot') || cat.includes('rangoli')) return 'Fountains';
  if (cat.includes('rocket') || cat.includes('missile')) return 'Rockets';
  if (cat.includes('match')) return 'Matches';
  if (cat.includes('gift') || cat.includes('assorted')) return 'Gift Boxes';
  return category;
};

const getCategoryIcon = (category: string, name: string): string => {
  const cat = category.toLowerCase();
  const n = name.toLowerCase();
  if (cat.includes('maroon') || n.includes('cracker')) return '🧨';
  if (cat.includes('sparkler')) return '✨';
  if (cat.includes('chakkar')) return '🌀';
  if (cat.includes('wheel')) return '🎡';
  if (cat.includes('fountain') || cat.includes('flower pot') || cat.includes('rangoli')) return '🌋';
  if (cat.includes('rocket') || cat.includes('missile')) return '🚀';
  if (cat.includes('mega') || cat.includes('display')) return '🌟';
  if (cat.includes('cake') || cat.includes('shots') || cat.includes('repeater')) return '🎆';
  if (cat.includes('shell')) return '💥';
  if (cat.includes('novel') || n.includes('shot') || n.includes('drone') || n.includes('helicopter') || n.includes('spinner') || n.includes('mini')) return '🛸';
  if (cat.includes('match')) return '🔥';
  if (cat.includes('gift') || cat.includes('assorted')) return '🎁';
  return '✨';
};

// FULL 120+ MASTER INVENTORY LOADED DYNAMICALLY
export const OFFICIAL_AYYAN_CATALOG: AyyanCatalogItem[] = INITIAL_PRODUCTS.map((prod, idx) => {
  const code = prod.code || (prod.id.startsWith('ayyan-') ? prod.id.replace('ayyan-', '').slice(0, 10).toUpperCase() : `AY-${idx + 1}`);
  return {
    code,
    name: prod.name,
    category: getProductCategoryGroup(prod.category),
    icon: getCategoryIcon(prod.category, prod.name),
    rate: prod.price,
    per: prod.piece_count || 'piece',
    description: prod.description,
    soundLevel: prod.sound_level as any,
  };
});

export const CATEGORIES_LIST = [
  'ALL',
  'Novelties',
  'Shells',
  'Cakes',
  'Mega Displays',
  'Maroons',
  'Sparklers',
  'Chakkars',
  'Wheels',
  'Fountains',
  'Rockets',
  'Matches',
  'Gift Boxes'
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
