// src/components/CategoriesPage.jsx
import { useNavigate } from 'react-router-dom';

export default function CategoriesPage() {
  const navigate = useNavigate();

  const categories = [
    {
      id: 1,
      name: 'Food & Dining',
      icon: '🍔',
      description: 'Restaurants, cafes, and food delivery',
      dealCount: 145,
      color: 'from-red-400 to-red-600',
      slug: 'food'
    },
    {
      id: 2,
      name: 'Shopping',
      icon: '🛍️',
      description: 'Clothing, electronics, and more',
      dealCount: 230,
      color: 'from-purple-400 to-purple-600',
      slug: 'shopping'
    },
    {
      id: 3,
      name: 'Entertainment',
      icon: '🎬',
      description: 'Movies, concerts, and events',
      dealCount: 89,
      color: 'from-pink-400 to-pink-600',
      slug: 'entertainment'
    },
    {
      id: 4,
      name: 'Health & Beauty',
      icon: '💆',
      description: 'Spas, salons, and wellness',
      dealCount: 67,
      color: 'from-green-400 to-green-600',
      slug: 'health'
    },
    {
      id: 5,
      name: 'Travel',
      icon: '✈️',
      description: 'Hotels, flights, and packages',
      dealCount: 112,
      color: 'from-blue-400 to-blue-600',
      slug: 'travel'
    },
    {
      id: 6,
      name: 'Services',
      icon: '🔧',
      description: 'Home, auto, and professional services',
      dealCount: 93,
      color: 'from-orange-400 to-orange-600',
      slug: 'services'
    },
    {
      id: 7,
      name: 'Sports & Fitness',
      icon: '⚽',
      description: 'Gyms, equipment, and activities',
      dealCount: 78,
      color: 'from-indigo-400 to-indigo-600',
      slug: 'sports'
    },
    {
      id: 8,
      name: 'Education',
      icon: '📚',
      description: 'Courses, tutoring, and learning',
      dealCount: 54,
      color: 'from-teal-400 to-teal-600',
      slug: 'education'
    }
  ];

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
            <div className="hidden md:flex items-center gap-6">
              <button 
                onClick={() => navigate('/deals')}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Deals
              </button>
              <button 
                onClick={() => navigate('/categories')}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
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
            <div>
              <button 
                onClick={() => navigate('/login')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Browse by Category</h1>
          <p className="text-xl text-blue-100">
            Find deals in your favorite categories
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map(category => (
            <div
              key={category.id}
              onClick={() => navigate(`/deals?category=${category.slug}`)}
              className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              {/* Category Header with Gradient */}
              <div className={`bg-gradient-to-br ${category.color} p-8 text-center`}>
                <div className="text-6xl mb-3">{category.icon}</div>
                <h3 className="text-2xl font-bold text-white">
                  {category.name}
                </h3>
              </div>

              {/* Category Details */}
              <div className="p-6">
                <p className="text-gray-600 mb-4 text-center">
                  {category.description}
                </p>
                <div className="flex items-center justify-center gap-2 text-blue-600 font-semibold">
                  <span className="text-2xl">{category.dealCount}</span>
                  <span>deals available</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Can't find what you're looking for?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Try browsing all deals or use our search feature
          </p>
          <button 
            onClick={() => navigate('/deals')}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors"
          >
            Browse All Deals
          </button>
        </div>
      </div>
    </div>
  );
}
