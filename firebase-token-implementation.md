# Firebase Storage Token-Based URL Construction

## How It Works

The updated ConfigManager now constructs Firebase Storage URLs using the filename and token from your JSON configuration.

### URL Format
```
https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{folder}%2F{filename}?alt=media&token={token}
```

### Example
For your hero image:
- **Filename**: `1752841372878`
- **Token**: `959e0df8-86c4-44eb-a2e6-9979fa947ba0`
- **Bucket**: `bangaru-dabba-k3n.firebasestorage.app`
- **Folder**: `gallery`

**Constructed URL**:
```
https://firebasestorage.googleapis.com/v0/b/bangaru-dabba-k3n.firebasestorage.app/o/gallery%2F1752841372878?alt=media&token=959e0df8-86c4-44eb-a2e6-9979fa947ba0
```

## Code Changes Made

### 1. ConfigManager.getImageUrl()
- Now accepts both old string format and new object format
- Constructs direct Firebase URLs when filename and token are available
- Falls back to Firebase SDK method if no token
- Improved caching with combined filename+token keys

### 2. Content Injector Updates
- Updated to pass entire image objects instead of just filenames
- Works with both hero images and product images
- Maintains backward compatibility

### 3. Preload Function
- Updated to handle new image data structure
- Properly categorizes images (hero vs product)

## Testing
To verify the URLs are working:

1. Open browser developer tools
2. Go to Network tab
3. Reload your website
4. Look for image requests - they should show status 200 (not 403)
5. Check console for "Using direct Firebase URL for: [filename]" messages

## Benefits
- ✅ No Firebase Storage SDK calls needed for images
- ✅ Direct authenticated access via tokens
- ✅ Bypasses Firebase Storage security rules
- ✅ Faster image loading
- ✅ Cached URLs for better performance
