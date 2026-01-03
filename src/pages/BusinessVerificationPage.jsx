// src/pages/BusinessVerificationPage.jsx
// Business owner verification page - upload documents

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function BusinessVerificationPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [businessId, setBusinessId] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState({
    business_license: null,
    tax_id: null
  });

  useEffect(() => {
    loadVerificationStatus();
  }, []);

  const loadVerificationStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Get business ID first
      const businessResponse = await fetch('http://localhost:8000/api/v1/businesses/owner/me/businesses', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (businessResponse.ok) {
        const businesses = await businessResponse.json();
        if (businesses.length > 0) {
          const business = businesses[0];
          setBusinessId(business._id || business.id);
          
          // Get verification status
          const statusResponse = await fetch(
            `http://localhost:8000/api/v1/verification/my-verification-status?business_id=${business._id || business.id}`,
            {
              headers: { 'Authorization': `Bearer ${token}` }
            }
          );
          
          if (statusResponse.ok) {
            const status = await statusResponse.json();
            setVerificationStatus(status);
          }
        }
      }
    } catch (error) {
      console.error('Error loading verification status:', error);
    }
  };

  const handleFileSelect = (documentType, file) => {
    // Validate file type (PDF only)
    if (file.type !== 'application/pdf') {
      alert('Only PDF files are allowed');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size must be less than 10MB');
      return;
    }

    setSelectedFiles(prev => ({
      ...prev,
      [documentType]: file
    }));
  };

  const handleUpload = async (documentType) => {
    const file = selectedFiles[documentType];
    if (!file || !businessId) return;

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('business_id', businessId);
      formData.append('document_type', documentType);
      formData.append('file', file);

      const response = await fetch('http://localhost:8000/api/v1/verification/upload-document', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        alert('✅ Document uploaded successfully!');
        
        // Clear selected file
        setSelectedFiles(prev => ({
          ...prev,
          [documentType]: null
        }));
        
        // Reload verification status
        await loadVerificationStatus();
      } else {
        const error = await response.json();
        alert(`Upload failed: ${error.detail}`);
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Failed to upload document');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Pending' },
      submitted: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Submitted' },
      under_review: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Under Review' },
      approved: { bg: 'bg-green-100', text: 'text-green-700', label: '✓ Approved' },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', label: '✗ Rejected' },
      expired: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Expired' }
    };

    const badge = badges[status] || badges.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const getDaysUntilExpiry = (expiryDate) => {
    if (!expiryDate) return null;
    const days = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    return days;
  };

  if (!verificationStatus) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading verification status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        
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
          <h1 className="text-3xl font-bold">Business Verification</h1>
          <p className="text-gray-600">Upload required documents to verify your business account</p>
        </div>

        {/* Verification Status Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Verification Status</h2>
            {getStatusBadge(verificationStatus.overall_status)}
          </div>

          {verificationStatus.verified ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold">Your business is verified!</span>
              </div>
              
              {verificationStatus.verified_at && (
                <p className="text-gray-600">
                  Verified on: {new Date(verificationStatus.verified_at).toLocaleDateString()}
                </p>
              )}
              
              {verificationStatus.verification_expires_at && (
                <div>
                  <p className="text-gray-600">
                    Expires on: {new Date(verificationStatus.verification_expires_at).toLocaleDateString()}
                  </p>
                  {verificationStatus.needs_resubmission && (
                    <p className="text-orange-600 font-semibold mt-2">
                      ⚠️ Your verification expires in {getDaysUntilExpiry(verificationStatus.verification_expires_at)} days. Please resubmit documents soon.
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {verificationStatus.overall_status === 'rejected' ? (
                <div className="text-red-600">
                  <p className="font-semibold">❌ Verification was rejected</p>
                  <p className="text-sm mt-2">Please review the feedback below and resubmit your documents.</p>
                </div>
              ) : verificationStatus.overall_status === 'submitted' || verificationStatus.overall_status === 'under_review' ? (
                <div className="text-blue-600">
                  <p className="font-semibold">📋 Documents under review</p>
                  <p className="text-sm mt-2">Our team is reviewing your submission. This usually takes 1-2 business days.</p>
                </div>
              ) : (
                <div className="text-gray-600">
                  <p className="font-semibold">📄 Please upload required documents</p>
                  <p className="text-sm mt-2">Upload all required documents to complete your verification.</p>
                </div>
              )}
            </div>
          )}

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Documents Submitted</span>
              <span className="font-semibold">
                {verificationStatus.documents.length} / {verificationStatus.required_documents.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(verificationStatus.documents.length / verificationStatus.required_documents.length) * 100}%`
                }}
              />
            </div>
          </div>
        </div>

        {/* Required Documents */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-6">Required Documents</h2>

          {/* Business License */}
          <div className="mb-8 pb-8 border-b">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">Business License</h3>
                <p className="text-sm text-gray-600">Upload your official business registration or license (PDF only, max 10MB)</p>
              </div>
            </div>

            {/* Existing document */}
            {verificationStatus.documents.filter(d => d.type === 'business_license').map(doc => (
              <div key={doc.id} className="bg-gray-50 rounded-lg p-4 mb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                    </svg>
                    <div>
                      <p className="font-medium">{doc.file_name}</p>
                      <p className="text-sm text-gray-500">
                        Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(doc.status)}
                    <a
                      href={doc.document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View
                    </a>
                  </div>
                </div>
                
                {doc.rejection_reason && (
                  <div className="mt-3 p-3 bg-red-50 rounded border border-red-200">
                    <p className="text-sm font-semibold text-red-800">Rejection Reason:</p>
                    <p className="text-sm text-red-700 mt-1">{doc.rejection_reason}</p>
                  </div>
                )}
                
                {doc.admin_notes && (
                  <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                    <p className="text-sm font-semibold text-blue-800">Admin Notes:</p>
                    <p className="text-sm text-blue-700 mt-1">{doc.admin_notes}</p>
                  </div>
                )}
              </div>
            ))}

            {/* Upload new */}
            <div>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => handleFileSelect('business_license', e.target.files[0])}
                className="hidden"
                id="business_license_input"
              />
              
              {selectedFiles.business_license ? (
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-blue-50 rounded-lg p-4">
                    <p className="font-medium">{selectedFiles.business_license.name}</p>
                    <p className="text-sm text-gray-600">
                      {(selectedFiles.business_license.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => handleUpload('business_license')}
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {loading ? 'Uploading...' : 'Upload'}
                  </button>
                  <button
                    onClick={() => setSelectedFiles(prev => ({ ...prev, business_license: null }))}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="business_license_input"
                  className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
                >
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-gray-600 font-medium">Click to upload Business License</p>
                  <p className="text-sm text-gray-500 mt-1">PDF only, max 10MB</p>
                </label>
              )}
            </div>
          </div>

          {/* Tax ID */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">Tax ID / VAT Certificate</h3>
                <p className="text-sm text-gray-600">Upload your tax identification document (PDF only, max 10MB)</p>
              </div>
            </div>

            {/* Existing document */}
            {verificationStatus.documents.filter(d => d.type === 'tax_id').map(doc => (
              <div key={doc.id} className="bg-gray-50 rounded-lg p-4 mb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                    </svg>
                    <div>
                      <p className="font-medium">{doc.file_name}</p>
                      <p className="text-sm text-gray-500">
                        Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(doc.status)}
                    <a
                      href={doc.document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View
                    </a>
                  </div>
                </div>
                
                {doc.rejection_reason && (
                  <div className="mt-3 p-3 bg-red-50 rounded border border-red-200">
                    <p className="text-sm font-semibold text-red-800">Rejection Reason:</p>
                    <p className="text-sm text-red-700 mt-1">{doc.rejection_reason}</p>
                  </div>
                )}
                
                {doc.admin_notes && (
                  <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                    <p className="text-sm font-semibold text-blue-800">Admin Notes:</p>
                    <p className="text-sm text-blue-700 mt-1">{doc.admin_notes}</p>
                  </div>
                )}
              </div>
            ))}

            {/* Upload new */}
            <div>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => handleFileSelect('tax_id', e.target.files[0])}
                className="hidden"
                id="tax_id_input"
              />
              
              {selectedFiles.tax_id ? (
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-blue-50 rounded-lg p-4">
                    <p className="font-medium">{selectedFiles.tax_id.name}</p>
                    <p className="text-sm text-gray-600">
                      {(selectedFiles.tax_id.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => handleUpload('tax_id')}
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {loading ? 'Uploading...' : 'Upload'}
                  </button>
                  <button
                    onClick={() => setSelectedFiles(prev => ({ ...prev, tax_id: null }))}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="tax_id_input"
                  className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
                >
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-gray-600 font-medium">Click to upload Tax ID</p>
                  <p className="text-sm text-gray-500 mt-1">PDF only, max 10MB</p>
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Help Card */}
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">📌 Important Notes</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• All documents must be in PDF format and under 10MB</li>
            <li>• Documents should be clear and legible</li>
            <li>• Verification typically takes 1-2 business days</li>
            <li>• Your verification is valid for 90 days</li>
            <li>• You'll receive email notifications about your verification status</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
