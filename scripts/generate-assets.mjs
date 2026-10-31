import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('public');
const imagesDir = path.join(publicDir, 'images');
const projectsDir = path.join(imagesDir, 'projects');

if (!fs.existsSync(projectsDir)) {
  fs.mkdirSync(projectsDir, { recursive: true });
}

async function convertJpgsToWebp() {
  const files = ['sathyanand-hero', 'sathyanand-about', 'sathyanand-profile'];
  for (const name of files) {
    const src = path.join(imagesDir, `${name}.jpg`);
    const dest = path.join(imagesDir, `${name}.webp`);
    if (fs.existsSync(src)) {
      await sharp(src)
        .webp({ quality: 85 })
        .toFile(dest);
      const originalSize = fs.statSync(src).size;
      const newSize = fs.statSync(dest).size;
      console.log(`Converted ${name}.jpg (${(originalSize/1024).toFixed(1)} KB) -> ${name}.webp (${(newSize/1024).toFixed(1)} KB)`);
    }
  }
}

async function generateArchitectureImages() {
  // 1. Phishing Detection Architecture
  const phishingSvg = `
  <svg width="800" height="450" viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a" />
        <stop offset="100%" stop-color="#1e293b" />
      </linearGradient>
      <linearGradient id="primary" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#3b82f6" />
        <stop offset="100%" stop-color="#1d4ed8" />
      </linearGradient>
      <linearGradient id="cyan" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#06b6d4" />
        <stop offset="100%" stop-color="#0284c7" />
      </linearGradient>
      <linearGradient id="purple" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#8b5cf6" />
        <stop offset="100%" stop-color="#6d28d9" />
      </linearGradient>
      <linearGradient id="green" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#10b981" />
        <stop offset="100%" stop-color="#059669" />
      </linearGradient>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.3"/>
      </filter>
    </defs>

    <rect width="800" height="450" rx="16" fill="url(#bg)"/>
    <rect x="1" y="1" width="798" height="448" rx="15" fill="none" stroke="#334155" stroke-width="2"/>

    <!-- Header -->
    <text x="40" y="55" font-family="Inter, sans-serif" font-weight="700" font-size="22" fill="#f8fafc">Phishing Website Detection System</text>
    <text x="40" y="80" font-family="Inter, sans-serif" font-size="13" fill="#94a3b8">End-to-End URL Safety &amp; Machine Learning Inference Pipeline</text>

    <!-- Accuracy Tag -->
    <rect x="630" y="35" width="130" height="36" rx="18" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" stroke-width="1.5"/>
    <text x="695" y="58" font-family="JetBrains Mono, monospace" font-weight="700" font-size="14" fill="#34d399" text-anchor="middle">99.57% Acc</text>

    <!-- Step 1: Input -->
    <g transform="translate(40, 130)" filter="url(#shadow)">
      <rect width="180" height="110" rx="12" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5"/>
      <rect x="12" y="12" width="32" height="32" rx="6" fill="url(#primary)"/>
      <text x="28" y="34" font-family="Inter, sans-serif" font-weight="700" font-size="14" fill="#fff" text-anchor="middle">1</text>
      <text x="54" y="33" font-family="Inter, sans-serif" font-weight="600" font-size="15" fill="#f8fafc">URL Input</text>
      <text x="16" y="68" font-family="Inter, sans-serif" font-size="11" fill="#94a3b8">• Chrome Extension</text>
      <text x="16" y="88" font-family="Inter, sans-serif" font-size="11" fill="#94a3b8">• Web REST Endpoint</text>
    </g>

    <!-- Arrow 1 -->
    <path d="M 230 185 L 280 185" stroke="#3b82f6" stroke-width="2.5" stroke-dasharray="4,4" marker-end="url(#arrow)"/>
    <polygon points="280,185 272,180 272,190" fill="#3b82f6"/>

    <!-- Step 2: Feature Extraction -->
    <g transform="translate(290, 130)" filter="url(#shadow)">
      <rect width="210" height="110" rx="12" fill="#1e293b" stroke="#06b6d4" stroke-width="1.5"/>
      <rect x="12" y="12" width="32" height="32" rx="6" fill="url(#cyan)"/>
      <text x="28" y="34" font-family="Inter, sans-serif" font-weight="700" font-size="14" fill="#fff" text-anchor="middle">2</text>
      <text x="54" y="33" font-family="Inter, sans-serif" font-weight="600" font-size="15" fill="#f8fafc">Feature Extraction</text>
      <text x="16" y="68" font-family="Inter, sans-serif" font-size="11" fill="#94a3b8">• Lexical &amp; URL Length</text>
      <text x="16" y="88" font-family="Inter, sans-serif" font-size="11" fill="#94a3b8">• SSL / DNS / Subdomains</text>
      <text x="16" y="104" font-family="Inter, sans-serif" font-size="10" fill="#64748b">(30 distinct features)</text>
    </g>

    <!-- Arrow 2 -->
    <path d="M 510 185 L 560 185" stroke="#06b6d4" stroke-width="2.5" stroke-dasharray="4,4"/>
    <polygon points="560,185 552,180 552,190" fill="#06b6d4"/>

    <!-- Step 3: ML Inference -->
    <g transform="translate(570, 130)" filter="url(#shadow)">
      <rect width="190" height="110" rx="12" fill="#1e293b" stroke="#8b5cf6" stroke-width="1.5"/>
      <rect x="12" y="12" width="32" height="32" rx="6" fill="url(#purple)"/>
      <text x="28" y="34" font-family="Inter, sans-serif" font-weight="700" font-size="14" fill="#fff" text-anchor="middle">3</text>
      <text x="54" y="33" font-family="Inter, sans-serif" font-weight="600" font-size="15" fill="#f8fafc">ML Ensemble</text>
      <text x="16" y="68" font-family="Inter, sans-serif" font-size="11" fill="#94a3b8">• XGBoost / Random Forest</text>
      <text x="16" y="88" font-family="Inter, sans-serif" font-size="11" fill="#94a3b8">• Pre-trained Scikit Model</text>
    </g>

    <!-- Bottom Flow: Result & Action -->
    <g transform="translate(40, 275)" filter="url(#shadow)">
      <rect width="720" height="135" rx="12" fill="#162032" stroke="#334155" stroke-width="1"/>
      <text x="20" y="35" font-family="Inter, sans-serif" font-weight="600" font-size="14" fill="#38bdf8">Inference &amp; Response Layer</text>

      <rect x="20" y="55" width="210" height="60" rx="8" fill="#1e293b" stroke="#334155"/>
      <text x="35" y="80" font-family="JetBrains Mono, monospace" font-size="12" fill="#f8fafc">Flask REST Backend</text>
      <text x="35" y="100" font-family="Inter, sans-serif" font-size="11" fill="#94a3b8">Sub-50ms Response Time</text>

      <rect x="255" y="55" width="220" height="60" rx="8" fill="#1e293b" stroke="#334155"/>
      <text x="270" y="80" font-family="JetBrains Mono, monospace" font-size="12" fill="#f8fafc">Validation &amp; Metrics</text>
      <text x="270" y="100" font-family="Inter, sans-serif" font-size="11" fill="#94a3b8">99.4% Precision / 99.7% Recall</text>

      <rect x="500" y="55" width="200" height="60" rx="8" fill="#1e293b" stroke="#10b981" stroke-width="1.2"/>
      <text x="515" y="80" font-family="JetBrains Mono, monospace" font-size="12" fill="#34d399">Real-Time Safe / Phish</text>
      <text x="515" y="100" font-family="Inter, sans-serif" font-size="11" fill="#94a3b8">Browser Alert Notification</text>
    </g>
  </svg>
  `;

  // 2. AWS ML Deployment Architecture
  const awsSvg = `
  <svg width="800" height="450" viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0a101f" />
        <stop offset="100%" stop-color="#162238" />
      </linearGradient>
      <linearGradient id="orange" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f97316" />
        <stop offset="100%" stop-color="#ea580c" />
      </linearGradient>
      <linearGradient id="awsBlue" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#38bdf8" />
        <stop offset="100%" stop-color="#0284c7" />
      </linearGradient>
      <filter id="shadow2" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.35"/>
      </filter>
    </defs>

    <rect width="800" height="450" rx="16" fill="url(#bg2)"/>
    <rect x="1" y="1" width="798" height="448" rx="15" fill="none" stroke="#253550" stroke-width="2"/>

    <!-- Header -->
    <text x="40" y="55" font-family="Inter, sans-serif" font-weight="700" font-size="22" fill="#f8fafc">ML Model Deployment on AWS</text>
    <text x="40" y="80" font-family="Inter, sans-serif" font-size="13" fill="#94a3b8">Scalable Cloud Architecture: EC2 Compute, S3 Artifact Storage, IAM Security</text>

    <!-- Cloud Boundary Box -->
    <rect x="40" y="110" width="720" height="300" rx="14" fill="#0f192b" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="6,4"/>
    <text x="60" y="135" font-family="JetBrains Mono, monospace" font-size="12" fill="#38bdf8">AWS Cloud Infrastructure (VPC)</text>

    <!-- Client / Traffic -->
    <g transform="translate(60, 170)" filter="url(#shadow2)">
      <rect width="130" height="100" rx="10" fill="#1e2c44" stroke="#64748b"/>
      <text x="65" y="38" font-family="Inter, sans-serif" font-weight="600" font-size="14" fill="#f8fafc" text-anchor="middle">Client App</text>
      <text x="65" y="65" font-family="Inter, sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">HTTPS / REST</text>
      <text x="65" y="82" font-family="Inter, sans-serif" font-size="10" fill="#64748b" text-anchor="middle">JSON Payload</text>
    </g>

    <!-- Arrow -->
    <path d="M 200 220 L 260 220" stroke="#f97316" stroke-width="2" marker-end="url(#arr)"/>
    <polygon points="260,220 252,215 252,225" fill="#f97316"/>

    <!-- EC2 Compute -->
    <g transform="translate(270, 160)" filter="url(#shadow2)">
      <rect width="230" height="130" rx="12" fill="#1e2c44" stroke="#f97316" stroke-width="1.8"/>
      <rect x="14" y="14" width="30" height="30" rx="6" fill="url(#orange)"/>
      <text x="29" y="35" font-family="Inter, sans-serif" font-weight="700" font-size="13" fill="#fff" text-anchor="middle">EC2</text>
      <text x="56" y="34" font-family="Inter, sans-serif" font-weight="600" font-size="15" fill="#f8fafc">AWS EC2 Instance</text>
      <text x="18" y="72" font-family="Inter, sans-serif" font-size="11" fill="#cbd5e1">• Flask REST Prediction Service</text>
      <text x="18" y="92" font-family="Inter, sans-serif" font-size="11" fill="#cbd5e1">• Gunicorn + Nginx Proxy</text>
      <text x="18" y="112" font-family="Inter, sans-serif" font-size="11" fill="#cbd5e1">• Systemd Daemon Auto-restart</text>
    </g>

    <!-- Bi-directional connection to S3 -->
    <path d="M 510 220 L 560 220" stroke="#38bdf8" stroke-width="2"/>
    <polygon points="560,220 552,215 552,225" fill="#38bdf8"/>

    <!-- S3 Storage -->
    <g transform="translate(570, 160)" filter="url(#shadow2)">
      <rect width="170" height="130" rx="12" fill="#1e2c44" stroke="#38bdf8" stroke-width="1.5"/>
      <rect x="14" y="14" width="30" height="30" rx="6" fill="url(#awsBlue)"/>
      <text x="29" y="35" font-family="Inter, sans-serif" font-weight="700" font-size="13" fill="#fff" text-anchor="middle">S3</text>
      <text x="54" y="34" font-family="Inter, sans-serif" font-weight="600" font-size="15" fill="#f8fafc">Amazon S3</text>
      <text x="16" y="72" font-family="Inter, sans-serif" font-size="11" fill="#cbd5e1">• Model Artifacts</text>
      <text x="16" y="92" font-family="Inter, sans-serif" font-size="11" fill="#cbd5e1">• Versioned Joblib</text>
      <text x="16" y="112" font-family="Inter, sans-serif" font-size="11" fill="#cbd5e1">• Encrypted at Rest</text>
    </g>

    <!-- IAM Security Layer Bottom -->
    <g transform="translate(60, 315)">
      <rect width="680" height="75" rx="8" fill="#142137" stroke="#475569" stroke-width="1"/>
      <text x="20" y="28" font-family="JetBrains Mono, monospace" font-size="12" fill="#fbbf24">🔒 AWS IAM &amp; Security Layer</text>
      <text x="20" y="52" font-family="Inter, sans-serif" font-size="11" fill="#94a3b8">
        Least-privilege EC2 Role with s3:GetObject only • Scoped Security Groups (Port 80/443 strictly) • CloudWatch Logs
      </text>
    </g>
  </svg>
  `;

  fs.writeFileSync(path.join(projectsDir, 'phishing-detection-arch.svg'), phishingSvg);
  fs.writeFileSync(path.join(projectsDir, 'ml-aws-deployment-arch.svg'), awsSvg);

  await sharp(Buffer.from(phishingSvg))
    .webp({ quality: 90 })
    .toFile(path.join(projectsDir, 'phishing-detection-arch.webp'));

  await sharp(Buffer.from(awsSvg))
    .webp({ quality: 90 })
    .toFile(path.join(projectsDir, 'ml-aws-deployment-arch.webp'));

  console.log('Generated architecture diagrams in SVG and WebP format');
}

