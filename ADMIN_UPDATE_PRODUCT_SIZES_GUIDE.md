# 📝 Admin Guide: Update Product Customization Options

## 🎯 Purpose
This guide shows you how to update product customization options (like sizes, types, etc.) through the admin panel without restarting the backend.

---

## 🚀 Method 1: Update via Admin Panel (Recommended)

### Step 1: Login to Admin Panel
1. Go to: `http://localhost:5173/admin`
2. Login with admin credentials:
   - Username: `admin`
   - Password: `admin123`

### Step 2: Navigate to Products
1. Click on **"Manage Products"** card
2. Find the product you want to update (e.g., "Customised Caricature")
3. Click the **Edit** button (pencil icon)

### Step 3: Update Customization Options
1. Scroll down to **"Customization Options (JSON)"** textarea
2. Replace the existing JSON with the new options:

```json
{
  "type": "caricature",
  "hasPhotoUpload": true,
  "options": [
    {
      "category": "Type",
      "choices": [
        {
          "name": "Individual",
          "price": 0,
          "description": "Single person caricature"
        },
        {
          "name": "Couple",
          "price": 500,
          "description": "Two people caricature"
        }
      ]
    },
    {
      "category": "Size",
      "choices": [
        {
          "name": "18 cm × 8 cm",
          "price": 0,
          "width": 18,
          "height": 8
        },
        {
          "name": "14 cm × 5 cm",
          "price": 200,
          "width": 14,
          "height": 5
        },
        {
          "name": "22.5 cm × 9 cm",
          "price": 400,
          "width": 22.5,
          "height": 9
        }
      ]
    }
  ]
}
```

3. Click **"Update Product"** button
4. Wait for success message
5. **Refresh the product customization page** to see changes

---

## 🗄️ Method 2: Update via Database (Alternative)

### Option A: Using Supabase Dashboard
1. Go to Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor**
4. Run the SQL script from `database/UPDATE_CARICATURE_SIZES.sql`

### Option B: Using pgAdmin or DBeaver
1. Connect to your PostgreSQL database
2. Open SQL query window
3. Run the SQL script from `database/UPDATE_CARICATURE_SIZES.sql`

---

## 📋 JSON Structure Reference

### Basic Structure
```json
{
  "type": "product_type",
  "hasPhotoUpload": true/false,
  "options": [
    {
      "category": "Category Name",
      "choices": [
        {
          "name": "Choice Name",
          "price": 0,
          "width": 18,
          "height": 8
        }
      ]
    }
  ]
}
```

### Field Descriptions
- **type**: Product type identifier (e.g., "caricature", "mug", "calendar")
- **hasPhotoUpload**: Whether product requires photo upload
- **options**: Array of customization categories
  - **category**: Name of the option group (e.g., "Size", "Type", "Color")
  - **choices**: Array of available choices
    - **name**: Display name of the choice
    - **price**: Additional price for this choice (0 = included in base price)
    - **width/height**: Dimensions in cm (optional, for size-based products)

---

## 💡 Tips

### Adding New Size Options
To add a new size, just add another object to the "choices" array:
```json
{
  "name": "30 cm × 15 cm",
  "price": 600,
  "width": 30,
  "height": 15
}
```

### Changing Prices
Simply update the `price` field for any choice:
```json
{
  "name": "14 cm × 5 cm",
  "price": 250,  // Changed from 200 to 250
  "width": 14,
  "height": 5
}
```

### Removing Options
Delete the entire choice object from the array.

---

## ⚠️ Important Notes

1. **JSON Validation**: Make sure your JSON is valid (use a JSON validator if needed)
2. **No Backend Restart**: Changes via admin panel take effect immediately
3. **Price Calculation**: The `price` field is added to the base product price
4. **Dimensions**: Width and height are used for 3D hamper builder visualization

---

## 🧪 Testing After Update

1. Go to the product page
2. Click "Customize" button
3. Verify new size options appear
4. Select each size and verify price updates correctly
5. Test adding to cart with different sizes

---

## 🆘 Troubleshooting

**Problem**: Changes not showing after update
- **Solution**: Hard refresh the page (Ctrl + Shift + R)

**Problem**: JSON validation error
- **Solution**: Use https://jsonlint.com/ to validate your JSON

**Problem**: Prices not calculating correctly
- **Solution**: Check that `price` field is a number, not a string

---

## 📞 Need Help?

If you encounter any issues, check:
1. Browser console for errors (F12)
2. Network tab to see if API call succeeded
3. Backend logs for any server errors

