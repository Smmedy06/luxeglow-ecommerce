'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { isAdmin } from '@/lib/admin';
import { uploadImage } from '@/lib/imageUpload';
import Image from 'next/image';

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleBase64Image = async (base64String: string) => {
    // Check if it's a base64 image
    if (!base64String.startsWith('data:image/')) {
      return false;
    }

    // Show confirmation
    if (!confirm('Base64 image detected. Would you like to convert and upload it to Supabase Storage? (Recommended)')) {
      // User chose to keep base64 - but warn about database limitations
      alert('Warning: Base64 images are very long and may cause database errors. It\'s recommended to use the file upload button instead.');
      return true;
    }

    try {
      // Convert base64 to Blob
      const base64Data = base64String.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: base64String.match(/data:image\/([^;]+)/)?.[1] || 'image/jpeg' });
      
      // Validate file size (max 5MB)
      if (blob.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB. Please use the file upload button instead.');
        setFormData({ ...formData, featured_image: '' });
        return true;
      }

      const file = new File([blob], `image-${Date.now()}.jpg`, { type: blob.type });
      setImageFile(file);
      setImagePreview(base64String);
      
      // Auto-upload the converted image
      setIsUploadingImage(true);
      const result = await uploadImage(file, 'blogs');
      
      if (result.error) {
        alert(`Failed to upload image: ${result.error}`);
        setIsUploadingImage(false);
        setFormData({ ...formData, featured_image: '' });
        setImageFile(null);
        setImagePreview('');
        return true;
      }

      if (result.url) {
        setFormData({ ...formData, featured_image: result.url });
        setImagePreview(result.url);
        setImageFile(null);
        alert('Base64 image converted and uploaded successfully!');
      }
      setIsUploadingImage(false);
      return true;
    } catch (error) {
      console.error('Error converting base64 image:', error);
      alert('Failed to convert base64 image. Please use the file upload button instead.');
      setFormData({ ...formData, featured_image: '' });
      return true;
    }
  };

  const handleUploadImage = async () => {
    if (!imageFile) return;

    setIsUploadingImage(true);
    try {
      const result = await uploadImage(imageFile, 'blogs');
      
      if (result.error) {
        alert(`Failed to upload image: ${result.error}`);
        setIsUploadingImage(false);
        return;
      }

      if (result.url) {
        setFormData({ ...formData, featured_image: result.url });
        setImagePreview('');
        setImageFile(null);
        alert('Image uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('You must be logged in to save blogs');
      return;
    }

    // Verify user is admin
    const userIsAdmin = await isAdmin();
    if (!userIsAdmin) {
      alert('Access denied. Admin privileges required to save blogs.');
      return;
    }

    try {
      // Prepare blog data - handle empty strings as null
      const blogData: {
        title: string;
        slug: string;
        content: string;
        author_id: string;
        tags: string[];
        is_published: boolean;
        excerpt?: string;
        featured_image?: string;
        category?: string;
        published_at?: string | null;
      } = {
        title: formData.title.trim(),
        slug: (formData.slug || generateSlug(formData.title)).trim(),
        content: formData.content.trim(),
        author_id: user.id,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t.length > 0) : [],
        is_published: formData.is_published,
      };

      // Only include optional fields if they have values
      if (formData.excerpt && formData.excerpt.trim()) {
        blogData.excerpt = formData.excerpt.trim();
      }
      if (formData.featured_image && formData.featured_image.trim()) {
        blogData.featured_image = formData.featured_image.trim();
      }
      if (formData.category && formData.category.trim()) {
        blogData.category = formData.category.trim();
      }

      // Set published_at only when publishing for the first time
      if (formData.is_published) {
        if (editingBlog) {
          // If editing and wasn't published before, set published_at
          if (!editingBlog.is_published) {
            blogData.published_at = new Date().toISOString();
          }
        } else {
          // New blog being published
          blogData.published_at = new Date().toISOString();
        }
      } else {
        // Unpublishing
        blogData.published_at = null;
      }

      if (editingBlog) {
        const { error } = await supabase
          .from('blogs')
          .update(blogData)
          .eq('id', editingBlog.id)
          .select();

        if (error) {
          console.error('Error updating blog:', error);
          alert(`Failed to update blog: ${error.message}\n\nDetails: ${JSON.stringify(error, null, 2)}`);
          throw error;
        }
      } else {
        const { error } = await supabase
          .from('blogs')
          .insert(blogData)
          .select();

        if (error) {
          console.error('Error creating blog:', error);
          alert(`Failed to create blog: ${error.message}\n\nDetails: ${JSON.stringify(error, null, 2)}`);
          throw error;
        }
      }

      setShowForm(false);
      setEditingBlog(null);
      setFormData({ title: '', slug: '', excerpt: '', content: '', featured_image: '', category: '', tags: '', is_published: false });
      loadBlogs();
    } catch (error) {
      console.error('Error saving blog:', error);
      // Error message already shown in the if blocks above
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
      setImagePreview(data.featured_image || '');
      setImageFile(null);
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
            setImageFile(null);
            setImagePreview('');
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
                <label className="block text-sm font-medium text-[#2c2520] mb-2">Featured Image</label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none"
                  />
                  {imageFile && (
                    <div className="space-y-2">
                      <div className="relative w-full h-32 border border-gray-300 rounded-lg overflow-hidden">
                        {imagePreview.startsWith('blob:') || imagePreview.startsWith('data:') ? (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={handleUploadImage}
                        disabled={isUploadingImage}
                        className="w-full px-4 py-2 bg-[#ba9157] text-white rounded-lg hover:bg-[#a67d4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isUploadingImage ? 'Uploading...' : 'Upload Image'}
                      </button>
                    </div>
                  )}
                  {formData.featured_image && !imageFile && (
                    <div className="space-y-2">
                      <div className="relative w-full h-32 border border-gray-300 rounded-lg overflow-hidden">
                        {formData.featured_image.startsWith('blob:') || formData.featured_image.startsWith('data:') ? (
                          <img
                            src={formData.featured_image}
                            alt="Current featured image"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Image
                            src={formData.featured_image}
                            alt="Current featured image"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, featured_image: '' })}
                        className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Remove Image
                      </button>
                    </div>
                  )}
                  <input
                    type="text"
                    value={formData.featured_image}
                    onChange={async (e) => {
                      const value = e.target.value;
                      // Check if it's a base64 image
                      if (value.startsWith('data:image/')) {
                        await handleBase64Image(value);
                        // Don't set the base64 string directly - it will be replaced with URL
                        return;
                      }
                      setFormData({ ...formData, featured_image: value });
                    }}
                    placeholder="Or enter image URL directly (or paste base64 image to auto-upload)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9157] focus:border-transparent outline-none"
                  />
                  {isUploadingImage && (
                    <p className="text-xs text-blue-600 mt-1">
                      ⏳ Converting and uploading base64 image...
                    </p>
                  )}
                </div>
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
                  setImageFile(null);
                  setImagePreview('');
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

