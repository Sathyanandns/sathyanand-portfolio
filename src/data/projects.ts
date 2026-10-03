export interface Project {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  longDescription: string;
  problem: string;
  solution: string;
  result: string;
  technologies: string[];
  features: string[];
  architecture?: string[];
  metric?: { label: string; value: string; note: string };
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
    description:
      'An end-to-end phishing website detection system that analyzes URLs and predicts whether a website is legitimate or potentially phishing.',
    longDescription:
      'Built a complete machine learning pipeline that extracts features from URLs, preprocesses data, trains multiple ML models, and exposes predictions through a Flask REST API with a web interface and Chrome extension integration.',
    problem:
      'Phishing websites remain a major cybersecurity threat, and manually identifying them is impractical at scale. Users need a fast, automated system to evaluate URL safety.',
    solution:
      'Developed an end-to-end ML system that extracts URL-based features, trains classification models (XGBoost, Random Forest, SVM), and serves predictions via a Flask REST API with a web interface.',
    result:
      'Achieved 99.57% accuracy on the project\'s test dataset. Built a scalable API architecture with Chrome extension integration for real-time URL checking.',
    technologies: [
      'Python', 'Pandas', 'NumPy', 'Scikit-learn', 'XGBoost',
      'Random Forest', 'SVM', 'Flask', 'Machine Learning', 'Feature Engineering',
    ],
    features: [
      'URL feature extraction',
      'Phishing classification',
      'Data preprocessing pipeline',
      'ML model training & evaluation',
      'REST API backend',
      'Flask web interface',
      'Model serialization',
      'Chrome extension integration',
      'Scalable API architecture',
    ],
    pipeline: [
      'URL Input',
      'Feature Extraction',
      'Preprocessing',
      'ML Model',
      'Prediction',
      'API / UI',
    ],
    metric: {
      label: 'Model Accuracy',
      value: '99.57%',
      note: 'Achieved on the project\'s test dataset',
    },
    highlight: true,
  },
  {
    id: 'ml-aws-deployment',
    title: 'ML Model Deployment on AWS',
    shortTitle: 'AWS ML Deploy',
    description:
      'Built and deployed a binary classification model using scikit-learn and exposed it through a REST-accessible service on AWS EC2.',
    longDescription:
      'Developed a full cloud deployment workflow: trained a scikit-learn classification model, stored model artifacts in S3, deployed the service on EC2 with IAM least-privilege principles, and exposed predictions through a REST endpoint.',
    problem:
      'Machine learning models need to move from local development to cloud-hosted services for accessibility, scalability, and reliability.',
    solution:
      'Built a deployment workflow using AWS EC2 for compute, S3 for model artifact storage, and IAM for security, exposing the model through a REST service.',
    result:
      'Successfully deployed a fully functional ML prediction service on AWS with proper security, artifact management, and REST accessibility.',
    technologies: [
      'Python', 'Scikit-learn', 'AWS EC2', 'AWS S3', 'AWS IAM', 'REST API',
    ],
    features: [
      'Model deployment on EC2',
      'S3 model artifact storage',
      'IAM least-privilege security',
      'REST service endpoint',
      'Cloud deployment workflow',
    ],
    architecture: [
      'Client → REST API → EC2 → ML Model → Prediction',
      'S3 → Model Artifacts',
    ],
    highlight: true,
  },
  {
    id: 'data-pipeline',
    title: 'Cloud-Based Data Processing Pipeline',
    shortTitle: 'Data Pipeline',
    description:
      'Designed an end-to-end Python ETL pipeline for raw data ingestion, cleaning, preprocessing, and storage in Amazon S3.',
    longDescription:
      'Created an automated ETL pipeline that ingests raw data, performs cleaning and validation, applies preprocessing transformations, and stores processed outputs in Amazon S3 — reducing repetitive manual data work.',
    problem:
      'Manual data processing is error-prone, slow, and doesn\'t scale. Raw data needs consistent, repeatable cleaning and transformation before it can be used.',
    solution:
      'Built a Python-based ETL pipeline with automated ingestion, cleaning, preprocessing, and S3 storage with scheduled execution.',
    result:
      'Automated end-to-end data processing, significantly reducing repetitive manual tasks and improving data consistency.',
    technologies: ['Python', 'ETL', 'Data Processing', 'AWS S3', 'Automation'],
    features: [
      'Raw data ingestion',
      'Automated data cleaning',
      'Data preprocessing',
      'S3 storage integration',
      'Automated execution',
      'Reduction of manual tasks',
    ],
    pipeline: [
      'Raw Data',
      'Ingestion',
      'Cleaning',
      'Preprocessing',
      'S3 Storage',
    ],
    highlight: false,
  },
  {
    id: 's3-hosting',
    title: 'Static Website Hosting on AWS S3',
    shortTitle: 'S3 Hosting',
    description:
      'Configured an Amazon S3 bucket for static website hosting, including custom error pages and appropriately scoped access policies.',
    longDescription:
      'Set up AWS S3-based static website hosting with proper bucket policies, custom error page handling, and security-conscious access configurations.',
    problem:
      'Hosting static websites requires understanding cloud infrastructure, bucket policies, and access management.',
    solution:
      'Configured S3 bucket for static hosting with custom error pages and properly scoped access policies following AWS best practices.',
    result:
      'Deployed a functional static website on S3 with proper configuration, error handling, and access controls.',
    technologies: [
      'AWS S3', 'HTML', 'CSS', 'JavaScript', 'AWS Policies',
    ],
    features: [
      'S3 bucket configuration',
      'Static website hosting',
      'Custom error pages',
      'Access policy management',
      'AWS best practices',
    ],
    highlight: false,
  },
  {
    id: 'evm-dashboard',
    title: 'Project Monitor & EVM Dashboard',
    shortTitle: 'EVM Dashboard',
    description:
      'Built a project monitoring system around Excel-based project timelines and Earned Value Management concepts to visualize project progress, schedules, milestones, and performance.',
    longDescription:
      'Developed a comprehensive project monitoring dashboard that processes Excel-based project data, calculates EVM metrics, and provides visual dashboards including Gantt timelines, milestone tracking, planned vs actual progress, and multi-project overviews.',
    problem:
      'Project managers need clear visibility into project progress, schedule adherence, and performance metrics without manually processing spreadsheet data.',
    solution:
      'Built a Flask-based dashboard system that ingests Excel project data, computes EVM metrics, and renders interactive visualizations including Gantt charts, milestone views, and multi-project master dashboards.',
    result:
      'Created a functional project monitoring tool with automated data processing, EVM calculations, and visual project dashboards.',
    technologies: [
      'Python', 'Flask', 'Excel', 'JavaScript', 'HTML', 'CSS',
      'EVM', 'Data Processing',
    ],
    features: [
      'Excel-based data processing',
      'Flask backend API',
      'Project dashboard',
      'Gantt timeline visualization',
      'Planned vs actual progress',
      'Milestone tracking',
      'Project history',
      'EVM metrics calculation',
      'Automated snapshot handling',
      'REST API',
      'Multi-project master dashboard',
    ],
    highlight: true,
  },
  {
    id: 'odoo-llm-assistant',
    title: 'Odoo Local LLM Assistant',
    shortTitle: 'Odoo LLM',
    description:
      'A complete blueprint for running a Local Large Language Model (LLM) locally (via Ollama) to query Odoo ERP using natural language without sending enterprise data to cloud APIs.',
    longDescription:
      'Developed an intelligent assistant that integrates Ollama with Odoo ERP and PostgreSQL. It allows users to query enterprise data securely via natural language. Features include SQL generation, Domain Filters, read-only database roles, XML-RPC API querying, and natural language summary generation.',
    problem:
      'Enterprise users need to query ERP data easily, but sending sensitive business data to cloud APIs is a security risk. Standard SQL or API queries require technical knowledge.',
    solution:
      'Built a Local LLM Assistant using Ollama (Llama 3.1) that translates natural language questions into secure PostgreSQL queries or Odoo XML-RPC API calls, then summarizes the data back to the user.',
    result:
      'Created a secure, privacy-preserving, local AI assistant capable of converting natural language to safe Odoo data queries.',
    technologies: [
      'Python', 'Ollama', 'PostgreSQL', 'Odoo ERP', 'XML-RPC', 'LLaMA',
    ],
    features: [
      'Natural language to SQL',
      'Secure read-only PostgreSQL querying',
      'Odoo XML-RPC integration',
      'Data privacy (100% local processing)',
      'Natural language summarization of raw data',
    ],
    pipeline: [
      'User Question',
      'Local LLM (Ollama)',
      'SQL/API Query Generation',
      'Safety Validation',
      'Odoo/PostgreSQL Execution',
      'Data Summarization',
    ],
    highlight: true,
  },
  {
    id: 'nexus-ai',
    title: 'NEXUS AI - Autonomous AI & Data Platform',
    shortTitle: 'NEXUS AI',
    description:
      'A frontend web platform for deploying autonomous AI models at scale with sub-15ms latency.',
    longDescription:
      'Developed the frontend interface for an autonomous AI and Data Platform named NEXUS AI. Built using React, Vite, and Tailwind CSS with a modern UI utilizing Electric Purple and Vibrant Pink color schemes.',
    problem:
      'AI deployment platforms require a fast, modern, and highly responsive user interface to manage complex data models and autonomous agents.',
    solution:
      'Built a high-performance frontend using React and Vite, styled with Tailwind CSS for a sleek, modern aesthetic.',
    result:
      'Delivered a visually striking, fast-loading, responsive frontend application for AI model management.',
    technologies: ['React', 'Vite', 'Tailwind CSS', 'HTML', 'JavaScript'],
    features: [
      'Modern UI design',
      'Responsive layout',
      'Component-based architecture',
    ],
    highlight: false,
  },
  {
    id: 'odoo-automation',
    title: 'Odoo API Automation Task',
    shortTitle: 'Odoo Automation',
    description:
      'A Python module that handles connecting to and interacting with Odoo instances via REST/JSON-RPC protocols.',
    longDescription:
      'Engineered a defensive Python module for automated interactions with Odoo ERP instances through REST and JSON-RPC APIs. Includes robust error handling and API connection fallbacks for local and live environments.',
    problem:
      'Manual interaction with Odoo instances is repetitive and error-prone. Automation requires robust, fault-tolerant scripts that can handle network unreliability.',
    solution:
      'Created a Python automation script with defensive programming techniques to communicate with Odoo endpoints using REST/JSON-RPC, ensuring business logic completes regardless of intermittent failures.',
    result:
      'Automated routine Odoo tasks with a resilient script capable of handling failures gracefully.',
    technologies: ['Python', 'REST API', 'JSON-RPC', 'Odoo ERP', 'Automation'],
    features: [
      'REST/JSON-RPC integration',
      'Defensive coding blocks',
      'Local & Live environment support',
      'Automated task execution',
    ],
    highlight: false,
  },
];
