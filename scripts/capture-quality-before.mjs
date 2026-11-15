import puppeteer from 'puppeteer-core';
import sharp from 'sharp';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = 'https://sathyanandns.github.io/sathyanand-portfolio/';
const artDir = 'C:\\Users\\sathy\\.gemini\\antigravity\\brain\\64fe5eb0-8044-419a-9f3a-5a1206728e07';

async function captureBefore() {
  console.log('📸 Capturing BEFORE image quality at 390x844 (dpr 3)...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3 });
  await page.goto(TARGET_URL, { waitUntil: 'networkidle0' });

  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    window.scrollTo(0, 0);
  });
  await new Promise(r => setTimeout(r, 200));

  const photoEl = await page.$('.hero-image');
  const fullHeroEl = await page.$('#home');

  const beforeFullHeroPath = path.join(artDir, 'hero-quality-before-full.png');
  const beforePhotoPath = path.join(artDir, 'hero-quality-before-photo.png');
  const beforeFaceZoomPath = path.join(artDir, 'hero-quality-before-face-zoom.png');

  if (fullHeroEl) {
    await fullHeroEl.screenshot({ path: beforeFullHeroPath });
    console.log('Saved before full hero:', beforeFullHeroPath);
  }

  if (photoEl) {
    await photoEl.screenshot({ path: beforePhotoPath });
    console.log('Saved before photo:', beforePhotoPath);

    // Zoom into the face region (top 10% to 55%, left 25% to 75%)
    const meta = await sharp(beforePhotoPath).metadata();
    console.log('Photo screenshot dimensions:', meta.width, 'x', meta.height);

    const cropX = Math.round(meta.width * 0.25);
    const cropY = Math.round(meta.height * 0.10);
    const cropW = Math.round(meta.width * 0.50);
    const cropH = Math.round(meta.height * 0.45);

    await sharp(beforePhotoPath)
      .extract({ left: cropX, top: cropY, width: cropW, height: cropH })
      .toFile(beforeFaceZoomPath);
    console.log('Saved before face zoom:', beforeFaceZoomPath);
  }

  await browser.close();
}

captureBefore().catch(console.error);
