# Complete Setup Instructions - LuxeGlow E-commerce

Follow these steps **in order** to set up everything:

## Step 1: Run the Complete Database Setup

1. Go to your Supabase Dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the **ENTIRE** contents of `supabase-complete-setup.sql`
5. Click **Run** (or press Ctrl+Enter)
6. Wait for it to complete (should see "Success. No rows returned")

## Step 2: Create Storage Bucket

1. In Supabase Dashboard, click **Storage** in the left sidebar
2. Click **New Bucket**
3. Name: `product-images`
4. **IMPORTANT**: Check the box "Public bucket" (make it public)
5. Click **Create bucket**

## Step 3: Set Up Storage Policies

1. Go back to **SQL Editor**
2. Copy and paste the contents of `supabase-storage-policies.sql`
3. Click **Run**
4. Wait for success message

## Step 4: Make Yourself an Admin

1. Go to **Authentication** → **Users** in Supabase Dashboard
2. Find your user account
3. Copy the **User UID** (it's a long string like `abc123-def456-...`)
4. Go to **SQL Editor**
5. Open `supabase-make-admin.sql`
6. Replace `YOUR_USER_ID_HERE` with your actual User UID
7. Run the query

**Example:**
```sql
UPDATE user_profiles
SET is_admin = true
WHERE user_id = '3bb72648-d1ea-44e4-a15a-65cd255533ae';
```

## Step 5: Verify Setup

1. Go to **Table Editor** in Supabase
2. You should see these tables:
   - products
   - user_profiles
   - cart_items
   - orders
   - order_items
   - categories
   - brands
   - blogs

3. Check **categories** table - should have 6 categories
4. Check **brands** table - should have 14 brands

## Step 6: Test Admin Access

1. Go to `http://localhost:3000/admin/login`
2. Log in with your account
3. You should be able to access the admin panel

## Troubleshooting

### If you get errors:
- Make sure you're running the scripts in order
- Check that previous scripts completed successfully
- Some errors about "already exists" are OK - it means it's already set up

### If admin access doesn't work:
- Double-check your User UID is correct
- Make sure you ran the `supabase-make-admin.sql` script
- Try logging out and logging back in

### If images don't upload:
- Make sure the `product-images` bucket exists
- Make sure it's set to **Public**
- Make sure you ran the storage policies script

## That's It!

Your e-commerce platform is now fully set up and ready to use!

