export interface SkillCategory {
  title: string;
  icon: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    title: 'Programming Languages',
    icon: 'code',
    skills: ['Python', 'HTML', 'CSS', 'JavaScript'],
  },
  {
    title: 'Machine Learning',
    icon: 'brain',
    skills: [
      'Supervised Classification',
      'Data Preprocessing',
      'Feature Engineering',
      'Basic NLP',
      'Scikit-learn',
      'XGBoost',
      'Random Forest',
      'SVM',
      'Decision Trees',
    ],
  },
  {
    title: 'Cloud Computing / AWS',
    icon: 'cloud',
    skills: [
      'AWS EC2',
      'AWS S3',
      'AWS IAM',
      'Static Website Hosting',
      'Basic AWS SageMaker',
      'Cloud-based Deployment',
      'Cloud Data Pipelines',
    ],
  },
  {
    title: 'Data & Automation',
    icon: 'database',
    skills: [
      'Pandas',
      'NumPy',
      'Data Cleaning',
      'Data Validation',
      'Data Processing',
      'ETL',
      'Automation',
    ],
  },
  {
    title: 'Development Tools',
    icon: 'wrench',
    skills: ['Git', 'GitHub', 'Visual Studio Code', 'Flask', 'REST APIs'],
  },
  {
    title: 'OS & Networking',
    icon: 'terminal',
    skills: ['Linux', 'Ubuntu', 'CentOS', 'TCP/IP', 'DNS Fundamentals'],
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
