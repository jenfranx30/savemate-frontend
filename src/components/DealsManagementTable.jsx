// src/components/DealsManagementTable.jsx


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DealsManagementTable({ deals, onRefresh }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all'); // all, active, inactive, expired
  const [sortBy, setSortBy] = useState('created_at'); // created_at, title, views, saves
  const [sortOrder, setSortOrder] = useState('desc'); // asc, desc
  const [searchTerm, setSearchTerm] = useState('');

  // Filter deals
  const filteredDeals = deals.filter(deal => {
    // Status filter
    if (filter !== 'all' && deal.status !== filter) return false;
    
    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        deal.title?.toLowerCase().includes(search) ||
        deal.category?.toLowerCase().includes(search) ||
        deal.business_name?.toLowerCase().includes(search)
      );
    }
    
    return true;
  });

  // Sort deals
  const sortedDeals = [...filteredDeals].sort((a, b) => {
    let aVal, bVal;
    
    switch (sortBy) {
      case 'title':
        aVal = a.title?.toLowerCase() || '';
        bVal = b.title?.toLowerCase() || '';
        break;
      case 'views':
        aVal = a.views_count || 0;
        bVal = b.views_count || 0;
        break;
      case 'saves':
        aVal = a.saves_count || 0;
        bVal = b.saves_count || 0;
        break;
      case 'price':
        aVal = a.discounted_price || 0;
        bVal = b.discounted_price || 0;
        break;
      case 'discount':
        aVal = a.discount_percentage || 0;
        bVal = b.discount_percentage || 0;
        break;
      default: // created_at
        aVal = new Date(a.created_at || 0);
        bVal = new Date(b.created_at || 0);
    }
    
    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const handleDelete = async (dealId) => {
    if (!confirm('Are you sure you want to delete this deal?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/v1/deals/${dealId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        alert('Deal deleted successfully!');
        onRefresh();
      } else {
        alert('Failed to delete deal');
      }
    } catch (error) {
      console.error('Error deleting deal:', error);
      alert('Error deleting deal');
    }
  };

  const handleToggleStatus = async (deal) => {
    const newStatus = deal.status === 'active' ? 'inactive' : 'active';
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/v1/deals/${deal.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        alert(`Deal ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`);
        onRefresh();
      } else {
        alert('Failed to update deal status');
      }
    } catch (error) {
      console.error('Error updating deal:', error);
      alert('Error updating deal');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      expired: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return badges[status] || badges.inactive;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Deals Management</h2>
          <button
            onClick={() => navigate('/business/post-deal')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
          >
            <span>+</span> New Deal
          </button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[300px]">
            <input
              type="text"
              placeholder="Search deals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="expired">Expired</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="created_at">Date Created</option>
            <option value="title">Title</option>
            <option value="views">Views</option>
            <option value="saves">Saves</option>
            <option value="price">Price</option>
            <option value="discount">Discount</option>
          </select>

          {/* Sort Order */}
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
          >
            {sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stats</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedDeals.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  {searchTerm ? 'No deals match your search' : 'No deals found'}
                </td>
              </tr>
            ) : (
              sortedDeals.map((deal) => (
                <tr key={deal.id} className="hover:bg-gray-50">
                  {/* Deal Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {deal.image_url && (
                        <img
                          src={deal.image_url}
                          alt={deal.title}
                          className="w-12 h-12 rounded object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{deal.title}</p>
                        <p className="text-sm text-gray-500">{deal.category}</p>
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{deal.discounted_price} zł</p>
                      <p className="text-sm text-gray-500 line-through">{deal.original_price} zł</p>
                    </div>
                  </td>

                  {/* Discount */}
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {deal.discount_percentage}% OFF
                    </span>
                  </td>

                  {/* Stats */}
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="text-gray-900">👁️ {deal.views_count || 0} views</p>
                      <p className="text-gray-500">⭐ {deal.saves_count || 0} saves</p>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(deal.status)}`}>
                      {deal.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/deals/${deal.id}`)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        title="View"
                      >
                        View
                      </button>
                      <button
                        onClick={() => navigate(`/business/edit-deal/${deal.id}`)}
                        className="text-green-600 hover:text-green-800 font-medium text-sm"
                        title="Edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(deal)}
                        className="text-yellow-600 hover:text-yellow-800 font-medium text-sm"
                        title={deal.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        {deal.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDelete(deal.id)}
                        className="text-red-600 hover:text-red-800 font-medium text-sm"
                        title="Delete"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <p className="text-sm text-gray-600">
          Showing {sortedDeals.length} of {deals.length} deals
        </p>
      </div>
    </div>
  );
}
