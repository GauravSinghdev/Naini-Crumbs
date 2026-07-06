/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, MapPin } from 'lucide-react';
import { CartItem, DeliveryArea } from '../types';
import { DELIVERY_AREAS } from '../data';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cookieId: string, delta: number) => void;
  onRemoveItem: (cookieId: string) => void;
  onStartCheckout: () => void;
  selectedArea: DeliveryArea;
  onSelectArea: (area: DeliveryArea) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onStartCheckout,
  selectedArea,
  onSelectArea
}: CartDrawerProps) {
  const subtotal = cartItems.reduce((acc, item) => acc + item.cookie.price * item.quantity, 0);
  const deliveryFee = selectedArea.deliveryFee;
  const total = subtotal + deliveryFee;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#4A3728]/50 backdrop-blur-xs"
          />

          {/* Drawer container */}
          <div className="absolute inset-y-0 right-0 max-w-full pl-10 flex">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="w-screen max-w-md bg-[#FEF9F3] border-l-4 border-[#4A3728] shadow-2xl flex flex-col h-full"
            >
              {/* Header */}
              <div className="px-6 py-5 bg-[#FEF9F3] border-b-4 border-[#4A3728] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#4A3728]" />
                  <h3 className="font-display text-lg font-black text-[#4A3728] uppercase">
                    Your Fresh Cookie Box
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 text-[#4A3728] hover:text-[#D97706] rounded-full hover:bg-white border-2 border-[#4A3728] shadow-[1px_1px_0px_0px_rgba(74,55,40,1)] hover:translate-y-[-1px] transition-all cursor-pointer"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Content list */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-[#FEF9F3]">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center py-20 flex-1">
                    <div className="w-16 h-16 rounded-full bg-[#FDE68A] border-2 border-[#4A3728] flex items-center justify-center text-[#4A3728] mb-4 animate-bounce shadow-[2px_2px_0px_0px_rgba(74,55,40,1)] text-2xl">
                      🍪
                    </div>
                    <h4 className="font-display text-base font-black text-[#4A3728] uppercase">Your basket is empty</h4>
                    <p className="text-[#4A3728]/80 text-xs max-w-xs mt-1.5 leading-relaxed font-bold">
                      Wander over to our Fresh Menu section and pick a couple of warm handmade cookies!
                    </p>
                    <button
                      onClick={onClose}
                      className="mt-6 px-4 py-2.5 bg-[#4A3728] hover:bg-white border-2 border-[#4A3728] text-[#FEF9F3] hover:text-[#4A3728] rounded-xl text-xs font-black uppercase transition-all shadow-[2px_2px_0px_0px_rgba(74,55,40,1)] cursor-pointer hover:translate-y-[-1px]"
                    >
                      Browse Menu
                    </button>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.cookie.id}
                      className="flex items-center gap-4 p-3 bg-white border-2 border-[#4A3728] rounded-2xl shadow-[3px_3px_0px_0px_rgba(74,55,40,1)] relative group"
                    >
                      {/* Image */}
                      <img
                        src={item.cookie.image}
                        alt={item.cookie.name}
                        className="w-14 h-14 object-cover rounded-xl shrink-0 border-2 border-[#4A3728]"
                        referrerPolicy="no-referrer"
                      />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-black text-[#D97706] uppercase tracking-wider block">
                          {item.cookie.isSeasonal ? `${item.cookie.season} Special` : 'Signature Recipe'}
                        </span>
                        <h4 className="font-display text-sm font-black text-[#4A3728] uppercase truncate">
                          {item.cookie.name}
                        </h4>
                        <span className="text-xs font-black text-[#4A3728] block mt-0.5">
                          ₹{item.cookie.price * item.quantity}
                          <span className="text-[10px] text-stone-400 font-normal"> (₹{item.cookie.price} x {item.quantity})</span>
                        </span>
                      </div>

                      {/* Controls and delete */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <button
                          onClick={() => onRemoveItem(item.cookie.id)}
                          className="p-1 text-[#4A3728]/60 hover:text-red-600 rounded hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete from cart"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="flex items-center bg-white border-2 border-[#4A3728] rounded-lg p-0.5 shadow-[1px_1px_0px_0px_rgba(74,55,40,1)]">
                          <button
                            onClick={() => onUpdateQuantity(item.cookie.id, -1)}
                            className="p-1 hover:bg-[#FEF9F3] rounded text-[#4A3728] cursor-pointer"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-black text-[#4A3728]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.cookie.id, 1)}
                            className="p-1 hover:bg-[#FEF9F3] rounded text-[#4A3728] cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Delivery area selector inside Cart Drawer to calculate exact total */}
              {cartItems.length > 0 && (
                <div className="p-6 bg-white border-t-4 border-[#4A3728] flex flex-col gap-4 shadow-inner">
                  <div>
                    <label className="text-[11px] font-black text-[#4A3728] uppercase tracking-wider block mb-1">
                      Deliver To Area
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-[#D97706] z-10" />
                      <select
                        value={selectedArea.id}
                        onChange={(e) => {
                          const area = DELIVERY_AREAS.find(a => a.id === e.target.value);
                          if (area) onSelectArea(area);
                        }}
                        className="w-full pl-9 pr-4 py-2.5 bg-white border-2 border-[#4A3728] rounded-xl text-xs font-black uppercase text-[#4A3728] focus:outline-hidden focus:border-[#D97706] shadow-[2px_2px_0px_0px_rgba(74,55,40,1)] cursor-pointer"
                      >
                        {DELIVERY_AREAS.map(area => (
                          <option key={area.id} value={area.id}>
                            {area.name} (₹{area.deliveryFee})
                          </option>
                        ))}
                      </select>
                    </div>
                    <span className="text-[10px] text-[#4A3728]/70 font-bold mt-1.5 block leading-tight">
                      Est. time: {selectedArea.minTimeMins} - {selectedArea.minTimeMins + 15} mins • {selectedArea.description}
                    </span>
                  </div>

                  {/* Price calculations */}
                  <div className="flex flex-col gap-2 pt-3 border-t-2 border-[#4A3728]/20 text-xs text-[#4A3728] font-bold">
                    <div className="flex justify-between">
                      <span>Cookie Box Subtotal:</span>
                      <span className="font-black text-[#4A3728]">₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lakeside Rider Fee:</span>
                      <span className="font-black text-[#4A3728]">
                        {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-[#4A3728] uppercase border-t-2 border-dashed border-[#4A3728]/30 pt-3 mt-1">
                      <span>Grand Total:</span>
                      <span className="text-lg font-black text-[#D97706]">₹{total}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={onStartCheckout}
                    className="w-full mt-4 py-3.5 bg-[#FDE68A] hover:bg-white text-[#4A3728] border-2 border-[#4A3728] font-black uppercase rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-[3px_3px_0px_0px_rgba(74,55,40,1)] cursor-pointer hover:translate-y-[-1px]"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
