import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = 'https://sathyanandns.github.io/sathyanand-portfolio/';

const outDir = path.resolve(__dirname, '../screenshots/hero-regression-fixes/after');
const artDir = 'C:\\Users\\sathy\\.gemini\\antigravity\\brain\\64fe5eb0-8044-419a-9f3a-5a1206728e07';
fs.mkdirSync(outDir, { recursive: true });

const viewports = [
  { width: 320, height: 600, name: '320px' },
  { width: 360, height: 640, name: '360px' },
  { width: 390, height: 844, name: '390px' },
  { width: 412, height: 915, name: '412px' },
  { width: 768, height: 1024, name: '768px' },
  { width: 1440, height: 900, name: '1440px' }
];

async function capture() {
  console.log('📸 Capturing final live hero screenshots across viewports...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  for (const theme of ['dark', 'light']) {
    for (const vp of viewports) {
      await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 2 });
      await page.goto(TARGET_URL, { waitUntil: 'networkidle0' });

      await page.evaluate((t) => {
        document.documentElement.setAttribute('data-theme', t);
        window.scrollTo(0, 0);
      }, theme);
      await new Promise(r => setTimeout(r, 200));

      const heroEl = await page.$('#home');
      if (heroEl) {
        const fileName = `hero-fix-${vp.name}-${theme}.png`;
        const filePath = path.join(outDir, fileName);
        await heroEl.screenshot({ path: filePath });
        fs.copyFileSync(filePath, path.join(artDir, fileName));
        console.log(`  ✓ Saved ${fileName}`);
      }
    }
  }

  await browser.close();
  console.log('🎉 Done capturing all final screenshots!');
}

capture().catch(console.error);

