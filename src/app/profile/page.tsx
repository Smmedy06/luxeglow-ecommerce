'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    // Shipping Details
    address: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United Kingdom',
    deliveryInstructions: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: '',
        address: '',
        address2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'United Kingdom',
        deliveryInstructions: ''
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // In a real app, this would update the user data via API
    console.log('Profile updated:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: '',
        address: '',
        address2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'United Kingdom',
        deliveryInstructions: ''
      });
    }
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  if (!user) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="py-20 bg-[#f8f7f5]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-2xl font-semibold text-[#2c2520] mb-4">Please log in to view your profile</h1>
            <Link href="/" className="text-[#ba9157] hover:text-[#a67d4a] transition-colors">
              Go to Homepage
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-[#f8f7f5] py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-[#ba9157] text-sm font-medium uppercase tracking-wider mb-4">
              MY ACCOUNT
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#2c2520] mb-4 leading-tight">
              Profile
            </h1>
            <p className="text-base md:text-lg text-[#6b5d52] leading-normal max-w-3xl mx-auto">
              Manage your personal information and account settings
            </p>
          </div>
        </section>

        {/* Profile Content */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              
              {/* Sidebar Navigation */}
              <div className="lg:col-span-1">
                <div className="bg-[#f8f7f5] rounded-lg p-6">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-[#ba9157] flex items-center justify-center mx-auto mb-4">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-2xl font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-[#2c2520]">{user.name}</h3>
                    <p className="text-[#6b5d52] text-sm">{user.email}</p>
                  </div>
                  
                  <nav className="space-y-2">
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-3 text-[#ba9157] bg-white rounded-lg font-medium"
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="flex items-center px-4 py-3 text-[#6b5d52] hover:text-[#ba9157] hover:bg-white rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Orders
                    </Link>
                  </nav>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                <div className="space-y-8">
                  {/* Personal Information Section */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <div className="flex justify-between items-center mb-8">
                      <h2 className="text-2xl font-semibold text-[#2c2520]">Personal Information</h2>
                      {!isEditing ? (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="px-4 py-2 bg-[#ba9157] text-white rounded-lg hover:bg-[#a67d4a] transition-colors"
                        >
                          Edit Profile
                        </button>
                      ) : (
                        <div className="flex space-x-3">
                          <button
                            onClick={handleCancel}
                            className="px-4 py-2 border border-gray-300 text-[#6b5d52] rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-[#ba9157] text-white rounded-lg hover:bg-[#a67d4a] transition-colors"
                          >
                            Save Changes
                          </button>
                        </div>
                      )}
                    </div>

                    <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-[#2c2520] mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none transition-colors bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-[#2c2520] mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none transition-colors bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-[#2c2520] mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="+44 20 7123 4567"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none transition-colors bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />
                      </div>

                    </div>
                    </form>
                  </div>

                  {/* Shipping Details Section */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <h2 className="text-2xl font-semibold text-[#2c2520] mb-8">Shipping Details</h2>
                    
                    <form className="space-y-6">
                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-[#2c2520] mb-2">
                          Address Line 1
                        </label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="123 Beauty Lane"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none transition-colors bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label htmlFor="address2" className="block text-sm font-medium text-[#2c2520] mb-2">
                          Address Line 2 (Optional)
                        </label>
                        <input
                          type="text"
                          id="address2"
                          name="address2"
                          value={formData.address2}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="Apartment, suite, unit, building, floor, etc."
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none transition-colors bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label htmlFor="city" className="block text-sm font-medium text-[#2c2520] mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            placeholder="London"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none transition-colors bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                          />
                        </div>

                        <div>
                          <label htmlFor="state" className="block text-sm font-medium text-[#2c2520] mb-2">
                            State/County
                          </label>
                          <input
                            type="text"
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            placeholder="Greater London"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none transition-colors bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                          />
                        </div>

                        <div>
                          <label htmlFor="postalCode" className="block text-sm font-medium text-[#2c2520] mb-2">
                            Postal Code
                          </label>
                          <input
                            type="text"
                            id="postalCode"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            placeholder="W1F 8QJ"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none transition-colors bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="country" className="block text-sm font-medium text-[#2c2520] mb-2">
                            Country
                          </label>
                          <select
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none transition-colors bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                          >
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="United States">United States</option>
                            <option value="Canada">Canada</option>
                            <option value="Australia">Australia</option>
                            <option value="Germany">Germany</option>
                            <option value="France">France</option>
                            <option value="Spain">Spain</option>
                            <option value="Italy">Italy</option>
                            <option value="Netherlands">Netherlands</option>
                            <option value="Belgium">Belgium</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="deliveryInstructions" className="block text-sm font-medium text-[#2c2520] mb-2">
                          Delivery Instructions (Optional)
                        </label>
                        <textarea
                          id="deliveryInstructions"
                          name="deliveryInstructions"
                          value={formData.deliveryInstructions}
                          onChange={(e) => setFormData(prev => ({ ...prev, deliveryInstructions: e.target.value }))}
                          disabled={!isEditing}
                          placeholder="Any special delivery instructions..."
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none transition-colors bg-white disabled:bg-gray-50 disabled:cursor-not-allowed resize-none"
                        />
                      </div>
                    </form>
                  </div>

                  {/* Account Actions */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <h2 className="text-2xl font-semibold text-[#2c2520] mb-8">Account Actions</h2>
                    <div className="space-y-3">
                      <button
                        onClick={handleLogout}
                        className="flex items-center text-red-600 hover:text-red-700 transition-colors"
                      >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
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
