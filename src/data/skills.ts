export interface SkillCategory {
  title: string;
  icon: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    title: 'Programming Languages',
    icon: 'code',
    skills: ['Python', 'JavaScript', 'HTML', 'CSS'],
  },
  {
    title: 'Machine Learning & Data',
    icon: 'brain',
    skills: [
      'Supervised Classification',
      'Scikit-learn',
      'XGBoost',
      'Random Forest',
      'SVM',
      'Pandas',
      'NumPy',
      'Feature Engineering',
      'Basic NLP',
    ],
  },
  {
    title: 'Cloud Computing / AWS',
    icon: 'cloud',
    skills: [
      'AWS EC2',
      'AWS S3',
      'AWS IAM',
      'AWS SageMaker',
      'Static Website Hosting',
      'Cloud Deployment',
      'Cloud Data Pipelines',
    ],
  },
  {
    title: 'Backend & Integration',
    icon: 'database',
    skills: [
      'Flask',
      'REST APIs',
      'JSON-RPC / XML-RPC',
      'PostgreSQL',
      'Odoo ERP',
    ],
  },
  {
    title: 'AI & Frontend Tools',
    icon: 'wrench',
    skills: [
      'Ollama (Local LLMs)',
      'React',
      'Vite',
      'Tailwind CSS',
      'Git & GitHub',
      'VS Code',
      'Excel',
    ],
  },
  {
    title: 'OS & Networking',
    icon: 'terminal',
    skills: [
      'Linux (Ubuntu/CentOS)',
      'TCP/IP Fundamentals',
      'DNS Fundamentals',
    ],
  },
];

export interface TeamQuality {
  title: string;
  icon: string;
}

export const teamQualities: TeamQuality[] = [
  { title: 'Practical Problem Solving', icon: 'lightbulb' },
  { title: 'Clear Communication', icon: 'message-circle' },
  { title: 'Ownership', icon: 'shield-check' },
  { title: 'Team Collaboration', icon: 'users' },
  { title: 'Fast Learning', icon: 'zap' },
  { title: 'Adaptability', icon: 'refresh-cw' },
  { title: 'Time Management', icon: 'clock' },
  { title: 'Technical Curiosity', icon: 'search' },
  { title: 'Attention to Maintainability', icon: 'settings' },
  { title: 'Interest in Scalable Solutions', icon: 'trending-up' },
];

export interface Language {
  name: string;
  level: string;
}

export const languages: Language[] = [
  { name: 'Tamil', level: 'Native' },
  { name: 'English', level: 'Professional' },
  { name: 'Telugu', level: 'Conversational' },
];

export interface Experience {
  role: string;
  company: string;
  location: string;
  period: string;
  type: string;
  bullets: string[];
}

export const experienceData: Experience[] = [
  {
    role: 'Project Associate Intern',
    company: 'Goat Robotics Pvt. Ltd.',
    location: 'Coimbatore',
    period: '14 July 2026 – 31 October 2026',
    type: '3-Month Internship',
    bullets: [
      'Successfully completed a 3-month internship program and contributed to assigned tasks with dedication and sincerity.',
      'Demonstrated initiative, professionalism, and a positive attitude throughout the internship.',
    ],
  },
];

export interface Education {
  degree: string;
  institution: string;
  location: string;
  period: string;
}

export const educationData: Education[] = [
  {
    degree: 'Master of Computer Applications (MCA)',
    institution: 'KGISL Institute of Information Management',
    location: 'Coimbatore',
    period: '2023 – 2025',
  },
  {
    degree: 'Bachelor of Science – Computer Science',
    institution: 'KG Arts and Science College',
    location: 'Coimbatore',
    period: '2020 – 2023',
  },
];
