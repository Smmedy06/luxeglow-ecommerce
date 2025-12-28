'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  category: string | null;
  tags: string[] | null;
  published_at: string | null;
  created_at: string;
  views: number;
  author_name?: string;
}

// Calculate read time based on content length
const calculateReadTime = (content: string): string => {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
};

// Format date
const formatDate = (dateString: string | null): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
};

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All Posts");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    setIsLoading(true);
    try {
      // Fetch published blogs
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading blogs:', error);
      } else if (data) {
        interface SupabaseBlog {
          id: number;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string;
          featured_image: string | null;
          category: string | null;
          tags: string[] | null;
          published_at: string | null;
          created_at: string;
          views: number;
          author_id: string | null;
        }

        interface UserProfile {
          user_id: string;
          full_name: string;
        }

        // Get unique author IDs
        const blogs = data as SupabaseBlog[];
        const authorIds = blogs.map((blog) => blog.author_id).filter(Boolean) as string[];
        
        // Fetch author names from user_profiles
        let profilesMap = new Map<string, string>();
        if (authorIds.length > 0) {
          const { data: profiles } = await supabase
            .from('user_profiles')
            .select('user_id, full_name')
            .in('user_id', authorIds);
          
          if (profiles) {
            profilesMap = new Map((profiles as UserProfile[]).map((p) => [p.user_id, p.full_name]));
          }
        }

        // Transform the data to match our interface
        const transformedPosts: BlogPost[] = blogs.map((blog): BlogPost => {
          // Get author name from user_profiles
          let authorName = 'LuxeGlow Team';
          if (blog.author_id && profilesMap.has(blog.author_id)) {
            authorName = profilesMap.get(blog.author_id) || 'LuxeGlow Team';
          }

          return {
            id: blog.id,
            title: blog.title,
            slug: blog.slug,
            excerpt: blog.excerpt,
            content: blog.content,
            featured_image: blog.featured_image,
            category: blog.category,
            tags: blog.tags || null,
            published_at: blog.published_at,
            created_at: blog.created_at,
            views: blog.views,
            author_name: authorName,
          };
        });

        setBlogPosts(transformedPosts);
      }
    } catch (error) {
      console.error('Error loading blogs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get unique categories from blog posts
  const categories = [
    "All Posts",
    ...Array.from(new Set(blogPosts.map(post => post.category).filter(Boolean))) as string[]
  ];

  // Filter posts
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "All Posts" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  // Featured posts (first 2 published posts, or posts with "featured" in tags)
  const featuredPosts = blogPosts
    .filter(post => post.tags && post.tags.some(tag => tag.toLowerCase().includes('featured')))
    .slice(0, 2);
  
  // If no featured posts, use first 2 published posts
  const displayFeaturedPosts = featuredPosts.length > 0 ? featuredPosts : blogPosts.slice(0, 2);
  const regularPosts = filteredPosts.filter(post => 
    !displayFeaturedPosts.some(featured => featured.id === post.id)
  );

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-64"></div>
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
                  {category || 'Uncategorized'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Posts */}
        {selectedCategory === "All Posts" && displayFeaturedPosts.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-[#2c2520] mb-8">Featured Articles</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {displayFeaturedPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="aspect-video relative">
                    {post.featured_image ? (
                      post.featured_image.startsWith('http') || post.featured_image.startsWith('/') ? (
                        <Image
                          src={post.featured_image}
                          alt={post.title}
                          fill
                          className="object-cover"
                          unoptimized={post.featured_image.startsWith('http')}
                        />
                      ) : (
                        <Image
                          src={post.featured_image}
                          alt={post.title}
                          fill
                          className="object-cover"
                          unoptimized={post.featured_image.startsWith('blob:') || post.featured_image.startsWith('data:')}
                        />
                      )
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#ba9157] to-[#a67d4a] flex items-center justify-center">
                        <div className="text-center text-white">
                          <svg className="w-16 h-16 mx-auto mb-4 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                          </svg>
                          <p className="text-sm opacity-90">Featured Article</p>
                        </div>
                      </div>
                    )}
                    {post.category && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-[#ba9157] text-white px-3 py-1 rounded-full text-sm font-medium">
                          {post.category}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#2c2520] mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-[#6b5d52] mb-4 line-clamp-3">
                      {post.excerpt || post.content.substring(0, 150) + '...'}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-[#ba9157] rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {post.author_name?.split(' ').map(n => n[0]).join('') || 'LG'}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#2c2520]">{post.author_name}</p>
                          <p className="text-xs text-[#6b5d52]">{formatDate(post.published_at || post.created_at)}</p>
                        </div>
                      </div>
                      <Link
                        href={`/blog/${post.slug || post.id}`}
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
            {selectedCategory === "All Posts" ? "All Articles" : selectedCategory || "All Articles"}
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
                    {post.featured_image ? (
                      post.featured_image.startsWith('http') || post.featured_image.startsWith('/') ? (
                        <Image
                          src={post.featured_image}
                          alt={post.title}
                          fill
                          className="object-cover"
                          unoptimized={post.featured_image.startsWith('http')}
                        />
                      ) : (
                        <Image
                          src={post.featured_image}
                          alt={post.title}
                          fill
                          className="object-cover"
                          unoptimized={post.featured_image.startsWith('blob:') || post.featured_image.startsWith('data:')}
                        />
                      )
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <div className="text-center text-gray-600">
                          <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                          </svg>
                          <p className="text-xs">Article Image</p>
                        </div>
                      </div>
                    )}
                    {post.category && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-white text-[#ba9157] px-2 py-1 rounded-full text-xs font-medium shadow-sm">
                          {post.category}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-[#2c2520] mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-[#6b5d52] text-sm mb-4 line-clamp-3">
                      {post.excerpt || post.content.substring(0, 120) + '...'}
                    </p>
                    <div className="flex items-center justify-between text-xs text-[#6b5d52] mb-4">
                      <span>{calculateReadTime(post.content)}</span>
                      <span>{formatDate(post.published_at || post.created_at)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-[#ba9157] rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-medium">
                            {post.author_name?.split(' ').map(n => n[0]).join('') || 'LG'}
                          </span>
                        </div>
                        <span className="text-sm text-[#2c2520]">{post.author_name}</span>
                      </div>
                      <Link
                        href={`/blog/${post.slug || post.id}`}
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
        <section className="mt-16 bg-gradient-to-r from-[#ba9157] to-[#a67d4a] rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Get the latest skincare tips, beauty trends, and exclusive offers delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 py-3.5 rounded-lg border-0 bg-white text-[#2c2520] placeholder-gray-400 focus:outline-none transition-all"
            />
            <button className="bg-white text-[#ba9157] px-8 py-3.5 rounded-lg font-semibold hover:bg-gray-50 transition-colors whitespace-nowrap shadow-sm">
              Subscribe
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
