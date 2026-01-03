// src/services/cloudinaryTransform.js
// Utility functions for Cloudinary image transformations

const CLOUD_NAME = 'dk4rzbeyr';

/**
 * Generate optimized image URL with transformations
 * @param {string} publicId - Cloudinary public ID
 * @param {object} options - Transformation options
 * @returns {string} Transformed image URL
 */
export const getOptimizedImageUrl = (publicId, options = {}) => {
  if (!publicId) return null;
  
  const {
    width = 'auto',
    height = 'auto',
    crop = 'limit',
    quality = 'auto',
    format = 'auto',
    gravity = 'auto',
    effect = null
  } = options;

  const transformations = [];
  
  // Size transformation
  if (width !== 'auto' || height !== 'auto') {
    transformations.push(`w_${width},h_${height},c_${crop},g_${gravity}`);
  }
  
  // Quality and format
  transformations.push(`q_${quality},f_${format}`);
  
  // Effects
  if (effect) {
    transformations.push(`e_${effect}`);
  }

  const transformString = transformations.join('/');
  
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformString}/${publicId}`;
};

/**
 * Generate thumbnail URL
 */
export const getThumbnailUrl = (publicId, size = 200) => {
  return getOptimizedImageUrl(publicId, {
    width: size,
    height: size,
    crop: 'fill',
    gravity: 'auto'
  });
};

/**
 * Generate responsive image srcset
 */
export const getResponsiveSrcSet = (publicId) => {
  const sizes = [320, 640, 768, 1024, 1280, 1920];
  
  return sizes
    .map(size => {
      const url = getOptimizedImageUrl(publicId, { width: size });
      return `${url} ${size}w`;
    })
    .join(', ');
};

/**
 * Generate image with effects
 */
export const getImageWithEffect = (publicId, effect) => {
  return getOptimizedImageUrl(publicId, { effect });
};

/**
 * Common transformation presets
 */
export const imagePresets = {
  dealCard: (publicId) => getOptimizedImageUrl(publicId, {
    width: 400,
    height: 300,
    crop: 'fill',
    gravity: 'auto'
  }),
  
  dealHero: (publicId) => getOptimizedImageUrl(publicId, {
    width: 1200,
    height: 600,
    crop: 'fill',
    gravity: 'auto'
  }),
  
  businessLogo: (publicId) => getOptimizedImageUrl(publicId, {
    width: 200,
    height: 200,
    crop: 'fill',
    gravity: 'face'
  }),
  
  profilePicture: (publicId) => getOptimizedImageUrl(publicId, {
    width: 150,
    height: 150,
    crop: 'fill',
    gravity: 'face',
    effect: 'sharpen:100'
  }),
  
  thumbnail: (publicId) => getThumbnailUrl(publicId, 150)
};

/**
 * Extract public ID from Cloudinary URL
 */
export const extractPublicId = (url) => {
  if (!url) return null;
  
  // Match pattern: https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{public_id}
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-z]+)?$/i);
  return match ? match[1] : null;
};

/**
 * Validate if URL is a Cloudinary URL
 */
export const isCloudinaryUrl = (url) => {
  return url && url.includes('res.cloudinary.com');
};
