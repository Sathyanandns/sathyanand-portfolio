import lighthouse from 'lighthouse';
import puppeteer from 'puppeteer-core';
import { spawn } from 'child_process';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = process.env.DIAG_URL || 'http://localhost:4173/sathyanand-portfolio/';

async function diagnose() {
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

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const endpoint = new URL(browser.wsEndpoint());
    const res = await lighthouse(TARGET_URL, {
      port: endpoint.port,
      output: 'json',
      logLevel: 'error',
      onlyCategories: ['accessibility'],
    });

    const score = Math.round(res.lhr.categories.accessibility.score * 100);
    console.log(`🎯 Accessibility Score: ${score}/100`);

    const audits = res.lhr.categories.accessibility.auditRefs;
    for (const ref of audits) {
      const audit = res.lhr.audits[ref.id];
      if (audit.score !== null && audit.score < 1) {
        console.log('FAILING AUDIT:', ref.id, audit.title, audit.description);
        console.log('Details:', JSON.stringify(audit.details ? audit.details.items : audit.explanation, null, 2));
      }
    }
  } finally {
    await browser.close();
    if (preview) preview.kill();
  }
}

diagnose().catch(console.error);

