/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, RefreshCw, Moon, ArrowDown, HelpCircle, Wind, PlusCircle } from 'lucide-react';
import { COOKIES_DATA } from '../data';
import { Cookie } from '../types';

interface PhysicalCookie {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  cookieData: Cookie;
  rotation: number;
  angularVelocity: number;
  color: string;
  chipColor: string;
  isSpecial?: boolean;
}

export default function CookieGravitySandbox() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [cookies, setCookies] = useState<PhysicalCookie[]>([]);
  const [selectedCookieTemplate, setSelectedCookieTemplate] = useState<Cookie>(COOKIES_DATA[4]); // Mall Road Walnut Choc Chip
  const [gravityType, setGravityType] = useState<'normal' | 'low' | 'heavy' | 'reverse' | 'zero'>('normal');
  const [activeWind, setActiveWind] = useState<number>(0); // -1 for left wind, 0 none, 1 right wind
  const [stats, setStats] = useState({ totalBounces: 0, cookieCount: 0 });
  const [showTooltip, setShowTooltip] = useState(true);

  // Keep ref to state for access in frame loop without re-binding
  const physicsStateRef = useRef({
    cookies: [] as PhysicalCookie[],
    gravityType: 'normal' as 'normal' | 'low' | 'heavy' | 'reverse' | 'zero',
    activeWind: 0,
    draggedIndex: -1 as number,
    mouseX: 0,
    mouseY: 0,
  });

  useEffect(() => {
    physicsStateRef.current.cookies = cookies;
    physicsStateRef.current.gravityType = gravityType;
    physicsStateRef.current.activeWind = activeWind;
  }, [cookies, gravityType, activeWind]);

  // Initial cookies
  useEffect(() => {
    const initialList: PhysicalCookie[] = [];
    // Spawn 6 random cookies at nice positions
    for (let i = 0; i < 6; i++) {
      const template = COOKIES_DATA[i % COOKIES_DATA.length];
      const radius = 32 + Math.random() * 14;
      initialList.push({
        id: `cookie-${Date.now()}-${i}`,
        x: 100 + i * 60,
        y: 80 + Math.random() * 80,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 4,
        radius,
        cookieData: template,
        rotation: Math.random() * Math.PI * 2,
        angularVelocity: (Math.random() - 0.5) * 0.1,
        ...getCookieColors(template.id),
      });
    }
    setCookies(initialList);
    setStats(prev => ({ ...prev, cookieCount: initialList.length }));
  }, []);

  const getCookieColors = (id: string) => {
    switch (id) {
      case 'rhododendron-roseate':
        return { color: '#fbcfe8', chipColor: '#be185d', isSpecial: true }; // Pink/Rose
      case 'peach-cobbler-crumble':
        return { color: '#ffedd5', chipColor: '#ea580c' }; // Pale peach/orange
      case 'pine-nut-chocolate-fudge':
        return { color: '#451a03', chipColor: '#fef08a' }; // Deep dark brown / yellow pine nut
      case 'snowy-peaks-mint':
        return { color: '#0f172a', chipColor: '#22c55e' }; // Snowy dark base / green mint
      case 'bhimtal-honey-almond':
        return { color: '#fef3c7', chipColor: '#d97706' }; // Honey gold / dark almond
      case 'tallital-spiced-chai':
        return { color: '#eab308', chipColor: '#78350f' }; // Warm snickerdoodle
      case 'kumaon-orange-cranberry':
        return { color: '#ffedd5', chipColor: '#dc2626' }; // Light orange / cranberry red
      default:
        return { color: '#d97706', chipColor: '#451a03' }; // Traditional warm cookie amber / choc chip
    }
  };

  const spawnCookie = (clientX?: number, clientY?: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let spawnX = canvas.width / 2;
    let spawnY = 50;

    if (clientX !== undefined && clientY !== undefined) {
      const rect = canvas.getBoundingClientRect();
      spawnX = clientX - rect.left;
      spawnY = clientY - rect.top;
    }

    const radius = 32 + Math.random() * 14;
    const newCookie: PhysicalCookie = {
      id: `cookie-${Date.now()}-${Math.random()}`,
      x: spawnX,
      y: spawnY,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 4,
      radius,
      cookieData: selectedCookieTemplate,
      rotation: Math.random() * Math.PI * 2,
      angularVelocity: (Math.random() - 0.5) * 0.1,
      ...getCookieColors(selectedCookieTemplate.id),
    };

    setCookies(prev => [...prev, newCookie]);
    setStats(prev => ({ ...prev, cookieCount: prev.cookieCount + 1 }));
  };

  const clearSandbox = () => {
    setCookies([]);
    setStats({ totalBounces: 0, cookieCount: 0 });
  };

  // Setup main canvas physics loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      const container = containerRef.current;
      if (container && canvas) {
        canvas.width = container.clientWidth;
        canvas.height = 360; // Locked height for clean sandbox presentation
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse handlers
    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Find if clicked on any cookie
      const state = physicsStateRef.current;
      let foundIndex = -1;
      for (let i = 0; i < state.cookies.length; i++) {
        const c = state.cookies[i];
        const dist = Math.hypot(c.x - x, c.y - y);
        if (dist < c.radius) {
          foundIndex = i;
          break;
        }
      }

      state.draggedIndex = foundIndex;
      state.mouseX = x;
      state.mouseY = y;

      if (foundIndex === -1) {
        // Spawn a cookie on empty space click
        spawnCookie(e.clientX, e.clientY);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const state = physicsStateRef.current;
      state.mouseX = e.clientX - rect.left;
      state.mouseY = e.clientY - rect.top;
    };

    const handleMouseUp = () => {
      physicsStateRef.current.draggedIndex = -1;
    };

    // Touch support
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      const state = physicsStateRef.current;
      let foundIndex = -1;
      for (let i = 0; i < state.cookies.length; i++) {
        const c = state.cookies[i];
        const dist = Math.hypot(c.x - x, c.y - y);
        if (dist < c.radius) {
          foundIndex = i;
          break;
        }
      }

      state.draggedIndex = foundIndex;
      state.mouseX = x;
      state.mouseY = y;

      // Don't auto-spawn on touch immediately to avoid interfering with scrolling,
      // but if touch didn't hit a cookie, let them drag-interact
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const state = physicsStateRef.current;
      state.mouseX = touch.clientX - rect.left;
      state.mouseY = touch.clientY - rect.top;

      // Prevent scrolling if manipulating the cookie canvas directly
      if (state.draggedIndex !== -1) {
        e.preventDefault();
      }
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleMouseUp);

    // Physics constants
    const restitution = 0.65; // Bounciness
    const friction = 0.99; // Air drag

    // Get Gravity Values
    const getGravity = () => {
      const type = physicsStateRef.current.gravityType;
      switch (type) {
        case 'zero': return 0;
        case 'low': return 0.12;
        case 'heavy': return 0.8;
        case 'reverse': return -0.3;
        case 'normal':
        default:
          return 0.35;
      }
    };

    const render = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw aesthetic background grid / container background
      ctx.strokeStyle = 'rgba(120, 53, 15, 0.04)';
      ctx.lineWidth = 1;
      const step = 40;
      for (let x = 0; x < canvas.width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw cozy background watermark/instruction
      ctx.fillStyle = 'rgba(120, 53, 15, 0.08)';
      ctx.font = '700 14px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('NAINI CRUMBS - INTERACTIVE GRAVITY BOX', canvas.width / 2, canvas.height - 30);
      ctx.font = '500 12px "Inter", sans-serif';
      ctx.fillText('Click empty space to bake • Drag & throw cookies', canvas.width / 2, canvas.height - 12);

      const state = physicsStateRef.current;
      const g = getGravity();
      const currentWind = state.activeWind * 0.15;

      // Update positions
      for (let i = 0; i < state.cookies.length; i++) {
        const c = state.cookies[i];

        if (state.draggedIndex === i) {
          // Follow mouse with spring action
          const targetX = state.mouseX;
          const targetY = state.mouseY;
          c.vx = (targetX - c.x) * 0.25;
          c.vy = (targetY - c.y) * 0.25;
          c.angularVelocity = c.vx * 0.02;
        } else {
          // Apply gravity
          c.vy += g;
          // Apply wind
          c.vx += currentWind;
          // Apply air drag friction
          c.vx *= friction;
          c.vy *= friction;
          c.angularVelocity *= 0.98;
        }

        c.x += c.vx;
        c.y += c.vy;
        c.rotation += c.angularVelocity;

        // Boundary collisions
        let bounced = false;
        if (c.x - c.radius < 0) {
          c.x = c.radius;
          c.vx = -c.vx * restitution;
          c.angularVelocity += c.vy * 0.01;
          bounced = true;
        } else if (c.x + c.radius > canvas.width) {
          c.x = canvas.width - c.radius;
          c.vx = -c.vx * restitution;
          c.angularVelocity -= c.vy * 0.01;
          bounced = true;
        }

        if (c.y - c.radius < 0) {
          c.y = c.radius;
          c.vy = -c.vy * restitution;
          c.angularVelocity -= c.vx * 0.01;
          bounced = true;
        } else if (c.y + c.radius > canvas.height) {
          c.y = canvas.height - c.radius;
          c.vy = -c.vy * restitution;
          c.vx *= 0.9; // Extra floor friction
          c.angularVelocity = -c.vx * 0.05;
          bounced = true;
        }

        if (bounced) {
          setStats(prev => ({ ...prev, totalBounces: prev.totalBounces + 1 }));
        }
      }

      // Handle cookie-cookie collisions (simple elastic spheres)
      for (let i = 0; i < state.cookies.length; i++) {
        for (let j = i + 1; j < state.cookies.length; j++) {
          const c1 = state.cookies[i];
          const c2 = state.cookies[j];

          const dx = c2.x - c1.x;
          const dy = c2.y - c1.y;
          const distance = Math.hypot(dx, dy);
          const minDist = c1.radius + c2.radius;

          if (distance < minDist) {
            // Overlap correction (push apart)
            const overlap = minDist - distance;
            const nx = dx / distance;
            const ny = dy / distance;

            c1.x -= nx * overlap * 0.5;
            c1.y -= ny * overlap * 0.5;
            c2.x += nx * overlap * 0.5;
            c2.y += ny * overlap * 0.5;

            // Elastic bounce calculations
            const kx = c1.vx - c2.vx;
            const ky = c1.vy - c2.vy;
            const p = 2 * (nx * kx + ny * ky) / 2; // Equal mass assumption

            c1.vx -= p * nx * restitution;
            c1.vy -= p * ny * restitution;
            c2.vx += p * nx * restitution;
            c2.vy += p * ny * restitution;

            // Transfer spin
            const spinDiff = c1.angularVelocity - c2.angularVelocity;
            c1.angularVelocity -= spinDiff * 0.1;
            c2.angularVelocity += spinDiff * 0.1;

            setStats(prev => ({ ...prev, totalBounces: prev.totalBounces + 1 }));
          }
        }
      }

      // Draw cookies
      for (let i = 0; i < state.cookies.length; i++) {
        const c = state.cookies[i];

        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rotation);

        // Glass shadow/ambient occlusion underneath cookie
        ctx.shadowColor = 'rgba(120, 53, 15, 0.2)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 4;

        // Base Cookie dough drawing
        ctx.fillStyle = c.color;
        ctx.beginPath();
        // Make it slightly wavy/rustic instead of a perfect mathematical circle
        const points = 16;
        for (let p = 0; p < points; p++) {
          const angle = (p / points) * Math.PI * 2;
          const rOffset = Math.sin(angle * 5) * (c.radius * 0.05); // wavy edge
          const rx = Math.cos(angle) * (c.radius + rOffset);
          const ry = Math.sin(angle) * (c.radius + rOffset);
          if (p === 0) ctx.moveTo(rx, ry);
          else ctx.lineTo(rx, ry);
        }
        ctx.closePath();
        ctx.fill();

        // Cookie borders (slightly darker oven-roasted ring)
        ctx.shadowColor = 'transparent'; // Reset shadows
        ctx.shadowBlur = 0;
        ctx.strokeStyle = 'rgba(120, 53, 15, 0.12)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Inner textured layer / cracked lines of baked goodness
        ctx.strokeStyle = 'rgba(120, 53, 15, 0.07)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, c.radius * 0.7, 0, Math.PI * 1.5);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, c.radius * 0.4, Math.PI * 0.5, Math.PI * 2);
        ctx.stroke();

        // Draw delicious Chocolate Chips / Pine Nuts / Inclusions
        ctx.fillStyle = c.chipColor;
        const chipPositions = [
          { x: -0.4, y: -0.3, r: 0.18, type: 'circle' },
          { x: 0.4, y: -0.4, r: 0.16, type: 'drop' },
          { x: 0, y: 0.2, r: 0.2, type: 'circle' },
          { x: -0.3, y: 0.4, r: 0.14, type: 'drop' },
          { x: 0.4, y: 0.3, r: 0.17, type: 'circle' },
          { x: 0.1, y: -0.5, r: 0.13, type: 'circle' },
          { x: -0.5, y: 0, r: 0.15, type: 'drop' },
        ];

        chipPositions.forEach(chip => {
          const cx = chip.x * c.radius;
          const cy = chip.y * c.radius;
          const cr = chip.r * c.radius;

          ctx.beginPath();
          if (c.cookieData.id === 'bhimtal-honey-almond') {
            // Draw pointed almond slivers
            ctx.ellipse(cx, cy, cr * 1.6, cr * 0.7, Math.PI / 4, 0, Math.PI * 2);
            ctx.fillStyle = '#fef08a'; // almonds
            ctx.fill();
            ctx.strokeStyle = '#b45309';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          } else if (c.cookieData.id === 'rhododendron-roseate') {
            // Jam core center plus little bits
            if (chip.x === 0 && chip.y === 0.2) {
              ctx.arc(0, 0, c.radius * 0.45, 0, Math.PI * 2);
              ctx.fillStyle = '#db2777'; // shiny jam
              ctx.fill();
              // white spark shine
              ctx.fillStyle = 'rgba(255,255,255,0.7)';
              ctx.beginPath();
              ctx.arc(-cr*0.5, -cr*0.5, cr * 0.3, 0, Math.PI * 2);
              ctx.fill();
            } else {
              ctx.arc(cx, cy, cr * 0.7, 0, Math.PI * 2);
              ctx.fillStyle = '#f472b6'; // small pink sprinkles
              ctx.fill();
            }
          } else if (c.cookieData.id === 'snowy-peaks-mint') {
            // Dark cookie with white/mint chips and snowy dusting
            ctx.arc(cx, cy, cr, 0, Math.PI * 2);
            ctx.fillStyle = chip.type === 'circle' ? '#ffffff' : '#4ade80'; // White and mint chips
            ctx.fill();
          } else if (c.cookieData.id === 'peach-cobbler-crumble') {
            // Peach pieces
            ctx.arc(cx, cy, cr * 1.2, 0, Math.PI * 2);
            ctx.fillStyle = '#f97316'; // glowing peach chunks
            ctx.fill();
          } else {
            // Classic dark chocolate chunks
            ctx.arc(cx, cy, cr, 0, Math.PI * 2);
            ctx.fillStyle = c.chipColor;
            ctx.fill();
            // Highlight shine on chocolate chips
            ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.beginPath();
            ctx.arc(cx - cr * 0.3, cy - cr * 0.3, cr * 0.3, 0, Math.PI * 2);
            ctx.fill();
          }
        });

        // Snowy dusting for Snow Peaks cookie
        if (c.cookieData.id === 'snowy-peaks-mint') {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
          ctx.beginPath();
          ctx.arc(0, 0, c.radius * 0.95, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = '8px Arial';
          ctx.fillText('❄️', -6, -6);
        }

        // Highlight ring to give it pseudo-3D volume
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, c.radius - 2, Math.PI * 1, Math.PI * 1.8);
        ctx.stroke();

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [selectedCookieTemplate]);

  return (
    <div className="bg-white border-4 border-[#4A3728] rounded-[32px] p-6 shadow-[8px_8px_0px_0px_rgba(74,55,40,1)] overflow-hidden" id="gravity-sandbox-container">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#FDE68A] text-[#4A3728] border-2 border-[#4A3728] rounded-xl shadow-[2px_2px_0px_0px_rgba(74,55,40,1)]">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </span>
            <h3 className="font-display text-xl font-black text-[#4A3728] uppercase">
              Interactive Cookie Gravity Sandbox
            </h3>
          </div>
          <p className="text-sm text-[#4A3728]/80 mt-1 font-bold">
            Experience our physical simulated cookie box. Choose a recipe flavor below to bake, then click empty space or drag them!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Counter Stats */}
          <div className="px-3 py-1.5 bg-white border-2 border-[#4A3728] rounded-xl text-xs font-mono text-[#4A3728] font-black shadow-[2px_2px_0px_0px_rgba(74,55,40,1)]">
            🍪 Baked: <span className="font-bold text-[#D97706]">{stats.cookieCount}</span>
          </div>
          <div className="px-3 py-1.5 bg-white border-2 border-[#4A3728] rounded-xl text-xs font-mono text-[#4A3728] font-black shadow-[2px_2px_0px_0px_rgba(74,55,40,1)]">
            💥 Collisions: <span className="font-bold text-[#D97706]">{stats.totalBounces}</span>
          </div>
          <button
            onClick={clearSandbox}
            className="p-1.5 bg-white hover:bg-red-50 border-2 border-[#4A3728] hover:border-red-600 text-[#4A3728] hover:text-red-600 rounded-xl transition-all duration-200 cursor-pointer shadow-[2px_2px_0px_0px_rgba(74,55,40,1)] hover:translate-y-[-1px]"
            title="Clean cookie jar"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Physics Sandbox Canvas */}
      <div 
        ref={containerRef} 
        className="relative w-full bg-[#FEF9F3] border-4 border-[#4A3728] rounded-2xl overflow-hidden cursor-crosshair shadow-inner"
        style={{ height: '360px' }}
      >
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 block touch-none"
        />

        {/* Floating Controls Overlay inside Canvas */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 pointer-events-auto z-10">
          <div className="bg-white p-3 rounded-xl border-2 border-[#4A3728] shadow-[3px_3px_0px_0px_rgba(74,55,40,1)] flex flex-col gap-1.5">
            <span className="text-[10px] uppercase tracking-wider font-black text-[#4A3728] mb-1 flex items-center gap-1">
              <Moon className="w-3 h-3 text-[#D97706]" /> Gravity Engine
            </span>
            <div className="grid grid-cols-2 gap-1 text-[11px]">
              <button
                onClick={() => setGravityType('normal')}
                className={`px-2 py-1 rounded-md font-black text-[10px] uppercase text-left border-2 transition-colors ${gravityType === 'normal' ? 'bg-[#4A3728] text-white border-[#4A3728]' : 'hover:bg-[#FEF9F3] text-[#4A3728] border-transparent'}`}
              >
                🌍 Earth (Normal)
              </button>
              <button
                onClick={() => setGravityType('low')}
                className={`px-2 py-1 rounded-md font-black text-[10px] uppercase text-left border-2 transition-colors ${gravityType === 'low' ? 'bg-[#4A3728] text-white border-[#4A3728]' : 'hover:bg-[#FEF9F3] text-[#4A3728] border-transparent'}`}
              >
                🌙 Moon (Low)
              </button>
              <button
                onClick={() => setGravityType('heavy')}
                className={`px-2 py-1 rounded-md font-black text-[10px] uppercase text-left border-2 transition-colors ${gravityType === 'heavy' ? 'bg-[#4A3728] text-white border-[#4A3728]' : 'hover:bg-[#FEF9F3] text-[#4A3728] border-transparent'}`}
              >
                🪐 Jupiter (Heavy)
              </button>
              <button
                onClick={() => setGravityType('reverse')}
                className={`px-2 py-1 rounded-md font-black text-[10px] uppercase text-left border-2 transition-colors ${gravityType === 'reverse' ? 'bg-[#4A3728] text-white border-[#4A3728]' : 'hover:bg-[#FEF9F3] text-[#4A3728] border-transparent'}`}
              >
                🎈 Anti-Gravity
              </button>
              <button
                onClick={() => setGravityType('zero')}
                className={`px-2 py-1 rounded-md font-black text-[10px] uppercase text-center border-2 transition-colors ${gravityType === 'zero' ? 'bg-[#4A3728] text-white border-[#4A3728]' : 'hover:bg-[#FEF9F3] text-[#4A3728] border-transparent'}`}
                style={{ gridColumn: 'span 2' }}
              >
                ✨ Zero-G Floating
              </button>
            </div>
          </div>

          {/* Himalayan Wind controls */}
          <div className="bg-white p-2 rounded-xl border-2 border-[#4A3728] shadow-[3px_3px_0px_0px_rgba(74,55,40,1)] flex gap-1.5 items-center">
            <span className="text-[10px] font-black text-[#4A3728] uppercase flex items-center gap-1 px-1">
              <Wind className="w-3 h-3 text-[#D97706]" /> Wind:
            </span>
            <button
              onClick={() => setActiveWind(prev => prev === -1 ? 0 : -1)}
              className={`px-2 py-1 rounded text-[10px] font-black uppercase border-2 transition-all ${activeWind === -1 ? 'bg-[#D97706] text-white border-[#4A3728]' : 'bg-white hover:bg-[#FEF9F3] border-transparent text-[#4A3728]'}`}
            >
              ◀ Gust
            </button>
            <button
              onClick={() => setActiveWind(0)}
              className={`px-1.5 py-1 rounded text-[10px] font-black uppercase border-2 transition-all ${activeWind === 0 ? 'bg-[#4A3728] text-white border-[#4A3728]' : 'bg-white hover:bg-[#FEF9F3] border-transparent text-[#4A3728]'}`}
            >
              Off
            </button>
            <button
              onClick={() => setActiveWind(prev => prev === 1 ? 0 : 1)}
              className={`px-2 py-1 rounded text-[10px] font-black uppercase border-2 transition-all ${activeWind === 1 ? 'bg-[#D97706] text-white border-[#4A3728]' : 'bg-white hover:bg-[#FEF9F3] border-transparent text-[#4A3728]'}`}
            >
              Gust ▶
            </button>
          </div>
        </div>

        {/* Floating Instruction overlay */}
        {showTooltip && (
          <div className="absolute bottom-16 right-3 bg-white p-3.5 rounded-xl text-xs max-w-xs shadow-[4px_4px_0px_0px_rgba(74,55,40,1)] border-2 border-[#4A3728] pointer-events-auto z-10 text-[#4A3728]">
            <div className="flex justify-between items-start mb-1">
              <span className="font-black flex items-center gap-1 text-[#D97706] uppercase">
                <HelpCircle className="w-3.5 h-3.5" /> Physics Modeling
              </span>
              <button onClick={() => setShowTooltip(false)} className="text-[#4A3728] hover:text-[#D97706] font-black pl-2 cursor-pointer text-sm">×</button>
            </div>
            <p className="text-[#4A3728]/90 leading-relaxed font-bold">
              We developed this beautiful, custom, lightweight physics system to demonstrate collision dynamics, friction, and gravity fields! Click a flavor on the right, then tap on the canvas to bake a fresh batch!
            </p>
          </div>
        )}
      </div>

      {/* Flavor recipe selector for baking */}
      <div className="mt-4">
        <h4 className="text-xs font-black uppercase text-[#4A3728] mb-2 tracking-wider mt-6">
          Select Flavor to Spawn/Bake on Canvas Tap:
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {COOKIES_DATA.map((cookie) => {
            const isSelected = selectedCookieTemplate.id === cookie.id;
            return (
              <button
                key={cookie.id}
                onClick={() => {
                  setSelectedCookieTemplate(cookie);
                  // Auto spawn a cookie at top center on selector change for visual feedback
                  spawnCookie();
                }}
                className={`p-2.5 rounded-xl text-center flex flex-col items-center gap-1.5 border-2 transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-[#FDE68A] border-[#4A3728] shadow-[3px_3px_0px_0px_rgba(74,55,40,1)] font-black text-[#4A3728]' 
                    : 'bg-white hover:bg-[#FEF9F3] border-[#4A3728] shadow-[2px_2px_0px_0px_rgba(74,55,40,1)] font-bold text-[#4A3728]/80'
                }`}
              >
                <div 
                  className="w-6 h-6 rounded-full shadow-inner border-2 border-[#4A3728] flex items-center justify-center text-[10px]"
                  style={{ backgroundColor: getCookieColors(cookie.id).color }}
                >
                  <span style={{ color: getCookieColors(cookie.id).chipColor }}>•</span>
                </div>
                <span className="text-[9px] uppercase tracking-wide leading-tight block truncate w-full">
                  {cookie.name.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
