/**
 * Image utility functions for profile image upload feature
 */

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_FORMATS = new Set(['jpg', 'jpeg', 'png']);

export interface ImageFileInfo {
  base64: string; // Full data URL (data:image/jpeg;base64,...)
  format: string; // 'jpeg' or 'png'
  fileName: string;
  fileSize: number;
}

/**
 * Converts an image File to base64 data URL
 * Returns full data URL including prefix (data:image/jpeg;base64,...)
 */
export async function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      const result = reader.result as string;
      // Return full data URL for better-auth and backend API
      resolve(result);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read image file'));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Extracts image format from file name extension
 * Normalizes to 'jpeg' or 'png'
 */
export function getImageFormat(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  // Normalize format names
  if (extension === 'jpg' || extension === 'jpeg') return 'jpeg';
  if (extension === 'png') return 'png';
  return extension || 'jpeg'; // Default to jpeg
}

/**
 * Formats file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Validates image file format and size
 * Supports JPG and PNG formats only, max 2MB
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds ${formatFileSize(MAX_FILE_SIZE)} limit`,
    };
  }
  
  // Check file format
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  if (!ALLOWED_FORMATS.has(extension)) {
    return {
      valid: false,
      error: `Unsupported format. Allowed formats: JPG, PNG`,
    };
  }
  
  // Check MIME type if available
  if (file.type) {
    const isValidMimeType = 
      file.type === 'image/jpeg' || 
      file.type === 'image/jpg' || 
      file.type === 'image/png';
    
    if (!isValidMimeType && file.type !== 'application/octet-stream') {
      return {
        valid: false,
        error: 'File does not appear to be a valid image (JPG or PNG)',
      };
    }
  }
  
  return { valid: true };
}

/**
 * Processes an image file and returns the required format
 */
export async function processImageFile(file: File): Promise<ImageFileInfo> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid image file');
  }
  
  const base64 = await convertImageToBase64(file);
  const format = getImageFormat(file.name);
  
  return {
    base64, // Full data URL
    format,
    fileName: file.name,
    fileSize: file.size,
  };
}
