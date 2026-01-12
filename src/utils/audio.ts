/**
 * Audio utility functions for voice upload feature
 */

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FORMATS = ['wav', 'mp3', 'm4a', 'ogg', 'webm'];

export interface AudioFileInfo {
  base64: string;
  format: string;
  fileName: string;
  fileSize: number;
}

/**
 * Converts a File to base64 string
 */
export async function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix (e.g., "data:audio/wav;base64,")
      const base64 = result.split(',')[1] || result;
      resolve(base64);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Extracts audio format from file name extension
 */
export function getAudioFormat(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  // Normalize format names
  if (extension === 'm4a') return 'm4a';
  if (extension === 'webm') return 'webm';
  if (extension === 'ogg') return 'ogg';
  if (extension === 'mp3') return 'mp3';
  if (extension === 'wav') return 'wav';
  return extension || 'wav'; // Default to wav
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
 * Validates audio file format and size
 */
export function validateAudioFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds ${formatFileSize(MAX_FILE_SIZE)} limit`,
    };
  }
  
  // Check file format
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  if (!ALLOWED_FORMATS.includes(extension)) {
    return {
      valid: false,
      error: `Unsupported format. Allowed formats: ${ALLOWED_FORMATS.join(', ')}`,
    };
  }
  
  // Check MIME type if available
  if (file.type && !file.type.startsWith('audio/')) {
    // Some browsers might not set MIME type correctly, so we'll be lenient
    // but warn if it's clearly not an audio file
    if (file.type && !file.type.includes('audio') && file.type !== 'application/octet-stream') {
      return {
        valid: false,
        error: 'File does not appear to be an audio file',
      };
    }
  }
  
  return { valid: true };
}

/**
 * Processes an audio file and returns the required format
 */
export async function processAudioFile(file: File): Promise<AudioFileInfo> {
  const validation = validateAudioFile(file);
  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid audio file');
  }
  
  const base64 = await convertFileToBase64(file);
  const format = getAudioFormat(file.name);
  
  return {
    base64,
    format,
    fileName: file.name,
    fileSize: file.size,
  };
}
