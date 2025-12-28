import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#f8f7f5] flex items-center justify-center px-4">
        <div className="text-center max-w-2xl">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-[#ba9157] mb-4">404</h1>
            <h2 className="text-4xl md:text-5xl font-bold text-[#2c2520] mb-4">
              Page Not Found
            </h2>
            <p className="text-lg text-[#6b5d52] mb-8">
              Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or the URL might be incorrect.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/"
              className="px-8 py-3 bg-[#ba9157] text-white rounded-lg font-medium hover:bg-[#a67d4a] transition-colors"
            >
              Go to Homepage
            </Link>
            <Link
              href="/shop"
              className="px-8 py-3 border-2 border-[#2c2520] text-[#2c2520] rounded-lg font-medium hover:bg-[#2c2520] hover:text-white transition-colors"
            >
              Browse Products
            </Link>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-[#6b5d52] mb-4">Popular Pages:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/shop" className="text-[#ba9157] hover:text-[#a67d4a] transition-colors">
                Shop
              </Link>
              <Link href="/about" className="text-[#ba9157] hover:text-[#a67d4a] transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-[#ba9157] hover:text-[#a67d4a] transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

