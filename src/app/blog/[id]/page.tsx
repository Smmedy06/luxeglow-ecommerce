'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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

// Calculate read time
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

// Parse markdown-like content
const parseContent = (content: string) => {
  return content.split('\n').map((paragraph, index) => {
    if (paragraph.startsWith('# ')) {
      return (
        <h1 key={index} className="text-3xl font-bold text-[#2c2520] mb-6 mt-8">
          {paragraph.replace('# ', '')}
        </h1>
      );
    } else if (paragraph.startsWith('## ')) {
      return (
        <h2 key={index} className="text-2xl font-bold text-[#2c2520] mb-4 mt-6">
          {paragraph.replace('## ', '')}
        </h2>
      );
    } else if (paragraph.startsWith('### ')) {
      return (
        <h3 key={index} className="text-xl font-semibold text-[#2c2520] mb-3 mt-5">
          {paragraph.replace('### ', '')}
        </h3>
      );
    } else if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
      return (
        <li key={index} className="mb-2 ml-6 list-disc">
          {paragraph.replace(/^[-*] /, '')}
        </li>
      );
    } else if (paragraph.trim() === '') {
      return <br key={index} />;
    } else {
      return (
        <p key={index} className="mb-4 text-[#6b5d52] leading-relaxed">
          {paragraph}
        </p>
      );
    }
  });
};

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      loadBlogPost(params.id as string);
    }
  }, [params.id]);

  const loadBlogPost = async (idOrSlug: string) => {
    setIsLoading(true);
    try {
      // Try to find by slug first, then by ID
      const isNumeric = !isNaN(Number(idOrSlug));
      
      let query = supabase
        .from('blogs')
        .select('*')
        .eq('is_published', true);

      if (isNumeric) {
        query = query.eq('id', parseInt(idOrSlug));
      } else {
        query = query.eq('slug', idOrSlug);
      }

      const { data, error } = await query.single();

      if (error || !data) {
        console.error('Error loading blog post:', error);
        setIsLoading(false);
        return;
      }

      // Get author name from user_profiles if available
      let authorName = 'LuxeGlow Team';
      if (data.author_id) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('full_name')
          .eq('user_id', data.author_id)
          .single();
        
        if (profile?.full_name) {
          authorName = profile.full_name;
        }
      }

      const blogPost: BlogPost = {
        id: data.id,
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        featured_image: data.featured_image,
        category: data.category,
        tags: data.tags || [],
        published_at: data.published_at,
        created_at: data.created_at,
        views: data.views || 0,
        author_name: authorName,
      };

      setPost(blogPost);

      // Increment view count
      await supabase
        .from('blogs')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', data.id);

      // Load related posts (same category, excluding current post)
      if (data.category) {
        const { data: relatedData } = await supabase
          .from('blogs')
          .select('*')
          .eq('is_published', true)
          .eq('category', data.category)
          .neq('id', data.id)
          .order('published_at', { ascending: false, nullsFirst: false })
          .limit(2);

        if (relatedData) {
          // Fetch author names for related posts
          const authorIds = relatedData.map(b => b.author_id).filter(Boolean);
          const { data: profiles } = await supabase
            .from('user_profiles')
            .select('user_id, full_name')
            .in('user_id', authorIds);

          const profilesMap = new Map(profiles?.map(p => [p.user_id, p.full_name]) || []);

          const transformedRelated: BlogPost[] = relatedData.map((blog: any) => {
            let relatedAuthorName = 'LuxeGlow Team';
            if (blog.author_id && profilesMap.has(blog.author_id)) {
              relatedAuthorName = profilesMap.get(blog.author_id) || 'LuxeGlow Team';
            }

            return {
              id: blog.id,
              title: blog.title,
              slug: blog.slug,
              excerpt: blog.excerpt,
              content: blog.content,
              featured_image: blog.featured_image,
              category: blog.category,
              tags: blog.tags || [],
              published_at: blog.published_at,
              created_at: blog.created_at,
              views: blog.views || 0,
              author_name: relatedAuthorName,
            };
          });

          setRelatedPosts(transformedRelated);
        }
      }
    } catch (error) {
      console.error('Error loading blog post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-3xl font-bold text-[#2c2520] mb-4">Post Not Found</h1>
          <p className="text-[#6b5d52] mb-8">The blog post you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/blog" className="bg-[#ba9157] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#a67d4a] transition-colors">
            Back to Blog
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-[#6b5d52]">
            <Link href="/" className="hover:text-[#ba9157]">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-[#ba9157]">Blog</Link>
            <span>/</span>
            <span className="text-[#2c2520]">{post.title}</span>
          </div>
        </nav>

        {/* Article Header */}
        <header className="mb-8">
          {post.category && (
            <div className="mb-4">
              <span className="bg-[#ba9157] text-white px-3 py-1 rounded-full text-sm font-medium">
                {post.category}
              </span>
            </div>
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-[#2c2520] mb-4 leading-tight">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-xl text-[#6b5d52] mb-6 leading-relaxed">
              {post.excerpt}
            </p>
          )}
          
          {/* Author Info */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[#ba9157] rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {post.author_name?.split(' ').map(n => n[0]).join('') || 'LG'}
                </span>
              </div>
              <div>
                <p className="font-semibold text-[#2c2520]">{post.author_name}</p>
                <p className="text-sm text-[#6b5d52]">
                  {formatDate(post.published_at || post.created_at)} • {calculateReadTime(post.content)}
                </p>
              </div>
            </div>
            
            {/* Share Buttons */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: post.title,
                      text: post.excerpt || '',
                      url: window.location.href,
                    });
                  }
                }}
                className="p-2 text-[#6b5d52] hover:text-[#ba9157] transition-colors"
                aria-label="Share article"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Article Image */}
        {post.featured_image && (
          <div className="mb-8">
            <div className="aspect-video relative rounded-xl overflow-hidden">
              {post.featured_image.startsWith('http') || post.featured_image.startsWith('/') ? (
                <Image
                  src={post.featured_image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  unoptimized={post.featured_image.startsWith('http')}
                />
              ) : (
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>
        )}

        {/* Article Content */}
        <article className="prose prose-lg max-w-none">
          <div className="text-[#2c2520] leading-relaxed">
            {parseContent(post.content)}
          </div>
        </article>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-[#2c2520] mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="bg-gray-100 text-[#6b5d52] px-3 py-1 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-[#2c2520] mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.slug || relatedPost.id}`} className="group">
                  <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-semibold text-[#2c2520] group-hover:text-[#ba9157] transition-colors mb-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-[#6b5d52] text-sm mb-3">
                      {relatedPost.excerpt || relatedPost.content.substring(0, 120) + '...'}
                    </p>
                    <div className="flex items-center justify-between text-xs text-[#6b5d52]">
                      <span>{calculateReadTime(relatedPost.content)}</span>
                      <span>{formatDate(relatedPost.published_at || relatedPost.created_at)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Back to Blog */}
        <div className="mt-8 text-center">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-[#ba9157] hover:text-[#a67d4a] font-medium transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to All Articles
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
