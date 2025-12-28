import { supabase } from './supabase';

export interface UploadResult {
  url: string;
  error?: string;
}

/**
 * Upload image to Supabase Storage and optimize it
 */
export async function uploadImage(
  file: File,
  folder: string = 'products'
): Promise<UploadResult> {
  try {
    // Validate file
    if (!file || file.size === 0) {
      return { url: '', error: 'Invalid file' };
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    console.log('Uploading image:', { fileName, filePath, size: file.size });

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      // Check if error is due to bucket not existing or permission issues
      if (error.message.includes('Bucket') || error.message.includes('not found')) {
        return { url: '', error: 'Storage bucket not found. Please create "product-images" bucket in Supabase Storage.' };
      }
      if (error.message.includes('new row violates') || error.message.includes('policy')) {
        return { url: '', error: 'Permission denied. Please check storage policies.' };
      }
      return { url: '', error: error.message || 'Upload failed' };
    }

    if (!data) {
      console.error('Upload failed: No data returned');
      return { url: '', error: 'Upload failed: No data returned' };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    console.log('Image uploaded successfully:', publicUrl);

    if (!publicUrl) {
      return { url: '', error: 'Failed to get public URL' };
    }

    return { url: publicUrl };
  } catch (error) {
    console.error('Error uploading image:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload image';
    return { url: '', error: errorMessage };
  }
}

/**
 * Upload multiple images
 */
export async function uploadMultipleImages(
  files: File[],
  folder: string = 'products'
): Promise<UploadResult[]> {
  const uploadPromises = files.map(file => uploadImage(file, folder));
  return Promise.all(uploadPromises);
}

/**
 * Delete image from Supabase Storage
 */
export async function deleteImage(filePath: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from('product-images')
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}

