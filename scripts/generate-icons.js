const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Icon sizes for PWA
const iconSizes = [
  { size: 72, name: 'icon-72x72.png' },
  { size: 96, name: 'icon-96x96.png' },
  { size: 128, name: 'icon-128x128.png' },
  { size: 144, name: 'icon-144x144.png' },
  { size: 152, name: 'icon-152x152.png' },
  { size: 192, name: 'icon-192x192.png' },
  { size: 384, name: 'icon-384x384.png' },
  { size: 512, name: 'icon-512x512.png' }
];

async function generateIcons() {
  const inputImage = path.join(__dirname, '../public/logo.jpg');
  const outputDir = path.join(__dirname, '../public/icons');

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('Generating PWA icons...');

  for (const { size, name } of iconSizes) {
    try {
      await sharp(inputImage)
        .resize(size, size, {
          fit: 'cover',
          position: 'center'
        })
        .png()
        .toFile(path.join(outputDir, name));
      
      console.log(`Generated: ${name}`);
    } catch (error) {
      console.error(`Error generating ${name}:`, error);
    }
  }

  // Generate favicon
  try {
    await sharp(inputImage)
      .resize(32, 32)
      .png()
      .toFile(path.join(__dirname, '../public/favicon-32x32.png'));
    
    await sharp(inputImage)
      .resize(16, 16)
      .png()
      .toFile(path.join(__dirname, '../public/favicon-16x16.png'));
    
    console.log('Generated favicons');
  } catch (error) {
    console.error('Error generating favicons:', error);
  }

  console.log('Icon generation complete!');
}

generateIcons().catch(console.error);
