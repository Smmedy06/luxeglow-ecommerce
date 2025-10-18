'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Product {
  id: number;
  brand: string;
  name: string;
  price: string;
  category: string;
  image: string;
}

const products: Product[] = [
  { id: 1, brand: "ALLERGAN", name: "Juvederm Ultra 3", price: "£107.99", category: "Dermal Fillers", image: "product-1" },
  { id: 2, brand: "ALLERGAN", name: "Juvederm Voluma", price: "£143.99", category: "Dermal Fillers", image: "product-2" },
  { id: 3, brand: "GALDERMA", name: "Restylane Kysse", price: "£113.99", category: "Dermal Fillers", image: "product-3" },
  { id: 4, brand: "ALLERGAN", name: "Botox 100 Units", price: "£191.99", category: "Anti-Wrinkle Injections", image: "product-4" },
  { id: 5, brand: "GALDERMA", name: "Dysport 300 Units", price: "£167.99", category: "Anti-Wrinkle Injections", image: "product-5" },
  { id: 6, brand: "GALDERMA", name: "Azzalure 125 Units", price: "£149.99", category: "Anti-Wrinkle Injections", image: "product-6" },
  { id: 7, brand: "TEOSYAL", name: "Teosyal RHA 2", price: "£125.99", category: "Dermal Fillers", image: "product-7" },
  { id: 8, brand: "MERZ", name: "Belotero Balance", price: "£101.99", category: "Dermal Fillers", image: "product-8" },
  { id: 9, brand: "CROMA", name: "Princess Filler", price: "£95.99", category: "Dermal Fillers", image: "product-9" },
  { id: 10, brand: "FILORGA", name: "NCTF 135HA", price: "£227.99", category: "Mesotherapy", image: "product-10" },
  { id: 11, brand: "PLURYAL", name: "Pluryal Mesoline Shine", price: "£161.99", category: "Mesotherapy", image: "product-11" },
  { id: 12, brand: "DERMALAX", name: "Dermalax Hyalbag Solution", price: "£179.99", category: "Mesotherapy", image: "product-12" },
  { id: 13, brand: "PDO", name: "PDO Cog Threads 19G", price: "£59.99", category: "Thread Lifts", image: "product-13" },
  { id: 14, brand: "PDO", name: "PDO Mono Threads 30G", price: "£47.99", category: "Thread Lifts", image: "product-14" },
  { id: 15, brand: "ZO SKIN HEALTH", name: "ZO Skin Health Daily Power Defense", price: "£149.99", category: "Professional Skincare", image: "product-15" },
  { id: 16, brand: "SKINCEUTICALS", name: "SkinCeuticals CE Ferulic", price: "£179.99", category: "Professional Skincare", image: "product-16" },
  { id: 17, brand: "OBAGI", name: "Obagi Professional-C Serum 20%", price: "£161.99", category: "Professional Skincare", image: "product-17" },
  { id: 18, brand: "MEDICAL GRADE", name: "Medical Grade Cannulas 20G", price: "£41.99", category: "Medical Devices", image: "product-18" },
  { id: 19, brand: "PRECISION", name: "Precision Dermal Needles 30G", price: "£29.99", category: "Medical Devices", image: "product-19" },
  { id: 20, brand: "GALDERMA", name: "Restylane Lyft", price: "£135.99", category: "Dermal Fillers", image: "product-20" },
  { id: 21, brand: "MERZ", name: "Radiesse", price: "£189.99", category: "Dermal Fillers", image: "product-21" },
  { id: 22, brand: "GALDERMA", name: "Sculptra Aesthetic", price: "£299.99", category: "Dermal Fillers", image: "product-22" },
  { id: 23, brand: "ALLERGAN", name: "Juvederm Ultra 4", price: "£119.99", category: "Dermal Fillers", image: "product-23" },
  { id: 24, brand: "GALDERMA", name: "Restylane Defyne", price: "£129.99", category: "Dermal Fillers", image: "product-24" },
  { id: 25, brand: "TEOSYAL", name: "Teosyal RHA 3", price: "£139.99", category: "Dermal Fillers", image: "product-25" },
  { id: 26, brand: "MERZ", name: "Belotero Intense", price: "£109.99", category: "Dermal Fillers", image: "product-26" },
  { id: 27, brand: "CROMA", name: "Princess Volume", price: "£99.99", category: "Dermal Fillers", image: "product-27" },
  { id: 28, brand: "FILORGA", name: "NCTF 135HA Plus", price: "£249.99", category: "Mesotherapy", image: "product-28" },
  { id: 29, brand: "PLURYAL", name: "Pluryal Mesoline Volume", price: "£169.99", category: "Mesotherapy", image: "product-29" },
  { id: 30, brand: "DERMALAX", name: "Dermalax Hyalbag Plus", price: "£189.99", category: "Mesotherapy", image: "product-30" },
  { id: 31, brand: "PDO", name: "PDO Cog Threads 25G", price: "£69.99", category: "Thread Lifts", image: "product-31" },
  { id: 32, brand: "PDO", name: "PDO Mono Threads 25G", price: "£57.99", category: "Thread Lifts", image: "product-32" },
  { id: 33, brand: "ZO SKIN HEALTH", name: "ZO Skin Health Retinol", price: "£159.99", category: "Professional Skincare", image: "product-33" },
  { id: 34, brand: "SKINCEUTICALS", name: "SkinCeuticals Retinol", price: "£189.99", category: "Professional Skincare", image: "product-34" },
  { id: 35, brand: "OBAGI", name: "Obagi Professional-C Serum 15%", price: "£151.99", category: "Professional Skincare", image: "product-35" },
  { id: 36, brand: "MEDICAL GRADE", name: "Medical Grade Cannulas 25G", price: "£45.99", category: "Medical Devices", image: "product-36" },
  { id: 37, brand: "PRECISION", name: "Precision Dermal Needles 25G", price: "£33.99", category: "Medical Devices", image: "product-37" },
  { id: 38, brand: "GALDERMA", name: "Restylane Refyne", price: "£139.99", category: "Dermal Fillers", image: "product-38" },
  { id: 39, brand: "MERZ", name: "Radiesse Plus", price: "£199.99", category: "Dermal Fillers", image: "product-39" },
  { id: 40, brand: "ALLERGAN", name: "Botox 200 Units", price: "£379.99", category: "Anti-Wrinkle Injections", image: "product-40" },
  { id: 41, brand: "GALDERMA", name: "Dysport 500 Units", price: "£277.99", category: "Anti-Wrinkle Injections", image: "product-41" },
  { id: 42, brand: "GALDERMA", name: "Azzalure 200 Units", price: "£249.99", category: "Anti-Wrinkle Injections", image: "product-42" },
  { id: 43, brand: "TEOSYAL", name: "Teosyal RHA 4", price: "£149.99", category: "Dermal Fillers", image: "product-43" },
  { id: 44, brand: "MERZ", name: "Belotero Soft", price: "£99.99", category: "Dermal Fillers", image: "product-44" },
  { id: 45, brand: "CROMA", name: "Princess Soft", price: "£89.99", category: "Dermal Fillers", image: "product-45" }
];

