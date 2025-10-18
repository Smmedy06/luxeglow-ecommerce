import Link from 'next/link';

export default function CallToAction() {
  return (
    <section className="py-20 bg-[#2c2520]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          <h2 className="text-3xl md:text-4xl font-semibold text-white leading-tight">
            Ready to Transform Your Skin?
          </h2>
          <p className="text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
            Join thousands of satisfied customers who have discovered their best skin yet.
          </p>
          <div className="pt-4">
            <Link
              href="/shop"
              className="inline-flex items-center bg-white text-[#2c2520] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Start Your Journey
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
