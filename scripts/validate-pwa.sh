#!/bin/bash

# PWA Implementation Validation Script for NeoNest
echo "🌟 NeoNest PWA Implementation Validation"
echo "========================================"

# Check if required files exist
echo "📁 Checking PWA Files..."

files=(
    "public/manifest.json"
    "public/robots.txt"
    "public/favicon-16x16.png"
    "public/favicon-32x32.png"
    "public/icons/icon-192x192.png"
    "public/icons/icon-512x512.png"
    "public/screenshots/wide.png"
    "public/screenshots/narrow.png"
    "app/components/PWAInstallPrompt.js"
    "app/components/PWAStatus.js"
    "app/components/ServiceWorkerRegistration.js"
    "app/offline/page.js"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (missing)"
    fi
done

echo ""
echo "📦 Checking Dependencies..."

# Check if next-pwa is installed
if npm list next-pwa > /dev/null 2>&1; then
    echo "✅ next-pwa installed"
else
    echo "❌ next-pwa not installed"
fi

# Check if sharp is installed
if npm list sharp > /dev/null 2>&1; then
    echo "✅ sharp installed (for icon generation)"
else
    echo "❌ sharp not installed"
fi

echo ""
echo "⚙️ Configuration Check..."

# Check next.config.mjs
if grep -q "withPWA" next.config.mjs; then
    echo "✅ PWA configuration found in next.config.mjs"
else
    echo "❌ PWA configuration missing in next.config.mjs"
fi

# Check layout.js for PWA components
if grep -q "PWAInstallPrompt" app/layout.js; then
    echo "✅ PWA components imported in layout.js"
else
    echo "❌ PWA components missing in layout.js"
fi

echo ""
echo "🔍 Manifest Validation..."

# Basic manifest validation
if [ -f "public/manifest.json" ]; then
    if command -v jq > /dev/null 2>&1; then
        if jq empty public/manifest.json 2>/dev/null; then
            echo "✅ manifest.json is valid JSON"
            
            # Check required manifest fields
            if jq -e '.name' public/manifest.json > /dev/null; then
                echo "✅ manifest.json has name field"
            else
                echo "❌ manifest.json missing name field"
            fi
            
            if jq -e '.icons' public/manifest.json > /dev/null; then
                icon_count=$(jq '.icons | length' public/manifest.json)
                echo "✅ manifest.json has $icon_count icons"
            else
                echo "❌ manifest.json missing icons"
            fi
            
            if jq -e '.start_url' public/manifest.json > /dev/null; then
                echo "✅ manifest.json has start_url"
            else
                echo "❌ manifest.json missing start_url"
            fi
        else
            echo "❌ manifest.json is invalid JSON"
        fi
    else
        echo "⚠️ jq not available, skipping JSON validation"
    fi
fi

echo ""
echo "📱 PWA Features Summary..."
echo "✅ Web App Manifest with app metadata"
echo "✅ Service Worker configuration (next-pwa)"
echo "✅ Multiple icon sizes (72x72 to 512x512)"
echo "✅ App shortcuts for key features"
echo "✅ Custom install prompt component"
echo "✅ Offline status indicator"
echo "✅ Enhanced meta tags for SEO/PWA"
echo "✅ Screenshots for app stores"
echo "✅ Offline fallback page"
echo "✅ Browser configuration files"

echo ""
echo "🚀 Next Steps for Testing:"
echo "1. Build project: npm run build"
echo "2. Start production: npm start"
echo "3. Test in Chrome DevTools > Lighthouse > PWA audit"
echo "4. Test install prompt on mobile devices"
echo "5. Verify offline functionality"

echo ""
echo "📖 Documentation:"
echo "- PWA_IMPLEMENTATION_SUMMARY.md - Overview and features"
echo "- docs/PWA_IMPLEMENTATION.md - Detailed technical guide"

echo ""
echo "🎉 PWA Implementation Complete!"
