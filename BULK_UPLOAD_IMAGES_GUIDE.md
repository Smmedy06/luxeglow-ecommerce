# Bulk Upload with Images Guide

## Overview
The bulk upload feature now supports uploading product images along with the Excel file. Images are automatically matched to products by name and uploaded to Supabase Storage.

## How It Works

### Image Matching Logic
- Product names are normalized: spaces → hyphens, lowercase, special characters removed
- Image filenames are normalized the same way (without extension)
- Matching is case-insensitive and handles special characters

**Examples:**
- Product: "Ami Eyes Product" → Matches: "Ami-Eyes-Product.jpg"
- Product: "Juvederm Volux" → Matches: "juvederm-volux.png"
- Product: "Regenovue Deep Plus" → Matches: "regenovue-deep-plus.jpg"

### Upload Process
1. **Select Images**: Choose all product images from your folder
2. **Select Excel File**: Choose your Excel file with product data
3. **Automatic Matching**: System matches images to products by name
4. **Upload to Storage**: Images are uploaded to Supabase Storage
5. **Link to Products**: Image URLs are stored in the database

## Step-by-Step Instructions

### Step 1: Prepare Your Files

1. **Excel File**: Your product data with columns:
   - ProductName (required)
   - Category (required)
   - Price (required)
   - Short Description, Long Description (optional)
   - Discount columns (optional)
   - Image Path (optional - will be overridden if image is matched)

2. **Image Folder**: All product images with filenames matching product names
   - Use hyphens instead of spaces: "Ami-Eyes.jpg" not "Ami Eyes.jpg"
   - Supported formats: .jpg, .jpeg, .png, .webp, etc.
   - Case doesn't matter: "ami-eyes.jpg" matches "Ami Eyes"

### Step 2: Upload

1. Go to **Admin Panel** → **Products**
2. In the **"Bulk Upload Products"** section:
   - **First**: Click "Choose Files" under "Upload Product Images"
   - Select **ALL** images from your folder (you can select multiple files at once)
   - You'll see: "✓ X image(s) selected"
3. **Then**: Click "Choose Files" under "Upload Excel Files"
   - Select **ALL** your Excel files at once (e.g., all 7 category files)
   - You can select multiple files using Ctrl+Click or Shift+Click
4. The upload will start automatically:
   - First reads all Excel files
   - Then processes all products from all files
   - Matches images to products across all files
   - Uploads everything together

### Step 3: Monitor Progress

You'll see:
- Progress bar showing current/total products
- Current stage: "Reading Excel file...", "Uploading image for...", "Creating product..."
- Success count when complete
- Error list if any issues occur

## Image Matching Examples

| Product Name | Image Filename | Match? |
|-------------|---------------|--------|
| Ami Eyes Product | Ami-Eyes-Product.jpg | ✅ Yes |
| Ami Eyes Product | ami-eyes-product.png | ✅ Yes |
| Juvederm Volux | Juvederm-Volux.jpg | ✅ Yes |
| Regenovue Deep Plus | regenovue-deep-plus.jpg | ✅ Yes |
| Product Name | Product-Name.jpg | ✅ Yes |
| Product Name | ProductName.jpg | ❌ No (missing hyphen) |
| Product Name | Different-Name.jpg | ❌ No |

## Important Notes

### Image Priority
1. **Matched Image**: If an image is found matching the product name, it's uploaded and used
2. **Excel Image Path**: If no match but Excel has "Image Path", that URL is used
3. **No Image**: If neither exists, product has no image

### Image Upload
- Images are uploaded to Supabase Storage bucket: `product-images`
- Each image gets a unique filename with timestamp
- Public URLs are generated and stored in database
- Images are stored in: `products/{timestamp}-{random}.{ext}`

### Performance
- Images are uploaded one at a time to avoid overwhelming the server
- Progress updates show which product/image is being processed
- Large batches may take several minutes

## Troubleshooting

### Image Not Matched
**Problem**: Product created but no image attached

**Solutions**:
- Check image filename matches product name (spaces → hyphens)
- Ensure image file extension is valid (.jpg, .png, etc.)
- Verify image was selected in the file input
- Check browser console for matching errors

### Image Upload Failed
**Problem**: Error message about image upload failure

**Solutions**:
- Check Supabase Storage bucket exists: `product-images`
- Verify storage policies allow uploads
- Check file size (very large images may fail)
- Ensure you're authenticated as admin

### Multiple Images Matched
**Problem**: Multiple images match the same product name

**Solution**: The first matching image is used. Rename images to be unique.

### Excel Image Path Override
**Problem**: Excel has Image Path but matched image is used instead

**Solution**: This is by design - matched images take priority. Remove Image Path from Excel if you want to use matched images only.

## Best Practices

1. **Naming Convention**: Use consistent naming:
   - Product: "Brand Product Name"
   - Image: "Brand-Product-Name.jpg"

2. **Image Quality**: 
   - Recommended: 800x800px to 1200x1200px
   - Format: JPG for photos, PNG for graphics
   - File size: Under 2MB per image

3. **Batch Size**:
   - Upload 50-100 products at a time for best performance
   - Very large batches (500+) may take 10+ minutes

4. **Verification**:
   - After upload, check a few products to verify images
   - Edit products individually if images need adjustment

## Example Workflow

1. **Prepare**:
   - Excel files: 7 files (one per category) with total 200 products
   - Image folder: 200 images named like "Product-Name.jpg"

2. **Upload**:
   - Select all 200 images → "✓ 200 image(s) selected"
   - Select all 7 Excel files at once
   - Wait for progress:
     - "Reading file 1/7: Category1.xlsx..." → "Reading file 7/7..."
     - "Processing products..." 
     - "Processing product 1/200..." → "200/200"

3. **Verify**:
   - Check success message: "✓ Successfully uploaded 200 product(s)"
   - Visit product pages to verify images appear
   - Check admin products list

4. **Fix Issues** (if any):
   - Review error list (shows which file/row had issues)
   - Fix Excel files or rename images
   - Re-upload or edit products individually

## Multiple Excel Files

The system supports uploading **multiple Excel files at once**:
- Perfect for organizing products by category (one file per category)
- All products from all files are processed together
- Images are matched across all products from all files
- Progress shows which file is being read and which product is being processed
- Errors indicate which file and row had the issue

