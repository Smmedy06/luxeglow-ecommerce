'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Brand {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
}

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    logo: '',
    website: '',
    is_active: true,
  });

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error loading brands:', error);
      } else {
        setBrands(data || []);
      }
    } catch (error) {
      console.error('Error loading brands:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const brandData = {
        ...formData,
        slug: formData.slug || generateSlug(formData.name),
      };

      if (editingBrand) {
        const { error } = await supabase
          .from('brands')
          .update(brandData)
          .eq('id', editingBrand.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('brands')
          .insert(brandData);

        if (error) throw error;
      }

      setShowForm(false);
      setEditingBrand(null);
      setFormData({ name: '', slug: '', description: '', logo: '', website: '', is_active: true });
      loadBrands();
    } catch (error) {
      console.error('Error saving brand:', error);
      alert('Failed to save brand');
    }
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      slug: brand.slug,
      description: brand.description || '',
      logo: '',
      website: '',
      is_active: brand.is_active,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this brand?')) return;

    try {
      const { error } = await supabase
        .from('brands')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadBrands();
    } catch (error) {
      console.error('Error deleting brand:', error);
      alert('Failed to delete brand');
    }
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#2c2520]">Brands Management</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingBrand(null);
            setFormData({ name: '', slug: '', description: '', logo: '', website: '', is_active: true });
          }}
          className="px-6 py-3 bg-[#ba9157] text-white rounded-lg hover:bg-[#a67d4a] transition-colors font-medium"
        >
          + Add Brand
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-[#2c2520] mb-4">
            {editingBrand ? 'Edit Brand' : 'Add New Brand'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#2c2520] mb-2">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value, slug: generateSlug(e.target.value) });
                  }}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2c2520] mb-2">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2c2520] mb-2">Logo URL</label>
                <input
                  type="text"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2c2520] mb-2">Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2c2520] mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none"
              />
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
                {editingBrand ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingBrand(null);
                  setFormData({ name: '', slug: '', description: '', logo: '', website: '', is_active: true });
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
              <th className="px-6 py-3 text-left text-xs font-medium text-[#6b5d52] uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#6b5d52] uppercase">Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#6b5d52] uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#6b5d52] uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {brands.map((brand) => (
              <tr key={brand.id}>
                <td className="px-6 py-4 text-sm font-medium text-[#2c2520]">{brand.name}</td>
                <td className="px-6 py-4 text-sm text-[#6b5d52]">{brand.slug}</td>
                <td className="px-6 py-4">
                  {brand.is_active ? (
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>
                  ) : (
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Inactive</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button
                    onClick={() => handleEdit(brand)}
                    className="text-[#ba9157] hover:text-[#a67d4a]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(brand.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

