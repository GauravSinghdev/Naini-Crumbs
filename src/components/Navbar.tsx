/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, User as UserIcon, LogOut, Heart, MapPin, Sparkles } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  cartItemsCount: number;
  onCartClick: () => void;
  user: User;
  onLoginClick: () => void;
  onLogout: () => void;
  selectedAreaName?: string;
  onScrollToSection: (sectionId: string) => void;
}

export default function Navbar({
  cartItemsCount,
  onCartClick,
  user,
  onLoginClick,
  onLogout,
  selectedAreaName,
  onScrollToSection
}: NavbarProps) {
  return (
    <nav className="sticky top-3 z-40 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
      <div className="bg-white border-4 border-[#4A3728] rounded-[24px] shadow-[6px_6px_0px_0px_rgba(74,55,40,1)] px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <div 
            onClick={() => onScrollToSection('hero')} 
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-[#D97706] border-2 border-[#4A3728] flex items-center justify-center text-white font-display text-xl font-black group-hover:scale-105 transition-transform">
              N
            </div>
            <div>
              <span className="font-display text-base font-black tracking-tight text-[#4A3728] uppercase block leading-none">
                Naini Crumbs
              </span>
              <span className="text-[9px] uppercase tracking-widest font-black text-[#D97706] block leading-none mt-0.5">
                Handmade in Nainital
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => onScrollToSection('menu')}
              className="text-xs font-black uppercase text-[#4A3728] hover:text-[#D97706] transition-colors cursor-pointer"
            >
              Fresh Menu
            </button>
            <button
              onClick={() => onScrollToSection('seasonal')}
              className="text-xs font-black uppercase text-[#4A3728] hover:text-[#D97706] transition-colors cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D97706]" /> Seasonal
            </button>
            <button
              onClick={() => onScrollToSection('physics')}
              className="text-xs font-black uppercase text-[#4A3728] hover:text-[#D97706] transition-colors cursor-pointer"
            >
              Sandbox
            </button>
            <button
              onClick={() => onScrollToSection('delivery')}
              className="text-xs font-black uppercase text-[#4A3728] hover:text-[#D97706] transition-colors cursor-pointer"
            >
              Track Map
            </button>
            <button
              onClick={() => onScrollToSection('testimonials')}
              className="text-xs font-black uppercase text-[#4A3728] hover:text-[#D97706] transition-colors cursor-pointer"
            >
              Reviews
            </button>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Delivery area info pill if available */}
            {selectedAreaName && (
              <div className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full bg-[#FDE68A] border-2 border-[#4A3728] text-[10px] text-[#4A3728] font-black uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-[#4A3728] shrink-0" />
                <span>{selectedAreaName}</span>
              </div>
            )}

            {/* Cart Button */}
            <button
              onClick={onCartClick}
              className="relative p-2 text-[#4A3728] hover:text-[#D97706] border-2 border-transparent hover:border-[#4A3728] rounded-xl transition-all cursor-pointer"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#D97706] text-[9px] font-black text-white border-2 border-[#4A3728] shadow-[1px_1px_0px_0px_rgba(74,55,40,1)]"
                >
                  {cartItemsCount}
                </motion.span>
              )}
            </button>

            {/* Authentication Action */}
            {user.isAuthenticated ? (
              <div className="flex items-center gap-2 pl-2 border-l-2 border-[#4A3728]">
                <div className="hidden lg:flex flex-col text-right">
                  <span className="text-[9px] text-[#4A3728]/60 font-black uppercase">Welcome,</span>
                  <span className="text-xs font-black text-[#4A3728]">{user.name.split(' ')[0]}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-white border-2 border-[#4A3728] flex items-center justify-center text-[#4A3728] text-xs font-black">
                  {user.name.charAt(0)}
                </div>
                <button
                  onClick={onLogout}
                  className="p-1.5 text-[#4A3728]/65 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D97706] hover:bg-[#b45309] text-white rounded-full text-xs font-black uppercase tracking-wider border-2 border-[#4A3728] shadow-[2px_2px_0px_0px_rgba(74,55,40,1)] hover:translate-y-[-1px] transition-all cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
