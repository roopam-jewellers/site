# 🚀 Deployment Guide - Roopam Jewellery Website

This guide will help you deploy your professional jewellery website to GitHub Pages at **zero cost**.

## 📋 Prerequisites

- GitHub account (free)
- Basic knowledge of Git
- Web browser
- Text editor (VS Code recommended)

## 🔧 Step-by-Step Deployment

### Step 1: Prepare Your Repository

1. **Fork or Clone this repository**
   ```bash
   git clone https://github.com/your-username/site.git
   cd site
   ```

2. **Update Repository Settings**
   - Go to your GitHub repository
   - Click "Settings" tab
   - Scroll to "Pages" section
   - Set source to "GitHub Actions"

### Step 2: Customize Your Content

1. **Update Company Information**
   - Edit `index.html`
   - Replace "Roopam Jewellery" with your business name
   - Update contact information (phone, email, address)
   - Modify product descriptions and pricing

2. **Add Your Images**
   - Upload high-quality images to `assets/images/`
   - Required images:
     - `hero-jewellery.jpg` (1200x800px)
     - `diamond-ring.jpg` (400x300px)
     - `gold-necklace.jpg` (400x300px)
     - `silver-bracelet.jpg` (400x300px)
     - `pearl-earrings.jpg` (400x300px)

3. **Customize Colors and Branding**
   - Edit `assets/css/style.css`
   - Update CSS custom properties in `:root`
   - Modify color scheme to match your brand

### Step 3: Configure Firebase (Optional) - SECURE METHOD

**⚠️ IMPORTANT: Never put real API keys in your code!**

**For Contact Form Functionality:**

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Create a project"
   - Follow setup wizard

2. **Enable Firestore**
   - In Firebase console, go to "Firestore Database"
   - Click "Create database"
   - Choose "Start in test mode" (we'll secure it later)

3. **Get Configuration**
   - Go to Project Settings > General
   - Scroll to "Your apps" section
   - Click "Web" icon to add web app
   - Copy the config object

4. **🔒 SECURE: Add to GitHub Secrets**
   - Go to your GitHub repository
   - Click Settings > Secrets and variables > Actions
   - Add each value as a separate secret:
     - `FIREBASE_API_KEY`
     - `FIREBASE_AUTH_DOMAIN` 
     - `FIREBASE_PROJECT_ID`
     - `FIREBASE_STORAGE_BUCKET`
     - `FIREBASE_MESSAGING_SENDER_ID`
     - `FIREBASE_APP_ID`

5. **Set Security Rules** (CRITICAL!)
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /contact-messages/{document} {
         allow create: if isValidContactMessage(request.resource.data);
         allow read, update, delete: if false;
       }
     }
     
     function isValidContactMessage(data) {
       return data.keys().hasAll(['name', 'email', 'message', 'timestamp']) &&
              data.name is string && data.name.size() > 0 && data.name.size() < 100 &&
              data.email is string && data.email.matches('.*@.*') &&
              data.message is string && data.message.size() > 0 && data.message.size() < 1000;
     }
   }
   ```

**📖 See SECURITY.md for complete security guidelines**

### Step 4: Deploy to GitHub Pages

1. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "Customize website for my jewellery business"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings > Pages
   - Source: "GitHub Actions"
   - The deployment will start automatically

3. **Access Your Website**
   - Your site will be available at: `https://your-username.github.io/site/`
   - Deployment usually takes 2-5 minutes

### Step 5: Custom Domain (Optional)

1. **Purchase Domain**
   - Buy domain from provider (GoDaddy, Namecheap, etc.)

2. **Configure DNS**
   - For apex domain (example.com):
     ```
     A records pointing to:
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   
   - For subdomain (www.example.com):
     ```
     CNAME record pointing to: your-username.github.io
     ```

3. **Update Repository**
   - Create `CNAME` file in repository root
   - Add your domain name (e.g., `elegantjewellery.com`)
   - Commit and push changes

4. **Enable HTTPS**
   - Go to repository Settings > Pages
   - Check "Enforce HTTPS"

## 🔍 Testing Your Deployment

### Pre-Launch Checklist

- [ ] All images load correctly
- [ ] Navigation works on mobile and desktop
- [ ] Contact form submits successfully (if Firebase configured)
- [ ] All links work properly
- [ ] Site loads quickly on different devices
- [ ] FAQ sections expand/collapse
- [ ] Carousels rotate automatically
- [ ] Contact information is accurate

### Browser Testing

Test your site in:
- [ ] Chrome (desktop & mobile)
- [ ] Firefox
- [ ] Safari (desktop & mobile)
- [ ] Edge
- [ ] Internet Explorer 11 (if targeting older users)

### Performance Testing

Use these tools to verify performance:
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- [WebPageTest](https://www.webpagetest.org/)

## 🎯 SEO Optimization

### Update Meta Tags

In `index.html`, update:
```html
<title>Your Business Name - Luxury Custom Jewellery</title>
<meta name="description" content="Your business description">
<meta name="keywords" content="your,keywords,here">
```

### Update Sitemap

1. Edit `sitemap.xml`
2. Replace URLs with your actual domain
3. Update lastmod dates

### Submit to Search Engines

- [Google Search Console](https://search.google.com/search-console/)
- [Bing Webmaster Tools](https://www.bing.com/webmasters/)

## 📊 Analytics Setup

### Google Analytics

1. Create GA4 property
2. Add tracking code to `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Social Media Integration

Add Open Graph tags for better social sharing:
```html
<meta property="og:title" content="Your Business Name">
<meta property="og:description" content="Your description">
<meta property="og:image" content="https://yourdomain.com/assets/images/hero-jewellery.jpg">
<meta property="og:url" content="https://yourdomain.com">
```

## 🛠️ Maintenance

### Regular Updates

- Update product images and descriptions
- Add new services or collections
- Update contact information
- Refresh testimonials and reviews
- Check for broken links

### Security

- Keep Firebase security rules updated
- Monitor contact form submissions
- Regular backup of important data
- Update dependencies if using build tools

### Performance Monitoring

- Monitor site speed monthly
- Optimize images as needed
- Check mobile responsiveness
- Test contact form functionality

## 🚨 Troubleshooting

### Common Issues

**Site not deploying:**
- Check GitHub Actions tab for errors
- Verify all files are committed
- Check for syntax errors in HTML/CSS

**Images not loading:**
- Verify file paths are correct
- Check image file names match HTML references
- Ensure images are committed to repository

**Contact form not working:**
- Verify Firebase configuration
- Check browser console for errors
- Test with different browsers

**Mobile menu not working:**
- Check JavaScript files are loading
- Verify there are no JS errors in console
- Test on actual mobile devices

### Getting Help

1. Check repository Issues page
2. Review browser developer console
3. Test in incognito/private browsing mode
4. Validate HTML/CSS with online validators

## 📈 Next Steps

After successful deployment:

1. **Marketing**
   - Share website link on social media
   - Add to business cards and marketing materials
   - Submit to local business directories

2. **Content Strategy**
   - Regular blog posts about jewellery care
   - Customer testimonials and reviews
   - Behind-the-scenes content

3. **E-commerce Integration**
   - Consider adding Shopify Buy Button
   - Integrate with PayPal or Stripe
   - Add product inventory management

4. **Advanced Features**
   - Customer appointment booking
   - Virtual try-on features
   - Live chat support
   - Email newsletter signup

---

**Congratulations! Your professional jewellery website is now live! 🎉**

Your customers can now discover your beautiful creations and contact you easily through your professional online presence.
