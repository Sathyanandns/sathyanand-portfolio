import puppeteer from 'puppeteer-core';
import sharp from 'sharp';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = 'https://sathyanandns.github.io/sathyanand-portfolio/';
const artDir = 'C:\\Users\\sathy\\.gemini\\antigravity\\brain\\64fe5eb0-8044-419a-9f3a-5a1206728e07';

async function verifyLive() {
  console.log('🔍 Testing LIVE deployment at:', TARGET_URL);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // 1. Mobile 390x844 (dpr 3)
  console.log('\n--- 1. Mobile 390x844 (dpr 3) ---');
  const page = await browser.newPage();
  const client = await page.target().createCDPSession();
  await client.send('Network.enable');

  const heroImageRequests = [];
  client.on('Network.responseReceived', e => {
    const url = e.response.url;
    if (url.includes('sathyanand-hero')) {
      heroImageRequests.push({
        url: url.split('/').pop(),
        status: e.response.status,
        type: e.type,
        mime: e.response.mimeType,
      });
    }
  });

  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3 });
  await page.goto(TARGET_URL, { waitUntil: 'networkidle0' });

  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    window.scrollTo(0, 0);
  });
  await new Promise(r => setTimeout(r, 200));

  console.log('Mobile Hero Image Network Requests:');
  console.log(heroImageRequests);

  const photoEl = await page.$('.hero-image');
  const fullHeroEl = await page.$('#home');

  const liveFullHeroPath = path.join(artDir, 'hero-quality-live-after-full.png');
  const livePhotoPath = path.join(artDir, 'hero-quality-live-after-photo.png');
  const liveFaceZoomPath = path.join(artDir, 'hero-quality-live-after-face-zoom.png');

  if (fullHeroEl) {
    await fullHeroEl.screenshot({ path: liveFullHeroPath });
  }

  if (photoEl) {
    await photoEl.screenshot({ path: livePhotoPath });
    const meta = await sharp(livePhotoPath).metadata();
    const cropX = Math.round(meta.width * 0.25);
    const cropY = Math.round(meta.height * 0.10);
    const cropW = Math.round(meta.width * 0.50);
    const cropH = Math.round(meta.height * 0.45);

    await sharp(livePhotoPath)
      .extract({ left: cropX, top: cropY, width: cropW, height: cropH })
      .toFile(liveFaceZoomPath);
    console.log('Saved live after face zoom to:', liveFaceZoomPath);
  }

  // Check <img> DOM properties
  const imgInfo = await page.evaluate(() => {
    const img = document.querySelector('.hero-image');
    return {
      currentSrc: img?.currentSrc,
      naturalWidth: img?.naturalWidth,
      naturalHeight: img?.naturalHeight,
      displayWidth: Math.round(img?.getBoundingClientRect().width || 0),
      displayHeight: Math.round(img?.getBoundingClientRect().height || 0),
    };
  });
  console.log('Mobile <img> DOM Info:', imgInfo);

  // 2. Desktop 1440x900
  console.log('\n--- 2. Desktop 1440x900 ---');
  const desktopPage = await browser.newPage();
  const desktopClient = await desktopPage.target().createCDPSession();
  await desktopClient.send('Network.enable');

  const desktopHeroRequests = [];
  desktopClient.on('Network.responseReceived', e => {
    const url = e.response.url;
    if (url.includes('sathyanand-hero')) {
      desktopHeroRequests.push({
        url: url.split('/').pop(),
        status: e.response.status,
        type: e.type,
      });
    }
  });

  await desktopPage.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await desktopPage.goto(TARGET_URL, { waitUntil: 'networkidle0' });

  console.log('Desktop Hero Image Network Requests:');
  console.log(desktopHeroRequests);

  const desktopImgInfo = await desktopPage.evaluate(() => {
    const img = document.querySelector('.hero-image');
    return {
      currentSrc: img?.currentSrc,
      naturalWidth: img?.naturalWidth,
      naturalHeight: img?.naturalHeight,
    };
  });
  console.log('Desktop <img> DOM Info:', desktopImgInfo);

  await browser.close();

  // Compare Sharpness
  const beforeRaw = await sharp(path.join(artDir, 'hero-quality-before-face-zoom.png')).greyscale().raw().toBuffer({ resolveWithObject: true });
  const afterRaw = await sharp(liveFaceZoomPath).greyscale().raw().toBuffer({ resolveWithObject: true });

  function laplacianVariance(raw) {
    const { data, info } = raw;
    const { width, height } = info;
    let sum = 0;
    let count = 0;
    const vals = [];
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x;
        const val = 4 * data[idx] - data[idx - 1] - data[idx + 1] - data[idx - width] - data[idx + width];
        vals.push(val);
        sum += val;
        count++;
      }
    }
    const mean = sum / count;
    let variance = 0;
    for (const v of vals) variance += Math.pow(v - mean, 2);
    return variance / count;
  }

  const beforeScore = laplacianVariance(beforeRaw);
  const afterScore = laplacianVariance(afterRaw);

  console.log('\n📊 Sharpness Comparison (Laplacian Variance):');
  console.log(`Before (320w upscaled): ${beforeScore.toFixed(2)}`);
  console.log(`After (Live 960w native): ${afterScore.toFixed(2)} (${(afterScore / beforeScore).toFixed(1)}x sharper)`);
}

verifyLive().catch(console.error);

