// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import CategoryList from '../components/CategoryList';
import FeaturedDeals from '../components/FeaturedDeals';
import ExternalDeals from '../components/ExternalDeals';
import HomePage from '../components/HomePage';

export default function Home() {
  return (
    <div>
      {/* Hero Section and Main Content */}
      <HomePage />
      
      {/* Browse by Category */}
      <CategoryList />
      
      {/* Featured Deals */}
      <FeaturedDeals />
      
      {/* NEW: External Deals from Slickdeals */}
      <ExternalDeals />
    </div>
  );
}