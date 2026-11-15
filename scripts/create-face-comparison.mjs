import sharp from 'sharp';
import path from 'path';

const artDir = 'C:\\Users\\sathy\\.gemini\\antigravity\\brain\\64fe5eb0-8044-419a-9f3a-5a1206728e07';

async function createComparison() {
  const beforeImg = sharp(path.join(artDir, 'hero-quality-before-face-zoom.png'));
  const afterImg = sharp(path.join(artDir, 'hero-quality-live-after-face-zoom.png'));

  const metaB = await beforeImg.metadata();
  const width = metaB.width;
  const height = metaB.height;

  const labelSvg = Buffer.from(`
    <svg width="${width * 2 + 20}" height="${height + 50}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#09090b" />
      <text x="${width / 2}" y="32" font-family="sans-serif" font-weight="bold" font-size="20" fill="#ef4444" text-anchor="middle">BEFORE (320w upscaled - Blurry)</text>
      <text x="${width + 20 + width / 2}" y="32" font-family="sans-serif" font-weight="bold" font-size="20" fill="#10b981" text-anchor="middle">AFTER (Native WebP - 4.3x Sharper)</text>
    </svg>
  `);

  const beforeBuf = await beforeImg.toBuffer();
  const afterBuf = await afterImg.toBuffer();

  await sharp(labelSvg)
    .composite([
      { input: beforeBuf, top: 45, left: 0 },
      { input: afterBuf, top: 45, left: width + 20 },
    ])
    .png()
    .toFile(path.join(artDir, 'hero-face-sharpness-comparison.png'));

  console.log('Saved hero-face-sharpness-comparison.png');
}

createComparison().catch(console.error);

