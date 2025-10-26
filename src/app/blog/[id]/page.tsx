'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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
    content: `Vitamin C is one of the most researched and effective ingredients in skincare, and for good reason. This powerful antioxidant offers numerous benefits that can transform your skin's appearance and health.

## What is Vitamin C?

Vitamin C, also known as ascorbic acid, is a water-soluble vitamin that plays a crucial role in collagen synthesis, skin repair, and protection against environmental damage. Unlike many other vitamins, our bodies cannot produce Vitamin C naturally, so we must obtain it through diet and topical application.

## Key Benefits for Your Skin

### 1. Collagen Production
Vitamin C is essential for collagen synthesis, the protein that gives skin its structure and firmness. As we age, collagen production naturally decreases, leading to fine lines and wrinkles. Topical Vitamin C can help stimulate collagen production, resulting in firmer, more youthful-looking skin.

### 2. Antioxidant Protection
Vitamin C is a powerful antioxidant that neutralizes free radicals caused by UV exposure, pollution, and other environmental stressors. This protection helps prevent premature aging and maintains skin health.

### 3. Brightening and Even Skin Tone
Vitamin C inhibits the production of melanin, helping to fade dark spots, hyperpigmentation, and uneven skin tone. Regular use can result in a brighter, more radiant complexion.

### 4. Wound Healing
Vitamin C plays a crucial role in wound healing and skin repair, making it beneficial for those with acne scars or other skin damage.

## How to Choose the Right Vitamin C Product

When selecting a Vitamin C product, consider these factors:

- **Concentration**: Look for products containing 10-20% Vitamin C for optimal effectiveness
- **Stability**: Choose products with stable forms of Vitamin C like L-ascorbic acid or magnesium ascorbyl phosphate
- **Packaging**: Opt for products in opaque, airtight containers to prevent oxidation
- **pH Level**: Effective Vitamin C products typically have a pH between 2.5-3.5

## Incorporating Vitamin C into Your Routine

For best results, apply Vitamin C in the morning after cleansing and before moisturizing. Always follow with sunscreen, as Vitamin C can increase sun sensitivity. Start with a lower concentration and gradually increase as your skin adjusts.

## Conclusion

Vitamin C is a skincare powerhouse that offers multiple benefits for healthy, radiant skin. By understanding its science and choosing the right products, you can harness its power to achieve your skincare goals.`,
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
    content: `Dermal fillers have revolutionized the aesthetics industry, offering safe and effective solutions for facial volume loss, wrinkles, and contouring. This comprehensive guide covers everything you need to know about dermal fillers.

## What Are Dermal Fillers?

Dermal fillers are injectable treatments that add volume to the skin, smooth wrinkles, and enhance facial features. They're made from various materials, with hyaluronic acid being the most common and safest option.

## Types of Dermal Fillers

### Hyaluronic Acid Fillers
- **Most popular and safest option**
- **Natural substance found in the body**
- **Reversible with hyaluronidase**
- **Lasts 6-18 months**

### Calcium Hydroxyapatite Fillers
- **Longer-lasting results**
- **Stimulates collagen production**
- **Best for deeper wrinkles**
- **Lasts 12-18 months**

### Poly-L-lactic Acid Fillers
- **Stimulates collagen over time**
- **Gradual, natural-looking results**
- **Lasts up to 2 years**

## Common Treatment Areas

### Lips
- **Lip augmentation**
- **Lip line smoothing**
- **Lip shape correction**

### Cheeks
- **Cheekbone enhancement**
- **Volume restoration**
- **Facial contouring**

### Under Eyes
- **Tear trough correction**
- **Dark circle improvement**
- **Eye bag reduction**

### Nasolabial Folds
- **Smile line smoothing**
- **Marionette line correction**

## The Treatment Process

### Consultation
Your practitioner will assess your facial structure, discuss your goals, and recommend the best treatment plan.

### Preparation
The treatment area is cleaned and may be numbed with topical anesthetic.

### Injection
The filler is carefully injected using fine needles or cannulas.

### Aftercare
You'll receive specific instructions for optimal results and minimal downtime.

## Recovery and Results

Most patients experience minimal downtime with hyaluronic acid fillers. You may have slight swelling or bruising for a few days. Results are immediate and continue to improve over the following weeks.

## Safety Considerations

Dermal fillers are generally safe when administered by qualified professionals. Choose practitioners with proper training and certification. Always discuss your medical history and any medications you're taking.

## Conclusion

Dermal fillers offer a safe and effective way to enhance your natural beauty. With proper research and professional treatment, you can achieve beautiful, natural-looking results that boost your confidence.`,
    author: "Dr. Emily Chen",
    authorImage: "author-2",
    publishDate: "2024-01-12",
    readTime: "8 min read",
    category: "Aesthetics",
    image: "blog-2",
    featured: true,
    tags: ["Dermal Fillers", "Aesthetics", "Beauty", "Treatment"]
  }
];

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const postId = parseInt(params.id as string);
    const foundPost = blogPosts.find(p => p.id === postId);
    
    if (foundPost) {
      setPost(foundPost);
    } else {
      // Generate a fallback post for any ID
      setPost({
        id: postId,
        title: `Blog Post ${postId}`,
        excerpt: "This is a sample blog post about skincare and beauty.",
        content: `# Welcome to Our Blog

This is a sample blog post about skincare and beauty. In a real application, this content would be dynamically loaded from a CMS or database.

## Key Points

- Professional skincare advice
- Latest beauty trends
- Expert insights and tips
- Product recommendations

## Conclusion

Thank you for reading our blog. We hope you found this information helpful for your skincare journey.`,
        author: "LuxeGlow Team",
        authorImage: "author-default",
        publishDate: "2024-01-01",
        readTime: "3 min read",
        category: "General",
        image: "blog-default",
        featured: false,
        tags: ["Skincare", "Beauty", "Tips"]
      });
    }
    
    setIsLoading(false);
  }, [params.id]);

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
          <p className="text-[#6b5d52] mb-8">The blog post you're looking for doesn't exist.</p>
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
          <div className="mb-4">
            <span className="bg-[#ba9157] text-white px-3 py-1 rounded-full text-sm font-medium">
              {post.category}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#2c2520] mb-4 leading-tight">
            {post.title}
          </h1>
          <p className="text-xl text-[#6b5d52] mb-6 leading-relaxed">
            {post.excerpt}
          </p>
          
          {/* Author Info */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[#ba9157] rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {post.author.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <p className="font-semibold text-[#2c2520]">{post.author}</p>
                <p className="text-sm text-[#6b5d52]">{post.publishDate} • {post.readTime}</p>
              </div>
            </div>
            
            {/* Share Buttons */}
            <div className="flex items-center space-x-3">
              <button className="p-2 text-[#6b5d52] hover:text-[#ba9157] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
                </svg>
              </button>
              <button className="p-2 text-[#6b5d52] hover:text-[#ba9157] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Article Image */}
        <div className="mb-8">
          <div className="aspect-video bg-gradient-to-br from-[#ba9157] to-[#a67d4a] rounded-xl flex items-center justify-center">
            <div className="text-center text-white">
              <svg className="w-20 h-20 mx-auto mb-4 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              <p className="text-lg font-medium">Article Image</p>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none">
          <div className="text-[#2c2520] leading-relaxed">
            {post.content.split('\n').map((paragraph, index) => {
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
              } else if (paragraph.startsWith('- ')) {
                return (
                  <li key={index} className="mb-2">
                    {paragraph.replace('- ', '')}
                  </li>
                );
              } else if (paragraph.trim() === '') {
                return <br key={index} />;
              } else {
                return (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                );
              }
            })}
          </div>
        </article>

        {/* Tags */}
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

        {/* Related Posts */}
        <section className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-[#2c2520] mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogPosts
              .filter(p => p.id !== post.id && p.category === post.category)
              .slice(0, 2)
              .map((relatedPost) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.id}`} className="group">
                  <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-semibold text-[#2c2520] group-hover:text-[#ba9157] transition-colors mb-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-[#6b5d52] text-sm mb-3">
                      {relatedPost.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-[#6b5d52]">
                      <span>{relatedPost.readTime}</span>
                      <span>{relatedPost.publishDate}</span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </section>

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
