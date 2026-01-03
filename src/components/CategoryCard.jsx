// src/components/CategoryCard.jsx
// Updated to match BusinessDeals.jsx categories
import { useNavigate } from 'react-router-dom';

export default function CategoryCard({ category, onClick, dealCount }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (dealCount === 0) return; // Don't navigate if no deals
    
    if (onClick) {
      onClick(category);
    } else {
      // Navigate with proper query parameter
      if (category.query) {
        navigate(`/deals?category=${encodeURIComponent(category.query)}`);
      } else if (category.subCategory) {
        navigate(`/deals?subCategory=${encodeURIComponent(category.subCategory)}`);
      } else if (category.slug) {
        navigate(`/deals?category=${category.slug}`);
      }
    }
  };

  const displayCount = dealCount !== undefined ? dealCount : (category.dealCount || 0);
  const categoryColor = category.color ? `bg-gradient-to-br ${category.color}` : 'bg-blue-400';

  return (
    <div
      onClick={handleClick}
      className={`
        flex-shrink-0 w-48 bg-white rounded-xl shadow-md 
        transition-all duration-300 
        ${displayCount > 0 
          ? 'hover:shadow-xl cursor-pointer hover:scale-105' 
          : 'opacity-50 cursor-not-allowed'
        }
      `}
    >
      {/* Category Icon with Gradient */}
      <div className={`${categoryColor} rounded-t-xl p-8 text-center relative overflow-hidden`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="text-8xl absolute -top-4 -right-4">
            {category.icon}
          </div>
        </div>
        
        <div className="relative z-10">
          <div className="text-5xl mb-2">{category.icon}</div>
          <h3 className="text-white font-bold text-lg line-clamp-2">
            {category.name}
          </h3>
        </div>
      </div>

      {/* Category Info */}
      <div className="p-4 text-center">
        <p className={`text-sm mb-2 font-semibold ${
          displayCount > 0 ? 'text-blue-600' : 'text-gray-400'
        }`}>
          {displayCount} {displayCount === 1 ? 'deal' : 'deals'}
        </p>
        {displayCount > 0 && (
          <div className="flex items-center justify-center text-blue-600 hover:text-blue-700 font-semibold text-sm">
            <span>Browse</span>
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
