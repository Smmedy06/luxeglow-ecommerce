import Link from 'next/link';

const principles = [
  {
    number: "01",
    title: "Science-Backed",
    description: "Formulated with proven active ingredients"
  },
  {
    number: "02", 
    title: "Clean Formula",
    description: "No harmful chemicals or artificial fragrances"
  },
  {
    number: "03",
    title: "Sustainable",
    description: "Eco-friendly packaging and ethical sourcing"
  }
];

export default function PhilosophySection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left - Image */}
          <div className="order-2 lg:order-1">
            <div className="bg-gray-300 rounded-lg h-96 lg:h-[500px] flex items-center justify-center">
              <div className="text-center text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                <p className="text-sm">Philosophy Image</p>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="order-1 lg:order-2 space-y-8">
            <div className="space-y-4">
              <p className="text-[#ba9157] text-sm font-medium uppercase tracking-wider">
                OUR PHILOSOPHY
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-[#2c2520] leading-tight">
                Clean Beauty, Real Results
              </h2>
              <p className="text-lg text-[#6b5d52] leading-relaxed">
                We believe in transparency and efficacy. Every product is formulated with premium, clinically-proven ingredients that work in harmony with your skin.
              </p>
            </div>

            {/* Principles */}
            <div className="space-y-6">
              {principles.map((principle, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <span className="text-2xl font-bold text-[#ba9157]">
                      {principle.number}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#2c2520] mb-1">
                      {principle.title}
                    </h3>
                    <p className="text-[#6b5d52]">
                      {principle.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Link
                href="/about"
                className="inline-flex items-center border border-[#2c2520] text-[#2c2520] px-8 py-3 rounded-lg font-medium hover:bg-[#2c2520] hover:text-white transition-colors"
              >
                Learn More About Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
