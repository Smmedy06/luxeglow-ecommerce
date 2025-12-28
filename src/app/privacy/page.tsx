import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy, Terms & Cookies | LuxeGlow',
  description: 'Read LuxeGlow\'s Privacy Policy, Terms of Service, and Cookie Policy. Learn how we protect your data and your rights as a customer.',
  keywords: 'privacy policy, terms of service, cookie policy, data protection, GDPR, LuxeGlow',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-[#f8f7f5] py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-[#ba9157] text-sm font-medium uppercase tracking-wider mb-8">
              LEGAL INFORMATION
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[#2c2520] mb-6 leading-tight">
              Privacy Policy, Terms & Cookies
            </h1>
            <p className="text-base md:text-lg text-[#6b5d52] leading-relaxed max-w-3xl mx-auto">
              Your privacy and rights are important to us. Please review our policies below.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Privacy Policy Section */}
            <div id="privacy" className="mb-16 scroll-mt-20">
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-[#2c2520] mb-4">
                  Privacy Policy
                </h2>
                <p className="text-sm text-[#6b5d52]">
                  Last Updated: January 2024
                </p>
              </div>

              <div className="space-y-6 text-[#6b5d52] leading-relaxed">
                <div>
                  <h3 className="text-xl font-semibold text-[#2c2520] mb-3">1. Introduction</h3>
                  <p>
                    LuxeGlow (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#2c2520] mb-3">2. Information We Collect</h3>
                  <p className="mb-2">We collect information that you provide directly to us, including:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Personal identification information (name, email address, phone number)</li>
                    <li>Shipping and billing addresses</li>
                    <li>Payment information (processed securely through our payment providers)</li>
                    <li>Account credentials and preferences</li>
                    <li>Communications with us (customer service inquiries, feedback)</li>
                  </ul>
                  <p className="mt-3">
                    We also automatically collect certain information when you visit our website, such as your IP address, browser type, device information, and browsing patterns.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#2c2520] mb-3">3. How We Use Your Information</h3>
                  <p className="mb-2">We use the information we collect to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Process and fulfill your orders</li>
                    <li>Communicate with you about your orders and account</li>
                    <li>Send you marketing communications (with your consent)</li>
                    <li>Improve our website and services</li>
                    <li>Detect and prevent fraud</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#2c2520] mb-3">4. Information Sharing</h3>
                  <p>
                    We do not sell your personal information. We may share your information with trusted third-party service providers who assist us in operating our website, conducting our business, or serving our customers, provided they agree to keep this information confidential.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#2c2520] mb-3">5. Data Security</h3>
                  <p>
                    We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#2c2520] mb-3">6. Your Rights</h3>
                  <p className="mb-2">Under GDPR and UK data protection laws, you have the right to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Access your personal data</li>
                    <li>Rectify inaccurate data</li>
                    <li>Request deletion of your data</li>
                    <li>Object to processing of your data</li>
                    <li>Data portability</li>
                    <li>Withdraw consent at any time</li>
                  </ul>
                  <p className="mt-3">
                    To exercise these rights, please contact us at privacy@luxeglow.com.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#2c2520] mb-3">7. Contact Us</h3>
                  <p>
                    If you have questions about this Privacy Policy, please contact us at:
                  </p>
                  <p className="mt-2">
                    <strong>Email:</strong> privacy@luxeglow.com<br />
                    <strong>Address:</strong> 123 Beauty Lane, London, W1F 8QJ, United Kingdom
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-16"></div>

            {/* Terms of Service Section */}
            <div id="terms" className="mb-16 scroll-mt-20">
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-[#2c2520] mb-4">
                  Terms of Service
                </h2>
                <p className="text-sm text-[#6b5d52]">
                  Last Updated: January 2024
                </p>
              </div>

              <div className="space-y-6 text-[#6b5d52] leading-relaxed">
                <div>
                  <h3 className="text-xl font-semibold text-[#2c2520] mb-3">1. Acceptance of Terms</h3>
                  <p>
                    By accessing and using the LuxeGlow website, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#2c2520] mb-3">2. Use of Website</h3>
                  <p className="mb-2">You agree to use our website only for lawful purposes and in a way that does not:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Infringe the rights of others</li>
                    <li>Violate any applicable laws or regulations</li>
                    <li>Interfere with or disrupt the website or servers</li>
                    <li>Attempt to gain unauthorized access to any part of the website</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#2c2520] mb-3">3. Product Information</h3>
                  <p>
                    We strive to provide accurate product descriptions and images. However, we do not warrant that product descriptions, images, or other content on our website is accurate, complete, reliable, current, or error-free.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#2c2520] mb-3">4. Pricing and Payment</h3>
                  <p>
                    All prices are displayed in British Pounds (GBP) and include VAT where applicable. We reserve the right to change prices at any time. Payment must be made in full before products are shipped. We accept major credit cards and other payment methods as displayed on our website.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#2c2520] mb-3">5. Orders and Acceptance</h3>
                  <p>
                    All orders are subject to acceptance by us. We reserve the right to refuse or cancel any order for any reason, including but not limited to product availability, errors in pricing, or suspected fraud.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#2c2520] mb-3">6. Intellectual Property</h3>
                  <p>
                    All content on this website, including text, graphics, logos, images, and software, is the property of LuxeGlow or its content suppliers and is protected by UK and international copyright laws.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#2c2520] mb-3">7. Limitation of Liability</h3>
                  <p>
                    To the fullest extent permitted by law, LuxeGlow shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the website or products.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#2c2520] mb-3">8. Governing Law</h3>
                  <p>
                    These Terms of Service are governed by and construed in accordance with the laws of England and Wales. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#2c2520] mb-3">9. Changes to Terms</h3>
                  <p>
                    We reserve the right to modify these terms at any time. Your continued use of the website after any changes constitutes acceptance of the new terms.
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-16"></div>

            {/* Cookie Policy Section */}
            <div id="cookies" className="mb-16 scroll-mt-20">
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-[#2c2520] mb-4">
                  Cookie Policy
                </h2>
                <p className="text-sm text-[#6b5d52]">
                  Last Updated: January 2024
                </p>
              </div>

              <div className="space-y-6 text-[#6b5d52] leading-relaxed">
                <div>
                  <h3 className="text-xl font-semibold text-[#2c2520] mb-3">1. What Are Cookies?</h3>
                  <p>
                    Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our site.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#2c2520] mb-3">2. Types of Cookies We Use</h3>
                  
                  <div className="mt-4">
                    <h4 className="text-lg font-semibold text-[#2c2520] mb-2">Essential Cookies</h4>
                    <p>
                      These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.
                    </p>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-lg font-semibold text-[#2c2520] mb-2">Analytics Cookies</h4>
                    <p>
                      These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website and services.
                    </p>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-lg font-semibold text-[#2c2520] mb-2">Functional Cookies</h4>
                    <p>
                      These cookies allow the website to remember choices you make (such as your username, language, or region) and provide enhanced, personalized features.
                    </p>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-lg font-semibold text-[#2c2520] mb-2">Marketing Cookies</h4>
                    <p>
                      These cookies are used to track visitors across websites to display relevant advertisements. They may also be used to limit the number of times you see an advertisement.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#2c2520] mb-3">3. Managing Cookies</h3>
                  <p className="mb-2">
                    You can control and manage cookies in various ways. Please keep in mind that removing or blocking cookies can impact your user experience and parts of our website may no longer be fully accessible.
                  </p>
                  <p className="mt-2">
                    Most browsers allow you to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                    <li>See what cookies you have and delete them individually</li>
                    <li>Block third-party cookies</li>
                    <li>Block cookies from particular sites</li>
                    <li>Block all cookies from being set</li>
                    <li>Delete all cookies when you close your browser</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#2c2520] mb-3">4. Third-Party Cookies</h3>
                  <p>
                    In addition to our own cookies, we may also use various third-party cookies to report usage statistics and deliver advertisements. These third parties may set their own cookies to collect information about your online activities.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#2c2520] mb-3">5. Updates to This Policy</h3>
                  <p>
                    We may update this Cookie Policy from time to time to reflect changes in technology or legal requirements. We will notify you of any significant changes by posting the new policy on this page.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#2c2520] mb-3">6. Contact Us</h3>
                  <p>
                    If you have any questions about our use of cookies, please contact us at:
                  </p>
                  <p className="mt-2">
                    <strong>Email:</strong> privacy@luxeglow.com<br />
                    <strong>Address:</strong> 123 Beauty Lane, London, W1F 8QJ, United Kingdom
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Navigation */}
            <div className="mt-16 pt-8 border-t border-gray-200">
              <div className="bg-[#f8f7f5] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#2c2520] mb-4">Quick Navigation</h3>
                <div className="flex flex-wrap gap-3">
                  <a href="#privacy" className="text-[#ba9157] hover:text-[#a67d4a] transition-colors underline">
                    Privacy Policy
                  </a>
                  <span className="text-[#6b5d52]">•</span>
                  <a href="#terms" className="text-[#ba9157] hover:text-[#a67d4a] transition-colors underline">
                    Terms of Service
                  </a>
                  <span className="text-[#6b5d52]">•</span>
                  <a href="#cookies" className="text-[#ba9157] hover:text-[#a67d4a] transition-colors underline">
                    Cookie Policy
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

