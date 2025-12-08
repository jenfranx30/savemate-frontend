// src/components/DealsPage.jsx - MORE DEALS VERSION
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Enhanced mock deals - 20 deals across all categories
const MOCK_DEALS = [
  // Food & Dining (5 deals)
  {
    _id: '1',
    title: '50% Off All Pizzas - Weekend Special',
    business_name: 'Pizza Paradise',
    location: 'Warsaw, Mokotów',
    discount_percentage: 50,
    image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
    expiry_date: '2024-12-15',
    category: 'food'
  },
  {
    _id: '2',
    title: 'Burger Combo - 35% Off',
    business_name: 'Burger House',
    location: 'Warsaw, Śródmieście',
    discount_percentage: 35,
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    expiry_date: '2024-12-17',
    category: 'food'
  },
  {
    _id: '3',
    title: 'Sushi All You Can Eat - 40% Discount',
    business_name: 'Tokyo Sushi Bar',
    location: 'Krakow, Kazimierz',
    discount_percentage: 40,
    image_url: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
    expiry_date: '2024-12-20',
    category: 'food'
  },
  {
    _id: '4',
    title: 'Coffee & Pastry Deal - 30% Off',
    business_name: 'Cafe Delights',
    location: 'Gdansk, Old Town',
    discount_percentage: 30,
    image_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
    expiry_date: '2024-12-18',
    category: 'food'
  },
  {
    _id: '5',
    title: 'Italian Dinner for Two - 45% Off',
    business_name: 'Bella Italia',
    location: 'Wroclaw, Market Square',
    discount_percentage: 45,
    image_url: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=400',
    expiry_date: '2024-12-22',
    category: 'food'
  },

  // Shopping (5 deals)
  {
    _id: '6',
    title: 'Buy 1 Get 1 Free - All Shoes',
    business_name: 'Fashion Outlet',
    location: 'Krakow, Center',
    discount_percentage: 50,
    image_url: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400',
    expiry_date: '2024-12-20',
    category: 'shopping'
  },
  {
    _id: '7',
    title: 'Electronics Sale - Up to 70% Off',
    business_name: 'TechStore',
    location: 'Krakow, Bonarka',
    discount_percentage: 70,
    image_url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
    expiry_date: '2024-12-14',
    category: 'shopping'
  },
  {
    _id: '8',
    title: 'Winter Clothing Sale - 60% Discount',
    business_name: 'Style & Co',
    location: 'Warsaw, Galeria Mokotów',
    discount_percentage: 60,
    image_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400',
    expiry_date: '2024-12-30',
    category: 'shopping'
  },
  {
    _id: '9',
    title: 'Jewelry Spectacular - 55% Off',
    business_name: 'Golden Gems',
    location: 'Gdansk, Długa',
    discount_percentage: 55,
    image_url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',
    expiry_date: '2024-12-25',
    category: 'shopping'
  },
  {
    _id: '10',
    title: 'Books & Stationery - 40% Off',
    business_name: 'BookWorld',
    location: 'Poznan, Stary Browar',
    discount_percentage: 40,
    image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
    expiry_date: '2024-12-28',
    category: 'shopping'
  },

  // Entertainment (3 deals)
  {
    _id: '11',
    title: 'Movie Tickets - 40% Discount',
    business_name: 'Cinema City',
    location: 'Warsaw, Złote Tarasy',
    discount_percentage: 40,
    image_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400',
    expiry_date: '2024-12-18',
    category: 'entertainment'
  },
  {
    _id: '12',
    title: 'Concert Tickets - 25% Off',
    business_name: 'Tauron Arena',
    location: 'Krakow, Tauron Arena',
    discount_percentage: 25,
    image_url: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400',
    expiry_date: '2024-12-31',
    category: 'entertainment'
  },
  {
    _id: '13',
    title: 'Escape Room Experience - 35% Off',
    business_name: 'Mystery Rooms',
    location: 'Warsaw, City Center',
    discount_percentage: 35,
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    expiry_date: '2024-12-20',
    category: 'entertainment'
  },

  // Health & Beauty (4 deals)
  {
    _id: '14',
    title: '30% Off Spa Services',
    business_name: 'Relax Spa',
    location: 'Gdansk, Wrzeszcz',
    discount_percentage: 30,
    image_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400',
    expiry_date: '2024-12-25',
    category: 'health'
  },
  {
    _id: '15',
    title: 'Gym Membership - 60% Off First Month',
    business_name: 'FitLife Gym',
    location: 'Wroclaw, Stare Miasto',
    discount_percentage: 60,
    image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400',
    expiry_date: '2024-12-30',
    category: 'health'
  },
  {
    _id: '16',
    title: 'Hair Salon Services - 40% Discount',
    business_name: 'Beauty Studio',
    location: 'Warsaw, Wilanów',
    discount_percentage: 40,
    image_url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400',
    expiry_date: '2024-12-22',
    category: 'health'
  },
  {
    _id: '17',
    title: 'Yoga Classes Package - 50% Off',
    business_name: 'Zen Yoga Studio',
    location: 'Krakow, Podgórze',
    discount_percentage: 50,
    image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
    expiry_date: '2024-12-27',
    category: 'health'
  },

  // Travel (3 deals)
  {
    _id: '18',
    title: 'Weekend Getaway Package - 45% Off',
    business_name: 'Mountain Resort',
    location: 'Zakopane',
    discount_percentage: 45,
    image_url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400',
    expiry_date: '2024-12-22',
    category: 'travel'
  },
  {
    _id: '19',
    title: 'City Tour Package - 35% Discount',
    business_name: 'Poland Tours',
    location: 'Krakow, Multiple Locations',
    discount_percentage: 35,
    image_url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400',
    expiry_date: '2024-12-29',
    category: 'travel'
  },
  {
    _id: '20',
    title: 'Beach Resort Stay - 55% Off',
    business_name: 'Baltic Beach Resort',
    location: 'Sopot, Beach Area',
    discount_percentage: 55,
    image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
    expiry_date: '2024-12-31',
    category: 'travel'
  }
];

