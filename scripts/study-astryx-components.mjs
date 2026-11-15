import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'https://astryx.atmeta.com';
const outDir = path.resolve(__dirname, '../screenshots/astryx-ref');

async function crawlAstryx() {
  const tmpDir = path.join(os.tmpdir(), `pup_astryx_crawl_${Date.now()}`);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    userDataDir: tmpDir,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Visit Themes page
  console.log('Visiting Themes page...');
  await page.goto(`${BASE_URL}/themes`, { waitUntil: 'networkidle2' });
  await page.screenshot({ path: path.join(outDir, '01-themes-page.png'), fullPage: false });

  // Extract all text and details from Themes page
  const themesData = await page.evaluate(() => {
    return {
      bodyText: document.body.innerText.slice(0, 5000),
      buttons: Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim()).filter(Boolean),
    };
  });
  console.log('Themes page overview:', themesData.buttons.slice(0, 15));

  // 2. Visit Components page
  console.log('Visiting Components page...');
  await page.goto(`${BASE_URL}/components`, { waitUntil: 'networkidle2' });
  await page.screenshot({ path: path.join(outDir, '02-components-page.png'), fullPage: false });

  // Find all component links
  const componentLinks = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a'))
      .map(a => ({ text: a.innerText.trim(), href: a.href }))
      .filter(a => a.href.includes('/components/'));
  });

  console.log('Found component links count:', componentLinks.length);
  console.log('Sample component links:', componentLinks.slice(0, 20).map(c => `${c.text}: ${c.href}`));

  // Target key components: Button, Card, Badge/Tag, Input/TextField, Dialog/Modal, Tabs
  const targets = [
    { name: 'button', urlPattern: '/button' },
    { name: 'card', urlPattern: '/card' },
    { name: 'badge', urlPattern: '/badge' },
    { name: 'tag', urlPattern: '/tag' },
    { name: 'input', urlPattern: '/text' },
    { name: 'dialog', urlPattern: '/dialog' },
    { name: 'modal', urlPattern: '/modal' },
    { name: 'tabs', urlPattern: '/tab' },
  ];

  const targetUrls = [];
  for (const t of targets) {
    const found = componentLinks.find(c => c.href.toLowerCase().includes(t.urlPattern));
    if (found && !targetUrls.find(u => u.href === found.href)) {
      targetUrls.push({ name: t.name, text: found.text, href: found.href });
    }
  }
  console.log('Target components to inspect:', targetUrls);

  // Inspect each target component
  const detailedTokens = {};

  for (const comp of targetUrls) {
    console.log(`\nInspecting component: ${comp.name} (${comp.href})...`);
    try {
      await page.goto(comp.href, { waitUntil: 'networkidle2' });
      await new Promise(r => setTimeout(r, 1000));
      await page.screenshot({ path: path.join(outDir, `comp-${comp.name}.png`), fullPage: false });

      // Extract styles of elements on this component page
      const compStyles = await page.evaluate(() => {
        const results = [];
        const elements = document.querySelectorAll('button, input, textarea, [role="tab"], [role="dialog"], [class*="card"], [class*="badge"], [class*="tag"]');
        for (const el of Array.from(elements).slice(0, 10)) {
          const s = window.getComputedStyle(el);
          results.push({
            tag: el.tagName,
            role: el.getAttribute('role'),
            text: el.innerText ? el.innerText.slice(0, 30).trim() : '',
            color: s.color,
            backgroundColor: s.backgroundColor,
            borderColor: s.borderColor,
            borderWidth: s.borderWidth,
            borderStyle: s.borderStyle,
            borderRadius: s.borderRadius,
            boxShadow: s.boxShadow,
            padding: s.padding,
            fontSize: s.fontSize,
            fontWeight: s.fontWeight,
            lineHeight: s.lineHeight,
            transition: s.transition,
          });
        }
        return results;
      }, comp.name);

      detailedTokens[comp.name] = compStyles;
    } catch (e) {
      console.error(`Error inspecting ${comp.name}:`, e.message);
    }
  }

  // 3. Inspect theme toggle on page to switch between light and dark
  console.log('\nLooking for Theme Switcher on Astryx...');
  const themeSwitchers = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button, [role="button"], [role="switch"]'));
    return buttons
      .filter(b => {
        const label = (b.getAttribute('aria-label') || b.innerText || '').toLowerCase();
        return label.includes('theme') || label.includes('dark') || label.includes('light') || label.includes('mode');
      })
      .map(b => ({
        tag: b.tagName,
        ariaLabel: b.getAttribute('aria-label'),
        text: b.innerText.trim(),
        className: b.className,
      }));
  });
  console.log('Found theme switchers:', themeSwitchers);

  // Check dark mode styles by setting color-scheme or data-theme
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
  await page.goto(`${BASE_URL}/components/button`, { waitUntil: 'networkidle2' });
  await page.screenshot({ path: path.join(outDir, 'comp-button-light.png') });

  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }]);
  await page.reload({ waitUntil: 'networkidle2' });
  await page.screenshot({ path: path.join(outDir, 'comp-button-dark.png') });

  // Extract all CSS rules that contain color tokens or StyleX variables
  const allStyleRules = await page.evaluate(() => {
    const tokenMap = {};
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule.cssText && (rule.cssText.includes('--') || rule.cssText.includes(':root') || rule.cssText.includes('[data-theme'))) {
            // Check for properties
            if (rule.style) {
              for (let i = 0; i < rule.style.length; i++) {
                const prop = rule.style[i];
                if (prop.startsWith('--')) {
                  tokenMap[prop] = rule.style.getPropertyValue(prop).trim();
                }
              }
            }
          }
        }
      } catch {}
    }
    return tokenMap;
  });

  console.log(`Total StyleX/CSS variables found across sheets: ${Object.keys(allStyleRules).length}`);
  fs.writeFileSync(path.join(outDir, 'astryx-component-tokens.json'), JSON.stringify({ detailedTokens, allStyleRules }, null, 2));

  await browser.close();
  console.log('✅ Astryx crawl finished successfully!');
}

crawlAstryx().catch(console.error);
