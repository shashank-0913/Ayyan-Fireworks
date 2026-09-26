import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Sparkles, ArrowRight, Flame } from 'lucide-react';

interface FireworkIntroSplashProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  decay: number;
  gravity: number;
  friction: number;
  flicker: boolean;
}

interface Rocket {
  x: number;
  y: number;
  targetY: number;
  vx: number;
  vy: number;
  color: string;
  trail: { x: number; y: number; alpha: number }[];
  exploded: boolean;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  alpha: number;
}

const FESTIVE_PALETTES = [
  ['#F59E0B', '#FBBF24', '#FEF3C7', '#D97706', '#FFFFFF'], // Regal Gold & Amber
  ['#EF4444', '#F87171', '#DC2626', '#FCA5A5', '#FEF08A'], // Festive Crimson & Ruby
  ['#10B981', '#34D399', '#059669', '#6EE7B7', '#FFFFFF'], // Emerald Green
  ['#F59E0B', '#EF4444', '#10B981', '#38BDF8', '#EC4899', '#FFFFFF'], // Grand Multi-color
];

export const FireworkIntroSplash: React.FC<FireworkIntroSplashProps> = ({ onComplete, forceShow = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [phase, setPhase] = useState<1 | 2 | 3>(1);
  const [progress, setProgress] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const stateRef = useRef<{
    rockets: Rocket[];
    particles: Particle[];
    shockwaves: Shockwave[];
    startTime: number;
    hasExplodedFinale: boolean;
    lastLaunchTime: number;
  }>({
    rockets: [],
    particles: [],
    shockwaves: [],
    startTime: 0,
    hasExplodedFinale: false,
    lastLaunchTime: 0,
  });

  // Check Session Storage Flag
  useEffect(() => {
    if (forceShow) {
      setIsVisible(true);
      return;
    }
    const hasSeen = sessionStorage.getItem('hasSeenIntro');
    if (!hasSeen) {
      setIsVisible(true);
    }
  }, [forceShow]);

  // Lock Body Scroll when Splash is active
  useEffect(() => {
    if (isVisible) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow || '';
      };
    }
  }, [isVisible]);

  const handleFinish = useCallback(() => {
    if (isFadingOut) return;
    setIsFadingOut(true);
    sessionStorage.setItem('hasSeenIntro', 'true');

    setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = '';
      if (onComplete) onComplete();
    }, 600);
  }, [isFadingOut, onComplete]);

  // Particle Explosions Generator
  const createExplosion = useCallback((x: number, y: number, paletteIndex?: number, count = 55) => {
    const palette = FESTIVE_PALETTES[paletteIndex ?? Math.floor(Math.random() * FESTIVE_PALETTES.length)];
    const particles: Particle[] = [];

    // Shockwave ring
    stateRef.current.shockwaves.push({
      x,
      y,
      radius: 4,
      maxRadius: Math.random() * 40 + 35,
      color: palette[0],
      alpha: 0.8,
    });

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const speed = Math.random() * 5.5 + 1.5;
      const color = palette[Math.floor(Math.random() * palette.length)];

      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: Math.random() * 2.5 + 1.2,
        alpha: 1,
        decay: Math.random() * 0.015 + 0.012,
        gravity: 0.045,
        friction: 0.975,
        flicker: Math.random() > 0.4,
      });
    }

    stateRef.current.particles.push(...particles);
  }, []);

  // Rocket Launcher
  const launchRocket = useCallback((targetX: number, targetY: number, paletteIdx?: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const startX = targetX + (Math.random() - 0.5) * 60;
    const startY = canvas.height / (window.devicePixelRatio || 1) + 20;

    const dx = targetX - startX;
    const dy = targetY - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const speed = 12 + Math.random() * 3;

    stateRef.current.rockets.push({
      x: startX,
      y: startY,
      targetY,
      vx: (dx / distance) * speed,
      vy: (dy / distance) * speed,
      color: paletteIdx !== undefined ? FESTIVE_PALETTES[paletteIdx][0] : '#FBBF24',
      trail: [],
      exploded: false,
    });
  }, []);

  // Canvas Animation Engine
  useEffect(() => {
    if (!isVisible) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resizeCanvas = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    stateRef.current.startTime = performance.now();
    stateRef.current.hasExplodedFinale = false;
    stateRef.current.rockets = [];
    stateRef.current.particles = [];
    stateRef.current.shockwaves = [];
    stateRef.current.lastLaunchTime = 0;

    let isRunning = true;

    const loop = (timestamp: number) => {
      if (!isRunning) return;

      const elapsed = (timestamp - stateRef.current.startTime) / 1000;
      const totalDuration = 3.6;
      const progressRatio = Math.min(elapsed / totalDuration, 1);
      setProgress(progressRatio * 100);

      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.save();
      ctx.scale(dpr, dpr);

      // Smooth Trail Erase
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(7, 9, 14, 0.22)';
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = 'lighter';

      // Phase Timeline Management
      if (elapsed < 1.2) {
        setPhase(1);
        // Soft pre-launch sparks in phase 1
        if (elapsed > 0.4 && timestamp - stateRef.current.lastLaunchTime > 400) {
          launchRocket(width * (0.2 + Math.random() * 0.6), height * (0.25 + Math.random() * 0.35), 0);
          stateRef.current.lastLaunchTime = timestamp;
        }
      } else if (elapsed < 2.7) {
        setPhase(2);
        // Phase 2: Dynamic Cracker Bursts across left, center, right
        if (timestamp - stateRef.current.lastLaunchTime > 280) {
          const positions = [
            { x: width * 0.2, y: height * 0.28, p: 1 },
            { x: width * 0.8, y: height * 0.32, p: 0 },
            { x: width * 0.5, y: height * 0.22, p: 2 },
            { x: width * 0.35, y: height * 0.4, p: 3 },
            { x: width * 0.65, y: height * 0.38, p: 0 },
          ];
          const chosen = positions[Math.floor(Math.random() * positions.length)];
          launchRocket(chosen.x + (Math.random() - 0.5) * 40, chosen.y + (Math.random() - 0.5) * 40, chosen.p);
          stateRef.current.lastLaunchTime = timestamp;
        }
      } else if (elapsed < 3.4) {
        setPhase(3);
        // Phase 3: Grand Finale simultaneous burst
        if (!stateRef.current.hasExplodedFinale) {
          stateRef.current.hasExplodedFinale = true;
          // Launch 5 grand finale bursts
          createExplosion(width * 0.5, height * 0.25, 3, 80);
          createExplosion(width * 0.28, height * 0.32, 0, 60);
          createExplosion(width * 0.72, height * 0.32, 1, 60);
          createExplosion(width * 0.18, height * 0.42, 2, 50);
          createExplosion(width * 0.82, height * 0.42, 3, 50);
        }
      } else {
        // Auto fade out to website
        handleFinish();
      }

      // 1. Update and Render Rockets
      for (let i = stateRef.current.rockets.length - 1; i >= 0; i--) {
        const r = stateRef.current.rockets[i];
        r.x += r.vx;
        r.y += r.vy;

        // Trail
        r.trail.push({ x: r.x, y: r.y, alpha: 1 });
        if (r.trail.length > 8) r.trail.shift();

        // Render Trail
        ctx.beginPath();
        for (let j = 0; j < r.trail.length; j++) {
          const pt = r.trail[j];
          pt.alpha *= 0.85;
          ctx.strokeStyle = r.color;
          ctx.lineWidth = 2 * pt.alpha;
          if (j === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();

        // Render Rocket Head
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2, 0, Math.PI * 2);
        ctx.fill();

        // Check if reached target
        if (r.y <= r.targetY || r.vy >= 0) {
          createExplosion(r.x, r.y);
          stateRef.current.rockets.splice(i, 1);
        }
      }

      // 2. Update and Render Shockwaves
      for (let i = stateRef.current.shockwaves.length - 1; i >= 0; i--) {
        const sw = stateRef.current.shockwaves[i];
        sw.radius += 2.5;
        sw.alpha *= 0.92;

        ctx.strokeStyle = sw.color;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = sw.alpha;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;

        if (sw.radius >= sw.maxRadius || sw.alpha < 0.05) {
          stateRef.current.shockwaves.splice(i, 1);
        }
      }

      // 3. Update and Render Particles
      for (let i = stateRef.current.particles.length - 1; i >= 0; i--) {
        const p = stateRef.current.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          stateRef.current.particles.splice(i, 1);
          continue;
        }

        const currentAlpha = p.flicker ? Math.max(0.2, p.alpha * (0.6 + Math.random() * 0.4)) : p.alpha;
        ctx.globalAlpha = currentAlpha;
        ctx.fillStyle = p.color;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Inner bright spark core
        if (p.size > 1.8) {
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();
      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      isRunning = false;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isVisible, createExplosion, launchRocket, handleFinish]);

  if (!isVisible) return null;

  return (
    <div
      id="firework-intro-overlay"
      className={`fixed inset-0 z-[100000] w-screen h-screen bg-[#07090e] flex flex-col items-center justify-center select-none overflow-hidden transition-opacity duration-700 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ backgroundColor: '#07090e' }}
      aria-label="Ayyan Fireworks Opening Experience"
    >
      {/* Background HTML5 Firework Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* Ambient Glowing Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] bg-gradient-to-br from-amber-500/15 via-red-500/10 to-transparent rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Top Header Actions (Skip Button) */}
      <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-30 flex items-center gap-3">
        <button
          onClick={handleFinish}
          className="group flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white/75 hover:text-white text-xs font-semibold backdrop-blur-md transition-all active:scale-95 shadow-lg"
          aria-label="Skip firework intro animation"
        >
          <span>Skip Intro</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Center Cinematic Emblem & Brand Container */}
      <div className="relative z-20 flex flex-col items-center text-center px-4 max-w-lg mx-auto">
        {/* Animated Emblem Badge */}
        <div className="relative mb-6 group cursor-pointer" onClick={handleFinish}>
          {/* Outer Pulsing Glow Halo */}
          <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-amber-500/40 via-red-500/30 to-gold-400/40 blur-xl animate-pulse" />

          {/* Rotating Gold-Red Accent Border */}
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-red-500 to-amber-300 shadow-[0_0_50px_rgba(245,158,11,0.5)] transition-transform duration-500 transform group-hover:scale-105">
            <div className="w-full h-full rounded-full bg-[#07090e] p-2 flex items-center justify-center overflow-hidden border border-amber-500/30">
              <img
                src="/ayyan-emblem.png"
                alt="Ayyan Fireworks Bunny Brand"
                className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(245,158,11,0.7)] animate-float"
              />
            </div>
          </div>

          {/* Festive Sparkle Badges */}
          <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg animate-bounce">
            <Sparkles className="w-4 h-4 text-slate-950" />
          </div>
        </div>

        {/* Brand Typography with Gold & Ruby Accents */}
        <div className="space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest shadow-xs transition-all duration-300">
            <Flame className="w-3 h-3 text-red-500 animate-pulse" />
            <span>
              {phase === 1 && 'Bunny Brand • Since 1987'}
              {phase === 2 && 'Cracker Symphony • Festive 2026'}
              {phase === 3 && 'Grand Pyrotechnic Finale'}
            </span>
            <Flame className="w-3 h-3 text-amber-400 animate-pulse" />
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-white leading-tight">
            AYYAN <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 drop-shadow-[0_2px_15px_rgba(245,158,11,0.5)]">FIREWORKS</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300/90 font-medium max-w-sm mx-auto">
            Visakhapatnam Flagship Experience Center • 2026 Festive Showcase
          </p>
        </div>

        {/* Enter Store Action Button */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={handleFinish}
            className="group relative px-7 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-gold-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-xs sm:text-sm tracking-wider uppercase flex items-center gap-2 shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:shadow-[0_0_45px_rgba(245,158,11,0.7)] transition-all transform hover:-translate-y-0.5 active:scale-95 border border-amber-200/50"
          >
            <span>Enter Showroom Experience</span>
            <ArrowRight className="w-4 h-4 text-slate-950 transition-transform group-hover:translate-x-1" />
          </button>
          <span className="text-[11px] text-slate-400/80 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            PESO Certified & 100% Green Pyrotechnics
          </span>
        </div>
      </div>

      {/* Bottom Subtle Progress Indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5 z-30">
        <div
          className="h-full bg-gradient-to-r from-amber-500 via-red-500 to-gold-400 transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(245,158,11,0.8)]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default FireworkIntroSplash;
