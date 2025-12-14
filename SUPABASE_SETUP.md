# Supabase Setup Instructions

This document provides instructions for setting up Supabase for your LuxeGlow ecommerce application.

## Prerequisites

1. A Supabase account (https://supabase.com)
2. Your Supabase project URL and API key (already provided)

## Step 1: Create Database Tables

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase-schema.sql` into the SQL Editor
4. Click "Run" to execute the SQL script

This will create the following tables:
- `products` - Stores product information
- `user_profiles` - Stores user profile and shipping information
- `cart_items` - Stores user cart items
- `orders` - Stores order information
- `order_items` - Stores individual items within orders

## Step 2: Enable Google OAuth (Optional)

If you want to enable Google OAuth login:

1. Go to Authentication > Providers in your Supabase dashboard
2. Enable Google provider
3. Add your Google OAuth credentials:
   - Client ID
   - Client Secret
4. Add your redirect URL: `http://localhost:3000/auth/callback` (for development)
5. For production, add your production URL: `https://yourdomain.com/auth/callback`

## Step 3: Seed Products (Optional)

To populate your products table with initial data:

1. Go to the SQL Editor in Supabase
2. You can manually insert products using the SQL INSERT statements, or
3. Use the Supabase dashboard to manually add products through the Table Editor

## Step 4: Configure Row Level Security (RLS)

The SQL schema already includes RLS policies, but you can verify them:

1. Go to Authentication > Policies in your Supabase dashboard
2. Verify that the following policies are in place:
   - Products: Public read access
   - User profiles: Users can only see/edit their own profile
   - Cart items: Users can only see/edit their own cart
   - Orders: Users can only see their own orders
   - Order items: Users can only see items from their own orders

## Step 5: Test the Integration

1. Start your Next.js development server:
   ```bash
   npm run dev
   ```

2. Test the following features:
   - User registration/login
   - Google OAuth (if enabled)
   - Product browsing
   - Adding items to cart
   - Checkout process
   - Viewing orders
   - Updating profile

## Troubleshooting

### Common Issues

1. **Authentication errors**: Make sure your Supabase URL and API key are correct in `src/lib/supabase.ts`

2. **Database connection errors**: Verify that:
   - The database tables are created
   - RLS policies are enabled
   - Your API key has the correct permissions

3. **Google OAuth not working**: 
   - Verify Google OAuth is enabled in Supabase
   - Check that redirect URLs are correctly configured
   - Ensure your Google OAuth credentials are valid

4. **Cart not syncing**: 
   - Check that the user is authenticated
   - Verify cart_items table exists and has proper RLS policies

## Environment Variables (Optional)

For better security, you can move your Supabase credentials to environment variables:

1. Create a `.env.local` file in your project root:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://jjemerhlkrgjveymixxs.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

2. Update `src/lib/supabase.ts` to use environment variables:
   ```typescript
   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jjemerhlkrgjveymixxs.supabase.co';
   const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your_anon_key_here';
   ```

## Next Steps

- Add more products through the Supabase dashboard
- Configure email templates for authentication emails
- Set up webhooks for order processing (if needed)
- Configure backup and monitoring

For more information, visit the [Supabase Documentation](https://supabase.com/docs).

