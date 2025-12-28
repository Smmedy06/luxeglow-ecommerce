import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Shipping & Returns Policy | LuxeGlow',
  description: 'Learn about LuxeGlow\'s shipping options, delivery times, and returns policy. Free shipping on orders over £50. 30-day return guarantee.',
  keywords: 'shipping, delivery, returns, refund policy, next day delivery, UK shipping, LuxeGlow',
};

export default function ShippingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-[#f8f7f5] py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-[#ba9157] text-sm font-medium uppercase tracking-wider mb-8">
              SHIPPING & RETURNS
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[#2c2520] mb-6 leading-tight">
              Shipping Information & Returns Policy
            </h1>
            <p className="text-base md:text-lg text-[#6b5d52] leading-relaxed max-w-3xl mx-auto">
              Everything you need to know about shipping and returns for your peace of mind.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Shipping Information Section */}
            <div id="shipping" className="mb-16 scroll-mt-20">
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-[#2c2520] mb-4">
                  Shipping Information
                </h2>
                <p className="text-sm text-[#6b5d52]">
                  Fast, secure delivery to your doorstep
                </p>
              </div>

              <div className="space-y-6 text-[#6b5d52] leading-relaxed">
                <div>
                  <h3 className="text-xl font-semibold text-[#2c2520] mb-3">UK Delivery Options</h3>
                  
                  <div className="bg-[#f8f7f5] rounded-lg p-6 mt-4">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-[#ba9157] rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#2c2520] mb-1">Next Day Delivery</h4>
                          <p className="text-sm">Order before 2pm for next working day delivery</p>
                          <p className="text-sm font-medium text-[#ba9157] mt-1">£9.99</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-[#ba9157] rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#2c2520] mb-1">Standard Delivery (2-3 Business Days)</h4>
                          <p className="text-sm">Free on orders over £50</p>
                          <p className="text-sm font-medium text-[#ba9157] mt-1">£4.99 (Free over £50)</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-[#ba9157] rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#2c2520] mb-1">Express Delivery (1-2 Business Days)</h4>
                          <p className="text-sm">Priority handling and faster transit</p>
                          <p className="text-sm font-medium text-[#ba9157] mt-1">£6.99</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#2c2520] mb-3">International Delivery</h3>
                  <p className="mb-2">
                    We ship to select international destinations. International shipping costs and delivery times vary by location:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Europe:</strong> 5-7 business days - £12.99</li>
                    <li><strong>Rest of World:</strong> 7-14 business days - £19.99</li>
                  </ul>
                  <p className="mt-3 text-sm">
                    Please note: International orders may be subject to customs duties and taxes, which are the responsibility of the recipient.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#2c2520] mb-3">Processing Time</h3>
                  <p>
                    Orders are typically processed within 1-2 business days. During peak periods (holidays, sales), processing may take up to 3 business days. You will receive an email confirmation once your order has been dispatched.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#2c2520] mb-3">Order Tracking</h3>
                  <p>
                    Once your order has been dispatched, you will receive a tracking number via email. You can use this to track your package&apos;s journey to your door.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#2c2520] mb-3">Delivery Address</h3>
                  <p>
                    Please ensure your delivery address is correct at checkout. We are not responsible for orders delivered to incorrect addresses provided by the customer. If you need to change your delivery address, please contact us immediately after placing your order.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#2c2520] mb-3">Failed Delivery</h3>
                  <p>
                    If delivery is attempted but you are not available, the courier will leave a card with instructions. You may need to collect your package from a local depot or arrange redelivery. Unclaimed packages will be returned to us, and a restocking fee may apply.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#2c2520] mb-3">Contact Shipping Support</h3>
                  <p>
                    For any shipping inquiries, please contact us:
                  </p>
                  <p className="mt-2">
                    <strong>Email:</strong> shipping@luxeglow.com<br />
                    <strong>Phone:</strong> +44 20 7123 4567<br />
                    <strong>Hours:</strong> Mon-Fri, 9am-6pm GMT
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-16"></div>

            {/* Returns Policy Section */}
            <div id="returns" className="mb-16 scroll-mt-20">
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-[#2c2520] mb-4">
                  Returns Policy
                </h2>
                <p className="text-sm text-[#6b5d52]">
                  Your satisfaction is our priority
                </p>
              </div>

              <div className="space-y-6 text-[#6b5d52] leading-relaxed">
                <div>
                  <h3 className="text-xl font-semibold text-[#2c2520] mb-3">30-Day Return Policy</h3>
                  <p>
                    We want you to be completely satisfied with your purchase. If you&apos;re not happy with your order, you can return it within 30 days of delivery for a full refund or exchange.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#2c2520] mb-3">Return Conditions</h3>
                  <p className="mb-2">To be eligible for a return, items must:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Be unused and in their original condition</li>
                    <li>Be in the original packaging with all tags and labels attached</li>
                    <li>Include all original accessories and documentation</li>
                    <li>Not be damaged, altered, or used</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#2c2520] mb-3">Non-Returnable Items</h3>
                  <p className="mb-2">For health and safety reasons, the following items cannot be returned:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Opened or used products (hygiene reasons)</li>
                    <li>Personalized or custom-made items</li>
                    <li>Items damaged by customer misuse</li>
                    <li>Products purchased on sale or clearance (unless defective)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#2c2520] mb-3">How to Initiate a Return</h3>
                  <div className="bg-[#f8f7f5] rounded-lg p-6 mt-4">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-[#ba9157] rounded-full flex items-center justify-center text-white font-semibold">
                          1
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#2c2520] mb-1">Contact Us</h4>
                          <p className="text-sm">Email returns@luxeglow.com or call +44 20 7123 4567 with your order number</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-[#ba9157] rounded-full flex items-center justify-center text-white font-semibold">
                          2
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#2c2520] mb-1">Receive Return Authorization</h4>
                          <p className="text-sm">We&apos;ll provide you with a Return Merchandise Authorization (RMA) number and return instructions</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-[#ba9157] rounded-full flex items-center justify-center text-white font-semibold">
                          3
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#2c2520] mb-1">Package Your Return</h4>
                          <p className="text-sm">Securely package the item(s) with the RMA number clearly visible on the outside</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-[#ba9157] rounded-full flex items-center justify-center text-white font-semibold">
                          4
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#2c2520] mb-1">Send It Back</h4>
                          <p className="text-sm">Ship the package to the address provided. We recommend using a tracked shipping service</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#2c2520] mb-3">Return Shipping Costs</h3>
                  <p className="mb-2">
                    Return shipping costs depend on the reason for return:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Defective or incorrect items:</strong> We cover return shipping costs</li>
                    <li><strong>Change of mind:</strong> Customer is responsible for return shipping costs</li>
                    <li><strong>UK returns:</strong> Standard return shipping is £4.99</li>
                    <li><strong>International returns:</strong> Customer is responsible for all return shipping costs and any customs fees</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#2c2520] mb-3">Refund Processing</h3>
                  <p className="mb-2">
                    Once we receive and inspect your return:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Refunds will be processed within 5-10 business days</li>
                    <li>Refunds will be issued to the original payment method</li>
                    <li>You will receive an email confirmation when your refund is processed</li>
                    <li>Please allow additional time for your bank or credit card company to process the refund</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#2c2520] mb-3">Exchanges</h3>
                  <p>
                    We currently do not offer direct exchanges. If you need a different size or product, please return the original item for a refund and place a new order. This ensures you receive the correct item quickly.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#2c2520] mb-3">Damaged or Defective Items</h3>
                  <p>
                    If you receive a damaged or defective item, please contact us immediately with photos of the damage. We will arrange a replacement or full refund, including return shipping costs, at no charge to you.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#2c2520] mb-3">Late or Missing Refunds</h3>
                  <p className="mb-2">
                    If you haven&apos;t received your refund after 10 business days, please:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Check your bank account or credit card statement</li>
                    <li>Contact your bank or credit card company (processing may take time)</li>
                    <li>Contact us at returns@luxeglow.com if the issue persists</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#2c2520] mb-3">Contact Returns Support</h3>
                  <p>
                    For any returns inquiries, please contact us:
                  </p>
                  <p className="mt-2">
                    <strong>Email:</strong> returns@luxeglow.com<br />
                    <strong>Phone:</strong> +44 20 7123 4567<br />
                    <strong>Hours:</strong> Mon-Fri, 9am-6pm GMT
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Navigation */}
            <div className="mt-16 pt-8 border-t border-gray-200">
              <div className="bg-[#f8f7f5] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#2c2520] mb-4">Quick Navigation</h3>
                <div className="flex flex-wrap gap-3">
                  <a href="#shipping" className="text-[#ba9157] hover:text-[#a67d4a] transition-colors underline">
                    Shipping Information
                  </a>
                  <span className="text-[#6b5d52]">•</span>
                  <a href="#returns" className="text-[#ba9157] hover:text-[#a67d4a] transition-colors underline">
                    Returns Policy
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

