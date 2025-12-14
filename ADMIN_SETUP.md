# Admin Panel Setup Guide

## Overview

The admin panel is accessible at `/admin` and provides full CRUD functionality for managing:
- Products
- Users
- Orders
- Blogs
- Categories
- Brands

## Setup Instructions

### 1. Run the Fix Script First (IMPORTANT!)

Before setting up the admin panel, you need to fix the RLS recursion issue:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase-fix-rls-recursion.sql`
4. Click "Run" to execute the script

This will create the `is_admin()` function that bypasses RLS.

### 2. Run the Admin Schema SQL

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase-admin-schema.sql`
4. Click "Run" to execute the script

This will:
- Add `is_admin` column to `user_profiles` table
- Create `categories` table
- Create `brands` table
- Create `blogs` table
- Update `products` table with foreign keys
- Set up RLS policies for admin access

### 3. Make Yourself an Admin

To access the admin panel, you need to set your user account as an admin:

1. First, create a regular user account on your website (sign up)
2. Go to Supabase Dashboard > Table Editor
3. Open the `user_profiles` table
4. Find your user profile (by `user_id`)
5. Set `is_admin` to `true`
6. Save the changes

Alternatively, you can run this SQL query (replace `YOUR_USER_ID` with your actual user ID):

```sql
UPDATE user_profiles
SET is_admin = true
WHERE user_id = 'YOUR_USER_ID';
```

### 4. Access the Admin Panel

1. Navigate to `/admin` in your browser
2. You will be redirected to `/admin/login`
3. Enter your admin email and password (the same credentials you used to sign up)
4. After successful login, you'll be redirected to the admin dashboard

## Admin Panel Features

### Dashboard (`/admin`)
- Overview statistics for all entities
- Recent orders list
- Quick navigation to all management pages

### Products Management (`/admin/products`)
- View all products
- Create new products
- Edit existing products
- Delete products
- Search and filter products

### Users Management (`/admin/users`)
- View all users
- Grant/revoke admin access
- Search users

### Orders Management (`/admin/orders`)
- View all orders
- Filter by status
- Update order status
- View order details

### Categories Management (`/admin/categories`)
- Create categories
- Edit categories
- Delete categories
- Activate/deactivate categories
- Auto-generate slugs

### Brands Management (`/admin/brands`)
- Create brands
- Edit brands
- Delete brands
- Activate/deactivate brands
- Add brand logos and websites

### Blogs Management (`/admin/blogs`)
- Create blog posts
- Edit blog posts
- Delete blog posts
- Publish/unpublish blogs
- Add featured images, categories, and tags

## Security

- Only users with `is_admin = true` can access the admin panel
- All admin operations are protected by Row Level Security (RLS) policies
- Non-admin users are automatically redirected to the home page

## Notes

- The admin panel uses the same authentication system as the main site
- All changes are immediately reflected in the database
- Make sure to test all CRUD operations after setup

