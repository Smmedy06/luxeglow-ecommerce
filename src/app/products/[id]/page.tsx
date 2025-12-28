'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';

interface Product {
  id: number;
  brand: string;
  name: string;
  price: string;
  category: string;
  image: string;
  images?: string[];
  description: string;
  shortDescription?: string;
  inStock: boolean;
  stockCount?: number;
  slug?: string;
  features?: string[];
  salePrice?: string;
  onSale?: boolean;
  discountPercentage5_9?: number;
  discountPercentage10Plus?: number;
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
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

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
        
        const loadedProduct = {
          id: productData.id,
          brand: productData.brand,
          name: productData.name,
          price: productData.price,
          category: productData.category,
          image: allImages[0] || productData.image,
          images: allImages,
          description: productData.description || "",
          shortDescription: productData.short_description || "",
          inStock: productData.in_stock,
          stockCount: productData.stock_count || undefined,
          slug: productData.slug,
          features: productData.features || [],
          salePrice: productData.sale_price,
          onSale: productData.on_sale || false,
          discountPercentage5_9: productData.discount_percentage_5_9 || 0,
          discountPercentage10Plus: productData.discount_percentage_10_plus || 0,
        };
        
        setProduct(loadedProduct);
        
        // Reset selected image index when product loads
        setSelectedImageIndex(0);

        // Load related products from the same category
        const { data: relatedData, error: relatedError } = await supabase
          .from('products')
          .select('id, brand, name, price, image, slug, category')
          .eq('category', loadedProduct.category)
          .eq('in_stock', true)
          .neq('id', loadedProduct.id)
          .limit(4)
          .order('created_at', { ascending: false });

        if (!relatedError && relatedData) {
          setRelatedProducts(relatedData.map(p => ({
            id: p.id,
            brand: p.brand,
            name: p.name,
            price: p.price,
            category: p.category,
            image: p.image,
            images: [],
            description: '',
            shortDescription: '',
            inStock: true,
            stockCount: undefined,
            slug: p.slug || `product-${p.id}`,
            features: [],
            salePrice: undefined,
            onSale: false,
            discountPercentage5_9: 0,
            discountPercentage10Plus: 0,
          })));
        }
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
      // Calculate price based on quantity and discounts
      const basePrice = parseFloat(product.price.replace('£', '').replace('$', ''));
      let discount = 0;
      
      if (quantity >= 10 && product.discountPercentage10Plus) {
        discount = product.discountPercentage10Plus;
      } else if (quantity >= 5 && product.discountPercentage5_9) {
        discount = product.discountPercentage5_9;
      }
      
      const finalPrice = discount > 0 
        ? basePrice * (1 - discount / 100)
        : basePrice;
      
      const priceString = `£${finalPrice.toFixed(2)}`;
      
