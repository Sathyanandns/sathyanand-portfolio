import lighthouse from 'lighthouse';
import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = 'https://sathyanandns.github.io/sathyanand-portfolio/';

async function runLighthouseAudit() {
  console.log('Running Lighthouse Audit on:', TARGET_URL);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const endpoint = new URL(browser.wsEndpoint());
  const port = endpoint.port;

  // 1. Desktop Audit
  console.log('Running Desktop Audit...');
  const desktopResult = await lighthouse(TARGET_URL, {
    port,
    output: 'json',
    logLevel: 'error',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    formFactor: 'desktop',
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false,
    },
  });

  // 2. Mobile Audit
  console.log('Running Mobile Audit...');
  const mobileResult = await lighthouse(TARGET_URL, {
    port,
    output: 'json',
    logLevel: 'error',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    formFactor: 'mobile',
  });

  await browser.close();

  const desktopScores = {
    performance: Math.round(desktopResult.lhr.categories.performance.score * 100),
    accessibility: Math.round(desktopResult.lhr.categories.accessibility.score * 100),
    bestPractices: Math.round(desktopResult.lhr.categories['best-practices'].score * 100),
    seo: Math.round(desktopResult.lhr.categories.seo.score * 100),
  };

  const mobileScores = {
    performance: Math.round(mobileResult.lhr.categories.performance.score * 100),
    accessibility: Math.round(mobileResult.lhr.categories.accessibility.score * 100),
    bestPractices: Math.round(mobileResult.lhr.categories['best-practices'].score * 100),
    seo: Math.round(mobileResult.lhr.categories.seo.score * 100),
  };

  const report = { desktopScores, mobileScores };
  fs.writeFileSync('lighthouse-report.json', JSON.stringify(report, null, 2));

  console.log('\n📊 Lighthouse Scores:');
  console.log('Desktop:', desktopScores);
  console.log('Mobile:', mobileScores);
}

runLighthouseAudit().catch(console.error);
