import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = 'https://sathyanandns.github.io/sathyanand-portfolio/';

async function measureLive() {
  console.log('📏 Measuring live URL at 390x844 (scale 3, dark)...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3 });
  await page.goto(TARGET_URL, { waitUntil: 'networkidle0' });

  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    window.scrollTo(0, 0);
  });
  await new Promise(r => setTimeout(r, 200));

  const diag = await page.evaluate(() => {
    const nav = document.querySelector('nav.navbar')?.getBoundingClientRect();
    const heroStyle = window.getComputedStyle(document.querySelector('#home'));
    const photo = document.querySelector('.hero-image')?.getBoundingClientRect();
    const container = document.querySelector('.hero-image-container')?.getBoundingClientRect();

    // Problem A
    const heroPaddingTop = heroStyle.paddingTop;
    const photoMarginFromNav = photo && nav ? Math.round(photo.top - nav.bottom) : 0;
    const photoOverlapsNavbar = photo && nav ? photo.top < nav.bottom : false;

    // Problem B
    const card1 = document.querySelector('.hero-floating-card.card-1')?.getBoundingClientRect();
    const card2 = document.querySelector('.hero-floating-card.card-2')?.getBoundingClientRect();
    const card3 = document.querySelector('.hero-floating-card.card-3')?.getBoundingClientRect();
    const card1Style = window.getComputedStyle(document.querySelector('.hero-floating-card.card-1'));

    let faceBox = null;
    let card1OverlapsFace = false;
    let card2OverlapsFace = false;
    let card3OverlapsFace = false;
    let badgesOverlapEachOther = false;

    if (photo && card1 && card2 && card3) {
      faceBox = {
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
    }

    // Problem C
    const items = Array.from(document.querySelectorAll('.hero-status .status-item'));
    const dot = document.querySelector('.hero-status .status-dot')?.getBoundingClientRect();

    const lines = {};
    for (const item of items) {
      const r = item.getBoundingClientRect();
      const topKey = Math.round(r.top);
      let foundKey = Object.keys(lines).find(k => Math.abs(Number(k) - topKey) < 6);
      if (!foundKey) {
        foundKey = String(topKey);
        lines[foundKey] = [];
      }
      lines[foundKey].push(item.innerText.trim());
    }

    let startsWithBullet = false;
    for (const k of Object.keys(lines)) {
      if (lines[k][0].startsWith('•')) startsWithBullet = true;
    }

    let dotAligned = false;
    if (dot && items.length > 0) {
      const firstItem = items[0].getBoundingClientRect();
      dotAligned = Math.abs((dot.top + dot.height / 2) - (firstItem.top + firstItem.height / 2)) < 6;
    }

    return {
      nav: { height: Math.round(nav?.height || 0), bottom: Math.round(nav?.bottom || 0) },
      heroPaddingTop,
      photo: photo ? { top: Math.round(photo.top), height: Math.round(photo.height), width: Math.round(photo.width) } : null,
      photoOverlapsNavbar,
      photoMarginFromNav,
      faceBox: faceBox ? {
        top: Math.round(faceBox.top),
        bottom: Math.round(faceBox.bottom),
        left: Math.round(faceBox.left),
        right: Math.round(faceBox.right)
      } : null,
      card1: card1 ? {
        top: Math.round(card1.top),
        bottom: Math.round(card1.bottom),
        left: Math.round(card1.left),
        right: Math.round(card1.right),
        bg: card1Style.backgroundColor,
        color: card1Style.color,
        border: card1Style.border,
        overlapsFace: card1OverlapsFace
      } : null,
      card2: card2 ? { top: Math.round(card2.top), bottom: Math.round(card2.bottom), overlapsFace: card2OverlapsFace } : null,
      card3: card3 ? { top: Math.round(card3.top), bottom: Math.round(card3.bottom), overlapsFace: card3OverlapsFace } : null,
      badgesOverlapEachOther,
      card1Inset: card1 && container ? Math.round(container.right - card1.right) : 0,
      card2Inset: card2 && container ? Math.round(card2.left - container.left) : 0,
      card3Inset: card3 && container ? Math.round(container.right - card3.right) : 0,
      status: {
        lines: Object.values(lines).map(l => l.join(' ')),
        startsWithBullet,
        dotAligned
      }
    };
  });

  console.log('\n📊 Live Measurements After Fixes:');
  console.log(JSON.stringify(diag, null, 2));

  await browser.close();
}

measureLive().catch(console.error);

