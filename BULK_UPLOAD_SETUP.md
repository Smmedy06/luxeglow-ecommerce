# Bulk Upload Products Setup Guide

## Overview
This guide explains how to use the bulk upload feature to import products from an Excel file.

## Step 1: Run Database Migrations

Run these SQL scripts in Supabase SQL Editor in order:

1. **Update Categories and Brands**: Run `supabase-update-categories-brands.sql`
   - Removes old categories/brands
   - Adds new categories: Filler, Premium Filler, Body Kit/Filler, Skin Boosters, Fat Dissolvers, Eye Meso, Needles
   - Adds new brands: All 24 brands listed

2. **Add Short Description & Remove Fields**: Run `supabase-add-short-description-remove-fields.sql`
   - Adds `short_description` field
   - Removes `sku`, `weight`, `dimensions` fields

3. **Add Discounts & Featured**: Run `supabase-add-product-discounts-featured.sql` (if not already run)
   - Adds discount percentage fields
   - Adds `is_featured` field

## Step 2: Excel File Format

Your Excel file should have these columns (in this order):

| Column Name | Required | Description |
|------------|----------|-------------|
| ProductName | Yes | Product name |
| Category | Yes | Must match one of: Filler, Premium Filler, Body Kit/Filler, Skin Boosters, Fat Dissolvers, Eye Meso, Needles |
| Price | Yes | Product price (e.g., 14.99 or £14.99) |
| Short Description | No | Brief description shown on product cards |
| Long Description | No | Detailed description shown on product page |
| Quantity Range 1 | No | First quantity range (e.g., "5-9") |
| Discount 1 (£) | No | Discount amount for range 1 |
| Price Per Unit 1 (£) | No | Price per unit for range 1 |
| Quantity Range 2 | No | Second quantity range (e.g., "10+") |
| Discount 2 (£) | No | Discount amount for range 2 |
| Price Per Unit 2 (£) | No | Price per unit for range 2 |
| Image Path | No | URL or path to product image |

### Example Excel Row:
```
ProductName: Regenovue Deep Plus Lidocaine
Category: Filler
Price: 14.99
Short Description: Long-Lasting Volume and Wrinkle Correction
Long Description: Premium hyaluronic acid dermal filler for moderate to deep wrinkles...
Quantity Range 1: 5-9
Discount 1 (£): 0.83
Price Per Unit 1 (£): 14.16
Quantity Range 2: 10+
Discount 2 (£): 1.66
Price Per Unit 2 (£): 13.33
Image Path: https://example.com/image.jpg
```

## Step 3: Brand Auto-Detection

The system automatically detects brands from product names. If a product name contains any of these brand names, it will be automatically assigned:

- Ami Eyes, Eyebella, Flawless, Hyaron, Jalupro, Juvederm
- Lemon Bottle, Lumi, Lumi Eyes, Luxfill, NanoImpact 8, Neuramis
- Nucleofill, Plinest, Profhilo, Pure, Regenovue, Revitrane
- Revolax, Revs Pro, Seventy Hyal, Stylage, Teoxane, Vitaran

**Example**: Product name "Juvederm Volux Lidocaine" will automatically get brand "Juvederm"

If no brand is detected, the product will have `brand_id = null` and won't show a brand name.

## Step 4: Default Discounts

If discount information is not provided in the Excel file:
- **5-9 units**: 5% discount (default)
- **10+ units**: 10% discount (default)

If discount information is provided via "Price Per Unit" columns, the system calculates the discount percentage automatically.

## Step 5: Using Bulk Upload

1. Go to **Admin Panel** → **Products**
2. You'll see a **"Bulk Upload Products"** section at the top
3. Click **"Choose File"** and select your Excel file (.xlsx or .xls)
4. The system will:
   - Parse the Excel file
   - Validate each row
   - Auto-detect brands from product names
   - Calculate discounts
   - Upload products to database
5. You'll see:
   - Progress bar during upload
   - Success count
   - Error list (if any)

## Step 6: Handling Images

The "Image Path" column can contain:
- Full URL: `https://example.com/product.jpg`
- Relative path: `/images/product.jpg`
- Empty: Product will have no image

**Note**: For now, images should be hosted externally or uploaded separately. The bulk upload uses the path as-is.

## Troubleshooting

### "Category not found" Error
- Make sure category names match exactly: Filler, Premium Filler, Body Kit/Filler, Skin Boosters, Fat Dissolvers, Eye Meso, Needles
- Case-insensitive matching is used

### "Invalid price" Error
- Price should be a number (e.g., 14.99 or £14.99)
- Currency symbols and commas are automatically removed

### Brand Not Assigned
- Check if product name contains any brand name
- Brand names are case-insensitive
- If no match, product will have no brand (this is OK)

### Discounts Not Working
- If discount columns are empty, defaults (5% and 10%) are used
- If "Price Per Unit" is provided, discount is calculated automatically
- Make sure quantity ranges contain "5" or "9" for first tier, "10" or "+" for second tier

## Notes

- Products are created with `in_stock = true` and `stock_count = 0` by default
- Products are NOT featured by default (`is_featured = false`)
- Slug is auto-generated from product name
- All products are set to active/in stock during bulk upload
- You can edit individual products after bulk upload to adjust stock, featured status, etc.

