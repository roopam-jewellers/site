# Roopam Jewellery - Professional Business Website

A modern, responsive website for a luxury jewellery shop, designed for zero-cost deployment on GitHub Pages with Firebase integration for contact form submissions.

## 🌟 Features

- **Professional Design**: Deep blue and silver color scheme with elegant typography
- **Responsive Layout**: Seamlessly adapts to all device sizes
- **Dynamic Carousels**: Auto-rotating product and service displays
- **Contact Form**: Integrated with Firebase for secure message storage
- **FAQ Section**: Expandable questions with smooth animations
- **SEO Optimized**: Meta tags, sitemap, and robots.txt included
- **PWA Ready**: Service worker for offline functionality
- **Mobile First**: Optimized for mobile devices with hamburger navigation

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/site.git
cd site
```

### 2. GitHub Pages Setup

1. Go to your repository settings on GitHub
2. Navigate to "Pages" in the left sidebar
3. Set source to "GitHub Actions"
4. The site will automatically deploy when you push to the main branch

### 3. Firebase Setup (Optional)

To enable the contact form functionality:

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Copy your Firebase configuration
4. Update `assets/js/firebase-config.js` with your credentials:

```javascript
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};
```

5. Set up Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /contact-messages/{document} {
      allow create: if true;
      allow read, update, delete: if false;
    }
  }
}
```

### 4. Add Your Images

Replace placeholder images in the `assets/images/` folder:

- `hero-jewellery.jpg` (1200x800px) - Main hero image
- `diamond-ring.jpg` (400x300px) - Diamond rings
- `gold-necklace.jpg` (400x300px) - Gold necklaces  
- `silver-bracelet.jpg` (400x300px) - Silver bracelets
- `pearl-earrings.jpg` (400x300px) - Pearl earrings

## 📁 Project Structure

```
site/
├── index.html              # Main HTML file
├── assets/
│   ├── css/
│   │   └── style.css       # Main stylesheet
│   ├── js/
│   │   ├── main.js         # Main JavaScript functionality
│   │   └── firebase-config.js # Firebase configuration
│   └── images/             # Image assets
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions deployment
├── robots.txt              # SEO robots file
├── sitemap.xml             # SEO sitemap
├── sw.js                   # Service worker for PWA
└── README.md               # This file
```

## 🎨 Customization

### Colors

The color scheme is defined in CSS custom properties in `style.css`:

```css
:root {
    --primary-blue: #1a365d;
    --secondary-blue: #2c5282;
    --silver: #a0aec0;
    /* ... */
}
```

### Typography

- **Headlines**: Playfair Display (serif) - elegant and premium
- **Body Text**: PT Sans (sans-serif) - modern and readable

### Content

Update the following sections in `index.html`:

1. **Company Information**: Update business name, address, phone, email
2. **Product Descriptions**: Modify product cards with your offerings
3. **Services**: Update service descriptions and pricing
4. **About Us**: Replace with your company story and values
5. **FAQ**: Add relevant questions for your business

## 📱 Mobile Optimization

The website is fully responsive with:

- Mobile-first CSS design
- Hamburger navigation menu
- Touch-friendly carousel controls
- Optimized images and performance
- Fast loading times

## 🔧 Technical Features

### Performance
- Lazy loading for images
- Minified and optimized code
- Service worker caching
- Throttled scroll events

### SEO
- Semantic HTML structure
- Meta tags for social sharing
- Structured data markup ready
- Sitemap and robots.txt

### Accessibility
- ARIA labels for interactive elements
- Keyboard navigation support
- High contrast ratios
- Screen reader friendly

## 🚀 Deployment

### GitHub Pages (Free)

The site automatically deploys to GitHub Pages when you push to the main branch. Your site will be available at:

```
https://your-username.github.io/site/
```

### Custom Domain (Optional)

1. Add a `CNAME` file with your domain name
2. Configure DNS settings with your domain provider
3. Enable HTTPS in GitHub Pages settings

## 🛠️ Development

### Local Development

Simply open `index.html` in a web browser, or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

### Making Changes

1. Edit HTML, CSS, or JavaScript files
2. Test locally in multiple browsers
3. Commit and push to deploy automatically

## 📊 Analytics (Optional)

To add Google Analytics:

1. Create a Google Analytics property
2. Add the tracking code to the `<head>` section of `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

## 🔒 Security

- Firebase security rules restrict database access
- No sensitive data stored in frontend code
- HTTPS enforced through GitHub Pages
- Content Security Policy ready for implementation

## 🐛 Troubleshooting

### Common Issues

1. **Images not loading**: Check file paths and ensure images are uploaded
2. **Contact form not working**: Verify Firebase configuration
3. **Styles not applying**: Check CSS file path and browser cache
4. **Mobile menu not working**: Ensure JavaScript files are loaded

### Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)  
- Safari (last 2 versions)
- Edge (last 2 versions)
- iOS Safari (last 2 versions)
- Chrome Mobile (last 2 versions)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

For support or questions:

1. Check the [Issues](https://github.com/your-username/site/issues) page
2. Create a new issue if needed
3. Email: your-email@example.com

## 🔄 Updates

To update the website:

1. Make changes to your files
2. Test locally
3. Commit and push to GitHub
4. Changes will auto-deploy to GitHub Pages

---

**Made with ❤️ for roopam jewellery businesses**
