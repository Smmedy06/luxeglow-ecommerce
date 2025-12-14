# Complete Setup Guide for LuxeGlow E-commerce

This guide will help you set up the complete e-commerce platform with all features.

## Prerequisites

1. Node.js 18+ installed
2. Supabase account and project
3. Environment variables configured

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Supabase

### 2.1 Create Supabase Storage Bucket

1. Go to your Supabase project dashboard
2. Navigate to **Storage** → **Buckets**
3. Click **New Bucket**
4. Name: `product-images`
5. Make it **Public**
6. Click **Create bucket**

### 2.2 Set Up Storage Policies

Run this SQL in Supabase SQL Editor:

```sql
-- Allow public read access to product images
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'product-images' AND
  auth.role() = 'authenticated'
);

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'product-images' AND
  auth.role() = 'authenticated'
);

-- Allow authenticated users to delete their uploads
CREATE POLICY "Authenticated users can delete" ON storage.objects
FOR DELETE USING (
  bucket_id = 'product-images' AND
  auth.role() = 'authenticated'
);
```

### 2.3 Run Database Schemas

Run these SQL scripts **in order** in Supabase SQL Editor:

1. **First**: `supabase-schema.sql` - Base schema
2. **Second**: `supabase-fix-rls-recursion.sql` - Fix RLS recursion
3. **Third**: `supabase-admin-schema.sql` - Admin features
4. **Fourth**: `supabase-add-images-column.sql` - Multiple images support

### 2.4 Make Yourself an Admin

Run this SQL (replace `YOUR_USER_ID` with your actual user ID):

```sql
UPDATE user_profiles
SET is_admin = true
WHERE user_id = 'YOUR_USER_ID';
```

To find your user ID:
1. Go to Authentication → Users in Supabase
2. Copy your user ID
3. Use it in the SQL above

## Step 3: Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 4: Seed Initial Data (Optional)

### 4.1 Create Categories

```sql
INSERT INTO categories (name, slug, is_active) VALUES
('Dermal Fillers', 'dermal-fillers', true),
('Anti-Wrinkle Injections', 'anti-wrinkle-injections', true),
('Mesotherapy', 'mesotherapy', true),
('Professional Skincare', 'professional-skincare', true),
('Thread Lifts', 'thread-lifts', true),
('Medical Devices', 'medical-devices', true);
```

### 4.2 Create Brands

```sql
INSERT INTO brands (name, slug, is_active) VALUES
('ALLERGAN', 'allergan', true),
('GALDERMA', 'galderma', true),
('TEOSYAL', 'teosyal', true),
('MERZ', 'merz', true),
('CROMA', 'croma', true),
('FILORGA', 'filorga', true),
('PLURYAL', 'pluryal', true),
('DERMALAX', 'dermalax', true),
('PDO', 'pdo', true),
('ZO SKIN HEALTH', 'zo-skin-health', true),
('SKINCEUTICALS', 'skinceuticals', true),
('OBAGI', 'obagi', true),
('MEDICAL GRADE', 'medical-grade', true),
('PRECISION', 'precision', true);
```

## Step 5: Run the Application

```bash
npm run dev
```

Visit `http://localhost:3000`

## Step 6: Access Admin Panel

1. Go to `http://localhost:3000/admin/login`
2. Log in with your admin account
3. You'll be redirected to `/admin` dashboard

## Features

### Admin Panel Features

✅ **Product Management**
- Create/Edit products with multiple images
- Brand and category dropdowns
- Image upload with optimization
- Stock management

✅ **User Management**
- View all users
- View user order history
- Toggle admin status
- User statistics

✅ **Order Management**
- View all orders
- Update order status
- Add tracking numbers
- Order details view

✅ **Category & Brand Management**
- Create/Edit categories
- Create/Edit brands
- Active/Inactive toggle

✅ **Blog Management**
- Create/Edit blog posts
- Publish/Unpublish
- Featured images

### Frontend Features

✅ **Shop Page**
- Product listing with filters
- Category filtering
- Price range filtering
- Search functionality
- Mobile responsive

✅ **Product Details**
- Multiple image gallery
- Product information
- Add to cart

✅ **Cart & Checkout**
- Shopping cart
- Checkout process
- Order confirmation

✅ **Order Tracking**
- Order history
- Status timeline
- Tracking number display
- Order details

✅ **User Profile**
- Profile management
- Shipping address
- Order history

## Mobile Responsive

All pages are fully mobile responsive:
- Admin panel works on mobile
- Shop page optimized for mobile
- Order tracking on mobile
- User management on mobile

## Image Optimization

- Images are automatically optimized using Next.js Image component
- Multiple image support for products
- Lazy loading for better performance
- Responsive image sizes

## Performance Optimizations

- Lazy loading components
- Optimized database queries
- Image optimization
- Efficient state management
- Mobile-first responsive design

## Troubleshooting

### Images not uploading
- Check Supabase Storage bucket exists
- Verify storage policies are set
- Check bucket is public

### Admin access denied
- Verify `is_admin` is set to `true` in `user_profiles`
- Check you're logged in with the correct account
- Run the admin setup SQL again

### Products not showing
- Check categories and brands exist
- Verify products have valid category_id and brand_id
- Check RLS policies are correct

### Order status not updating
- Verify RLS policies allow admin updates
- Check order exists in database
- Verify user has admin privileges

## Support

For issues or questions, check:
1. Supabase logs in dashboard
2. Browser console for errors
3. Network tab for failed requests

