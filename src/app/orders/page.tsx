'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: {
    id: string;
    name: string;
    brand: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  trackingNumber?: string;
}

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    if (user) {
      // Simulate API call
      setTimeout(() => {
        setOrders([
          {
            id: '1',
            orderNumber: 'LG-2024-001',
            date: '2024-01-15',
            status: 'delivered',
            total: 299.97,
            trackingNumber: 'TRK123456789',
            items: [
              {
                id: '1',
                name: 'Juvederm Ultra 3',
                brand: 'ALLERGAN',
                price: 107.99,
                quantity: 2,
                image: '/api/placeholder/100/100'
              },
              {
                id: '2',
                name: 'Botox 100 Units',
                brand: 'ALLERGAN',
                price: 83.99,
                quantity: 1,
                image: '/api/placeholder/100/100'
              }
            ],
            shippingAddress: {
              name: user.name,
              address: '123 Beauty Lane',
              city: 'London',
              postalCode: 'W1F 8QJ',
              country: 'United Kingdom'
            }
          },
          {
            id: '2',
            orderNumber: 'LG-2024-002',
            date: '2024-01-20',
            status: 'shipped',
            total: 215.98,
            trackingNumber: 'TRK987654321',
            items: [
              {
                id: '3',
                name: 'Restylane Lyft',
                brand: 'GALDERMA',
                price: 215.98,
                quantity: 1,
                image: '/api/placeholder/100/100'
              }
            ],
            shippingAddress: {
              name: user.name,
              address: '123 Beauty Lane',
              city: 'London',
              postalCode: 'W1F 8QJ',
              country: 'United Kingdom'
            }
          },
          {
            id: '3',
            orderNumber: 'LG-2024-003',
            date: '2024-01-25',
            status: 'processing',
            total: 431.96,
            items: [
              {
                id: '4',
                name: 'Sculptra Aesthetic',
                brand: 'GALDERMA',
                price: 431.96,
                quantity: 1,
                image: '/api/placeholder/100/100'
              }
            ],
            shippingAddress: {
              name: user.name,
              address: '123 Beauty Lane',
              city: 'London',
              postalCode: 'W1F 8QJ',
              country: 'United Kingdom'
            }
          }
        ]);
        setIsLoading(false);
      }, 1000);
    }
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (!user) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="py-20 bg-[#f8f7f5]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-2xl font-semibold text-[#2c2520] mb-4">Please log in to view your orders</h1>
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
              Orders
            </h1>
            <p className="text-base md:text-lg text-[#6b5d52] leading-normal max-w-3xl mx-auto">
              Track your orders and view order history
            </p>
          </div>
        </section>

        {/* Orders Content */}
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
                      className="flex items-center px-4 py-3 text-[#6b5d52] hover:text-[#ba9157] hover:bg-white rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="flex items-center px-4 py-3 text-[#ba9157] bg-white rounded-lg font-medium"
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
                {isLoading ? (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <div className="animate-pulse">
                      <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                      <div className="space-y-4">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                      </div>
                    </div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="text-lg font-semibold text-[#2c2520] mb-2">No orders yet</h3>
                    <p className="text-[#6b5d52] mb-6">Start shopping to see your orders here</p>
                    <Link
                      href="/shop"
                      className="inline-flex items-center px-6 py-3 bg-[#ba9157] text-white rounded-lg hover:bg-[#a67d4a] transition-colors"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-[#2c2520]">Order History</h2>
                    
                    {orders.map((order) => (
                      <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        {/* Order Header */}
                        <div className="p-6 border-b border-gray-200">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-[#2c2520]">Order #{order.orderNumber}</h3>
                              <p className="text-[#6b5d52] text-sm">Placed on {new Date(order.date).toLocaleDateString()}</p>
                            </div>
                            <div className="mt-4 sm:mt-0 flex flex-col sm:items-end">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                {getStatusText(order.status)}
                              </span>
                              <p className="text-lg font-semibold text-[#2c2520] mt-2">£{order.total.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="p-6">
                          <div className="space-y-4">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                  <span className="text-gray-400 text-xs">IMG</span>
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium text-[#2c2520]">{item.brand} {item.name}</h4>
                                  <p className="text-[#6b5d52] text-sm">Quantity: {item.quantity}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-[#2c2520]">£{item.price.toFixed(2)}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Order Actions */}
                          <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="mb-4 sm:mb-0">
                              {order.trackingNumber && (
                                <p className="text-sm text-[#6b5d52]">
                                  Tracking: <span className="font-medium">{order.trackingNumber}</span>
                                </p>
                              )}
                            </div>
                            <div className="flex space-x-3">
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="px-4 py-2 border border-gray-300 text-[#6b5d52] rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                View Details
                              </button>
                              {order.status === 'delivered' && (
                                <button className="px-4 py-2 bg-[#ba9157] text-white rounded-lg hover:bg-[#a67d4a] transition-colors">
                                  Reorder
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50 p-4 overflow-y-auto scrollbar-hide">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl relative my-8 max-h-[90vh] overflow-y-auto scrollbar-hide">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-[#2c2520]">Order Details</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-[#2c2520] mb-2">Order Number</h3>
                    <p className="text-[#6b5d52]">{selectedOrder.orderNumber}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2c2520] mb-2">Order Date</h3>
                    <p className="text-[#6b5d52]">{new Date(selectedOrder.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2c2520] mb-2">Status</h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusText(selectedOrder.status)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2c2520] mb-2">Total</h3>
                    <p className="text-[#6b5d52] font-semibold">£{selectedOrder.total.toFixed(2)}</p>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="font-semibold text-[#2c2520] mb-2">Shipping Address</h3>
                  <div className="text-[#6b5d52]">
                    <p>{selectedOrder.shippingAddress.name}</p>
                    <p>{selectedOrder.shippingAddress.address}</p>
                    <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}</p>
                    <p>{selectedOrder.shippingAddress.country}</p>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h3 className="font-semibold text-[#2c2520] mb-4">Items</h3>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 text-xs">IMG</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-[#2c2520]">{item.brand} {item.name}</h4>
                          <p className="text-[#6b5d52] text-sm">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-[#2c2520]">£{item.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
