'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
  description?: string;
  inStock?: boolean;
  stockCount?: number;
  slug?: string;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Newest");
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const productsPerPage = 30;

  const [categories, setCategories] = useState<{ name: string; count: number }[]>([]);

  // Load products and categories from Supabase
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .order('id', { ascending: false });

        if (productsError) {
          console.error('Error loading products:', productsError);
        } else if (productsData) {
          const formattedProducts: Product[] = productsData.map(product => ({
            id: product.id,
            brand: product.brand,
            name: product.name,
            price: product.price,
            category: product.category,
            image: product.image,
            description: product.description || undefined,
            inStock: product.in_stock,
            stockCount: product.stock_count || undefined,
            slug: product.slug || `product-${product.id}`,
          }));
          setProducts(formattedProducts);
        }

        // Load categories from database
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('name', { ascending: true });

        if (categoriesError) {
          console.error('Error loading categories:', categoriesError);
          // Fallback to hardcoded categories if table doesn't exist yet
          const categoryCounts = productsData ? [
            { name: "All Products", count: productsData.length },
            { name: "Dermal Fillers", count: productsData.filter((p: any) => p.category === "Dermal Fillers").length },
            { name: "Anti-Wrinkle Injections", count: productsData.filter((p: any) => p.category === "Anti-Wrinkle Injections").length },
            { name: "Mesotherapy", count: productsData.filter((p: any) => p.category === "Mesotherapy").length },
            { name: "Professional Skincare", count: productsData.filter((p: any) => p.category === "Professional Skincare").length },
            { name: "Thread Lifts", count: productsData.filter((p: any) => p.category === "Thread Lifts").length },
            { name: "Medical Devices", count: productsData.filter((p: any) => p.category === "Medical Devices").length }
          ] : [];
          setCategories(categoryCounts);
        } else if (categoriesData) {
          // Use database categories
          const categoryList = [
            { name: "All Products", count: productsData?.length || 0 },
            ...categoriesData.map(cat => ({
              name: cat.name,
              count: productsData?.filter((p: any) => p.category === cat.name).length || 0
            }))
          ];
          setCategories(categoryList);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "All Products" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const price = parseFloat(product.price.replace('£', ''));
    const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
    
    return matchesCategory && matchesSearch && matchesPrice;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "Price Low to High":
        return parseFloat(a.price.replace('£', '')) - parseFloat(b.price.replace('£', ''));
      case "Price High to Low":
        return parseFloat(b.price.replace('£', '')) - parseFloat(a.price.replace('£', ''));
      case "Name A-Z":
        return a.name.localeCompare(b.name);
      default: // Newest
        return b.id - a.id;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, endIndex);

  const clearFilters = () => {
    setSelectedCategory("All Products");
    setSearchTerm("");
    setPriceRange([0, 300]);
    setSortBy("Newest");
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedCategory !== "All Products" || searchTerm !== "" || priceRange[0] !== 0 || priceRange[1] !== 300;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of the page with a small delay to ensure page change happens first
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
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
      
      <main>
        {/* Hero Section with Background */}
        <section className="bg-[#f8f7f5] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-[#ba9157] text-sm font-medium uppercase tracking-wider mb-2">
                DISCOVER OUR COLLECTION
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-[#2c2520] mb-4">
                All Products
              </h1>
              <p className="text-lg text-[#6b5d52] max-w-2xl mx-auto mb-8">
                Browse our curated selection of premium skincare essentials
              </p>
              
              {/* Search Bar */}
              <div className="max-w-md mx-auto relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-[#6b5d52]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ba9157] focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Mobile Controls */}
          <div className="lg:hidden mb-6">
            {/* Product Count and Sort */}
            <div className="flex justify-between items-center mb-4">
              <p className="text-[#6b5d52] text-sm font-medium">
                {currentProducts.length} of {sortedProducts.length} products
              </p>
              <div className="flex items-center space-x-2">
                <span className="text-[#6b5d52] text-sm">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ba9157] bg-white"
                >
                  <option value="Newest">Newest</option>
                  <option value="Price Low to High">Price Low to High</option>
                  <option value="Price High to Low">Price High to Low</option>
                  <option value="Name A-Z">Name A-Z</option>
                </select>
              </div>
            </div>
            
            {/* Filter Button */}
            <div className="flex justify-start">
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="flex items-center space-x-2 border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors bg-white"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Mobile Filters Overlay */}
          {showMobileFilters && (
            <div className="lg:hidden mb-6 bg-white border border-gray-200 rounded-lg p-6">
              <div className="space-y-6">
                {/* Categories */}
                <div>
                  <h3 className="text-lg font-semibold text-[#2c2520] mb-4">Categories</h3>
                  <ul className="space-y-2">
                    {categories.map((category, index) => (
                      <li key={index}>
                        <button
                          onClick={() => setSelectedCategory(category.name)}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                            selectedCategory === category.name
                              ? 'bg-[#ba9157] text-white'
                              : 'text-[#6b5d52] hover:bg-gray-100'
                          }`}
                        >
                          {category.name} ({category.count})
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="text-lg font-semibold text-[#2c2520] mb-4">Price Range</h3>
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="relative h-2 bg-gray-200 rounded-lg">
                        <div 
                          className="absolute h-2 bg-[#ba9157] rounded-lg"
                          style={{
                            left: `${(priceRange[0] / 300) * 100}%`,
                            width: `${((priceRange[1] - priceRange[0]) / 300) * 100}%`
                          }}
                        ></div>
                        <input
                          type="range"
                          min="0"
                          max="300"
                          value={priceRange[0]}
                        onChange={(e) => {
                          const newMin = parseInt(e.target.value);
                          if (newMin < priceRange[1]) {
                            setPriceRange([newMin, priceRange[1]]);
                            setCurrentPage(1);
                          }
                        }}
                          className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
                          style={{ zIndex: 2 }}
                        />
                        <input
                          type="range"
                          min="0"
                          max="300"
                          value={priceRange[1]}
                        onChange={(e) => {
                          const newMax = parseInt(e.target.value);
                          if (newMax > priceRange[0]) {
                            setPriceRange([priceRange[0], newMax]);
                            setCurrentPage(1);
                          }
                        }}
                          className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
                          style={{ zIndex: 3 }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-[#6b5d52]">
                      <span>£{priceRange[0]}</span>
                      <span>£{priceRange[1]}</span>
                    </div>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        min="0"
                        max="300"
                        value={priceRange[0]}
                        onChange={(e) => {
                          const newMin = parseInt(e.target.value) || 0;
                          if (newMin <= priceRange[1]) {
                            setPriceRange([newMin, priceRange[1]]);
                            setCurrentPage(1);
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ba9157]"
                        placeholder="Min"
                      />
                      <input
                        type="number"
                        min="0"
                        max="300"
                        value={priceRange[1]}
                        onChange={(e) => {
                          const newMax = parseInt(e.target.value) || 300;
                          if (newMax >= priceRange[0]) {
                            setPriceRange([priceRange[0], newMax]);
                            setCurrentPage(1);
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ba9157]"
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </div>

                {/* Need Help */}
                <div>
                  <h3 className="text-lg font-semibold text-[#2c2520] mb-4">Need Help?</h3>
                  <p className="text-[#6b5d52] text-sm mb-3">
                    Our skincare experts are here to help you find the perfect product.
                  </p>
                  <a href="/contact" className="text-[#ba9157] hover:text-[#a67d4a] text-sm font-medium">
                    Contact Us →
                  </a>
                </div>
              </div>
            </div>
          )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Sidebar Filters */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="space-y-8">
              {/* Categories */}
              <div>
                <h3 className="text-lg font-semibold text-[#2c2520] mb-4">Categories</h3>
                <ul className="space-y-2">
                  {categories.map((category, index) => (
                    <li key={index}>
                      <button
                        onClick={() => setSelectedCategory(category.name)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedCategory === category.name
                            ? 'bg-[#ba9157] text-white'
                            : 'text-[#6b5d52] hover:bg-gray-100'
                        }`}
                      >
                        {category.name} ({category.count})
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-lg font-semibold text-[#2c2520] mb-4">Price Range</h3>
                <div className="space-y-4">
                  <div className="relative">
                    <div className="relative h-2 bg-gray-200 rounded-lg">
                      <div 
                        className="absolute h-2 bg-[#ba9157] rounded-lg"
                        style={{
                          left: `${(priceRange[0] / 300) * 100}%`,
                          width: `${((priceRange[1] - priceRange[0]) / 300) * 100}%`
                        }}
                      ></div>
                      <input
                        type="range"
                        min="0"
                        max="300"
                        value={priceRange[0]}
                        onChange={(e) => {
                          const newMin = parseInt(e.target.value);
                          if (newMin < priceRange[1]) {
                            setPriceRange([newMin, priceRange[1]]);
                            setCurrentPage(1);
                          }
                        }}
                        className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
                        style={{ zIndex: 2 }}
                      />
                      <input
                        type="range"
                        min="0"
                        max="300"
                        value={priceRange[1]}
                        onChange={(e) => {
                          const newMax = parseInt(e.target.value);
                          if (newMax > priceRange[0]) {
                            setPriceRange([priceRange[0], newMax]);
                            setCurrentPage(1);
                          }
                        }}
                        className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
                        style={{ zIndex: 3 }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-[#6b5d52]">
                    <span>£{priceRange[0]}</span>
                    <span>£{priceRange[1]}</span>
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      min="0"
                      max="300"
                      value={priceRange[0]}
                      onChange={(e) => {
                        const newMin = parseInt(e.target.value) || 0;
                        if (newMin <= priceRange[1]) {
                          setPriceRange([newMin, priceRange[1]]);
                          setCurrentPage(1);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ba9157]"
                      placeholder="Min"
                    />
                    <input
                      type="number"
                      min="0"
                      max="300"
                      value={priceRange[1]}
                      onChange={(e) => {
                        const newMax = parseInt(e.target.value) || 300;
                        if (newMax >= priceRange[0]) {
                          setPriceRange([priceRange[0], newMax]);
                          setCurrentPage(1);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ba9157]"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>

              {/* Need Help */}
              <div>
                <h3 className="text-lg font-semibold text-[#2c2520] mb-4">Need Help?</h3>
                <p className="text-[#6b5d52] text-sm mb-3">
                  Our skincare experts are here to help you find the perfect product.
                </p>
                <a href="/contact" className="text-[#ba9157] hover:text-[#a67d4a] text-sm font-medium">
                  Contact Us →
                </a>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Desktop Sort Bar */}
            <div className="hidden lg:flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <p className="text-[#6b5d52] text-sm">
                  Showing {currentProducts.length} of {sortedProducts.length} products
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-[#ba9157] hover:text-[#a67d4a] text-sm font-medium underline"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[#6b5d52] text-sm">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#ba9157]"
                >
                  <option value="Newest">Newest</option>
                  <option value="Price Low to High">Price Low to High</option>
                  <option value="Price High to Low">Price High to Low</option>
                  <option value="Name A-Z">Name A-Z</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {currentProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                  {/* Product Image */}
                  <Link href={`/products/${product.slug || product.id}`}>
                    <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden relative">
                      {product.image && (product.image.startsWith('http') || product.image.startsWith('blob:') || product.image.startsWith('data:')) ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `
                                <div class="w-full h-full flex items-center justify-center bg-gray-200">
                                  <svg class="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                                  </svg>
                                </div>
                              `;
                            }
                          }}
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
                    
                    {/* Stock Status */}
                    {product.inStock !== undefined && (
                      <div className="flex items-center space-x-2">
                        {product.inStock ? (
                          <>
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-green-600 text-sm font-medium">
                              In Stock {product.stockCount && `(${product.stockCount})`}
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span className="text-red-600 text-sm font-medium">Out of Stock</span>
                          </>
                        )}
                      </div>
                    )}
                    
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-12">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 border rounded-lg text-sm flex items-center justify-center ${
                      currentPage === page
                        ? 'bg-[#ba9157] text-white border-[#ba9157]'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
