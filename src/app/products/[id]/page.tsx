'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Product {
  id: number;
  brand: string;
  name: string;
  price: string;
  category: string;
  image: string;
  images?: string[];
  description: string;
  inStock: boolean;
  stockCount?: number;
  slug?: string;
  features?: string[];
  salePrice?: string;
  onSale?: boolean;
}

export default function ProductDetailPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      try {
        const productIdentifier = params.id as string;
        
        // Try to load by slug first
        const { data: dataBySlug, error: errorBySlug } = await supabase
          .from('products')
          .select('*')
          .eq('slug', productIdentifier)
          .maybeSingle();

        let productData = dataBySlug;
        let loadError = errorBySlug;

        // If not found by slug, try by ID
        if (!productData && !errorBySlug) {
          const productId = parseInt(productIdentifier);
          if (!isNaN(productId)) {
            const { data: dataById, error: errorById } = await supabase
              .from('products')
              .select('*')
              .eq('id', productId)
              .single();
            
            productData = dataById;
            loadError = errorById;
          }
        }

        if (loadError) {
          console.error('Error loading product:', {
            message: loadError.message,
            details: loadError.details,
            hint: loadError.hint,
            code: loadError.code
          });
          setIsLoading(false);
          return;
        }

        if (!productData) {
          console.error('Product not found:', productIdentifier);
          setIsLoading(false);
          return;
        }

        // Build images array - use images array if available, otherwise use primary image
        const allImages = productData.images && productData.images.length > 0 
          ? productData.images 
          : (productData.image ? [productData.image] : []);
        
        setProduct({
          id: productData.id,
          brand: productData.brand,
          name: productData.name,
          price: productData.price,
          category: productData.category,
          image: allImages[0] || productData.image,
          images: allImages,
          description: productData.description || "This is a premium skincare product designed to provide exceptional results.",
          inStock: productData.in_stock,
          stockCount: productData.stock_count || undefined,
          slug: productData.slug,
          features: productData.features || [],
          salePrice: productData.sale_price,
          onSale: productData.on_sale || false,
        });
        
        // Reset selected image index when product loads
        setSelectedImageIndex(0);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error loading product:', {
          message: errorMessage,
          error: error
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [params.id]);

  const handleAddToCart = () => {
    if (product && product.inStock) {
      // Add the product to cart with the selected quantity
      for (let i = 0; i < quantity; i++) {
        addToCart({
          id: product.id,
          brand: product.brand,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
        });
      }
      alert(`Added ${quantity} x ${product.name} to cart!`);
    }
  };

  if (isLoading || !product) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-[#6b5d52]">
            <li><Link href="/" className="hover:text-[#ba9157]">Home</Link></li>
            <li>/</li>
            <li><Link href="/shop" className="hover:text-[#ba9157]">Shop</Link></li>
            <li>/</li>
            <li><Link href={`/shop?category=${product.category}`} className="hover:text-[#ba9157]">{product.category}</Link></li>
            <li>/</li>
            <li className="text-[#2c2520] font-medium">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image - Larger and with navigation */}
          <div className="space-y-4">
            {/* Main Image Display - Larger */}
            <div className="relative bg-gray-100 rounded-lg overflow-hidden group">
              {/* Main Image Container - Larger size */}
              <div 
                className="w-full h-[500px] lg:h-[600px] bg-white relative overflow-hidden"
                onMouseMove={(e) => {
                  if (isZoomed) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                    setZoomPosition({ x, y });
                  }
                }}
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
              >
                {product.images && product.images.length > 0 && product.images[selectedImageIndex] ? (
                  failedImages.has(product.images[selectedImageIndex]) ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <svg className="w-32 h-32 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                    </div>
                  ) : (
                    <img
                      src={product.images[selectedImageIndex]}
                      alt={product.name}
                      className={`w-full h-full transition-transform duration-300 ${
                        isZoomed ? 'scale-150' : 'scale-100'
                      }`}
                      style={{
                        objectFit: 'contain',
                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      }}
                      onError={() => {
                        setFailedImages(prev => new Set(prev).add(product.images![selectedImageIndex]));
                      }}
                    />
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <svg className="w-32 h-32 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                
                {/* Navigation Arrows - Only show if more than 1 image */}
                {product.images && product.images.length > 1 && (
                  <>
                    {/* Left Arrow */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImageIndex((prev) => 
                          prev === 0 ? product.images!.length - 1 : prev - 1
                        );
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all opacity-0 group-hover:opacity-100 z-10"
                      aria-label="Previous image"
                    >
                      <svg className="w-6 h-6 text-[#2c2520]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    {/* Right Arrow */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImageIndex((prev) => 
                          prev === product.images!.length - 1 ? 0 : prev + 1
                        );
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all opacity-0 group-hover:opacity-100 z-10"
                      aria-label="Next image"
                    >
                      <svg className="w-6 h-6 text-[#2c2520]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
                
                {/* Image Counter */}
                {product.images && product.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm z-10">
                    {selectedImageIndex + 1} / {product.images.length}
                  </div>
                )}
              </div>
            </div>
            
            {/* Thumbnail Gallery - Horizontal scrollable */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIndex(i)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === i 
                        ? 'border-[#ba9157] ring-2 ring-[#ba9157] ring-offset-2' 
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    {failedImages.has(img) ? (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : img.startsWith('http') || img.startsWith('blob:') || img.startsWith('data:') ? (
                      <img
                        src={img}
                        alt={`${product.name} thumbnail ${i + 1}`}
                        className="w-full h-full object-cover"
                        onError={() => {
                          setFailedImages(prev => new Set(prev).add(img));
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-[#ba9157] uppercase tracking-wider mb-2">
                {product.brand}
              </p>
              <h1 className="text-3xl lg:text-4xl font-bold text-[#2c2520] mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 mb-4">
                {product.onSale && product.salePrice ? (
                  <>
                    <p className="text-3xl font-bold text-[#2c2520]">
                      ${product.salePrice}
                    </p>
                    <p className="text-xl text-gray-400 line-through">
                      ${product.price}
                    </p>
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      SALE
                    </span>
                  </>
                ) : (
                  <p className="text-3xl font-bold text-[#2c2520]">
                    ${product.price}
                  </p>
                )}
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              {product.inStock ? (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium">
                    In Stock ({product.stockCount} available)
                  </span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-red-600 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-[#2c2520] mb-3">Description</h3>
              <p className="text-[#6b5d52] leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-[#2c2520] mb-2">
                  Quantity
                </label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ba9157] focus:border-transparent"
                  disabled={!product.inStock}
                >
                  {[...Array(Math.min(10, product.stockCount || 0))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                  product.inStock
                    ? 'bg-[#ba9157] text-white hover:bg-[#a67d4a]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>

            {/* Product Features - Dynamic from database */}
            {product.features && product.features.length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-[#2c2520] mb-4">Product Features</h3>
                <ul className="space-y-2 text-[#6b5d52]">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
