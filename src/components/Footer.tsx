/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Instagram, Facebook, Send, CheckCircle, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribed(true);
    setTimeout(() => {
      setEmail('');
    }, 2000);
  };

  return (
    <footer className="bg-[#4A3728] text-[#FEF9F3] border-t-4 border-[#4A3728] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand/About */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#FDE68A] border-2 border-white flex items-center justify-center text-[#4A3728] font-display text-xl font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)]">
                N
              </div>
              <div>
                <span className="font-display text-lg font-black tracking-tight text-white block uppercase">
                  Naini Crumbs
                </span>
                <span className="text-[10px] uppercase tracking-wider font-black text-[#FDE68A] block">
                  Est. 2024 • Nainital
                </span>
              </div>
            </div>
            <p className="text-[#FEF9F3]/80 text-xs leading-relaxed mt-2 font-bold">
              Hand-rolling the finest organic cookies in the Kumaon region. We use local wild honey, orchard-fresh peaches, and harvested pine nuts to bring the pure taste of Himalayan heights straight to your doorstep.
            </p>
            <div className="flex items-center gap-3 mt-2">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer noopener"
                className="w-8 h-8 rounded-full bg-[#FEF9F3] text-[#4A3728] border-2 border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)] flex items-center justify-center hover:bg-white hover:translate-y-[-1px] transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer noopener"
                className="w-8 h-8 rounded-full bg-[#FEF9F3] text-[#4A3728] border-2 border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)] flex items-center justify-center hover:bg-white hover:translate-y-[-1px] transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-display text-sm font-black text-white uppercase tracking-wider mb-4 border-b-2 border-white/20 pb-2">
              Bakehouses & Hours
            </h4>
            <ul className="flex flex-col gap-3 text-xs text-[#FEF9F3]/90 font-bold">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#FDE68A] shrink-0 mt-0.5" />
                <div>
                  <span className="font-black text-white block">Main Lakeside Bakehouse:</span>
                  12 Mall Road, Near Yacht Club, Nainital, Uttarakhand, 263001
                </div>
              </li>
              <li>
                <span className="font-black text-white block">Mon - Sat Baking Hours:</span>
                08:00 AM - 10:00 PM
              </li>
              <li>
                <span className="font-black text-white block">Sunday Baking Hours:</span>
                09:00 AM - 08:00 PM (Late Night Delivery is Closed)
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="font-display text-sm font-black text-white uppercase tracking-wider mb-4 border-b-2 border-white/20 pb-2">
              Get in Touch
            </h4>
            <ul className="flex flex-col gap-3 text-xs text-[#FEF9F3]/90 font-bold">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FDE68A] shrink-0" />
                <span>+91 94120 00000 (Toll-Free/Orders)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FDE68A] shrink-0" />
                <span>hello@nainicrumbs.com</span>
              </li>
              <li className="text-[11px] bg-[#FDE68A] border-2 border-white text-[#4A3728] p-3 rounded-xl leading-relaxed mt-1 font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)]">
                🌲 <strong>Local Delivery Note:</strong> Extreme weather, snowfall, or lake-mist storms may delay deliveries beyond Tallital. Packed in insulated eco-paper!
              </li>
            </ul>
          </div>

          {/* Newsletter signup */}
          <div className="flex flex-col gap-4">
            <h4 className="font-display text-sm font-black text-white uppercase tracking-wider mb-1 border-b-2 border-white/20 pb-2">
              Club Newsletter
            </h4>
            <p className="text-[#FEF9F3]/80 text-xs leading-relaxed font-bold">
              Unlock secret recipes, 15% off your first order, and early announcements when seasonal batches launch!
            </p>

            <AnimatePresence mode="wait">
              {!isSubscribed ? (
                <motion.form 
                  key="form"
                  onSubmit={handleSubscribe} 
                  className="flex gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-3 py-2 bg-[#FEF9F3] border-2 border-white rounded-xl text-xs text-[#4A3728] placeholder-stone-500 focus:outline-hidden focus:border-white font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)]"
                  />
                  <button
                    type="submit"
                    className="p-2.5 bg-[#FDE68A] hover:bg-white text-[#4A3728] border-2 border-white rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)]"
                    aria-label="Subscribe"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  key="success"
                  className="p-3 bg-[#D1FAE5] border-2 border-white text-emerald-800 rounded-xl flex items-center gap-2 text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)]"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                >
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Subscribed! Check your inbox for code.</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom divider and copyright */}
        <div className="mt-12 pt-8 border-t-2 border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FEF9F3]/70 font-bold">
          <div>
            © {new Date().getFullYear()} Naini Crumbs Bakehouse. All rights reserved. Registered under Kumaon FSSAI Authority.
          </div>
          <div className="flex items-center gap-1.5 font-black">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>in Nainital Hills</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