async function generateOgImage() {
  const ogSvg = `
  <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="ogbg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0b1120" />
        <stop offset="50%" stop-color="#0f172a" />
        <stop offset="100%" stop-color="#1e1b4b" />
      </linearGradient>
      <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#60a5fa" />
        <stop offset="100%" stop-color="#a855f7" />
      </linearGradient>
      <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="rgba(59, 130, 246, 0.2)" />
        <stop offset="100%" stop-color="rgba(147, 51, 234, 0.2)" />
      </linearGradient>
    </defs>

    <rect width="1200" height="630" fill="url(#ogbg)" />

    <!-- Decorative grid lines -->
    <g stroke="rgba(255,255,255,0.04)" stroke-width="1">
      <line x1="0" y1="100" x2="1200" y2="100" />
      <line x1="0" y1="200" x2="1200" y2="200" />
      <line x1="0" y1="300" x2="1200" y2="300" />
      <line x1="0" y1="400" x2="1200" y2="400" />
      <line x1="0" y1="500" x2="1200" y2="500" />
      <line x1="200" y1="0" x2="200" y2="630" />
      <line x1="400" y1="0" x2="400" y2="630" />
      <line x1="600" y1="0" x2="600" y2="630" />
      <line x1="800" y1="0" x2="800" y2="630" />
      <line x1="1000" y1="0" x2="1000" y2="630" />
    </g>

    <!-- Glow Orbs -->
    <circle cx="950" cy="200" r="260" fill="#3b82f6" opacity="0.12" filter="blur(80px)" />
    <circle cx="200" cy="500" r="220" fill="#a855f7" opacity="0.1" filter="blur(80px)" />

    <!-- Outer card border -->
    <rect x="50" y="50" width="1100" height="530" rx="24" fill="rgba(15, 23, 42, 0.6)" stroke="rgba(255, 255, 255, 0.1)" stroke-width="1.5" />

    <!-- Status pill -->
    <rect x="90" y="100" width="460" height="38" rx="19" fill="url(#badgeGrad)" stroke="rgba(59, 130, 246, 0.4)" stroke-width="1" />
    <circle cx="112" cy="119" r="6" fill="#22c55e" />
    <text x="130" y="125" font-family="JetBrains Mono, monospace" font-size="14" fill="#93c5fd" font-weight="600">
      Incoming AI Cloud Engineer • Starting Nov 2025
    </text>

    <!-- Name & Title -->
    <text x="90" y="220" font-family="Inter, sans-serif" font-weight="900" font-size="64" fill="#ffffff" letter-spacing="-1.5">
      Sathyanand N S
    </text>

    <text x="90" y="280" font-family="Inter, sans-serif" font-weight="700" font-size="32" fill="url(#textGrad)">
      Machine Learning &amp; Cloud Computing Engineer
    </text>

    <text x="90" y="340" font-family="Inter, sans-serif" font-size="20" fill="#94a3b8" width="700">
      Building scalable AI systems, AWS cloud architectures, data pipelines &amp; automation.
    </text>

    <!-- Skills Badges -->
    <g transform="translate(90, 410)">
      <rect x="0" y="0" width="130" height="42" rx="10" fill="#1e293b" stroke="#334155" />
      <text x="65" y="27" font-family="Inter, sans-serif" font-weight="600" font-size="16" fill="#38bdf8" text-anchor="middle">Python</text>

      <rect x="145" y="0" width="190" height="42" rx="10" fill="#1e293b" stroke="#334155" />
      <text x="240" y="27" font-family="Inter, sans-serif" font-weight="600" font-size="16" fill="#a78bfa" text-anchor="middle">Machine Learning</text>

      <rect x="350" y="0" width="150" height="42" rx="10" fill="#1e293b" stroke="#334155" />
      <text x="425" y="27" font-family="Inter, sans-serif" font-weight="600" font-size="16" fill="#f97316" text-anchor="middle">AWS Cloud</text>

      <rect x="515" y="0" width="160" height="42" rx="10" fill="#1e293b" stroke="#334155" />
      <text x="595" y="27" font-family="Inter, sans-serif" font-weight="600" font-size="16" fill="#34d399" text-anchor="middle">Data Pipelines</text>
    </g>

    <!-- Bottom URL -->
    <text x="90" y="520" font-family="JetBrains Mono, monospace" font-size="16" fill="#64748b">
      https://sathyanandns.github.io/sathyanand-portfolio/
    </text>
  </svg>
  `;

  const ogPath = path.join(imagesDir, 'og-image.png');
  await sharp(Buffer.from(ogSvg))
    .png()
    .toFile(ogPath);

  console.log('Generated 1200x630 og-image.png');
}

async function generateFavicons() {
  const iconSvg = `
  <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="favGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#3b82f6" />
        <stop offset="100%" stop-color="#1d4ed8" />
      </linearGradient>
    </defs>
    <rect width="512" height="512" rx="120" fill="url(#favGrad)" />
    <!-- Monogram S -->
    <text x="256" y="355" font-family="Inter, sans-serif" font-weight="900" font-size="330" fill="#ffffff" text-anchor="middle">S</text>
    <!-- Dot -->
    <circle cx="390" cy="360" r="32" fill="#38bdf8" />
  </svg>
  `;

  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), iconSvg);

  await sharp(Buffer.from(iconSvg))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  await sharp(Buffer.from(iconSvg))
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'));

  await sharp(Buffer.from(iconSvg))
    .resize(16, 16)
    .png()
    .toFile(path.join(publicDir, 'favicon-16x16.png'));

  console.log('Generated favicon set');
}

async function run() {
  await convertJpgsToWebp();
  await generateArchitectureImages();
  await generateOgImage();
  await generateFavicons();
  console.log('All image processing complete!');
}

run().catch(console.error);

