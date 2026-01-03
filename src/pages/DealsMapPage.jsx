// src/pages/DealsMapPage.jsx
// Complete page integrating map, location search, and deals

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import DealsMap from '../components/DealsMap';
import LocationSearch from '../components/LocationSearch';
import MapViewToggle from '../components/MapViewToggle';

export default function DealsMapPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'
  const [userLocation, setUserLocation] = useState(null);
  const [searchRadius, setSearchRadius] = useState(5); // in km
  const [showRadiusCircle, setShowRadiusCircle] = useState(true);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load deals from your API
  useEffect(() => {
    loadDeals();
    // Try to get user's location on mount
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const loadDeals = async () => {
    setLoading(true);
    try {
      // Replace with your actual API endpoint
      const response = await fetch('http://localhost:8000/api/v1/deals');
      const data = await response.json();
      
      // Add mock coordinates for testing (replace with real data from your backend)
      const dealsWithCoords = data.deals.map(deal => ({
        ...deal,
        // TODO: Get these from your database
        latitude: deal.latitude || (52.2297 + (Math.random() - 0.5) * 0.1),
        longitude: deal.longitude || (21.0122 + (Math.random() - 0.5) * 0.1)
      }));
      
      setDeals(dealsWithCoords);
    } catch (error) {
      console.error('Error loading deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (location) => {
    setUserLocation({
      lat: location.lat,
      lng: location.lng
    });
  };

  const handleDealClick = (deal) => {
    navigate(`/deals/${deal.id}`);
  };

  // Calculate distance for list view
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Filter and sort deals by distance
  const filteredDeals = deals
    .filter(deal => {
      if (!deal.latitude || !deal.longitude) return false;
      if (userLocation && searchRadius) {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          deal.latitude,
          deal.longitude
        );
        return distance <= searchRadius;
      }
      return true;
    })
    .map(deal => ({
      ...deal,
      distance: userLocation 
        ? calculateDistance(
            userLocation.lat,
            userLocation.lng,
            deal.latitude,
            deal.longitude
          )
        : null
    }))
    .sort((a, b) => {
      if (a.distance && b.distance) {
        return a.distance - b.distance;
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">🗺️ Find Deals Near You</h1>
          <p className="text-blue-100">
            Discover amazing local deals on an interactive map
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-80 space-y-4">
            {/* Location Search */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                📍 Location
              </h2>
              <LocationSearch 
                onLocationSelect={handleLocationSelect}
                currentLocation={userLocation}
              />
              {userLocation && (
                <p className="text-xs text-gray-600 mt-2">
                  ✓ Location set
                </p>
              )}
            </div>

            {/* View Toggle & Radius */}
            <MapViewToggle
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              searchRadius={searchRadius}
              onRadiusChange={setSearchRadius}
              showRadiusCircle={showRadiusCircle}
              onToggleRadiusCircle={() => setShowRadiusCircle(!showRadiusCircle)}
            />

            {/* Stats */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600 mb-1">
                  {filteredDeals.length}
                </p>
                <p className="text-sm text-gray-600">
                  Deals found within {searchRadius}km
                </p>
              </div>
            </div>
          </aside>

          {/* Main View Area */}
          <main className="flex-1">
            {loading ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading deals...</p>
              </div>
            ) : viewMode === 'map' ? (
              <div className="h-[600px]">
                <DealsMap
                  deals={filteredDeals}
                  onDealClick={handleDealClick}
                  userLocation={userLocation}
                  searchRadius={searchRadius}
                  showRadiusCircle={showRadiusCircle}
                />
              </div>
            ) : (
              /* List View */
              <div className="space-y-4">
                {filteredDeals.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <p className="text-gray-500 text-lg mb-4">
                      No deals found in your area
                    </p>
                    <button
                      onClick={() => setSearchRadius(searchRadius * 2)}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Expand search radius
                    </button>
                  </div>
                ) : (
                  filteredDeals.map((deal) => (
                    <div
                      key={deal.id}
                      onClick={() => handleDealClick(deal)}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    >
                      <div className="flex flex-col sm:flex-row">
                        {/* Image */}
                        {deal.image_url && (
                          <div className="sm:w-48 h-48 sm:h-auto">
                            <img
                              src={deal.image_url}
                              alt={deal.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        {/* Content */}
                        <div className="flex-1 p-6">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-xl font-bold text-gray-900">
                              {deal.title}
                            </h3>
                            {deal.discount_percentage && (
                              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold ml-4">
                                {deal.discount_percentage}% OFF
                              </span>
                            )}
                          </div>

                          {deal.businessName && (
                            <p className="text-gray-600 mb-2">
                              🏢 {deal.businessName}
                            </p>
                          )}

                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            {deal.location && (
                              <span>📍 {deal.location}</span>
                            )}
                            {deal.distance && (
                              <span className="font-semibold text-blue-600">
                                🚶 {deal.distance.toFixed(1)} km away
                              </span>
                            )}
                          </div>

                          {deal.discountedPrice && (
                            <div className="flex items-baseline gap-3 mb-3">
                              <span className="text-2xl font-bold text-green-600">
                                {deal.discountedPrice} zł
                              </span>
                              {deal.originalPrice && (
                                <span className="text-gray-400 line-through">
                                  {deal.originalPrice} zł
                                </span>
                              )}
                            </div>
                          )}

                          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                            View Deal →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
