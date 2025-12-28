'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { uploadImage } from '@/lib/imageUpload';
import * as XLSX from 'xlsx';

interface ExcelRow {
  ProductName?: string;
  Category?: string;
  Price?: string | number;
  'Short Description'?: string;
  'Long Description'?: string;
  'Quantity Range 1'?: string | number;
  'Discount 1 (£)'?: string | number;
  'Price Per Unit 1 (£)'?: string | number;
  'Quantity Range 2'?: string | number;
  'Discount 2 (£)'?: string | number;
  'Price Per Unit 2 (£)'?: string | number;
  'Image Path'?: string;
}

const BRAND_NAMES = [
  'Ami Eyes', 'Eyebella', 'Flawless', 'Hyaron', 'Jalupro', 'Juvederm',
  'Lemon Bottle', 'Lumi', 'Lumi Eyes', 'Luxfill', 'NanoImpact 8', 'Neuramis',
  'Nucleofill', 'Plinest', 'Profhilo', 'Pure', 'Regenovue', 'Revitrane',
  'Revolax', 'Revs Pro', 'Seventy Hyal', 'Stylage', 'Teoxane', 'Vitaran'
];

function detectBrandFromProductName(productName: string): string | null {
  if (!productName) return null;
  
  const productNameLower = productName.toLowerCase();
  
  // Check if any brand name is contained in the product name
  for (const brand of BRAND_NAMES) {
    if (productNameLower.includes(brand.toLowerCase())) {
      return brand;
    }
  }
  
  return null;
}

function calculateDiscountPercentage(originalPrice: number, discountedPrice: number): number {
  if (!originalPrice || originalPrice === 0) return 0;
  const discount = originalPrice - discountedPrice;
  return (discount / originalPrice) * 100;
}

// Helper function to normalize product name for image matching
function normalizeForImageMatch(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')  // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '')  // Remove special characters except hyphens
    .replace(/-+/g, '-')  // Replace multiple hyphens with single
    .replace(/^-|-$/g, '');  // Remove leading/trailing hyphens
}

// Helper function to get image filename without extension for matching
function getImageNameWithoutExt(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/\.[^/.]+$/, '')  // Remove extension
    .replace(/\s+/g, '-')  // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '')  // Remove special characters
    .replace(/-+/g, '-')  // Replace multiple hyphens with single
    .replace(/^-|-$/g, '');  // Remove leading/trailing hyphens
}

// Match product name to image file
function findMatchingImage(productName: string, imageFiles: File[]): File | null {
  const normalizedProductName = normalizeForImageMatch(productName);
  
  for (const imageFile of imageFiles) {
    const imageName = getImageNameWithoutExt(imageFile.name);
    if (imageName === normalizedProductName) {
      return imageFile;
    }
  }
  
  return null;
}

