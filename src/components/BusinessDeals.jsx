// src/components/BusinessDeals.jsx
// Unified category structure across all deals

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthModal } from '../context/AuthModalContext';
import { useAuth } from '../context/AuthContext';
import notificationService from '../services/notificationService';
import { getAllDeals } from '../services/dealService';

export default function BusinessDeals() {
  const navigate = useNavigate();
  const { openSignup } = useAuthModal();
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [activeBusiness, setActiveBusiness] = useState('all');
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [greeting, setGreeting] = useState('');
  const [firstName, setFirstName] = useState('there');

  useEffect(() => {
    loadFavorites();
    checkExpiringDeals();
    setTimeBasedGreeting();
    getUserFirstName();
    filterDealsByBusiness();
    
    const expirationInterval = setInterval(checkExpiringDeals, 3600000);
    
    const handleFavoritesChange = () => {
      loadFavorites();
    };
    
    const handleDealsUpdate = () => {
      console.log('🔄 Deals updated, reloading BusinessDeals...');
      filterDealsByBusiness();
    };
    
    window.addEventListener('favoritesChanged', handleFavoritesChange);
    window.addEventListener('storage', handleFavoritesChange);
    window.addEventListener('storage', handleDealsUpdate);
    window.addEventListener('dealsUpdated', handleDealsUpdate);
    
    return () => {
      window.removeEventListener('favoritesChanged', handleFavoritesChange);
      window.removeEventListener('storage', handleFavoritesChange);
      window.removeEventListener('storage', handleDealsUpdate);
      window.removeEventListener('dealsUpdated', handleDealsUpdate);
      clearInterval(expirationInterval);
    };
  }, [user]);

  useEffect(() => {
    filterDealsByBusiness();
  }, [activeBusiness]);

  const setTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good Morning');
    } else if (hour < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  };

  const getUserFirstName = () => {
    if (user) {
      const name = user.full_name?.split(' ')[0] || user.username || 'there';
      setFirstName(name);
    } else {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const name = storedUser.full_name?.split(' ')[0] || storedUser.username || 'there';
      setFirstName(name);
    }
  };

  const loadFavorites = () => {
    try {
      const guestFavorites = JSON.parse(localStorage.getItem('guestFavorites') || '[]');
      const favoriteIds = guestFavorites.map(f => f.deal_id || f.id);
      setFavorites(favoriteIds);
    } catch (error) {
      console.error('Error loading favorites:', error);
      setFavorites([]);
    }
  };

  const checkExpiringDeals = () => {
    const guestFavorites = JSON.parse(localStorage.getItem('guestFavorites') || '[]');
    const now = new Date();
    
    guestFavorites.forEach(fav => {
      if (fav.validUntil) {
        const expiryDate = new Date(fav.validUntil);
        const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
        
        if (daysUntilExpiry > 0 && daysUntilExpiry <= 3) {
          const lastNotified = localStorage.getItem(`expiry_notified_${fav.deal_id}`);
          const today = new Date().toDateString();
          
          if (lastNotified !== today) {
            notificationService.createExpiringDealNotification(fav.title, daysUntilExpiry);
            localStorage.setItem(`expiry_notified_${fav.deal_id}`, today);
          }
        }
      }
    });
  };

  const isExpired = (validUntil) => {
    if (!validUntil) return false;
    return new Date(validUntil) < new Date();
  };

  const getDaysUntilExpiry = (validUntil) => {
    if (!validUntil) return null;
    const now = new Date();
    const expiry = new Date(validUntil);
    const days = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    return days;
  };

  const formatExpiryDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const isAuthenticated = () => {
    if (user) return true;
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    return !!storedUser.email;
  };

  const isBusinessAccount = () => {
    if (user) return user.accountType === 'business';
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    return storedUser.accountType === 'business';
  };

  // Unified category structure for all 56 deals
  const getAllBusinessDeals = () => {
    const dealsFromService = getAllDeals();
    
    const staticDeals = [
      // ==========================================
      // PIZZA PARADISE - 6 DEALS
      // Category: "Food & Dining"
      // Tags: [] (main category deals)
      // ==========================================
      {
        id: 'business-deal-1',
        deal_id: 'business-deal-1',
        title: "50% Off All Pizzas - Weekend Special",
        discount: "50% OFF",
        discount_percentage: 50,
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop&q=80",
        businessName: "Pizza Paradise",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Food & Dining",        // Main category
        tags: [],                         // No subcategory
        originalPrice: 39.99,
        discountedPrice: 19.99,
        description: "Enjoy delicious handcrafted pizzas with premium toppings.",
        validUntil: "2026-03-31",
        source: "business"
      },
      {
        id: 'business-deal-2',
        deal_id: 'business-deal-2',
        title: "Burger Combo - 35% Off",
        discount: "35% OFF",
        discount_percentage: 35,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop&q=80",
        businessName: "Pizza Paradise",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Food & Dining",
        tags: [],
        originalPrice: 29.99,
        discountedPrice: 19.49,
        description: "Juicy burgers with fresh ingredients.",
        validUntil: "2026-02-28",
        source: "business"
      },
      {
        id: 'business-deal-3',
        deal_id: 'business-deal-3',
        title: "Sushi All You Can Eat - 40% Discount",
        discount: "40% OFF",
        discount_percentage: 40,
        image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop&q=80",
        businessName: "Pizza Paradise",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Food & Dining",
        tags: [],
        originalPrice: 89.99,
        discountedPrice: 53.99,
        description: "Unlimited fresh sushi, sashimi, and rolls.",
        validUntil: "2026-04-30",
        source: "business"
      },
      {
        id: 'business-deal-4',
        deal_id: 'business-deal-4',
        title: "Coffee & Pastry Bundle - 30% Off",
        discount: "30% OFF",
        discount_percentage: 30,
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop&q=80",
        businessName: "Pizza Paradise",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Food & Dining",
        tags: [],
        originalPrice: 24.99,
        discountedPrice: 17.49,
        description: "Artisan coffee paired with freshly baked pastries.",
        validUntil: "2026-01-31",
        source: "business"
      },
      {
        id: 'business-deal-5',
        deal_id: 'business-deal-5',
        title: "Healthy Bowl Special - 45% Off",
        discount: "45% OFF",
        discount_percentage: 45,
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop&q=80",
        businessName: "Pizza Paradise",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Food & Dining",
        tags: [],
        originalPrice: 34.99,
        discountedPrice: 19.24,
        description: "Nutritious bowls with fresh vegetables.",
        validUntil: "2026-03-15",
        source: "business"
      },
      {
        id: 'business-deal-6',
        deal_id: 'business-deal-6',
        title: "Premium Steak Dinner - 50% Off",
        discount: "50% OFF",
        discount_percentage: 50,
        image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&h=600&fit=crop&q=80",
        businessName: "Pizza Paradise",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Food & Dining",
        tags: [],
        originalPrice: 119.99,
        discountedPrice: 59.99,
        description: "Expertly grilled premium cuts.",
        validUntil: "2026-05-31",
        source: "business"
      },

      // ==========================================
      // SKLEP CHARYTATYWNY - 50 DEALS
      // Category: "Grocery & Food"
      // Tags: ["breads", "frozen foods", "snacks", etc.]
      // ==========================================

      // Breads (5 deals)
      {
        id: 'business-deal-7',
        deal_id: 'business-deal-7',
        title: "Fresh Artisan Bread - 25% Off",
        discount: "25% OFF",
        discount_percentage: 25,
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop&q=80",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",       // Main category
        tags: ["breads"],                 // Subcategory
        originalPrice: 1.82,
        discountedPrice: 1.37,
        description: "Fresh artisan bread baked daily. Support charity while shopping.",
        productId: "233",
        validUntil: "2026-02-15",
        source: "business"
      },
      {
        id: 'business-deal-8',
        deal_id: 'business-deal-8',
        title: "Multigrain Loaf - 25% Off",
        discount: "25% OFF",
        discount_percentage: 25,
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&h=600&fit=crop&q=80",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        tags: ["breads"],
        originalPrice: 4.21,
        discountedPrice: 3.16,
        description: "Wholesome multigrain loaf. Nutritious and delicious.",
        productId: "127",
        validUntil: "2026-03-20",
        source: "business"
      },
      {
        id: 'business-deal-9',
        deal_id: 'business-deal-9',
        title: "Sourdough Bread - 25% Off",
        discount: "25% OFF",
        discount_percentage: 25,
        image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=800&h=600&fit=crop&q=80",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        tags: ["breads"],
        originalPrice: 4.84,
        discountedPrice: 3.65,
        description: "Traditional sourdough bread with tangy flavor.",
        productId: "144",
        validUntil: "2026-01-25",
        source: "business"
      },
      {
        id: 'business-deal-10',
        deal_id: 'business-deal-10',
        title: "White Sandwich Bread - 25% Off",
        discount: "25% OFF",
        discount_percentage: 25,
        image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=800&h=600&fit=crop&q=80",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        tags: ["breads"],
        originalPrice: 3.45,
        discountedPrice: 2.6,
        description: "Soft white sandwich bread perfect for daily use.",
        productId: "242",
        validUntil: "2026-04-10",
        source: "business"
      },
      {
        id: 'business-deal-11',
        deal_id: 'business-deal-11',
        title: "French Baguette - 25% Off",
        discount: "25% OFF",
        discount_percentage: 25,
        image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=800&h=600&fit=crop&q=80",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        tags: ["breads"],
        originalPrice: 3.06,
        discountedPrice: 2.3,
        description: "Crusty French baguette with soft interior.",
        productId: "282",
        validUntil: "2026-02-28",
        source: "business"
      },

      // Frozen Foods (5 deals)
      {
        id: 'business-deal-12',
        deal_id: 'business-deal-12',
        title: "Quick Frozen Meal - 25% Off",
        discount: "25% OFF",
        discount_percentage: 25,
        image: "https://media.istockphoto.com/id/2202828025/photo/pre-packaged-meals-displayed-in-a-commercial-refrigerator.webp?a=1&b=1&s=612x612&w=0&k=20&c=sChnV_lOyNi0wCLtjbyii1o_UX1BMCRFOGn9nMew6Gs=",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        tags: ["frozen foods"],
        originalPrice: 4.75,
        discountedPrice: 3.56,
        description: "Quick frozen meal ready in minutes.",
        productId: "259",
        validUntil: "2026-03-30",
        source: "business"
      },
      {
        id: 'business-deal-13',
        deal_id: 'business-deal-13',
        title: "Premium Frozen Vegetables - 25% Off",
        discount: "25% OFF",
        discount_percentage: 25,
        image: "https://plus.unsplash.com/premium_photo-1725899526115-209d70eb6368?w=800&h=600&fit=crop&q=80",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        tags: ["frozen foods"],
        originalPrice: 6.34,
        discountedPrice: 4.76,
        description: "Premium frozen vegetables for healthy meals.",
        productId: "284",
        validUntil: "2026-05-15",
        source: "business"
      },
      {
        id: 'business-deal-14',
        deal_id: 'business-deal-14',
        title: "Frozen Pizza - 25% Off",
        discount: "25% OFF",
        discount_percentage: 25,
        image: "https://images.unsplash.com/photo-1623398969394-2c02e167498e?w=800&h=600&fit=crop&q=80",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        tags: ["frozen foods"],
        originalPrice: 4.16,
        discountedPrice: 3.12,
        description: "Delicious frozen pizza ready to bake.",
        productId: "165",
        validUntil: "2026-01-20",
        source: "business"
      },
      {
        id: 'business-deal-15',
        deal_id: 'business-deal-15',
        title: "Frozen Fruit Mix - 25% Off",
        discount: "25% OFF",
        discount_percentage: 25,
        image: "https://media.istockphoto.com/id/1961959715/photo/frozen-berries-isolated.webp?a=1&b=1&s=612x612&w=0&k=20&c=jupjmeiXSViCG3oOfPXqHfBjz7mOmMtTlZnUGHe7Ybg=",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        tags: ["frozen foods"],
        originalPrice: 5.75,
        discountedPrice: 4.31,
        description: "Frozen fruit smoothie mix with berries.",
        productId: "245",
        validUntil: "2026-04-25",
        source: "business"
      },
      {
        id: 'business-deal-16',
        deal_id: 'business-deal-16',
        title: "Gourmet Frozen Dinner - 25% Off",
        discount: "25% OFF",
        discount_percentage: 25,
        image: "https://images.unsplash.com/photo-1623073284788-0d846f75e329?w=800&h=600&fit=crop&q=80",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        tags: ["frozen foods"],
        originalPrice: 2.27,
        discountedPrice: 1.7,
        description: "Gourmet frozen dinner for special occasions.",
        productId: "153",
        validUntil: "2026-02-10",
        source: "business"
      },

      // Snacks (5 deals)
      {
        id: 'business-deal-17',
        deal_id: 'business-deal-17',
        title: "Crunchy Potato Chips - 23% Off",
        discount: "23% OFF",
        discount_percentage: 23,
        image: "https://plus.unsplash.com/premium_photo-1672753747124-2bd4da9931fa?w=800&h=600&fit=crop&q=80",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        tags: ["snacks"],
        originalPrice: 5.46,
        discountedPrice: 4.2,
        description: "Crunchy potato chips in various flavors.",
        productId: "216",
        validUntil: "2026-03-05",
        source: "business"
      },
      {
        id: 'business-deal-18',
        deal_id: 'business-deal-18',
        title: "Healthy Mixed Nuts - 23% Off",
        discount: "23% OFF",
        discount_percentage: 23,
        image: "https://images.unsplash.com/photo-1543158181-1274e5362710?w=800&h=600&fit=crop&q=80",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        tags: ["snacks"],
        originalPrice: 6.05,
        discountedPrice: 4.65,
        description: "Healthy mixed nuts for snacking.",
        productId: "202",
        validUntil: "2026-04-15",
        source: "business"
      },
      {
        id: 'business-deal-19',
        deal_id: 'business-deal-19',
        title: "Sweet Popcorn - 23% Off",
        discount: "23% OFF",
        discount_percentage: 23,
        image: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=800&h=600&fit=crop&q=80",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        tags: ["snacks"],
        originalPrice: 6.42,
        discountedPrice: 4.95,
        description: "Sweet popcorn treat for movie nights.",
        productId: "275",
        validUntil: "2026-02-20",
        source: "business"
      },
      {
        id: 'business-deal-20',
        deal_id: 'business-deal-20',
        title: "Cheese Crackers - 23% Off",
        discount: "23% OFF",
        discount_percentage: 23,
        image: "https://plus.unsplash.com/premium_photo-1726072366210-8e83c3406c4b?w=800&h=600&fit=crop&q=80",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        tags: ["snacks"],
        originalPrice: 4.32,
        discountedPrice: 3.33,
        description: "Savory cheese crackers perfect for parties.",
        productId: "235",
        validUntil: "2026-05-20",
        source: "business"
      },
      {
        id: 'business-deal-21',
        deal_id: 'business-deal-21',
        title: "Chocolate Pretzels - 23% Off",
        discount: "23% OFF",
        discount_percentage: 23,
        image: "https://images.unsplash.com/photo-1631311767773-fb9415cc63d2?w=800&h=600&fit=crop&q=80",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        tags: ["snacks"],
        originalPrice: 5.49,
        discountedPrice: 4.23,
        description: "Chocolate-covered pretzels for sweet cravings.",
        productId: "110",
        validUntil: "2026-01-30",
        source: "business"
      },

      // Dairy (5 deals)
      {
        id: 'business-deal-22',
        deal_id: 'business-deal-22',
        title: "Fresh Whole Milk - 25% Off",
        discount: "25% OFF",
        discount_percentage: 25,
        image: "https://plus.unsplash.com/premium_photo-1694481100260-5f6176e7743c?w=800&h=600&fit=crop&q=80",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        tags: ["dairy"],
        originalPrice: 5.03,
        discountedPrice: 3.78,
        description: "Fresh whole milk from local farms.",
        productId: "234",
        validUntil: "2026-03-10",
        source: "business"
      },
      {
        id: 'business-deal-23',
        deal_id: 'business-deal-23',
        title: "Greek Yogurt - 25% Off",
        discount: "25% OFF",
        discount_percentage: 25,
        image: "https://images.unsplash.com/photo-1733197013404-14126006c5f1?w=800&h=600&fit=crop&q=80",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        tags: ["dairy"],
        originalPrice: 5.68,
        discountedPrice: 4.26,
        description: "Creamy Greek yogurt with probiotics.",
        productId: "112",
        validUntil: "2026-04-05",
        source: "business"
      },
      {
        id: 'business-deal-24',
        deal_id: 'business-deal-24',
        title: "Aged Cheddar Cheese - 25% Off",
        discount: "25% OFF",
        discount_percentage: 25,
        image: "https://images.unsplash.com/photo-1607127368565-0fc09ac36028?w=800&h=600&fit=crop&q=80",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        tags: ["dairy"],
        originalPrice: 5.19,
        discountedPrice: 3.89,
        description: "Aged cheddar cheese with rich flavor.",
        productId: "214",
        validUntil: "2026-02-25",
        source: "business"
      },
      {
        id: 'business-deal-25',
        deal_id: 'business-deal-25',
        title: "Organic Butter - 25% Off",
        discount: "25% OFF",
        discount_percentage: 25,
        image: "https://images.unsplash.com/photo-1719956797343-41110e42ade6?w=800&h=600&fit=crop&q=80",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        tags: ["dairy"],
        originalPrice: 4.08,
        discountedPrice: 3.06,
        description: "Organic butter made from grass-fed cows.",
        productId: "226",
        validUntil: "2026-05-10",
        source: "business"
      },
      {
        id: 'business-deal-26',
        deal_id: 'business-deal-26',
        title: "Smooth Cream Cheese - 25% Off",
        discount: "25% OFF",
        discount_percentage: 25,
        image: "https://images.unsplash.com/photo-1573810655264-8d1e50f1592d?w=800&h=600&fit=crop&q=80",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        tags: ["dairy"],
        originalPrice: 5.24,
        discountedPrice: 3.93,
        description: "Smooth cream cheese for spreads and baking.",
        productId: "274",
        validUntil: "2026-01-15",
        source: "business"
      },

      // Vegetables (5 deals)
      {
        id: 'business-deal-27',
        deal_id: 'business-deal-27',
        title: "Organic Tomatoes - 25% Off",
        discount: "25% OFF",
        discount_percentage: 25,
        image: "https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=800&h=600&fit=crop&q=80",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        tags: ["vegetables"],
        originalPrice: 5.93,
        discountedPrice: 4.45,
        description: "Fresh organic tomatoes harvested daily.",
        productId: "232",
        validUntil: "2026-03-25",
        source: "business"
      },
      {
        id: 'business-deal-28',
        deal_id: 'business-deal-28',
        title: "Green Salad Mix - 25% Off",
        discount: "25% OFF",
        discount_percentage: 25,
        image: "https://media.istockphoto.com/id/1393977696/photo/close-up-view-of-fresh-salad-mix-leaves-healthy-organic-food-ingredients.webp?a=1&b=1&s=612x612&w=0&k=20&c=6DLqgf7ku6veh8IgNIwQ3k2Pb_RgF1nXHjjgkMrgmGg=",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        tags: ["vegetables"],
        originalPrice: 5.85,
        discountedPrice: 4.39,
        description: "Crisp green salad mix ready to eat.",
        productId: "137",
        validUntil: "2026-04-20",
        source: "business"
      },
      {
        id: 'business-deal-29',
        deal_id: 'business-deal-29',
        title: "Sweet Bell Peppers - 25% Off",
        discount: "25% OFF",
        discount_percentage: 25,
        image: "https://images.unsplash.com/photo-1631542492757-5fe2e85f53e5?w=800&h=600&fit=crop&q=80",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        tags: ["vegetables"],
        originalPrice: 5.44,
        discountedPrice: 4.08,
        description: "Sweet bell peppers in assorted colors.",
        productId: "299",
        validUntil: "2026-02-05",
        source: "business"
      },
      {
        id: 'business-deal-30',
        deal_id: 'business-deal-30',
        title: "Asparagus Spears - 25% Off",
        discount: "25% OFF",
        discount_percentage: 25,
        image: "https://images.unsplash.com/photo-1629875235163-2e52306e4018?w=800&h=600&fit=crop&q=80",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        tags: ["vegetables"],
        originalPrice: 5.66,
        discountedPrice: 4.25,
        description: "Tender asparagus spears for grilling.",
        productId: "249",
        validUntil: "2026-05-05",
        source: "business"
      },
      {
        id: 'business-deal-31',
        deal_id: 'business-deal-31',
        title: "Baby Carrots - 25% Off",
        discount: "25% OFF",
        discount_percentage: 25,
        image: "https://images.unsplash.com/photo-1675501342142-d7337a30a038?w=800&h=600&fit=crop&q=80",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        tags: ["vegetables"],
        originalPrice: 3.84,
        discountedPrice: 2.88,
        description: "Baby carrots perfect for snacking.",
        productId: "171",
        validUntil: "2026-01-28",
        source: "business"
      },

      // Beverages (5 deals)
      {
        id: 'business-deal-32',
        deal_id: 'business-deal-32',
        title: "Fresh Orange Juice - 24% Off",
        discount: "24% OFF",
        discount_percentage: 24,
        image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&h=600&fit=crop&q=80",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        tags: ["beverages"],
        originalPrice: 5.13,
        discountedPrice: 3.9,
        description: "Fresh orange juice squeezed daily.",
        productId: "157",
        validUntil: "2026-03-15",
        source: "business"
      },
      {
        id: 'business-deal-33',
        deal_id: 'business-deal-33',
        title: "Sparkling Water - 24% Off",
        discount: "24% OFF",
        discount_percentage: 24,
        image: "https://images.unsplash.com/photo-1637905351378-67232a5f0c9b?w=800&h=600&fit=crop&q=80",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        tags: ["beverages"],
        originalPrice: 4.35,
        discountedPrice: 3.31,
        description: "Sparkling mineral water refreshing taste.",
        productId: "116",
        validUntil: "2026-04-10",
        source: "business"
      },
      {
        id: 'business-deal-34',
        deal_id: 'business-deal-34',
        title: "Premium Coffee - 24% Off",
        discount: "24% OFF",
        discount_percentage: 24,
        image: "https://images.unsplash.com/photo-1723568876310-c61fd172ffb6?w=800&h=600&fit=crop&q=80",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        tags: ["beverages"],
        originalPrice: 5.1,
        discountedPrice: 3.88,
        description: "Premium coffee beans from around the world.",
        productId: "145",
        validUntil: "2026-02-18",
        source: "business"
      },
      {
        id: 'business-deal-35',
        deal_id: 'business-deal-35',
        title: "Green Tea - 24% Off",
        discount: "24% OFF",
        discount_percentage: 24,
        image: "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=800&h=600&fit=crop&q=80",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        tags: ["beverages"],
        originalPrice: 6.36,
        discountedPrice: 4.83,
        description: "Organic green tea with antioxidants.",
        productId: "253",
        validUntil: "2026-05-25",
        source: "business"
      },
      {
        id: 'business-deal-36',
        deal_id: 'business-deal-36',
        title: "Refreshing Lemonade - 24% Off",
        discount: "24% OFF",
        discount_percentage: 24,
        image: "https://images.unsplash.com/photo-1606638132965-f0fc4d6e7b42?w=800&h=600&fit=crop&q=80",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        tags: ["beverages"],
        originalPrice: 2.27,
        discountedPrice: 1.73,
        description: "Refreshing lemonade made from real lemons.",
        productId: "132",
        validUntil: "2026-01-22",
        source: "business"
      },

      // Cereals (5 deals)
      {
        id: 'business-deal-37',
        deal_id: 'business-deal-37',
        title: "Crunchy Granola - 22% Off",
        discount: "22% OFF",
        discount_percentage: 22,
        image: "https://images.unsplash.com/photo-1597608578202-34e8e4f76deb?w=800&h=600&fit=crop&q=80",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        tags: ["cereals"],
        originalPrice: 4.04,
        discountedPrice: 3.16,
        description: "Crunchy granola mix with nuts and honey.",
        productId: "261",
        validUntil: "2026-03-08",
        source: "business"
      },
      {
        id: 'business-deal-38',
        deal_id: 'business-deal-38',
        title: "Whole Grain Oatmeal - 22% Off",
        discount: "22% OFF",
        discount_percentage: 22,
        image: "https://images.unsplash.com/photo-1614373532018-92a75430a0da?w=800&h=600&fit=crop&q=80",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        tags: ["cereals"],
        originalPrice: 3.99,
        discountedPrice: 3.12,
        description: "Whole grain oatmeal for healthy breakfast.",
        productId: "150",
        validUntil: "2026-04-12",
        source: "business"
      },
      {
        id: 'business-deal-39',
        deal_id: 'business-deal-39',
        title: "Kids Favorite Cereal - 22% Off",
        discount: "22% OFF",
        discount_percentage: 22,
        image: "https://images.unsplash.com/photo-1521483451569-e33803c0330c?w=800&h=600&fit=crop&q=80",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        tags: ["cereals"],
        originalPrice: 4.66,
        discountedPrice: 3.65,
        description: "Kids favorite cereal with fun shapes.",
        productId: "144",
        validUntil: "2026-02-22",
        source: "business"
      },
      {
        id: 'business-deal-40',
        deal_id: 'business-deal-40',
        title: "Bran Flakes - 22% Off",
        discount: "22% OFF",
        discount_percentage: 22,
        image: "https://images.unsplash.com/photo-1702650707411-2ad2d60e1c2c?w=800&h=600&fit=crop&q=80",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        tags: ["cereals"],
        originalPrice: 4.52,
        discountedPrice: 3.56,
        description: "High fiber bran flakes for digestive health.",
        productId: "298",
        validUntil: "2026-05-18",
        source: "business"
      },
      {
        id: 'business-deal-41',
        deal_id: 'business-deal-41',
        title: "Honey Nut Clusters - 22% Off",
        discount: "22% OFF",
        discount_percentage: 22,
        image: "https://plus.unsplash.com/premium_photo-1695042865325-f68542f1564d?w=800&h=600&fit=crop&q=80",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        tags: ["cereals"],
        originalPrice: 3.65,
        discountedPrice: 2.87,
        description: "Honey nut clusters sweet and crunchy.",
        productId: "225",
        validUntil: "2026-01-26",
        source: "business"
      },

      // Household (5 deals)
      {
        id: 'business-deal-42',
        deal_id: 'business-deal-42',
        title: "Multi-Surface Cleaner - 24% Off",
        discount: "24% OFF",
        discount_percentage: 24,
        image: "https://plus.unsplash.com/premium_photo-1765806286748-2036017d1a9e?w=800&h=600&fit=crop&q=80",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        tags: ["household"],
        originalPrice: 2.83,
        discountedPrice: 2.14,
        description: "Multi-surface cleaner for all rooms.",
        productId: "283",
        validUntil: "2026-03-18",
        source: "business"
      },
      {
        id: 'business-deal-43',
        deal_id: 'business-deal-43',
        title: "Laundry Detergent - 24% Off",
        discount: "24% OFF",
        discount_percentage: 24,
        image: "https://images.unsplash.com/photo-1624372635282-b324bcdd4907?w=800&h=600&fit=crop&q=80",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        tags: ["household"],
        originalPrice: 3.28,
        discountedPrice: 2.5,
        description: "Powerful laundry detergent removes stains.",
        productId: "156",
        validUntil: "2026-04-22",
        source: "business"
      },
      {
        id: 'business-deal-44',
        deal_id: 'business-deal-44',
        title: "Dish Soap - 24% Off",
        discount: "24% OFF",
        discount_percentage: 24,
        image: "https://plus.unsplash.com/premium_photo-1664372899205-7cccbe1ad0b0?w=800&h=600&fit=crop&q=80",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        tags: ["household"],
        originalPrice: 4.89,
        discountedPrice: 3.71,
        description: "Gentle dish soap cuts through grease.",
        productId: "131",
        validUntil: "2026-02-12",
        source: "business"
      },
      {
        id: 'business-deal-45',
        deal_id: 'business-deal-45',
        title: "Paper Towels - 24% Off",
        discount: "24% OFF",
        discount_percentage: 24,
        image: "https://images.unsplash.com/photo-1632334994199-cc2ba6538141?w=800&h=600&fit=crop&q=80",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        tags: ["household"],
        originalPrice: 5.13,
        discountedPrice: 3.9,
        description: "Absorbent paper towels for quick cleanup.",
        productId: "269",
        validUntil: "2026-05-22",
        source: "business"
      },
      {
        id: 'business-deal-46',
        deal_id: 'business-deal-46',
        title: "All-Purpose Wipes - 24% Off",
        discount: "24% OFF",
        discount_percentage: 24,
        image: "https://images.unsplash.com/photo-1633265484557-e298493cb162?w=800&h=600&fit=crop&q=80",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        tags: ["household"],
        originalPrice: 4.72,
        discountedPrice: 3.55,
        description: "All-purpose wipes for sanitizing surfaces.",
        productId: "297",
        validUntil: "2026-01-19",
        source: "business"
      },

      // Packaged Food (5 deals)
      {
        id: 'business-deal-47',
        deal_id: 'business-deal-47',
        title: "Ready Pasta - 20% Off",
        discount: "20% OFF",
        discount_percentage: 20,
        image: "https://images.unsplash.com/photo-1625944525803-d510d5a4a262?w=800&h=600&fit=crop&q=80",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        tags: ["packaged food"],
        originalPrice: 1.85,
        discountedPrice: 1.48,
        description: "Ready-to-eat pasta meal in minutes.",
        productId: "291",
        validUntil: "2026-03-12",
        source: "business"
      },
      {
        id: 'business-deal-48',
        deal_id: 'business-deal-48',
        title: "Instant Rice - 20% Off",
        discount: "20% OFF",
        discount_percentage: 20,
        image: "https://plus.unsplash.com/premium_photo-1675814316649-bbb4c35f52b0?w=800&h=600&fit=crop&q=80",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        tags: ["packaged food"],
        originalPrice: 2.6,
        discountedPrice: 2.08,
        description: "Instant rice meal ready in 90 seconds.",
        productId: "288",
        validUntil: "2026-04-16",
        source: "business"
      },
      {
        id: 'business-deal-49',
        deal_id: 'business-deal-49',
        title: "Canned Soup - 20% Off",
        discount: "20% OFF",
        discount_percentage: 20,
        image: "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=800&h=600&fit=crop&q=80",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        tags: ["packaged food"],
        originalPrice: 2.59,
        discountedPrice: 2.08,
        description: "Hearty canned soup for cold days.",
        productId: "223",
        validUntil: "2026-02-08",
        source: "business"
      },
      {
        id: 'business-deal-50',
        deal_id: 'business-deal-50',
        title: "Packaged Noodles - 20% Off",
        discount: "20% OFF",
        discount_percentage: 20,
        image: "https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=800&h=600&fit=crop&q=80",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        tags: ["packaged food"],
        originalPrice: 3.82,
        discountedPrice: 3.06,
        description: "Packaged noodles with savory seasoning.",
        productId: "149",
        validUntil: "2026-05-28",
        source: "business"
      },
      {
        id: 'business-deal-51',
        deal_id: 'business-deal-51',
        title: "Quick Quinoa - 20% Off",
        discount: "20% OFF",
        discount_percentage: 20,
        image: "https://images.unsplash.com/photo-1639677243191-63da0f8231ca?w=800&h=600&fit=crop&q=80",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        tags: ["packaged food"],
        originalPrice: 4.54,
        discountedPrice: 3.64,
        description: "Quick quinoa mix protein-packed meal.",
        productId: "237",
        validUntil: "2026-01-24",
        source: "business"
      },

      // Confectionery (5 deals)
      {
        id: 'business-deal-52',
        deal_id: 'business-deal-52',
        title: "Premium Chocolate - 24% Off",
        discount: "24% OFF",
        discount_percentage: 24,
        image: "https://images.unsplash.com/photo-1695649912699-435a5bc20203?w=800&h=600&fit=crop&q=80",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        tags: ["confectionery"],
        originalPrice: 4.67,
        discountedPrice: 3.54,
        description: "Premium chocolate bar with rich cocoa.",
        productId: "165",
        validUntil: "2026-03-22",
        source: "business"
      },
      {
        id: 'business-deal-53',
        deal_id: 'business-deal-53',
        title: "Assorted Candy - 24% Off",
        discount: "24% OFF",
        discount_percentage: 24,
        image: "https://images.unsplash.com/photo-1599929219210-7c422e4d5208?w=800&h=600&fit=crop&q=80",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        tags: ["confectionery"],
        originalPrice: 4.04,
        discountedPrice: 3.08,
        description: "Assorted candy mix for all tastes.",
        productId: "272",
        validUntil: "2026-04-26",
        source: "business"
      },
      {
        id: 'business-deal-54',
        deal_id: 'business-deal-54',
        title: "Gummy Bears - 24% Off",
        discount: "24% OFF",
        discount_percentage: 24,
        image: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=800&h=600&fit=crop&q=80",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        tags: ["confectionery"],
        originalPrice: 4.63,
        discountedPrice: 3.52,
        description: "Fruity gummy bears loved by kids.",
        productId: "273",
        validUntil: "2026-02-16",
        source: "business"
      },
      {
        id: 'business-deal-55',
        deal_id: 'business-deal-55',
        title: "Caramel Chews - 24% Off",
        discount: "24% OFF",
        discount_percentage: 24,
        image: "https://plus.unsplash.com/premium_photo-1695397427639-c1ab2419fe92?w=800&h=600&fit=crop&q=80",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        tags: ["confectionery"],
        originalPrice: 6.84,
        discountedPrice: 5.18,
        description: "Soft caramel chews melt in your mouth.",
        productId: "281",
        validUntil: "2026-05-30",
        source: "business"
      },
      {
        id: 'business-deal-56',
        deal_id: 'business-deal-56',
        title: "Licorice Twists - 24% Off",
        discount: "24% OFF",
        discount_percentage: 24,
        image: "https://plus.unsplash.com/premium_photo-1677545822356-8905ec558d26?w=800&h=600&fit=crop&q=80",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        tags: ["confectionery"],
        originalPrice: 2.91,
        discountedPrice: 2.22,
        description: "Classic licorice twists sweet treat.",
        productId: "127",
        validUntil: "2026-01-18",
        source: "business"
      }
    ];

    // Merge deals
    const mergedDeals = [...dealsFromService];
    staticDeals.forEach(staticDeal => {
      const exists = mergedDeals.find(d => 
        (d.id === staticDeal.id) || (d.deal_id === staticDeal.deal_id)
      );
      if (!exists) {
        mergedDeals.push(staticDeal);
      }
    });
    
    console.log(`✅ BusinessDeals loaded ${mergedDeals.length} total deals`);
    console.log(`   - Food & Dining: ${mergedDeals.filter(d => d.category === 'Food & Dining').length}`);
    console.log(`   - Grocery & Food: ${mergedDeals.filter(d => d.category === 'Grocery & Food').length}`);
    
    return mergedDeals;
  };

  const filterDealsByBusiness = () => {
    const allDeals = getAllBusinessDeals();
    
    if (activeBusiness === 'all') {
      const pizzaDeals = allDeals.filter(d => d.businessName === 'Pizza Paradise').slice(0, 3);
      const sklepDeals = allDeals.filter(d => d.businessName === 'Sklep Charytatywny').slice(0, 3);
      setFilteredDeals([...pizzaDeals, ...sklepDeals]);
    } else {
      const businessDeals = allDeals.filter(d => d.businessName === activeBusiness).slice(0, 6);
      setFilteredDeals(businessDeals);
    }
  };

  const toggleFavorite = async (deal) => {
    const dealId = deal.deal_id || deal.id;
    const isFav = favorites.includes(dealId);
    
    try {
      const guestFavorites = JSON.parse(localStorage.getItem('guestFavorites') || '[]');
      
      if (isFav) {
        const updated = guestFavorites.filter(f => (f.deal_id || f.id) !== dealId);
        localStorage.setItem('guestFavorites', JSON.stringify(updated));
        setFavorites(favorites.filter(id => id !== dealId));
      } else {
        guestFavorites.push(deal);
        localStorage.setItem('guestFavorites', JSON.stringify(guestFavorites));
        setFavorites([...favorites, dealId]);
        
        notificationService.createDealSavedNotification(deal.title);
        notificationService.createFavoriteNotification(deal.title, 'guest');
      }
      
      window.dispatchEvent(new Event('favoritesChanged'));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleViewDetails = (dealId) => {
    navigate(`/deals/${dealId}`);
  };

  const formatPrice = (price) => {
    return `${price.toFixed(2)} zł`;
  };

  const handleViewAllPizza = () => {
    navigate('/deals?businessName=Pizza%20Paradise');
  };

  const handleViewAllSklep = () => {
    navigate('/deals?businessName=Sklep%20Charytatywny');
  };

  const handleAddMoreDeals = () => {
    navigate('/business/post-deal');
  };

  const handleListYourBusiness = () => {
    if (isAuthenticated()) {
      if (isBusinessAccount()) {
        navigate('/business/post-deal');
      } else {
        const confirmSwitch = window.confirm(
          'You need a Business account to post deals. Would you like to create a Business account?'
        );
        if (confirmSwitch) {
          openSignup('business');
        }
      }
    } else {
      openSignup('business');
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header with Greeting */}
        <div className="text-center mb-12">
          {isAuthenticated() && (
            <p className="text-xl text-blue-600 mb-2 font-semibold">
              {greeting}, {firstName}! 👋
            </p>
          )}
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            🏪 Business Deals
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Exclusive offers from local businesses - Support your community!
          </p>
        </div>

        {/* Business Filter Tabs */}
        <div className="flex justify-center gap-3 mb-12 flex-wrap">
          <button
            onClick={() => setActiveBusiness('all')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              activeBusiness === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🌐 All Businesses
          </button>
          <button
            onClick={() => setActiveBusiness('Pizza Paradise')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              activeBusiness === 'Pizza Paradise'
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🍕 Pizza Paradise
          </button>
          <button
            onClick={() => setActiveBusiness('Sklep Charytatywny')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              activeBusiness === 'Sklep Charytatywny'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🛒 Sklep Charytatywny
          </button>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-8">
          {filteredDeals.map((deal) => {
            const dealId = deal.deal_id || deal.id;
            const isFavorite = favorites.includes(dealId);
            const expired = isExpired(deal.validUntil);
            const daysLeft = getDaysUntilExpiry(deal.validUntil);
            const expiringSoon = daysLeft !== null && daysLeft > 0 && daysLeft <= 7;
            
            return (
              <div
                key={dealId}
                className={`group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border ${
                  expired ? 'border-red-300 opacity-60' : 'border-gray-100'
                }`}
              >
                <div className="relative h-56 overflow-hidden cursor-pointer" onClick={() => !expired && handleViewDetails(dealId)}>
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className={`w-full h-full object-cover transition-transform duration-300 ${
                      expired ? 'grayscale' : 'group-hover:scale-110'
                    }`}
                  />
                  
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                    {deal.discount}
                  </div>

                  {!expired && expiringSoon && (
                    <div className="absolute top-16 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                      {daysLeft === 1 ? 'Last day!' : `${daysLeft} days left`}
                    </div>
                  )}

                  {!expired && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(deal);
                      }}
                      className="absolute top-4 left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200 z-10"
                      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      <svg
                        className={`w-6 h-6 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`}
                        fill={isFavorite ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                  )}

                  {expired && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold text-lg shadow-xl">
                        Deal Ended
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 
                    className={`text-xl font-bold mb-3 line-clamp-2 transition-colors cursor-pointer ${
                      expired ? 'text-gray-500' : 'text-gray-900 group-hover:text-blue-600'
                    }`}
                    onClick={() => !expired && handleViewDetails(dealId)}
                  >
                    {deal.title}
                  </h3>

                  <div className="flex items-center gap-2 mb-2 text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="text-sm font-medium">{deal.businessName}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-4 text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm">{deal.location}</span>
                  </div>

                  {deal.validUntil && (
                    <div className={`flex items-center gap-2 mb-4 text-sm ${
                      expired ? 'text-red-600 font-semibold' : expiringSoon ? 'text-orange-600 font-semibold' : 'text-gray-500'
                    }`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>
                        {expired ? 'Expired' : 'Valid until'}: {formatExpiryDate(deal.validUntil)}
                      </span>
                    </div>
                  )}

                  <div className="mb-4">
                    <div className="flex items-baseline gap-3">
                      <span className={`text-3xl font-bold ${expired ? 'text-gray-400' : 'text-green-600'}`}>
                        {formatPrice(deal.discountedPrice)}
                      </span>
                      <span className="text-lg text-gray-400 line-through">
                        {formatPrice(deal.originalPrice)}
                      </span>
                    </div>
                    <p className={`text-sm font-semibold mt-1 ${expired ? 'text-gray-400' : 'text-green-600'}`}>
                      Save {formatPrice(deal.originalPrice - deal.discountedPrice)}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!expired) handleViewDetails(dealId);
                    }}
                    disabled={expired}
                    className={`w-full font-semibold py-3 rounded-xl transition-all duration-300 shadow-md ${
                      expired 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:shadow-lg'
                    }`}
                  >
                    {expired ? 'Deal Ended' : 'View Details'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Business-Specific Buttons */}
        <div className="text-center mb-6">
          {activeBusiness === 'all' && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleViewAllPizza}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
              >
                View All Pizza Paradise Deals
              </button>
              <button
                onClick={handleViewAllSklep}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
              >
                View All Sklep Charytatywny Deals
              </button>
            </div>
          )}

          {activeBusiness === 'Pizza Paradise' && (
            <button
              onClick={handleViewAllPizza}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
            >
              View All Pizza Paradise Deals
            </button>
          )}

          {activeBusiness === 'Sklep Charytatywny' && (
            <button
              onClick={handleViewAllSklep}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
            >
              View All Sklep Charytatywny Deals
            </button>
          )}
        </div>

        {/* List Your Business CTA */}
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-center text-white shadow-2xl">
          <h3 className="text-3xl font-bold mb-4">
            {isAuthenticated() && isBusinessAccount() ? 'Ready to Post Another Deal?' : 'Want to List Your Business?'}
          </h3>
          <p className="text-xl mb-6 text-green-100">
            {isAuthenticated() && isBusinessAccount() 
              ? 'Share more amazing offers with our community!'
              : 'Join SaveMate and reach thousands of local customers'
            }
          </p>
          <button
            onClick={handleListYourBusiness}
            className="bg-white text-green-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-50 transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-3"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>{isAuthenticated() && isBusinessAccount() ? 'Post New Deal' : 'List Your Business'}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
