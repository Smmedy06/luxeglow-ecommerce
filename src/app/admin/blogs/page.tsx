'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  is_published: boolean;
  published_at: string | null;
  views: number;
  created_at: string;
}

export default function AdminBlogsPage() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    category: '',
    tags: '',
    is_published: false,
  });

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading blogs:', error);
      } else {
        setBlogs(data || []);
      }
    } catch (error) {
      console.error('Error loading blogs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const blogData = {
        ...formData,
        slug: formData.slug || generateSlug(formData.title),
        author_id: user.id,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
        published_at: formData.is_published && !editingBlog ? new Date().toISOString() : null,
      };

      if (editingBlog) {
        const { error } = await supabase
          .from('blogs')
          .update(blogData)
          .eq('id', editingBlog.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('blogs')
          .insert(blogData);

        if (error) throw error;
      }

      setShowForm(false);
      setEditingBlog(null);
      setFormData({ title: '', slug: '', excerpt: '', content: '', featured_image: '', category: '', tags: '', is_published: false });
      loadBlogs();
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('Failed to save blog');
    }
  };

  const handleEdit = async (blog: Blog) => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', blog.id)
        .single();

      if (error) throw error;

      setEditingBlog(blog);
      setFormData({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt || '',
        content: data.content,
        featured_image: data.featured_image || '',
        category: data.category || '',
        tags: data.tags ? data.tags.join(', ') : '',
        is_published: data.is_published,
      });
      setShowForm(true);
    } catch (error) {
      console.error('Error loading blog:', error);
      alert('Failed to load blog');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog');
    }
  };

  const handleTogglePublish = async (blog: Blog) => {
    try {
      const { error } = await supabase
        .from('blogs')
        .update({
          is_published: !blog.is_published,
          published_at: !blog.is_published ? new Date().toISOString() : null,
        })
        .eq('id', blog.id);

      if (error) throw error;
      loadBlogs();
    } catch (error) {
      console.error('Error toggling publish status:', error);
      alert('Failed to update publish status');
    }
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#2c2520]">Blogs Management</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingBlog(null);
            setFormData({ title: '', slug: '', excerpt: '', content: '', featured_image: '', category: '', tags: '', is_published: false });
          }}
          className="px-6 py-3 bg-[#ba9157] text-white rounded-lg hover:bg-[#a67d4a] transition-colors font-medium"
        >
          + Add Blog
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-[#2c2520] mb-4">
            {editingBlog ? 'Edit Blog' : 'Add New Blog'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#2c2520] mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value, slug: generateSlug(e.target.value) });
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
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2c2520] mb-2">Excerpt</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2c2520] mb-2">Content *</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={10}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#2c2520] mb-2">Featured Image URL</label>
                <input
                  type="text"
                  value={formData.featured_image}
                  onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2c2520] mb-2">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2c2520] mb-2">Tags (comma-separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="tag1, tag2, tag3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="w-4 h-4 text-[#ba9157] border-gray-300 rounded focus:ring-[#ba9157]"
              />
              <label className="ml-2 text-sm font-medium text-[#2c2520]">Published</label>
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="px-6 py-2 bg-[#ba9157] text-white rounded-lg hover:bg-[#a67d4a] transition-colors"
              >
                {editingBlog ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingBlog(null);
                  setFormData({ title: '', slug: '', excerpt: '', content: '', featured_image: '', category: '', tags: '', is_published: false });
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
              <th className="px-6 py-3 text-left text-xs font-medium text-[#6b5d52] uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#6b5d52] uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#6b5d52] uppercase">Views</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#6b5d52] uppercase">Created</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#6b5d52] uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {blogs.map((blog) => (
              <tr key={blog.id}>
                <td className="px-6 py-4 text-sm font-medium text-[#2c2520]">{blog.title}</td>
                <td className="px-6 py-4">
                  {blog.is_published ? (
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Published</span>
                  ) : (
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Draft</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-[#6b5d52]">{blog.views}</td>
                <td className="px-6 py-4 text-sm text-[#6b5d52]">
                  {new Date(blog.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button
                    onClick={() => handleEdit(blog)}
                    className="text-[#ba9157] hover:text-[#a67d4a]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleTogglePublish(blog)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {blog.is_published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={() => handleDelete(blog.id)}
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

