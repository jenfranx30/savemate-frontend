// src/components/ExternalDeals.jsx - UPDATED WITH MORE SOURCES
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ExternalDeals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Mock external deals from multiple sources
  const mockExternalDeals = [
    {
      id: '1',
      title: 'Excellent Refurbished: 256GB Google Pixel Fold 5G',
      description: 'Google Pixel Fold 5G 256GB - Excellent condition with 1 year warranty',
      source: 'eBay',
      url: 'https://www.ebay.com',
      image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400',
      discount: '35% OFF'
    },
    {
      id: '2',
      title: 'DeWALT 20V MAX 5.0 Ah Battery (DCB205) - $49',
      description: 'DeWALT DCB205 20V MAX 5Ah battery pack with free shipping',
      source: 'Fasteners Inc',
      url: 'https://www.fasteners-inc.com',
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400',
      discount: '$150+ VALUE'
    },
    {
      id: '3',
      title: '28.8-Oz Sour Patch Kids Family Size Candy - $5.50',
      description: 'Amazon has Sour Patch Kids Candy for $5.50 with clip coupon - 30% off',
      source: 'Amazon',
      url: 'https://www.amazon.com',
      image: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400',
      discount: '30% OFF'
    },
    {
      id: '4',
      title: 'Hanes Moves Performance Mens Moisture-Wicking Polo',
      description: 'Amazon has Hanes Performance Polo Shirt for $7.27 with free Prime shipping',
      source: 'Amazon',
      url: 'https://www.amazon.com',
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400',
      discount: '60% OFF'
    },
    {
      id: '5',
      title: 'Groupon: Warsaw Spa Day Package',
      description: 'Luxury spa experience including massage, facial, and sauna - Warsaw location',
      source: 'Groupon',
      url: 'https://www.groupon.pl',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400',
      discount: '70% OFF'
    },
    {
      id: '6',
      title: 'Groupon: Italian Dinner for Two - Krakow',
      description: '3-course Italian dinner for 2 people at Bella Italia restaurant',
      source: 'Groupon',
      url: 'https://www.groupon.pl',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
      discount: '50% OFF'
    },
    {
      id: '7',
      title: 'RapidAPI Deal: Tech Gadget Bundle',
      description: 'Smartphone accessories bundle including charger, case, and screen protector',
      source: 'RapidAPI',
      url: '#',
      image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400',
      discount: '45% OFF'
    },
    {
      id: '8',
      title: 'RapidAPI Deal: Fitness Tracker Watch',
      description: 'Smart fitness tracker with heart rate monitor and sleep tracking',
      source: 'RapidAPI',
      url: '#',
      image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400',
      discount: '55% OFF'
    },
    {
      id: '9',
      title: 'The Land Before Time: Complete TV Series (26 Episodes)',
      description: 'Amazon has The Land Before Time Complete TV Series DVD for $6.99',
      source: 'Amazon',
      url: 'https://www.amazon.com',
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400',
      discount: '$7 ONLY'
    }
  ];

  useEffect(() => {
    // Load mock deals
    setDeals(mockExternalDeals);
  }, []);

  if (deals.length === 0) {
    return null;
  }

  const getSourceBadgeColor = (source) => {
    switch (source.toLowerCase()) {
      case 'amazon':
        return 'bg-orange-500';
      case 'groupon':
        return 'bg-green-500';
      case 'rapidapi':
        return 'bg-purple-500';
      case 'ebay':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Hot Deals from Around the Web
          </h2>
          <p className="text-xl text-gray-600">
            Curated deals from Amazon, Groupon, RapidAPI, and more
          </p>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
              onClick={() => window.open(deal.url, '_blank')}
            >
              {/* Deal Image */}
              <div className="relative h-48 bg-gray-100">
                <img
                  src={deal.image}
                  alt={deal.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x250?text=Deal';
                  }}
                />
                {/* Source Badge */}
                <div className={`absolute top-3 left-3 ${getSourceBadgeColor(deal.source)} text-white px-3 py-1 rounded-full text-xs font-bold`}>
                  {deal.source.toUpperCase()}
                </div>
                {/* Discount Badge */}
                <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {deal.discount}
                </div>
              </div>

              {/* Deal Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                  {deal.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {deal.description}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(deal.url, '_blank');
                  }}
                  className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-2"
                >
                  View Deal →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('/deals')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
          >
            View All Deals
          </button>
        </div>
      </div>
    </section>
  );
}
