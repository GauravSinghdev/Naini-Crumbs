/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Cookie, Review, DeliveryArea } from './types';

export const COOKIES_DATA: Cookie[] = [
  {
    id: 'rhododendron-roseate',
    name: 'Rhododendron Roseate Spark',
    description: 'A delicate organic flour cookie infused with hand-pressed Kumaoni Rhododendron petal jelly and finished with a shimmering sprinkle of rose-petal cane sugar.',
    price: 110,
    rating: 4.9,
    reviewsCount: 42,
    category: 'seasonal',
    image: 'https://images.unsplash.com/photo-1558961309-dbdf717d13d7?auto=format&fit=crop&q=80&w=600',
    tags: ['Floral', 'Jelly-Filled', 'Unique'],
    isSeasonal: true,
    season: 'Spring/Summer',
    allergens: ['Wheat', 'Dairy'],
    ingredients: ['Unbleached wheat flour', 'Rhododendron flower jelly', 'Organic grass-fed butter', 'Cane sugar', 'Vanilla extract'],
    nutrition: { calories: 180, protein: '2g', carbs: '24g', fat: '8g' }
  },
  {
    id: 'peach-cobbler-crumble',
    name: 'Naini Peach Cobbler Crumble',
    description: 'Brown-butter dough packed with sweet, cinnamon-spiced Ramgarh mountain peach pieces and topped with a crisp, crunchy brown sugar oat streusel.',
    price: 120,
    rating: 4.8,
    reviewsCount: 56,
    category: 'seasonal',
    image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=600',
    tags: ['Fruity', 'Brown Butter', 'Crumble'],
    isSeasonal: true,
    season: 'Summer/Monsoon',
    allergens: ['Wheat', 'Dairy', 'Oats'],
    ingredients: ['Spiced local peaches', 'Brown butter', 'Rolled oats', 'Cinnamon', 'Flour', 'Brown sugar'],
    nutrition: { calories: 210, protein: '3g', carbs: '28g', fat: '10g' }
  },
  {
    id: 'pine-nut-chocolate-fudge',
    name: 'Wild Pine Nut & Dark Fudge',
    description: 'Rich, ultra-fudgy 70% dark Belgian chocolate cookie folded with hand-foraged Himalayan pine nuts and a pinch of hand-harvested pink rock salt.',
    price: 130,
    rating: 4.95,
    reviewsCount: 89,
    category: 'seasonal',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600',
    tags: ['Fudgy', 'Nuts', 'Dark Chocolate'],
    isSeasonal: true,
    season: 'Autumn',
    allergens: ['Wheat', 'Dairy', 'Tree Nuts (Pine Nuts)'],
    ingredients: ['70% dark chocolate', 'Himalayan pine nuts', 'Cocoa powder', 'Grass-fed butter', 'Pink rock salt'],
    nutrition: { calories: 230, protein: '4g', carbs: '22g', fat: '14g' }
  },
  {
    id: 'snowy-peaks-mint',
    name: 'Snowy Peaks Mint Choc',
    description: 'A deep cocoa cookie loaded with organic white chocolate chips and wild mountain spearmint, dusted in snow-white confectioners sugar for a chilly crunch.',
    price: 115,
    rating: 4.7,
    reviewsCount: 34,
    category: 'seasonal',
    image: 'https://images.unsplash.com/photo-1548907040-4d42b52115ca?auto=format&fit=crop&q=80&w=600',
    tags: ['Cooling', 'White Chocolate', 'Minty'],
    isSeasonal: true,
    season: 'Winter',
    allergens: ['Wheat', 'Dairy', 'Soy Lecithin'],
    ingredients: ['Dark cocoa', 'Belgian white chocolate', 'Mountain spearmint oil', 'Powdered sugar', 'Flour'],
    nutrition: { calories: 195, protein: '3g', carbs: '25g', fat: '9g' }
  },
  {
    id: 'mall-road-walnut-fudge',
    name: 'Mall Road Walnut Fudge Classic',
    description: 'Our legendary, signature soft-baked chocolate chip cookie generously stuffed with melting dark chocolate callets and crisp roasted Kumaon walnuts.',
    price: 95,
    rating: 5.0,
    reviewsCount: 164,
    category: 'signature',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=600',
    tags: ['Bestseller', 'Classic', 'Walnuts'],
    isSeasonal: false,
    allergens: ['Wheat', 'Dairy', 'Tree Nuts (Walnuts)'],
    ingredients: ['Organic wheat flour', 'Semi-sweet chocolate chips', 'Roasted Nainital walnuts', 'Brown sugar', 'Farm egg'],
    nutrition: { calories: 220, protein: '4g', carbs: '26g', fat: '11g' }
  },
  {
    id: 'bhimtal-honey-almond',
    name: 'Bhimtal Honey Almond Crunch',
    description: 'A crunchy, caramelized golden-oat cookie sweetened entirely with pure wild Bhimtal forest honey and tossed with roasted slivered almonds.',
    price: 105,
    rating: 4.85,
    reviewsCount: 112,
    category: 'signature',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=600',
    tags: ['Crispy', 'Honey-Sweetened', 'Healthyish'],
    isSeasonal: false,
    allergens: ['Wheat', 'Dairy', 'Tree Nuts (Almonds)', 'Oats'],
    ingredients: ['Slivered almonds', 'Pure Bhimtal forest honey', 'Rolled oats', 'Unrefined flour', 'Clarified butter (Ghee)'],
    nutrition: { calories: 185, protein: '4.5g', carbs: '21g', fat: '9.5g' }
  },
  {
    id: 'tallital-spiced-chai',
    name: 'Tallital Spiced Chai Snickerdoodle',
    description: 'Soft snickerdoodle infused with a secret house blend of Kumaoni ginger, cardamom, and black pepper, rolled in caramelized demerara sugar.',
    price: 90,
    rating: 4.75,
    reviewsCount: 78,
    category: 'exclusive',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600',
    tags: ['Spiced', 'Warmth', 'Tea-Companion'],
    isSeasonal: false,
    allergens: ['Wheat', 'Dairy'],
    ingredients: ['Ceylon cinnamon', 'Green cardamom', 'Mountain dry ginger', 'Demerara sugar', 'Butter', 'Flour'],
    nutrition: { calories: 170, protein: '2g', carbs: '23g', fat: '7g' }
  },
  {
    id: 'kumaon-orange-cranberry',
    name: 'Kumaon Orange Zest & Cranberry',
    description: 'Refreshing and bright cookie featuring the grated aromatic zest of sun-kissed Kumaon oranges and chewy mountain-grown tart cranberries.',
    price: 100,
    rating: 4.8,
    reviewsCount: 65,
    category: 'exclusive',
    image: 'https://images.unsplash.com/photo-1558961309-dbdf717d13d7?auto=format&fit=crop&q=80&w=600',
    tags: ['Zesty', 'Tart', 'Butter Cookie'],
    isSeasonal: false,
    allergens: ['Wheat', 'Dairy'],
    ingredients: ['Kumaon orange zest', 'Dried mountain cranberries', 'Butter', 'Raw sugar', 'Pinch of sea salt'],
    nutrition: { calories: 190, protein: '2.5g', carbs: '26g', fat: '8.5g' }
  }
];

