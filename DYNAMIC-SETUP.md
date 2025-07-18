# 🔧 Dynamic Configuration Setup Guide

Your website now supports dynamic content loading from configuration files and Firebase Storage for images!

## ✨ What's New

### 🎯 **Dynamic Content Loading**
- Business name, address, phone, email loaded from `config/site-config.json`
- Images fetched from Firebase Storage
- Services focused on gold/silver (no diamonds)
- Easy to update without touching HTML/CSS

### 🖼️ **Firebase Storage Integration**
- Images stored securely in Firebase Storage
- Automatic fallback to placeholder images
- Optimized loading and caching
- Easy image management

## 📝 Quick Setup Steps

### 1. **Update Your Business Info**

Edit `config/site-config.json`:

```json
{
  "business": {
    "name": "Your Shop Name Here",
    "address": {
      "street": "123 Your Street",
      "city": "Your City", 
      "state": "Your State",
      "zipCode": "12345"
    },
    "contact": {
      "phone": "+91 98765 43210",
      "email": "your-email@domain.com"
    }
  }
}
```

### 2. **Configure Your Images**

Edit `config/images-config.json`:

```json
{
  "firebase": {
    "storage": {
      "bucket": "your-firebase-project.appspot.com"
    }
  }
}
```

### 3. **Upload Images to Firebase Storage**

Create folder structure:
```
jewellery-website/
├── hero/gold-silver-collection.jpg
├── products/
│   ├── gold-necklace-set.jpg
│   ├── silver-bracelet-collection.jpg
│   ├── gold-coins-bars.jpg
│   └── silver-artifacts.jpg
└── services/...
```

## 🎨 **Current Gold & Silver Services**

The website now focuses on:

1. **Gold & Silver Purchase** - Buy old ornaments
2. **Gold & Silver Sale** - Sell new ornaments  
3. **Exchange Services** - Old for new exchange
4. **Repair & Maintenance** - Fix and restore

*(No diamond services as requested)*

## 🚀 **How It Works**

1. **Page loads** → Shows "Loading..." placeholders
2. **Config loads** → Fetches your business info and image configs
3. **Content injects** → Replaces placeholders with your data
4. **Images load** → Fetches from Firebase Storage or shows placeholders
5. **Site ready** → Fully personalized website!

## 📁 **File Structure**

```
site/
├── config/
│   ├── site-config.json      # Your business info
│   └── images-config.json    # Image paths and Firebase config
├── assets/js/
│   ├── config-manager.js     # Loads configurations
│   ├── content-injector.js   # Injects content into HTML
│   └── ...
└── ...
```

## 🔧 **Customization**

### Add New Products
Edit `site-config.json` → `products.categories`:
```json
{
  "name": "Gold Bangles",
  "description": "Traditional gold bangles",
  "priceRange": "As per current gold rate"
}
```

### Update Services
Edit `site-config.json` → `services.offerings`:
```json
{
  "name": "Silver Polishing",
  "icon": "fas fa-star",
  "description": "Professional silver cleaning service"
}
```

### Change About Section
Edit `site-config.json` → `about.story`:
```json
"story": [
  "Your business story paragraph 1",
  "Your business story paragraph 2"
]
```

## 🛠️ **Development**

### Test Locally
```bash
# Serve files locally
python -m http.server 8000
# or
npx http-server
```

### Update Content
1. Edit JSON config files
2. Refresh browser
3. Changes appear instantly!

## 🔒 **Security Features**

- ✅ Firebase Storage with secure rules
- ✅ Config files are safe to commit (no secrets)
- ✅ Images cached for performance
- ✅ Graceful fallbacks if Firebase is unavailable

## 📱 **Mobile Responsive**

- All dynamic content works on mobile
- Touch-friendly carousels
- Optimized image loading
- Fast performance

## 🎯 **Benefits**

1. **Easy Updates** - Change content without coding
2. **Professional Images** - Firebase CDN delivers fast
3. **SEO Friendly** - All content is crawlable
4. **Maintainable** - Separate content from code
5. **Scalable** - Easy to add new products/services

## 🆘 **Need Help?**

1. Check browser console for errors
2. Verify Firebase Storage setup
3. Ensure config files are valid JSON
4. Test with placeholder images first
5. See `FIREBASE-STORAGE.md` for detailed setup

---

**Your website is now fully dynamic and ready for your gold & silver business! 🥇🥈**
