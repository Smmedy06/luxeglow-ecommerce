'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import AuthModal from './AuthModal';
import ProfileDropdown from './ProfileDropdown';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useAuth();
  const { getTotalItems } = useCart();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-[#2c2520]">
              LuxeGlow
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-sm text-[#6b5d52] hover:text-[#ba9157] transition-colors">
              Home
            </Link>
            <Link href="/shop" className="text-sm text-[#6b5d52] hover:text-[#ba9157] transition-colors">
              Shop
            </Link>
            <Link href="/about" className="text-sm text-[#6b5d52] hover:text-[#ba9157] transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-sm text-[#6b5d52] hover:text-[#ba9157] transition-colors">
              Contact
            </Link>
            <Link href="/vendor" className="text-sm font-semibold text-[#ba9157] hover:text-[#a67d4a] transition-colors">
              Become a Vendor
            </Link>
          </nav>

          {/* Right side - Auth and Cart */}
          <div className="flex items-center space-x-4">
            {user ? (
              <ProfileDropdown />
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="text-sm text-[#6b5d52] hover:text-[#ba9157] transition-colors"
              >
                Login
              </button>
            )}
            <Link href="/cart" className="relative text-[#6b5d52] hover:text-[#ba9157] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#ba9157] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-[#6b5d52]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link href="/" className="block px-3 py-2 text-sm text-[#6b5d52] hover:text-[#ba9157]">
                Home
              </Link>
              <Link href="/shop" className="block px-3 py-2 text-sm text-[#6b5d52] hover:text-[#ba9157]">
                Shop
              </Link>
              <Link href="/about" className="block px-3 py-2 text-sm text-[#6b5d52] hover:text-[#ba9157]">
                About
              </Link>
              <Link href="/contact" className="block px-3 py-2 text-sm text-[#6b5d52] hover:text-[#ba9157]">
                Contact
              </Link>
              <Link href="/vendor" className="block px-3 py-2 text-sm font-semibold text-[#ba9157] hover:text-[#a67d4a]">
                Become a Vendor
              </Link>
            </div>
          </div>
        )}
      </div>
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </header>
  );
}
