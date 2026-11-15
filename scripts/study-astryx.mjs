import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = 'https://astryx.atmeta.com';

const outDir = path.resolve(__dirname, '../screenshots/astryx-ref');
fs.mkdirSync(outDir, { recursive: true });

async function studyAstryx() {
  console.log('🔍 Studying Astryx Reference at:', TARGET_URL);

  const tmpDir = path.join(os.tmpdir(), `pup_astryx_${Date.now()}`);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    userDataDir: tmpDir,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  try {
    const res = await page.goto(TARGET_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    console.log(`Page status: ${res ? res.status() : 'unknown'}`);
    const pageTitle = await page.title();
    console.log(`Page title: ${pageTitle}`);

    await page.screenshot({ path: path.join(outDir, '00-astryx-home.png') });

    // Inspect stylesheets and custom properties on :root or html/body
    const tokens = await page.evaluate(() => {
      const rootStyles = window.getComputedStyle(document.documentElement);
      const bodyStyles = window.getComputedStyle(document.body);

      // Extract all CSS variables from stylesheets
      const cssVars = {};
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            if (rule.style) {
              for (let i = 0; i < rule.style.length; i++) {
                const prop = rule.style[i];
                if (prop.startsWith('--')) {
                  cssVars[prop] = rootStyles.getPropertyValue(prop).trim() || rule.style.getPropertyValue(prop).trim();
                }
              }
            }
          }
        } catch {
          // Cross-origin stylesheet
        }
      }

      // Check common properties
      const samples = {
        fontFamily: rootStyles.fontFamily || bodyStyles.fontFamily,
        fontSize: rootStyles.fontSize || bodyStyles.fontSize,
        lineHeight: rootStyles.lineHeight || bodyStyles.lineHeight,
        color: bodyStyles.color,
        backgroundColor: bodyStyles.backgroundColor,
      };

      // Check all links to find component doc links
      const links = Array.from(document.querySelectorAll('a')).map(a => ({
        text: a.innerText.trim(),
        href: a.href,
      })).filter(l => l.href && l.href.includes('astryx.atmeta.com'));

      return { cssVars, samples, links: links.slice(0, 50) };
    });

    console.log('Sample body styles:', tokens.samples);
    console.log('Found CSS variables count:', Object.keys(tokens.cssVars).length);
    console.log('First 20 variables:', Object.entries(tokens.cssVars).slice(0, 20));
    console.log('Found links:', tokens.links.map(l => `${l.text} -> ${l.href}`));

    fs.writeFileSync(path.join(outDir, 'astryx-tokens.json'), JSON.stringify(tokens, null, 2));

  } catch (err) {
    console.error('Error reaching or analyzing astryx:', err.message);
  } finally {
    await browser.close();
  }
}

studyAstryx().catch(console.error);
