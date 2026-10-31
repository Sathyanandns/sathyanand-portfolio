export type ProjectCategory = 'All' | 'ML' | 'AWS' | 'Data';

export interface ProjectMetric {
  label: string;
  value: string;
  note: string;
  dataset?: string;
  split?: string;
  precisionRecall?: string;
}

export interface Project {
  id: string;
  title: string;
  shortTitle: string;
  category: 'ML' | 'AWS' | 'Data';
  description: string;
  longDescription: string;
  problem: string;
  solution: string;
  result: string;
  technologies: string[];
  features: string[];
  architecture?: string[];
  architectureImage?: string;
  architectureImageAlt?: string;
  metric?: ProjectMetric;
  pipeline?: string[];
  githubUrl?: string;
  demoUrl?: string;
  highlight: boolean;
}

export const projects: Project[] = [
  {
    id: 'phishing-detection',
    title: 'Phishing Website Detection System',
    shortTitle: 'Phishing Detection',
    category: 'ML',
    description:
      'An end-to-end phishing website detection system that extracts 30 URL features, trains ensemble models, and flags malicious links in real time.',
    longDescription:
      'Built a complete machine learning pipeline that extracts features from URLs, preprocesses data, trains multiple ML models, and exposes predictions through a Flask REST API with a web interface and Chrome extension integration.',
    problem:
      'Phishing websites remain a major cybersecurity threat, and manually identifying them is impractical at scale. Users need a fast, automated system to evaluate URL safety.',
    solution:
      'Developed an end-to-end ML system that extracts URL-based features, trains classification models (XGBoost, Random Forest, SVM), and serves predictions via a Flask REST API with a web interface.',
    result:
      'Achieved 99.57% test accuracy with 99.4% precision and 99.7% recall, minimizing false positive site blockages while catching zero-day phishing attempts.',
    technologies: [
      'Python', 'Pandas', 'NumPy', 'Scikit-learn', 'XGBoost',
      'Random Forest', 'SVM', 'Flask', 'Machine Learning', 'Feature Engineering',
    ],
    features: [
      '30-parameter URL feature extraction',
      'Ensemble phishing classification',
      'Robust data preprocessing pipeline',
      'Hyperparameter tuning & cross-validation',
      'Lightweight REST API backend (<50ms)',
      'Flask interactive web dashboard',
      'Model serialization via Joblib',
      'Chrome browser extension integration',
      'Scalable modular architecture',
    ],
    pipeline: [
      'URL Input',
      'Feature Extraction (30 params)',
      'Preprocessing & Normalization',
      'XGBoost / Ensemble Model',
      'Safety Probability Score',
      'REST API & Browser Notification',
    ],
    architectureImage: 'images/projects/phishing-detection-arch.webp',
    architectureImageAlt: 'Phishing website detection end-to-end ML inference architecture diagram',
    metric: {
      label: 'Model Accuracy',
      value: '99.57%',
      note: 'Evaluated on benchmark test set using tuned XGBoost classifier',
      dataset: 'UCI & Kaggle Phishing Websites Dataset (11,055 URLs, 30 engineered features)',
      split: '80% Training / 20% Testing with 5-Fold Stratified Cross-Validation',
      precisionRecall: 'Precision: 99.4% | Recall: 99.7% | F1-Score: 99.55%',
    },
    githubUrl: 'https://github.com/Sathyanandns/phishing-website-detection',
    demoUrl: 'https://github.com/Sathyanandns/phishing-website-detection#live-demo-and-screenshots',
    highlight: true,
  },
  {
    id: 'ml-aws-deployment',
    title: 'ML Model Deployment on AWS',
    shortTitle: 'AWS ML Deploy',
    category: 'AWS',
    description:
      'Trained and deployed a scikit-learn classification service on AWS EC2 with S3 artifact storage, IAM least-privilege security, and REST accessibility.',
    longDescription:
      'Developed a full cloud deployment workflow: trained a scikit-learn classification model, stored model artifacts in S3, deployed the service on EC2 with IAM least-privilege principles, and exposed predictions through a REST endpoint.',
    problem:
      'Machine learning models need to move from local development to cloud-hosted services for accessibility, scalability, and reliability.',
    solution:
      'Built a deployment workflow using AWS EC2 for compute, S3 for model artifact storage, and IAM for security, exposing the model through a REST service.',
    result:
      'Successfully deployed a fully functional ML prediction service on AWS with proper security, artifact management, and sub-45ms REST accessibility.',
    technologies: [
      'Python', 'Scikit-learn', 'AWS EC2', 'AWS S3', 'AWS IAM', 'Flask', 'REST API', 'Linux',
    ],
    features: [
      'Production model deployment on EC2',
      'Amazon S3 artifact versioning & storage',
      'IAM least-privilege role scoping',
      'Gunicorn + Nginx reverse proxy configuration',
      'Sub-45ms REST inference endpoint',
      'Reproducible cloud deployment workflow',
    ],
    architecture: [
      'Client Request → HTTPS REST API → Nginx / Gunicorn → EC2 Compute (Flask ML Service)',
      'Amazon S3 → Versioned Model Artifacts (Loaded securely via IAM Role)',
      'Security → Isolated VPC Security Groups & CloudWatch Health Monitoring',
    ],
    architectureImage: 'images/projects/ml-aws-deployment-arch.webp',
    architectureImageAlt: 'Machine learning model cloud deployment architecture on AWS EC2 and S3',
    metric: {
      label: 'Inference Latency',
      value: '< 45ms',
      note: 'P95 response latency on AWS EC2 with Gunicorn / Flask backend',
    },
    githubUrl: 'https://github.com/Sathyanandns/ml-aws-deployment',
    demoUrl: 'https://github.com/Sathyanandns/ml-aws-deployment#cloud-architecture',
    highlight: true,
  },
  {
    id: 'data-pipeline',
    title: 'Cloud-Based Data Processing Pipeline',
    shortTitle: 'Data Pipeline',
    category: 'Data',
    description:
      'Designed an automated Python ETL pipeline for raw data ingestion, schema validation, transformation, and structured storage in Amazon S3.',
    longDescription:
      'Created an automated ETL pipeline that ingests raw data, performs cleaning and validation, applies preprocessing transformations, and stores processed outputs in Amazon S3 — reducing repetitive manual data work.',
    problem:
      'Manual data processing is error-prone, slow, and doesn\'t scale. Raw data needs consistent, repeatable cleaning and transformation before it can be used.',
    solution:
      'Built a Python-based ETL pipeline with automated ingestion, cleaning, preprocessing, and S3 storage with scheduled execution.',
    result:
      'Automated end-to-end data processing, significantly reducing repetitive manual tasks by 85% and improving data consistency across analytical runs.',
    technologies: ['Python', 'Pandas', 'NumPy', 'ETL', 'Data Processing', 'AWS S3', 'Automation'],
    features: [
      'Automated raw data ingestion & validation',
      'Data cleaning and missing-value imputation',
      'Feature transformation & normalization',
      'Secure Amazon S3 bucket integration',
      'Configurable cron/scheduled execution',
      'Comprehensive error logging & audit trails',
    ],
    pipeline: [
      'Raw Source Data',
      'Ingestion & Validation',
      'Cleaning & Imputation',
      'Preprocessing & Transformation',
      'Structured S3 Storage',
    ],
    metric: {
      label: 'Turnaround Gain',
      value: '85%',
      note: 'Reduction in manual ETL and ingestion turnaround time',
    },
    githubUrl: 'https://github.com/Sathyanandns/cloud-data-pipeline',
    highlight: false,
  },
  {
    id: 's3-hosting',
    title: 'Static Website Hosting on AWS S3',
    shortTitle: 'S3 Hosting',
    category: 'AWS',
    description:
      'Configured Amazon S3 static website hosting with custom error routing, least-privilege bucket policies, and cross-region accessibility.',
    longDescription:
      'Set up AWS S3-based static website hosting with proper bucket policies, custom error page handling, and security-conscious access configurations.',
    problem:
      'Hosting static websites requires understanding cloud infrastructure, bucket policies, and access management.',
    solution:
      'Configured S3 bucket for static hosting with custom error pages and properly scoped access policies following AWS best practices.',
    result:
      'Deployed a functional, highly available static website on S3 with 99.99% availability, custom 404 routing, and strict access controls.',
    technologies: [
      'AWS S3', 'HTML', 'CSS', 'JavaScript', 'AWS IAM Policies', 'Cloud Best Practices',
    ],
    features: [
      'S3 bucket policy fine-tuning',
      'Static website hosting setup',
      'Custom 404 / error page routing',
      'CORS configuration for web assets',
      'AWS well-architected security posture',
    ],
    githubUrl: 'https://github.com/Sathyanandns/aws-s3-static-hosting',
    demoUrl: 'https://sathyanandns.github.io/sathyanand-portfolio/',
    highlight: false,
  },
  {
    id: 'evm-dashboard',
    title: 'Project Monitor & EVM Dashboard',
    shortTitle: 'EVM Dashboard',
    category: 'Data',
    description:
      'Built a project monitoring system computing Earned Value Management metrics (CPI, SPI, CV, SV) and rendering interactive Gantt timelines with Flask.',
    longDescription:
      'Developed a comprehensive project monitoring dashboard that processes Excel-based project data, calculates EVM metrics, and provides visual dashboards including Gantt timelines, milestone tracking, planned vs actual progress, and multi-project overviews.',
    problem:
      'Project managers need clear visibility into project progress, schedule adherence, and performance metrics without manually processing spreadsheet data.',
    solution:
      'Built a Flask-based dashboard system that ingests Excel project data, computes EVM metrics, and renders interactive visualizations including Gantt charts, milestone views, and multi-project master dashboards.',
    result:
      'Delivered an automated project tracking platform calculating EVM metrics automatically, visualizing timelines, and eliminating manual reporting delays.',
    technologies: [
      'Python', 'Flask', 'Pandas', 'Excel Ingestion', 'JavaScript', 'Chart.js', 'EVM Analytics',
    ],
    features: [
      'Excel-based schedule ingestion & parsing',
      'Automated EVM calculation (CPI, SPI, EAC, VAC)',
      'Interactive Gantt timeline visualizations',
      'Planned vs. Actual progress tracking',
      'Milestone deadline risk alerts',
      'Multi-project master overview dashboard',
    ],
    metric: {
      label: 'EVM Automation',
      value: '100%',
      note: 'Automated CPI, SPI, CV, and SV calculation from weekly schedule datasets',
    },
    githubUrl: 'https://github.com/Sathyanandns/evm-project-dashboard',
    demoUrl: 'https://github.com/Sathyanandns/evm-project-dashboard#features',
    highlight: true,
  },
  {
    id: 'odoo-llm-assistant',
    title: 'Odoo Local LLM Assistant',
    shortTitle: 'Odoo LLM',
    category: 'ML',
    description:
      'Engineered an on-premise AI assistant pairing Ollama (LLaMA 3) with Odoo ERP & PostgreSQL to translate natural language into secure business queries.',
    longDescription:
      'Developed an intelligent assistant that integrates Ollama with Odoo ERP and PostgreSQL. It allows users to query enterprise data securely via natural language. Features include SQL generation, Domain Filters, read-only database roles, XML-RPC API querying, and natural language summary generation.',
    problem:
      'Enterprise users need to query ERP data easily, but sending sensitive business data to cloud APIs is a security risk. Standard SQL or API queries require technical knowledge.',
    solution:
      'Built a Local LLM Assistant using Ollama (Llama 3.1) that translates natural language questions into secure PostgreSQL queries or Odoo XML-RPC API calls, then summarizes the data back to the user.',
    result:
      'Created a 100% private, zero-data-leakage AI copilot that enables non-technical team members to query ERP records with natural language in seconds.',
    technologies: [
      'Python', 'Ollama', 'LLaMA 3', 'PostgreSQL', 'Odoo ERP', 'XML-RPC', 'Prompt Engineering',
    ],
    features: [
      'Natural language to SQL generation',
      '100% on-premise local data isolation',
      'Read-only PostgreSQL role enforcement',
      'Odoo XML-RPC integration with domain filters',
      'AI summarization of tabular financial records',
      'Defensive query validation layer',
    ],
    pipeline: [
      'User Prompt',
      'Local Ollama (LLaMA 3)',
      'SQL / API Query Synthesis',
      'AST & Schema Safety Check',
      'PostgreSQL / Odoo Execution',
      'Natural Language Summary Output',
    ],
    metric: {
      label: 'Data Privacy',
      value: '100% Local',
      note: 'Zero external cloud API transmission; executed strictly on-premise with Ollama',
    },
    githubUrl: 'https://github.com/Sathyanandns/odoo-local-llm-assistant',
    demoUrl: 'https://github.com/Sathyanandns/odoo-local-llm-assistant#local-demo-guide',
    highlight: true,
  },
  {
    id: 'nexus-ai',
    title: 'NEXUS AI - Autonomous AI & Data Platform',
    shortTitle: 'NEXUS AI',
    category: 'ML',
    description:
      'Built a high-performance modern web dashboard for autonomous AI agent management, model monitoring, and latency diagnostics.',
    longDescription:
      'Developed the frontend interface for an autonomous AI and Data Platform named NEXUS AI. Built using React, Vite, and Tailwind CSS with a modern UI utilizing Electric Purple and Vibrant Pink color schemes.',
    problem:
      'AI deployment platforms require a fast, modern, and highly responsive user interface to manage complex data models and autonomous agents.',
    solution:
      'Built a high-performance frontend using React and Vite, styled with Tailwind CSS for a sleek, modern aesthetic.',
    result:
      'Delivered a visually striking, sub-15ms responsive frontend application for AI model monitoring and agent management.',
    technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'State Management'],
    features: [
      'Sleek modern UI with dark mode support',
      'Sub-15ms interactive state latency',
      'Real-time agent status visualization',
      'Responsive multi-device layout',
      'Clean modular component architecture',
    ],
    metric: {
      label: 'UI Latency',
      value: '< 15ms',
      note: 'Fast UI feedback and responsive agent state transitions',
    },
    githubUrl: 'https://github.com/Sathyanandns/nexus-ai',
    demoUrl: 'https://sathyanandns.github.io/nexus-ai/',
    highlight: false,
  },
  {
    id: 'odoo-automation',
    title: 'Odoo API Automation Task',
    shortTitle: 'Odoo Automation',
    category: 'Data',
    description:
      'Created a fault-tolerant Python module interfacing with Odoo instances via REST and JSON-RPC APIs with automatic retry loops.',
    longDescription:
      'Engineered a defensive Python module for automated interactions with Odoo ERP instances through REST and JSON-RPC APIs. Includes robust error handling and API connection fallbacks for local and live environments.',
    problem:
      'Manual interaction with Odoo instances is repetitive and error-prone. Automation requires robust, fault-tolerant scripts that can handle network unreliability.',
    solution:
      'Created a Python automation script with defensive programming techniques to communicate with Odoo endpoints using REST/JSON-RPC, ensuring business logic completes regardless of intermittent failures.',
    result:
      'Automated routine ERP synchronization tasks with 99.9% script execution reliability and graceful recovery on network timeouts.',
    technologies: ['Python', 'REST API', 'JSON-RPC', 'Odoo ERP', 'Error Handling', 'Automation'],
    features: [
      'REST & JSON-RPC dual protocol support',
      'Defensive retry logic with exponential backoff',
      'Automatic session re-authentication',
      'Support for local testing and live production instances',
      'Structured task execution logging',
    ],
    metric: {
      label: 'Script Reliability',
      value: '99.9%',
      note: 'Defensive retry logic with fallback handling across network interruptions',
    },
    githubUrl: 'https://github.com/Sathyanandns/odoo-api-automation',
    highlight: false,
  },
];
