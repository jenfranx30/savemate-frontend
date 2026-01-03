// src/components/FilterChips.jsx
// Active filter chips with individual clear and "Clear All" functionality

export default function FilterChips({ activeFilters, onRemoveFilter, onClearAll }) {
  // activeFilters structure: { category, location, minDiscount, businessName, search }
  const chips = [];

  // Build chips array from active filters
  if (activeFilters.search) {
    chips.push({
      type: 'search',
      label: `Search: "${activeFilters.search}"`,
      icon: '🔍'
    });
  }

  if (activeFilters.category && activeFilters.category !== 'all') {
    const categoryLabels = {
      'food': '🍔 Food & Dining',
      'electronics': '💻 Electronics',
      'fashion': '👗 Fashion',
      'home': '🏡 Home & Garden',
      'beauty': '💄 Beauty',
      'sports': '⚽ Sports',
      'books': '📚 Books',
      'toys': '🧸 Toys',
      'grocery': '🛒 Grocery'
    };
    chips.push({
      type: 'category',
      label: categoryLabels[activeFilters.category] || activeFilters.category,
      icon: ''
    });
  }

  if (activeFilters.location && activeFilters.location !== 'All Locations') {
    chips.push({
      type: 'location',
      label: `📍 ${activeFilters.location}`,
      icon: ''
    });
  }

  if (activeFilters.minDiscount && activeFilters.minDiscount > 0) {
    chips.push({
      type: 'minDiscount',
      label: `${activeFilters.minDiscount}%+ Discount`,
      icon: '💰'
    });
  }

  if (activeFilters.businessName) {
    chips.push({
      type: 'businessName',
      label: `🏢 ${activeFilters.businessName}`,
      icon: ''
    });
  }

  // Don't render if no active filters
  if (chips.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-gray-700 mr-2">Active Filters:</span>
        
        {chips.map((chip, index) => (
          <div
            key={`${chip.type}-${index}`}
            className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium border border-blue-200 hover:bg-blue-100 transition-colors"
          >
            {chip.icon && <span>{chip.icon}</span>}
            <span>{chip.label}</span>
            <button
              onClick={() => onRemoveFilter(chip.type)}
              className="ml-1 text-blue-600 hover:text-blue-800 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
              aria-label="Remove filter"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}

        {chips.length > 1 && (
          <button
            onClick={onClearAll}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full border border-red-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear All
          </button>
        )}
      </div>

      <div className="mt-2 text-xs text-gray-500">
        {chips.length} filter{chips.length !== 1 ? 's' : ''} applied
      </div>
    </div>
  );
}
