/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Cookie {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  reviewsCount: number;
  category: 'seasonal' | 'signature' | 'exclusive';
  image: string;
  tags: string[];
  isSeasonal: boolean;
  season?: 'Spring/Summer' | 'Summer/Monsoon' | 'Autumn' | 'Winter';
  allergens: string[];
  ingredients: string[];
  nutrition: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
  };
}

export interface CartItem {
  cookie: Cookie;
  quantity: number;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  userRole: string; // e.g. "Verified Local", "Touring Foodie", "Nainital Resident"
  rating: number;
  comment: string;
  date: string;
  cookieName: string;
}

export interface DeliveryArea {
  id: string;
  name: string;
  zipCode: string;
  deliveryFee: number;
  minTimeMins: number;
  description: string;
}

export interface User {
  email: string;
  name: string;
  phone: string;
  address: string;
  isAuthenticated: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryArea: string;
  deliveryAddress: string;
  customerName: string;
  customerPhone: string;
  status: 'Received' | 'Baking' | 'Out for Delivery' | 'Delivered';
  createdAt: string;
  estimatedDeliveryTime: string;
}
