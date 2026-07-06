/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ShieldAlert, Sparkles, Flame, Plus, Check, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { COOKIES_DATA } from '../data';
import { Cookie } from '../types';

interface MenuSectionProps {
  onAddToCart: (cookie: Cookie) => void;
}

export default function MenuSection({ onAddToCart }: MenuSectionProps) {
  const [filter, setFilter] = useState<'all' | 'signature' | 'seasonal' | 'exclusive'>('all');
  const [search, setSearch] = useState('');
  const [expandedCookieId, setExpandedCookieId] = useState<string | null>(null);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const filteredCookies = COOKIES_DATA.filter((cookie) => {
    const matchesCategory = filter === 'all' || cookie.category === filter;
    const matchesSearch = cookie.name.toLowerCase().includes(search.toLowerCase()) ||
                          cookie.description.toLowerCase().includes(search.toLowerCase()) ||
                          cookie.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleAddClick = (cookie: Cookie) => {
    onAddToCart(cookie);
    setJustAddedId(cookie.id);
    setTimeout(() => {
      setJustAddedId(null);
    }, 1200);
  };

  const toggleExpand = (id: string) => {
    setExpandedCookieId(prev => prev === id ? null : id);
  };

  return (
    <div className="w-full">
      {/* Category Tabs and search bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white border-2 border-[#4A3728] rounded-2xl shadow-[4px_4px_0px_0px_rgba(74,55,40,1)] w-fit">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              filter === 'all' 
                ? 'bg-[#4A3728] text-white border-2 border-[#4A3728] shadow-[2px_2px_0px_0px_rgba(74,55,40,1)]' 
                : 'text-[#4A3728] hover:bg-[#FEF9F3] border-2 border-transparent'
            }`}
          >
            All Recipes
          </button>
          <button
            onClick={() => setFilter('signature')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              filter === 'signature' 
                ? 'bg-[#4A3728] text-white border-2 border-[#4A3728] shadow-[2px_2px_0px_0px_rgba(74,55,40,1)]' 
                : 'text-[#4A3728] hover:bg-[#FEF9F3] border-2 border-transparent'
            }`}
          >
            Signature
          </button>
          <button
            onClick={() => setFilter('seasonal')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
              filter === 'seasonal' 
                ? 'bg-[#D97706] text-white border-2 border-[#4A3728] shadow-[2px_2px_0px_0px_rgba(74,55,40,1)]' 
                : 'text-[#4A3728] hover:bg-[#FEF9F3] border-2 border-transparent'
            }`}
          >
            <Sparkles className="w-3 h-3" /> Seasonal Rotations
          </button>
          <button
            onClick={() => setFilter('exclusive')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              filter === 'exclusive' 
                ? 'bg-[#4A3728] text-white border-2 border-[#4A3728] shadow-[2px_2px_0px_0px_rgba(74,55,40,1)]' 
                : 'text-[#4A3728] hover:bg-[#FEF9F3] border-2 border-transparent'
            }`}
          >
            Exclusive Blends
          </button>
        </div>

        {/* Search */}
        <div className="w-full md:max-w-xs">
          <input
            type="text"
            placeholder="Search walnuts, rhododendron, dark chocolate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bento-input-field"
          />
        </div>
      </div>

      {/* Grid of Cookie Cards */}
      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredCookies.map((cookie) => {
            const isExpanded = expandedCookieId === cookie.id;
            const isJustAdded = justAddedId === cookie.id;
            return (
              <motion.div
                layout
                key={cookie.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                className="bento-card overflow-hidden flex flex-col h-full relative group"
                id={`cookie-card-${cookie.id}`}
              >
                {/* Seasonal Badge overlay */}
                {cookie.isSeasonal && (
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#D97706] text-white text-[9px] font-black tracking-widest uppercase border-2 border-[#4A3728] shadow-[2px_2px_0px_0px_rgba(74,55,40,1)]">
                    <Sparkles className="w-2.5 h-2.5 text-yellow-300" />
                    <span>{cookie.season} Special</span>
                  </div>
                )}

                {/* Thumbnail Image */}
                <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-50 border-b-4 border-[#4A3728]">
                  <img
                    src={cookie.image}
                    alt={cookie.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-stone-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-[9px] text-[#4A3728] font-black uppercase bg-white px-2 py-1 rounded-lg border-2 border-[#4A3728] shadow-[2px_2px_0px_0px_rgba(74,55,40,1)] flex items-center gap-1">
                      🌱 Organic Ingredients
                    </span>
                  </div>
                </div>

                {/* Content Container */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Tags and Rating */}
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex flex-wrap gap-1">
                        {cookie.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="text-[9px] font-black uppercase tracking-wider text-[#4A3728] bg-[#FDE68A] px-1.5 py-0.5 rounded-lg border-2 border-[#4A3728]">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        <Star className="w-3 h-3 fill-[#D97706]" />
                        <span className="text-[10px] font-black text-[#4A3728] uppercase">{cookie.rating}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h4 className="font-display text-base font-black text-[#4A3728] group-hover:text-[#D97706] transition-colors uppercase mt-1 leading-tight">
                      {cookie.name}
                    </h4>

                    {/* Description */}
                    <p className="text-[#4A3728]/80 text-xs mt-1 line-clamp-2 leading-relaxed font-medium">
                      {cookie.description}
                    </p>
                  </div>

                  {/* Pricing and Action Row */}
                  <div className="mt-4 pt-3 border-t-2 border-[#4A3728]/20 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-[#4A3728]/60 uppercase font-black tracking-wider block">Batch price</span>
                      <span className="text-lg font-black text-[#4A3728] block leading-none">
                        ₹{cookie.price} <span className="text-[9px] text-[#4A3728]/60 font-medium lowercase">/ pair</span>
                      </span>
                    </div>

                    <div className="flex gap-1.5">
                      <button
                        onClick={() => toggleExpand(cookie.id)}
                        className={`p-2 bg-white border-2 border-[#4A3728] rounded-xl text-[#4A3728] hover:bg-[#FEF9F3] hover:text-[#D97706] active:translate-y-[1px] transition-all cursor-pointer ${isExpanded ? 'bg-[#FDE68A]' : ''}`}
                        title="Nutrition & Allergens"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleAddClick(cookie)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1 border-2 border-[#4A3728] cursor-pointer shadow-[2px_2px_0px_0px_rgba(74,55,40,1)] hover:translate-y-[-1px] ${
                          isJustAdded 
                            ? 'bg-[#D1FAE5] text-[#4A3728]' 
                            : 'bg-[#D97706] hover:bg-[#b45309] text-white'
                        }`}
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expandable nutritional details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="border-t-2 border-[#4A3728] bg-[#FEF9F3] overflow-hidden"
                    >
                      <div className="p-4 text-xs flex flex-col gap-3">
                        {/* Ingredients */}
                        <div>
                          <span className="font-black text-[#4A3728] uppercase text-[10px] block mb-1">Key Ingredients:</span>
                          <span className="text-[#4A3728]/90 font-medium leading-relaxed block">{cookie.ingredients.join(', ')}.</span>
                        </div>

                        {/* Nutrition Grid */}
                        <div className="bg-white border-2 border-[#4A3728] rounded-xl p-2.5 grid grid-cols-4 gap-1 text-center shadow-[2px_2px_0px_0px_rgba(74,55,40,1)]">
                          <div>
                            <span className="text-[8px] text-[#4A3728]/60 block font-black uppercase">Calories</span>
                            <span className="font-black text-[#4A3728] text-[10px] block">{cookie.nutrition.calories} kcal</span>
                          </div>
                          <div>
                            <span className="text-[8px] text-[#4A3728]/60 block font-black uppercase">Carbs</span>
                            <span className="font-black text-[#4A3728] text-[10px] block">{cookie.nutrition.carbs}</span>
                          </div>
                          <div>
                            <span className="text-[8px] text-[#4A3728]/60 block font-black uppercase">Protein</span>
                            <span className="font-black text-[#4A3728] text-[10px] block">{cookie.nutrition.protein}</span>
                          </div>
                          <div>
                            <span className="text-[8px] text-[#4A3728]/60 block font-black uppercase">Fat</span>
                            <span className="font-black text-[#4A3728] text-[10px] block">{cookie.nutrition.fat}</span>
                          </div>
                        </div>

                        {/* Allergens warning */}
                        {cookie.allergens.length > 0 && (
                          <div className="flex items-start gap-1.5 p-2 bg-[#FECACA] text-[#4A3728] border-2 border-[#4A3728] rounded-xl text-[9px] font-bold">
                            <ShieldAlert className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                            <span>
                              <strong>Allergen Warning:</strong> Contains {cookie.allergens.join(', ')}. Hand-rolled in a kitchen using walnuts, pine nuts, and gluten.
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {filteredCookies.length === 0 && (
        <div className="text-center py-12 bg-white border border-dashed border-stone-200 rounded-2xl">
          <p className="text-stone-500 font-medium">No recipes matched your criteria.</p>
          <button onClick={() => { setSearch(''); setFilter('all'); }} className="text-amber-700 font-bold text-xs underline mt-2 cursor-pointer">
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}
