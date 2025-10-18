import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
         {/* Hero Section */}
         <section className="bg-[#f8f7f5] py-20">
           <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
             <p className="text-[#ba9157] text-sm font-medium uppercase tracking-wider mb-8">
               OUR STORY
             </p>
             <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[#2c2520] mb-6 leading-none">
               Where Science Meets<br />
               Natural Beauty
             </h1>
             <p className="text-base md:text-lg text-[#6b5d52] leading-relaxed max-w-3xl mx-auto">
               We believe that everyone deserves skincare that works. That's why we've dedicated ourselves to creating premium, science-backed formulations using only the finest natural ingredients.
             </p>
           </div>
         </section>

        {/* Our Story Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-[#2c2520] leading-tight">
                  Founded on a passion for healthy, radiant skin
                </h2>
                <div className="space-y-4 text-[#6b5d52] leading-relaxed">
                  <p>
                    LuxeGlow was born from a simple belief: skincare should be effective, transparent, and sustainable. Our founder, a biochemist with over 15 years of experience in cosmetic science, was frustrated by the industry's reliance on harsh chemicals and empty marketing promises.
                  </p>
                  <p>
                    In 2020, we launched with a mission to create premium skincare products that combine cutting-edge science with the power of natural ingredients. Every formula is meticulously crafted in our state-of-the-art laboratory, tested for efficacy, and packaged with care for our planet.
                  </p>
                  <p>
                    Today, LuxeGlow is trusted by thousands of customers worldwide who have discovered that healthy skin and ethical practices can go hand in hand.
                  </p>
                </div>
              </div>

              {/* Right Image */}
              <div className="relative">
                <div className="bg-gray-300 rounded-lg h-96 lg:h-[500px] flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <svg className="w-20 h-20 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm">Our Story Image</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Core Values Section */}
        <section className="py-20 bg-[#f8f7f5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#2c2520] mb-4">
                Our Core Values
              </h2>
              <p className="text-lg text-[#6b5d52] max-w-2xl mx-auto">
                These principles guide everything we do, from formulation to packaging
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Clean Ingredients */}
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-[#ba9157] rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#2c2520]">Clean Ingredients</h3>
                <p className="text-[#6b5d52] text-sm leading-relaxed">
                  No parabens, sulfates, or artificial fragrances. Only what your skin truly needs.
                </p>
              </div>

              {/* Science-Backed */}
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-[#ba9157] rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#2c2520]">Science-Backed</h3>
                <p className="text-[#6b5d52] text-sm leading-relaxed">
                  Every formula is developed and tested by our team of cosmetic scientists.
                </p>
              </div>

              {/* Cruelty-Free */}
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-[#ba9157] rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#2c2520]">Cruelty-Free</h3>
                <p className="text-[#6b5d52] text-sm leading-relaxed">
                  We never test on animals and are proud to be certified cruelty-free.
                </p>
              </div>

              {/* Community First */}
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-[#ba9157] rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#2c2520]">Community First</h3>
                <p className="text-[#6b5d52] text-sm leading-relaxed">
                  We listen to our customers and continuously improve based on your feedback.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sustainability Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left Image */}
              <div className="order-2 lg:order-1">
                <div className="bg-gray-300 rounded-lg h-96 lg:h-[500px] flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <svg className="w-20 h-20 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm">Sustainability Image</p>
                  </div>
                </div>
              </div>

              {/* Right Content */}
              <div className="order-1 lg:order-2 space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-[#2c2520] leading-tight">
                  Sustainability at Our Core
                </h2>
                <p className="text-lg text-[#6b5d52] leading-relaxed">
                  We're committed to reducing our environmental impact. All our packaging is recyclable or biodegradable, and we're constantly working to minimize waste throughout our supply chain.
                </p>
                
                <div className="space-y-4">
                  {/* 100% Recyclable Packaging */}
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-[#ba9157] rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#2c2520] mb-1">100% Recyclable Packaging</h3>
                      <p className="text-[#6b5d52] text-sm">All bottles, jars, and boxes can be recycled</p>
                    </div>
                  </div>

                  {/* Carbon-Neutral Shipping */}
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-[#ba9157] rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#2c2520] mb-1">Carbon-Neutral Shipping</h3>
                      <p className="text-[#6b5d52] text-sm">We offset all shipping emissions</p>
                    </div>
                  </div>

                  {/* Ethically Sourced */}
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-[#ba9157] rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#2c2520] mb-1">Ethically Sourced</h3>
                      <p className="text-[#6b5d52] text-sm">All ingredients are sustainably and ethically sourced</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-[#f8f7f5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#2c2520] mb-4">
                Meet Our Expert Team
              </h2>
              <p className="text-lg text-[#6b5d52] max-w-2xl mx-auto">
                Our passionate team of scientists, researchers, and skincare experts work tirelessly to bring you the best in clean beauty.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Team Member 1 */}
              <div className="text-center space-y-4">
                <div className="w-32 h-32 mx-auto bg-gray-300 rounded-full flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#2c2520]">Dr. Sarah Chen</h3>
                <p className="text-[#ba9157] font-medium">Chief Scientific Officer</p>
                <p className="text-[#6b5d52] text-sm">
                  PhD in Biochemistry with 15+ years in cosmetic science. Leads our research and development team.
                </p>
              </div>

              {/* Team Member 2 */}
              <div className="text-center space-y-4">
                <div className="w-32 h-32 mx-auto bg-gray-300 rounded-full flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#2c2520]">Marcus Rodriguez</h3>
                <p className="text-[#ba9157] font-medium">Head of Formulation</p>
                <p className="text-[#6b5d52] text-sm">
                  Master's in Organic Chemistry. Specializes in natural ingredient extraction and formulation.
                </p>
              </div>

              {/* Team Member 3 */}
              <div className="text-center space-y-4">
                <div className="w-32 h-32 mx-auto bg-gray-300 rounded-full flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#2c2520]">Dr. Emily Watson</h3>
                <p className="text-[#ba9157] font-medium">Quality Assurance Director</p>
                <p className="text-[#6b5d52] text-sm">
                  PhD in Pharmaceutical Sciences. Ensures every product meets our highest quality standards.
                </p>
              </div>
            </div>
          </div>
        </section>

         {/* Call to Action Section */}
         <section className="py-20 bg-[#2c2520]">
           <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
             <h2 className="text-3xl md:text-4xl font-semibold text-white mb-6 leading-tight">
               Join the LuxeGlow Community
             </h2>
             <p className="text-lg text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto">
               Experience the difference that clean, effective skincare can make. Your journey to radiant skin starts here.
             </p>
             <a
               href="/shop"
               className="inline-flex items-center bg-white text-[#2c2520] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
             >
               Shop Our Collection
             </a>
           </div>
         </section>
      </main>

      <Footer />
    </div>
  );
}
