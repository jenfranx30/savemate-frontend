// src/pages/SearchResults.jsx

import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import notificationService from '../services/notificationService';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [sourceStats, setSourceStats] = useState({
    slickdeals: 0,
    reddit: 0,
    business: 0,
    total: 0
  });

  useEffect(() => {
    loadFavorites();
  }, []);

  useEffect(() => {
    if (query) {
      searchDeals(query);
    } else {
      setLoading(false);
    }
  }, [query]);

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

  const isExpired = (validUntil) => {
    if (!validUntil) return false;
    return new Date(validUntil) < new Date();
  };

  // Business deals data - UPDATED FROM BusinessDeals.jsx
  const getBusinessDeals = () => {
    return [
      // Pizza Paradise - Warsaw, Mokotów 6 deals
      {
        id: 'business-deal-1',
        deal_id: 'business-deal-1',
        title: "50% Off All Pizzas - Weekend Special",
        discount: "50% OFF",
        discount_percentage: 50,
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop",
        businessName: "Pizza Paradise",
        location: "Warsaw, Mokotów",
        city: "Warsaw",
        category: "Food & Dining",
        originalPrice: 39.99,
        discountedPrice: 19.99,
        description: "Enjoy delicious handcrafted pizzas with premium toppings.",
        validUntil: "2026-03-31",
        source: "business",
        deal_url: `/deals/business-deal-1`
      },
      {
        id: 'business-deal-2',
        deal_id: 'business-deal-2',
        title: "Burger Combo - 35% Off",
        discount: "35% OFF",
        discount_percentage: 35,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop",
        businessName: "Pizza Paradise",
        location: "Warsaw, Mokotów",
        city: "Warsaw",
        category: "Food & Dining",
        originalPrice: 29.99,
        discountedPrice: 19.49,
        description: "Juicy burgers with fresh ingredients.",
        validUntil: "2026-02-28",
        source: "business",
        deal_url: `/deals/business-deal-2`
      },
      {
        id: 'business-deal-3',
        deal_id: 'business-deal-3',
        title: "Sushi All You Can Eat - 40% Discount",
        discount: "40% OFF",
        discount_percentage: 40,
        image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop",
        businessName: "Pizza Paradise",
        location: "Warsaw, Mokotów",
        city: "Warsaw",
        category: "Food & Dining",
        originalPrice: 89.99,
        discountedPrice: 53.99,
        description: "Unlimited fresh sushi, sashimi, and rolls.",
        validUntil: "2026-04-30",
        source: "business",
        deal_url: `/deals/business-deal-3`
      },
      {
        id: 'business-deal-4',
        deal_id: 'business-deal-4',
        title: "Coffee & Pastry Bundle - 30% Off",
        discount: "30% OFF",
        discount_percentage: 30,
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop",
        businessName: "Pizza Paradise",
        location: "Warsaw, Mokotów",
        city: "Warsaw",
        category: "Food & Dining",
        originalPrice: 24.99,
        discountedPrice: 17.49,
        description: "Artisan coffee paired with freshly baked pastries.",
        validUntil: "2026-01-31",
        source: "business",
        deal_url: `/deals/business-deal-4`
      },
      {
        id: 'business-deal-5',
        deal_id: 'business-deal-5',
        title: "Healthy Bowl Special - 45% Off",
        discount: "45% OFF",
        discount_percentage: 45,
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop",
        businessName: "Pizza Paradise",
        location: "Warsaw, Mokotów",
        city: "Warsaw",
        category: "Food & Dining",
        originalPrice: 34.99,
        discountedPrice: 19.24,
        description: "Nutritious bowls with fresh vegetables.",
        validUntil: "2026-03-15",
        source: "business",
        deal_url: `/deals/business-deal-5`
      },
      {
        id: 'business-deal-6',
        deal_id: 'business-deal-6',
        title: "Premium Steak Dinner - 50% Off",
        discount: "50% OFF",
        discount_percentage: 50,
        image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&h=600&fit=crop",
        businessName: "Pizza Paradise",
        location: "Warsaw, Mokotów",
        city: "Warsaw",
        category: "Food & Dining",
        originalPrice: 119.99,
        discountedPrice: 59.99,
        description: "Expertly grilled premium cuts.",
        validUntil: "2026-05-31",
        source: "business",
        deal_url: `/deals/business-deal-6`
      },

      // SKLEP CHARYTATYWNY GROCERY DEALS - Breads (5 deals)
      {
        id: 'business-deal-7',
        deal_id: 'business-deal-7',
        title: "Fresh Artisan Bread - 25% Off",
        discount: "25% OFF",
        discount_percentage: 25,
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 1.82,
        discountedPrice: 1.37,
        description: "Fresh artisan bread baked daily. Support charity while shopping.",
        productId: "233",
        productCategory: "Breads",
        validUntil: "2026-02-15",
        source: "business",
        deal_url: `/deals/business-deal-7`
      },
      {
        id: 'business-deal-8',
        deal_id: 'business-deal-8',
        title: "Multigrain Loaf - 25% Off",
        discount: "25% OFF",
        discount_percentage: 25,
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&h=600&fit=crop",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 4.21,
        discountedPrice: 3.16,
        description: "Wholesome multigrain loaf. Nutritious and delicious.",
        productId: "127",
        productCategory: "Breads",
        validUntil: "2026-03-20",
        source: "business",
        deal_url: `/deals/business-deal-8`
      },
      {
        id: 'business-deal-9',
        deal_id: 'business-deal-9',
        title: "Sourdough Bread - 25% Off",
        discount: "25% OFF",
        discount_percentage: 25,
        image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=800&h=600&fit=crop",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 4.84,
        discountedPrice: 3.65,
        description: "Traditional sourdough bread with tangy flavor.",
        productId: "144",
        productCategory: "Breads",
        validUntil: "2026-01-25",
        source: "business",
        deal_url: `/deals/business-deal-9`
      },
      {
        id: 'business-deal-10',
        deal_id: 'business-deal-10',
        title: "White Sandwich Bread - 25% Off",
        discount: "25% OFF",
        discount_percentage: 25,
        image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=800&h=600&fit=crop",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 3.45,
        discountedPrice: 2.6,
        description: "Soft white sandwich bread perfect for daily use.",
        productId: "242",
        productCategory: "Breads",
        validUntil: "2026-04-10",
        source: "business",
        deal_url: `/deals/business-deal-10`
      },
      {
        id: 'business-deal-11',
        deal_id: 'business-deal-11',
        title: "French Baguette - 25% Off",
        discount: "25% OFF",
        discount_percentage: 25,
        image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=800&h=600&fit=crop",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 3.06,
        discountedPrice: 2.3,
        description: "Crusty French baguette with soft interior.",
        productId: "282",
        productCategory: "Breads",
        validUntil: "2026-02-28",
        source: "business",
        deal_url: `/deals/business-deal-11`
      },

      // Frozen Foods (5 deals)
      {
        id: 'business-deal-12',
        deal_id: 'business-deal-12',
        title: "Quick Frozen Meal - 25% Off",
        discount: "25% OFF",
        discount_percentage: 25,
        image: "https://images.unsplash.com/photo-1628266750212-e8f8f8c7145f?w=800&h=600&fit=crop",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 4.75,
        discountedPrice: 3.56,
        description: "Quick frozen meal ready in minutes.",
        productId: "259",
        productCategory: "Frozen Foods",
        validUntil: "2026-03-30",
        source: "business",
        deal_url: `/deals/business-deal-12`
      },
      {
        id: 'business-deal-13',
        deal_id: 'business-deal-13',
        title: "Premium Frozen Vegetables - 25% Off",
        discount: "25% OFF",
        discount_percentage: 25,
        image: "https://images.unsplash.com/photo-1610415017834-5cf8dd8d4bf6?w=800&h=600&fit=crop",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 6.34,
        discountedPrice: 4.76,
        description: "Premium frozen vegetables for healthy meals.",
        productId: "284",
        productCategory: "Frozen Foods",
        validUntil: "2026-05-15",
        source: "business",
        deal_url: `/deals/business-deal-13`
      },
      {
        id: 'business-deal-14',
        deal_id: 'business-deal-14',
        title: "Frozen Pizza - 25% Off",
        discount: "25% OFF",
        discount_percentage: 25,
        image: "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=800&h=600&fit=crop",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 4.16,
        discountedPrice: 3.12,
        description: "Delicious frozen pizza ready to bake.",
        productId: "165",
        productCategory: "Frozen Foods",
        validUntil: "2026-01-20",
        source: "business",
        deal_url: `/deals/business-deal-14`
      },
      {
        id: 'business-deal-15',
        deal_id: 'business-deal-15',
        title: "Frozen Fruit Mix - 25% Off",
        discount: "25% OFF",
        discount_percentage: 25,
        image: "https://images.unsplash.com/photo-1633945274035-6c1e8b1d6e26?w=800&h=600&fit=crop",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 5.75,
        discountedPrice: 4.31,
        description: "Frozen fruit smoothie mix with berries.",
        productId: "245",
        productCategory: "Frozen Foods",
        validUntil: "2026-04-25",
        source: "business",
        deal_url: `/deals/business-deal-15`
      },
      {
        id: 'business-deal-16',
        deal_id: 'business-deal-16',
        title: "Gourmet Frozen Dinner - 25% Off",
        discount: "25% OFF",
        discount_percentage: 25,
        image: "https://images.unsplash.com/photo-1626200350636-7b6804c51e19?w=800&h=600&fit=crop",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 2.27,
        discountedPrice: 1.7,
        description: "Gourmet frozen dinner for special occasions.",
        productId: "153",
        productCategory: "Frozen Foods",
        validUntil: "2026-02-10",
        source: "business",
        deal_url: `/deals/business-deal-16`
      },

      // Snacks (5 deals)
      {
        id: 'business-deal-17',
        deal_id: 'business-deal-17',
        title: "Crunchy Potato Chips - 23% Off",
        discount: "23% OFF",
        discount_percentage: 23,
        image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=800&h=600&fit=crop",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 5.46,
        discountedPrice: 4.2,
        description: "Crunchy potato chips in various flavors.",
        productId: "216",
        productCategory: "Snacks",
        validUntil: "2026-03-05",
        source: "business",
        deal_url: `/deals/business-deal-17`
      },
      {
        id: 'business-deal-18',
        deal_id: 'business-deal-18',
        title: "Healthy Mixed Nuts - 23% Off",
        discount: "23% OFF",
        discount_percentage: 23,
        image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800&h=600&fit=crop",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 6.05,
        discountedPrice: 4.65,
        description: "Healthy mixed nuts for snacking.",
        productId: "202",
        productCategory: "Snacks",
        validUntil: "2026-04-15",
        source: "business",
        deal_url: `/deals/business-deal-18`
      },
      {
        id: 'business-deal-19',
        deal_id: 'business-deal-19',
        title: "Sweet Popcorn - 23% Off",
        discount: "23% OFF",
        discount_percentage: 23,
        image: "https://images.unsplash.com/photo-1613919119155-f0f884954066?w=800&h=600&fit=crop",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 6.42,
        discountedPrice: 4.95,
        description: "Sweet popcorn treat for movie nights.",
        productId: "275",
        productCategory: "Snacks",
        validUntil: "2026-02-20",
        source: "business",
        deal_url: `/deals/business-deal-19`
      },
      {
        id: 'business-deal-20',
        deal_id: 'business-deal-20',
        title: "Cheese Crackers - 23% Off",
        discount: "23% OFF",
        discount_percentage: 23,
        image: "https://images.unsplash.com/photo-1621939515019-5c0e093d64e6?w=800&h=600&fit=crop",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 4.32,
        discountedPrice: 3.33,
        description: "Savory cheese crackers perfect for parties.",
        productId: "235",
        productCategory: "Snacks",
        validUntil: "2026-05-20",
        source: "business",
        deal_url: `/deals/business-deal-20`
      },
      {
        id: 'business-deal-21',
        deal_id: 'business-deal-21',
        title: "Chocolate Pretzels - 23% Off",
        discount: "23% OFF",
        discount_percentage: 23,
        image: "https://images.unsplash.com/photo-1604467794349-0b74285de7e7?w=800&h=600&fit=crop",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 5.49,
        discountedPrice: 4.23,
        description: "Chocolate-covered pretzels for sweet cravings.",
        productId: "110",
        productCategory: "Snacks",
        validUntil: "2026-01-30",
        source: "business",
        deal_url: `/deals/business-deal-21`
      },

      // Dairy (5 deals)
      {
        id: 'business-deal-22',
        deal_id: 'business-deal-22',
        title: "Fresh Whole Milk - 25% Off",
        discount: "25% OFF",
        discount_percentage: 25,
        image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=800&h=600&fit=crop",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 5.03,
        discountedPrice: 3.78,
        description: "Fresh whole milk from local farms.",
        productId: "234",
        productCategory: "Dairy",
        validUntil: "2026-03-10",
        source: "business",
        deal_url: `/deals/business-deal-22`
      },
      {
        id: 'business-deal-23',
        deal_id: 'business-deal-23',
        title: "Greek Yogurt - 25% Off",
        discount: "25% OFF",
        discount_percentage: 25,
        image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&h=600&fit=crop",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 5.68,
        discountedPrice: 4.26,
        description: "Creamy Greek yogurt with probiotics.",
        productId: "112",
        productCategory: "Dairy",
        validUntil: "2026-04-05",
        source: "business",
        deal_url: `/deals/business-deal-23`
      },
      {
        id: 'business-deal-24',
        deal_id: 'business-deal-24',
        title: "Aged Cheddar Cheese - 25% Off",
        discount: "25% OFF",
        discount_percentage: 25,
        image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&h=600&fit=crop",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 5.19,
        discountedPrice: 3.89,
        description: "Aged cheddar cheese with rich flavor.",
        productId: "214",
        productCategory: "Dairy",
        validUntil: "2026-02-25",
        source: "business",
        deal_url: `/deals/business-deal-24`
      },
      {
        id: 'business-deal-25',
        deal_id: 'business-deal-25',
        title: "Organic Butter - 25% Off",
        discount: "25% OFF",
        discount_percentage: 25,
        image: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800&h=600&fit=crop",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 4.08,
        discountedPrice: 3.06,
        description: "Organic butter made from grass-fed cows.",
        productId: "226",
        productCategory: "Dairy",
        validUntil: "2026-05-10",
        source: "business",
        deal_url: `/deals/business-deal-25`
      },
      {
        id: 'business-deal-26',
        deal_id: 'business-deal-26',
        title: "Smooth Cream Cheese - 25% Off",
        discount: "25% OFF",
        discount_percentage: 25,
        image: "https://images.unsplash.com/photo-1614964157131-c7eeb1b1e43e?w=800&h=600&fit=crop",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 5.24,
        discountedPrice: 3.93,
        description: "Smooth cream cheese for spreads and baking.",
        productId: "274",
        productCategory: "Dairy",
        validUntil: "2026-01-15",
        source: "business",
        deal_url: `/deals/business-deal-26`
      },

      // Vegetables (5 deals)
      {
        id: 'business-deal-27',
        deal_id: 'business-deal-27',
        title: "Organic Tomatoes - 25% Off",
        discount: "25% OFF",
        discount_percentage: 25,
        image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=600&fit=crop",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 5.93,
        discountedPrice: 4.45,
        description: "Fresh organic tomatoes harvested daily.",
        productId: "232",
        productCategory: "Vegetables",
        validUntil: "2026-03-25",
        source: "business",
        deal_url: `/deals/business-deal-27`
      },
      {
        id: 'business-deal-28',
        deal_id: 'business-deal-28',
        title: "Green Salad Mix - 25% Off",
        discount: "25% OFF",
        discount_percentage: 25,
        image: "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=800&h=600&fit=crop",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 5.85,
        discountedPrice: 4.39,
        description: "Crisp green salad mix ready to eat.",
        productId: "137",
        productCategory: "Vegetables",
        validUntil: "2026-04-20",
        source: "business",
        deal_url: `/deals/business-deal-28`
      },
      {
        id: 'business-deal-29',
        deal_id: 'business-deal-29',
        title: "Sweet Bell Peppers - 25% Off",
        discount: "25% OFF",
        discount_percentage: 25,
        image: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=800&h=600&fit=crop",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 5.44,
        discountedPrice: 4.08,
        description: "Sweet bell peppers in assorted colors.",
        productId: "299",
        productCategory: "Vegetables",
        validUntil: "2026-02-05",
        source: "business",
        deal_url: `/deals/business-deal-29`
      },
      {
        id: 'business-deal-30',
        deal_id: 'business-deal-30',
        title: "Asparagus Spears - 25% Off",
        discount: "25% OFF",
        discount_percentage: 25,
        image: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&h=600&fit=crop",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 5.66,
        discountedPrice: 4.25,
        description: "Tender asparagus spears for grilling.",
        productId: "249",
        productCategory: "Vegetables",
        validUntil: "2026-05-05",
        source: "business",
        deal_url: `/deals/business-deal-30`
      },
      {
        id: 'business-deal-31',
        deal_id: 'business-deal-31',
        title: "Baby Carrots - 25% Off",
        discount: "25% OFF",
        discount_percentage: 25,
        image: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=800&h=600&fit=crop",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 3.84,
        discountedPrice: 2.88,
        description: "Baby carrots perfect for snacking.",
        productId: "171",
        productCategory: "Vegetables",
        validUntil: "2026-01-28",
        source: "business",
        deal_url: `/deals/business-deal-31`
      },

      // Beverages (5 deals)
      {
        id: 'business-deal-32',
        deal_id: 'business-deal-32',
        title: "Fresh Orange Juice - 24% Off",
        discount: "24% OFF",
        discount_percentage: 24,
        image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&h=600&fit=crop",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 5.13,
        discountedPrice: 3.9,
        description: "Fresh orange juice squeezed daily.",
        productId: "157",
        productCategory: "Beverages",
        validUntil: "2026-03-15",
        source: "business",
        deal_url: `/deals/business-deal-32`
      },
      {
        id: 'business-deal-33',
        deal_id: 'business-deal-33',
        title: "Sparkling Water - 24% Off",
        discount: "24% OFF",
        discount_percentage: 24,
        image: "https://images.unsplash.com/photo-1546548970-71785318a17b?w=800&h=600&fit=crop",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 4.35,
        discountedPrice: 3.31,
        description: "Sparkling mineral water refreshing taste.",
        productId: "116",
        productCategory: "Beverages",
        validUntil: "2026-04-10",
        source: "business",
        deal_url: `/deals/business-deal-33`
      },
      {
        id: 'business-deal-34',
        deal_id: 'business-deal-34',
        title: "Premium Coffee - 24% Off",
        discount: "24% OFF",
        discount_percentage: 24,
        image: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=800&h=600&fit=crop",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 5.1,
        discountedPrice: 3.88,
        description: "Premium coffee beans from around the world.",
        productId: "145",
        productCategory: "Beverages",
        validUntil: "2026-02-18",
        source: "business",
        deal_url: `/deals/business-deal-34`
      },
      {
        id: 'business-deal-35',
        deal_id: 'business-deal-35',
        title: "Green Tea - 24% Off",
        discount: "24% OFF",
        discount_percentage: 24,
        image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&h=600&fit=crop",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 6.36,
        discountedPrice: 4.83,
        description: "Organic green tea with antioxidants.",
        productId: "253",
        productCategory: "Beverages",
        validUntil: "2026-05-25",
        source: "business",
        deal_url: `/deals/business-deal-35`
      },
      {
        id: 'business-deal-36',
        deal_id: 'business-deal-36',
        title: "Refreshing Lemonade - 24% Off",
        discount: "24% OFF",
        discount_percentage: 24,
        image: "https://images.unsplash.com/photo-1606638132965-f0fc4d6e7b42?w=800&h=600&fit=crop",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 2.27,
        discountedPrice: 1.73,
        description: "Refreshing lemonade made from real lemons.",
        productId: "132",
        productCategory: "Beverages",
        validUntil: "2026-01-22",
        source: "business",
        deal_url: `/deals/business-deal-36`
      },

      // Cereals (5 deals)
      {
        id: 'business-deal-37',
        deal_id: 'business-deal-37',
        title: "Crunchy Granola - 22% Off",
        discount: "22% OFF",
        discount_percentage: 22,
        image: "https://images.unsplash.com/photo-1517094503204-0c5a869c1441?w=800&h=600&fit=crop",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 4.04,
        discountedPrice: 3.16,
        description: "Crunchy granola mix with nuts and honey.",
        productId: "261",
        productCategory: "Cereals",
        validUntil: "2026-03-08",
        source: "business",
        deal_url: `/deals/business-deal-37`
      },
      {
        id: 'business-deal-38',
        deal_id: 'business-deal-38',
        title: "Whole Grain Oatmeal - 22% Off",
        discount: "22% OFF",
        discount_percentage: 22,
        image: "https://images.unsplash.com/photo-1521484397892-c53b049b2b57?w=800&h=600&fit=crop",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 3.99,
        discountedPrice: 3.12,
        description: "Whole grain oatmeal for healthy breakfast.",
        productId: "150",
        productCategory: "Cereals",
        validUntil: "2026-04-12",
        source: "business",
        deal_url: `/deals/business-deal-38`
      },
      {
        id: 'business-deal-39',
        deal_id: 'business-deal-39',
        title: "Kids Favorite Cereal - 22% Off",
        discount: "22% OFF",
        discount_percentage: 22,
        image: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=800&h=600&fit=crop",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 4.66,
        discountedPrice: 3.65,
        description: "Kids favorite cereal with fun shapes.",
        productId: "144",
        productCategory: "Cereals",
        validUntil: "2026-02-22",
        source: "business",
        deal_url: `/deals/business-deal-39`
      },
      {
        id: 'business-deal-40',
        deal_id: 'business-deal-40',
        title: "Bran Flakes - 22% Off",
        discount: "22% OFF",
        discount_percentage: 22,
        image: "https://images.unsplash.com/photo-1574856344991-aaa31b6f4ce3?w=800&h=600&fit=crop",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 4.52,
        discountedPrice: 3.56,
        description: "High fiber bran flakes for digestive health.",
        productId: "298",
        productCategory: "Cereals",
        validUntil: "2026-05-18",
        source: "business",
        deal_url: `/deals/business-deal-40`
      },
      {
        id: 'business-deal-41',
        deal_id: 'business-deal-41',
        title: "Honey Nut Clusters - 22% Off",
        discount: "22% OFF",
        discount_percentage: 22,
        image: "https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=800&h=600&fit=crop",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 3.65,
        discountedPrice: 2.87,
        description: "Honey nut clusters sweet and crunchy.",
        productId: "225",
        productCategory: "Cereals",
        validUntil: "2026-01-26",
        source: "business",
        deal_url: `/deals/business-deal-41`
      },

      // Household (5 deals)
      {
        id: 'business-deal-42',
        deal_id: 'business-deal-42',
        title: "Multi-Surface Cleaner - 24% Off",
        discount: "24% OFF",
        discount_percentage: 24,
        image: "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=800&h=600&fit=crop",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 2.83,
        discountedPrice: 2.14,
        description: "Multi-surface cleaner for all rooms.",
        productId: "283",
        productCategory: "Household",
        validUntil: "2026-03-18",
        source: "business",
        deal_url: `/deals/business-deal-42`
      },
      {
        id: 'business-deal-43',
        deal_id: 'business-deal-43',
        title: "Laundry Detergent - 24% Off",
        discount: "24% OFF",
        discount_percentage: 24,
        image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&h=600&fit=crop",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 3.28,
        discountedPrice: 2.5,
        description: "Powerful laundry detergent removes stains.",
        productId: "156",
        productCategory: "Household",
        validUntil: "2026-04-22",
        source: "business",
        deal_url: `/deals/business-deal-43`
      },
      {
        id: 'business-deal-44',
        deal_id: 'business-deal-44',
        title: "Dish Soap - 24% Off",
        discount: "24% OFF",
        discount_percentage: 24,
        image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=800&h=600&fit=crop",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 4.89,
        discountedPrice: 3.71,
        description: "Gentle dish soap cuts through grease.",
        productId: "131",
        productCategory: "Household",
        validUntil: "2026-02-12",
        source: "business",
        deal_url: `/deals/business-deal-44`
      },
      {
        id: 'business-deal-45',
        deal_id: 'business-deal-45',
        title: "Paper Towels - 24% Off",
        discount: "24% OFF",
        discount_percentage: 24,
        image: "https://images.unsplash.com/photo-1631540501959-0079e4c80086?w=800&h=600&fit=crop",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 5.13,
        discountedPrice: 3.9,
        description: "Absorbent paper towels for quick cleanup.",
        productId: "269",
        productCategory: "Household",
        validUntil: "2026-05-22",
        source: "business",
        deal_url: `/deals/business-deal-45`
      },
      {
        id: 'business-deal-46',
        deal_id: 'business-deal-46',
        title: "All-Purpose Wipes - 24% Off",
        discount: "24% OFF",
        discount_percentage: 24,
        image: "https://images.unsplash.com/photo-1603712725038-c2ca1f2e0e59?w=800&h=600&fit=crop",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 4.72,
        discountedPrice: 3.55,
        description: "All-purpose wipes for sanitizing surfaces.",
        productId: "297",
        productCategory: "Household",
        validUntil: "2026-01-19",
        source: "business",
        deal_url: `/deals/business-deal-46`
      },

      // Packaged Food (5 deals)
      {
        id: 'business-deal-47',
        deal_id: 'business-deal-47',
        title: "Ready Pasta - 20% Off",
        discount: "20% OFF",
        discount_percentage: 20,
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=600&fit=crop",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 1.85,
        discountedPrice: 1.48,
        description: "Ready-to-eat pasta meal in minutes.",
        productId: "291",
        productCategory: "Packaged Food",
        validUntil: "2026-03-12",
        source: "business",
        deal_url: `/deals/business-deal-47`
      },
      {
        id: 'business-deal-48',
        deal_id: 'business-deal-48',
        title: "Instant Rice - 20% Off",
        discount: "20% OFF",
        discount_percentage: 20,
        image: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&h=600&fit=crop",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 2.6,
        discountedPrice: 2.08,
        description: "Instant rice meal ready in 90 seconds.",
        productId: "288",
        productCategory: "Packaged Food",
        validUntil: "2026-04-16",
        source: "business",
        deal_url: `/deals/business-deal-48`
      },
      {
        id: 'business-deal-49',
        deal_id: 'business-deal-49',
        title: "Canned Soup - 20% Off",
        discount: "20% OFF",
        discount_percentage: 20,
        image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800&h=600&fit=crop",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 2.59,
        discountedPrice: 2.08,
        description: "Hearty canned soup for cold days.",
        productId: "223",
        productCategory: "Packaged Food",
        validUntil: "2026-02-08",
        source: "business",
        deal_url: `/deals/business-deal-49`
      },
      {
        id: 'business-deal-50',
        deal_id: 'business-deal-50',
        title: "Packaged Noodles - 20% Off",
        discount: "20% OFF",
        discount_percentage: 20,
        image: "https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=800&h=600&fit=crop",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 3.82,
        discountedPrice: 3.06,
        description: "Packaged noodles with savory seasoning.",
        productId: "149",
        productCategory: "Packaged Food",
        validUntil: "2026-05-28",
        source: "business",
        deal_url: `/deals/business-deal-50`
      },
      {
        id: 'business-deal-51',
        deal_id: 'business-deal-51',
        title: "Quick Quinoa - 20% Off",
        discount: "20% OFF",
        discount_percentage: 20,
        image: "https://images.unsplash.com/photo-1609501677428-76c8ea7baf6c?w=800&h=600&fit=crop",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 4.54,
        discountedPrice: 3.64,
        description: "Quick quinoa mix protein-packed meal.",
        productId: "237",
        productCategory: "Packaged Food",
        validUntil: "2026-01-24",
        source: "business",
        deal_url: `/deals/business-deal-51`
      },

      // Confectionery (5 deals)
      {
        id: 'business-deal-52',
        deal_id: 'business-deal-52',
        title: "Premium Chocolate - 24% Off",
        discount: "24% OFF",
        discount_percentage: 24,
        image: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=800&h=600&fit=crop",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 4.67,
        discountedPrice: 3.54,
        description: "Premium chocolate bar with rich cocoa.",
        productId: "165",
        productCategory: "Confectionery",
        validUntil: "2026-03-22",
        source: "business",
        deal_url: `/deals/business-deal-52`
      },
      {
        id: 'business-deal-53',
        deal_id: 'business-deal-53',
        title: "Assorted Candy - 24% Off",
        discount: "24% OFF",
        discount_percentage: 24,
        image: "https://images.unsplash.com/photo-1571506165871-ee72a35de75b?w=800&h=600&fit=crop",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 4.04,
        discountedPrice: 3.08,
        description: "Assorted candy mix for all tastes.",
        productId: "272",
        productCategory: "Confectionery",
        validUntil: "2026-04-26",
        source: "business",
        deal_url: `/deals/business-deal-53`
      },
      {
        id: 'business-deal-54',
        deal_id: 'business-deal-54',
        title: "Gummy Bears - 24% Off",
        discount: "24% OFF",
        discount_percentage: 24,
        image: "https://images.unsplash.com/photo-1514517220017-8ce97a34a7b6?w=800&h=600&fit=crop",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 4.63,
        discountedPrice: 3.52,
        description: "Fruity gummy bears loved by kids.",
        productId: "273",
        productCategory: "Confectionery",
        validUntil: "2026-02-16",
        source: "business",
        deal_url: `/deals/business-deal-54`
      },
      {
        id: 'business-deal-55',
        deal_id: 'business-deal-55',
        title: "Caramel Chews - 24% Off",
        discount: "24% OFF",
        discount_percentage: 24,
        image: "https://images.unsplash.com/photo-1514517221053-1be72277b32f?w=800&h=600&fit=crop",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 6.84,
        discountedPrice: 5.18,
        description: "Soft caramel chews melt in your mouth.",
        productId: "281",
        productCategory: "Confectionery",
        validUntil: "2026-05-30",
        source: "business",
        deal_url: `/deals/business-deal-55`
      },
      {
        id: 'business-deal-56',
        deal_id: 'business-deal-56',
        title: "Licorice Twists - 24% Off",
        discount: "24% OFF",
        discount_percentage: 24,
        image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&h=600&fit=crop",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 2.91,
        discountedPrice: 2.22,
        description: "Classic licorice twists sweet treat.",
        productId: "127",
        productCategory: "Confectionery",
        validUntil: "2026-01-18",
        source: "business",
        deal_url: `/deals/business-deal-56`
      }
    ];
  };

  const searchDeals = async (searchQuery) => {
    try {
      setLoading(true);
      setError(null);

      const searchLower = searchQuery.toLowerCase();
      let allDeals = [];
      let stats = { slickdeals: 0, reddit: 0, business: 0, total: 0 };

      console.log(`🔍 Searching for: "${searchQuery}"`);

      // 1. Search Slickdeals
      try {
        console.log('Fetching Slickdeals...');
        const slickdealsResponse = await fetch(
          `http://localhost:8000/api/v1/external/deals/slickdeals?q=${encodeURIComponent(searchQuery)}&limit=50`
        );
        if (slickdealsResponse.ok) {
          const slickdealsData = await slickdealsResponse.json();
          const slickdealsFiltered = (slickdealsData.deals || [])
            .filter(deal =>
              deal.title?.toLowerCase().includes(searchLower) ||
              deal.description?.toLowerCase().includes(searchLower)
            )
            .map(deal => ({
              ...deal,
              id: `slickdeals-${deal.id || Math.random()}`,
              deal_id: `slickdeals-${deal.id || Math.random()}`,
              source: 'slickdeals',
              sourceDisplay: '🔥 Slickdeals'
            }));
          allDeals = [...allDeals, ...slickdealsFiltered];
          stats.slickdeals = slickdealsFiltered.length;
          console.log(`✅ Slickdeals: ${slickdealsFiltered.length} deals`);
        }
      } catch (err) {
        console.warn('Slickdeals search failed:', err);
      }

      // 2. Search Reddit - CORRECTED WITH RELAXED FILTERING
      try {
        console.log('Fetching Reddit...');
        const redditResponse = await fetch(
          `http://localhost:8000/api/v1/external/deals/rapidapi?limit=50`
        );
        if (redditResponse.ok) {
          const redditData = await redditResponse.json();
          
          // ✅ FIXED: Smart filtering - no random results
          const redditFiltered = (redditData.deals || [])
            .filter(deal => {
              const text = `${deal.title} ${deal.description} ${deal.merchant || ''}`.toLowerCase();
              
              // 1. Exact phrase match (highest priority)
              if (text.includes(searchLower)) {
                return true;
              }
              
              // 2. Match ANY search word (for multi-word searches)
              const searchWords = searchLower.split(' ').filter(w => w.length > 2);
              if (searchWords.length > 0) {
                // At least ONE word must match
                const hasMatch = searchWords.some(word => text.includes(word));
                if (hasMatch) {
                  return true;
                }
              }
              
              // 3. Special case: very generic searches show all deals
              const veryGenericTerms = ['deal', 'deals', 'discount', 'sale'];
              if (veryGenericTerms.includes(searchLower)) {
                return true;
              }
              
              // 4. No match - DON'T show this deal
              return false;
            })
            .map(deal => ({
              ...deal,
              id: `reddit-${deal.id || Math.random()}`,
              deal_id: `reddit-${deal.id || Math.random()}`,
              source: 'reddit',
              sourceDisplay: '🤖 Reddit'
            }));
          allDeals = [...allDeals, ...redditFiltered];
          stats.reddit = redditFiltered.length;
          console.log(`✅ Reddit: ${redditFiltered.length} deals`);
        }
      } catch (err) {
        console.warn('Reddit search failed:', err);
      }

      // 3. Search Business Deals - Filter out expired deals
      const businessDeals = getBusinessDeals().filter(deal => !isExpired(deal.validUntil));
      const businessFiltered = businessDeals.filter(deal =>
        deal.title?.toLowerCase().includes(searchLower) ||
        deal.description?.toLowerCase().includes(searchLower) ||
        deal.businessName?.toLowerCase().includes(searchLower) ||
        deal.category?.toLowerCase().includes(searchLower) ||
        deal.productCategory?.toLowerCase().includes(searchLower)
      ).map(deal => ({
        ...deal,
        sourceDisplay: '🏪 Business Deal'
      }));
      allDeals = [...allDeals, ...businessFiltered];
      stats.business = businessFiltered.length;
      console.log(`✅ Business: ${businessFiltered.length} deals`);

      // Update stats
      stats.total = allDeals.length;
      setSourceStats(stats);
      setDeals(allDeals);

      console.log(`=== SEARCH COMPLETE ===`);
      console.log(`Total: ${stats.total} deals found`);

    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search deals. Please try again.');
    } finally {
      setLoading(false);
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

  const handleDealClick = (deal) => {
    if (deal.source === 'business') {
      navigate(`/deals/${deal.deal_id}`);
    } else {
      window.open(deal.deal_url, '_blank', 'noopener,noreferrer');
    }
  };

  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return `${price.toFixed(2)} zł`;
    }
    return price;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <h1 
                className="text-2xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors" 
                onClick={() => navigate('/')}
              >
                SaveMate
              </h1>
              <button 
                onClick={() => navigate('/')}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </nav>
        <div className="py-20">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 
              className="text-2xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors" 
              onClick={() => navigate('/')}
            >
              SaveMate
            </h1>
            <button 
              onClick={() => navigate('/')}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Search Results for &quot;{query}&quot;
          </h1>
          <p className="text-gray-600 mb-4">
            Found {deals.length} deals across all sources
          </p>

          {/* Source Statistics */}
          {deals.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-6">
              {sourceStats.slickdeals > 0 && (
                <div className="bg-red-50 border border-red-200 px-4 py-2 rounded-lg">
                  <span className="text-red-700 font-semibold">
                    🔥 Slickdeals: {sourceStats.slickdeals}
                  </span>
                </div>
              )}
              {sourceStats.reddit > 0 && (
                <div className="bg-orange-50 border border-orange-200 px-4 py-2 rounded-lg">
                  <span className="text-orange-700 font-semibold">
                    🤖 Reddit: {sourceStats.reddit}
                  </span>
                </div>
              )}
              {sourceStats.business > 0 && (
                <div className="bg-blue-50 border border-blue-200 px-4 py-2 rounded-lg">
                  <span className="text-blue-700 font-semibold">
                    🏪 Business Deals: {sourceStats.business}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {deals.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold mb-2">No deals found</h2>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or browse all deals
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Browse All Deals
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {deals.map((deal) => {
              const dealId = deal.deal_id || deal.id;
              const isFavorite = favorites.includes(dealId);
              const isBusinessDeal = deal.source === 'business';

              return (
                <div 
                  key={dealId} 
                  className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  {/* Image or placeholder */}
                  {deal.image ? (
                    <div className="relative h-56 overflow-hidden cursor-pointer" onClick={() => handleDealClick(deal)}>
                      <img
                        src={deal.image}
                        alt={deal.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&h=600&fit=crop';
                        }}
                      />
                      
                      {/* Discount badge for business deals */}
                      {isBusinessDeal && deal.discount && (
                        <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                          {deal.discount}
                        </div>
                      )}

                      {/* Favorite button */}
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
                    </div>
                  ) : (
                    <div className="h-56 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center cursor-pointer" onClick={() => handleDealClick(deal)}>
                      <div className="text-white text-6xl">🎁</div>
                    </div>
                  )}

                  <div className="p-6">
                    {/* Source badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        deal.source === 'slickdeals' ? 'bg-red-100 text-red-600' :
                        deal.source === 'reddit' ? 'bg-orange-100 text-orange-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {deal.sourceDisplay}
                      </span>
                    </div>

                    <h3 
                      className="text-xl font-bold mb-3 line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors cursor-pointer"
                      onClick={() => handleDealClick(deal)}
                    >
                      {deal.title}
                    </h3>

                    {/* Business info for business deals */}
                    {isBusinessDeal && deal.businessName && (
                      <div className="flex items-center gap-2 mb-2 text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="text-sm font-medium">{deal.businessName}</span>
                      </div>
                    )}

                    {isBusinessDeal && deal.location && (
                      <div className="flex items-center gap-2 mb-4 text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm">{deal.location}</span>
                      </div>
                    )}
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {deal.description}
                    </p>

                    {/* Price for business deals */}
                    {isBusinessDeal && deal.originalPrice && (
                      <div className="mb-4">
                        <div className="flex items-baseline gap-3">
                          <span className="text-3xl font-bold text-green-600">
                            {formatPrice(deal.discountedPrice)}
                          </span>
                          <span className="text-lg text-gray-400 line-through">
                            {formatPrice(deal.originalPrice)}
                          </span>
                        </div>
                        <p className="text-sm font-semibold mt-1 text-green-600">
                          Save {formatPrice(deal.originalPrice - deal.discountedPrice)}
                        </p>
                      </div>
                    )}

                    <button
                      onClick={() => handleDealClick(deal)}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      {isBusinessDeal ? 'View Details' : 'View Deal →'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
