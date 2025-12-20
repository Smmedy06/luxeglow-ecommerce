'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Order {
  id: string;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
  user_id: string;
  tracking_number?: string;
  shipping_address?: Record<string, unknown>;
}

interface OrderItem {
  id: string;
  product_id: number;
  quantity: number;
  price: string;
  products?: {
    name: string;
    brand: string;
    image: string;
  };
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [updatingTracking, setUpdatingTracking] = useState(false);

  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error loading orders:', error);
      } else {
        setOrders(data || []);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const loadOrderItems = async (orderId: string) => {
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          *,
          products (
            id,
            name,
            brand,
            image
          )
        `)
        .eq('order_id', orderId);

      if (error) {
        console.error('Error loading order items:', error);
      } else {
        setOrderItems(data || []);
      }
    } catch (error) {
      console.error('Error loading order items:', error);
    }
  };

  const handleViewOrder = async (order: Order) => {
    setSelectedOrder(order);
    setTrackingNumber(order.tracking_number || '');
    await loadOrderItems(order.id);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      await loadOrders();
      
      // Update selected order if it's the one being changed
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const handleUpdateTracking = async (orderId: string) => {
    if (!trackingNumber.trim()) {
      alert('Please enter a tracking number');
      return;
    }

    setUpdatingTracking(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ tracking_number: trackingNumber.trim() })
        .eq('id', orderId);

      if (error) throw error;
      
      // Update local state
      if (selectedOrder) {
        setSelectedOrder({ ...selectedOrder, tracking_number: trackingNumber.trim() });
      }
      
      loadOrders();
      alert('Tracking number updated successfully!');
    } catch (error) {
      console.error('Error updating tracking number:', error);
      alert('Failed to update tracking number');
    } finally {
      setUpdatingTracking(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse p-4 md:p-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 md:mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-[#2c2520]">Orders Management</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders List */}
        <div className={`lg:col-span-2 ${selectedOrder ? 'hidden lg:block' : ''}`}>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-[#6b5d52] uppercase">Order #</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-[#6b5d52] uppercase hidden md:table-cell">Status</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-[#6b5d52] uppercase">Total</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-[#6b5d52] uppercase hidden lg:table-cell">Date</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-[#6b5d52] uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-[#6b5d52]">
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-[#2c2520]">
                          {order.order_number}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className={`px-2 py-1 text-xs rounded border ${getStatusColor(order.status)} focus:ring-2 focus:ring-[#ba9157] outline-none`}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-[#2c2520]">
                          £{parseFloat(order.total.toString()).toFixed(2)}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-[#6b5d52] hidden lg:table-cell">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleViewOrder(order)}
                            className="text-[#ba9157] hover:text-[#a67d4a] text-xs md:text-sm"
                          >
                            {selectedOrder?.id === order.id ? 'Hide Details' : 'View Details'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Order Details Sidebar */}
        {selectedOrder && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4 md:p-6 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#2c2520]">Order Details</h2>
                <button
                  onClick={() => {
                    setSelectedOrder(null);
                    setOrderItems([]);
                  }}
                  className="lg:hidden text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-[#6b5d52]">Order Number</p>
                  <p className="font-medium text-[#2c2520]">{selectedOrder.order_number}</p>
                </div>

                <div>
                  <p className="text-sm text-[#6b5d52] mb-2">Status</p>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                    className={`w-full px-3 py-2 text-sm rounded border ${getStatusColor(selectedOrder.status)} focus:ring-2 focus:ring-[#ba9157] outline-none`}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <p className="text-sm text-[#6b5d52] mb-2">Tracking Number</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Enter tracking number"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none text-sm"
                    />
                    <button
                      onClick={() => handleUpdateTracking(selectedOrder.id)}
                      disabled={updatingTracking}
                      className="px-4 py-2 bg-[#ba9157] text-white rounded-lg hover:bg-[#a67d4a] transition-colors text-sm disabled:opacity-50"
                    >
                      {updatingTracking ? '...' : 'Update'}
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-[#6b5d52]">Total</p>
                  <p className="font-semibold text-lg text-[#2c2520]">£{parseFloat(selectedOrder.total.toString()).toFixed(2)}</p>
                </div>

                <div>
                  <p className="text-sm text-[#6b5d52]">Date</p>
                  <p className="text-[#2c2520]">{new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                </div>

                {orderItems.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-[#2c2520] mb-2">Items</p>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {orderItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                          <div className="w-10 h-10 bg-gray-200 rounded flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-[#2c2520] truncate">
                              {item.products?.brand} {item.products?.name}
                            </p>
                            <p className="text-xs text-[#6b5d52]">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-xs font-medium text-[#2c2520]">£{parseFloat(item.price.replace('£', '')).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
