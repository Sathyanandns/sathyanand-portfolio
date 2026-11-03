import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { spawn } from 'child_process';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = process.env.CAPTURE_URL || 'https://sathyanandns.github.io/sathyanand-portfolio/';

const mode = process.argv[2] || 'before';
const outDir = path.join('screenshots', mode);
fs.mkdirSync(outDir, { recursive: true });

async function capture() {
  console.log(`📸 Capturing sections for mode: [${mode}] at ${TARGET_URL} ...`);

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

  try {
    // 1. Desktop 1440px
    const pageDesktop = await browser.newPage();
    await pageDesktop.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await pageDesktop.goto(TARGET_URL, { waitUntil: 'networkidle0' });

    // Scroll down to trigger lazy loads and observers
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

    console.log('Capturing Desktop 1440px sections...');
    await pageDesktop.screenshot({ path: path.join(outDir, 'desktop-fullpage-1440.png'), fullPage: true });

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

    for (const sec of sections) {
      try {
        let el = await pageDesktop.$(sec.selector);
        if (el && sec.parent) {
          const sectionHandle = await pageDesktop.evaluateHandle(e => e.closest('section'), el);
          el = sectionHandle.asElement() || el;
        }
        if (el) {
          await el.screenshot({ path: path.join(outDir, `desktop-${sec.name}.png`) });
          console.log(`  ✓ desktop-${sec.name}`);
        }
      } catch (err) {
        console.error(`  ❌ error capturing ${sec.name}:`, err.message);
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
          await modal.screenshot({ path: path.join(outDir, 'desktop-04-project-modal.png') });
          console.log('  ✓ desktop-04-project-modal');
        }
        const closeBtn = await pageDesktop.$('.modal-close-btn');
        if (closeBtn) await closeBtn.click();
        await new Promise(r => setTimeout(r, 200));
      }
    } catch (e) {
      console.error('  ❌ error capturing modal:', e.message);
    }

    // 2. Mobile 375px
    const pageMobile = await browser.newPage();
    await pageMobile.setViewport({ width: 375, height: 812, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await pageMobile.goto(TARGET_URL, { waitUntil: 'networkidle0' });

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

    console.log('Capturing Mobile 375px sections...');
    await pageMobile.screenshot({ path: path.join(outDir, 'mobile-fullpage-375.png'), fullPage: true });

    for (const sec of sections) {
      try {
        let el = await pageMobile.$(sec.selector);
        if (el && sec.parent) {
          const sectionHandle = await pageMobile.evaluateHandle(e => e.closest('section'), el);
          el = sectionHandle.asElement() || el;
        }
        if (el) {
          await el.screenshot({ path: path.join(outDir, `mobile-${sec.name}.png`) });
          console.log(`  ✓ mobile-${sec.name}`);
        }
      } catch (err) {
        console.error(`  ❌ error capturing mobile ${sec.name}:`, err.message);
      }
    }

    // Mobile menu open
    try {
      const menuBtn = await pageMobile.$('.mobile-menu-btn');
      if (menuBtn) {
        await menuBtn.click();
        await new Promise(r => setTimeout(r, 400));
        await pageMobile.screenshot({ path: path.join(outDir, 'mobile-nav-menu-open.png') });
        console.log('  ✓ mobile-nav-menu-open');
      }
    } catch (e) {
      console.error('  ❌ error capturing mobile menu:', e.message);
    }

    console.log(`\n🎉 All sections successfully captured to: ${outDir}`);

  } finally {
    await browser.close();
    if (preview) preview.kill();
  }
}

capture().catch(console.error);
