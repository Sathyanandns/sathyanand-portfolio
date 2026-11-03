import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import os from 'os';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const resumeHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Sathyanand N S - Resume</title>
  <style>
    @page {
      size: A4;
      margin: 0;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      width: 210mm;
      height: 297mm;
      max-height: 297mm;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #1e293b;
      background: #ffffff;
      padding: 9.5mm 13.5mm 8.5mm 13.5mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      -webkit-font-smoothing: antialiased;
    }
    
    /* Header */
    .header {
      text-align: center;
      margin-bottom: 7px;
    }
    .name {
      font-size: 21pt;
      font-weight: 800;
      letter-spacing: -0.3px;
      color: #0f172a;
      line-height: 1.1;
      text-transform: uppercase;
    }
    .title {
      font-size: 10.5pt;
      font-weight: 600;
      color: #0284c7;
      letter-spacing: 0.8px;
      margin-top: 2.5px;
      margin-bottom: 3.5px;
    }
    .contact-row {
      font-size: 8.4pt;
      color: #475569;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      gap: 5px;
    }
    .contact-row a {
      color: #334155;
      text-decoration: none;
      transition: color 0.15s;
    }
    .contact-row a:hover {
      color: #0284c7;
      text-decoration: underline;
    }
    .separator {
      color: #94a3b8;
    }

    /* Section Styles */
    .section {
      margin-top: 5px;
    }
    .section-title {
      font-size: 8.8pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #0f172a;
      border-bottom: 1.5px solid #0284c7;
      padding-bottom: 1.5px;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* Professional Summary */
    .summary-text {
      font-size: 8.15pt;
      line-height: 1.34;
      color: #334155;
      text-align: justify;
    }

    /* Experience & Education Item */
    .entry {
      margin-bottom: 3px;
    }
    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-size: 8.35pt;
      line-height: 1.25;
    }
    .entry-role {
      font-weight: 700;
      color: #0f172a;
    }
    .entry-org {
      font-weight: 500;
      color: #334155;
    }
    .entry-date {
      font-weight: 600;
      font-size: 8pt;
      color: #0284c7;
      white-space: nowrap;
      text-align: right;
    }
    .bullet-list {
      margin-left: 14px;
      margin-top: 1.5px;
      font-size: 8.05pt;
      line-height: 1.3;
      color: #334155;
    }
    .bullet-list li {
      margin-bottom: 1px;
    }

    /* Skills Grid */
    .skills-block {
      font-size: 8.05pt;
      line-height: 1.32;
      color: #334155;
    }
    .skill-line {
      margin-bottom: 2px;
    }
    .skill-label {
      font-weight: 700;
      color: #0f172a;
    }

    /* Projects */
    .projects-list {
      display: flex;
      flex-direction: column;
      gap: 2.8px;
    }
    .project-item {
      font-size: 7.95pt;
      line-height: 1.28;
      color: #334155;
    }
    .project-name {
      font-weight: 700;
      color: #0f172a;
    }

    /* Core Competencies & Languages */
    .competencies-text {
      font-size: 8.05pt;
      line-height: 1.32;
      color: #334155;
      margin-bottom: 1.5px;
    }

    /* Footer */
    .footer {
      text-align: center;
      font-size: 6.8pt;
      color: #94a3b8;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      padding-top: 3px;
    }
  </style>