export default function BulkUploadProducts({ onComplete }: { onComplete?: () => void }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number; stage?: string }>({ current: 0, total: 0 });
  const [errors, setErrors] = useState<string[]>([]);
  const [successCount, setSuccessCount] = useState(0);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const handleImageFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setImageFiles(files);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setErrors([]);
    setSuccessCount(0);
    setIsUploading(true);

    try {
      // Process all Excel files and combine data
      let allProducts: ExcelRow[] = [];
      const fileErrors: string[] = [];

      setUploadProgress({ current: 0, total: files.length, stage: 'Reading Excel files...' });

      for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
        const file = files[fileIndex];
        setUploadProgress({ 
          current: fileIndex + 1, 
          total: files.length, 
          stage: `Reading file ${fileIndex + 1}/${files.length}: ${file.name}...` 
        });

        try {
          const data = await file.arrayBuffer();
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData: ExcelRow[] = XLSX.utils.sheet_to_json(firstSheet);
          
          if (jsonData.length === 0) {
            fileErrors.push(`File "${file.name}" is empty`);
          } else {
            allProducts = allProducts.concat(jsonData);
          }
        } catch (error) {
          fileErrors.push(`Failed to read file "${file.name}": ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      if (allProducts.length === 0) {
        setErrors(fileErrors.length > 0 ? fileErrors : ['No products found in any Excel files']);
        setIsUploading(false);
        return;
      }

      const jsonData = allProducts;

      // Add file reading errors to error list if any
      const errorList: string[] = [];
      if (fileErrors.length > 0) {
        errorList.push(...fileErrors);
      }

      setUploadProgress({ current: 0, total: jsonData.length, stage: 'Processing products...' });

      // Load categories and brands
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('id, name');
      
      const { data: brandsData } = await supabase
        .from('brands')
        .select('id, name');

      const categoryMap = new Map(categoriesData?.map(c => [c.name.toLowerCase(), c.id]) || []);
      const brandMap = new Map(brandsData?.map(b => [b.name.toLowerCase(), b.id]) || []);

      let success = 0;

      // Process each product from all Excel files
      for (let i = 0; i < jsonData.length; i++) {
        const row = jsonData[i];
        setUploadProgress({ 
          current: i + 1, 
          total: jsonData.length, 
          stage: `Processing product ${i + 1}/${jsonData.length}...` 
        });

        try {
          // Validate required fields
          if (!row.ProductName || !row.Category || !row.Price) {
            errorList.push(`Row ${i + 2}: Missing required fields (ProductName, Category, or Price)`);
            continue;
          }

          const productName = String(row.ProductName).trim();
          const categoryName = String(row.Category).trim();
          const price = String(row.Price).replace(/[£$,\s]/g, '');
          const shortDescription = row['Short Description'] ? String(row['Short Description']).trim() : '';
          const longDescription = row['Long Description'] ? String(row['Long Description']).trim() : '';
          
          // Try to find matching image from uploaded files
          let imagePath = row['Image Path'] ? String(row['Image Path']).trim() : '';
          const matchingImage = findMatchingImage(productName, imageFiles);

          // Find category
          const categoryId = categoryMap.get(categoryName.toLowerCase());
          if (!categoryId) {
            errorList.push(`Row ${i + 2}: Category "${categoryName}" not found`);
            continue;
          }

          // Find or detect brand
          let brandId: number | null = null;
          const detectedBrand = detectBrandFromProductName(productName);
          if (detectedBrand) {
            brandId = brandMap.get(detectedBrand.toLowerCase()) || null;
          }

          // Calculate discount percentages
          const basePrice = parseFloat(price);
          if (isNaN(basePrice)) {
            errorList.push(`Row ${i + 2}: Invalid price "${row.Price}"`);
            continue;
          }

          // Default discounts: 5% for 5-9, 10% for 10+
          let discount5_9 = 5;
          let discount10Plus = 10;

          // Calculate from discount columns if provided
          if (row['Price Per Unit 1 (£)'] && row['Quantity Range 1']) {
            const range1 = String(row['Quantity Range 1']).toLowerCase();
            const pricePerUnit1 = parseFloat(String(row['Price Per Unit 1 (£)']).replace(/[£$,\s]/g, ''));
            
            if (!isNaN(pricePerUnit1) && (range1.includes('5') || range1.includes('9'))) {
              discount5_9 = calculateDiscountPercentage(basePrice, pricePerUnit1);
            }
          }

          if (row['Price Per Unit 2 (£)'] && row['Quantity Range 2']) {
            const range2 = String(row['Quantity Range 2']).toLowerCase();
            const pricePerUnit2 = parseFloat(String(row['Price Per Unit 2 (£)']).replace(/[£$,\s]/g, ''));
            
            if (!isNaN(pricePerUnit2) && (range2.includes('10') || range2.includes('+'))) {
              discount10Plus = calculateDiscountPercentage(basePrice, pricePerUnit2);
            }
          }

          // Generate slug
          const slug = productName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

          // Upload image if matched (matched images take priority over Excel Image Path)
          let uploadedImageUrl = imagePath;
          if (matchingImage) {
            setUploadProgress({ 
              current: i + 1, 
              total: jsonData.length, 
              stage: `Uploading image for ${productName}...` 
            });
            try {
              const uploadResult = await uploadImage(matchingImage);
              if (uploadResult.url) {
                uploadedImageUrl = uploadResult.url;
              } else if (uploadResult.error) {
                // Only log error, don't fail the product creation
                console.warn(`Failed to upload image for ${productName}:`, uploadResult.error);
                errorList.push(`Row ${i + 2}: Image upload failed - ${uploadResult.error} (product created without image)`);
                // Fall back to Excel Image Path if upload fails
                if (!imagePath) {
                  uploadedImageUrl = '';
                }
              }
            } catch (uploadError) {
              console.error(`Exception uploading image for ${productName}:`, uploadError);
              errorList.push(`Row ${i + 2}: Image upload error - ${uploadError instanceof Error ? uploadError.message : 'Unknown error'} (product created without image)`);
              if (!imagePath) {
                uploadedImageUrl = '';
              }
            }
          }

          // Prepare product data
          const productData: any = {
            name: productName,
            price: `£${basePrice.toFixed(2)}`,
            category: categoryName,
            category_id: categoryId,
            brand_id: brandId,
            brand: detectedBrand || '', // Set brand name for legacy support (empty if not detected)
            description: longDescription || null,
            short_description: shortDescription || null,
            in_stock: true,
            stock_count: 0,
            discount_percentage_5_9: discount5_9,
            discount_percentage_10_plus: discount10Plus,
            is_featured: false,
            slug: slug,
            image: uploadedImageUrl || '',
            images: uploadedImageUrl ? [uploadedImageUrl] : [],
          };

          // Insert product
          setUploadProgress({ 
            current: i + 1, 
            total: jsonData.length, 
            stage: `Creating product: ${productName}...` 
          });
          
          const { error: insertError } = await supabase
            .from('products')
            .insert(productData);

          if (insertError) {
            errorList.push(`Row ${i + 2}: ${insertError.message}`);
          } else {
            success++;
          }
        } catch (error) {
          errorList.push(`Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      setSuccessCount(success);
      setErrors(errorList);
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      setErrors([`Failed to process file: ${error instanceof Error ? error.message : 'Unknown error'}`]);
    } finally {
      setIsUploading(false);
      setUploadProgress({ current: 0, total: 0, stage: '' });
      setImageFiles([]); // Clear image files after upload
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold text-[#2c2520] mb-4">Bulk Upload Products</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-[#2c2520] mb-2">
          Upload Product Images (Optional)
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageFilesChange}
          disabled={isUploading}
          className="block w-full text-sm text-[#6b5d52] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#ba9157] file:text-white hover:file:bg-[#a67d4a] file:cursor-pointer disabled:opacity-50"
        />
        <p className="text-xs text-[#6b5d52] mt-2">
          Select all product images. Images will be matched to products by name (e.g., "Ami Eyes Product" matches "Ami-Eyes-Product.jpg")
        </p>
        {imageFiles.length > 0 && (
          <p className="text-xs text-green-600 mt-1">
            ✓ {imageFiles.length} image(s) selected
          </p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-[#2c2520] mb-2">
          Upload Excel Files (.xlsx, .xls) - Multiple files allowed
        </label>
        <input
          type="file"
          accept=".xlsx,.xls"
          multiple
          onChange={handleFileUpload}
          disabled={isUploading}
          className="block w-full text-sm text-[#6b5d52] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#ba9157] file:text-white hover:file:bg-[#a67d4a] file:cursor-pointer disabled:opacity-50"
        />
        <p className="text-xs text-[#6b5d52] mt-2">
          You can select multiple Excel files (e.g., one per category). All products will be processed together.
          <br />
          Excel columns: ProductName, Category, Price, Short Description, Long Description, 
          Quantity Range 1, Discount 1 (£), Price Per Unit 1 (£), Quantity Range 2, 
          Discount 2 (£), Price Per Unit 2 (£), Image Path
        </p>
      </div>

      {isUploading && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#2c2520]">
              {uploadProgress.stage || `Processing: ${uploadProgress.current} / ${uploadProgress.total}`}
            </span>
            <span className="text-sm text-[#6b5d52]">
              {uploadProgress.total > 0 ? Math.round((uploadProgress.current / uploadProgress.total) * 100) : 0}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#ba9157] h-2 rounded-full transition-all"
              style={{ width: `${uploadProgress.total > 0 ? (uploadProgress.current / uploadProgress.total) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      {successCount > 0 && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            ✓ Successfully uploaded {successCount} product(s)
          </p>
        </div>
      )}

      {errors.length > 0 && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg max-h-60 overflow-y-auto">
          <p className="text-sm font-medium text-red-800 mb-2">Errors ({errors.length}):</p>
          <ul className="text-xs text-red-700 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

