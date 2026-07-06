/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Mail, User as UserIcon, CheckCircle, Info } from 'lucide-react';
import { User } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const mockUsers = [
    {
      name: 'Priya Sharma',
      email: 'priya@nainital.com',
      phone: '+91 98765 43210',
      address: '14 Ayarpatta Pine Crest Road, Nainital',
    },
    {
      name: 'Vikram Singh',
      email: 'vikram.critic@foodie.in',
      phone: '+91 99887 76655',
      address: 'Room 304, Lake View Grand Hotel, Mall Road',
    },
  ];

  const handleQuickLogin = (mUser: typeof mockUsers[0]) => {
    const loggedUser: User = {
      email: mUser.email,
      name: mUser.name,
      phone: mUser.phone,
      address: mUser.address,
      isAuthenticated: true,
    };
    setFeedback(`Successfully logged in as ${mUser.name}!`);
    setTimeout(() => {
      onLoginSuccess(loggedUser);
      setFeedback(null);
      onClose();
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const loggedUser: User = {
      email: email,
      name: name || email.split('@')[0],
      phone: phone || '+91 94120 00000',
      address: address || 'Mall Road Central, Nainital',
      isAuthenticated: true,
    };

    setFeedback(isRegister ? 'Account created successfully!' : 'Logged in successfully!');
    setTimeout(() => {
      onLoginSuccess(loggedUser);
      setFeedback(null);
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#4A3728]/50 backdrop-blur-sm"
          />

          {/* Modal box */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-md bg-[#FEF9F3] rounded-[32px] overflow-hidden shadow-[8px_8px_0px_0px_rgba(74,55,40,1)] border-4 border-[#4A3728] z-10 flex flex-col"
          >
            {/* Header banner decoration */}
            <div className="h-4 bg-[#FDE68A] border-b-4 border-[#4A3728]" />

            <div className="p-6">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-1.5 text-[#4A3728] hover:text-stone-900 rounded-full hover:bg-white border-2 border-[#4A3728] shadow-[1px_1px_0px_0px_rgba(74,55,40,1)] hover:translate-y-[-1px] transition-all cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title */}
              <div className="mb-6 mt-2">
                <h3 className="font-display text-2xl font-black text-[#4A3728] uppercase leading-tight">
                  {isRegister ? 'Bake an Account' : 'Welcome Back'}
                </h3>
                <p className="text-[#4A3728]/80 text-xs mt-1.5 font-bold">
                  {isRegister 
                    ? 'Join the Naini Crumbs Club for exclusive recipe rotations.' 
                    : 'Log in to track orders and save your lakeside delivery spots.'}
                </p>
              </div>

              {/* Success/Action Feedback overlay */}
              {feedback && (
                <div className="mb-4 p-3 bg-emerald-100 border-2 border-emerald-600 text-emerald-900 rounded-xl text-xs flex items-center gap-2 font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)]">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 animate-bounce" />
                  <span>{feedback}</span>
                </div>
              )}

              {/* Quick logins helper for testing */}
              {!isRegister && (
                <div className="mb-5 p-4 bg-white border-2 border-[#4A3728] rounded-2xl shadow-[3px_3px_0px_0px_rgba(74,55,40,1)]">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#4A3728] flex items-center gap-1 mb-2">
                    <Info className="w-3 h-3 text-[#D97706]" /> Developer testing quick-login:
                  </span>
                  <div className="flex flex-col gap-2">
                    {mockUsers.map((mu) => (
                      <button
                        key={mu.email}
                        type="button"
                        onClick={() => handleQuickLogin(mu)}
                        className="w-full text-left px-3 py-2 bg-[#FEF9F3] hover:bg-[#FDE68A] border-2 border-[#4A3728] rounded-xl text-xs text-[#4A3728] font-black transition-all flex justify-between items-center cursor-pointer shadow-[2px_2px_0px_0px_rgba(74,55,40,1)] hover:translate-y-[-1px]"
                      >
                        <span className="truncate">👤 {mu.name} <span className="text-[10px] text-stone-500 font-normal">({mu.email})</span></span>
                        <span className="text-[10px] text-[#4A3728] bg-[#FDE68A] border-2 border-[#4A3728] px-1.5 py-0.5 rounded font-mono shrink-0 ml-1">Fill</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {isRegister && (
                  <div>
                    <label className="text-[11px] font-black text-[#4A3728] uppercase tracking-wider block mb-1">Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-[#4A3728] z-10" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Bisht"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-[#4A3728] rounded-xl text-xs text-[#4A3728] font-bold placeholder-stone-400 focus:outline-hidden focus:border-[#D97706] shadow-[2px_2px_0px_0px_rgba(74,55,40,1)]"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-black text-[#4A3728] uppercase tracking-wider block mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#4A3728] z-10" />
                    <input
                      type="email"
                      required
                      placeholder="you@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-[#4A3728] rounded-xl text-xs text-[#4A3728] font-bold placeholder-stone-400 focus:outline-hidden focus:border-[#D97706] shadow-[2px_2px_0px_0px_rgba(74,55,40,1)]"
                    />
                  </div>
                </div>

                {isRegister && (
                  <>
                    <div>
                      <label className="text-[11px] font-black text-[#4A3728] uppercase tracking-wider block mb-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +91 94120 XXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border-2 border-[#4A3728] rounded-xl text-xs text-[#4A3728] font-bold placeholder-stone-400 focus:outline-hidden focus:border-[#D97706] shadow-[2px_2px_0px_0px_rgba(74,55,40,1)]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-black text-[#4A3728] uppercase tracking-wider block mb-1">Default Delivery Address</label>
                      <textarea
                        required
                        placeholder="Your Lakeside Hotel, Mall Road room number or local residence details..."
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        rows={2}
                        className="w-full px-4 py-2 bg-white border-2 border-[#4A3728] rounded-xl text-xs text-[#4A3728] font-bold placeholder-stone-400 focus:outline-hidden focus:border-[#D97706] shadow-[2px_2px_0px_0px_rgba(74,55,40,1)] resize-none"
                      />
                    </div>
                  </>
                )}

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] font-black text-[#4A3728] uppercase tracking-wider">Password</label>
                    {!isRegister && (
                      <button type="button" className="text-[10px] text-[#4A3728] font-black uppercase hover:underline cursor-pointer">Forgot?</button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#4A3728] z-10" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-[#4A3728] rounded-xl text-xs text-[#4A3728] font-bold placeholder-stone-400 focus:outline-hidden focus:border-[#D97706] shadow-[2px_2px_0px_0px_rgba(74,55,40,1)]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#FDE68A] hover:bg-white text-[#4A3728] border-2 border-[#4A3728] font-black uppercase rounded-xl text-xs transition-all shadow-[3px_3px_0px_0px_rgba(74,55,40,1)] mt-4 cursor-pointer hover:translate-y-[-1px]"
                >
                  {isRegister ? 'Register & Bake Account' : 'Sign In'}
                </button>
              </form>

              {/* Toggle register */}
              <div className="mt-6 pt-4 border-t-2 border-[#4A3728]/20 text-center text-xs text-[#4A3728]/70 font-bold">
                <span>
                  {isRegister ? 'Already have an account?' : "Don't have an account yet?"}
                </span>{' '}
                <button
                  onClick={() => setIsRegister(!isRegister)}
                  className="text-[#4A3728] font-black hover:underline ml-1 cursor-pointer"
                >
                  {isRegister ? 'Sign In' : 'Create Account'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
