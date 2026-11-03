import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const DIST_DIR = path.resolve(__dirname, '../dist');

// Simple static server for dist
function startServer(port = 4173) {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.ico': 'image/x-icon',
  };

  const server = http.createServer((req, res) => {
    let cleanUrl = req.url.split('?')[0];
    if (cleanUrl.startsWith('/sathyanand-portfolio/')) {
      cleanUrl = cleanUrl.replace('/sathyanand-portfolio/', '/');
    }
    let filePath = path.join(DIST_DIR, cleanUrl === '/' ? 'index.html' : cleanUrl);

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(DIST_DIR, 'index.html');
    }

    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    try {
      const data = fs.readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    } catch {
      res.writeHead(404);
      res.end('Not Found');
    }
  });

  return new Promise((resolve) => {
    server.listen(port, () => resolve(server));
  });
}

async function runTests() {
  console.log('--- Starting local tests on Navbar & Theme fixes ---');
  const server = await startServer(4173);
  const baseUrl = 'http://localhost:4173/sathyanand-portfolio/';

  const tmpDir = path.join(os.tmpdir(), `pup_nav_test_${Date.now()}`);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    userDataDir: tmpDir,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(err.message));

  // TEST 1: Width tests for Single Theme Toggle & Hamburger visibility
  console.log('\n[TEST 1] Viewport Width checks (320, 375, 768, 868, 1024, 1440, 1920px)');
  const testWidths = [320, 375, 768, 868, 1024, 1440, 1920];

  for (const width of testWidths) {
    await page.setViewport({ width, height: 800 });
    await page.goto(baseUrl, { waitUntil: 'networkidle0' });

    const checks = await page.evaluate((w) => {
      const allThemeBtns = Array.from(document.querySelectorAll('.theme-toggle-btn'));
      const visibleThemeBtns = allThemeBtns.filter((el) => {
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
      });

      const desktopToggle = document.querySelector('.navbar-links .theme-toggle-btn');
      const mobileToggle = document.querySelector('.navbar-mobile-actions .theme-toggle-btn');
      const hamburger = document.querySelector('.hamburger');

      const isDesktopToggleVisible = desktopToggle ? window.getComputedStyle(desktopToggle.parentElement).display !== 'none' && window.getComputedStyle(desktopToggle).display !== 'none' : false;
      const isMobileToggleVisible = mobileToggle ? window.getComputedStyle(mobileToggle.parentElement).display !== 'none' && window.getComputedStyle(mobileToggle).display !== 'none' : false;
      const isHamburgerVisible = hamburger ? window.getComputedStyle(hamburger).display !== 'none' : false;

      const hamburgerRect = hamburger ? hamburger.getBoundingClientRect() : null;

      return {
        width: w,
        totalThemeBtns: allThemeBtns.length,
        visibleThemeBtnCount: visibleThemeBtns.length,
        isDesktopToggleVisible,
        isMobileToggleVisible,
        isHamburgerVisible,
        hamburgerSize: hamburgerRect ? { width: hamburgerRect.width, height: hamburgerRect.height } : null,
      };
    }, width);

    console.log(`Width ${width}px:`);
    console.log(`  Visible theme toggles: ${checks.visibleThemeBtnCount} (Expected: 1)`);
    console.log(`  Desktop toggle visible: ${checks.isDesktopToggleVisible}`);
    console.log(`  Mobile toggle visible: ${checks.isMobileToggleVisible}`);
    console.log(`  Hamburger visible: ${checks.isHamburgerVisible}`);
    if (checks.hamburgerSize) {
      console.log(`  Hamburger size: ${checks.hamburgerSize.width}x${checks.hamburgerSize.height}`);
    }

    if (checks.visibleThemeBtnCount !== 1) {
      throw new Error(`FAIL: Expected exactly 1 visible theme toggle at ${width}px, found ${checks.visibleThemeBtnCount}`);
    }

    if (width <= 868) {
      if (!checks.isMobileToggleVisible || checks.isDesktopToggleVisible) {
        throw new Error(`FAIL: At <= 868px (${width}px), mobile toggle must be visible and desktop toggle hidden!`);
      }
      if (!checks.isHamburgerVisible) {
        throw new Error(`FAIL: At <= 868px (${width}px), hamburger must be visible!`);
      }
      if (checks.hamburgerSize.width < 36 || checks.hamburgerSize.height < 36) {
        throw new Error(`FAIL: Hamburger size must be at least 36x36px! Got ${checks.hamburgerSize.width}x${checks.hamburgerSize.height}`);
      }
    } else {
      if (!checks.isDesktopToggleVisible || checks.isMobileToggleVisible) {
        throw new Error(`FAIL: At > 868px (${width}px), desktop toggle must be visible and mobile toggle hidden!`);
      }
      if (checks.isHamburgerVisible) {
        throw new Error(`FAIL: At > 868px (${width}px), hamburger must be hidden!`);
      }
    }
  }
  console.log('✅ TEST 1 PASSED: Exactly 1 theme toggle visible across all screen sizes!');

  // TEST 2: Tab accessibility (Keyboard navigation)
  console.log('\n[TEST 2] Tab reachability on Desktop (1440px) and Mobile (375px)');
  for (const width of [1440, 375]) {
    await page.setViewport({ width, height: 800 });
    await page.goto(baseUrl, { waitUntil: 'networkidle0' });

    // Count how many times Tab can focus a theme toggle
    let themeFocusCount = 0;
    let hamburgerFocusCount = 0;

    for (let i = 0; i < 30; i++) {
      await page.keyboard.press('Tab');
      const focusedClass = await page.evaluate(() => {
        const el = document.activeElement;
        return el ? el.className : '';
      });
      if (focusedClass.includes('theme-toggle-btn')) {
        themeFocusCount++;
      }
      if (focusedClass.includes('hamburger')) {
        hamburgerFocusCount++;
      }
    }

    console.log(`At ${width}px: Tab focused theme toggle ${themeFocusCount} times, hamburger ${hamburgerFocusCount} times`);
    if (themeFocusCount !== 1) {
      throw new Error(`FAIL: Tab reached theme toggle ${themeFocusCount} times at ${width}px (Expected exactly 1)`);
    }
    if (width === 375 && hamburgerFocusCount !== 1) {
      throw new Error(`FAIL: Tab reached hamburger ${hamburgerFocusCount} times at 375px (Expected exactly 1)`);
    }
    if (width === 1440 && hamburgerFocusCount !== 0) {
      throw new Error(`FAIL: Tab reached hamburger ${hamburgerFocusCount} times at 1440px (Expected 0)`);
    }
  }
  console.log('✅ TEST 2 PASSED: Tab navigation reaches theme toggle exactly once and hamburger appropriately!');

  // TEST 3: Hamburger interaction (Click open/close, Esc key, aria-expanded)
  console.log('\n[TEST 3] Hamburger Interaction & Aria-Expanded');
  await page.setViewport({ width: 375, height: 667 });
  await page.goto(baseUrl, { waitUntil: 'networkidle0' });

  const initialAria = await page.$eval('.hamburger', (el) => el.getAttribute('aria-expanded'));
  console.log(`Initial aria-expanded: ${initialAria}`);
  if (initialAria !== 'false') throw new Error('FAIL: Initial aria-expanded should be "false"');

  // Click to open
  await page.click('.hamburger');
  await new Promise((r) => setTimeout(r, 200));
  const openAria = await page.$eval('.hamburger', (el) => el.getAttribute('aria-expanded'));
  const hasOpenClass = await page.$eval('.hamburger', (el) => el.classList.contains('open'));
  const menuIsOpen = await page.$eval('.mobile-menu', (el) => el.classList.contains('open'));
  const bodyOverflow = await page.evaluate(() => document.body.style.overflow);

  console.log(`After click - aria-expanded: ${openAria}, hamburger has .open: ${hasOpenClass}, menu has .open: ${menuIsOpen}, body overflow: ${bodyOverflow}`);
  if (openAria !== 'true' || !hasOpenClass || !menuIsOpen || bodyOverflow !== 'hidden') {
    throw new Error('FAIL: Mobile drawer did not open properly on hamburger click');
  }

  // Press Escape to close
  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 200));
  const closedAria = await page.$eval('.hamburger', (el) => el.getAttribute('aria-expanded'));
  const menuIsClosed = await page.$eval('.mobile-menu', (el) => !el.classList.contains('open'));
  const bodyRestored = await page.evaluate(() => document.body.style.overflow);

  console.log(`After Escape - aria-expanded: ${closedAria}, menu closed: ${menuIsClosed}, body overflow restored: "${bodyRestored}"`);
  if (closedAria !== 'false' || !menuIsClosed || bodyRestored !== '') {
    throw new Error('FAIL: Mobile drawer did not close on Escape key');
  }
  console.log('✅ TEST 3 PASSED: Hamburger opens/closes with click, Esc key works, aria-expanded toggles!');

  // TEST 4: Storage Crash Safety
  console.log('\n[TEST 4] Storage Crash Safety (Simulating blocked/denied localStorage)');
  const pageCrashSafe = await browser.newPage();
  await pageCrashSafe.setViewport({ width: 1440, height: 800 });
  // Simulate blocked storage (e.g., throwing DOMException)
  await pageCrashSafe.evaluateOnNewDocument(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new DOMException('The operation is insecure.', 'SecurityError');
      },
    });
  });

  const pageCrashErrors = [];
  pageCrashSafe.on('pageerror', (err) => pageCrashErrors.push(err.message));

  await pageCrashSafe.goto(baseUrl, { waitUntil: 'networkidle0' });

  const crashSafeTheme = await pageCrashSafe.evaluate(() => document.documentElement.getAttribute('data-theme'));
  console.log(`With blocked storage, initial data-theme is: "${crashSafeTheme}"`);
  if (!crashSafeTheme) {
    throw new Error('FAIL: data-theme was not set when localStorage is blocked');
  }

  // Test toggling theme in-memory on desktop
  await pageCrashSafe.click('.navbar-links .theme-toggle-btn');
  const newTheme = await pageCrashSafe.evaluate(() => document.documentElement.getAttribute('data-theme'));
  console.log(`After toggle with blocked storage, data-theme is: "${newTheme}"`);
  if (newTheme === crashSafeTheme) {
    throw new Error('FAIL: In-memory theme toggle did not update document theme when storage blocked');
  }

  // Also test toggling on mobile with blocked storage
  await pageCrashSafe.setViewport({ width: 375, height: 667 });
  await pageCrashSafe.click('.navbar-mobile-actions .theme-toggle-btn');
  const restoredTheme = await pageCrashSafe.evaluate(() => document.documentElement.getAttribute('data-theme'));
  console.log(`After second toggle on mobile with blocked storage, data-theme is: "${restoredTheme}"`);
  if (restoredTheme !== crashSafeTheme) {
    throw new Error('FAIL: Mobile toggle with blocked storage failed');
  }

  if (pageCrashErrors.length > 0) {
    console.error('Errors with blocked storage:', pageCrashErrors);
    throw new Error('FAIL: Page threw errors when localStorage was blocked!');
  }
  await pageCrashSafe.close();
  console.log('✅ TEST 4 PASSED: Site runs completely crash-safe with blocked localStorage!');

  // TEST 5: Anti-FOUC (No wrong-theme flash test)
  console.log('\n[TEST 5] Anti-FOUC Head Script Execution Test');
  const pageFouc = await browser.newPage();
  await pageFouc.evaluateOnNewDocument(() => {
    localStorage.setItem('theme', 'dark');
  });

  await pageFouc.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  const appliedTheme = await pageFouc.evaluate(() => document.documentElement.getAttribute('data-theme'));
  console.log(`Theme set on DOMContentLoaded with saved 'dark': "${appliedTheme}"`);
  if (appliedTheme !== 'dark') {
    throw new Error(`FAIL: Anti-FOUC script did not set theme to 'dark' before paint (got ${appliedTheme})`);
  }
  await pageFouc.close();
  console.log('✅ TEST 5 PASSED: data-theme set before first paint, zero FOUC!');

  // Capture verification screenshots (375px and 1440px, dark and light)
  console.log('\nCapturing test screenshots...');
  fs.mkdirSync(path.resolve(__dirname, '../screenshots/qa-nav'), { recursive: true });

  for (const theme of ['light', 'dark']) {
    for (const width of [1440, 375]) {
      await page.setViewport({ width, height: 800 });
      await page.goto(baseUrl, { waitUntil: 'networkidle0' });
      await page.evaluate((t) => {
        document.documentElement.setAttribute('data-theme', t);
        localStorage.setItem('theme', t);
      }, theme);
      await new Promise((r) => setTimeout(r, 200));

      const filename = path.resolve(__dirname, `../screenshots/qa-nav/navbar-${width}px-${theme}.png`);
      await page.screenshot({ path: filename, clip: { x: 0, y: 0, width, height: 200 } });
      console.log(`Saved screenshot: ${filename}`);
    }
  }

  await browser.close();
  server.close();
  console.log('\n🎉 ALL LOCAL NAVBAR & THEME TESTS PASSED SUCCESSFULLY!');
}

runTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