export const TESTIMONIALS_DATA: Review[] = [
  {
    id: 'rev-1',
    userName: 'Priya Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    userRole: 'Nainital Resident',
    rating: 5,
    comment: 'The Peach Cobbler cookie takes me straight back to walking through Ramgarh orchards as a child! Naini Crumbs has captured the true Himalayan soul in their baking. The local delivery to Mallital is always incredibly fast!',
    date: 'June 24, 2026',
    cookieName: 'Naini Peach Cobbler Crumble'
  },
  {
    id: 'rev-2',
    userName: 'Vikram Singh',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    userRole: 'Food Critic, Delhi',
    rating: 5,
    comment: 'I travel all over India for gourmet desserts, but the Wild Pine Nut cookie is in a class of its own. The woody crunch of Kumaon pine nuts paired with 70% dark Belgian chocolate is absolute genius. Essential stop in Nainital!',
    date: 'May 18, 2026',
    cookieName: 'Wild Pine Nut & Dark Fudge'
  },
  {
    id: 'rev-3',
    userName: 'Aanya Shah',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    userRole: 'Regular Traveler',
    rating: 5,
    comment: 'The snickerdoodles here with Kumaoni chai spices are phenomenal. We ordered a box of 12 for our lakeside picnic at Tallital, and the delivery guy rode all the way up to our viewpoint in perfect time! Fresh and still warm!',
    date: 'April 02, 2026',
    cookieName: 'Tallital Spiced Chai Snickerdoodle'
  },
  {
    id: 'rev-4',
    userName: 'Dr. Amit Pant',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    userRole: 'DSB Campus Professor',
    rating: 4.8,
    comment: 'Authentic local ingredients. The Bhimtal forest honey gives the almond cookie a unique woodsy sweetness that refined sugar simply cannot replicate. High-quality baking that makes our town proud.',
    date: 'March 14, 2026',
    cookieName: 'Bhimtal Honey Almond Crunch'
  }
];

export const DELIVERY_AREAS: DeliveryArea[] = [
  {
    id: 'mall-road',
    name: 'Mall Road (Lake Promenade)',
    zipCode: '263001',
    deliveryFee: 0,
    minTimeMins: 15,
    description: 'Free & fast delivery along the main walking promenade of Naini Lake.'
  },
  {
    id: 'tallital',
    name: 'Tallital (Southern Lake-end)',
    zipCode: '263002',
    deliveryFee: 30,
    minTimeMins: 20,
    description: 'Serving the bustling gateway area and local residential squares.'
  },
  {
    id: 'mallital',
    name: 'Mallital (Northern Lake-end)',
    zipCode: '263001',
    deliveryFee: 30,
    minTimeMins: 20,
    description: 'Deliveries up to Naina Devi Temple, Flats ground, and Mallital Bazaar.'
  },
  {
    id: 'ayarpatta',
    name: 'Ayarpatta Hill',
    zipCode: '263001',
    deliveryFee: 50,
    minTimeMins: 35,
    description: 'Scenic hill route through the lush oak and pine forests of Ayarpatta.'
  },
  {
    id: 'snow-view',
    name: 'Snow View Ridge / Zoo Road',
    zipCode: '263002',
    deliveryFee: 60,
    minTimeMins: 40,
    description: 'Steep hill climb deliveries up to the highest overlook view spots.'
  },
  {
    id: 'bhimtal-outer',
    name: 'Bhimtal Road (Outer Boundary)',
    zipCode: '263136',
    deliveryFee: 100,
    minTimeMins: 55,
    description: 'Fresh hot batches delivered straight down the highway to our sister lake.'
  }
];
