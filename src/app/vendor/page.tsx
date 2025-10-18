'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';

export default function BecomeVendorPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    registrationNumber: '',
    licenseNumber: '',
    contactPerson: '',
    businessAddress: ''
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Open auth modal for login/signup
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-[#f8f7f5] py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-[#ba9157] text-sm font-medium uppercase tracking-wider mb-4">
              PARTNER WITH US
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#2c2520] mb-4 leading-tight">
              Become a Vendor
            </h1>
            <p className="text-base md:text-lg text-[#6b5d52] leading-normal max-w-3xl mx-auto">
              Join our curated network of premium skincare brands and suppliers
            </p>
          </div>
        </section>

        {/* Main Content Area */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Registration Form Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-semibold text-[#2c2520] mb-4">
                  Registration Requirements
                </h2>
                <p className="text-[#6b5d52] leading-relaxed">
                  Please provide your business and professional credentials to apply
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Form Fields - Two Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Company Name */}
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-[#2c2520] mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder="Your Company Ltd."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none transition-colors bg-white"
                      required
                    />
                  </div>

                  {/* Company Registration Number */}
                  <div>
                    <label htmlFor="registrationNumber" className="block text-sm font-medium text-[#2c2520] mb-2">
                      Company Registration Number
                    </label>
                    <input
                      type="text"
                      id="registrationNumber"
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleInputChange}
                      placeholder="12345678"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none transition-colors bg-white"
                      required
                    />
                  </div>

                  {/* License Number */}
                  <div>
                    <label htmlFor="licenseNumber" className="block text-sm font-medium text-[#2c2520] mb-2">
                      License Number
                    </label>
                    <input
                      type="text"
                      id="licenseNumber"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      placeholder="LIC-123456"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none transition-colors bg-white"
                      required
                    />
                  </div>

                  {/* Contact Person */}
                  <div>
                    <label htmlFor="contactPerson" className="block text-sm font-medium text-[#2c2520] mb-2">
                      Contact Person
                    </label>
                    <input
                      type="text"
                      id="contactPerson"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      placeholder="John Smith"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none transition-colors bg-white"
                      required
                    />
                  </div>
                </div>

                {/* Business Address - Full Width */}
                <div>
                  <label htmlFor="businessAddress" className="block text-sm font-medium text-[#2c2520] mb-2">
                    Business Address
                  </label>
                  <textarea
                    id="businessAddress"
                    name="businessAddress"
                    value={formData.businessAddress}
                    onChange={handleInputChange}
                    placeholder="123 Business Street, City, Postcode"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none transition-colors bg-white resize-none"
                    required
                  />
                </div>

                {/* What happens next section */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-[#2c2520] mb-4">
                    What happens next?
                  </h3>
                  <ul className="space-y-2 text-[#6b5d52]">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-[#ba9157] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Our team will review your application within 2-3 business days
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-[#ba9157] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      We may request additional documentation
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-[#ba9157] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Once approved, you&apos;ll receive vendor dashboard access
                    </li>
                  </ul>
                </div>

                {/* Note Section */}
                <div className="mt-6 p-4 bg-[#f8f7f5] rounded-lg">
                  <p className="text-[#6b5d52] text-sm">
                    <span className="font-semibold">Note:</span> You need to be logged in to submit this application. Click Submit to create an account or sign in.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-[#2c2520] text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-[#1a1612] transition-colors"
                  >
                    Create Account & Submit
                  </button>
                  <button
                    type="button"
                    className="flex-1 bg-white text-[#2c2520] py-4 px-6 rounded-lg font-semibold text-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode="signup"
      />
    </div>
  );
}
