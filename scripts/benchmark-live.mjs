import lighthouse from 'lighthouse';
import puppeteer from 'puppeteer-core';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';
import os from 'os';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = 'https://sathyanandns.github.io/sathyanand-portfolio/';

async function runDesktopLighthouse() {
  console.log('🚀 Running 3 Lighthouse desktop runs on live URL:', TARGET_URL);

  const runs = [];

  for (let i = 1; i <= 3; i++) {
    console.log(`\n--- Run ${i} of 3 ---`);
    const tmpDir = path.join(os.tmpdir(), `pup_bench_${Date.now()}_${i}`);
    const browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: true,
      userDataDir: tmpDir,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const endpoint = new URL(browser.wsEndpoint());
    const port = endpoint.port;

    const res = await lighthouse(TARGET_URL, {
      port,
      output: 'json',
      logLevel: 'error',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    }, desktopConfig);

    await browser.close();

    const scores = {
      performance: Math.round(res.lhr.categories.performance.score * 100),
      accessibility: Math.round(res.lhr.categories.accessibility.score * 100),
      bestPractices: Math.round(res.lhr.categories['best-practices'].score * 100),
      seo: Math.round(res.lhr.categories.seo.score * 100),
      fcp: res.lhr.audits['first-contentful-paint'].displayValue,
      lcp: res.lhr.audits['largest-contentful-paint'].displayValue,
      tbt: res.lhr.audits['total-blocking-time'].displayValue,
      cls: res.lhr.audits['cumulative-layout-shift'].displayValue,
      speedIndex: res.lhr.audits['speed-index'].displayValue,
    };

    console.log(`Run ${i} Scores:`, scores);
    runs.push({ scores, audits: res.lhr.audits });
  }

  // Median run (sorted by performance)
  runs.sort((a, b) => a.scores.performance - b.scores.performance);
  const medianRun = runs[1];

  console.log('\n=======================================');
  console.log('🎯 Median Run Scores:');
  console.log(JSON.stringify(medianRun.scores, null, 2));
  console.log('=======================================');

  // Extract top opportunities from median run
  const audits = medianRun.audits;
  const opps = Object.values(audits)
    .filter(a => a.details && a.details.type === 'opportunity' && a.score !== null && a.score < 1)
    .map(a => ({
      id: a.id,
      title: a.title,
      score: a.score,
      displayValue: a.displayValue,
      overallSavingsMs: a.details.overallSavingsMs,
    }))
    .sort((a, b) => (b.overallSavingsMs || 0) - (a.overallSavingsMs || 0));

  console.log('\nTop Opportunities:');
  if (opps.length === 0) {
    console.log('No performance opportunities found! All performance audits passed with maximum score.');
  } else {
    opps.slice(0, 5).forEach((o, idx) => {
      console.log(`${idx + 1}. [${o.id}] ${o.title}: ${o.displayValue || ''} (${o.overallSavingsMs || 0}ms savings)`);
    });
  }
}

runDesktopLighthouse().catch(console.error);
