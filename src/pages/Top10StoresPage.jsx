// src/pages/Top10StoresPage.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Top10StoresPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const top10Stores = [
    {
      id: 1,
      name: 'Allegro.pl',
      url: 'https://allegro.pl',
      logo: '🛒',
      category: 'E-commerce',
      description: 'Poland\'s largest online marketplace for everything',
      rating: 4.5,
      deals: 15420
    },
    {
      id: 2,
      name: 'OLX.pl',
      url: 'https://olx.pl',
      logo: '🏪',
      category: 'Classifieds',
      description: 'Buy and sell used items locally',
      rating: 4.3,
      deals: 8930
    },
    {
      id: 3,
      name: 'Mediaexpert.pl',
      url: 'https://mediaexpert.pl',
      logo: '📱',
      category: 'Electronics',
      description: 'Electronics, home appliances, and gadgets',
      rating: 4.6,
      deals: 2340
    },
    {
      id: 4,
      name: 'Doz.pl',
      url: 'https://doz.pl',
      logo: '💊',
      category: 'Health',
      description: 'Online pharmacy and health products',
      rating: 4.7,
      deals: 1560
    },
    {
      id: 5,
      name: 'Ceneo.pl',
      url: 'https://ceneo.pl',
      logo: '🔍',
      category: 'Price Comparison',
      description: 'Compare prices from multiple stores',
      rating: 4.4,
      deals: 12890
    },
    {
      id: 6,
      name: 'Empik.com',
      url: 'https://empik.com',
      logo: '📚',
      category: 'Books & Media',
      description: 'Books, music, movies, and cultural products',
      rating: 4.5,
      deals: 3210
    },
    {
      id: 7,
      name: 'Zalando.pl',
      url: 'https://zalando.pl',
      logo: '👗',
      category: 'Fashion',
      description: 'Fashion and lifestyle online store',
      rating: 4.6,
      deals: 5670
    },
    {
      id: 8,
      name: 'Nike.com',
      url: 'https://nike.com',
      logo: '👟',
      category: 'Sportswear',
      description: 'Athletic footwear and apparel',
      rating: 4.8,
      deals: 890
    },
    {
      id: 9,
      name: 'Euro.com.pl',
      url: 'https://euro.com.pl',
      logo: '🛠️',
      category: 'Electronics',
      description: 'Electronics and home equipment',
      rating: 4.4,
      deals: 1780
    },
    {
      id: 10,
      name: 'Castorama.pl',
      url: 'https://castorama.pl',
      logo: '🏠',
      category: 'Home Improvement',
      description: 'Home improvement and DIY products',
      rating: 4.5,
      deals: 2340
    }
  ];

  const filteredStores = top10Stores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStoreClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 
                className="text-2xl font-bold text-gray-900 cursor-pointer"
                onClick={() => navigate('/')}
              >
                SaveMate
              </h1>
            </div>
            
            <button
              onClick={() => navigate(-1)}
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Top 10 Online Stores in Poland
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Discover the most popular and trusted online shopping destinations in Poland
          </p>
        </div>
      </section>

      {/* Search Bar */}
      <div className="bg-white py-6 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Search stores by name, category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 pr-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-lg"
            />
            <svg 
              className="w-6 h-6 text-gray-400 absolute right-4 top-1/2 transform -translate-y-1/2"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Stores Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {filteredStores.map((store, index) => (
              <div
                key={store.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-blue-500 cursor-pointer"
                onClick={() => handleStoreClick(store.url)}
              >
                <div className="p-8">
                  {/* Rank Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="text-5xl">{store.logo}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-3xl font-bold text-blue-600">#{index + 1}</span>
                          <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {store.name}
                          </h3>
                        </div>
                        <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                          {store.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-6 text-lg">
                    {store.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-yellow-500 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span className="text-lg font-semibold text-gray-700">
                        {store.rating}/5
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-blue-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span className="font-semibold">{store.deals.toLocaleString()} deals</span>
                    </div>
                  </div>

                  {/* Visit Store Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStoreClick(store.url);
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>Visit Store</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredStores.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                No stores found
              </h3>
              <p className="text-gray-600">
                Try searching with different keywords
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-blue-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why Shop from These Stores?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Verified</h3>
                <p className="text-gray-600">
                  All stores are verified and trusted by millions of Polish customers
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="text-4xl mb-4">🚚</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Fast Delivery</h3>
                <p className="text-gray-600">
                  Quick shipping options available across Poland
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Best Prices</h3>
                <p className="text-gray-600">
                  Competitive pricing and frequent sales and promotions
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            &copy; 2025 SaveMate. All rights reserved.
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-blue-400 hover:text-blue-300 font-semibold"
          >
            Back to Home
          </button>
        </div>
      </footer>
    </div>
  );
}