const categories = [
  { name: "All Products", count: 45, active: true },
  { name: "Dermal Fillers", count: 18 },
  { name: "Anti-Wrinkle Injections", count: 6 },
  { name: "Mesotherapy", count: 6 },
  { name: "Professional Skincare", count: 6 },
  { name: "Thread Lifts", count: 4 },
  { name: "Medical Devices", count: 5 }
];

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Newest");
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const productsPerPage = 30;

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
                      <input
                        type="range"
                        min="0"
                        max="300"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, #ba9157 0%, #ba9157 ${(priceRange[1] / 300) * 100}%, #e5e7eb ${(priceRange[1] / 300) * 100}%, #e5e7eb 100%)`
                        }}
                      />
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
                        onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ba9157]"
                        placeholder="Min"
                      />
                      <input
                        type="number"
                        min="0"
                        max="300"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 300])}
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
                    <input
                      type="range"
                      min="0"
                      max="300"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #ba9157 0%, #ba9157 ${(priceRange[1] / 300) * 100}%, #e5e7eb ${(priceRange[1] / 300) * 100}%, #e5e7eb 100%)`
                      }}
                    />
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
                      onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ba9157]"
                      placeholder="Min"
                    />
                    <input
                      type="number"
                      min="0"
                      max="300"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 300])}
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
                <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                  {/* Product Image */}
                  <div className="aspect-square bg-gray-300 rounded-t-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                      <p className="text-xs">{product.image}</p>
                    </div>
                  </div>

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
                    <button className="w-full border border-[#2c2520] text-[#2c2520] py-2 px-4 rounded-lg font-medium hover:bg-[#2c2520] hover:text-white transition-colors">
                      View Details
                    </button>
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
