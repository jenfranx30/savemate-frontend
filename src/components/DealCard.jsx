import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';

export default function DealCard({ deal, onFavoriteToggle, isFavorite }) {
  const navigate = useNavigate();
  const favorites = useFavorites();
  const derivedIsFavorite = typeof isFavorite === 'boolean'
    ? isFavorite
    : favorites.isFavorite(deal.id || deal.deal_id);

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle(deal);
      return;
    }
    await favorites.toggleFavorite(deal);
  };

  const handleViewDeal = () => {
    if (deal.deal_url) {
      window.open(deal.deal_url, '_blank');
    } else if (deal.url) {
      navigate(deal.url);
    } else {
      navigate(`/deals/${deal.id || deal.deal_id}`);
    }
  };

  const formatPrice = (price) => {
    if (price === undefined || price === null || Number.isNaN(price)) return null;
    return `${Number(price).toFixed(2)} zł`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const isExpired = deal.validUntil && new Date(deal.validUntil) < new Date();

  return (
    <div
      className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border ${
        isExpired ? 'border-red-300 opacity-70' : 'border-gray-100'
      }`}
      style={{
        height: '560px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative' // IMPORTANT: anchor for absolute button
      }}
    >
      {/* Image Section - 200px */}
      <div className="relative overflow-hidden flex-shrink-0" style={{ height: '200px' }}>
        <img
          src={
            deal.image ||
            deal.image_url ||
            'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=600&fit=crop'
          }
          alt={deal.title}
          className={`w-full h-full object-cover transition-transform duration-300 ${
            isExpired ? 'grayscale' : 'hover:scale-105'
          }`}
          onError={(e) => {
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=600&fit=crop';
          }}
        />

        {/* Source Badge */}
        {deal.source && (
          <div className="absolute top-3 left-3 z-10">
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase shadow-lg flex items-center gap-1 ${
                deal.source === 'reddit'
                  ? 'bg-orange-500 text-white'
                  : deal.source === 'slickdeals'
                  ? 'bg-blue-500 text-white'
                  : deal.source === 'groupon'
                  ? 'bg-green-500 text-white'
                  : deal.source === 'business'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-white'
              }`}
            >
              {deal.source === 'reddit' && '🤖'}
              {deal.source === 'slickdeals' && '🔥'}
              {deal.source === 'groupon' && '🎫'}
              {deal.source === 'business' && '🏢'}
              {String(deal.source).toUpperCase()}
            </span>
          </div>
        )}

        {/* Discount Badge */}
        {(deal.discount_percentage || deal.discount) && !isExpired && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1.5 rounded-full font-bold text-sm shadow-lg">
            {deal.discount || `${deal.discount_percentage}% OFF`}
          </div>
        )}

        {/* Favorite Button */}
        {!isExpired && (
          <button
            onClick={handleToggleFavorite}
            className="absolute top-3 left-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200 z-20"
            aria-label="Toggle favorite"
            type="button"
          >
            <svg
              className={`w-5 h-5 ${derivedIsFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`}
              fill={derivedIsFavorite ? 'currentColor' : 'none'}
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
        )}

        {/* Expired Overlay */}
        {isExpired && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-red-600 text-white px-5 py-2.5 rounded-lg font-bold shadow-xl">
              Deal Ended
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div
        className="flex flex-col flex-1"
        style={{
          padding: '20px',
          paddingBottom: '86px' // reserve space for the bottom button
        }}
      >
        {/* Title */}
        <h3
          className={`font-bold text-lg leading-snug mb-3 ${
            isExpired ? 'text-gray-500' : 'text-gray-900'
          }`}
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {deal.title}
        </h3>

        {/* Business Name */}
        {deal.businessName && (
          <div className="flex items-center gap-1.5 text-gray-600 text-sm mb-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <span className="font-medium truncate">{deal.businessName}</span>
          </div>
        )}

        {/* Location */}
        {deal.location && (
          <div className="flex items-center gap-1.5 text-gray-600 text-sm mb-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
            </svg>
            <span className="truncate">{deal.location}</span>
          </div>
        )}

        {/* Expiration Date */}
        {deal.validUntil && (
          <div
            className={`flex items-center gap-1.5 text-xs mb-3 ${
              isExpired ? 'text-red-600 font-semibold' : 'text-gray-500'
            }`}
          >
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>
              {isExpired ? 'Expired' : 'Valid until'}: {formatDate(deal.validUntil)}
            </span>
          </div>
        )}

        {/* Price Section */}
        {(deal.discountedPrice || deal.discounted_price || deal.price) && (
          <div className="mt-auto">
            <div className="flex items-baseline gap-2 mb-1">
              <span className={`text-2xl font-bold ${isExpired ? 'text-gray-400' : 'text-green-600'}`}>
                {formatPrice(deal.discountedPrice || deal.discounted_price || deal.price)}
              </span>

              {(deal.originalPrice || deal.original_price) && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(deal.originalPrice || deal.original_price)}
                </span>
              )}
            </div>

            {(deal.originalPrice || deal.original_price) && (
              <p className={`text-sm font-semibold ${isExpired ? 'text-gray-400' : 'text-green-600'}`}>
                Save{' '}
                {formatPrice(
                  (deal.originalPrice || deal.original_price) -
                    (deal.discountedPrice || deal.discounted_price || deal.price)
                )}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Button - always at bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          right: '20px'
        }}
      >
        <button
          onClick={handleViewDeal}
          disabled={isExpired}
          className={`w-full font-bold text-sm transition-all duration-300 shadow-md ${
            isExpired
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:shadow-lg transform hover:-translate-y-0.5'
          }`}
          style={{
            padding: '14px 0',
            borderRadius: '12px'
          }}
          type="button"
        >
          {isExpired ? 'Deal Ended' : 'View Deals'}
        </button>
      </div>
    </div>
  );
}
