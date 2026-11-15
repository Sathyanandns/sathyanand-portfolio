import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = process.env.CAPTURE_URL || 'https://sathyanandns.github.io/sathyanand-portfolio/';

const mode = process.argv[2] || 'before';
const outDir = path.resolve(__dirname, '../screenshots', mode);
fs.mkdirSync(outDir, { recursive: true });

async function capture() {
  console.log(`📸 Capturing comprehensive sections for mode: [${mode}] at ${TARGET_URL} ...`);

  let preview = null;
  if (TARGET_URL.includes('localhost')) {
    preview = spawn('npx', ['vite', 'preview', '--port', '4173'], { shell: true, stdio: 'ignore' });
    for (let i = 0; i < 20; i++) {
      try {
        await fetch(TARGET_URL);
        break;
      } catch {
        await new Promise(r => setTimeout(r, 500));
      }
    }
  }

  const tmpDir = path.join(os.tmpdir(), `pup_cap_${mode}_${Date.now()}`);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    userDataDir: tmpDir,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const sections = [
    { name: '01-hero', selector: '#home' },
    { name: '02-about', selector: '#about' },
    { name: '03-skills', selector: '#skills' },
    { name: '04-projects', selector: '#projects' },
    { name: '05-education', selector: '#education' },
    { name: '06-team-qualities', selector: '.qualities-grid', parent: true },
    { name: '07-languages', selector: '.languages-list', parent: true },
    { name: '08-resume', selector: '#resume' },
    { name: '09-contact', selector: '#contact' },
    { name: '10-footer', selector: 'footer.footer' },
  ];

  try {
    for (const theme of ['dark', 'light']) {
      console.log(`\n=== Capturing Theme: ${theme.toUpperCase()} ===`);

      // 1. Desktop 1440px
      const pageDesktop = await browser.newPage();
      await pageDesktop.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
      await pageDesktop.goto(TARGET_URL, { waitUntil: 'networkidle0' });

      // Apply theme
      await pageDesktop.evaluate((t) => {
        document.documentElement.setAttribute('data-theme', t);
        localStorage.setItem('theme', t);
      }, theme);
      await new Promise(r => setTimeout(r, 200));

      // If mode === 'before' and theme === 'dark', extract and save full rendered text
      if (mode === 'before' && theme === 'dark') {
        const fullText = await pageDesktop.evaluate(() => {
          // Remove scripts and styles, return visible body text
          return document.body.innerText.trim();
        });
        const textFile = path.resolve(__dirname, '../screenshots/rendered-text-baseline.txt');
        fs.writeFileSync(textFile, fullText, 'utf8');
        console.log(`Saved baseline rendered text to ${textFile}`);
      } else if (mode === 'after' && theme === 'dark') {
        const fullText = await pageDesktop.evaluate(() => document.body.innerText.trim());
        const textFile = path.resolve(__dirname, '../screenshots/rendered-text-after.txt');
        fs.writeFileSync(textFile, fullText, 'utf8');
        console.log(`Saved after rendered text to ${textFile}`);
      }

      // Scroll to trigger all animations
      await pageDesktop.evaluate(async () => {
        const scrollStep = 500;
        const totalHeight = document.body.scrollHeight;
        for (let y = 0; y < totalHeight; y += scrollStep) {
          window.scrollTo(0, y);
          await new Promise(r => setTimeout(r, 60));
        }
        window.scrollTo(0, 0);
        document.querySelectorAll('.animate-in').forEach(el => {
          el.classList.add('visible');
          el.style.opacity = '1';
          el.style.transform = 'none';
          el.style.transition = 'none';
        });
      });
      await new Promise(r => setTimeout(r, 300));

      console.log(`Capturing Desktop 1440px (${theme})...`);
      await pageDesktop.screenshot({ path: path.join(outDir, `desktop-fullpage-1440-${theme}.png`), fullPage: true });

      for (const sec of sections) {
        try {
          let el = await pageDesktop.$(sec.selector);
          if (el && sec.parent) {
            const sectionHandle = await pageDesktop.evaluateHandle(e => e.closest('section'), el);
            el = sectionHandle.asElement() || el;
          }
          if (el) {
            await el.screenshot({ path: path.join(outDir, `desktop-${sec.name}-${theme}.png`) });
          }
        } catch (err) {
          console.error(`  ❌ error capturing desktop ${sec.name}:`, err.message);
        }
      }

      // Modal capture on Desktop
      try {
        const firstCard = await pageDesktop.$('.project-card');
        if (firstCard) {
          await firstCard.click();
          await new Promise(r => setTimeout(r, 400));
          const modal = await pageDesktop.$('.modal-container') || await pageDesktop.$('.modal-overlay');
          if (modal) {
            await modal.screenshot({ path: path.join(outDir, `desktop-04-project-modal-${theme}.png`) });
            console.log(`  ✓ desktop-04-project-modal-${theme}`);
          }
          const closeBtn = await pageDesktop.$('.modal-close-btn');
          if (closeBtn) await closeBtn.click();
          await new Promise(r => setTimeout(r, 200));
        }
      } catch (e) {
        console.error('  ❌ error capturing modal:', e.message);
      }
      await pageDesktop.close();

      // 2. Mobile 375px
      const pageMobile = await browser.newPage();
      await pageMobile.setViewport({ width: 375, height: 812, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
      await pageMobile.goto(TARGET_URL, { waitUntil: 'networkidle0' });

      await pageMobile.evaluate((t) => {
        document.documentElement.setAttribute('data-theme', t);
        localStorage.setItem('theme', t);
      }, theme);
      await new Promise(r => setTimeout(r, 200));

      await pageMobile.evaluate(async () => {
        const scrollStep = 500;
        const totalHeight = document.body.scrollHeight;
        for (let y = 0; y < totalHeight; y += scrollStep) {
          window.scrollTo(0, y);
          await new Promise(r => setTimeout(r, 60));
        }
        window.scrollTo(0, 0);
        document.querySelectorAll('.animate-in').forEach(el => {
          el.classList.add('visible');
          el.style.opacity = '1';
          el.style.transform = 'none';
          el.style.transition = 'none';
        });
      });
      await new Promise(r => setTimeout(r, 300));

      console.log(`Capturing Mobile 375px (${theme})...`);
      await pageMobile.screenshot({ path: path.join(outDir, `mobile-fullpage-375-${theme}.png`), fullPage: true });

      for (const sec of sections) {
        try {
          let el = await pageMobile.$(sec.selector);
          if (el && sec.parent) {
            const sectionHandle = await pageMobile.evaluateHandle(e => e.closest('section'), el);
            el = sectionHandle.asElement() || el;
          }
          if (el) {
            await el.screenshot({ path: path.join(outDir, `mobile-${sec.name}-${theme}.png`) });
          }
        } catch (err) {
          console.error(`  ❌ error capturing mobile ${sec.name}:`, err.message);
        }
      }

      // Mobile Modal
      try {
        const firstCardMobile = await pageMobile.$('.project-card');
        if (firstCardMobile) {
          await firstCardMobile.click();
          await new Promise(r => setTimeout(r, 400));
          const modalMobile = await pageMobile.$('.modal-container') || await pageMobile.$('.modal-overlay');
          if (modalMobile) {
            await modalMobile.screenshot({ path: path.join(outDir, `mobile-04-project-modal-${theme}.png`) });
            console.log(`  ✓ mobile-04-project-modal-${theme}`);
          }
          const closeBtnMobile = await pageMobile.$('.modal-close-btn');
          if (closeBtnMobile) await closeBtnMobile.click();
          await new Promise(r => setTimeout(r, 200));
        }
      } catch (e) {
        console.error('  ❌ error capturing mobile modal:', e.message);
      }

      // Mobile menu open
      try {
        const hamburger = await pageMobile.$('.hamburger');
        if (hamburger) {
          await hamburger.click();
          await new Promise(r => setTimeout(r, 400));
          await pageMobile.screenshot({ path: path.join(outDir, `mobile-nav-menu-open-${theme}.png`) });
          console.log(`  ✓ mobile-nav-menu-open-${theme}`);
          await hamburger.click();
          await new Promise(r => setTimeout(r, 200));
        }
      } catch (e) {
        console.error('  ❌ error capturing mobile menu:', e.message);
      }

      await pageMobile.close();
    }

    console.log(`\n🎉 All sections successfully captured to: ${outDir}`);

  } finally {
    await browser.close();
    if (preview) preview.kill();
  }
}

capture().catch(console.error);