</head>
<body>
  <div>
    <!-- Header -->
    <header class="header">
      <h1 class="name">Sathyanand N S</h1>
      <div class="title">Machine Learning &amp; Cloud Computing Engineer</div>
      <div class="contact-row">
        <span>Coimbatore, Tamil Nadu</span>
        <span class="separator">|</span>
        <a href="tel:+919952526732">+91 99525 26732</a>
        <span class="separator">|</span>
        <a href="mailto:sathyanandns0342@gmail.com">sathyanandns0342@gmail.com</a>
        <span class="separator">|</span>
        <a href="https://github.com/Sathyanandns" target="_blank" rel="noopener noreferrer">github.com/Sathyanandns</a>
        <span class="separator">|</span>
        <a href="https://sathyanandns.github.io/sathyanand-portfolio" target="_blank" rel="noopener noreferrer">sathyanandns.github.io/sathyanand-portfolio</a>
      </div>
    </header>

    <!-- Professional Summary -->
    <section class="section">
      <h2 class="section-title">Professional Summary</h2>
      <p class="summary-text">
        Computer Science postgraduate with hands-on experience in Machine Learning, AWS Cloud Computing and data processing, plus a completed 3-month internship as a Project Associate Intern at Goat Robotics Pvt. Ltd., Coimbatore. Skilled in Python, ML workflows, Flask APIs, local LLM integration, and AWS services including EC2, S3, and IAM. Eager to contribute to practical engineering and technology projects.
      </p>
    </section>

    <!-- Experience -->
    <section class="section">
      <h2 class="section-title">Experience</h2>
      <div class="entry">
        <div class="entry-header">
          <div>
            <span class="entry-role">Project Associate Intern</span>
            <span class="entry-org"> — Goat Robotics Pvt. Ltd., Coimbatore</span>
          </div>
          <div class="entry-date">14 July 2026 – 31 October 2026 | 3-month internship</div>
        </div>
        <ul class="bullet-list">
          <li>Successfully completed a 3-month internship program and contributed to assigned tasks with dedication and sincerity.</li>
          <li>Demonstrated initiative, professionalism, and a positive attitude throughout the internship.</li>
        </ul>
      </div>
    </section>

    <!-- Education -->
    <section class="section">
      <h2 class="section-title">Education</h2>
      <div class="entry">
        <div class="entry-header">
          <div>
            <span class="entry-role">Master of Computer Applications (MCA)</span>
            <span class="entry-org"> — KGISL Institute of Information Management, Coimbatore</span>
          </div>
          <div class="entry-date">(2023–2025)</div>
        </div>
      </div>
      <div class="entry">
        <div class="entry-header">
          <div>
            <span class="entry-role">B.Sc. Computer Science</span>
            <span class="entry-org"> — KG Arts and Science College, Coimbatore</span>
          </div>
          <div class="entry-date">(2020–2023)</div>
        </div>
      </div>
    </section>

    <!-- Technical Skills -->
    <section class="section">
      <h2 class="section-title">Technical Skills</h2>
      <div class="skills-block">
        <div class="skill-line">
          <span class="skill-label">Programming:</span> Python, JavaScript <span class="separator">|</span> <span class="skill-label">ML / Data:</span> Supervised Classification, Scikit-learn, XGBoost, Random Forest, SVM, Pandas, NumPy, Feature Engineering, Basic NLP
        </div>
        <div class="skill-line">
          <span class="skill-label">AWS:</span> EC2, S3, IAM, SageMaker, Static Website Hosting <span class="separator">|</span> <span class="skill-label">Backend &amp; Integration:</span> Flask, REST APIs, JSON-RPC / XML-RPC, PostgreSQL, Odoo ERP
        </div>
        <div class="skill-line">
          <span class="skill-label">AI / Frontend:</span> Ollama (local LLMs), React, Vite, Tailwind CSS <span class="separator">|</span> <span class="skill-label">Tools:</span> Git, GitHub, Visual Studio Code, Excel
        </div>
        <div class="skill-line">
          <span class="skill-label">OS &amp; Networking:</span> Linux (Ubuntu/CentOS), TCP/IP and DNS Fundamentals
        </div>
      </div>
    </section>

    <!-- Projects -->
    <section class="section">
      <h2 class="section-title">Projects</h2>
      <div class="projects-list">
        <div class="project-item">
          <span class="project-name">Phishing Website Detection System:</span> End-to-end ML system that extracts URL features and classifies sites as legitimate or phishing using XGBoost, Random Forest and SVM; served via a Flask REST API, web interface and Chrome extension. Achieved 99.57% accuracy on the project's test dataset.
        </div>
        <div class="project-item">
          <span class="project-name">ML Model Deployment on AWS:</span> Built a binary classification model with scikit-learn and deployed it on EC2 as a REST-accessible service; used S3 for model artefact storage and IAM instance roles.
        </div>
        <div class="project-item">
          <span class="project-name">Odoo Local LLM Assistant:</span> Local assistant (Ollama, Llama 3.1) that turns natural-language questions into validated read-only PostgreSQL queries or Odoo XML-RPC calls and summarises results, keeping enterprise data fully local.
        </div>
        <div class="project-item">
          <span class="project-name">Project Monitor &amp; EVM Dashboard:</span> Flask-based dashboard that processes Excel project timelines and computes Earned Value Management metrics, with Gantt views, milestone tracking, planned-vs-actual progress and a multi-project master dashboard.
        </div>
        <div class="project-item">
          <span class="project-name">Cloud-Based Data Processing Pipeline:</span> Designed a Python ETL pipeline for data ingestion, cleaning and preprocessing, with outputs stored in S3 and scheduled execution, reducing repetitive manual work.
        </div>
        <div class="project-item">
          <span class="project-name">Odoo API Automation Task:</span> Defensive Python module for automating Odoo ERP via REST/JSON-RPC, with error handling and fallbacks for local and live environments.
        </div>
        <div class="project-item">
          <span class="project-name">NEXUS AI – Autonomous AI &amp; Data Platform:</span> Responsive frontend for an AI deployment platform built with React, Vite and Tailwind CSS using a component-based architecture.
        </div>
        <div class="project-item">
          <span class="project-name">Static Website Hosting on AWS S3:</span> Configured static hosting with custom error pages and bucket access policies.
        </div>
        <div class="project-item">
          <span class="project-name">IAM-Based Access Control:</span> Configured IAM users, groups, roles, and least-privilege policies for EC2 and S3.
        </div>
        <div class="project-item">
          <span class="project-name">NLP Text Classification:</span> Built a text classification pipeline using tokenisation, stop-word removal, TF-IDF, model training, and precision/recall/F1 evaluation.
        </div>
      </div>
    </section>

    <!-- Core Competencies & Languages -->
    <section class="section">
      <h2 class="section-title">Core Competencies &amp; Languages</h2>
      <div class="competencies-text">
        Problem Solving · Analytical Thinking · Teamwork &amp; Collaboration · Communication · Adaptability · Time Management
      </div>
      <div class="competencies-text">
        <strong>Languages:</strong> Tamil (Native) · English (Professional) · Telugu (Conversational)
      </div>
    </section>
  </div>

  <!-- Footer -->
  <footer class="footer">
    Sathyanand N S | Resume
  </footer>
