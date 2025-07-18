# Firebase Security Configuration

## Important: API Keys in Frontend are Always Visible
Firebase API keys are **designed** to be public in frontend applications. The real security comes from:
1. Proper Firebase Security Rules
2. API Key restrictions in Google Cloud Console
3. Authentication requirements

## Step 1: Restrict API Key (Google Cloud Console)
1. Go to Google Cloud Console → APIs & Services → Credentials
2. Find your Firebase API key
3. Click "Restrict Key"
4. Under "Application restrictions":
   - Select "HTTP referrers (web sites)"
   - Add: `roopam-jewellery.github.io/*` and `*.github.io/*`
5. Under "API restrictions":
   - Select "Restrict key"
   - Enable only: Cloud Firestore API, Firebase Storage API

## Step 2: Secure Firestore Rules
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Contact form submissions - write only, no read
    match /contacts/{document} {
      allow create: if isValidContactForm(resource.data);
      allow read, update, delete: if false; // No public access
    }
    
    // Helper function to validate contact form
    function isValidContactForm(data) {
      return data.keys().hasAll(['name', 'email', 'message', 'timestamp']) &&
             data.name is string && data.name.size() > 0 &&
             data.email is string && data.email.matches('.*@.*\\..*') &&
             data.message is string && data.message.size() > 0 &&
             data.timestamp is timestamp;
    }
  }
}
```

## Step 3: Secure Storage Rules
```javascript
// storage.rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Public read for images, no write access from frontend
    match /images/{allPaths=**} {
      allow read: if true;
      allow write: if false; // Upload via admin SDK only
    }
  }
}
```
