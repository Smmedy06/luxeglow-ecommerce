'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Product {
  id: number;
  brand: string;
  name: string;
  price: string;
  image: string;
  slug?: string;
}

export default function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        // First, try to load featured products
        const { data: featuredData, error: featuredError } = await supabase
          .from('products')
          .select('id, brand, name, price, image, slug')
          .eq('is_featured', true)
          .eq('in_stock', true)
          .limit(4)
          .order('created_at', { ascending: false });

        if (featuredError) {
          console.error('Error loading featured products:', featuredError);
        }

        // If we have featured products, use them
        if (featuredData && featuredData.length > 0) {
          setFeaturedProducts(featuredData.map(product => ({
            id: product.id,
            brand: product.brand,
            name: product.name,
            price: product.price,
            image: product.image,
            slug: product.slug || `product-${product.id}`,
          })));
          setIsLoading(false);
          return;
        }

        // If no featured products, load regular products as fallback
        const { data: regularData, error: regularError } = await supabase
          .from('products')
          .select('id, brand, name, price, image, slug')
          .eq('in_stock', true)
          .limit(4)
          .order('created_at', { ascending: false });

        if (regularError) {
          console.error('Error loading regular products:', regularError);
        } else if (regularData) {
          setFeaturedProducts(regularData.map(product => ({
            id: product.id,
            brand: product.brand,
            name: product.name,
            price: product.price,
            image: product.image,
            slug: product.slug || `product-${product.id}`,
          })));
        }
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);
  return (
    <section className="py-20 bg-[#f8f7f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-[#ba9157] text-sm font-medium uppercase tracking-wider mb-2">
            OUR BESTSELLERS
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-[#2c2520] mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-[#6b5d52] max-w-2xl mx-auto">
            Handpicked essentials that deliver real results
          </p>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                {/* Product Image */}
                <Link href={`/products/${product.slug || product.id}`}>
                  <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden relative">
                    {product.image && (product.image.startsWith('http') || product.image.startsWith('blob:') || product.image.startsWith('data:')) ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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
                <div className="p-6 space-y-3">
                  <p className="text-xs text-[#ba9157] uppercase tracking-wider">
                    {product.brand}
                  </p>
                  <h3 className="text-lg font-semibold text-[#2c2520]">
                    {product.name}
                  </h3>
                  <p className="text-xl font-bold text-[#2c2520]">
                    {product.price}
                  </p>
                  <Link
                    href={`/products/${product.slug || product.id}`}
                    className="w-full border border-[#2c2520] text-[#2c2520] py-2 px-4 rounded-lg font-medium hover:bg-[#2c2520] hover:text-white transition-colors inline-block text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-[#6b5d52]">
            <p>No featured products available at the moment.</p>
          </div>
        )}

        {/* View All Button */}
        <div className="text-center">
          <Link
            href="/shop"
            className="inline-flex items-center border border-[#2c2520] text-[#2c2520] px-8 py-3 rounded-lg font-medium hover:bg-[#2c2520] hover:text-white transition-colors"
          >
            View All Products
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