</body>
</html>
`;

async function generateResume() {
  console.log('📄 Generating polished PDF resume...');
  const tmpDir = path.join(os.tmpdir(), `pup_res_${Date.now()}`);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    userDataDir: tmpDir,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setContent(resumeHtml, { waitUntil: 'networkidle0' });

  // Generate PDF
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: 0, bottom: 0, left: 0, right: 0 }
  });

  const targetPdf = path.join('public', 'Sathyanand_NS_Resume.pdf');
  fs.writeFileSync(targetPdf, pdfBuffer);
  console.log(`✅ Saved PDF to ${targetPdf} (${pdfBuffer.length} bytes)`);

  // Verify page count using pdf.js in a new page
  const b64 = Buffer.from(pdfBuffer).toString('base64');
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
        <style>body { margin: 0; background: #fff; }</style>
      </head>
      <body>
        <canvas id="canvas"></canvas>
        <script>
          const raw = atob('${b64}');
          const uint8 = new Uint8Array(raw.length);
          for (let i = 0; i < raw.length; i++) uint8[i] = raw.charCodeAt(i);
          pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          pdfjsLib.getDocument({ data: uint8 }).promise.then(async pdf => {
            window.pageCount = pdf.numPages;
            const p = await pdf.getPage(1);
            const viewport = p.getViewport({ scale: 2.0 });
            const canvas = document.getElementById('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const ctx = canvas.getContext('2d');
            await p.render({ canvasContext: ctx, viewport }).promise;
            window.rendered = true;
          });
        </script>
      </body>
    </html>
  `);

  await page.waitForFunction(() => window.rendered === true, { timeout: 15000 });
  const pageCount = await page.evaluate(() => window.pageCount);
  console.log(`📑 Total PDF Page Count: ${pageCount}`);

  if (pageCount !== 1) {
    console.error(`❌ FAILED: Expected 1 page but got ${pageCount} pages!`);
  } else {
    console.log('🎯 SUCCESS: Exactly 1 Page!');
  }

  // Screenshot canvas to screenshots/after/resume-after.png
  fs.mkdirSync('screenshots/after', { recursive: true });
  const canvas = await page.$('#canvas');
  await canvas.screenshot({ path: 'screenshots/after/resume-after.png' });
  console.log('🖼️ Saved screenshots/after/resume-after.png');

  await browser.close();
}

generateResume().catch(console.error);
