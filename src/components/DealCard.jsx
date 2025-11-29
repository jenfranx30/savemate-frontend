// src/components/DealCard.jsx
export default function DealCard({ deal }) {
  // Format discount display
  const getDiscountDisplay = () => {
    if (deal.discount_percentage) {
      return `${deal.discount_percentage}% OFF`;
    }
    if (deal.original_price && deal.discounted_price) {
      const discount = Math.round(((deal.original_price - deal.discounted_price) / deal.original_price) * 100);
      return `${discount}% OFF`;
    }
    return 'DEAL';
  };

  // Format price display
  const getPriceDisplay = () => {
    if (deal.discounted_price && deal.original_price) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-gray-900">${deal.discounted_price}</span>
          <span className="text-sm text-gray-500 line-through">${deal.original_price}</span>
        </div>
      );
    }
    if (deal.discounted_price) {
      return <span className="text-2xl font-bold text-gray-900">${deal.discounted_price}</span>;
    }
    return <span className="text-lg font-semibold text-gray-900">Special Offer</span>;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group cursor-pointer">
      {/* Image Section */}
      <div className="relative h-48 bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
        {deal.image ? (
          <img 
            src={deal.image} 
            alt={deal.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl">🎁</span>
          </div>
        )}
        
        {/* Discount Badge */}
        <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
          {getDiscountDisplay()}
        </div>
        
        {/* Featured Badge */}
        {deal.is_featured && (
          <div className="absolute top-3 left-3 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
            <span>⭐</span>
            <span>Featured</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Category Badge */}
        {deal.category_name && (
          <div className="mb-2">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {deal.category_name}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {deal.title}
        </h3>

        {/* Business Name */}
        {deal.business_name && (
          <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
            <span>🏪</span>
            <span>{deal.business_name}</span>
          </p>
        )}

        {/* Description */}
        {deal.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {deal.description}
          </p>
        )}

        {/* Price */}
        <div className="mb-4">
          {getPriceDisplay()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {/* Expiry Date */}
          {deal.end_date && (
            <div className="text-xs text-gray-500">
              <span>⏰ Ends {formatDate(deal.end_date)}</span>
            </div>
          )}

          {/* View Deal Button */}
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200">
            View Deal
          </button>
        </div>
      </div>
    </div>
  );
}
