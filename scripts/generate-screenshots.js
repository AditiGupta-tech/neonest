const sharp = require('sharp');
const path = require('path');

async function createPlaceholderScreenshots() {
  const outputDir = path.join(__dirname, '../public/screenshots');

  // Create a wide screenshot placeholder
  const wideSvg = `
    <svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#8b5cf6"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="48" font-family="Arial, sans-serif">NeoNest - Wide View</text>
    </svg>
  `;

  // Create a narrow screenshot placeholder
  const narrowSvg = `
    <svg width="750" height="1334" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#8b5cf6"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="32" font-family="Arial, sans-serif">NeoNest</text>
      <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="24" font-family="Arial, sans-serif">Mobile View</text>
    </svg>
  `;

  try {
    await sharp(Buffer.from(wideSvg))
      .png()
      .toFile(path.join(outputDir, 'wide.png'));

    await sharp(Buffer.from(narrowSvg))
      .png()
      .toFile(path.join(outputDir, 'narrow.png'));

    console.log('Screenshot placeholders created successfully!');
  } catch (error) {
    console.error('Error creating screenshots:', error);
  }
}

createPlaceholderScreenshots();
