// src/components/MapViewToggle.jsx
// Toggle between map view and list view with radius filter

export default function MapViewToggle({ 
  viewMode, 
  onViewModeChange, 
  searchRadius, 
  onRadiusChange,
  showRadiusCircle,
  onToggleRadiusCircle
}) {
  const radiusOptions = [
    { value: 1, label: '1 km' },
    { value: 5, label: '5 km' },
    { value: 10, label: '10 km' },
    { value: 25, label: '25 km' },
    { value: 50, label: '50 km' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
      {/* View Mode Toggle */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          View Mode
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => onViewModeChange('list')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              List
            </div>
          </button>
          
          <button
            onClick={() => onViewModeChange('map')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'map'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Map
            </div>
          </button>
        </div>
      </div>

      {/* Radius Filter - Only show in map mode */}
      {viewMode === 'map' && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Search Radius
          </label>
          <div className="grid grid-cols-3 gap-2">
            {radiusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onRadiusChange(option.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  searchRadius === option.value
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Show Radius Circle Toggle */}
      {viewMode === 'map' && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Show radius circle
          </label>
          <button
            onClick={onToggleRadiusCircle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              showRadiusCircle ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                showRadiusCircle ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      )}

      {/* Info */}
      {viewMode === 'map' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-800">
            💡 <strong>Tip:</strong> Use the radius filter to find deals near your location. Enable "Show radius circle" to visualize the search area.
          </p>
        </div>
      )}
    </div>
  );
}
