# 🔒 Firebase Security Guide

## ⚠️ **IMPORTANT: Never Commit API Keys to Public Repositories!**

This guide explains how to securely configure Firebase for your website without exposing sensitive credentials.

## 🔐 **Secure Setup Methods**

### **Method 1: GitHub Secrets (Recommended for GitHub Pages)**

#### Step 1: Get Your Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings ⚙️ > General tab
4. Scroll to "Your apps" section
5. Click the web app or add a new web app
6. Copy the configuration object

#### Step 2: Add Secrets to GitHub Repository

1. Go to your GitHub repository
2. Click **Settings** tab
3. Click **Secrets and variables** > **Actions**
4. Click **New repository secret**
5. Add each Firebase configuration value as a separate secret:

```
Secret Name: FIREBASE_API_KEY
Secret Value: AIzaSyC8Q7C8Q7C8Q7C8Q7C8Q7C8Q7C8Q7C8Q7C

Secret Name: FIREBASE_AUTH_DOMAIN
Secret Value: your-project-12345.firebaseapp.com

Secret Name: FIREBASE_PROJECT_ID  
Secret Value: your-project-12345

Secret Name: FIREBASE_STORAGE_BUCKET
Secret Value: your-project-12345.appspot.com

Secret Name: FIREBASE_MESSAGING_SENDER_ID
Secret Value: 123456789012

Secret Name: FIREBASE_APP_ID
Secret Value: 1:123456789012:web:abcdef123456789
```

#### Step 3: Deploy
Your website will now automatically inject these secrets during deployment, keeping them secure.

---

### **Method 2: Environment Variables for Local Development**

For local development, create a `.env` file (never commit this!):

```bash
# .env file (add to .gitignore!)
FIREBASE_API_KEY=your_actual_api_key_here
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=your-app-id
```

Add `.env` to your `.gitignore` file:
```gitignore
# Environment variables
.env
.env.local
.env.production

# Firebase config
firebase-env.js
```

---

### **Method 3: Server-Side Proxy (Most Secure)**

For maximum security, use a backend server:

1. Create a simple Node.js/Python/PHP backend
2. Store Firebase credentials server-side
3. Create API endpoints for form submission
4. Frontend sends data to your backend, not directly to Firebase

Example backend endpoint:
```javascript
// server.js (Node.js example)
app.post('/api/contact', async (req, res) => {
    // Validate and sanitize input
    const { name, email, message } = req.body;
    
    // Store in Firebase (credentials on server)
    await admin.firestore().collection('contacts').add({
        name,
        email, 
        message,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.json({ success: true });
});
```

---

## 🛡️ **Firebase Security Rules**

Even with secure configuration, you MUST set proper security rules:

### **Firestore Security Rules**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Contact messages - allow create only, no read/update/delete
    match /contact-messages/{document} {
      allow create: if isValidContactMessage(request.resource.data) 
                   && rateLimit(request);
      allow read, update, delete: if false;
    }
  }
  
  // Validation function
  function isValidContactMessage(data) {
    return data.keys().hasAll(['name', 'email', 'message', 'timestamp']) &&
           data.name is string && data.name.size() > 0 && data.name.size() < 100 &&
           data.email is string && data.email.matches('.*@.*') &&
           data.message is string && data.message.size() > 0 && data.message.size() < 1000 &&
           data.timestamp is timestamp;
  }
  
  // Basic rate limiting (you might want a more sophisticated solution)
  function rateLimit(request) {
    return true; // Implement your rate limiting logic here
  }
}
```

### **Additional Security Measures**

1. **Enable App Check** (prevents unauthorized app usage)
2. **Set up quotas** to prevent abuse
3. **Monitor usage** in Firebase console
4. **Use reCAPTCHA** on your contact form
5. **Implement rate limiting** server-side

---

## 🚨 **What to Do If Keys Are Exposed**

If you accidentally committed API keys:

1. **Immediately revoke/regenerate** the keys in Firebase Console
2. **Remove keys from Git history**:
   ```bash
   git filter-branch --force --index-filter \
   'git rm --cached --ignore-unmatch assets/js/firebase-config.js' \
   --prune-empty --tag-name-filter cat -- --all
   ```
3. **Update security rules** to be more restrictive
4. **Monitor Firebase usage** for suspicious activity
5. **Change any related passwords**

---

## ✅ **Best Practices Checklist**

- [ ] Never commit API keys to public repositories
- [ ] Use GitHub Secrets for deployment
- [ ] Set restrictive Firestore security rules
- [ ] Enable App Check in production
- [ ] Monitor Firebase usage regularly
- [ ] Use HTTPS only (GitHub Pages enforces this)
- [ ] Implement client-side validation
- [ ] Add server-side validation when possible
- [ ] Use reCAPTCHA for form protection
- [ ] Set up usage quotas and alerts

---

## 🔍 **Security Audit Steps**

Regular security checks:

1. **Review Firebase Console** for unusual activity
2. **Check security rules** are still appropriate
3. **Monitor quotas** and usage patterns
4. **Update dependencies** regularly
5. **Test contact form** functionality
6. **Verify HTTPS** is working
7. **Check for exposed credentials** in repository

---

## 📞 **Need Help?**

If you need assistance with security setup:

1. Check Firebase documentation
2. Review GitHub Actions documentation
3. Test in a private repository first
4. Consider hiring a security professional for sensitive applications

Remember: **Security is not optional** - it's essential for protecting your business and customers!
