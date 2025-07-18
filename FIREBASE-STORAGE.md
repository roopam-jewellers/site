# 🔥 Firebase Storage Setup Guide

This guide explains how to set up Firebase Storage for your jewellery website images.

## 📋 Prerequisites

- Firebase project created
- Firebase Storage enabled
- Images ready for upload

## 🚀 Firebase Storage Setup

### Step 1: Enable Firebase Storage

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click **Storage** in the left sidebar
4. Click **Get started**
5. Choose your security rules (start in test mode, we'll secure later)
6. Select a storage location near your users

### Step 2: Configure Storage Security Rules

Replace the default rules with these secure rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow public read access to jewellery-website folder
    match /jewellery-website/{allPaths=**} {
      allow read: if true;
      allow write: if false; // Only allow writes through Firebase Console/Admin SDK
    }
    
    // Deny access to other folders
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

### Step 3: Folder Structure

Create this folder structure in Firebase Storage:

```
jewellery-website/
├── hero/
│   └── gold-silver-collection.jpg
├── products/
│   ├── gold-necklace-set.jpg
│   ├── silver-bracelet-collection.jpg
│   ├── gold-coins-bars.jpg
│   └── silver-artifacts.jpg
├── services/
│   ├── gold-silver-purchase.jpg
│   ├── gold-silver-sale.jpg
│   ├── exchange-service.jpg
│   └── repair-maintenance.jpg
└── gallery/
    ├── traditional-gold-jewellery.jpg
    ├── modern-silver-collection.jpg
    ├── bridal-gold-set.jpg
    └── silver-gift-items.jpg
```

## 📷 Image Guidelines

### Image Specifications

- **Format**: JPG, JPEG, PNG, or WebP
- **Quality**: High resolution but web-optimized
- **Size**: Max 2MB per image
- **Dimensions**: 
  - Hero images: 1200x800px minimum
  - Product images: 400x300px minimum
  - Service images: 300x200px minimum

### Naming Convention

Use descriptive, SEO-friendly names:
- ✅ `gold-necklace-traditional-design.jpg`
- ✅ `silver-bracelet-modern-style.jpg`
- ❌ `IMG_001.jpg`
- ❌ `photo123.png`

### Image Optimization

Before uploading, optimize images:

1. **Resize** to appropriate dimensions
2. **Compress** to reduce file size (aim for <500KB)
3. **Convert** to modern formats (WebP when possible)
4. **Add** proper alt text in your config

## 🔧 Configuration Updates

### Update Images Config

Edit `config/images-config.json`:

```json
{
  "firebase": {
    "storage": {
      "bucket": "your-actual-project-id.appspot.com",
      "folder": "jewellery-website"
    }
  }
}
```

### Update Site Config

Edit `config/site-config.json` with your business details:

```json
{
  "business": {
    "name": "Your Jewellery Shop Name",
    "address": {
      "street": "Your Street Address",
      "city": "Your City",
      "state": "Your State",
      "zipCode": "Your ZIP"
    },
    "contact": {
      "phone": "Your Phone Number",
      "email": "your-email@domain.com"
    }
  }
}
```

## 📤 Upload Methods

### Method 1: Firebase Console (Easy)

1. Go to Firebase Console > Storage
2. Click **Upload file** or **Upload folder**
3. Select your images
4. Upload to the correct folder structure

### Method 2: Firebase CLI (Advanced)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy storage files
firebase deploy --only storage
```

### Method 3: Admin SDK (Programmatic)

```javascript
// Node.js script for bulk upload
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert('path/to/serviceAccountKey.json'),
  storageBucket: 'your-project-id.appspot.com'
});

const bucket = admin.storage().bucket();

async function uploadImage(localPath, storagePath) {
  await bucket.upload(localPath, {
    destination: storagePath,
    metadata: {
      cacheControl: 'public, max-age=31536000', // 1 year cache
    }
  });
  console.log(`Uploaded: ${storagePath}`);
}

// Upload images
uploadImage('./images/hero.jpg', 'jewellery-website/hero/gold-silver-collection.jpg');
```

## 🔍 Testing Your Setup

### Verify Images Load

1. Open your website
2. Check browser developer tools for any 404 errors
3. Verify images appear correctly
4. Test on different devices/browsers

### Check Firebase Usage

1. Go to Firebase Console > Storage
2. Monitor usage and download statistics
3. Ensure you're within free tier limits

## 🚨 Security Best Practices

### Storage Rules

- ✅ Allow public read for website images
- ✅ Deny public write access
- ✅ Use specific path matching
- ❌ Don't allow blanket access

### Image Security

- ✅ Use non-sensitive file names
- ✅ Don't include personal/private information
- ✅ Optimize images to prevent bandwidth abuse
- ❌ Don't store sensitive documents in public storage

## 💰 Cost Optimization

### Free Tier Limits

Firebase Storage free tier includes:
- 5GB storage
- 1GB/day downloads
- 20K operations/day

### Cost Reduction Tips

1. **Optimize images** before upload
2. **Use CDN caching** (Firebase automatically provides)
3. **Monitor usage** regularly
4. **Delete unused images**
5. **Use WebP format** for better compression

## 🔧 Troubleshooting

### Common Issues

**Images not loading:**
- Check Firebase Storage rules
- Verify file paths in config
- Check browser console for errors
- Ensure Firebase Storage is enabled

**Slow loading:**
- Optimize image sizes
- Check internet connection
- Verify CDN is working

**Permission denied:**
- Update storage security rules
- Check Firebase project settings
- Verify bucket name in config

### Debug Steps

1. **Check browser console** for errors
2. **Verify Firebase config** is correct
3. **Test individual image URLs** directly
4. **Check Firebase Storage rules**
5. **Monitor Firebase usage** dashboard

## 📞 Support Resources

- [Firebase Storage Documentation](https://firebase.google.com/docs/storage)
- [Firebase Storage Security Rules](https://firebase.google.com/docs/storage/security)
- [Image Optimization Tools](https://tinypng.com/)
- [WebP Converter](https://developers.google.com/speed/webp)

---

**Remember**: Always test your setup thoroughly before going live, and keep your images organized with a clear naming convention!
