// src/components/DealsPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthModal } from '../context/AuthModalContext';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { getAllDeals } from '../services/dealService'; // ← ADDED
import Navbar from './Navbar';

// BUSINESS DEALS DATA - 56 deals from Pizza Paradise and Sklep Charytatywny
const getAllBusinessDeals = () => {
    return [
      // Pizza Paradise - 6 deals
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
        category: "food",
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
        category: "food",
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
        category: "food",
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
        category: "food",
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
        category: "food",
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
        category: "food",
        originalPrice: 119.99,
        discountedPrice: 59.99,
        description: "Expertly grilled premium cuts.",
        validUntil: "2026-05-31",
        source: "business"
      },

      // SKLEP CHARYTATYWNY - 50 DEALS
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
        category: "Grocery & Food",
        originalPrice: 1.82,
        discountedPrice: 1.37,
        description: "Fresh artisan bread baked daily. Support charity while shopping.",
        productId: "233",
        productCategory: "Breads",
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
        originalPrice: 4.21,
        discountedPrice: 3.16,
        description: "Wholesome multigrain loaf. Nutritious and delicious.",
        productId: "127",
        productCategory: "Breads",
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
        originalPrice: 4.84,
        discountedPrice: 3.65,
        description: "Traditional sourdough bread with tangy flavor.",
        productId: "144",
        productCategory: "Breads",
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
        originalPrice: 3.45,
        discountedPrice: 2.6,
        description: "Soft white sandwich bread perfect for daily use.",
        productId: "242",
        productCategory: "Breads",
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
        originalPrice: 3.06,
        discountedPrice: 2.3,
        description: "Crusty French baguette with soft interior.",
        productId: "282",
        productCategory: "Breads",
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
        originalPrice: 4.75,
        discountedPrice: 3.56,
        description: "Quick frozen meal ready in minutes.",
        productId: "259",
        productCategory: "Frozen Foods",
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
        originalPrice: 6.34,
        discountedPrice: 4.76,
        description: "Premium frozen vegetables for healthy meals.",
        productId: "284",
        productCategory: "Frozen Foods",
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
        originalPrice: 4.16,
        discountedPrice: 3.12,
        description: "Delicious frozen pizza ready to bake.",
        productId: "165",
        productCategory: "Frozen Foods",
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
        originalPrice: 5.75,
        discountedPrice: 4.31,
        description: "Frozen fruit smoothie mix with berries.",
        productId: "245",
        productCategory: "Frozen Foods",
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
        originalPrice: 2.27,
        discountedPrice: 1.7,
        description: "Gourmet frozen dinner for special occasions.",
        productId: "153",
        productCategory: "Frozen Foods",
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
        originalPrice: 5.46,
        discountedPrice: 4.2,
        description: "Crunchy potato chips in various flavors.",
        productId: "216",
        productCategory: "Snacks",
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
        originalPrice: 6.05,
        discountedPrice: 4.65,
        description: "Healthy mixed nuts for snacking.",
        productId: "202",
        productCategory: "Snacks",
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
        originalPrice: 6.42,
        discountedPrice: 4.95,
        description: "Sweet popcorn treat for movie nights.",
        productId: "275",
        productCategory: "Snacks",
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
        originalPrice: 4.32,
        discountedPrice: 3.33,
        description: "Savory cheese crackers perfect for parties.",
        productId: "235",
        productCategory: "Snacks",
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
        originalPrice: 5.49,
        discountedPrice: 4.23,
        description: "Chocolate-covered pretzels for sweet cravings.",
        productId: "110",
        productCategory: "Snacks",
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
        originalPrice: 5.03,
        discountedPrice: 3.78,
        description: "Fresh whole milk from local farms.",
        productId: "234",
        productCategory: "Dairy",
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
        originalPrice: 5.68,
        discountedPrice: 4.26,
        description: "Creamy Greek yogurt with probiotics.",
        productId: "112",
        productCategory: "Dairy",
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
        originalPrice: 5.19,
        discountedPrice: 3.89,
        description: "Aged cheddar cheese with rich flavor.",
        productId: "214",
        productCategory: "Dairy",
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
        originalPrice: 4.08,
        discountedPrice: 3.06,
        description: "Organic butter made from grass-fed cows.",
        productId: "226",
        productCategory: "Dairy",
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
        originalPrice: 5.24,
        discountedPrice: 3.93,
        description: "Smooth cream cheese for spreads and baking.",
        productId: "274",
        productCategory: "Dairy",
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
        originalPrice: 5.93,
        discountedPrice: 4.45,
        description: "Fresh organic tomatoes harvested daily.",
        productId: "232",
        productCategory: "Vegetables",
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
        originalPrice: 5.85,
        discountedPrice: 4.39,
        description: "Crisp green salad mix ready to eat.",
        productId: "137",
        productCategory: "Vegetables",
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
        originalPrice: 5.44,
        discountedPrice: 4.08,
        description: "Sweet bell peppers in assorted colors.",
        productId: "299",
        productCategory: "Vegetables",
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
        originalPrice: 5.66,
        discountedPrice: 4.25,
        description: "Tender asparagus spears for grilling.",
        productId: "249",
        productCategory: "Vegetables",
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
        originalPrice: 3.84,
        discountedPrice: 2.88,
        description: "Baby carrots perfect for snacking.",
        productId: "171",
        productCategory: "Vegetables",
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
        originalPrice: 5.13,
        discountedPrice: 3.9,
        description: "Fresh orange juice squeezed daily.",
        productId: "157",
        productCategory: "Beverages",
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
        originalPrice: 4.35,
        discountedPrice: 3.31,
        description: "Sparkling mineral water refreshing taste.",
        productId: "116",
        productCategory: "Beverages",
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
        originalPrice: 5.1,
        discountedPrice: 3.88,
        description: "Premium coffee beans from around the world.",
        productId: "145",
        productCategory: "Beverages",
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
        originalPrice: 6.36,
        discountedPrice: 4.83,
        description: "Organic green tea with antioxidants.",
        productId: "253",
        productCategory: "Beverages",
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
        originalPrice: 2.27,
        discountedPrice: 1.73,
        description: "Refreshing lemonade made from real lemons.",
        productId: "132",
        productCategory: "Beverages",
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
        originalPrice: 4.04,
        discountedPrice: 3.16,
        description: "Crunchy granola mix with nuts and honey.",
        productId: "261",
        productCategory: "Cereals",
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
        originalPrice: 3.99,
        discountedPrice: 3.12,
        description: "Whole grain oatmeal for healthy breakfast.",
        productId: "150",
        productCategory: "Cereals",
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
        originalPrice: 4.66,
        discountedPrice: 3.65,
        description: "Kids favorite cereal with fun shapes.",
        productId: "144",
        productCategory: "Cereals",
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
        originalPrice: 4.52,
        discountedPrice: 3.56,
        description: "High fiber bran flakes for digestive health.",
        productId: "298",
        productCategory: "Cereals",
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
        originalPrice: 3.65,
        discountedPrice: 2.87,
        description: "Honey nut clusters sweet and crunchy.",
        productId: "225",
        productCategory: "Cereals",
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
        originalPrice: 2.83,
        discountedPrice: 2.14,
        description: "Multi-surface cleaner for all rooms.",
        productId: "283",
        productCategory: "Household",
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
        originalPrice: 3.28,
        discountedPrice: 2.5,
        description: "Powerful laundry detergent removes stains.",
        productId: "156",
        productCategory: "Household",
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
        originalPrice: 4.89,
        discountedPrice: 3.71,
        description: "Gentle dish soap cuts through grease.",
        productId: "131",
        productCategory: "Household",
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
        originalPrice: 5.13,
        discountedPrice: 3.9,
        description: "Absorbent paper towels for quick cleanup.",
        productId: "269",
        productCategory: "Household",
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
        originalPrice: 4.72,
        discountedPrice: 3.55,
        description: "All-purpose wipes for sanitizing surfaces.",
        productId: "297",
        productCategory: "Household",
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
        originalPrice: 1.85,
        discountedPrice: 1.48,
        description: "Ready-to-eat pasta meal in minutes.",
        productId: "291",
        productCategory: "Packaged Food",
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
        originalPrice: 2.6,
        discountedPrice: 2.08,
        description: "Instant rice meal ready in 90 seconds.",
        productId: "288",
        productCategory: "Packaged Food",
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
        originalPrice: 2.59,
        discountedPrice: 2.08,
        description: "Hearty canned soup for cold days.",
        productId: "223",
        productCategory: "Packaged Food",
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
        originalPrice: 3.82,
        discountedPrice: 3.06,
        description: "Packaged noodles with savory seasoning.",
        productId: "149",
        productCategory: "Packaged Food",
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
        originalPrice: 4.54,
        discountedPrice: 3.64,
        description: "Quick quinoa mix protein-packed meal.",
        productId: "237",
        productCategory: "Packaged Food",
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
        originalPrice: 4.67,
        discountedPrice: 3.54,
        description: "Premium chocolate bar with rich cocoa.",
        productId: "165",
        productCategory: "Confectionery",
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
        originalPrice: 4.04,
        discountedPrice: 3.08,
        description: "Assorted candy mix for all tastes.",
        productId: "272",
        productCategory: "Confectionery",
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
        originalPrice: 4.63,
        discountedPrice: 3.52,
        description: "Fruity gummy bears loved by kids.",
        productId: "273",
        productCategory: "Confectionery",
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
        originalPrice: 6.84,
        discountedPrice: 5.18,
        description: "Soft caramel chews melt in your mouth.",
        productId: "281",
        productCategory: "Confectionery",
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
        category: "Food ",
        originalPrice: 2.91,
        discountedPrice: 2.22,
        description: "Classic licorice twists sweet treat.",
        productId: "127",
        productCategory: "Confectionery",
        validUntil: "2026-01-18",
        source: "business"
      }
    ];
  };

