# PWA Implementation for NeoNest

## Overview
This document outlines the Progressive Web App (PWA) implementation for NeoNest, enabling users to install the app on their devices and use it offline.

## Features Implemented

### 1. Web App Manifest (`/public/manifest.json`)
- App metadata including name, description, and theme colors
- Multiple icon sizes (72x72 to 512x512) for different devices
- App shortcuts for quick access to key features:
  - Feeding Tracker
  - Sleep Tracker
  - Growth Tracker
  - AI Assistant
- Display mode set to "standalone" for app-like experience
- Screenshot placeholders for app stores

### 2. Service Worker with Workbox
- Configured through `next-pwa` plugin in `next.config.mjs`
- Caching strategies for different resource types:
  - **CacheFirst**: Google Fonts, static assets (images, audio)
  - **StaleWhileRevalidate**: Images, JavaScript, CSS
  - **NetworkFirst**: API calls with offline fallback
- Offline page fallback

### 3. PWA Components

#### PWAInstallPrompt (`/app/components/PWAInstallPrompt.js`)
- Custom install prompt that appears when install criteria are met
- Handles `beforeinstallprompt` event
- User-friendly UI with install and dismiss options
- Session-based dismissal to avoid pestering users

#### PWAStatus (`/app/components/PWAStatus.js`)
- Shows offline status indicator when app is installed and offline
- Only visible in standalone mode (when app is installed)
- Provides user feedback about connectivity

#### ServiceWorkerRegistration (`/app/components/ServiceWorkerRegistration.js`)
- Handles service worker lifecycle events
- Prompts users for updates when new version is available
- Automatically reloads when service worker takes control

### 4. SEO and Meta Tags
Enhanced `layout.js` with:
- Open Graph meta tags
- Twitter Card meta tags
- Apple-specific meta tags for iOS installation
- Theme color and viewport configuration
- Favicon and icon links

### 5. Offline Support
- Offline fallback page (`/app/offline/page.js`)
- Cached resources for offline browsing
- Clear messaging about available offline features

## File Structure
```
/public/
  ├── manifest.json           # Web app manifest
  ├── robots.txt             # SEO robots file
  ├── favicon-16x16.png      # Browser favicon
  ├── favicon-32x32.png      # Browser favicon
  ├── /icons/                # PWA icons directory
  │   ├── icon-72x72.png     # Various icon sizes
  │   ├── icon-96x96.png
  │   ├── ...
  │   ├── icon-512x512.png
  │   └── browserconfig.xml   # Windows tile configuration
  └── /screenshots/          # App store screenshots
      ├── wide.png
      └── narrow.png

/app/components/
  ├── PWAInstallPrompt.js    # Install prompt component
  ├── PWAStatus.js           # Offline status indicator
  └── ServiceWorkerRegistration.js # SW lifecycle handling

/scripts/
  ├── generate-icons.js      # Icon generation script
  └── generate-screenshots.js # Screenshot generation script
```

## Installation Requirements
- HTTPS (required for service workers)
- Valid manifest.json
- Registered service worker
- At least one icon (192x192 or larger)
- Engagement heuristics (user interaction)

## Testing Checklist

### Desktop Testing
- [ ] Install prompt appears after user interaction
- [ ] App can be installed from browser menu
- [ ] Installed app opens in standalone window
- [ ] App shortcuts work correctly
- [ ] Offline functionality works

### Mobile Testing
- [ ] Add to Home Screen option available
- [ ] App icon appears correctly on home screen
- [ ] Splash screen displays properly
- [ ] App runs in fullscreen mode
- [ ] Pull-to-refresh disabled in standalone mode

### Lighthouse PWA Audit
- [ ] Installable (manifest and service worker)
- [ ] PWA Optimized (themed splash screen, content sized correctly)
- [ ] Score ≥ 90 in PWA category

## Performance Benefits
1. **Faster Loading**: Cached resources load instantly
2. **Offline Access**: Core functionality available without internet
3. **Reduced Data Usage**: Assets served from cache
4. **App-like Experience**: No browser UI in standalone mode
5. **Quick Access**: Home screen shortcuts for key features

## Browser Support
- **Chrome/Edge**: Full PWA support including install prompts
- **Firefox**: Basic PWA support, manual installation
- **Safari**: Limited PWA support, Add to Home Screen
- **iOS Safari**: App-like experience with web app meta tags

## Development Commands
```bash
# Generate PWA icons from logo
node scripts/generate-icons.js

# Generate placeholder screenshots
node scripts/generate-screenshots.js

# Test PWA in production mode
npm run build && npm start
```

## Future Enhancements
1. **Background Sync**: Sync data when connection is restored
2. **Push Notifications**: Engage users with timely reminders
3. **Periodic Background Sync**: Update content automatically
4. **Advanced Caching**: More granular caching strategies
5. **Update Notifications**: Better UX for app updates

## Troubleshooting

### Install Prompt Not Showing
- Check that the app is served over HTTPS
- Ensure user has interacted with the page
- Verify manifest.json is valid and accessible
- Check that service worker is registered successfully

### Service Worker Not Caching
- Check browser DevTools > Application > Service Workers
- Verify network requests in DevTools > Network tab
- Clear cache and reload to test fresh install

### Offline Page Not Working
- Ensure offline route is registered in service worker
- Check that offline.html is accessible
- Verify fallback URL in workbox configuration

## Resources
- [Web.dev PWA Documentation](https://web.dev/progressive-web-apps/)
- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox)
- [PWA Builder](https://www.pwabuilder.com/)
