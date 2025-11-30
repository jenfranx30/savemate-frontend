import { useState, useEffect } from 'react';

export default function ExternalDeals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/external/deals/slickdeals?limit=6');
      const data = await response.json();
      setDeals(data.deals || []);
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading deals...</div>;
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Hot Deals from Around the Web</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal, index) => (
            <div key={index} className="border rounded-lg p-4 hover:shadow-lg transition">
              <h3 className="font-bold text-lg mb-2 line-clamp-2">{deal.title}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{deal.description}</p>
              <a 
                href={deal.deal_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Deal →
              </a>
              <p className="text-xs text-gray-500 mt-2">Source: {deal.source}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}