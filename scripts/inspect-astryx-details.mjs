import puppeteer from 'puppeteer-core';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outDir = path.resolve(__dirname, '../screenshots/astryx-ref');

async function inspectAstryxDetails() {
  const tmpDir = path.join(os.tmpdir(), `pup_astryx_det_${Date.now()}`);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    userDataDir: tmpDir,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Inspect Themes
  console.log('--- Inspecting Themes ---');
  await page.goto('https://astryx.atmeta.com/themes', { waitUntil: 'networkidle2' });

  const themeTokens = await page.evaluate(() => {
    const body = document.body;

    const bodyStyle = getComputedStyle(body);

    const extracted = {
      lightBg: bodyStyle.backgroundColor,
      textColor: bodyStyle.color,
      fontFamily: bodyStyle.fontFamily,
      fontSize: bodyStyle.fontSize,
      lineHeight: bodyStyle.lineHeight,
    };

    // Find any theme pre/code or table blocks on page
    const codeBlocks = Array.from(document.querySelectorAll('pre, code')).map(c => c.innerText.slice(0, 500));

    return { extracted, codeBlocks: codeBlocks.slice(0, 10) };
  });

  console.log('Themes inspected:', themeTokens.extracted);
  console.log('Sample code blocks from themes:', themeTokens.codeBlocks.slice(0, 3));

  // 2. Inspect Button variants on https://astryx.atmeta.com/components/Button
  console.log('\n--- Inspecting Button Variants ---');
  await page.goto('https://astryx.atmeta.com/components/Button', { waitUntil: 'networkidle2' });

  // Find all buttons inside the preview/demo areas
  const buttonSpecs = await page.evaluate(() => {
    const allButtons = Array.from(document.querySelectorAll('button')).map(b => {
      const s = window.getComputedStyle(b);
      return {
        text: b.innerText.trim(),
        ariaLabel: b.getAttribute('aria-label'),
        bg: s.backgroundColor,
        color: s.color,
        borderWidth: s.borderWidth,
        borderColor: s.borderColor,
        borderStyle: s.borderStyle,
        radius: s.borderRadius,
        padding: s.padding,
        fontSize: s.fontSize,
        fontWeight: s.fontWeight,
        height: s.height,
        shadow: s.boxShadow,
        outline: s.outline,
      };
    }).filter(b => b.text && !['Docs', 'Components', 'Templates', 'Themes', 'Playground'].includes(b.text));

    return allButtons;
  });

  console.log('Button samples found:', buttonSpecs.slice(0, 8));

  // 3. Inspect Card on https://astryx.atmeta.com/components/Card
  console.log('\n--- Inspecting Card Specs ---');
  await page.goto('https://astryx.atmeta.com/components/Card', { waitUntil: 'networkidle2' });

  const cardSpecs = await page.evaluate(() => {
    // Find card elements
    const cards = Array.from(document.querySelectorAll('[class*="card"], [class*="Card"], article, [role="region"]')).map(c => {
      const s = window.getComputedStyle(c);
      return {
        tag: c.tagName,
        className: c.className,
        bg: s.backgroundColor,
        border: `${s.borderWidth} ${s.borderStyle} ${s.borderColor}`,
        radius: s.borderRadius,
        shadow: s.boxShadow,
        padding: s.padding,
      };
    });
    return cards.slice(0, 8);
  });

  console.log('Card samples found:', cardSpecs.slice(0, 5));

  // 4. Now toggle theme to LIGHT and DARK on the site to get both values
  console.log('\n--- Toggling Light and Dark Mode on Astryx ---');
  // Find the theme switcher button
  const toggleBtn = await page.$('button[aria-label*="mode"], button[aria-label*="theme"], button[aria-label*="Switch"]');
  if (toggleBtn) {
    console.log('Found theme toggle button!');
    const beforeToggle = await page.evaluate(() => ({
      bg: getComputedStyle(document.body).backgroundColor,
      color: getComputedStyle(document.body).color,
    }));
    console.log('Before toggle:', beforeToggle);

    await toggleBtn.click();
    await new Promise(r => setTimeout(r, 600));

    const afterToggle = await page.evaluate(() => ({
      bg: getComputedStyle(document.body).backgroundColor,
      color: getComputedStyle(document.body).color,
    }));
    console.log('After toggle:', afterToggle);

    await page.screenshot({ path: path.join(outDir, '03-toggled-theme.png') });
  }

  // 5. Inspect input / forms on https://astryx.atmeta.com/components/TextInput
  console.log('\n--- Inspecting TextInput ---');
  try {
    await page.goto('https://astryx.atmeta.com/components/TextInput', { waitUntil: 'networkidle2' });
    const inputSpecs = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input')).map(inp => {
        const s = window.getComputedStyle(inp);
        return {
          placeholder: inp.placeholder,
          bg: s.backgroundColor,
          color: s.color,
          border: `${s.borderWidth} ${s.borderStyle} ${s.borderColor}`,
          radius: s.borderRadius,
          padding: s.padding,
          fontSize: s.fontSize,
          height: s.height,
        };
      });
      return inputs.slice(0, 5);
    });
    console.log('Input samples found:', inputSpecs);
    await page.screenshot({ path: path.join(outDir, '04-textinput.png') });
  } catch (e) {
    console.log('TextInput not found or failed:', e.message);
  }

  // 6. Inspect Tabs on https://astryx.atmeta.com/components/Tabs
  console.log('\n--- Inspecting Tabs ---');
  try {
    await page.goto('https://astryx.atmeta.com/components/Tabs', { waitUntil: 'networkidle2' });
    const tabSpecs = await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('[role="tab"], button[class*="tab"]')).map(t => {
        const s = window.getComputedStyle(t);
        return {
          text: t.innerText.trim(),
          bg: s.backgroundColor,
          color: s.color,
          border: `${s.borderWidth} ${s.borderStyle} ${s.borderColor}`,
          radius: s.borderRadius,
          padding: s.padding,
          fontSize: s.fontSize,
          fontWeight: s.fontWeight,
        };
      });
      return tabs.slice(0, 6);
    });
    console.log('Tab samples found:', tabSpecs);
    await page.screenshot({ path: path.join(outDir, '05-tabs.png') });
  } catch (e) {
    console.log('Tabs not found or failed:', e.message);
  }

  // 7. Inspect Dialog on https://astryx.atmeta.com/components/Dialog
  console.log('\n--- Inspecting Dialog ---');
  try {
    await page.goto('https://astryx.atmeta.com/components/Dialog', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: path.join(outDir, '06-dialog.png') });
  } catch (e) {
    console.log('Dialog failed:', e.message);
  }

  await browser.close();
  console.log('Done inspecting Astryx details.');
}

inspectAstryxDetails().catch(console.error);
