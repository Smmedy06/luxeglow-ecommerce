'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorImage: string;
  publishDate: string;
  readTime: string;
  category: string;
  image: string;
  featured: boolean;
  tags: string[];
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "The Science Behind Vitamin C: Why It's Essential for Radiant Skin",
    excerpt: "Discover the powerful benefits of Vitamin C in skincare and how it transforms your skin's appearance.",
    content: "Vitamin C is one of the most researched and effective ingredients in skincare...",
    author: "Dr. Sarah Mitchell",
    authorImage: "author-1",
    publishDate: "2024-01-15",
    readTime: "5 min read",
    category: "Skincare Science",
    image: "blog-1",
    featured: true,
    tags: ["Vitamin C", "Skincare", "Anti-aging", "Science"]
  },
  {
    id: 2,
    title: "Complete Guide to Dermal Fillers: What You Need to Know",
    excerpt: "Everything you need to know about dermal fillers, from types to aftercare tips.",
    content: "Dermal fillers have revolutionized the aesthetics industry...",
    author: "Dr. Emily Chen",
    authorImage: "author-2",
    publishDate: "2024-01-12",
    readTime: "8 min read",
    category: "Aesthetics",
    image: "blog-2",
    featured: true,
    tags: ["Dermal Fillers", "Aesthetics", "Beauty", "Treatment"]
  },
  {
    id: 3,
    title: "Morning vs Evening Skincare Routines: Optimizing Your Regimen",
    excerpt: "Learn how to create the perfect morning and evening skincare routines for maximum results.",
    content: "Your skin has different needs throughout the day...",
    author: "Lisa Thompson",
    authorImage: "author-3",
    publishDate: "2024-01-10",
    readTime: "6 min read",
    category: "Skincare Tips",
    image: "blog-3",
    featured: false,
    tags: ["Skincare Routine", "Morning", "Evening", "Tips"]
  },
  {
    id: 4,
    title: "Understanding Skin Types: Finding Your Perfect Match",
    excerpt: "Identify your skin type and learn how to choose products that work best for you.",
    content: "Understanding your skin type is the foundation of effective skincare...",
    author: "Dr. Michael Rodriguez",
    authorImage: "author-4",
    publishDate: "2024-01-08",
    readTime: "7 min read",
    category: "Skincare Basics",
    image: "blog-4",
    featured: false,
    tags: ["Skin Types", "Skincare Basics", "Products", "Guide"]
  },
  {
    id: 5,
    title: "The Future of Aesthetic Treatments: Trends to Watch",
    excerpt: "Explore the latest trends and innovations in aesthetic treatments and skincare technology.",
    content: "The aesthetic industry is constantly evolving with new technologies...",
    author: "Dr. Amanda Foster",
    authorImage: "author-5",
    publishDate: "2024-01-05",
    readTime: "9 min read",
    category: "Industry Trends",
    image: "blog-5",
    featured: false,
    tags: ["Aesthetics", "Technology", "Trends", "Innovation"]
  },
  {
    id: 6,
    title: "Natural vs Synthetic Ingredients: Making Informed Choices",
    excerpt: "Compare natural and synthetic skincare ingredients to make informed decisions about your products.",
    content: "The debate between natural and synthetic ingredients continues...",
    author: "Dr. Jennifer Lee",
    authorImage: "author-6",
    publishDate: "2024-01-03",
    readTime: "6 min read",
    category: "Ingredients",
    image: "blog-6",
    featured: false,
    tags: ["Natural", "Synthetic", "Ingredients", "Comparison"]
  }
];

const categories = [
  "All Posts",
  "Skincare Science",
  "Aesthetics",
  "Skincare Tips",
  "Skincare Basics",
  "Industry Trends",
  "Ingredients"
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Posts");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "All Posts" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#f8f7f5] to-[#f0ede8] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#2c2520] mb-6">
              LuxeGlow Blog
            </h1>
            <p className="text-xl text-[#6b5d52] max-w-3xl mx-auto leading-relaxed">
              Discover expert insights, skincare tips, and the latest trends in beauty and aesthetics. 
              Your journey to radiant, healthy skin starts here.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ba9157] focus:border-transparent"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-[#ba9157] text-white'
                      : 'bg-gray-100 text-[#6b5d52] hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Posts */}
        {selectedCategory === "All Posts" && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-[#2c2520] mb-8">Featured Articles</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="aspect-video relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#ba9157] to-[#a67d4a] flex items-center justify-center">
                      <div className="text-center text-white">
                        <svg className="w-16 h-16 mx-auto mb-4 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm opacity-90">Featured Article</p>
                      </div>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#ba9157] text-white px-3 py-1 rounded-full text-sm font-medium">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#2c2520] mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-[#6b5d52] mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-[#ba9157] rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {post.author.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#2c2520]">{post.author}</p>
                          <p className="text-xs text-[#6b5d52]">{post.publishDate}</p>
                        </div>
                      </div>
                      <Link
                        href={`/blog/${post.id}`}
                        className="text-[#ba9157] hover:text-[#a67d4a] font-medium text-sm"
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Regular Posts */}
        <section>
          <h2 className="text-3xl font-bold text-[#2c2520] mb-8">
            {selectedCategory === "All Posts" ? "All Articles" : selectedCategory}
          </h2>
          
          {regularPosts.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-xl font-semibold text-[#2c2520] mb-2">No articles found</h3>
              <p className="text-[#6b5d52]">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="aspect-video relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <div className="text-center text-gray-600">
                        <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                        <p className="text-xs">Article Image</p>
                      </div>
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className="bg-white text-[#ba9157] px-2 py-1 rounded-full text-xs font-medium shadow-sm">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-[#2c2520] mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-[#6b5d52] text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-[#6b5d52] mb-4">
                      <span>{post.readTime}</span>
                      <span>{post.publishDate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-[#ba9157] rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-medium">
                            {post.author.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span className="text-sm text-[#2c2520]">{post.author}</span>
                      </div>
                      <Link
                        href={`/blog/${post.id}`}
                        className="text-[#ba9157] hover:text-[#a67d4a] font-medium text-sm"
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Newsletter Signup */}
        <section className="mt-16 bg-gradient-to-r from-[#ba9157] to-[#a67d4a] rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Get the latest skincare tips, beauty trends, and exclusive offers delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button className="bg-white text-[#ba9157] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
