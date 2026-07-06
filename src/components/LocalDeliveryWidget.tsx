/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { MapPin, Truck, ShieldCheck, Clock, Navigation, AlertCircle } from 'lucide-react';
import { DELIVERY_AREAS } from '../data';
import { DeliveryArea } from '../types';

interface LocalDeliveryWidgetProps {
  onSelectArea?: (area: DeliveryArea) => void;
  selectedArea?: DeliveryArea | null;
}

export default function LocalDeliveryWidget({ onSelectArea, selectedArea }: LocalDeliveryWidgetProps) {
  const [activeArea, setActiveArea] = useState<DeliveryArea>(DELIVERY_AREAS[0]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (selectedArea) {
      setActiveArea(selectedArea);
    }
  }, [selectedArea]);

  const handleAreaChange = (area: DeliveryArea) => {
    setActiveArea(area);
    if (onSelectArea) {
      onSelectArea(area);
    }
  };

  // Coordinates for the Nainital Lake vector canvas
  // Lake is kidney-shaped in the middle. Tallital is bottom/right, Mallital is top/left.
  const landmarks = {
    bakery: { x: 180, y: 150, name: 'Naini Crumbs Bakery' },
    'mall-road': { x: 200, y: 120, name: 'Mall Road Promenade' },
    tallital: { x: 300, y: 220, name: 'Tallital Bus Stand' },
    mallital: { x: 100, y: 80, name: 'Mallital Bazaar' },
    ayarpatta: { x: 80, y: 190, name: 'Ayarpatta Pine Hill' },
    'snow-view': { x: 220, y: 50, name: 'Snow View Overlook' },
    'bhimtal-outer': { x: 340, y: 270, name: 'Bhimtal Highway Outpost' },
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    let progress = 0; // Animation progress of the scooter
    const speed = 0.015;

    // Selected destination
    const destKey = activeArea.id as keyof typeof landmarks;
    const destCoord = landmarks[destKey] || landmarks['mall-road'];
    const startCoord = landmarks.bakery;

    const drawMap = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw lake background (Pear-shaped/kidney-shaped Naini Lake)
      ctx.fillStyle = '#bae6fd'; // soft blue
      ctx.strokeStyle = '#38bdf8'; // border blue
      ctx.lineWidth = 3;
      ctx.beginPath();
      // Draw smooth Bezier curve representing Naini Lake
      ctx.moveTo(120, 100);
      ctx.bezierCurveTo(180, 70, 240, 140, 290, 210); // North-east curve
      ctx.bezierCurveTo(310, 230, 280, 250, 260, 230); // Tallital bottom end
      ctx.bezierCurveTo(200, 170, 150, 150, 110, 120); // Central narrow
      ctx.bezierCurveTo(80, 100, 100, 90, 120, 100);  // Mallital end
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Add gentle ripples on the lake
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(160 + i * 40, 110 + i * 15, 12, 0, Math.PI, false);
        ctx.stroke();
      }

      // 2. Draw surrounding hills (subtle green triangles/waves in background)
      ctx.fillStyle = '#f1f5f9';
      // Lower hills
      ctx.fillStyle = 'rgba(34, 197, 94, 0.04)';
      ctx.beginPath();
      ctx.moveTo(0, 300);
      ctx.lineTo(100, 120);
      ctx.lineTo(250, 300);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(150, 300);
      ctx.lineTo(300, 80);
      ctx.lineTo(400, 300);
      ctx.fill();

      // 3. Draw Mall Road route
      ctx.strokeStyle = 'rgba(120, 53, 15, 0.15)';
      ctx.lineWidth = 4;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(startCoord.x, startCoord.y);
      ctx.lineTo(destCoord.x, destCoord.y);
      ctx.stroke();
      ctx.setLineDash([]); // Reset dash

      // 4. Draw landmarks
      Object.entries(landmarks).forEach(([key, coord]) => {
        const isBakery = key === 'bakery';
        const isDest = key === activeArea.id;

        // Node circle
        ctx.beginPath();
        ctx.arc(coord.x, coord.y, isBakery ? 8 : 5, 0, Math.PI * 2);
        ctx.fillStyle = isBakery ? '#b45309' : isDest ? '#ea580c' : '#94a3b8';
        ctx.fill();

        // Node glow
        if (isDest) {
          ctx.beginPath();
          ctx.arc(coord.x, coord.y, 11, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(234, 88, 12, 0.4)';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Labels
        ctx.fillStyle = isBakery ? '#78350f' : isDest ? '#ea580c' : '#64748b';
        ctx.font = isBakery ? 'bold 10px "Outfit", sans-serif' : isDest ? 'bold 9px "Inter", sans-serif' : '500 8px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(coord.name, coord.x, coord.y - (isBakery ? 12 : 9));
      });

      // 5. Draw animated delivery scooter
      progress += speed;
      if (progress > 1) progress = 0; // Loop rider

      const scooterX = startCoord.x + (destCoord.x - startCoord.x) * progress;
      const scooterY = startCoord.y + (destCoord.y - startCoord.y) * progress;

      // Draw scooter dot
      ctx.beginPath();
      ctx.arc(scooterX, scooterY, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#dc2626'; // Red delivery scooter!
      ctx.fill();

      // Draw little dust trail behind scooter
      ctx.fillStyle = 'rgba(100, 116, 139, 0.3)';
      ctx.beginPath();
      ctx.arc(scooterX - (destCoord.x - startCoord.x) * 0.08, scooterY - (destCoord.y - startCoord.y) * 0.08, 3, 0, Math.PI * 2);
      ctx.fill();

      // Little flag label above scooter
      ctx.fillStyle = '#dc2626';
      ctx.font = 'bold 8px "Outfit"';
      ctx.fillText('🛵 Delivering', scooterX, scooterY - 8);

      animFrame = requestAnimationFrame(drawMap);
    };

    drawMap();

    return () => {
      cancelAnimationFrame(animFrame);
    };
  }, [activeArea]);

  return (
    <div className="bg-white border-4 border-[#4A3728] rounded-[32px] p-6 shadow-[8px_8px_0px_0px_rgba(74,55,40,1)] flex flex-col lg:flex-row gap-6">
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDE68A] text-[#4A3728] text-xs font-black border-2 border-[#4A3728] shadow-[2px_2px_0px_0px_rgba(74,55,40,1)] uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5" /> Local Delivery Service
          </span>
          <h3 className="font-display text-2xl font-black text-[#4A3728] mt-4 uppercase">
            Nainital Fresh Lakeside Delivery
          </h3>
          <p className="text-[#4A3728]/90 text-sm mt-1.5 leading-relaxed font-bold">
            We bake your cookies on order and dispatch them warm. Choose your sector below to calculate delivery fees, average travel times, and watch our virtual delivery tracker navigate around Naini Lake!
          </p>
        </div>

        {/* Location selector grid */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          {DELIVERY_AREAS.map((area) => {
            const isSelected = activeArea.id === area.id;
            return (
              <button
                key={area.id}
                onClick={() => handleAreaChange(area)}
                className={`p-3.5 text-left rounded-xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#FDE68A] border-[#4A3728] shadow-[3px_3px_0px_0px_rgba(74,55,40,1)]'
                    : 'bg-white hover:bg-[#FEF9F3] border-[#4A3728] shadow-[2px_2px_0px_0px_rgba(74,55,40,1)]'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-[#D97706]' : 'text-stone-400'}`} />
                  <span className="text-xs font-black text-[#4A3728] uppercase truncate">
                    {area.name.split(' (')[0]}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-[#4A3728]/70 font-bold">Zip: {area.zipCode}</span>
                  <span className="text-[10px] text-[#4A3728] font-black bg-white/80 px-1.5 py-0.5 rounded border-2 border-[#4A3728]">
                    {area.deliveryFee === 0 ? 'FREE' : `₹${area.deliveryFee}`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Area metrics card */}
        <div className="mt-4 p-4 bg-white border-2 border-[#4A3728] rounded-2xl flex items-center justify-between shadow-[4px_4px_0px_0px_rgba(74,55,40,1)]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#4A3728] text-white rounded-xl border-2 border-[#4A3728]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-[#4A3728]/60 uppercase tracking-wider font-black block">
                Estimated Hot Delivery
              </span>
              <span className="text-sm font-black text-[#4A3728] uppercase block">
                {activeArea.minTimeMins} - {activeArea.minTimeMins + 15} minutes
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-[#4A3728]/60 uppercase tracking-wider font-black block">
              Fee Structure
            </span>
            <span className="text-sm font-black text-[#4A3728] uppercase block">
              {activeArea.deliveryFee === 0 ? '₹0 (Free)' : `₹${activeArea.deliveryFee}`}
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-1.5 text-xs text-[#4A3728] bg-[#FDE68A] p-3 rounded-xl border-2 border-[#4A3728] font-bold">
          <AlertCircle className="w-4 h-4 text-[#D97706] shrink-0" />
          <span>Our cookies are sealed in heat-retaining biodegradable pouches to protect against lake breeze and mist!</span>
        </div>
      </div>

      {/* Vector Interactive Lake Map */}
      <div className="w-full lg:w-[380px] flex flex-col justify-between bg-[#BFDBFE] border-4 border-[#4A3728] rounded-[24px] p-4 relative overflow-hidden shrink-0 shadow-[6px_6px_0px_0px_rgba(74,55,40,1)]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black text-[#4A3728] uppercase flex items-center gap-1">
            <Navigation className="w-3 h-3 text-[#4A3728] animate-pulse" /> Live lake navigation route
          </span>
          <span className="text-[10px] bg-white text-[#4A3728] border-2 border-[#4A3728] px-2.5 py-0.5 rounded-full font-mono font-black shadow-[2px_2px_0px_0px_rgba(74,55,40,1)]">
            ALT: 2,084m
          </span>
        </div>

        <div className="relative w-full aspect-video sm:aspect-square lg:h-[280px] bg-white border-2 border-[#4A3728] rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(74,55,40,1)]">
          <canvas
            ref={canvasRef}
            width={380}
            height={280}
            className="w-full h-full block"
          />
        </div>

        <div className="mt-3 text-[11px] text-[#4A3728] bg-white border-2 border-[#4A3728] p-2.5 rounded-xl leading-snug font-bold">
          <span className="font-black uppercase">Active Route:</span> Bakery ➜ <span className="font-black text-[#D97706] uppercase">{activeArea.name}</span>. Travelling via steep Himalayan bends and beautiful lake embankments.
        </div>
      </div>
    </div>
  );
}
