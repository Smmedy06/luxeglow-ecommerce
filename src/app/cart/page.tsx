'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromoCode, setAppliedPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoError, setPromoError] = useState('');

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleApplyPromoCode = () => {
    setPromoError('');
    
    // Sample promo codes for demonstration
    const validPromoCodes = {
      'WELCOME10': 0.1, // 10% discount
      'SAVE20': 0.2,    // 20% discount
      'FIRST15': 0.15,  // 15% discount
      'LUXE25': 0.25    // 25% discount
    };

    const code = promoCode.toUpperCase().trim();
    
    if (validPromoCodes[code as keyof typeof validPromoCodes]) {
      const discountRate = validPromoCodes[code as keyof typeof validPromoCodes];
      const subtotal = getTotalPrice();
      const discount = subtotal * discountRate;
      
      setAppliedPromoCode(code);
      setDiscountAmount(discount);
      setPromoCode('');
    } else {
      setPromoError('Invalid promo code. Please try again.');
    }
  };

  const handleRemovePromoCode = () => {
    setAppliedPromoCode('');
    setDiscountAmount(0);
    setPromoError('');
  };

  const getFinalTotal = () => {
    const subtotal = getTotalPrice();
    const tax = subtotal * 0.2;
    const total = subtotal + tax - discountAmount;
    return Math.max(0, total); // Ensure total doesn't go below 0
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Simulate checkout process
    setTimeout(() => {
      alert('Thank you for your purchase! Your order has been placed.');
      clearCart();
      setIsCheckingOut(false);
    }, 2000);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="mb-8">
              <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h1 className="text-3xl font-bold text-[#2c2520] mb-4">Your Cart is Empty</h1>
              <p className="text-[#6b5d52] mb-8">Looks like you haven't added any items to your cart yet.</p>
              <a 
                href="/shop" 
                className="inline-block bg-[#ba9157] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#a67d4a] transition-colors"
              >
                Continue Shopping
              </a>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-[#6b5d52]">
            <li><a href="/" className="hover:text-[#ba9157]">Home</a></li>
            <li>/</li>
            <li><a href="/shop" className="hover:text-[#ba9157]">Shop</a></li>
            <li>/</li>
            <li className="text-[#2c2520] font-medium">Cart</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-[#2c2520]">Shopping Cart</h1>
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Clear Cart
              </button>
            </div>

            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center space-x-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gray-300 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-[#2c2520] truncate">
                        {item.name}
                      </h3>
                      <p className="text-sm text-[#ba9157] uppercase tracking-wider">
                        {item.brand}
                      </p>
                      <p className="text-sm text-[#6b5d52]">
                        {item.category}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-lg font-semibold text-[#2c2520]">
                        £{(parseFloat(item.price.replace('£', '')) * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-[#6b5d52]">
                        £{item.price} each
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-[#2c2520] mb-6">Order Summary</h2>
              
              {/* Promo Code Section */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-[#2c2520] mb-3">Promo Code</h3>
                {!appliedPromoCode ? (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter promo code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ba9157] focus:border-transparent"
                    />
                    <button
                      onClick={handleApplyPromoCode}
                      disabled={!promoCode.trim()}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        !promoCode.trim()
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-[#ba9157] text-white hover:bg-[#a67d4a]'
                      }`}
                    >
                      Apply
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium text-green-800">{appliedPromoCode}</span>
                    </div>
                    <button
                      onClick={handleRemovePromoCode}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                )}
                {promoError && (
                  <p className="text-red-600 text-sm mt-2">{promoError}</p>
                )}
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-[#6b5d52]">Subtotal</span>
                  <span className="font-medium">£{getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b5d52]">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b5d52]">Tax</span>
                  <span className="font-medium">£{(getTotalPrice() * 0.2).toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedPromoCode})</span>
                    <span className="font-medium">-£{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-[#2c2520]">Total</span>
                    <span className="text-[#2c2520]">£{getFinalTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                  isCheckingOut
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#ba9157] text-white hover:bg-[#a67d4a]'
                }`}
              >
                {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
              </button>

              <div className="mt-4 text-center">
                <a 
                  href="/shop" 
                  className="text-[#ba9157] hover:text-[#a67d4a] text-sm font-medium"
                >
                  Continue Shopping
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
