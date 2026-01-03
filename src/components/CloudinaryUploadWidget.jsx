// src/components/CloudinaryUploadWidget.jsx


import { useState, useRef } from 'react';
import { validateFiles, handleUploadError } from '../services/uploadValidation';

export default function CloudinaryUploadWidget({ 
  onUploadSuccess, 
  onUploadError,
  folder = "deals",
  maxFiles = 5,
  currentImages = []
}) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewImages, setPreviewImages] = useState(currentImages);
  const fileInputRef = useRef(null);

  const cloudName = 'dk4rzbeyr';
  const uploadPreset = 'savemate_upload_preset';

  // Upload to Cloudinary with unsigned upload (no signature needed)
  const uploadToCloudinary = async (file) => {
    try {
      console.log('📤 Starting upload to Cloudinary...');
      
      // Create form data for unsigned upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      formData.append('folder', folder);

      console.log('📋 Upload details:', {
        cloudName,
        uploadPreset,
        folder,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });

      // Upload directly to Cloudinary (unsigned)
      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({}));
        console.error('❌ Upload failed:', errorData);
        throw new Error(errorData.error?.message || 'Upload failed');
      }

      const result = await uploadResponse.json();
      console.log('✅ Upload successful:', result);
      
      return result;

    } catch (error) {
      console.error('❌ Upload error:', error);
      throw error;
    }
  };

  // Handle file upload
  const handleFileUpload = async (files) => {
    if (previewImages.length + files.length > maxFiles) {
      alert(`Maximum ${maxFiles} images allowed`);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      console.log('🔍 Validating files...');
      
      // Validate files
      await validateFiles(files);
      console.log('✅ Files validated');

      const uploadPromises = Array.from(files).map(async (file, index) => {
        console.log(`📤 Uploading file ${index + 1}/${files.length}: ${file.name}`);
        
        // Create preview
        const preview = URL.createObjectURL(file);
        setPreviewImages(prev => [...prev, { url: preview, uploading: true, name: file.name }]);

        try {
          // Upload file
          const result = await uploadToCloudinary(file);

          // Update progress
          const progress = ((index + 1) / files.length) * 100;
          setUploadProgress(progress);
          console.log(`📊 Progress: ${Math.round(progress)}%`);

          return {
            url: result.secure_url,
            public_id: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format
          };
        } catch (error) {
          console.error(`❌ Failed to upload ${file.name}:`, error);
          throw error;
        }
      });

      const uploadedImages = await Promise.all(uploadPromises);
      console.log('✅ All uploads complete:', uploadedImages);

      // Update previews with actual URLs
      setPreviewImages(prev => 
        prev.filter(img => !img.uploading).concat(uploadedImages)
      );

      // Callback with uploaded images
      if (onUploadSuccess) {
        onUploadSuccess(uploadedImages);
      }

      alert(`✅ Successfully uploaded ${uploadedImages.length} image(s)!`);

    } catch (error) {
      console.error('❌ Upload process error:', error);
      const errorInfo = handleUploadError(error);
      
      if (onUploadError) {
        onUploadError(error);
      }
      
      alert(`Upload failed: ${errorInfo.message}`);
      
      // Remove failed uploads from preview
      setPreviewImages(prev => prev.filter(img => !img.uploading));
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files);
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = previewImages.filter((_, i) => i !== index);
    setPreviewImages(updatedImages);
    
    // Notify parent component
    if (onUploadSuccess) {
      onUploadSuccess(updatedImages);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-blue-400'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />

        <div className="space-y-4">
          <div className="text-6xl">📸</div>
          <div>
            <p className="text-lg font-semibold text-gray-700 mb-2">
              Drag and drop images here
            </p>
            <p className="text-sm text-gray-500 mb-4">
              or click to browse (max {maxFiles} images, 5MB each)
            </p>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {uploading ? 'Uploading...' : 'Choose Images'}
          </button>

          <p className="text-xs text-gray-400 mt-2">
            Supported: JPG, PNG, GIF, WebP
          </p>
        </div>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Uploading...</span>
            <span className="text-blue-600 font-semibold">{Math.round(uploadProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Image Previews */}
      {previewImages.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-700">
            Uploaded Images ({previewImages.length}/{maxFiles})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {previewImages.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image.url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                {image.uploading ? (
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    title="Remove image"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