export default function DealsPage() {
  const navigate = useNavigate();
  const { openLogin } = useAuthModal();
  const { user, isAuthenticated } = useAuth();
  const { favorites, toggleFavorite } = useFavorites();
  const [searchParams] = useSearchParams();
  
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'all';
  const businessNameParam = searchParams.get('businessName') || '';
  
  const [allDeals, setAllDeals] = useState([]); // ← FIXED: Changed from getAllBusinessDeals() to []
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [minDiscount, setMinDiscount] = useState(0);

  const categories = [
  { value: 'all', label: 'All Categories', icon: '🏷️' },
  { value: 'food', label: 'Food & Dining', icon: '🍔' },
  { value: 'shopping', label: 'Shopping', icon: '🛍️' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎬' },
  { value: 'health', label: 'Health & Beauty', icon: '💆' },
  { value: 'travel', label: 'Travel', icon: '✈️' },
  { value: 'services', label: 'Services', icon: '🔧' },
  { value: 'grocery', label: 'Grocery', icon: '🛒' },

  // Sklep Charytatywny categories (match your data)
  { value: 'grocery-food', label: 'Grocery & Food', icon: '🛒' },
  { value: 'breads', label: 'Breads', icon: '🍞' },
  { value: 'frozen-foods', label: 'Frozen Foods', icon: '🧊' },
  { value: 'snacks', label: 'Snacks', icon: '🍿' },
  { value: 'dairy', label: 'Dairy', icon: '🥛' },
  { value: 'vegetables', label: 'Vegetables', icon: '🥦' },
  { value: 'beverages', label: 'Beverages', icon: '🥤' },
  { value: 'cereals', label: 'Cereals', icon: '🥣' },
  { value: 'household', label: 'Household', icon: '🧻' },
  { value: 'packaged-food', label: 'Packaged Food', icon: '📦' },
  { value: 'confectionery', label: 'Confectionery', icon: '🍬' }
];


  const locations = [
    'All Locations',
    'Warsaw',
    'Katowice',
    'Krakow',
    'Gdansk',
    'Wroclaw',
    'Poznan',
    'Zakopane',
    'Łódź',
    'Sopot',
    'Sosnowiec'
  ];

  // ← ADDED: Load all deals function
  const loadAllDeals = () => {
    console.log('🔄 Loading all deals...');
    
    // Get deals from dealService (includes localStorage)
    const dealsFromService = getAllDeals();
    
    // Get static deals
    const staticDeals = getAllBusinessDeals();
    
    // Merge without duplicates
    const mergedDeals = [...dealsFromService];
    
    staticDeals.forEach(staticDeal => {
      const exists = mergedDeals.find(d => 
        (d.id === staticDeal.id) || (d.deal_id === staticDeal.deal_id)
      );
      if (!exists) {
        mergedDeals.push(staticDeal);
      }
    });
    
    console.log(`✅ DealsPage loaded ${mergedDeals.length} total deals (${dealsFromService.length} from storage, ${staticDeals.length} static)`);
    setAllDeals(mergedDeals);
  };

  // ← ADDED: useEffect to load deals and listen for updates
  useEffect(() => {
    loadAllDeals();
    
    const handleDealsUpdate = () => {
      console.log('🔄 Deals updated, reloading DealsPage...');
      loadAllDeals();
    };
    
    window.addEventListener('storage', handleDealsUpdate);
    window.addEventListener('dealsUpdated', handleDealsUpdate);
    
    return () => {
      window.removeEventListener('storage', handleDealsUpdate);
      window.removeEventListener('dealsUpdated', handleDealsUpdate);
    };
  }, []);

  // Apply filters when they change (INCLUDING businessNameParam)
  useEffect(() => {
    applyFilters();
  }, [allDeals, selectedCategory, selectedLocation, minDiscount, searchQuery, businessNameParam]);

  const applyFilters = () => {
    let filtered = [...allDeals];

    // Filter by business name FIRST
    if (businessNameParam) {
      filtered = filtered.filter(deal => 
        deal.businessName === businessNameParam
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(deal => deal.category === selectedCategory);
    }

    // Filter by location
    if (selectedLocation && selectedLocation !== 'All Locations') {
      filtered = filtered.filter(deal => 
        deal.location?.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    // Filter by minimum discount
    if (minDiscount > 0) {
      filtered = filtered.filter(deal => deal.discount_percentage >= minDiscount);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(deal =>
        deal.title?.toLowerCase().includes(query) ||
        deal.businessName?.toLowerCase().includes(query) ||
        deal.location?.toLowerCase().includes(query)
      );
    }

    setFilteredDeals(filtered);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters();
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedLocation('All Locations');
    setMinDiscount(0);
    setSearchQuery('');
    navigate('/deals'); // Clear URL parameters
  };

  // ← ADDED: Get unique business names for dropdown
  const getBusinessNames = () => {
    const names = new Set(allDeals.map(deal => deal.businessName || deal.business_name));
    return Array.from(names).sort();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">
            {businessNameParam ? `${businessNameParam} Deals` : 'Browse All Deals'}
          </h1>
          <p className="text-xl text-blue-100">
            {filteredDeals.length} amazing deals available
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                🔍 Filters
              </h2>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Search
                </label>
                <form onSubmit={handleSearch}>
                  <input
                    type="text"
                    placeholder="Search deals..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </form>
              </div>

              {/* Business Filter - DYNAMIC */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Business
                </label>
                <select
                  value={businessNameParam}
                  onChange={(e) => {
                    if (e.target.value) {
                      navigate(`/deals?businessName=${encodeURIComponent(e.target.value)}`);
                    } else {
                      navigate('/deals');
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">🏢 All Businesses</option>
                  {getBusinessNames().map(name => (
                    <option key={name} value={name}>
                      {name === 'Pizza Paradise' ? '🍕' : name === 'Sklep Charytatywny' ? '🛒' : '🏪'} {name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Location
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {locations.map(loc => (
                    <option key={loc} value={loc}>
                      📍 {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Discount Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Minimum Discount: {minDiscount}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="80"
                  step="10"
                  value={minDiscount}
                  onChange={(e) => setMinDiscount(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>80%</span>
                </div>
              </div>

              {/* Reset Button */}
              <button
                onClick={resetFilters}
                className="w-full py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Reset Filters
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                💡 Showing {filteredDeals.length} of {allDeals.length} deals
              </p>
              {businessNameParam && (
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <p className="text-xs text-blue-700 mb-2">
                    Filtering by: <strong>{businessNameParam}</strong>
                  </p>
                  <button
                    onClick={() => navigate('/deals')}
                    className="text-xs text-blue-600 hover:text-blue-800 hover:underline font-semibold"
                  >
                    ✕ Clear business filter
                  </button>
                </div>
              )}
            </div>
          </aside>

          {/* Deals Grid */}
          <main className="flex-1">
            <div className="mb-4 text-gray-600">
              Found {filteredDeals.length} deals
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-300"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredDeals.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg shadow-md">
                <div className="text-6xl mb-4">🎁</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">
                  No deals found
                </h3>
                <p className="text-gray-500 mb-6">
                  {businessNameParam 
                    ? `No deals available from ${businessNameParam}` 
                    : 'Try adjusting your filters or search query'}
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredDeals.map(deal => (
                  <div
                    key={deal.id || deal.deal_id}
                    className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    onClick={() => navigate(`/deals/${deal.id || deal.deal_id}`)}
                  >
                    {/* Deal Image */}
                    <div className="relative h-56 bg-gray-200">
                      <img
                        src={deal.image || deal.image_url}
                        alt={deal.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x250?text=Deal';
                        }}
                      />
                      {/* Discount Badge */}
                      <div className="absolute top-3 right-3 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                        {deal.discount_percentage || deal.discount}
                      </div>
                      {/* Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isAuthenticated) {
                            openLogin();
                            return;
                          }
                          toggleFavorite(deal);
                        }}
                        className="absolute top-3 left-3 bg-black/50 rounded-full p-2 shadow-lg hover:scale-110 transition-transform"
                        aria-label="Toggle favorite"
                      >
                        <svg
                          className={`h-5 w-5 ${(favorites || []).some((f) => (f.id || f.deal_id) === (deal.id || deal.deal_id)) ? 'text-red-500' : 'text-gray-300'}`}
                          fill={(favorites || []).some((f) => (f.id || f.deal_id) === (deal.id || deal.deal_id)) ? 'currentColor' : 'none'}
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Deal Content */}
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                        {deal.title}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <span className="text-sm">🏢 {deal.businessName || deal.business_name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 mb-3">
                        <span className="text-sm">📍 {deal.location}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/deals/${deal.id || deal.deal_id}`);
                        }}
                        className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
