import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = 'https://sathyanandns.github.io/sathyanand-portfolio/';

const viewports = [
  { width: 320, height: 600, name: '320px' },
  { width: 360, height: 640, name: '360px' },
  { width: 375, height: 667, name: '375px' },
  { width: 390, height: 844, name: '390px' },
  { width: 412, height: 915, name: '412px' },
  { width: 768, height: 1024, name: '768px' },
  { width: 1440, height: 900, name: '1440px' },
];

async function run() {
  console.log('🔍 Running Full Verification Suite on LIVE site:', TARGET_URL);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const results = [];

  for (const theme of ['dark', 'light']) {
    for (const vp of viewports) {
      await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: vp.width <= 412 ? 3 : 1 });
      await page.goto(TARGET_URL, { waitUntil: 'networkidle0' });

      await page.evaluate((t) => {
        document.documentElement.setAttribute('data-theme', t);
        window.scrollTo(0, 0);
      }, theme);
      await new Promise(r => setTimeout(r, 150));

      const evaluation = await page.evaluate((vpWidth) => {
        const nav = document.querySelector('nav.navbar')?.getBoundingClientRect();
        const photo = document.querySelector('.hero-image')?.getBoundingClientRect();
        const photoContainer = document.querySelector('.hero-image-container')?.getBoundingClientRect();
        const card1 = document.querySelector('.hero-floating-card.card-1')?.getBoundingClientRect();
        const card2 = document.querySelector('.hero-floating-card.card-2')?.getBoundingClientRect();
        const card3 = document.querySelector('.hero-floating-card.card-3')?.getBoundingClientRect();
        const card1Style = window.getComputedStyle(document.querySelector('.hero-floating-card.card-1'));

        const statusBanner = document.querySelector('.hero-currently-banner');
        const roleDivider = document.querySelector('.title-divider');
        const statusItems = Array.from(document.querySelectorAll('.hero-status .status-item'));
        const dot = document.querySelector('.hero-status .status-dot')?.getBoundingClientRect();

        const isMobile = vpWidth <= 768;

        // Check A: Photo vs Navbar
        const photoMarginFromNav = photo && nav ? Math.round(photo.top - nav.bottom) : 0;
        const passA = isMobile ? photoMarginFromNav >= 16 : photoMarginFromNav >= 0;

        // Check B: Badges
        let passB = true;
        let card1OverlapsFace = false;
        let card2OverlapsFace = false;
        let card3OverlapsFace = false;
        let badgesOverlapEachOther = false;
        let insetsValid = true;

        if (photo && card1 && card2 && card3) {
          const faceBox = {
            left: photo.left + photo.width * 0.20,
            right: photo.left + photo.width * 0.80,
            top: photo.top + photo.height * 0.05,
            bottom: photo.top + photo.height * 0.65,
          };
          const intersects = (r1, r2) => !(r1.right < r2.left || r1.left > r2.right || r1.bottom < r2.top || r1.top > r2.bottom);

          card1OverlapsFace = intersects(card1, faceBox);
          card2OverlapsFace = intersects(card2, faceBox);
          card3OverlapsFace = intersects(card3, faceBox);
          badgesOverlapEachOther = intersects(card1, card2) || intersects(card1, card3) || intersects(card2, card3);

          if (isMobile) {
            const c1Inset = photoContainer.right - card1.right;
            const c2Inset = card2.left - photoContainer.left;
            const c3Inset = photoContainer.right - card3.right;
            insetsValid = c1Inset >= 7 && c2Inset >= 7 && c3Inset >= 7;
            if (card1OverlapsFace || card2OverlapsFace || card3OverlapsFace || badgesOverlapEachOther || !insetsValid) {
              passB = false;
            }
          }
        }

        // Check C: Skills Strip
        let startsWithBullet = false;
        const lines = {};
        for (const item of statusItems) {
          const r = item.getBoundingClientRect();
          const topKey = Math.round(r.top);
          let foundKey = Object.keys(lines).find(k => Math.abs(Number(k) - topKey) < 6);
          if (!foundKey) {
            foundKey = String(topKey);
            lines[foundKey] = [];
          }
          lines[foundKey].push(item.innerText.trim());
        }
        for (const k of Object.keys(lines)) {
          if (lines[k][0].startsWith('•')) startsWithBullet = true;
        }

        let dotAligned = false;
        if (dot && statusItems.length > 0) {
          const first = statusItems[0].getBoundingClientRect();
          dotAligned = Math.abs((dot.top + dot.height / 2) - (first.top + first.height / 2)) < 6;
        }

        const passC = !startsWithBullet && dotAligned;

        // Check D: Preserved Elements
        const passD = Boolean(statusBanner) && statusBanner.innerText.includes('Started as AI Cloud Engineer on 02 Nov 2025') && Boolean(roleDivider);

        // Overflow
        const hasOverflow = document.documentElement.scrollWidth > window.innerWidth;

        return {
          passA,
          photoMarginFromNav,
          passB,
          card1Bg: card1Style.backgroundColor,
          card1Border: card1Style.border,
          card1OverlapsFace,
          badgesOverlapEachOther,
          insetsValid,
          passC,
          startsWithBullet,
          dotAligned,
          passD,
          hasOverflow,
        };
      }, vp.width);

      results.push({
        theme,
        viewport: vp.name,
        ...evaluation
      });
    }
  }

  await browser.close();

  console.table(results.map(r => ({
    Theme: r.theme,
    VP: r.viewport,
    'Photo Margin (>=16px)': `${r.photoMarginFromNav}px (${r.passA ? 'PASS' : 'FAIL'})`,
    'Badges (No Face Overlap)': r.passB ? 'PASS' : 'FAIL',
    'Badge Surface': r.card1Bg,
    'Skills Strip (No Stray Bullet)': r.passC ? 'PASS' : 'FAIL',
    'Preserved Elements': r.passD ? 'PASS' : 'FAIL',
    'No Overflow': !r.hasOverflow ? 'PASS' : 'FAIL',
  })));

  const allPassed = results.every(r => r.passA && r.passB && r.passC && r.passD && !r.hasOverflow);
  console.log('\n🏁 ALL CRITERIA PASSING ON LIVE SITE:', allPassed);
}

run().catch(console.error);
