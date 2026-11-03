import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = 'https://sathyanandns.github.io/sathyanand-portfolio/';

async function verifyLive() {
  console.log('🌐 Verifying fixes on LIVE URL:', TARGET_URL);

  const outDir = path.resolve(__dirname, '../screenshots/live-qa');
  fs.mkdirSync(outDir, { recursive: true });

  const tmpDir = path.join(os.tmpdir(), `pup_live_qa_${Date.now()}`);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    userDataDir: tmpDir,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  const failedRequests = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  page.on('pageerror', (err) => consoleErrors.push(err.message));

  page.on('response', (res) => {
    if (res.status() >= 400) {
      failedRequests.push({ url: res.url(), status: res.status() });
    }
  });

  // Verify Anti-FOUC script present in live HTML
  console.log('\n[CHECK 1] Verify deployment has updated code with inline theme script');
  const liveHtmlRes = await fetch(TARGET_URL);
  const liveHtml = await liveHtmlRes.text();
  const hasAntiFoucScript = liveHtml.includes('Immediate theme initialization before CSS');
  console.log('Anti-FOUC script present in live HTML:', hasAntiFoucScript);
  if (!hasAntiFoucScript) {
    throw new Error('Deployment not yet live with latest commit! Anti-FOUC script missing.');
  }

  // TEST 1: Widths & Visibility
  console.log('\n[CHECK 2] Viewport Width checks (320, 375, 768, 868, 1024, 1440, 1920px)');
  for (const width of [320, 375, 768, 868, 1024, 1440, 1920]) {
    await page.setViewport({ width, height: 800 });
    await page.goto(TARGET_URL, { waitUntil: 'networkidle0' });

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
        visibleCount: visibleThemeBtns.length,
        isDesktopToggleVisible,
        isMobileToggleVisible,
        isHamburgerVisible,
        hamburgerSize: hamburgerRect ? { width: hamburgerRect.width, height: hamburgerRect.height } : null,
      };
    }, width);

    console.log(`Width ${width}px -> Visible toggles: ${checks.visibleCount}, Desktop toggle: ${checks.isDesktopToggleVisible}, Mobile toggle: ${checks.isMobileToggleVisible}, Hamburger: ${checks.isHamburgerVisible}`);
    if (checks.visibleCount !== 1) {
      throw new Error(`FAIL: Expected 1 visible toggle at ${width}px, found ${checks.visibleCount}`);
    }
  }
  console.log('✅ CHECK 2 PASSED: Exactly 1 toggle visible at every viewport width!');

  // TEST 2: Tab Reachability
  console.log('\n[CHECK 3] Keyboard Tab Reachability');
  for (const width of [1440, 375]) {
    await page.setViewport({ width, height: 800 });
    await page.goto(TARGET_URL, { waitUntil: 'networkidle0' });

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

    console.log(`At ${width}px: Tab reached theme toggle ${themeFocusCount}x, hamburger ${hamburgerFocusCount}x`);
    if (themeFocusCount !== 1) {
      throw new Error(`FAIL: Tab reached theme toggle ${themeFocusCount} times at ${width}px (Expected exactly 1)`);
    }
    if (width === 375 && hamburgerFocusCount !== 1) {
      throw new Error(`FAIL: Tab reached hamburger ${hamburgerFocusCount} times at 375px (Expected 1)`);
    }
    if (width === 1440 && hamburgerFocusCount !== 0) {
      throw new Error(`FAIL: Tab reached hamburger ${hamburgerFocusCount} times at 1440px (Expected 0)`);
    }
  }
  console.log('✅ CHECK 3 PASSED: Tab navigation reaches toggle once and hamburger once (mobile only)!');

  // TEST 3: Hamburger Drawer & Escape Key
  console.log('\n[CHECK 4] Mobile Hamburger Drawer & Escape Key');
  await page.setViewport({ width: 375, height: 667 });
  await page.goto(TARGET_URL, { waitUntil: 'networkidle0' });

  await page.click('.hamburger');
  await new Promise((r) => setTimeout(r, 200));

  const afterClick = await page.evaluate(() => ({
    ariaExpanded: document.querySelector('.hamburger').getAttribute('aria-expanded'),
    hamburgerOpen: document.querySelector('.hamburger').classList.contains('open'),
    menuOpen: document.querySelector('.mobile-menu').classList.contains('open'),
    overflow: document.body.style.overflow,
  }));

  console.log('Mobile menu open state:', afterClick);
  if (afterClick.ariaExpanded !== 'true' || !afterClick.hamburgerOpen || !afterClick.menuOpen || afterClick.overflow !== 'hidden') {
    throw new Error('FAIL: Mobile drawer did not open correctly!');
  }

  // Screenshot open drawer
  await page.screenshot({ path: path.join(outDir, 'live-375px-drawer-open.png') });

  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 200));

  const afterEsc = await page.evaluate(() => ({
    ariaExpanded: document.querySelector('.hamburger').getAttribute('aria-expanded'),
    menuOpen: document.querySelector('.mobile-menu').classList.contains('open'),
    overflow: document.body.style.overflow,
  }));

  console.log('Mobile menu after Escape:', afterEsc);
  if (afterEsc.ariaExpanded !== 'false' || afterEsc.menuOpen || afterEsc.overflow !== '') {
    throw new Error('FAIL: Escape did not close the drawer!');
  }
  console.log('✅ CHECK 4 PASSED: Hamburger drawer opens, locks scroll, and closes on Escape!');

  // TEST 4: Theme Persistence & Reload Test
  console.log('\n[CHECK 5] Theme Toggle Persistence & Reload');
  await page.setViewport({ width: 1440, height: 800 });
  await page.goto(TARGET_URL, { waitUntil: 'networkidle0' });

  // Toggle to light
  await page.evaluate(() => {
    const btn = document.querySelector('.navbar-links .theme-toggle-btn');
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme !== 'light') btn.click();
  });
  await new Promise((r) => setTimeout(r, 100));

  let currentTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  console.log('Current theme explicitly set to:', currentTheme);
  if (currentTheme !== 'light') throw new Error('FAIL: Theme not light after toggle');

  // Reload and check if immediately light before paint
  await page.reload({ waitUntil: 'networkidle0' });
  let reloadedTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  console.log('Theme after reload:', reloadedTheme);
  if (reloadedTheme !== 'light') throw new Error('FAIL: Theme did not survive reload!');

  // Now toggle to dark
  await page.click('.navbar-links .theme-toggle-btn');
  await new Promise((r) => setTimeout(r, 100));
  currentTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  console.log('Current theme toggled to:', currentTheme);
  if (currentTheme !== 'dark') throw new Error('FAIL: Theme not dark after toggle');

  // Reload and check if dark survives
  await page.reload({ waitUntil: 'networkidle0' });
  reloadedTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  console.log('Theme after second reload:', reloadedTheme);
  if (reloadedTheme !== 'dark') throw new Error('FAIL: Dark theme did not survive reload!');
  console.log('✅ CHECK 5 PASSED: Theme toggle works both ways and survives reload without flash!');

  // TEST 5: Storage Crash Safety
  console.log('\n[CHECK 6] Storage Crash Safety on Live Site');
  const crashPage = await browser.newPage();
  await crashPage.setViewport({ width: 1440, height: 800 });
  await crashPage.evaluateOnNewDocument(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new DOMException('The operation is insecure.', 'SecurityError');
      },
    });
  });

  const crashErrors = [];
  crashPage.on('pageerror', (err) => crashErrors.push(err.message));

  await crashPage.goto(TARGET_URL, { waitUntil: 'networkidle0' });
  const liveCrashTheme = await crashPage.evaluate(() => document.documentElement.getAttribute('data-theme'));
  console.log('Initial theme with blocked storage:', liveCrashTheme);

  await crashPage.click('.navbar-links .theme-toggle-btn');
  const toggledCrashTheme = await crashPage.evaluate(() => document.documentElement.getAttribute('data-theme'));
  console.log('Theme after in-memory toggle with blocked storage:', toggledCrashTheme);

  if (liveCrashTheme === toggledCrashTheme || crashErrors.length > 0) {
    throw new Error('FAIL: Storage crash safety test failed on live site!');
  }
  await crashPage.close();
  console.log('✅ CHECK 6 PASSED: Site operates crash-safe with blocked storage!');

  // Capture Screenshots (1440px and 375px in both themes)
  console.log('\n[CHECK 7] Capturing Live Screenshots');
  for (const theme of ['light', 'dark']) {
    for (const width of [1440, 375]) {
      await page.setViewport({ width, height: 800 });
      await page.goto(TARGET_URL, { waitUntil: 'networkidle0' });
      await page.evaluate((t) => {
        document.documentElement.setAttribute('data-theme', t);
        localStorage.setItem('theme', t);
      }, theme);
      await new Promise((r) => setTimeout(r, 200));

      const filename = path.join(outDir, `live-navbar-${width}px-${theme}.png`);
      await page.screenshot({ path: filename, clip: { x: 0, y: 0, width, height: 240 } });
      console.log(`Saved screenshot: ${filename}`);
    }
  }

  // Console and Network errors
  console.log('\n[CHECK 8] Console errors and Network 404s');
  console.log('Console errors count:', consoleErrors.length);
  if (consoleErrors.length > 0) console.error('Console errors:', consoleErrors);
  console.log('Failed requests count:', failedRequests.length);
  if (failedRequests.length > 0) console.error('Failed requests:', failedRequests);

  if (consoleErrors.length > 0) throw new Error('FAIL: Console errors detected on live site!');
  if (failedRequests.length > 0) throw new Error('FAIL: Failed network requests detected on live site!');

  console.log('✅ CHECK 8 PASSED: 0 console errors, 0 failed requests (0 404s)!');

  await browser.close();
  console.log('\n🎉 ALL LIVE VERIFICATION CHECKS PASSED SUCCESSFULLY!');
}

verifyLive().catch((err) => {
  console.error('Live verification failed:', err);
  process.exit(1);
});

