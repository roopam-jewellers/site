# Firebase Storage Security Rules Fix

## Problem
Your Firebase Storage is returning 403 (Forbidden) errors because the security rules are too restrictive.

## Solution - Update Firebase Storage Rules

Go to your Firebase Console → Storage → Rules and update them to:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow public read access to gallery images
    match /gallery/{imageId} {
      allow read: if true;
      allow write: if false; // No public uploads
    }
    
    // Allow public read access to other image folders if needed
    match /{imagePath=**} {
      allow read: if true;
      allow write: if false; // No public uploads
    }
  }
}
```

## Alternative - More Restrictive Rules with Domain Check
If you want to be more secure, you can restrict to your domain:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow read access only from your website domain
    match /gallery/{imageId} {
      allow read: if request.headers.origin == 'https://roopam-jewellers.github.io';
      allow write: if false;
    }
  }
}
```

## Steps to Apply:
1. Go to Firebase Console
2. Select your project (bangaru-dabba-k3n)
3. Navigate to Storage → Rules
4. Replace the current rules with one of the above
5. Click "Publish"

## Note:
After updating the rules, your images should load properly from:
- 1752841372878
- 1752841400803
- 1752841440003
- etc.

The images are stored in the "gallery" folder, which matches the updated configuration.
