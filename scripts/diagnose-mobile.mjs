import lighthouse from 'lighthouse';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = 'https://sathyanandns.github.io/sathyanand-portfolio/';

async function diagnoseMobile() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const endpoint = new URL(browser.wsEndpoint());
  const res = await lighthouse(TARGET_URL, {
    port: endpoint.port,
    output: 'json',
    logLevel: 'error',
    onlyCategories: ['performance'],
    formFactor: 'mobile',
  });

  await browser.close();

  console.log('Mobile Performance Score:', Math.round(res.lhr.categories.performance.score * 100));
  console.log('FCP:', res.lhr.audits['first-contentful-paint'].displayValue);
  console.log('LCP:', res.lhr.audits['largest-contentful-paint'].displayValue);
  console.log('TBT:', res.lhr.audits['total-blocking-time'].displayValue);
  console.log('CLS:', res.lhr.audits['cumulative-layout-shift'].displayValue);
  console.log('Speed Index:', res.lhr.audits['speed-index'].displayValue);
  console.log('LCP Element:', res.lhr.audits['largest-contentful-paint-element']?.details?.items?.[0]?.node?.snippet);

  const audits = res.lhr.categories.performance.auditRefs;
  for (const ref of audits) {
    const audit = res.lhr.audits[ref.id];
    if (audit.details && audit.details.type === 'opportunity' && audit.numericValue > 100) {
      console.log(`Opportunity: ${audit.title} - ${audit.displayValue}`);
    }
  }
}

diagnoseMobile().catch(console.error);