export default function DealsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'all';
  
  const [allDeals, setAllDeals] = useState(MOCK_DEALS);
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
    { value: 'services', label: 'Services', icon: '🔧' }
  ];

  const locations = [
    'All Locations',
    'Warsaw',
    'Krakow',
    'Gdansk',
    'Wroclaw',
    'Poznan',
    'Zakopane',
    'Sopot'
  ];

  // Apply filters when they change
  useEffect(() => {
    applyFilters();
  }, [selectedCategory, selectedLocation, minDiscount, searchQuery]);

  const applyFilters = () => {
    let filtered = [...allDeals];

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
        deal.business_name?.toLowerCase().includes(query) ||
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
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 
              className="text-2xl font-bold text-gray-900 cursor-pointer" 
              onClick={() => navigate('/')}
            >
              SaveMate
            </h1>
            <div className="hidden md:flex items-center gap-6">
              <button 
                onClick={() => navigate('/deals')}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Deals
              </button>
              <button 
                onClick={() => navigate('/categories')}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Categories
              </button>
              <button 
                onClick={() => navigate('/about')}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                About
              </button>
            </div>
            <button 
              onClick={() => navigate('/login')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Browse All Deals</h1>
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
                  Try adjusting your filters or search query
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
                    key={deal._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    onClick={() => navigate(`/deals/${deal._id}`)}
                  >
                    {/* Deal Image */}
                    <div className="relative h-48 bg-gray-200">
                      <img
                        src={deal.image_url}
                        alt={deal.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x250?text=Deal';
                        }}
                      />
                      {/* Discount Badge */}
                      <div className="absolute top-3 right-3 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                        {deal.discount_percentage}% OFF
                      </div>
                      {/* Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          alert('Favorites feature coming soon!');
                        }}
                        className="absolute top-3 left-3 bg-white rounded-full p-2 shadow-lg hover:scale-110 transition-transform"
                      >
                        ❤️
                      </button>
                    </div>

                    {/* Deal Content */}
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                        {deal.title}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <span className="text-sm">🏢 {deal.business_name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 mb-3">
                        <span className="text-sm">📍 {deal.location}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/deals/${deal._id}`);
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
