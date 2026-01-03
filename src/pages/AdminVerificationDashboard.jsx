// src/pages/AdminVerificationDashboard.jsx
// Admin dashboard to review and approve/reject verification documents

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminVerificationDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [expiringVerifications, setExpiringVerifications] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewAction, setReviewAction] = useState(''); // 'approve' or 'reject'
  const [reviewNotes, setReviewNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [processingReview, setProcessingReview] = useState(false);

  useEffect(() => {
    loadPendingVerifications();
    loadExpiringVerifications();
  }, []);

  const loadPendingVerifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/v1/verification/admin/pending', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setPendingVerifications(data);
      }
    } catch (error) {
      console.error('Error loading pending verifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadExpiringVerifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/v1/verification/admin/expiring-soon?days=30', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setExpiringVerifications(data);
      }
    } catch (error) {
      console.error('Error loading expiring verifications:', error);
    }
  };

  const handleReviewDocument = async (documentId) => {
    if (!reviewAction) {
      alert('Please select an action');
      return;
    }

    if (reviewAction === 'reject' && !rejectionReason) {
      alert('Please provide a rejection reason');
      return;
    }

    setProcessingReview(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('action', reviewAction);
      if (reviewNotes) formData.append('notes', reviewNotes);
      if (rejectionReason) formData.append('rejection_reason', rejectionReason);

      const response = await fetch(
        `http://localhost:8000/api/v1/verification/admin/review/${documentId}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        }
      );

      if (response.ok) {
        alert(`✅ Document ${reviewAction === 'approve' ? 'approved' : 'rejected'} successfully!`);
        setShowReviewModal(false);
        setReviewAction('');
        setReviewNotes('');
        setRejectionReason('');
        setSelectedSubmission(null);
        
        // Reload pending verifications
        await loadPendingVerifications();
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (error) {
      console.error('Error reviewing document:', error);
      alert('Failed to process review');
    } finally {
      setProcessingReview(false);
    }
  };

  const openReviewModal = (submission, document, action) => {
    setSelectedSubmission({ ...submission, selectedDocument: document });
    setReviewAction(action);
    setShowReviewModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading verification dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:underline mb-2 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold">Verification Dashboard</h1>
          <p className="text-gray-600">Review and approve business verification submissions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Reviews</p>
                <p className="text-3xl font-bold text-blue-600">{pendingVerifications.length}</p>
              </div>
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Expiring Soon (30 days)</p>
                <p className="text-3xl font-bold text-orange-600">{expiringVerifications.length}</p>
              </div>
              <svg className="w-12 h-12 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Submissions</p>
                <p className="text-3xl font-bold text-green-600">
                  {pendingVerifications.reduce((sum, v) => sum + v.document_count, 0)}
                </p>
              </div>
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Pending Verifications */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Pending Verifications</h2>

          {pendingVerifications.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-600 text-lg">No pending verifications</p>
              <p className="text-gray-500 text-sm mt-2">All caught up! 🎉</p>
            </div>
          ) : (
            <div className="space-y-6">
              {pendingVerifications.map((submission) => (
                <div key={submission.business_id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                  
                  {/* Business Info */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{submission.business_name}</h3>
                      <p className="text-gray-600">{submission.business_email}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Submitted: {new Date(submission.submitted_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        submission.status === 'submitted' ? 'bg-blue-100 text-blue-700' :
                        submission.status === 'under_review' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {submission.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <p className="text-sm text-gray-600 mt-2">
                        {submission.document_count} / {submission.required_count} documents
                      </p>
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-700">Submitted Documents:</h4>
                    {submission.documents.map((doc) => (
                      <div key={doc.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                            </svg>
                            <div>
                              <p className="font-medium">{doc.type.replace('_', ' ').toUpperCase()}</p>
                              <p className="text-sm text-gray-500">{doc.file_name}</p>
                              <p className="text-xs text-gray-400">
                                Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <a
                              href={doc.document_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                              View PDF
                            </a>
                            <button
                              onClick={() => openReviewModal(submission, doc, 'approve')}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              ✓ Approve
                            </button>
                            <button
                              onClick={() => openReviewModal(submission, doc, 'reject')}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                              ✗ Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Expiring Soon */}
        {expiringVerifications.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Expiring Soon (Next 30 Days)</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Business</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Expires</th>
                    <th className="text-left py-3 px-4">Days Left</th>
                    <th className="text-left py-3 px-4">Verifications</th>
                  </tr>
                </thead>
                <tbody>
                  {expiringVerifications.map((business) => (
                    <tr key={business.business_id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{business.business_name}</td>
                      <td className="py-3 px-4 text-gray-600">{business.business_email}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(business.expires_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-sm font-semibold ${
                          business.days_until_expiry <= 7 ? 'bg-red-100 text-red-700' :
                          business.days_until_expiry <= 14 ? 'bg-orange-100 text-orange-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {business.days_until_expiry} days
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{business.verification_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">
              {reviewAction === 'approve' ? '✓ Approve Document' : '✗ Reject Document'}
            </h3>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="font-semibold">{selectedSubmission.business_name}</p>
              <p className="text-sm text-gray-600">{selectedSubmission.selectedDocument.type.replace('_', ' ').toUpperCase()}</p>
              <p className="text-sm text-gray-600">{selectedSubmission.selectedDocument.file_name}</p>
            </div>

            {reviewAction === 'reject' && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Rejection Reason *</label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                  rows="3"
                  placeholder="Explain why this document is being rejected..."
                  required
                />
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Additional Notes (Optional)</label>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Add any additional notes for the business owner..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleReviewDocument(selectedSubmission.selectedDocument.id)}
                disabled={processingReview}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
                  reviewAction === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                } disabled:bg-gray-400`}
              >
                {processingReview ? 'Processing...' : `Confirm ${reviewAction === 'approve' ? 'Approval' : 'Rejection'}`}
              </button>
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setReviewAction('');
                  setReviewNotes('');
                  setRejectionReason('');
                }}
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
