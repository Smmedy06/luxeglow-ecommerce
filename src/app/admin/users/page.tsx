'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { setUserAsAdmin } from '@/lib/admin';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  full_name: string;
  is_admin: boolean;
  created_at: string;
  order_count?: number;
  total_spent?: number;
}

interface UserOrder {
  id: string;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [userOrders, setUserOrders] = useState<UserOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('user_id, full_name, is_admin, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading users:', error);
      } else {
        // Load order stats for each user
        const usersWithStats = await Promise.all(
          (data || []).map(async (profile) => {
            // Get user email from auth.users (if accessible)
            let email = profile.user_id.substring(0, 8) + '...';
            try {
              const { data: authData } = await supabase.auth.admin.getUserById(profile.user_id);
              if (authData?.user?.email) {
                email = authData.user.email;
              }
            } catch {
              // Fallback to user_id if admin API not available
            }

            // Get order stats
            const { data: ordersData } = await supabase
              .from('orders')
              .select('total')
              .eq('user_id', profile.user_id);

            const orderCount = ordersData?.length || 0;
            const totalSpent = ordersData?.reduce((sum, order) => sum + parseFloat(order.total.toString()), 0) || 0;

            return {
              id: profile.user_id,
              email,
              full_name: profile.full_name,
              is_admin: profile.is_admin || false,
              created_at: profile.created_at,
              order_count: orderCount,
              total_spent: totalSpent,
            };
          })
        );

        setUsers(usersWithStats);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserOrders = async (userId: string) => {
    setLoadingOrders(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('id, order_number, status, total, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading user orders:', error);
      } else {
        setUserOrders(data || []);
      }
    } catch (error) {
      console.error('Error loading user orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleViewOrders = (userId: string) => {
    if (selectedUser === userId) {
      setSelectedUser(null);
      setUserOrders([]);
    } else {
      setSelectedUser(userId);
      loadUserOrders(userId);
    }
  };

  const handleToggleAdmin = async (userId: string, currentStatus: boolean) => {
    if (!confirm(`Are you sure you want to ${currentStatus ? 'remove' : 'grant'} admin access?`)) return;

    try {
      const success = await setUserAsAdmin(userId, !currentStatus);
      if (success) {
        loadUsers();
      } else {
        alert('Failed to update admin status');
      }
    } catch (error) {
      console.error('Error updating admin status:', error);
      alert('Failed to update admin status');
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

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <h1 className="text-2xl md:text-3xl font-bold text-[#2c2520] mb-6 md:mb-8">Users Management</h1>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-[#6b5d52] uppercase tracking-wider">Name</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-[#6b5d52] uppercase tracking-wider hidden md:table-cell">Email</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-[#6b5d52] uppercase tracking-wider">Admin</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-[#6b5d52] uppercase tracking-wider hidden lg:table-cell">Orders</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-[#6b5d52] uppercase tracking-wider hidden lg:table-cell">Total Spent</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-[#6b5d52] uppercase tracking-wider hidden md:table-cell">Joined</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-[#6b5d52] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-[#6b5d52]">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <>
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-[#2c2520]">
                        <div>
                          <div>{user.full_name}</div>
                          <div className="text-xs text-gray-500 md:hidden">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-[#2c2520] hidden md:table-cell">
                        {user.email}
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        {user.is_admin ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            Admin
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                            User
                          </span>
                        )}
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-[#6b5d52] hidden lg:table-cell">
                        {user.order_count || 0}
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-[#6b5d52] hidden lg:table-cell">
                        £{(user.total_spent || 0).toFixed(2)}
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-[#6b5d52] hidden md:table-cell">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={() => handleToggleAdmin(user.id, user.is_admin)}
                          className={`px-2 md:px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                            user.is_admin
                              ? 'bg-red-100 text-red-800 hover:bg-red-200'
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                        </button>
                        <button
                          onClick={() => handleViewOrders(user.id)}
                          className="px-2 md:px-3 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                        >
                          {selectedUser === user.id ? 'Hide Orders' : 'View Orders'}
                        </button>
                      </td>
                    </tr>
                    {selectedUser === user.id && (
                      <tr>
                        <td colSpan={7} className="px-4 md:px-6 py-4 bg-gray-50">
                          {loadingOrders ? (
                            <div className="text-center py-4">Loading orders...</div>
                          ) : userOrders.length === 0 ? (
                            <div className="text-center py-4 text-[#6b5d52]">No orders found</div>
                          ) : (
                            <div className="space-y-2">
                              <h3 className="font-semibold text-[#2c2520] mb-3">Order History</h3>
                              <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="border-b">
                                      <th className="text-left py-2 text-[#6b5d52]">Order #</th>
                                      <th className="text-left py-2 text-[#6b5d52]">Status</th>
                                      <th className="text-left py-2 text-[#6b5d52]">Total</th>
                                      <th className="text-left py-2 text-[#6b5d52]">Date</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {userOrders.map((order) => (
                                      <tr key={order.id} className="border-b">
                                        <td className="py-2 text-[#2c2520]">{order.order_number}</td>
                                        <td className="py-2">
                                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                                            {order.status}
                                          </span>
                                        </td>
                                        <td className="py-2 text-[#2c2520]">£{parseFloat(order.total.toString()).toFixed(2)}</td>
                                        <td className="py-2 text-[#6b5d52]">{new Date(order.created_at).toLocaleDateString()}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
