// src/components/DealsMap.jsx
// Interactive map without react-leaflet-cluster (React 18 compatible)

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom business marker icon
const businessIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// User location marker icon
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to update map view
function MapUpdater({ center, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  
  return null;
}

export default function DealsMap({ 
  deals, 
  onDealClick, 
  userLocation, 
  searchRadius = 5,
  showRadiusCircle = false 
}) {
  const [mapCenter, setMapCenter] = useState([52.2297, 21.0122]); // Warsaw
  const [mapZoom, setMapZoom] = useState(12);

  useEffect(() => {
    if (userLocation) {
      setMapCenter([userLocation.lat, userLocation.lng]);
      setMapZoom(13);
    }
  }, [userLocation]);

  // Calculate distance
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

  // Filter deals by radius
  const filteredDeals = deals.filter(deal => {
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
  });

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ width: '100%', height: '100%', minHeight: '400px' }}
        className="rounded-lg shadow-md z-0"
      >
        <MapUpdater center={mapCenter} zoom={mapZoom} />
        
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* User location */}
        {userLocation && (
          <>
            <Marker 
              position={[userLocation.lat, userLocation.lng]} 
              icon={userIcon}
            >
              <Popup>
                <div className="text-center">
                  <p className="font-semibold">📍 Your Location</p>
                  <p className="text-xs text-gray-600">You are here</p>
                </div>
              </Popup>
            </Marker>
            
            {showRadiusCircle && (
              <Circle
                center={[userLocation.lat, userLocation.lng]}
                radius={searchRadius * 1000}
                pathOptions={{
                  color: '#3b82f6',
                  fillColor: '#3b82f6',
                  fillOpacity: 0.1,
                  weight: 2
                }}
              />
            )}
          </>
        )}

        {/* Deal markers */}
        {filteredDeals.map((deal) => {
          const distance = userLocation 
            ? calculateDistance(
                userLocation.lat,
                userLocation.lng,
                deal.latitude,
                deal.longitude
              ).toFixed(1)
            : null;

          return (
            <Marker
              key={deal.id}
              position={[deal.latitude, deal.longitude]}
              icon={businessIcon}
              eventHandlers={{
                click: () => onDealClick && onDealClick(deal)
              }}
            >
              <Popup>
                <div className="min-w-[200px]">
                  {deal.image_url && (
                    <img
                      src={deal.image_url}
                      alt={deal.title}
                      className="w-full h-32 object-cover rounded-t-lg mb-2"
                    />
                  )}
                  
                  <h3 className="font-bold text-gray-900 mb-1">{deal.title}</h3>
                  
                  {deal.businessName && (
                    <p className="text-sm text-gray-600 mb-1">
                      🏢 {deal.businessName}
                    </p>
                  )}
                  
                  {deal.location && (
                    <p className="text-sm text-gray-600 mb-2">
                      📍 {deal.location}
                    </p>
                  )}
                  
                  {distance && (
                    <p className="text-sm font-semibold text-blue-600 mb-2">
                      🚶 {distance} km away
                    </p>
                  )}
                  
                  {deal.discount_percentage && (
                    <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-bold mb-2">
                      💰 {deal.discount_percentage}% OFF
                    </div>
                  )}
                  
                  {deal.discountedPrice && (
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-lg font-bold text-green-600">
                        {deal.discountedPrice} zł
                      </span>
                      {deal.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          {deal.originalPrice} zł
                        </span>
                      )}
                    </div>
                  )}
                  
                  <button
                    onClick={() => onDealClick && onDealClick(deal)}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
                  >
                    View Deal →
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md z-[1000] text-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          <span className="text-gray-700">Your Location</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          <span className="text-gray-700">Business Deals</span>
        </div>
        {filteredDeals.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="font-semibold text-gray-900">
              {filteredDeals.length} deal{filteredDeals.length !== 1 ? 's' : ''} shown
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
