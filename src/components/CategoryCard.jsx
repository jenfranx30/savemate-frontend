// src/components/CategoryCard.jsx
import { useNavigate } from 'react-router-dom';

export default function CategoryCard({ category, onClick }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(category);
    } else {
      // Fallback: navigate to deals page with category filter
      navigate(`/deals?category=${category.slug}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="flex-shrink-0 w-48 bg-white rounded-xl shadow-md hover:shadow-xl cursor-pointer transition-all duration-300 hover:scale-105"
    >
      {/* Category Icon */}
      <div className={`${category.color || 'bg-blue-400'} rounded-t-xl p-8 text-center`}>
        <div className="text-5xl mb-2">{category.icon}</div>
        <h3 className="text-white font-bold text-lg">{category.name}</h3>
      </div>

      {/* Category Info */}
      <div className="p-4 text-center">
        <p className="text-gray-600 text-sm mb-2">
          {category.dealCount || 0} deals
        </p>
        <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
          Browse →
        </button>
      </div>
    </div>
  );
}
