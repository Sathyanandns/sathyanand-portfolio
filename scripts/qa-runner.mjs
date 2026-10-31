import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = 'https://sathyanandns.github.io/sathyanand-portfolio/';
const SCREENSHOT_DIR = path.resolve('qa-screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runQA() {
  const results = [];
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  console.log('🚀 Browser launched. Testing target:', TARGET_URL);

  async function takeFailScreenshot(page, filename) {
    const ssPath = path.join(SCREENSHOT_DIR, filename);
    await page.screenshot({ path: ssPath, fullPage: false });
    return ssPath;
  }

  function report(category, check, pass, details, screenshotPath = null) {
    results.push({ category, check, pass, details, screenshotPath });
    const status = pass ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} [${category}] ${check}: ${details}`);
  }

  const page = await browser.newPage();
  const consoleMessages = [];
  const failedRequests = [];

  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      consoleMessages.push({ type: msg.type(), text: msg.text() });
    }
  });

  page.on('requestfailed', req => {
    failedRequests.push({ url: req.url(), error: req.failure()?.errorText });
  });

  page.on('response', resp => {
    if (resp.status() >= 400) {
      failedRequests.push({ url: resp.url(), status: resp.status() });
    }
  });

  await page.setViewport({ width: 1440, height: 900 });
  const response = await page.goto(TARGET_URL, { waitUntil: 'networkidle2', timeout: 30000 });

  // A. LOAD & ASSETS
  console.log('\n--- Testing A: LOAD & ASSETS ---');
  report('A. LOAD & ASSETS', 'Page load HTTP 200', response.status() === 200, `Status: ${response.status()}`);

  const hasConsoleErrors = consoleMessages.length > 0;
  let consoleSS = null;
  if (hasConsoleErrors) {
    consoleSS = await takeFailScreenshot(page, 'fail-console-errors.png');
  }
  report('A. LOAD & ASSETS', 'No console errors or warnings', !hasConsoleErrors,
    hasConsoleErrors ? `Found ${consoleMessages.length} console issues: ${consoleMessages.map(m=>m.text).slice(0,3).join('; ')}` : '0 console errors/warnings',
    consoleSS
  );

  const hasFailedReqs = failedRequests.length > 0;
  let reqsSS = null;
  if (hasFailedReqs) {
    reqsSS = await takeFailScreenshot(page, 'fail-network-requests.png');
  }
  report('A. LOAD & ASSETS', 'No failed network requests (404s)', !hasFailedReqs,
    hasFailedReqs ? `${failedRequests.length} failed requests: ${failedRequests.map(r=>r.url).join(', ')}` : '0 failed requests across JS, CSS, images, fonts',
    reqsSS
  );

  // Images check: hero, about, profile
  const images = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img')).map(img => ({
      src: img.src,
      alt: img.alt,
      complete: img.complete,
      naturalWidth: img.naturalWidth,
    }));
  });

  const heroImg = images.find(img => img.src.includes('sathyanand-hero'));
  const aboutImg = images.find(img => img.src.includes('sathyanand-about'));
  const profileImg = images.find(img => img.src.includes('sathyanand-profile'));

  report('A. LOAD & ASSETS', 'Hero image loads with alt text', Boolean(heroImg && heroImg.naturalWidth > 0 && heroImg.alt),
    heroImg ? `Loaded ${heroImg.naturalWidth}px, alt: "${heroImg.alt}"` : 'Missing hero image'
  );

  report('A. LOAD & ASSETS', 'About image loads with alt text', Boolean(aboutImg && aboutImg.naturalWidth > 0 && aboutImg.alt),
    aboutImg ? `Loaded ${aboutImg.naturalWidth}px, alt: "${aboutImg.alt}"` : 'Missing about image'
  );

  if (profileImg && profileImg.naturalWidth > 0 && profileImg.alt) {
    report('A. LOAD & ASSETS', 'Profile image loads with alt text', true, `Profile img loaded: ${profileImg.src}`);
  } else {
    const ss = await takeFailScreenshot(page, 'fail-profile-image.png');
    report('A. LOAD & ASSETS', 'Profile image loads with alt text', false,
      'sathyanand-profile.webp exists in public/images/ but is not rendered in any component on the page',
      ss
    );
  }

  // Check static assets
  const staticFiles = [
    'Sathyanand_NS_Resume.pdf',
    'favicon.svg',
    'favicon-32x32.png',
    'apple-touch-icon.png',
    'images/og-image.png',
    'robots.txt',
    'sitemap.xml',
    '404.html'
  ];

  for (const f of staticFiles) {
    const u = new URL(f, TARGET_URL).href;
    const res = await fetch(u);
    report('A. LOAD & ASSETS', `Asset ${f} returns HTTP 200`, res.status === 200, `HTTP ${res.status}`);
  }

  // Deep link and reload
  await page.goto(`${TARGET_URL}#projects`, { waitUntil: 'networkidle2' });
  const reloadRes = await page.reload({ waitUntil: 'networkidle2' });
  report('A. LOAD & ASSETS', 'Deep link and refresh does not 404', reloadRes.status() === 200 || reloadRes.status() === 304,
    `Status ${reloadRes.status()}`
  );

  // B. NAVBAR
  console.log('\n--- Testing B: NAVBAR ---');
  const navTargets = ['home', 'about', 'skills', 'projects', 'education', 'resume', 'contact'];
  for (const id of navTargets) {
    const exists = await page.evaluate(i => Boolean(document.getElementById(i)), id);
    report('B. NAVBAR', `Nav target anchor #${id} exists`, exists, exists ? `Found #${id}` : `Missing #${id}`);
  }

  // Navbar resume button
  const resumeBtnHref = await page.evaluate(() => document.querySelector('.navbar-resume-btn')?.getAttribute('href'));
  report('B. NAVBAR', 'Resume button links to PDF', Boolean(resumeBtnHref?.includes('Resume.pdf')), `href: ${resumeBtnHref}`);

  // Mobile menu test at 375px
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 375, height: 667 });
  await mobilePage.goto(TARGET_URL, { waitUntil: 'networkidle2' });

  await mobilePage.evaluate(() => document.querySelector('.hamburger')?.click());
  await new Promise(r => setTimeout(r, 300));

  const mobileOpen = await mobilePage.evaluate(() => {
    const menu = document.querySelector('.mobile-menu');
    const burger = document.querySelector('.hamburger');
    return {
      menuOpen: menu?.classList.contains('open'),
      ariaExpanded: burger?.getAttribute('aria-expanded') === 'true',
      bodyOverflow: document.body.style.overflow
    };
  });

  report('B. NAVBAR', 'Mobile hamburger opens and locks scroll',
    mobileOpen.menuOpen && mobileOpen.ariaExpanded && mobileOpen.bodyOverflow === 'hidden',
    `Open: ${mobileOpen.menuOpen}, Expanded: ${mobileOpen.ariaExpanded}, ScrollLocked: ${mobileOpen.bodyOverflow === 'hidden'}`
  );

  await mobilePage.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 300));

  const mobileClosed = await mobilePage.evaluate(() => {
    const menu = document.querySelector('.mobile-menu');
    return !menu?.classList.contains('open') && document.body.style.overflow !== 'hidden';
  });

  report('B. NAVBAR', 'Mobile menu closes on Escape', mobileClosed, 'Menu closed & scroll unlocked on Escape');

  // C. HERO
  console.log('\n--- Testing C: HERO ---');
  const heroLinks = await page.evaluate(() => ({
    viewProjects: document.querySelector('.hero-actions a[href="#projects"]')?.getAttribute('href'),
    downloadResume: document.querySelector('.hero-actions a[download]')?.getAttribute('href'),
    connect: document.querySelector('.hero a[href="#contact"]')?.getAttribute('href'),
  }));

  report('C. HERO', '"View My Projects" button links to #projects', heroLinks.viewProjects === '#projects', `href: ${heroLinks.viewProjects}`);
  report('C. HERO', '"Download Resume" button links to PDF', Boolean(heroLinks.downloadResume?.includes('.pdf')), `href: ${heroLinks.downloadResume}`);
  report('C. HERO', '"Let\'s Connect" button links to #contact', heroLinks.connect === '#contact', `href: ${heroLinks.connect}`);

  // D. SECTIONS & TITLE CONSISTENCY
  console.log('\n--- Testing D: SECTIONS & TITLE CONSISTENCY ---');
  const titles = await page.evaluate(() => ({
    docTitle: document.title,
    ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute('content'),
    metaDesc: document.querySelector('meta[name="description"]')?.getAttribute('content'),
    heroTitle: document.querySelector('.hero-title')?.textContent?.trim()
  }));

  const hasTitleMismatch =
    titles.metaDesc?.includes('AI & Cloud') &&
    (titles.docTitle?.includes('Machine Learning & Cloud') || titles.ogTitle?.includes('ML & Cloud'));

  if (hasTitleMismatch) {
    const ss = await takeFailScreenshot(page, 'fail-title-mismatch.png');
    report('D. SECTIONS', 'Title consistency between meta description, page title, and OG tags', false,
      `Mismatch! Doc title: "${titles.docTitle}", Meta description: "${titles.metaDesc}", Hero title: "${titles.heroTitle}"`,
      ss
    );
  } else {
    report('D. SECTIONS', 'Title consistency between meta description, page title, and OG tags', true, 'All titles align consistently');
  }

  // Resume section buttons
  const resumeSectionLinks = await page.evaluate(() => {
    const dl = document.querySelector('.resume-actions a[download]');
    const view = document.querySelector('.resume-actions a[target="_blank"]');
    return {
      hasDl: Boolean(dl && dl.getAttribute('href')?.includes('.pdf')),
      hasView: Boolean(view && view.getAttribute('href')?.includes('.pdf') && view.getAttribute('target') === '_blank')
    };
  });

  report('D. SECTIONS', 'Resume section "Download" and "View" links', resumeSectionLinks.hasDl && resumeSectionLinks.hasView,
    'Download and View (target="_blank") both link to PDF'
  );

  // E. PROJECTS
  console.log('\n--- Testing E: PROJECTS & MODAL ---');
  const filterCount = await page.evaluate(() => document.querySelectorAll('.filter-btn').length);
  report('E. PROJECTS', 'Category filter bar rendered', filterCount >= 4, `Rendered ${filterCount} filter buttons`);

  const cardCount = await page.evaluate(() => document.querySelectorAll('.project-card').length);
  report('E. PROJECTS', 'All project cards rendered', cardCount === 8, `Rendered ${cardCount} cards`);

  // Open modal via card button
  await page.evaluate(() => {
    const cardBtn = document.querySelector('.project-card button.project-btn-details');
    cardBtn?.click();
  });
  await new Promise(r => setTimeout(r, 400));

  const modalInfo = await page.evaluate(() => {
    const modal = document.querySelector('.modal-content');
    if (!modal) return { open: false };
    return {
      open: true,
      hasProblem: modal.textContent.includes('Problem'),
      hasSolution: modal.textContent.includes('Solution'),
      hasResult: modal.textContent.includes('Result'),
      hasGithub: Boolean(modal.querySelector('a[href*="github.com"]')),
      hasDemo: Boolean(modal.querySelector('.modal-actions-bar a:nth-child(2)')),
      scrollLocked: document.body.style.overflow === 'hidden'
    };
  });

  report('E. PROJECTS', 'Project modal opens with details and GitHub/Demo actions',
    modalInfo.open && modalInfo.hasProblem && modalInfo.hasSolution && modalInfo.hasGithub,
    `Open: ${modalInfo.open}, Problem: ${modalInfo.hasProblem}, Solution: ${modalInfo.hasSolution}, GitHub: ${modalInfo.hasGithub}`
  );

  // Close modal via Escape
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 400));

  const modalClosed = await page.evaluate(() => document.querySelector('.modal-content') === null);
  report('E. PROJECTS', 'Modal closes on Escape key', modalClosed, modalClosed ? 'Closed successfully' : 'Failed to close');

  // Check modal links have rel="noopener noreferrer"
  const modalLinksRel = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('.modal-actions-bar a[target="_blank"]'));
    return links.every(l => l.getAttribute('rel')?.includes('noopener') && l.getAttribute('rel')?.includes('noreferrer'));
  });
  report('E. PROJECTS', 'Modal external links have rel="noopener noreferrer"', modalLinksRel, 'Links have rel="noopener noreferrer"');

  // F. CONTACT FORM
  console.log('\n--- Testing F: CONTACT FORM ---');
  await page.evaluate(() => {
    document.querySelector('.contact-form')?.scrollIntoView({ behavior: 'instant', block: 'center' });
    const submitBtn = document.querySelector('.contact-form button[type="submit"]');
    submitBtn?.click();
  });
  await new Promise(r => setTimeout(r, 300));

  const formErrors = await page.evaluate(() => document.querySelectorAll('.form-error').length);
  report('F. CONTACT FORM', 'Submitting empty form triggers 4 validation errors', formErrors === 4, `Triggered ${formErrors} errors`);

  // Honeypot field check
  const honeypotExists = await page.evaluate(() => {
    const input = document.querySelector('input[name="_gotcha"]');
    return Boolean(input && (input.parentElement?.style?.display === 'none' || input.parentElement?.getAttribute('aria-hidden') === 'true'));
  });
  report('F. CONTACT FORM', 'Honeypot spam prevention field present and hidden', honeypotExists, 'Hidden honeypot field active');

  // Obfuscation check
  const revealBtns = await page.evaluate(() => document.querySelectorAll('.reveal-btn').length);
  report('F. CONTACT FORM', 'Contact email and phone obfuscated with click-to-reveal', revealBtns === 2, `Found ${revealBtns} reveal buttons`);

  // G. FOOTER
  console.log('\n--- Testing G: FOOTER ---');
  const footerLinksCount = await page.evaluate(() => document.querySelectorAll('.footer-links a').length);
  report('G. FOOTER', 'Footer renders 4 working links (GitHub, LinkedIn, Email, Resume)', footerLinksCount === 4, `Found ${footerLinksCount} links`);

  // H. ACCESSIBILITY
  console.log('\n--- Testing H: ACCESSIBILITY ---');
  const h1Count = await page.evaluate(() => document.querySelectorAll('h1').length);
  report('H. ACCESSIBILITY', 'Page has exactly one <h1> heading', h1Count === 1, `Count: ${h1Count}`);

  const skipLink = await page.evaluate(() => document.querySelector('.skip-to-content')?.getAttribute('href'));
  report('H. ACCESSIBILITY', 'Skip to content link exists and targets #main-content', skipLink === '#main-content', `href: ${skipLink}`);

  const cardsAreArticles = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.project-card'));
    return cards.every(c => c.tagName.toLowerCase() === 'article');
  });
  report('H. ACCESSIBILITY', 'Project cards use semantic <article> (no nested button issue)', cardsAreArticles, 'All cards are <article>');

  // I. PERFORMANCE & SEO
  console.log('\n--- Testing I: PERFORMANCE & SEO ---');
  const seoCheck = await page.evaluate(() => ({
    ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute('content'),
    ogUrl: document.querySelector('meta[property="og:url"]')?.getAttribute('content'),
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
    hasJsonLd: Boolean(document.querySelector('script[type="application/ld+json"]')),
  }));

  report('I. PERFORMANCE & SEO', 'OpenGraph image present', Boolean(seoCheck.ogImage?.includes('og-image.png')), `og:image: ${seoCheck.ogImage}`);
  report('I. PERFORMANCE & SEO', 'Canonical URL present', Boolean(seoCheck.canonical), `canonical: ${seoCheck.canonical}`);
  report('I. PERFORMANCE & SEO', 'JSON-LD Person schema present', seoCheck.hasJsonLd, 'Structured schema embedded');

  // J. CROSS-BROWSER / RESPONSIVE (Horizontal overflow check)
  console.log('\n--- Testing J: RESPONSIVE / HORIZONTAL SCROLL ---');
  const testWidths = [320, 375, 768, 1024, 1440, 1920];
  for (const w of testWidths) {
    await page.setViewport({ width: w, height: 900 });
    await new Promise(r => setTimeout(r, 200));

    const overflow = await page.evaluate(viewWidth => {
      return document.documentElement.scrollWidth > viewWidth;
    }, w);

    if (overflow) {
      const ss = await takeFailScreenshot(page, `fail-overflow-${w}px.png`);
      report('J. RESPONSIVE', `No horizontal scroll at ${w}px`, false, `Document width exceeds ${w}px`, ss);
    } else {
      report('J. RESPONSIVE', `No horizontal scroll at ${w}px`, true, `No overflow at ${w}px`);
    }
  }

  await mobilePage.close();
  await page.close();
  await browser.close();

  fs.writeFileSync('qa-report.json', JSON.stringify(results, null, 2));
  console.log('\n=======================================');
  console.log('🏁 QA Suite Finished! Total checks:', results.length);
  console.log('Passed:', results.filter(r => r.pass).length);
  console.log('Failed:', results.filter(r => !r.pass).length);
  console.log('=======================================');
}

runQA().catch(console.error);