      // Add the product to cart with the selected quantity
      for (let i = 0; i < quantity; i++) {
        addToCart({
          id: product.id,
          brand: product.brand,
          name: product.name,
          price: priceString,
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
                    <Image
                      src={product.images[selectedImageIndex]}
                      alt={product.name}
                      fill
                      className={`transition-transform duration-300 ${
                        isZoomed ? 'scale-150' : 'scale-100'
                      }`}
                      style={{
                        objectFit: 'contain',
                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      }}
                      unoptimized={product.images[selectedImageIndex].startsWith('blob:') || product.images[selectedImageIndex].startsWith('data:')}
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
                      <Image
                        src={img}
                        alt={`${product.name} thumbnail ${i + 1}`}
                        fill
                        className="object-cover"
                        unoptimized={img.startsWith('blob:') || img.startsWith('data:')}
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
          <div className="space-y-4">
            {/* Brand */}
            {product.brand && (
              <p className="text-sm text-[#ba9157] uppercase tracking-wider">
                {product.brand}
              </p>
            )}
            
            {/* Product Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-[#2c2520]">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-3">
              {(() => {
                const basePrice = parseFloat(product.price.replace('£', '').replace('$', ''));
                let currentPrice = basePrice;
                let discount = 0;
                
                if (quantity >= 10 && product.discountPercentage10Plus) {
                  discount = product.discountPercentage10Plus;
                } else if (quantity >= 5 && product.discountPercentage5_9) {
                  discount = product.discountPercentage5_9;
                }
                
                if (discount > 0) {
                  currentPrice = basePrice * (1 - discount / 100);
                }
                
                return (
                  <>
                    <p className="text-3xl font-bold text-[#2c2520]">
                      £{currentPrice.toFixed(2)}
                    </p>
                    {discount > 0 && (
                      <p className="text-xl text-gray-400 line-through">
                        £{basePrice.toFixed(2)}
                      </p>
                    )}
                    {product.onSale && product.salePrice && (
                      <>
                        <p className="text-xl text-gray-400 line-through">
                          £{basePrice.toFixed(2)}
                        </p>
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          SALE
                        </span>
                      </>
                    )}
                  </>
                );
              })()}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              {product.inStock ? (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium">
                    In Stock {product.stockCount ? `(${product.stockCount} available)` : '(available)'}
                  </span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-red-600 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <div className="mt-4">
                <p className="text-[#6b5d52] leading-relaxed">
                  {product.shortDescription}
                </p>
              </div>
            )}

            {/* Product Overview */}
            {product.description && (
              <div className="mt-4">
                <p className="text-[#6b5d52] leading-relaxed">
                  {product.description.split('\n')[0] || product.description.substring(0, 200)}
                </p>
              </div>
            )}

            {/* Target Concerns / Features */}
            {product.features && product.features.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-[#2c2520] mb-3">Target Concerns</h3>
                <ul className="space-y-2 text-[#6b5d52]">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2 text-[#ba9157]">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Buy More, Save More Table */}
            {(product.discountPercentage5_9 || product.discountPercentage10Plus) && (
              <div className="border-t border-gray-200 pt-6 mb-6">
                <h3 className="text-lg font-semibold text-[#2c2520] mb-4">Buy More, Save More</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left text-sm font-medium text-[#6b5d52] border border-gray-200">Quantity Range</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-[#6b5d52] border border-gray-200">Discount</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-[#6b5d52] border border-gray-200">Price Per Unit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.discountPercentage5_9 && (
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-[#2c2520] border border-gray-200">5-9</td>
                          <td className="px-4 py-3 text-sm text-[#2c2520] border border-gray-200">
                            £{((parseFloat(product.price.replace('£', '').replace('$', '')) * product.discountPercentage5_9) / 100).toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-[#2c2520] border border-gray-200">
                            £{(parseFloat(product.price.replace('£', '').replace('$', '')) * (1 - product.discountPercentage5_9 / 100)).toFixed(2)}
                          </td>
                        </tr>
                      )}
                      {product.discountPercentage10Plus && (
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-[#2c2520] border border-gray-200">10+</td>
                          <td className="px-4 py-3 text-sm text-[#2c2520] border border-gray-200">
                            £{((parseFloat(product.price.replace('£', '').replace('$', '')) * product.discountPercentage10Plus) / 100).toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-[#2c2520] border border-gray-200">
                            £{(parseFloat(product.price.replace('£', '').replace('$', '')) * (1 - product.discountPercentage10Plus / 100)).toFixed(2)}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-[#2c2520] mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={!product.inStock || quantity <= 1}
                    className={`w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center transition-colors ${
                      !product.inStock || quantity <= 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-[#2c2520] hover:bg-gray-50'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    max={product.stockCount || 999}
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      setQuantity(Math.max(1, Math.min(val, product.stockCount || 999)));
                    }}
                    className="w-20 text-center border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ba9157] focus:border-transparent"
                    disabled={!product.inStock}
                  />
                  <button
                    onClick={() => setQuantity(Math.min((product.stockCount || 999), quantity + 1))}
                    disabled={!product.inStock || quantity >= (product.stockCount || 999)}
                    className={`w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center transition-colors ${
                      !product.inStock || quantity >= (product.stockCount || 999)
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-[#2c2520] hover:bg-gray-50'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
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

          </div>
        </div>

        {/* Trust Badges Banner - Full Width */}
        <div className="bg-[#f5f3f0] py-12 my-12 w-full">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <svg className="w-10 h-10 text-[#ba9157]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-[#2c2520] mb-1 text-lg">Authenticity</h4>
                  <p className="text-sm text-[#6b5d52]">100% authentic and CE certified</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <svg className="w-10 h-10 text-[#ba9157]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-[#2c2520] mb-1 text-lg">Next Day Shipping</h4>
                  <p className="text-sm text-[#6b5d52]">On all UK orders</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <svg className="w-10 h-10 text-[#ba9157]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-[#2c2520] mb-1 text-lg">Expert Support</h4>
                  <p className="text-sm text-[#6b5d52]">Team of specialists available</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description Section */}
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-[#2c2520] mb-6">Product Description</h2>
            {product.description && (
              <div className="prose prose-lg max-w-none mb-8">
                <p className="text-[#6b5d52] leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* Key Benefits */}
            {product.features && product.features.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-[#2c2520] mb-4">Key Benefits</h3>
                <ul className="space-y-3 text-[#6b5d52]">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-3 text-[#ba9157] font-bold">•</span>
                      <span className="flex-1">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="w-full px-4 sm:px-6 lg:px-8 py-12 bg-[#f8f7f5]">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-[#2c2520] mb-4">
                  Related Products
                </h2>
                <p className="text-lg text-[#6b5d52]">
                  Discover more products from the same category
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {relatedProducts.map((relatedProduct) => (
                  <div key={relatedProduct.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
                    {/* Product Image */}
                    <Link href={`/products/${relatedProduct.slug || relatedProduct.id}`}>
                      <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden relative">
                        {relatedProduct.image && (relatedProduct.image.startsWith('http') || relatedProduct.image.startsWith('blob:') || relatedProduct.image.startsWith('data:')) ? (
                          <Image
                            src={relatedProduct.image}
                            alt={relatedProduct.name}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-300"
                            unoptimized={relatedProduct.image.startsWith('blob:') || relatedProduct.image.startsWith('data:')}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Product Info */}
                    <div className="p-6 space-y-3 flex-grow flex flex-col">
                      <p className="text-xs text-[#ba9157] uppercase tracking-wider">
                        {relatedProduct.brand}
                      </p>
                      <h3 className="text-lg font-semibold text-[#2c2520] line-clamp-2 min-h-[3.5rem]">
                        {relatedProduct.name}
                      </h3>
                      <p className="text-xl font-bold text-[#2c2520]">
                        {relatedProduct.price}
                      </p>
                      <Link
                        href={`/products/${relatedProduct.slug || relatedProduct.id}`}
                        className="w-full border border-[#2c2520] text-[#2c2520] py-2 px-4 rounded-lg font-medium hover:bg-[#2c2520] hover:text-white transition-colors inline-block text-center mt-auto"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
