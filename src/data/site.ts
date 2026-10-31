// ===== Centralized site configuration =====
// Single source of truth for contact details, social links, role status, and assets.

export const siteConfig = {
  name: 'Sathyanand N S',
  firstName: 'Sathyanand',
  lastName: 'N S',
  title: 'Machine Learning & Cloud Computing Engineer',
  location: 'Coimbatore, Tamil Nadu, India',

  // Current status — update this single value to change the hero + contact text
  currentStatus: 'Started as AI Cloud Engineer on 02 Nov 2025',
  currentRoleTitle: 'AI Cloud Engineer',
  startDate: '02 Nov 2025',
  openToOpportunitiesText:
    'Started as AI Cloud Engineer on 02 Nov 2025. Open to technical collaborations, open source contributions, and knowledge sharing.',

  heroDescription:
    'Building practical machine learning solutions, cloud-based systems, data pipelines, and automation with Python and AWS.',

  // Contact — obfuscated parts are assembled at runtime to protect from scrapers
  email: {
    user: 'sathyanandns0342',
    domain: 'gmail.com',
  },
  phone: {
    display: '+91 99525 26732',
    href: '+919952526732',
  },

  social: {
    github: 'https://github.com/Sathyanandns',
    githubHandle: 'Sathyanandns',
    linkedin: 'https://www.linkedin.com/in/sathyanand-n-s-0759a4254',
    linkedinHandle: 'sathyanand-n-s-0759a4254',
  },

  siteUrl: 'https://sathyanandns.github.io/sathyanand-portfolio/',
  repoUrl: 'https://github.com/Sathyanandns/sathyanand-portfolio',
  resumeFile: 'Sathyanand_NS_Resume.pdf',

  // Formspree / EmailJS endpoint — set via VITE_FORM_ENDPOINT env variable
  // e.g. https://formspree.io/f/mqkvrgop
  formEndpoint: (import.meta.env.VITE_FORM_ENDPOINT as string | undefined) ?? '',
} as const;

/** Helper to build the full email string at runtime (anti-scraper) */
export function getEmail(): string {
  return `${siteConfig.email.user}@${siteConfig.email.domain}`;
}

/** Helper to build a mailto: link */
export function getMailtoLink(subject = '', body = ''): string {
  const email = getEmail();
  const params = new URLSearchParams();
  if (subject) params.set('subject', subject);
  if (body) params.set('body', body);
  const qs = params.toString();
  return `mailto:${email}${qs ? `?${qs}` : ''}`;
}

/** Build asset URL using Vite's base path so assets never break on GitHub Pages */
export function assetUrl(path: string): string {
  const base = import.meta.env.BASE_URL || '/';
  const clean = path.replace(/^\.?\//, '');
  return `${base.endsWith('/') ? base : base + '/'}${clean}`;
}
