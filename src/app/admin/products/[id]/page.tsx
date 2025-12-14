'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { uploadMultipleImages, deleteImage } from '@/lib/imageUpload';
import { useDropzone } from 'react-dropzone';
import Link from 'next/link';

interface Brand {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

export default function AdminProductEditPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id === 'new' ? null : parseInt(params.id as string);
  const isNew = productId === null;

  const [formData, setFormData] = useState({
    brand_id: '',
    name: '',
    price: '',
    category_id: '',
    image: '',
    images: [] as string[],
    description: '',
    in_stock: true,
    stock_count: 0,
    features: [] as string[],
    sale_price: '',
    on_sale: false,
    sku: '',
    weight: '',
    dimensions: '',
    meta_title: '',
    meta_description: '',
    tags: [] as string[],
  });
  const [featureInput, setFeatureInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  // Load brands and categories
  useEffect(() => {
    loadBrandsAndCategories();
  }, []);

  useEffect(() => {
    if (!isNew && productId) {
      loadProduct();
    }
  }, [productId, isNew]);

  const loadBrandsAndCategories = async () => {
    try {
      // Load brands
      const { data: brandsData } = await supabase
        .from('brands')
        .select('id, name')
        .order('name', { ascending: true });

      if (brandsData) {
        setBrands(brandsData);
      }

      // Load categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('id, name')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (categoriesData) {
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error('Error loading brands/categories:', error);
    }
  };

  const loadProduct = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) {
        console.error('Error loading product:', error);
        alert('Failed to load product');
        router.push('/admin/products');
      } else if (data) {
        // Simple: Get images array or use primary image
        const imagesArray = Array.isArray(data.images) && data.images.length > 0 
          ? data.images.filter((url: string) => url && url.trim() !== '')
          : (data.image ? [data.image] : []);
        
        setFormData({
          brand_id: data.brand_id?.toString() || '',
          name: data.name || '',
          price: data.price || '',
          category_id: data.category_id?.toString() || '',
          image: data.image || (imagesArray.length > 0 ? imagesArray[0] : ''),
          images: imagesArray,
          description: data.description || '',
          in_stock: data.in_stock ?? true,
          stock_count: data.stock_count || 0,
          features: Array.isArray(data.features) ? data.features : [],
          sale_price: data.sale_price || '',
          on_sale: data.on_sale || false,
          sku: data.sku || '',
          weight: data.weight?.toString() || '',
          dimensions: data.dimensions || '',
          meta_title: data.meta_title || '',
          meta_description: data.meta_description || '',
          tags: Array.isArray(data.tags) ? data.tags : [],
        });
        setProductImages(imagesArray);
      }
    } catch (error) {
      console.error('Error loading product:', error);
      alert('Failed to load product');
    } finally {
      setIsLoading(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setUploadingImages(true);
    try {
      // Upload images to Supabase
      const results = await uploadMultipleImages(acceptedFiles);
      const successfulUploads = results
        .filter(r => r.url && !r.error)
        .map(r => r.url);

      if (successfulUploads.length > 0) {
        // Add uploaded URLs to images array
        setProductImages(prev => [...prev, ...successfulUploads]);
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...successfulUploads],
          image: prev.image || successfulUploads[0], // Set first as primary if none exists
        }));
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload some images');
    } finally {
      setUploadingImages(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const removeImage = async (index: number) => {
    const imageToRemove = productImages[index];
    
    // Delete from Supabase Storage
    if (imageToRemove && imageToRemove.includes('supabase.co/storage/v1/object/public/product-images/')) {
      try {
        const urlParts = imageToRemove.split('/product-images/');
        if (urlParts.length > 1) {
          const filePath = urlParts[1];
          await deleteImage(filePath);
        }
      } catch (error) {
        console.error('Error deleting image from storage:', error);
      }
    }
    
    // Remove from arrays
    const newImages = productImages.filter((_, i) => i !== index);
    setProductImages(newImages);
    
    // Remove from failed images set (by URL)
    setFailedImages(prev => {
      const newSet = new Set(prev);
      newSet.delete(imageToRemove);
      return newSet;
    });
    
    // Update formData
    const newPrimaryImage = formData.image === imageToRemove 
      ? (newImages[0] || '') 
      : formData.image;
    
    setFormData(prev => ({
      ...prev,
      images: newImages,
      image: newPrimaryImage,
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Get brand and category names from IDs
      const selectedBrand = brands.find(b => b.id.toString() === formData.brand_id);
      const selectedCategory = categories.find(c => c.id.toString() === formData.category_id);

      // Ensure we have an image (use first from images array if image is empty)
      const primaryImage = formData.image || (formData.images.length > 0 ? formData.images[0] : '');

      if (!primaryImage) {
        alert('Please upload at least one product image');
        setIsSaving(false);
        return;
      }

      if (!selectedBrand) {
        alert('Please select a brand');
        setIsSaving(false);
        return;
      }

      if (!selectedCategory) {
        alert('Please select a category');
        setIsSaving(false);
        return;
      }

      // Generate slug from product name
      const generateSlug = (name: string, id?: number) => {
        const baseSlug = name
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
        return id ? `${baseSlug}-${id}` : baseSlug;
      };

      const submitData = {
        // Old columns (required by schema)
        brand: selectedBrand.name,
        category: selectedCategory.name,
        image: primaryImage,
        // New columns (optional)
        brand_id: formData.brand_id ? parseInt(formData.brand_id) : null,
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        // Other fields
        name: formData.name,
        price: formData.price,
        description: formData.description || null,
        in_stock: formData.in_stock,
        stock_count: parseInt(formData.stock_count.toString()) || 0,
        images: productImages.filter(url => url && url.trim() !== ''),
        // Generate slug (will be updated with ID after insert if new)
        slug: isNew ? generateSlug(formData.name) : generateSlug(formData.name, productId),
        // Additional fields
        features: formData.features.length > 0 ? formData.features : null,
        sale_price: formData.sale_price || null,
        on_sale: formData.on_sale || false,
        sku: formData.sku || null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        dimensions: formData.dimensions || null,
        meta_title: formData.meta_title || null,
        meta_description: formData.meta_description || null,
        tags: formData.tags.length > 0 ? formData.tags : null,
      };

      if (isNew) {
        const { data, error } = await supabase
          .from('products')
          .insert(submitData)
          .select()
          .single();

        if (error) {
          console.error('Error creating product:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          alert(`Failed to create product: ${error.message || 'Unknown error'}`);
        } else if (data) {
          // Update slug with product ID for uniqueness
          const finalSlug = generateSlug(formData.name, data.id);
          await supabase
            .from('products')
            .update({ slug: finalSlug })
            .eq('id', data.id);
          
          alert('Product created successfully!');
          router.push('/admin/products');
        }
      } else {
        // Log what we're saving for debugging
        console.log('Updating product with data:', {
          id: productId,
          images: submitData.images,
          image: submitData.image,
          productImages: productImages
        });

        const { error } = await supabase
          .from('products')
          .update(submitData)
          .eq('id', productId);

        if (error) {
          console.error('Error updating product:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          alert(`Failed to update product: ${error.message || 'Unknown error'}`);
        } else {
          alert('Product updated successfully!');
          router.push('/admin/products');
        }
      }
    } catch (error: any) {
      console.error('Error saving product:', error);
      alert(`Failed to save product: ${error?.message || 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  if (isLoading) {
    return (
      <div className="animate-pulse p-4 md:p-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 md:mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-[#2c2520]">
          {isNew ? 'Create New Product' : 'Edit Product'}
        </h1>
        <Link
          href="/admin/products"
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base"
        >
          Back to Products
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 md:p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Brand Dropdown */}
          <div>
            <label htmlFor="brand_id" className="block text-sm font-medium text-[#2c2520] mb-2">
              Brand *
            </label>
            <select
              id="brand_id"
              name="brand_id"
              value={formData.brand_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none"
            >
              <option value="">Select a brand</option>
              {brands.map(brand => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#2c2520] mb-2">
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none"
            />
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-[#2c2520] mb-2">
              Price *
            </label>
            <input
              type="text"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="£99.99"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label htmlFor="category_id" className="block text-sm font-medium text-[#2c2520] mb-2">
              Category *
            </label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none"
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Count */}
          <div>
            <label htmlFor="stock_count" className="block text-sm font-medium text-[#2c2520] mb-2">
              Stock Count
            </label>
            <input
              type="number"
              id="stock_count"
              name="stock_count"
              value={formData.stock_count}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none"
            />
          </div>

          {/* In Stock Checkbox */}
          <div className="flex items-center pt-8">
            <input
              type="checkbox"
              id="in_stock"
              name="in_stock"
              checked={formData.in_stock}
              onChange={handleChange}
              className="w-4 h-4 text-[#ba9157] border-gray-300 rounded focus:ring-[#ba9157]"
            />
            <label htmlFor="in_stock" className="ml-2 text-sm font-medium text-[#2c2520]">
              In Stock
            </label>
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-[#2c2520] mb-2">
            Product Images *
          </label>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-[#ba9157] bg-[#ba9157]/10'
                : 'border-gray-300 hover:border-[#ba9157]'
            }`}
          >
            <input {...getInputProps()} />
            {uploadingImages ? (
              <p className="text-[#6b5d52]">Uploading images...</p>
            ) : (
              <>
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="mt-2 text-sm text-[#6b5d52]">
                  {isDragActive
                    ? 'Drop images here'
                    : 'Drag & drop images here, or click to select'}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  PNG, JPG, WEBP up to 5MB (multiple images supported)
                </p>
              </>
            )}
          </div>

          {/* Image Preview Grid */}
          {productImages.length > 0 && (
            <div className="mt-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {productImages.map((url, index) => {
                  const imageFailed = failedImages.has(url);
                  
                  return (
                    <div key={`${url}-${index}`} className="relative group">
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative border-2 border-transparent hover:border-[#ba9157] transition-all">
                        {!imageFailed && url && (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:')) ? (
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={() => {
                              setFailedImages(prev => new Set(prev).add(url));
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                        
                        {formData.image === url && (
                          <div className="absolute top-2 left-2 bg-[#ba9157] text-white text-xs px-2 py-1 rounded z-10 font-medium">
                            Primary
                          </div>
                        )}
                        
                        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded z-10">
                          {index + 1}/{productImages.length}
                        </div>
                        
                        {/* Control Buttons */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity rounded-lg flex items-center justify-center">
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFormData(prev => ({ ...prev, image: url }));
                              }}
                              className="bg-white text-[#2c2520] px-3 py-1 rounded text-xs font-medium hover:bg-gray-100"
                            >
                              Set Primary
                            </button>
                            <button
                              type="button"
                              onClick={async (e) => {
                                e.stopPropagation();
                                await removeImage(index);
                              }}
                              className="bg-red-500 text-white px-3 py-1 rounded text-xs font-medium hover:bg-red-600"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-[#2c2520] mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none"
          />
        </div>

        {/* Product Features */}
        <div>
          <label className="block text-sm font-medium text-[#2c2520] mb-2">
            Product Features
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (featureInput.trim()) {
                    setFormData(prev => ({
                      ...prev,
                      features: [...prev.features, featureInput.trim()]
                    }));
                    setFeatureInput('');
                  }
                }
              }}
              placeholder="Enter a feature and press Enter"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none"
            />
            <button
              type="button"
              onClick={() => {
                if (featureInput.trim()) {
                  setFormData(prev => ({
                    ...prev,
                    features: [...prev.features, featureInput.trim()]
                  }));
                  setFeatureInput('');
                }
              }}
              className="px-4 py-2 bg-[#ba9157] text-white rounded-lg hover:bg-[#a67d4a] transition-colors"
            >
              Add
            </button>
          </div>
          {formData.features.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.features.map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 bg-gray-100 text-[#2c2520] px-3 py-1 rounded-lg text-sm"
                >
                  {feature}
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        features: prev.features.filter((_, i) => i !== index)
                      }));
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Sale Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center space-x-2 mb-2">
              <input
                type="checkbox"
                checked={formData.on_sale}
                onChange={(e) => setFormData(prev => ({ ...prev, on_sale: e.target.checked }))}
                className="w-4 h-4 text-[#ba9157] border-gray-300 rounded focus:ring-[#ba9157]"
              />
              <span className="text-sm font-medium text-[#2c2520]">On Sale</span>
            </label>
          </div>
          {formData.on_sale && (
            <div>
              <label htmlFor="sale_price" className="block text-sm font-medium text-[#2c2520] mb-2">
                Sale Price
              </label>
              <input
                type="text"
                id="sale_price"
                name="sale_price"
                value={formData.sale_price}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none"
              />
            </div>
          )}
        </div>

        {/* Additional Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="sku" className="block text-sm font-medium text-[#2c2520] mb-2">
              SKU (Stock Keeping Unit)
            </label>
            <input
              type="text"
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="PROD-001"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-[#2c2520] mb-2">
              Weight (kg)
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              step="0.01"
              placeholder="0.5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label htmlFor="dimensions" className="block text-sm font-medium text-[#2c2520] mb-2">
              Dimensions (L x W x H)
            </label>
            <input
              type="text"
              id="dimensions"
              name="dimensions"
              value={formData.dimensions}
              onChange={handleChange}
              placeholder="10 x 5 x 3 cm"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            type="submit"
            disabled={isSaving || uploadingImages}
            className="px-6 py-3 bg-[#ba9157] text-white rounded-lg hover:bg-[#a67d4a] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : (isNew ? 'Create Product' : 'Update Product')}
          </button>
          <Link
            href="/admin/products"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
