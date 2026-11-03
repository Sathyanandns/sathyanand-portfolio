import lighthouse from 'lighthouse';
import puppeteer from 'puppeteer-core';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';
import os from 'os';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = 'https://sathyanandns.github.io/sathyanand-portfolio/';

async function runBenchmark() {
  console.log('🚀 Running 3 Lighthouse Desktop + 3 Mobile runs on live URL:', TARGET_URL);

  const desktopRuns = [];
  const mobileRuns = [];

  for (let i = 1; i <= 3; i++) {
    console.log(`\n--- Desktop Run ${i} of 3 ---`);
    const tmpDir = path.join(os.tmpdir(), `pup_bench_d_${Date.now()}_${i}`);
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
    };
    console.log(`Desktop Run ${i}:`, scores);
    desktopRuns.push({ scores, audits: res.lhr.audits });
  }

  desktopRuns.sort((a, b) => a.scores.performance - b.scores.performance);
  const medianDesktop = desktopRuns[1];

  for (let i = 1; i <= 3; i++) {
    console.log(`\n--- Mobile Run ${i} of 3 ---`);
    const tmpDir = path.join(os.tmpdir(), `pup_bench_m_${Date.now()}_${i}`);
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
    });

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
    };
    console.log(`Mobile Run ${i}:`, scores);
    mobileRuns.push({ scores, audits: res.lhr.audits });
  }

  mobileRuns.sort((a, b) => a.scores.performance - b.scores.performance);
  const medianMobile = mobileRuns[1];

  console.log('\n=======================================');
  console.log('🎯 Final Median Desktop Scores:');
  console.log(JSON.stringify(medianDesktop.scores, null, 2));
  console.log('=======================================');

  console.log('\n=======================================');
  console.log('🎯 Final Median Mobile Scores:');
  console.log(JSON.stringify(medianMobile.scores, null, 2));
  console.log('=======================================');
}

runBenchmark().catch(console.error);
