import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star, ArrowRight, ShieldCheck, Truck, Sparkles, MapPin, Check, Phone, ArrowUp, HelpCircle, Heart } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MenuSection from './components/MenuSection';
import CookieGravitySandbox from './components/CookieGravitySandbox';
import LocalDeliveryWidget from './components/LocalDeliveryWidget';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import LoginModal from './components/LoginModal';
import { COOKIES_DATA, TESTIMONIALS_DATA, DELIVERY_AREAS } from './data';
import { Cookie, CartItem, User, DeliveryArea } from './types';

export default function App() {
  // Application State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User>({
    email: '',
    name: '',
    phone: '',
    address: '',
    isAuthenticated: false,
  });

  // Active delivery area
  const [selectedArea, setSelectedArea] = useState<DeliveryArea>(DELIVERY_AREAS[0]); // Default Mall Road

  // UI state togglers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Selected season tab in the showcase
  const [showcaseSeason, setShowcaseSeason] = useState<'Spring/Summer' | 'Summer/Monsoon' | 'Autumn' | 'Winter'>('Summer/Monsoon');

  // Parallax helper: drift mouse-movement values
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    // Calculate normalized movement offset between -15 and 15 pixels
    const x = (clientX / window.innerWidth - 0.5) * 30;
    const y = (clientY / window.innerHeight - 0.5) * 30;
    setMousePosition({ x, y });
  };

  // State callbacks
  const handleAddToCart = (cookie: Cookie) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.cookie.id === cookie.id);
      if (existing) {
        return prev.map((item) =>
          item.cookie.id === cookie.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { cookie, quantity: 1 }];
    });
  };

  const handleUpdateCartQuantity = (cookieId: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.cookie.id === cookieId) {
          const newQty = item.quantity + delta;
          return { ...item, quantity: newQty < 1 ? 1 : newQty };
        }
        return item;
      })
    );
  };

  const handleRemoveCartItem = (cookieId: string) => {
    setCartItems((prev) => prev.filter((item) => item.cookie.id !== cookieId));
  };

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    // If user has a default address, check if it matches any delivery area or keep address
  };

  const handleLogout = () => {
    setUser({
      email: '',
      name: '',
      phone: '',
      address: '',
      isAuthenticated: false,
    });
  };

  // Cart count
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.cookie.price * item.quantity, 0);

  // Scroll section helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Season narrative helper
  const seasonNarratives = {
    'Spring/Summer': {
      title: 'Spring Rhododendron Bloom',
      desc: 'As pink & crimson Burans wildflowers carpet the high altitude ridges of Kumaon, we press organic petals into sweet floral jellies for a delightful spring-sweet crumble.',
      tag: 'Fresh Flower Nectars'
    },
    'Summer/Monsoon': {
      title: 'Lakeside Peach Harvest',
      desc: 'Ramgarh orchards are heavy with juicy mountain peaches during the monsoon. We load brown butter cookies with caramelized peaches and golden oat streusels.',
      tag: 'Fresh-Plucked Orchards'
    },
    'Autumn': {
      title: 'Himalayan Pine Cone Season',
      desc: 'Crisp amber autumn winds shake the giant pine trees. We forage raw pine nuts, roasting them to a nutty butteriness paired with rich 70% dark fudge.',
      tag: 'Hand-Foraged Mountain Nuts'
    },
    'Winter': {
      title: 'Snowy Peaks Mint Chilly Frost',
      desc: 'When snow covers Nainital peaks and Naini lake gets chilly, we bake cozy mint-dark chocolate batches covered in sugar dust resembling fresh Himalayan snow.',
      tag: 'Cozy Fireside Cacao'
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col relative bg-[#fcfbf7] selection:bg-amber-700/20 selection:text-amber-900"
      onMouseMove={handleMouseMove}
    >
      {/* Translucent floating Navbar */}
      <Navbar
        cartItemsCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
        user={user}
        onLoginClick={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
        selectedAreaName={selectedArea.name.split(' (')[0]}
        onScrollToSection={scrollToSection}
      />

      {/* Hero Banner with Interactive Parallax drifting and Floating Cookies */}
      <header id="hero" className="relative bg-[#FEF9F3] pt-14 pb-20 md:py-24 overflow-hidden border-b-4 border-[#4A3728]">
        {/* Parallax drifting vector elements */}
        <div 
          className="absolute inset-0 pointer-events-none hidden md:block"
          style={{
            transform: `translate(${mousePosition.x * 0.4}px, ${mousePosition.y * 0.4}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          {/* Background mountain outline watermarks */}
          <div className="absolute top-24 left-10 text-[#4A3728]/10 text-9xl font-display font-black leading-none uppercase select-none">
            KUMAON
          </div>
          <div className="absolute bottom-16 right-10 text-[#4A3728]/10 text-9xl font-display font-black leading-none uppercase select-none">
            ESTD 2024
          </div>
        </div>

        {/* Floating cookie vector items reacting to mouse parallax */}
        <div 
          className="absolute inset-0 pointer-events-none z-10 overflow-hidden"
          style={{
            transform: `translate(${mousePosition.x * -0.6}px, ${mousePosition.y * -0.6}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          {/* Drifting cookie 1 */}
          <motion.div 
            animate={{ y: [0, -12, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 right-[15%] w-16 h-16 rounded-full border-4 border-[#4A3728] shadow-[4px_4px_0px_0px_rgba(74,55,40,1)] flex items-center justify-center opacity-85 hover:scale-115 transition-transform"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=200")',
              backgroundSize: 'cover'
            }}
          />

          {/* Drifting cookie 2 */}
          <motion.div 
            animate={{ y: [0, 10, 0], rotate: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-20 left-[8%] w-12 h-12 rounded-full border-4 border-[#4A3728] shadow-[4px_4px_0px_0px_rgba(74,55,40,1)] flex items-center justify-center opacity-75"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=200")',
              backgroundSize: 'cover'
            }}
          />

          {/* Drifting mountain leaf */}
          <motion.span 
            animate={{ x: [0, 20, 0], y: [0, -15, 0], rotate: [0, 45, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 right-[8%] text-3xl opacity-30 filter grayscale"
          >
            🍃
          </motion.span>
        </div>

        {/* Core Hero Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left intro panel */}
            <div className="lg:col-span-7 flex flex-col items-start text-left bg-[#FDE68A] border-4 border-[#4A3728] rounded-[32px] p-6 sm:p-10 shadow-[8px_8px_0px_0px_rgba(74,55,40,1)] relative overflow-hidden">
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#4A3728] text-xs font-black border-2 border-[#4A3728] shadow-[2px_2px_0px_0px_rgba(74,55,40,1)] uppercase tracking-wider"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D97706] animate-spin" />
                <span>Nainital’s High-Altitude Artisan Cookie Bakery</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-display text-4xl sm:text-6xl font-black text-[#4A3728] tracking-tight leading-[0.95] mt-6 uppercase"
              >
                Handmade cookies baked by <span className="text-[#D97706] underline decoration-4 decoration-[#4A3728]">Naini Lake</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-[#4A3728]/90 text-sm sm:text-base mt-4 max-w-xl leading-relaxed font-bold"
              >
                We hand-roll premium, thick-crust cookies folding Kumaon-grown ingredients. Sweet local peaches, wild forest honey, and hand-gathered pine nuts are whipped with rich grass-fed butter. Delivered to your lakeside hotel or residence in under 45 minutes!
              </motion.p>

              {/* Action Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap items-center gap-4 mt-8 w-full sm:w-auto z-10"
              >
                <button
                  onClick={() => scrollToSection('menu')}
                  className="bento-btn-dark px-6 py-3.5 flex items-center gap-2 cursor-pointer text-sm"
                >
                  <span>Bake Your Basket Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollToSection('physics')}
                  className="bento-btn-secondary px-6 py-3.5 cursor-pointer text-sm"
                >
                  Play Gravity Sandbox
                </button>
              </motion.div>

              {/* Trust Indicators - Mini Bento Cards! */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-3 gap-4 mt-10 pt-6 border-t-2 border-[#4A3728]/20 w-full z-10"
              >
                <div className="bg-white p-3.5 rounded-2xl border-2 border-[#4A3728] shadow-[4px_4px_0px_0px_rgba(74,55,40,1)] text-center hover:translate-y-[-1px] transition-transform">
                  <span className="font-display text-xl sm:text-2xl font-black text-[#4A3728] block">4.9 ★</span>
                  <span className="text-[9px] text-[#4A3728]/70 font-black uppercase tracking-wider block mt-0.5">Guest Rating</span>
                </div>
                <div className="bg-white p-3.5 rounded-2xl border-2 border-[#4A3728] shadow-[4px_4px_0px_0px_rgba(74,55,40,1)] text-center hover:translate-y-[-1px] transition-transform">
                  <span className="font-display text-xl sm:text-2xl font-black text-[#4A3728] block">45m</span>
                  <span className="text-[9px] text-[#4A3728]/70 font-black uppercase tracking-wider block mt-0.5">Lakeside Trip</span>
                </div>
                <div className="bg-white p-3.5 rounded-2xl border-2 border-[#4A3728] shadow-[4px_4px_0px_0px_rgba(74,55,40,1)] text-center hover:translate-y-[-1px] transition-transform">
                  <span className="font-display text-xl sm:text-2xl font-black text-[#4A3728] block">100%</span>
                  <span className="text-[9px] text-[#4A3728]/70 font-black uppercase tracking-wider block mt-0.5">Kumaon Sourced</span>
                </div>
              </motion.div>
            </div>

            {/* Right graphic/photo column */}
            <div className="lg:col-span-5 relative flex">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative rounded-[32px] overflow-hidden w-full border-4 border-[#4A3728] shadow-[8px_8px_0px_0px_rgba(74,55,40,1)] bg-stone-100 flex"
              >
                <img
                  src="https://images.unsplash.com/photo-1544982503-9f984c14501a?auto=format&fit=crop&q=80&w=800"
                  alt="Cozy Himalayan Baker making cookies"
                  className="w-full h-full object-cover min-h-[350px]"
                  referrerPolicy="no-referrer"
                />

                {/* Overlaid floating batch badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-white p-3.5 rounded-2xl border-2 border-[#4A3728] flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(74,55,40,1)]">
                  <span className="text-2xl animate-bounce">🔥</span>
                  <div>
                    <span className="text-[9px] text-[#4A3728]/60 font-black uppercase block">Next Dispatch:</span>
                    <span className="text-xs font-black text-[#4A3728] uppercase block leading-none mt-0.5">Fresh batch leaves in 8 mins</span>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </header>

      {/* Seasonal Flavor Showcase Section */}
      <section id="seasonal" className="py-20 bg-[#FEF9F3] border-b-4 border-[#4A3728]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-[#4A3728] bg-[#FDE68A] px-3.5 py-1.5 rounded-full border-2 border-[#4A3728] shadow-[2px_2px_0px_0px_rgba(74,55,40,1)]">
              The Kumaon Calendar
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-[#4A3728] tracking-tight mt-6 uppercase leading-none">
              Rotating Seasonal Recipes
            </h2>
            <p className="text-[#4A3728]/80 text-sm mt-3 leading-relaxed font-semibold">
              We sync our ovens with Nainital’s changing weather. Explore how the Kumaon forest seasons transform our handmade cookie recipe catalog!
            </p>
          </div>

          {/* Season Selector tabs */}
          <div className="flex justify-center gap-2 mb-10 max-w-lg mx-auto p-1.5 bg-white border-2 border-[#4A3728] rounded-2xl shadow-[4px_4px_0px_0px_rgba(74,55,40,1)]">
            {(['Spring/Summer', 'Summer/Monsoon', 'Autumn', 'Winter'] as const).map((season) => (
              <button
                key={season}
                onClick={() => setShowcaseSeason(season)}
                className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  showcaseSeason === season 
                    ? 'bg-[#4A3728] text-white border-2 border-[#4A3728] shadow-[2px_2px_0px_0px_rgba(74,55,40,1)]' 
                    : 'text-[#4A3728]/70 hover:text-[#4A3728] hover:bg-[#FEF9F3] border-2 border-transparent'
                }`}
              >
                {season.split('/')[0]}
              </button>
            ))}
          </div>

          {/* Selected Seasonal Recipe Presentation */}
          <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
            showcaseSeason === 'Spring/Summer' ? 'bg-[#D1FAE5]' :
            showcaseSeason === 'Summer/Monsoon' ? 'bg-[#FDE68A]' :
            showcaseSeason === 'Autumn' ? 'bg-[#FECACA]' :
            'bg-[#BFDBFE]'
          } border-4 border-[#4A3728] rounded-[32px] p-6 sm:p-10 shadow-[8px_8px_0px_0px_rgba(74,55,40,1)] transition-colors duration-300 relative overflow-hidden`}>
            {/* Season Text Story */}
            <div className="lg:col-span-5 flex flex-col items-start gap-4 text-left">
              <span className="text-[9px] uppercase font-black tracking-widest text-[#4A3728] bg-white px-3 py-1 rounded-full border-2 border-[#4A3728] shadow-[2px_2px_0px_0px_rgba(74,55,40,1)]">
                ⭐ {seasonNarratives[showcaseSeason].tag}
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-black text-[#4A3728] uppercase leading-tight">
                {seasonNarratives[showcaseSeason].title}
              </h3>
              <p className="text-[#4A3728]/95 text-xs sm:text-sm font-bold leading-relaxed">
                {seasonNarratives[showcaseSeason].desc}
              </p>

              {/* Show rotating cookie recipe of this season */}
              <div className="w-full pt-4 border-t-2 border-[#4A3728]/20">
                <span className="text-[10px] text-[#4A3728]/70 font-black uppercase tracking-wider block mb-2">Featured Seasonal Cookie:</span>
                {COOKIES_DATA.filter(c => c.isSeasonal && c.season === showcaseSeason).map(cookie => (
                  <div key={cookie.id} className="flex gap-4 items-center bg-white p-3.5 rounded-2xl border-2 border-[#4A3728] shadow-[4px_4px_0px_0px_rgba(74,55,40,1)]">
                    <img src={cookie.image} alt={cookie.name} className="w-12 h-12 object-cover rounded-xl shrink-0 border-2 border-[#4A3728]" referrerPolicy="no-referrer" />
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-black text-[#4A3728] uppercase truncate block">{cookie.name}</span>
                      <span className="text-[11px] font-black text-[#D97706] block mt-0.5">₹{cookie.price} <span className="text-[9px] text-[#4A3728]/60 font-medium lowercase">/ pair</span></span>
                    </div>
                    <button
                      onClick={() => handleAddToCart(cookie)}
                      className="px-3.5 py-1.5 bg-[#D97706] hover:bg-[#b45309] text-white border-2 border-[#4A3728] rounded-xl text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(74,55,40,1)] hover:translate-y-[-1px] transition-all cursor-pointer shrink-0"
                    >
                      Bake Add
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Showcase Image */}
            <div className="lg:col-span-7 h-[260px] sm:h-[320px] rounded-2xl overflow-hidden border-4 border-[#4A3728] shadow-[6px_6px_0px_0px_rgba(74,55,40,1)] bg-stone-100">
              <img
                src={
                  showcaseSeason === 'Spring/Summer' ? 'https://images.unsplash.com/photo-1558961309-dbdf717d13d7?auto=format&fit=crop&q=80&w=800' :
                  showcaseSeason === 'Summer/Monsoon' ? 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=800' :
                  showcaseSeason === 'Autumn' ? 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=800' :
                  'https://images.unsplash.com/photo-1548907040-4d42b52115ca?auto=format&fit=crop&q=80&w=800'
                }
                alt={showcaseSeason}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Menu section */}
      <section id="menu" className="py-20 bg-[#FEF9F3] border-b-4 border-[#4A3728]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-[#4A3728] bg-[#FDE68A] px-3.5 py-1.5 rounded-full border-2 border-[#4A3728] shadow-[2px_2px_0px_0px_rgba(74,55,40,1)]">
              Oven Fresh
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-[#4A3728] tracking-tight mt-6 uppercase leading-none">
              Artisan Batch Selection
            </h2>
            <p className="text-[#4A3728]/80 text-sm mt-3 leading-relaxed font-semibold">
              Every single cookie is rolled, stuffed, and baked to order. Mix and match your favorites! Packaged in food-grade, heat-locking insulated wraps.
            </p>
          </div>

          {/* Interactive Menu component */}
          <MenuSection onAddToCart={handleAddToCart} />
        </div>
      </section>

      {/* Interactive Physics Sandbox section */}
      <section id="physics" className="py-20 bg-[#FEF9F3] border-b-4 border-[#4A3728]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-[#4A3728] bg-[#FDE68A] px-3.5 py-1.5 rounded-full border-2 border-[#4A3728] shadow-[2px_2px_0px_0px_rgba(74,55,40,1)]">
              3D Gravity Simulator
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-[#4A3728] tracking-tight mt-6 uppercase leading-none">
              Explore Our Physical Cookie Box
            </h2>
            <p className="text-[#4A3728]/80 text-sm mt-3 leading-relaxed font-semibold">
              We engineered a real-time gravity and collision sandbox modeling system! Test cookie bouncing, wind resistance, and lunar or reversed gravity.
            </p>
          </div>

          <CookieGravitySandbox />
        </div>
      </section>

      {/* Delivery Map & Sector Checker Section */}
      <section id="delivery" className="py-20 bg-[#FEF9F3] border-b-4 border-[#4A3728]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-[#4A3728] bg-[#FDE68A] px-3.5 py-1.5 rounded-full border-2 border-[#4A3728] shadow-[2px_2px_0px_0px_rgba(74,55,40,1)]">
              Fresh Dispatch
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-[#4A3728] tracking-tight mt-6 uppercase leading-none">
              Local Lakeside Delivery Checker
            </h2>
            <p className="text-[#4A3728]/80 text-sm mt-3 leading-relaxed font-semibold">
              Check delivery rates for your spot in Nainital. Select your location and watch our automated rider route tracking vector on the lake map!
            </p>
          </div>

          <LocalDeliveryWidget 
            selectedArea={selectedArea}
            onSelectArea={setSelectedArea}
          />
        </div>
      </section>

      {/* Testimonials with high social proof */}
      <section id="testimonials" className="py-20 bg-[#FEF9F3] border-b-4 border-[#4A3728]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-[#4A3728] bg-[#FDE68A] px-3.5 py-1.5 rounded-full border-2 border-[#4A3728] shadow-[2px_2px_0px_0px_rgba(74,55,40,1)]">
              Verified Love
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-[#4A3728] tracking-tight mt-6 uppercase leading-none">
              Glowing Guest Testimonials
            </h2>
            <p className="text-[#4A3728]/80 text-sm mt-3 leading-relaxed font-semibold">
              Here is what local Nainital residents and touring food connoisseurs have to say about our warm organic cookie boxes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS_DATA.map((review) => (
              <div 
                key={review.id} 
                className="p-5 bg-white border-2 border-[#4A3728] rounded-2xl shadow-[4px_4px_0px_0px_rgba(74,55,40,1)] hover:translate-y-[-2px] transition-transform flex flex-col justify-between"
              >
                <div>
                  {/* Rating Stars and verified icon */}
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(review.rating) ? 'fill-[#D97706] text-[#D97706]' : 'text-stone-200'}`} />
                      ))}
                    </div>
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-lg font-black uppercase tracking-wider flex items-center gap-0.5">
                      ✓ Verified
                    </span>
                  </div>

                  {/* Comment */}
                  <p className="text-[#4A3728] text-xs leading-relaxed italic font-bold">
                    "{review.comment}"
                  </p>
                </div>

                {/* Profile Avatar and Info */}
                <div className="flex items-center gap-3 mt-5 pt-4 border-t-2 border-[#4A3728]/10">
                  <img
                    src={review.userAvatar}
                    alt={review.userName}
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#4A3728] shadow-[2px_2px_0px_0px_rgba(74,55,40,1)]"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="text-xs font-black text-[#4A3728] uppercase block leading-tight">{review.userName}</span>
                    <span className="text-[10px] text-[#4A3728]/60 font-black block">{review.userRole}</span>
                    <span className="text-[8px] text-[#D97706] font-black block mt-1 uppercase bg-[#FDE68A] px-1.5 py-0.5 rounded border border-[#4A3728] w-fit">Ordered: {review.cookieName.split(' ')[0]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Secondary trust banner footer link */}
      <section className="py-12 bg-[#FEF9F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#4A3728] text-white border-4 border-[#4A3728] rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(74,55,40,1)] text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="font-display text-lg sm:text-xl font-black uppercase tracking-tight">Visiting Nainital this week?</h4>
              <p className="text-[#FEF9F3]/80 text-xs mt-1.5 font-bold">Stop by our flagship bakehouse on Mall Road for a free cardamom chai spiced sample with any tea order!</p>
            </div>
            <button
              onClick={() => scrollToSection('menu')}
              className="px-5 py-3 bg-[#FDE68A] text-[#4A3728] border-2 border-[#4A3728] hover:bg-white rounded-xl text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] hover:translate-y-[-1px] transition-all cursor-pointer shrink-0"
            >
              Explore Menu Selection
            </button>
          </div>
        </div>
      </section>

      {/* Drawer: Cart panel */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        selectedArea={selectedArea}
        onSelectArea={setSelectedArea}
        onStartCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Modal: Checkout multi-step forms */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        subtotal={cartSubtotal}
        deliveryArea={selectedArea}
        user={user}
        onOrderCompleted={() => setCartItems([])} // Clears cart on successful checkout placing
      />

      {/* Modal: Login credentials popup */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Footer block */}
      <Footer />
    </div>
  );
}
