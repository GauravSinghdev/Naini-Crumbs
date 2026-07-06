/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, CreditCard, ChevronRight, CheckCircle, Truck, Clock, Sparkles, AlertCircle, ShoppingBag, Loader2 } from 'lucide-react';
import { CartItem, DeliveryArea, User, Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  subtotal: number;
  deliveryArea: DeliveryArea;
  user: User;
  onOrderCompleted: () => void; // call on successful completion to clear cart
}

type CheckoutStep = 'delivery' | 'payment' | 'baking' | 'tracker';

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  subtotal,
  deliveryArea,
  user,
  onOrderCompleted
}: CheckoutModalProps) {
  const [step, setStep] = useState<CheckoutStep>('delivery');

  // Delivery details form
  const [name, setName] = useState(user.name || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [address, setAddress] = useState(user.address || '');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('upi');
  const [cardNo, setCardNo] = useState('');
  const [upiId, setUpiId] = useState('');

  // Active Order tracking state
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // Sync user values if user logs in during checkout session
  useEffect(() => {
    if (user.isAuthenticated) {
      setName(user.name);
      setPhone(user.phone);
      setAddress(user.address);
    }
  }, [user]);

  const deliveryFee = deliveryArea.deliveryFee;
  const total = subtotal + deliveryFee;

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('baking');

    // Generate random order details
    const orderId = `NC-${Math.floor(100000 + Math.random() * 900000)}`;
    const randomOrder: Order = {
      id: orderId,
      items: [...cartItems],
      subtotal,
      deliveryFee,
      total,
      deliveryArea: deliveryArea.name,
      deliveryAddress: address,
      customerName: name,
      customerPhone: phone,
      status: 'Received',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedDeliveryTime: `${deliveryArea.minTimeMins} mins`
    };

    setActiveOrder(randomOrder);

    // Simulate baking time before entering tracking panel
    setTimeout(() => {
      setStep('tracker');
      onOrderCompleted(); // Clear the main basket
    }, 2200);
  };

  // Status simulation control for the prototype
  const advanceOrderStatus = () => {
    if (!activeOrder) return;
    const statuses: Order['status'][] = ['Received', 'Baking', 'Out for Delivery', 'Delivered'];
    const currIndex = statuses.indexOf(activeOrder.status);
    if (currIndex < statuses.length - 1) {
      setActiveOrder({
        ...activeOrder,
        status: statuses[currIndex + 1]
      });
    }
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

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-2xl bg-[#FEF9F3] rounded-[32px] overflow-hidden shadow-[8px_8px_0px_0px_rgba(74,55,40,1)] border-4 border-[#4A3728] z-10 flex flex-col md:flex-row h-5/6 max-h-[620px]"
            id="checkout-modal-panel"
          >
            {/* Left Column - Form / Core Step (Responsive sizing) */}
            <div className="flex-1 p-6 overflow-y-auto flex flex-col justify-between h-full bg-[#FEF9F3]">
              <div>
                {/* Header and Step Indicator */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-wider text-[#D97706] block">
                      Secure Checkout
                    </span>
                    <h3 className="font-display text-xl font-black text-[#4A3728] uppercase leading-tight mt-1">
                      {step === 'delivery' && 'Lakeside Delivery Details'}
                      {step === 'payment' && 'Select Cookie Payment'}
                      {step === 'baking' && 'Oven Heating Up...'}
                      {step === 'tracker' && 'Track Warm Cookie Order'}
                    </h3>
                  </div>

                  {step !== 'tracker' && step !== 'baking' && (
                    <button
                      onClick={onClose}
                      className="p-1.5 text-[#4A3728] hover:text-[#D97706] rounded-full hover:bg-white border-2 border-[#4A3728] shadow-[1px_1px_0px_0px_rgba(74,55,40,1)] hover:translate-y-[-1px] transition-all cursor-pointer"
                      aria-label="Cancel checkout"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Progress bar steps */}
                {step !== 'tracker' && step !== 'baking' && (
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`h-2 flex-1 rounded-full border-2 border-[#4A3728] ${step === 'delivery' || step === 'payment' ? 'bg-[#D97706]' : 'bg-white'}`} />
                    <div className={`h-2 flex-1 rounded-full border-2 border-[#4A3728] ${step === 'payment' ? 'bg-[#D97706]' : 'bg-white'}`} />
                  </div>
                )}

                {/* STEP 1: DELIVERY ADDRESS DETAILS */}
                {step === 'delivery' && (
                  <form onSubmit={handleDeliverySubmit} className="flex flex-col gap-4">
                    {!user.isAuthenticated && (
                      <div className="p-3 bg-[#FDE68A] text-[#4A3728] border-2 border-[#4A3728] rounded-xl text-xs flex items-center gap-2 mb-2 font-bold shadow-[2px_2px_0px_0px_rgba(74,55,40,1)]">
                        <AlertCircle className="w-4 h-4 text-[#D97706] shrink-0" />
                        <span>Checkout as Guest or login for quick credentials pre-fills!</span>
                      </div>
                    )}

                    <div>
                      <label className="text-[10px] font-black text-[#4A3728] uppercase tracking-wider block mb-1">
                        Recipient Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full px-4 py-2.5 bg-white border-2 border-[#4A3728] rounded-xl text-xs text-[#4A3728] font-bold focus:outline-hidden focus:border-[#D97706] shadow-[2px_2px_0px_0px_rgba(74,55,40,1)]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-[#4A3728] uppercase tracking-wider block mb-1">
                        Mobile Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +91 94120 XXXXX"
                        className="w-full px-4 py-2.5 bg-white border-2 border-[#4A3728] rounded-xl text-xs text-[#4A3728] font-bold focus:outline-hidden focus:border-[#D97706] shadow-[2px_2px_0px_0px_rgba(74,55,40,1)]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-[#4A3728] uppercase tracking-wider block mb-1">
                        Lakeside / Hotel Delivery Address
                      </label>
                      <textarea
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        rows={3}
                        placeholder="Hotel name, room number, or landmark near Mall Road/Tallital..."
                        className="w-full px-4 py-2.5 bg-white border-2 border-[#4A3728] rounded-xl text-xs text-[#4A3728] font-bold focus:outline-hidden focus:border-[#D97706] resize-none shadow-[2px_2px_0px_0px_rgba(74,55,40,1)]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-[#FDE68A] hover:bg-white text-[#4A3728] border-2 border-[#4A3728] font-black uppercase rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-[3px_3px_0px_0px_rgba(74,55,40,1)] cursor-pointer hover:translate-y-[-1px] mt-2"
                    >
                      <span>Continue to Payment</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </form>
                )}

                {/* STEP 2: SIMULATED PAYMENT OPTIONS */}
                {step === 'payment' && (
                  <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-3">
                      {/* UPI */}
                      <label className={`p-4 border-2 rounded-2xl flex items-start gap-3 cursor-pointer transition-all ${paymentMethod === 'upi' ? 'bg-[#FDE68A] border-[#4A3728] shadow-[3px_3px_0px_0px_rgba(74,55,40,1)]' : 'border-[#4A3728] bg-white hover:bg-[#FEF9F3] shadow-[2px_2px_0px_0px_rgba(74,55,40,1)]'}`}>
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'upi'}
                          onChange={() => setPaymentMethod('upi')}
                          className="mt-0.5 accent-[#4A3728] cursor-pointer"
                        />
                        <div className="flex-1">
                          <span className="text-xs font-black text-[#4A3728] uppercase block leading-tight">Instant UPI / Google Pay</span>
                          <span className="text-[10px] text-[#4A3728]/80 block mt-0.5 leading-snug font-bold">Pay using any UPI app (PhonePe, GPay, Paytm) for fastest baking dispatch.</span>
                          {paymentMethod === 'upi' && (
                            <input
                              type="text"
                              required
                              placeholder="e.g. name@okhdfcbank"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              className="w-full mt-3 px-3 py-2 bg-white border-2 border-[#4A3728] rounded-lg text-xs font-bold text-[#4A3728]"
                            />
                          )}
                        </div>
                      </label>

                      {/* Card */}
                      <label className={`p-4 border-2 rounded-2xl flex items-start gap-3 cursor-pointer transition-all ${paymentMethod === 'card' ? 'bg-[#FDE68A] border-[#4A3728] shadow-[3px_3px_0px_0px_rgba(74,55,40,1)]' : 'border-[#4A3728] bg-white hover:bg-[#FEF9F3] shadow-[2px_2px_0px_0px_rgba(74,55,40,1)]'}`}>
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'card'}
                          onChange={() => setPaymentMethod('card')}
                          className="mt-0.5 accent-[#4A3728] cursor-pointer"
                        />
                        <div className="flex-1">
                          <span className="text-xs font-black text-[#4A3728] uppercase block leading-tight">Debit / Credit Card</span>
                          <span className="text-[10px] text-[#4A3728]/80 block mt-0.5 leading-snug font-bold">Secure credit card transactions.</span>
                          {paymentMethod === 'card' && (
                            <input
                              type="text"
                              required
                              placeholder="4111 •••• •••• ••••"
                              maxLength={19}
                              value={cardNo}
                              onChange={(e) => setCardNo(e.target.value)}
                              className="w-full mt-3 px-3 py-2 bg-white border-2 border-[#4A3728] rounded-lg text-xs font-bold text-[#4A3728]"
                            />
                          )}
                        </div>
                      </label>

                      {/* Cash on Delivery */}
                      <label className={`p-4 border-2 rounded-2xl flex items-start gap-3 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'bg-[#FDE68A] border-[#4A3728] shadow-[3px_3px_0px_0px_rgba(74,55,40,1)]' : 'border-[#4A3728] bg-white hover:bg-[#FEF9F3] shadow-[2px_2px_0px_0px_rgba(74,55,40,1)]'}`}>
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          className="mt-0.5 accent-[#4A3728] cursor-pointer"
                        />
                        <div className="flex-1">
                          <span className="text-xs font-black text-[#4A3728] uppercase block leading-tight">Lakeside Cash on Delivery</span>
                          <span className="text-[10px] text-[#4A3728]/80 block mt-0.5 leading-snug font-bold">Hand over cash or scan QR when our delivery rider arrives with your warm cookies.</span>
                        </div>
                      </label>
                    </div>

                    <div className="flex gap-3 mt-4">
                      <button
                        type="button"
                        onClick={() => setStep('delivery')}
                        className="flex-1 py-3 border-2 border-[#4A3728] hover:bg-white text-[#4A3728] bg-transparent rounded-xl text-xs font-black uppercase transition-all shadow-[2px_2px_0px_0px_rgba(74,55,40,1)] cursor-pointer hover:translate-y-[-1px]"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex-2 py-3 bg-[#FDE68A] hover:bg-white text-[#4A3728] border-2 border-[#4A3728] font-black uppercase rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-[3px_3px_0px_0px_rgba(74,55,40,1)] cursor-pointer hover:translate-y-[-1px]"
                      >
                        <span>Place Order (₹{total})</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* STEP 3: BAKING SIMULATION LOADER */}
                {step === 'baking' && (
                  <div className="flex flex-col items-center justify-center text-center py-16 flex-1 gap-4">
                    <Loader2 className="w-12 h-12 text-[#4A3728] animate-spin" />
                    <div>
                      <h4 className="font-display text-lg font-black text-[#4A3728] uppercase">Starting the Ovens...</h4>
                      <p className="text-xs text-[#4A3728]/80 max-w-xs mt-2 leading-relaxed font-bold">
                        Communicating with our Mall Road kitchen. We are preparing the organic flour, brown butter and heating up the cast iron pans.
                      </p>
                    </div>
                    {/* Tiny animated progress indicator */}
                    <div className="w-48 h-2.5 bg-white border-2 border-[#4A3728] rounded-full overflow-hidden mt-2 shadow-[1px_1px_0px_0px_rgba(74,55,40,1)]">
                      <motion.div
                        className="h-full bg-[#D97706]"
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 2 }}
                      />
                    </div>
                  </div>
                )}

                {/* STEP 4: ORDER TRACKING SYSTEM */}
                {step === 'tracker' && activeOrder && (
                  <div className="flex flex-col gap-5 flex-1">
                    {/* Order summary card */}
                    <div className="p-4 bg-white border-2 border-[#4A3728] rounded-2xl shadow-[3px_3px_0px_0px_rgba(74,55,40,1)] text-[#4A3728]">
                      <div className="flex justify-between items-center text-xs font-black uppercase text-[#4A3728] mb-2">
                        <span>Order Number:</span>
                        <span className="font-mono text-[11px] bg-[#FDE68A] border-2 border-[#4A3728] px-2.5 py-0.5 rounded shadow-[1px_1px_0px_0px_rgba(74,55,40,1)]">{activeOrder.id}</span>
                      </div>
                      <div className="text-[11px] text-[#4A3728]/90 space-y-1 font-bold">
                        <div><strong className="font-black text-[#4A3728]">Recipient:</strong> {activeOrder.customerName} ({activeOrder.customerPhone})</div>
                        <div><strong className="font-black text-[#4A3728]">Sector:</strong> {activeOrder.deliveryArea}</div>
                        <div className="truncate"><strong className="font-black text-[#4A3728]">Destination:</strong> {activeOrder.deliveryAddress}</div>
                      </div>
                    </div>

                    {/* Tracker Stepper list */}
                    <div className="flex flex-col gap-4 relative pl-8 before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#4A3728]">
                      {/* Step 1 */}
                      <div className="relative flex items-start gap-3">
                        <div className={`absolute -left-8 w-7.5 h-7.5 rounded-full border-2 border-[#4A3728] flex items-center justify-center text-xs font-bold z-10 ${
                          activeOrder.status === 'Received' || activeOrder.status === 'Baking' || activeOrder.status === 'Out for Delivery' || activeOrder.status === 'Delivered'
                            ? 'bg-[#FDE68A] text-[#4A3728] shadow-[2px_2px_0px_0px_rgba(74,55,40,1)]' : 'bg-white text-stone-400'
                        }`}>
                          ✓
                        </div>
                        <div>
                          <span className="text-xs font-black text-[#4A3728] uppercase block leading-none">Order Received</span>
                          <span className="text-[10px] text-[#4A3728]/70 mt-1 block font-bold leading-normal">Our kitchen has accepted your basket at {activeOrder.createdAt}.</span>
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div className="relative flex items-start gap-3">
                        <div className={`absolute -left-8 w-7.5 h-7.5 rounded-full border-2 border-[#4A3728] flex items-center justify-center text-xs font-bold z-10 ${
                          activeOrder.status === 'Baking' || activeOrder.status === 'Out for Delivery' || activeOrder.status === 'Delivered'
                            ? 'bg-[#FDE68A] text-[#4A3728] shadow-[2px_2px_0px_0px_rgba(74,55,40,1)] animate-pulse' : 'bg-white text-stone-400'
                        }`}>
                          {activeOrder.status === 'Received' ? '2' : '🍪'}
                        </div>
                        <div>
                          <span className="text-xs font-black text-[#4A3728] uppercase block leading-none">Baking in Mall Road Ovens</span>
                          <span className="text-[10px] text-[#4A3728]/70 mt-1 block font-bold leading-normal">Oven temperature: 180°C. Golden crust and melted chips forming.</span>
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div className="relative flex items-start gap-3">
                        <div className={`absolute -left-8 w-7.5 h-7.5 rounded-full border-2 border-[#4A3728] flex items-center justify-center text-xs font-bold z-10 ${
                          activeOrder.status === 'Out for Delivery' || activeOrder.status === 'Delivered'
                            ? 'bg-[#FDE68A] text-[#4A3728] shadow-[2px_2px_0px_0px_rgba(74,55,40,1)]' : 'bg-white text-stone-400'
                        }`}>
                          {activeOrder.status === 'Received' || activeOrder.status === 'Baking' ? '3' : '🛵'}
                        </div>
                        <div>
                          <span className="text-xs font-black text-[#4A3728] uppercase block leading-none">Out for Hot Delivery</span>
                          <span className="text-[10px] text-[#4A3728]/70 mt-1 block font-bold leading-normal">Insulated in bio-paper pouch. Rider is ascending the lake loop.</span>
                        </div>
                      </div>

                      {/* Step 4 */}
                      <div className="relative flex items-start gap-3">
                        <div className={`absolute -left-8 w-7.5 h-7.5 rounded-full border-2 border-[#4A3728] flex items-center justify-center text-xs font-bold z-10 ${
                          activeOrder.status === 'Delivered'
                            ? 'bg-emerald-300 text-[#4A3728] shadow-[2px_2px_0px_0px_rgba(74,55,40,1)]' : 'bg-white text-stone-400'
                        }`}>
                          {activeOrder.status === 'Delivered' ? '✓' : '4'}
                        </div>
                        <div>
                          <span className="text-xs font-black text-[#4A3728] uppercase block leading-none">Delivered Warm</span>
                          <span className="text-[10px] text-[#4A3728]/70 mt-1 block font-bold leading-normal">Arrived at your spot. Fresh baked joy, ready to unwrap and bite!</span>
                        </div>
                      </div>
                    </div>

                    {/* Developer Mock Control to test delivery tracking flow */}
                    <div className="p-3.5 bg-white border-2 border-[#4A3728] rounded-2xl mt-2 flex flex-col gap-1.5 text-center shadow-[3px_3px_0px_0px_rgba(74,55,40,1)]">
                      <span className="text-[10px] uppercase font-black tracking-wider text-[#4A3728] block">
                        Interactive Demo Controls:
                      </span>
                      <button
                        onClick={advanceOrderStatus}
                        disabled={activeOrder.status === 'Delivered'}
                        className={`py-2 rounded-xl text-[11px] font-black uppercase transition-all ${
                          activeOrder.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-600 cursor-not-allowed shadow-none'
                            : 'bg-[#4A3728] hover:bg-[#FEF9F3] text-white hover:text-[#4A3728] border-2 border-[#4A3728] cursor-pointer shadow-[2px_2px_0px_0px_rgba(74,55,40,1)]'
                        }`}
                      >
                        {activeOrder.status === 'Delivered' ? '✅ Finished Order Sandbox' : '🛵 Simulate Rider Movement'}
                      </button>
                    </div>

                    <button
                      onClick={onClose}
                      className="w-full py-3.5 bg-[#4A3728] hover:bg-white text-white hover:text-[#4A3728] border-2 border-[#4A3728] font-black uppercase rounded-xl text-xs transition-all cursor-pointer mt-auto shadow-[3px_3px_0px_0px_rgba(74,55,40,1)] hover:translate-y-[-1px]"
                    >
                      Return to Storefront
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Order Basket Summary (Always Visible except for step 'tracker') */}
            {step !== 'tracker' && (
              <div className="w-full md:w-[240px] bg-white border-t md:border-t-0 md:border-l-4 border-[#4A3728] p-6 flex flex-col justify-between shrink-0 h-full overflow-y-auto">
                <div>
                  <h4 className="font-display text-sm font-black text-[#4A3728] uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-[#D97706]" /> Basket Items
                  </h4>

                  <div className="flex flex-col gap-3 max-h-[220px] overflow-y-auto pr-1">
                    {cartItems.map((item) => (
                      <div key={item.cookie.id} className="flex gap-2.5 items-center text-xs font-bold text-[#4A3728]">
                        <img
                          src={item.cookie.image}
                          alt={item.cookie.name}
                          className="w-9 h-9 object-cover rounded-lg border-2 border-[#4A3728]"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="font-black text-[#4A3728] truncate block">{item.cookie.name}</span>
                          <span className="text-[#4A3728]/70 font-bold text-[10px] block">Qty: {item.quantity} x ₹{item.cookie.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t-2 border-dashed border-[#4A3728]/20 mt-4 text-xs space-y-2 font-bold text-[#4A3728]">
                  <div className="flex justify-between text-[#4A3728]/70">
                    <span>Oven Subtotal:</span>
                    <span className="font-black text-[#4A3728]">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-[#4A3728]/70">
                    <span>Lakeside Rider:</span>
                    <span className="font-black text-[#4A3728]">₹{deliveryFee}</span>
                  </div>
                  <div className="flex justify-between text-[#4A3728] text-sm font-black uppercase pt-3 border-t-2 border-[#4A3728]/20">
                    <span>Total Cost:</span>
                    <span className="text-base text-[#D97706]">₹{total}</span>
                  </div>

                  <div className="pt-3 text-[10px] text-[#4A3728]/80 text-center flex items-center gap-1.5 bg-[#FEF9F3] border-2 border-[#4A3728] p-2.5 rounded-xl font-bold shadow-[2px_2px_0px_0px_rgba(74,55,40,1)]">
                    <Clock className="w-3.5 h-3.5 text-[#4A3728] shrink-0" />
                    <span>Est. arrival: {deliveryArea.minTimeMins} mins to {deliveryArea.name.split(' (')[0]}</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
