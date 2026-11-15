import puppeteer from 'puppeteer-core';
import sharp from 'sharp';
import path from 'path';
import http from 'http';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artDir = 'C:\\Users\\sathy\\.gemini\\antigravity\\brain\\64fe5eb0-8044-419a-9f3a-5a1206728e07';

// Simple static server for dist/
function startServer() {
  return new Promise(resolve => {
    const distPath = path.resolve('dist');
    const server = http.createServer((req, res) => {
      let reqPath = req.url.split('?')[0];
      if (reqPath.startsWith('/sathyanand-portfolio/')) {
        reqPath = reqPath.slice('/sathyanand-portfolio'.length);
      }
      if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
      const filePath = path.join(distPath, reqPath);

      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        const mimeTypes = {
          '.html': 'text/html',
          '.js': 'application/javascript',
          '.css': 'text/css',
          '.webp': 'image/webp',
          '.jpg': 'image/jpeg',
          '.png': 'image/png',
          '.svg': 'image/svg+xml'
        };
        res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
        res.writeHead(200);
        fs.createReadStream(filePath).pipe(res);
      } else {
        res.writeHead(404);
        res.end('Not found');
      }
    });

    server.listen(4173, () => {
      console.log('Static preview server listening on port 4173');
      resolve(server);
    });
  });
}

async function verify() {
  const server = await startServer();

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

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
  await page.goto('http://localhost:4173/sathyanand-portfolio/', { waitUntil: 'networkidle0' });

  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    window.scrollTo(0, 0);
  });
  await new Promise(r => setTimeout(r, 200));

  console.log('\n📡 Network Hero Image Requests on 390px (DPR 3):');
  console.log(heroImageRequests);

  const photoEl = await page.$('.hero-image');
  const fullHeroEl = await page.$('#home');

  const afterFullHeroPath = path.join(artDir, 'hero-quality-after-full.png');
  const afterPhotoPath = path.join(artDir, 'hero-quality-after-photo.png');
  const afterFaceZoomPath = path.join(artDir, 'hero-quality-after-face-zoom.png');

  if (fullHeroEl) {
    await fullHeroEl.screenshot({ path: afterFullHeroPath });
    console.log('Saved after full hero:', afterFullHeroPath);
  }

  if (photoEl) {
    await photoEl.screenshot({ path: afterPhotoPath });
    console.log('Saved after photo:', afterPhotoPath);

    const meta = await sharp(afterPhotoPath).metadata();
    console.log('Photo screenshot dimensions:', meta.width, 'x', meta.height);

    const cropX = Math.round(meta.width * 0.25);
    const cropY = Math.round(meta.height * 0.10);
    const cropW = Math.round(meta.width * 0.50);
    const cropH = Math.round(meta.height * 0.45);

    await sharp(afterPhotoPath)
      .extract({ left: cropX, top: cropY, width: cropW, height: cropH })
      .toFile(afterFaceZoomPath);
    console.log('Saved after face zoom:', afterFaceZoomPath);
  }

  // Also check naturalWidth and currentSrc of the <img> element in browser
  const imgInfo = await page.evaluate(() => {
    const img = document.querySelector('.hero-image');
    return {
      currentSrc: img?.currentSrc,
      naturalWidth: img?.naturalWidth,
      naturalHeight: img?.naturalHeight,
      displayWidth: img?.width,
      displayHeight: img?.height,
    };
  });
  console.log('\n🖼️ Evaluated <img> Info:');
  console.log(imgInfo);

  await browser.close();
  server.close();
}

verify().catch(console.error);
