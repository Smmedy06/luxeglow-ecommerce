# Product Discount & Featured Products Setup Guide

## Overview
This guide explains how to set up quantity discounts and featured products functionality.

## Step 1: Run Database Migration

1. Go to your **Supabase Dashboard**
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the **ENTIRE** contents of `supabase-add-product-discounts-featured.sql`
5. Click **Run** (or press Ctrl+Enter)
6. Wait for it to complete (should see "Success. No rows returned")

This will add the following columns to the `products` table:
- `discount_percentage_5_9` - Discount percentage for 5-9 units (e.g., 5.5 for 5.5%)
- `discount_percentage_10_plus` - Discount percentage for 10+ units (e.g., 11.1 for 11.1%)
- `is_featured` - Boolean to mark products as featured

## Step 2: Features Implemented

### ✅ Quantity Selector with +/- Buttons
- Replaced dropdown with modern +/- button interface
- Input field shows current quantity
- Buttons disabled at min (1) and max (stock count) values

### ✅ Buy More, Save More Table
- Automatically displays when discounts are configured
- Shows quantity ranges (5-9 and 10+)
- Displays discount amount and price per unit
- Updates dynamically based on admin settings

### ✅ Dynamic Price Calculation
- Price updates automatically based on selected quantity
- Applies correct discount tier (5-9 or 10+)
- Shows original price with strikethrough when discount applies
- Cart uses discounted price when adding items

### ✅ Admin Product Management
- **Discount Fields**: 
  - "Discount for 5-9 units (%)" - Enter percentage (e.g., 5.5)
  - "Discount for 10+ units (%)" - Enter percentage (e.g., 11.1)
- **Featured Product Checkbox**: 
  - Check to feature product on homepage carousel
  - Uncheck to remove from featured list

### ✅ Featured Products Carousel
- Automatically loads products marked as `is_featured = true`
- Shows up to 4 featured products
- Only displays in-stock products
- Falls back gracefully if no featured products exist

## Step 3: How to Use

### Setting Up Discounts (Admin)

1. Go to **Admin Panel** → **Products**
2. Click **Edit** on any product
3. Scroll to **"Quantity Discounts"** section
4. Enter discount percentages:
   - **5-9 units**: Enter percentage (e.g., `5.5` for 5.5% discount)
   - **10+ units**: Enter percentage (e.g., `11.1` for 11.1% discount)
5. Click **Save Product**

### Making a Product Featured (Admin)

1. Go to **Admin Panel** → **Products**
2. Click **Edit** on the product you want to feature
3. Scroll to **"Featured Product"** section
4. Check the **"Featured Product"** checkbox
5. Click **Save Product**
6. The product will now appear in the homepage carousel

### Customer Experience

1. **View Product**: Customer sees base price
2. **Select Quantity**: 
   - If quantity is 5-9: Price updates with first discount tier
   - If quantity is 10+: Price updates with second discount tier
3. **See Discount Table**: "Buy More, Save More" table shows available discounts
4. **Add to Cart**: Uses discounted price based on quantity

## Step 4: Example Configuration

### Example Product Setup:
- **Base Price**: £14.99
- **Discount 5-9**: 5.5%
- **Discount 10+**: 11.1%

### Result:
- **1-4 units**: £14.99 each
- **5-9 units**: £14.16 each (5.5% discount = £0.83 off)
- **10+ units**: £13.33 each (11.1% discount = £1.66 off)

## Step 5: Testing

1. **Test Discounts**:
   - Create/edit a product with discounts
   - Visit product page
   - Change quantity to 5, then 10
   - Verify price updates correctly
   - Verify "Buy More, Save More" table displays

2. **Test Featured Products**:
   - Mark 2-4 products as featured
   - Visit homepage
   - Verify products appear in carousel
   - Unmark a product
   - Verify it disappears from carousel

## Troubleshooting

### Discounts Not Showing
- Check that discount percentages are set in admin panel
- Verify database migration ran successfully
- Check browser console for errors

### Featured Products Not Showing
- Verify products are marked as `is_featured = true` in database
- Check that products are in stock (`in_stock = true`)
- Verify at least one product is featured

### Price Not Updating
- Check that quantity is >= 5 for first tier or >= 10 for second tier
- Verify discount percentages are numbers (not strings)
- Check browser console for calculation errors

## Database Schema

The following columns were added to the `products` table:

```sql
discount_percentage_5_9 DECIMAL(5, 2) DEFAULT 0
discount_percentage_10_plus DECIMAL(5, 2) DEFAULT 0
is_featured BOOLEAN DEFAULT false
```

## Notes

- Discounts are calculated as percentages (e.g., 5.5 = 5.5% off)
- Prices are calculated in real-time on the frontend
- Cart uses the discounted price when adding items
- Featured products are limited to 4 on the homepage
- All changes are saved to the database immediately

