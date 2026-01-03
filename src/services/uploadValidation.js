// src/services/uploadValidation.js
// File validation and error handling for uploads

/**
 * Validation configuration
 */
export const uploadConfig = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  maxFiles: 5,
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
};

/**
 * Validate file size
 */
export const validateFileSize = (file) => {
  if (file.size > uploadConfig.maxFileSize) {
    throw new Error(
      `File "${file.name}" is too large. Maximum size is ${formatFileSize(uploadConfig.maxFileSize)}.`
    );
  }
  return true;
};

/**
 * Validate file type
 */
export const validateFileType = (file) => {
  if (!uploadConfig.allowedTypes.includes(file.type)) {
    throw new Error(
      `File "${file.name}" has invalid type. Allowed types: JPG, PNG, GIF, WebP.`
    );
  }
  return true;
};

/**
 * Validate image dimensions
 */
export const validateImageDimensions = async (file, minWidth = 200, minHeight = 200, maxWidth = 4000, maxHeight = 4000) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      
      if (img.width < minWidth || img.height < minHeight) {
        reject(new Error(
          `Image "${file.name}" is too small. Minimum dimensions: ${minWidth}x${minHeight}px.`
        ));
      } else if (img.width > maxWidth || img.height > maxHeight) {
        reject(new Error(
          `Image "${file.name}" is too large. Maximum dimensions: ${maxWidth}x${maxHeight}px.`
        ));
      } else {
        resolve({
          width: img.width,
          height: img.height,
          aspectRatio: img.width / img.height
        });
      }
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to load image "${file.name}".`));
    };
    
    img.src = url;
  });
};

/**
 * Validate all files
 */
export const validateFiles = async (files) => {
  const fileArray = Array.from(files);
  
  // Check number of files
  if (fileArray.length > uploadConfig.maxFiles) {
    throw new Error(`Maximum ${uploadConfig.maxFiles} files allowed.`);
  }
  
  // Validate each file
  const validations = fileArray.map(async (file) => {
    validateFileSize(file);
    validateFileType(file);
    const dimensions = await validateImageDimensions(file);
    return { file, dimensions };
  });
  
  return Promise.all(validations);
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Get file extension
 */
export const getFileExtension = (filename) => {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2).toLowerCase();
};

/**
 * Upload error handler
 */
export class UploadError extends Error {
  constructor(message, code = 'UPLOAD_ERROR', details = null) {
    super(message);
    this.name = 'UploadError';
    this.code = code;
    this.details = details;
  }
}

/**
 * Handle upload errors
 */
export const handleUploadError = (error) => {
  console.error('Upload error:', error);
  
  if (error instanceof UploadError) {
    return {
      message: error.message,
      code: error.code,
      details: error.details
    };
  }
  
  // Network errors
  if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
    return {
      message: 'Network error. Please check your connection and try again.',
      code: 'NETWORK_ERROR'
    };
  }
  
  // Cloudinary errors
  if (error.message?.includes('cloudinary')) {
    return {
      message: 'Upload service error. Please try again later.',
      code: 'SERVICE_ERROR'
    };
  }
  
  // Default error
  return {
    message: error.message || 'An unexpected error occurred during upload.',
    code: 'UNKNOWN_ERROR'
  };
};

/**
 * Create file preview
 */
export const createFilePreview = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      resolve({
        name: file.name,
        size: file.size,
        type: file.type,
        preview: e.target.result
      });
    };
    
    reader.onerror = () => {
      reject(new Error(`Failed to read file "${file.name}".`));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Progress indicator utility
 */
export class UploadProgress {
  constructor(total) {
    this.total = total;
    this.completed = 0;
    this.failed = 0;
    this.callbacks = [];
  }
  
  increment(success = true) {
    if (success) {
      this.completed++;
    } else {
      this.failed++;
    }
    this.notify();
  }
  
  getProgress() {
    return {
      total: this.total,
      completed: this.completed,
      failed: this.failed,
      percentage: Math.round(((this.completed + this.failed) / this.total) * 100)
    };
  }
  
  onProgress(callback) {
    this.callbacks.push(callback);
  }
  
  notify() {
    const progress = this.getProgress();
    this.callbacks.forEach(cb => cb(progress));
  }
  
  isComplete() {
    return (this.completed + this.failed) === this.total;
  }
}
