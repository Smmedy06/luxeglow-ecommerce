'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { isAdmin } from '@/lib/admin';

interface PromoCode {
  id: number;
  code: string;
  description: string | null;
  discount_percentage: number;
  discount_amount: number | null;
  min_purchase_amount: number;
  max_discount_amount: number | null;
  usage_limit: number | null;
  usage_count: number;
  user_usage_limit: number;
  is_active: boolean;
  valid_from: string;
  valid_until: string | null;
  created_at: string;
  updated_at: string;
}

export default function AdminPromoCodesPage() {
  const { user } = useAuth();
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCode, setEditingCode] = useState<PromoCode | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount_percentage: '',
    discount_amount: '',
    min_purchase_amount: '0',
    max_discount_amount: '',
    usage_limit: '',
    user_usage_limit: '1',
    is_active: true,
    valid_from: new Date().toISOString().split('T')[0],
    valid_until: '',
  });

  useEffect(() => {
    loadPromoCodes();
  }, []);

  const loadPromoCodes = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading promo codes:', error);
      } else {
        setPromoCodes(data || []);
      }
    } catch (error) {
      console.error('Error loading promo codes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('You must be logged in to save promo codes');
      return;
    }

    const userIsAdmin = await isAdmin();
    if (!userIsAdmin) {
      alert('Access denied. Admin privileges required.');
      return;
    }

    try {
      const promoCodeData: {
        code: string;
        description?: string | null;
        discount_percentage: number;
        discount_amount?: number | null;
        min_purchase_amount: number;
        max_discount_amount?: number | null;
        usage_limit?: number | null;
        user_usage_limit: number;
        is_active: boolean;
        valid_from: string;
        valid_until?: string | null;
        created_by: string;
      } = {
        code: formData.code.toUpperCase().trim(),
        description: formData.description.trim() || null,
        discount_percentage: parseFloat(formData.discount_percentage) || 0,
        discount_amount: formData.discount_amount ? parseFloat(formData.discount_amount) : null,
        min_purchase_amount: parseFloat(formData.min_purchase_amount) || 0,
        max_discount_amount: formData.max_discount_amount ? parseFloat(formData.max_discount_amount) : null,
        usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
        user_usage_limit: parseInt(formData.user_usage_limit) || 1,
        is_active: formData.is_active,
        valid_from: new Date(formData.valid_from).toISOString(),
        valid_until: formData.valid_until ? new Date(formData.valid_until).toISOString() : null,
        created_by: user.id,
      };

      if (editingCode) {
        const { error } = await supabase
          .from('promo_codes')
          .update(promoCodeData)
          .eq('id', editingCode.id);

        if (error) {
          console.error('Error updating promo code:', error);
          alert(`Failed to update promo code: ${error.message}`);
          throw error;
        }
      } else {
        const { error } = await supabase
          .from('promo_codes')
          .insert(promoCodeData);

        if (error) {
          console.error('Error creating promo code:', error);
          alert(`Failed to create promo code: ${error.message}`);
          throw error;
        }
      }

      setShowForm(false);
      setEditingCode(null);
      setFormData({
        code: '',
        description: '',
        discount_percentage: '',
        discount_amount: '',
        min_purchase_amount: '0',
        max_discount_amount: '',
        usage_limit: '',
        user_usage_limit: '1',
        is_active: true,
        valid_from: new Date().toISOString().split('T')[0],
        valid_until: '',
      });
      loadPromoCodes();
    } catch (error) {
      console.error('Error saving promo code:', error);
    }
  };

  const handleEdit = (code: PromoCode) => {
    setEditingCode(code);
    setFormData({
      code: code.code,
      description: code.description || '',
      discount_percentage: code.discount_percentage.toString(),
      discount_amount: code.discount_amount?.toString() || '',
      min_purchase_amount: code.min_purchase_amount.toString(),
      max_discount_amount: code.max_discount_amount?.toString() || '',
      usage_limit: code.usage_limit?.toString() || '',
      user_usage_limit: code.user_usage_limit.toString(),
      is_active: code.is_active,
      valid_from: new Date(code.valid_from).toISOString().split('T')[0],
      valid_until: code.valid_until ? new Date(code.valid_until).toISOString().split('T')[0] : '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this promo code?')) return;

    try {
      const { error } = await supabase
        .from('promo_codes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadPromoCodes();
    } catch (error) {
      console.error('Error deleting promo code:', error);
      alert('Failed to delete promo code');
    }
  };

  const handleToggleActive = async (code: PromoCode) => {
    try {
      const { error } = await supabase
        .from('promo_codes')
        .update({ is_active: !code.is_active })
        .eq('id', code.id);

      if (error) throw error;
      loadPromoCodes();
    } catch (error) {
      console.error('Error toggling promo code status:', error);
      alert('Failed to update promo code status');
    }
  };

  const isCodeExpired = (code: PromoCode) => {
    if (!code.valid_until) return false;
    return new Date(code.valid_until) < new Date();
  };

  const isCodeExhausted = (code: PromoCode) => {
    if (!code.usage_limit) return false;
    return code.usage_count >= code.usage_limit;
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#2c2520]">Promo Codes Management</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingCode(null);
            setFormData({
              code: '',
              description: '',
              discount_percentage: '',
              discount_amount: '',
              min_purchase_amount: '0',
              max_discount_amount: '',
              usage_limit: '',
              user_usage_limit: '1',
              is_active: true,
              valid_from: new Date().toISOString().split('T')[0],
              valid_until: '',
            });
          }}
          className="px-6 py-3 bg-[#ba9157] text-white rounded-lg hover:bg-[#a67d4a] transition-colors font-medium"
        >
          + Add Promo Code
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-[#2c2520] mb-4">
            {editingCode ? 'Edit Promo Code' : 'Add New Promo Code'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#2c2520] mb-2">Code *</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none"
                  placeholder="WELCOME10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2c2520] mb-2">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none"
                  placeholder="Welcome discount for new customers"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#2c2520] mb-2">Discount Percentage (%) *</label>
                <input
                  type="number"
                  value={formData.discount_percentage}
                  onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
                  min="0"
                  max="100"
                  step="0.01"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none"
                  placeholder="10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2c2520] mb-2">Fixed Discount Amount (£)</label>
                <input
                  type="number"
                  value={formData.discount_amount}
                  onChange={(e) => setFormData({ ...formData, discount_amount: e.target.value })}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none"
                  placeholder="5.00"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty to use percentage only</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#2c2520] mb-2">Minimum Purchase Amount (£)</label>
                <input
                  type="number"
                  value={formData.min_purchase_amount}
                  onChange={(e) => setFormData({ ...formData, min_purchase_amount: e.target.value })}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2c2520] mb-2">Maximum Discount Amount (£)</label>
                <input
                  type="number"
                  value={formData.max_discount_amount}
                  onChange={(e) => setFormData({ ...formData, max_discount_amount: e.target.value })}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none"
                  placeholder="50.00"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty for no maximum</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#2c2520] mb-2">Total Usage Limit</label>
                <input
                  type="number"
                  value={formData.usage_limit}
                  onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none"
                  placeholder="100"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty for unlimited</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2c2520] mb-2">Per User Usage Limit</label>
                <input
                  type="number"
                  value={formData.user_usage_limit}
                  onChange={(e) => setFormData({ ...formData, user_usage_limit: e.target.value })}
                  min="1"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#2c2520] mb-2">Valid From</label>
                <input
                  type="date"
                  value={formData.valid_from}
                  onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2c2520] mb-2">Valid Until</label>
                <input
                  type="date"
                  value={formData.valid_until}
                  onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty for no expiration</p>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 text-[#ba9157] border-gray-300 rounded focus:ring-[#ba9157]"
              />
              <label className="ml-2 text-sm font-medium text-[#2c2520]">Active</label>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="px-6 py-2 bg-[#ba9157] text-white rounded-lg hover:bg-[#a67d4a] transition-colors"
              >
                {editingCode ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingCode(null);
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#6b5d52] uppercase">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#6b5d52] uppercase">Discount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#6b5d52] uppercase">Usage</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#6b5d52] uppercase">Valid Until</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#6b5d52] uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#6b5d52] uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {promoCodes.map((code) => {
              const expired = isCodeExpired(code);
              const exhausted = isCodeExhausted(code);
              const isInvalid = !code.is_active || expired || exhausted;

              return (
                <tr key={code.id} className={isInvalid ? 'bg-gray-50' : ''}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-[#2c2520]">{code.code}</div>
                    {code.description && (
                      <div className="text-xs text-[#6b5d52]">{code.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#6b5d52]">
                    {code.discount_percentage > 0 && `${code.discount_percentage}%`}
                    {code.discount_amount && code.discount_amount > 0 && (
                      <span className="ml-1">or £{code.discount_amount.toFixed(2)}</span>
                    )}
                    {code.min_purchase_amount > 0 && (
                      <div className="text-xs text-gray-500">Min: £{code.min_purchase_amount.toFixed(2)}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#6b5d52]">
                    {code.usage_count} / {code.usage_limit || '∞'}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#6b5d52]">
                    {code.valid_until
                      ? new Date(code.valid_until).toLocaleDateString()
                      : 'No expiration'}
                    {expired && <div className="text-xs text-red-600">Expired</div>}
                  </td>
                  <td className="px-6 py-4">
                    {isInvalid ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                        {expired ? 'Expired' : exhausted ? 'Exhausted' : 'Inactive'}
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button
                      onClick={() => handleEdit(code)}
                      className="text-[#ba9157] hover:text-[#a67d4a]"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleActive(code)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {code.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDelete(code.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {promoCodes.length === 0 && (
          <div className="text-center py-12 text-[#6b5d52]">
            No promo codes found. Create your first promo code above.
          </div>
        )}
      </div>
    </div>
  );
}

