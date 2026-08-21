export type CourseModule = {
  title: string;
  topics: string[];
};

export type Course = {
  slug: string;
  title: string;
  category: "Information Technology" | "Management" | "Design";
  duration: string;
  fees: string;
  price: number;
  description: string;
  features: string[];
  image?: string;
  curriculum: CourseModule[];
};

export let courses: Course[] = [
  // --- Information Technology ---
  {
    slug: "mern-stack",
    title: "MERN Stack",
    category: "Information Technology",
    duration: "6 Months",
    fees: "₹36,000",
    price: 36000,
    description: "Deep dive into the industry-favorite MERN stack (MongoDB, Express, React, Node) to become a highly sought-after Full Stack JavaScript Developer.",
    features: ["Specialized JS Focus", "Real-time Web Sockets", "AI-Assisted Debugging", "Resume Building"],
    image: "/MERN.jpg",
    curriculum: [
      {
        title: "Phase 1 — Web Fundamentals",
        topics: [
          "How Internet Works & Web Architecture",
          "Client vs Server Model",
          "HTTP / HTTPS Protocols",
          "Request & Response Lifecycle",
          "REST API Basics",
          "DNS Lookup System",
          "Browser Architecture & Rendering Engine",
          "Frontend vs Backend Breakdown",
          "JSON Format & Serialization",
          "Cookies & Sessions Management",
          "CORS (Cross-Origin Resource Sharing)"
        ]
      },
      {
        title: "Phase 2 — HTML5",
        topics: [
          "HTML Structure & Document Types",
          "HTML Tags & Attributes",
          "Headings, Paragraphs & Formatting",
          "Links, Anchors & Navigation",
          "Images & Multimedia Embeds",
          "Ordered, Unordered & Definition Lists",
          "Tables & Data Structuring",
          "Forms, Form Controls & Validations",
          "Advanced Input Types & Attributes",
          "Audio & Video Elements",
          "Semantic HTML5 Elements",
          "HTML5 APIs (Geolocation, Drag & Drop)",
          "Web Accessibility (WCAG & ARIA)",
          "SEO Fundamentals & Meta Tags"
        ]
      },
      {
        title: "Phase 3 — CSS3",
        topics: [
          "Selectors, Specificity & Cascade",
          "Colors (RGB, HSL, Hex) & Typography",
          "Box Model (Content, Padding, Border, Margin)",
          "Display Properties (Block, Inline, Flex, Grid)",
          "Positioning (Static, Relative, Absolute, Fixed, Sticky)",
          "Flexbox Layout Engine (Flex-Direction, Justify, Align)",
          "CSS Grid System & Template Areas",
          "Responsive Design Principles",
          "Media Queries for Multi-Device Layouts",
          "CSS Animations & Keyframes",
          "Transitions & Transformations",
          "Pseudo-Classes & Pseudo-Elements",
          "CSS Custom Properties (Variables)",
          "Mobile-First Design Strategy"
        ]
      },
      {
        title: "Phase 4 — JavaScript & Advanced JS",
        topics: [
          "Variables (var, let, const) & Data Types",
          "Operators, Conditions & Control Flow Loops",
          "Functions, Arrow Functions & Parameters",
          "Arrays, Objects & Strings Methods",
          "Destructuring & Spread / Rest Operators",
          "Template Literals & String Interpolation",
          "Scope, Hoisting & Closures",
          "this Keyword, Call, Apply & Bind",
          "Prototypes, Prototypal Inheritance & ES6 Classes",
          "Object-Oriented Programming (OOP) in JS",
          "Error Handling (try...catch, Custom Errors)",
          "DOM Manipulation, Selection & Traversal",
          "Event Listeners, Bubbling, Capturing & Delegation",
          "Browser Storage (LocalStorage, SessionStorage)",
          "ES6+ Features, Modules (Import/Export)",
          "Asynchronous JS (Callbacks, Promises, Async/Await)",
          "Fetch API & AJAX Data Retrieval",
          "Event Loop, Microtasks & Macrotasks Queue"
        ]
      },
      {
        title: "Phase 5 — Git & GitHub",
        topics: [
          "Git Installation & Initial Configuration",
          "Repository Initialization (git init, git clone)",
          "Staging & Committing (git add, git commit)",
          "Remote Repositories (git push, git pull)",
          "Branching Strategies (git branch, git checkout, git switch)",
          "Branch Merging & Rebase Basics",
          "Merge Conflict Resolution",
          ".gitignore Files & Security Best Practices",
          "GitHub Pull Requests (PRs) & Code Reviews",
          "GitHub Issues, Projects & README Documentation",
          "Collaborative Git Workflows"
        ]
      },
      {
        title: "Phase 6 — React.js & Advanced React",
        topics: [
          "React Introduction & Virtual DOM Architecture",
          "React Components (Functional vs Class)",
          "JSX Syntax & Rendering Logic",
          "Props, State & Unidirectional Data Flow",
          "Event Handling in React",
          "Conditional Rendering & Dynamic Lists",
          "Keys & List Optimization",
          "Forms & Controlled / Uncontrolled Components",
          "React Core Hooks (useState, useEffect, useContext)",
          "Advanced Hooks (useReducer, useRef, useMemo, useCallback)",
          "Custom React Hooks Architecture",
          "React Router v6 (Nested Routes, Dynamic Routes, Protected Routes)",
          "Lazy Loading & Code Splitting (React.lazy, Suspense)",
          "Error Boundaries & Exception Recovery",
          "Context API & Global State Management",
          "Redux Toolkit (Slices, Store, Async Thunks)",
          "React Query / TanStack Query Data Fetching & Caching",
          "API Integration with Axios (Interceptors, Instance)",
          "Performance Optimization (React.memo, PureComponents)",
          "Environment Variables in React (.env)"
        ]
      },
      {
        title: "Phase 7 — UI Frameworks",
        topics: [
          "Tailwind CSS (Utility-First Design, Config, Custom Plugins)",
          "Bootstrap (Grid System, Utilities, Pre-built Components)",
          "Material UI / MUI (Theme Provider, Sx Prop, Icons, Components)"
        ]
      },
      {
        title: "Phase 8 — Node.js",
        topics: [
          "Node.js Architecture & Event-Driven Engine",
          "Node.js Installation & Environment Setup",
          "NPM & Package Management (package.json, package-lock.json)",
          "CommonJS (require) vs ES Modules (import/export)",
          "Node.js Core Modules (File System - fs, Path, OS)",
          "Events Module & EventEmitter Pattern",
          "Streams & Buffers for Efficient Data Handling",
          "Environment Variables (process.env, dotenv)",
          "HTTP & HTTPS Native Server Creation",
          "Asynchronous Non-Blocking Programming"
        ]
      },
      {
        title: "Phase 9 — Express.js Architecture",
        topics: [
          "Express.js Setup & Application Architecture",
          "Routing & Route Parameters / Query Strings",
          "Custom & Built-in Middleware Pipelines",
          "Request & Response Object Lifecycle",
          "Controller Design & Business Logic Separation",
          "RESTful API Endpoint Construction",
          "Global Error Handling Middleware",
          "CORS Configuration & Security Headers",
          "Request Body Data Validation (Joi / Express-Validator)",
          "File Upload Processing (Multer Integration)",
          "MVC (Model-View-Controller) Architecture"
        ]
      },
      {
        title: "Phase 10 — MongoDB & Mongoose ODM",
        topics: [
          "NoSQL Database Concepts vs Relational DBs",
          "MongoDB Installation & Setup (Local & Atlas Cloud)",
          "Databases, Collections & Document Structures",
          "CRUD Operations (Insert, Find, Update, Delete)",
          "Query Operators, Logical Operators & Modifiers",
          "Sorting, Projection & Pagination Strategies",
          "Database Indexing & Performance Optimization",
          "Complex Aggregation Framework & Pipelines",
          "Document Relationships & Transactions",
          "Mongoose ODM (Schema Creation, Types, Models)",
          "Mongoose Validation & Custom Validators",
          "Mongoose Middleware / Hooks (Pre & Post Hooks)",
          "Model References & Data Population (populate())"
        ]
      },
      {
        title: "Phase 11 — Authentication & Security",
        topics: [
          "Authentication vs Authorization Frameworks",
          "Password Hashing with Bcrypt & Salt Rounds",
          "JSON Web Tokens (JWT) Architecture",
          "Access Tokens & Refresh Token Strategies",
          "Secure Cookie Storage (HttpOnly, SameSite, Secure)",
          "Session-Based vs Token-Based Authentication",
          "Role-Based Access Control (RBAC) & Protected Routes",
          "OAuth 2.0 & Google Social Login Integration"
        ]
      },
      {
        title: "Phase 12 — Testing & Quality Assurance",
        topics: [
          "Testing Methodologies (Unit, Integration, E2E)",
          "Jest Testing Framework Setup & Assertions",
          "React Testing Library for Component Testing",
          "API Endpoint Testing with Postman & Supertest",
          "Mocking Functions & API Call Spies"
        ]
      },
      {
        title: "Phase 13 — Deployment, CI/CD & Production Capstones",
        topics: [
          "Production Build Process & Optimization",
          "Deploying Frontend Apps to Vercel / Netlify",
          "Deploying Backend Servers to Render / Railway / AWS",
          "MongoDB Atlas Production Cluster Setup",
          "Custom Domain Mapping & SSL/HTTPS Certificates",
          "CI/CD Automated Pipelines Basics",
          "Project 1: Todo Application with Full CRUD",
          "Project 2: Secure JWT Authentication System",
          "Project 3: Production Blog Application",
          "Project 4: Full-Stack E-Commerce Application",
          "Project 5: Real-Time Social Media Application",
          "Project 6: Document Verification System",
          "Project 7: Admin Dashboard with Analytics & Role Control"
        ]
      }
    ]
  },
  {
    slug: "mean-stack",
    title: "MEAN Stack",
    category: "Information Technology",
    duration: "6 Months",
    fees: "₹36,000",
    price: 36000,
    description: "Master enterprise full-stack web development using MongoDB, Express.js, Angular, and Node.js (MEAN) for building robust dynamic applications.",
    features: ["Angular Framework Mastery", "Real-Time Web Apps", "AI-Assisted Workflows", "Industry Certification"],
    curriculum: [
      {
        title: "Phase 1 — Web Fundamentals",
        topics: [
          "How Internet Works & Web Architecture",
          "Client vs Server Model",
          "HTTP / HTTPS Protocols",
          "Request & Response Lifecycle",
          "REST API Basics",
          "DNS Lookup System",
          "Frontend vs Backend Breakdown",
          "JSON Format & Serialization",
          "Cookies & Sessions Management",
          "CORS (Cross-Origin Resource Sharing)"
        ]
      },
      {
        title: "Phase 2 — HTML5",
        topics: [
          "HTML Structure & Document Types",
          "HTML Tags & Attributes",
          "Headings, Paragraphs & Links",
          "Forms, Input Types & Validations",
          "Semantic HTML5 Elements",
          "Web Accessibility (WCAG & ARIA)",
          "SEO Fundamentals & Meta Tags"
        ]
      },
      {
        title: "Phase 3 — CSS3",
        topics: [
          "Selectors, Specificity & Cascade",
          "Box Model (Content, Padding, Border, Margin)",
          "Flexbox Layout Engine",
          "CSS Grid System",
          "Responsive Design Principles",
          "Media Queries for Multi-Device Layouts",
          "CSS Animations & Keyframes"
        ]
      },
      {
        title: "Phase 4 — JavaScript",
        topics: [
          "ES6+ Features & Syntax",
          "Variables (var, let, const) & Data Types",
          "Functions, Arrow Functions & Parameters",
          "Arrays, Objects & Methods",
          "Classes & Object-Oriented Programming (OOP)",
          "DOM Manipulation & Selection",
          "Event Handling & Delegation",
          "Callbacks, Promises & Async/Await",
          "Fetch API Data Retrieval",
          "ES6 Modules (Import/Export)",
          "Closures, Scope & Event Loop"
        ]
      },
      {
        title: "Phase 5 — TypeScript (Essential for Angular)",
        topics: [
          "TypeScript Installation & CLI Setup",
          "Basic Types (string, number, boolean, any, unknown, void, never)",
          "Interfaces vs Type Aliases",
          "Enums & Tuple Types",
          "Functions & Parameter Types",
          "Classes, Constructors & Access Modifiers (public, private, protected, readonly)",
          "Generics (Generic Classes, Interfaces, Functions)",
          "Union & Intersection Types",
          "Type Narrowing & Type Guards",
          "Optional Properties & Nullish Coalescing",
          "Decorators (Class, Property, Method Decorators)",
          "TypeScript Modules & Namespace",
          "tsconfig.json Configuration Options"
        ]
      },
      {
        title: "Phase 6 — Angular Core, Routing, Forms & Signals",
        topics: [
          "Angular Architecture & Ecosystem Overview",
          "Angular CLI Setup & Project Structure",
          "Components, Templates & Data Binding (Interpolation, Property, Event, Two-Way [(ngModel)])",
          "Built-in & Custom Directives (*ngIf, *ngFor, *ngSwitch, Structural/Attribute Directives)",
          "Pipes & Custom Formatting Pipes",
          "Services & Dependency Injection (Injectable, ProvidedIn)",
          "NgModule Architecture vs Standalone Components",
          "Angular Router Setup & Route Definitions",
          "Route Parameters, Query Params & Child Routes",
          "Lazy Loading Modules & Component Code Splitting",
          "Route Guards (CanActivate, CanDeactivate, CanMatch) & Protected Routes",
          "Template-Driven Forms & Control References",
          "Reactive Forms, FormBuilder, FormGroup & FormControl",
          "Form Validations, Custom Validators & Async Validators",
          "Angular Component Lifecycle Hooks (ngOnInit, ngOnChanges, ngOnDestroy, etc.)",
          "Change Detection Strategy (Default vs OnPush)",
          "Angular Signals & Reactive State Primitive",
          "RxJS Observables, Observers & Subscriptions",
          "RxJS Subjects, BehaviorSubject & ReplaySubject",
          "RxJS Transformation & Filtering Operators (map, filter, switchMap, mergeMap, catchError)",
          "Angular HttpClient API Integration & Interceptors",
          "Global Error Handling & HTTP Error Catching",
          "State Management with Services, RxJS, NgRx Store & Signals"
        ]
      },
      {
        title: "Phase 7 — Node.js",
        topics: [
          "Node.js Architecture & Event-Driven Engine",
          "NPM & Package Management (package.json)",
          "CommonJS vs ES Modules",
          "Node.js Core Modules (File System - fs, Path, OS)",
          "Streams & Buffers for High Performance",
          "Events Module & EventEmitter Pattern",
          "Asynchronous Non-Blocking Programming",
          "Environment Variables (dotenv)"
        ]
      },
      {
        title: "Phase 8 — Express.js",
        topics: [
          "Express.js Setup & Application Routing",
          "Custom & Built-in Middleware Pipelines",
          "RESTful API Endpoint Architecture",
          "Controllers & Service Layer Separation",
          "MVC (Model-View-Controller) Architecture Pattern",
          "Global Error Handling Middleware",
          "Request Body Data Validation",
          "API Authentication & CORS Security Headers"
        ]
      },
      {
        title: "Phase 9 — MongoDB & Mongoose ODM",
        topics: [
          "NoSQL Concepts vs Relational Databases",
          "CRUD Operations (Create, Read, Update, Delete)",
          "Query Operators, Sorting & Indexing Strategies",
          "Complex Aggregation Framework & Pipelines",
          "Document Relationships & Database Transactions",
          "Mongoose ODM (Schemas, Models & Custom Types)",
          "Mongoose Validation & Custom Validators",
          "Model References & Data Population (populate())",
          "Mongoose Middleware & Pre/Post Hooks"
        ]
      },
      {
        title: "Phase 10 — Authentication & Security",
        topics: [
          "JSON Web Token (JWT) Authentication Architecture",
          "Password Hashing with Bcrypt & Salt Rounds",
          "HttpOnly Cookie Storage & Session Security",
          "Role-Based Access Control (RBAC) & Authorization",
          "OAuth 2.0 & Social Login Integration",
          "Angular Auth Guards & HTTP Interceptor Token Injection"
        ]
      },
      {
        title: "Phase 11 — Testing & Quality Assurance",
        topics: [
          "Jasmine Testing Framework Basics & Assertions",
          "Karma Test Runner Configuration",
          "Jest Testing Framework for Angular & Node",
          "Angular Component & Service Unit Testing",
          "API Endpoint Testing with Postman & Supertest"
        ]
      },
      {
        title: "Phase 12 — Deployment, CI/CD & Enterprise MEAN Projects",
        topics: [
          "Angular Production Build Optimization (`ng build --configuration production`)",
          "Deploying Node.js Backend to Render / Railway / AWS",
          "Deploying Angular Frontend to Vercel / Netlify / Cloudflare",
          "MongoDB Atlas Production Cluster Deployment",
          "Environment Variables Management (.env)",
          "CI/CD Automated Deployment Pipelines",
          "Project 1: Todo Application with Angular & Express",
          "Project 2: Employee Management System (EMS)",
          "Project 3: Secure JWT Authentication System",
          "Project 4: Production Blog Application",
          "Project 5: Full-Stack E-Commerce Application",
          "Project 6: Hospital Management System (HMS)",
          "Project 7: Enterprise Admin Dashboard with NgRx & Analytics"
        ]
      }
    ]
  },
  {
    slug: "full-stack-java",
    title: "Full Stack Java",
    category: "Information Technology",
    duration: "6 Months",
    fees: "₹36,000",
    price: 36000,
    description: "Learn enterprise-grade full stack development using Java 21, Spring Boot 3, Hibernate JPA, React, and SQL. Ideal for large-scale enterprise careers.",
    features: ["Enterprise Architecture", "Microservices & Spring Boot", "Full Stack Integration", "Mock Interviews & Placement"],
    curriculum: [
      { title: "Module 1: Core Java 21 & OOP Paradigm", topics: ["Java 21 Syntax & Virtual Threads", "Object-Oriented Programming (Inheritance, Polymorphism, Encapsulation)", "Exception Handling & Custom Exceptions", "Java Collections Framework (List, Set, Map)", "Java 8+ Features (Lambda Expressions, Stream API, Optional)"] },
      { title: "Module 2: Advanced Java, Concurrency & SQL", topics: ["Multithreading & Executor Framework", "JDBC Connection & Statement Management", "Advanced SQL Querying (Joins, Indexing, Triggers)", "PostgreSQL & MySQL Database Design", "Unit Testing with JUnit 5 & Mockito"] },
      { title: "Module 3: Spring Framework 6 & Spring Boot 3", topics: ["Spring IoC Container & Dependency Injection", "Spring MVC & Building RESTful Controllers", "Spring Data JPA & Hibernate ORM Mapping", "Bean Validation & Global Exception Handling", "Spring Boot Actuator & Logging"] },
      { title: "Module 4: Spring Security 6 & Microservices Architecture", topics: ["Spring Security 6 with JWT Authentication", "Role-Based Authorization Policies", "Microservices Concepts & Architecture Patterns", "Spring Cloud Eureka Service Discovery", "API Gateway Routing & Resilience4j Circuit Breakers"] },
      { title: "Module 5: Modern Front-End Integration with React", topics: ["HTML5, CSS3 & JavaScript ES6+ Fundamentals", "React Component Hierarchy & Hooks", "Axios HTTP Client Integration with Spring Boot", "State Management & React Router", "UI Component Libraries (MUI/Tailwind)"] },
      { title: "Module 6: Containerization, DevOps & Banking Capstone", topics: ["Dockerizing Spring Boot & React Applications", "Kubernetes Deployment Fundamentals", "CI/CD Pipeline Setup", "Full-Stack Enterprise Banking/FinTech Capstone Build", "Technical Mock Interviews & Career Coaching"] }
    ]
  },
  {
    slug: "full-stack-python",
    title: "Full Stack Python",
    category: "Information Technology",
    duration: "6 Months",
    fees: "₹36,000",
    price: 36000,
    description: "Master full stack web development using Python 3.12, Django 5, FastAPI, React, and PostgreSQL for building modern data-driven applications.",
    features: ["Python & Django Framework", "React Front-End", "RESTful APIs", "Live Industry Projects"],
    curriculum: [
      { title: "Module 1: Python 3.12 Core & Advanced Programming", topics: ["Python 3.12 Syntax & Data Structures", "Object-Oriented Programming in Python", "Decorators, Generators & Iterators", "Exception Handling & Context Managers", "File I/O & Package Management with PIP/UV"] },
      { title: "Module 2: Web Scraping, Automation & Databases", topics: ["Web Scraping with BeautifulSoup & Selenium", "Relational Database Design with PostgreSQL", "Complex SQL Queries & Indexing", "Python Database Adapters (Psycopg3)", "Data Processing with Pandas Basics"] },
      { title: "Module 3: Django 5 Web Framework & MVT", topics: ["Django Architecture (Model-View-Template)", "Django ORM & Database Migrations", "Django Admin Customization", "Django Forms & User Authentication System", "Middleware & Template Tags"] },
      { title: "Module 4: Django REST Framework (DRF) & FastAPI", topics: ["Building REST APIs with DRF Serializers", "Class-Based Views & ViewSets", "JWT Authentication in DRF", "Asynchronous High-Performance APIs with FastAPI", "Swagger/OpenAPI Documentation"] },
      { title: "Module 5: Front-End React & Async Processing", topics: ["React.js Component Architecture & Hooks", "Integrating React SPA with Django REST Backend", "Asynchronous Task Queues with Celery & Redis", "Real-Time WebSockets with Django Channels", "Git Workflow & Version Control"] },
      { title: "Module 6: Cloud Deployment & SaaS Capstone Build", topics: ["Containerization with Docker & Docker Compose", "Deploying Python Apps on AWS Elastic Beanstalk / Vercel", "Nginx & Gunicorn Production Server Setup", "Complete AI-Powered SaaS Product Capstone", "Portfolio & Job Placement Assistance"] }
    ]
  },
  {
    slug: "ai-machine-learning",
    title: "AI & Machine Learning",
    category: "Information Technology",
    duration: "6 Months",
    fees: "₹36,000",
    price: 36000,
    description: "Enter the frontier of technology. Learn to build intelligent systems, train ML models, and engineer Generative AI applications.",
    features: ["TensorFlow & PyTorch", "Deep Learning", "NLP & Computer Vision", "Kaggle Projects"],
    curriculum: [
      { title: "Module 1: Math Foundations & Python AI Stack", topics: ["Linear Algebra & Matrix Operations", "Multivariable Calculus & Gradient Descent", "Probability Theory & Descriptive Statistics", "NumPy & Pandas High-Performance Data Processing", "Matplotlib & Seaborn Data Visualization"] },
      { title: "Module 2: Supervised & Unsupervised Machine Learning", topics: ["Linear & Logistic Regression", "Decision Trees, Random Forests & XGBoost", "Support Vector Machines (SVM) & K-Nearest Neighbors", "K-Means Clustering & Hierarchical Clustering", "Principal Component Analysis (PCA) Dimensionality Reduction"] },
      { title: "Module 3: Deep Learning & Neural Network Architecture", topics: ["Artificial Neural Network (ANN) Fundamentals", "Backpropagation & Optimization Algorithms (Adam, SGD)", "TensorFlow 2.x & Keras Masterclass", "PyTorch Neural Network Pipeline Development", "Hyperparameter Tuning & Regularization (Dropout, L1/L2)"] },
      { title: "Module 4: Computer Vision & Natural Language Processing", topics: ["Convolutional Neural Networks (CNNs) & Image Classification", "OpenCV for Real-Time Image & Video Processing", "Recurrent Neural Networks (RNNs) & LSTMs", "Text Preprocessing & Word Embeddings (Word2Vec, GloVe)", "Attention Mechanism & Transformer Architecture"] },
      { title: "Module 5: Generative AI, LLMs & Prompt Engineering", topics: ["Large Language Models (LLMs) & Fine-Tuning", "Retrieval-Augmented Generation (RAG) Systems", "LangChain Framework & Vector Databases (Pinecone/ChromaDB)", "Building AI Agents with OpenAI & Hugging Face", "Prompt Engineering & Guardrails"] },
      { title: "Module 6: MLOps, Cloud Deployment & AI Capstone", topics: ["Model Serialization & Versioning (MLflow)", "Serving ML Models with FastAPI & Streamlit", "Docker Containers for Machine Learning Solutions", "Deploying AI Models on AWS SageMaker / GCP", "Autonomous AI Agent / Predictive Analytics Capstone"] }
    ]
  },
  {
    slug: "data-science",
    title: "Data Science",
    category: "Information Technology",
    duration: "6 Months",
    fees: "₹36,000",
    price: 36000,
    description: "Turn raw complex data into actionable business intelligence. Master data wrangling, advanced analytics, and predictive modeling.",
    features: ["Python & R", "Tableau/PowerBI", "Big Data", "Real-world Datasets"],
    curriculum: [
      { title: "Module 1: Data Analytics Foundations & Advanced SQL", topics: ["Data Mining & Cleaning Methodologies", "Complex SQL Queries, Window Functions & CTEs", "Data Transformation & Normalization", "Relational Database Analytics Architecture", "Excel Advanced Analytics & Pivot Automation"] },
      { title: "Module 2: Python Data Science Ecosystem", topics: ["Pandas DataFrames for Wrangling & Manipulation", "NumPy Numerical Computing", "SciPy Statistical Methods", "Handling Missing Data, Outliers & Feature Scaling", "Automated Data Cleaning Pipelines"] },
      { title: "Module 3: Data Visualization & Business Intelligence", topics: ["Exploratory Data Analysis (EDA) Best Practices", "Interactive Visualizations with Seaborn & Plotly", "Power BI Data Modeling & DAX Expressions", "Tableau Dashboard Design & Storytelling", "Executive Insight Reporting"] },
      { title: "Module 4: Applied Statistical Modeling & A/B Testing", topics: ["Probability Distributions & Hypothesis Testing", "Z-Tests, T-Tests & ANOVA Tests", "A/B Testing Experiment Design & Analysis", "Time Series Analysis & Forecasting (ARIMA/Prophet)", "Correlation & Causality Analysis"] },
      { title: "Module 5: Machine Learning for Data Science", topics: ["Feature Selection & Feature Engineering", "Supervised Learning Models (Regression, Classification)", "Unsupervised Clustering & Customer Segmentation", "Model Evaluation Metrics (ROC-AUC, Confusion Matrix)", "Churn Prediction & Recommendation Algorithms"] },
      { title: "Module 6: Big Data Processing & Capstone Project", topics: ["Apache Spark & PySpark Big Data Processing", "Cloud Data Warehouses (Google BigQuery / Snowflake)", "Building Automated Data Pipelines", "End-to-End Industry Analytics Capstone Project", "Executive Presentation & Portfolio Preparation"] }
    ]
  },
  {
    slug: "cyber-security",
    title: "Cyber Security",
    category: "Information Technology",
    duration: "6 Months",
    fees: "₹36,000",
    price: 36000,
    description: "Protect critical enterprise networks and infrastructure from digital threats. Master ethical hacking, penetration testing, and SOC analysis.",
    features: ["Ethical Hacking", "Network Defense", "AI-Threat Detection", "CEH Prep"],
    curriculum: [
      { title: "Module 1: Computer Networking & Security Architecture", topics: ["TCP/IP Protocol Suite & Packet Inspection", "OSI Model & Network Topology Defense", "Linux System Administration & Command Line", "Windows Server Security Hardening", "Network Scanning & Wireshark Packet Analysis"] },
      { title: "Module 2: Ethical Hacking & Vulnerability Assessment", topics: ["Footprinting, OSINT & Intelligence Gathering", "Network Reconnaissance with Nmap & Masscan", "Vulnerability Scanning with Nessus & OpenVAS", "Exploitation Frameworks (Metasploit)", "Social Engineering Tactics & Defense"] },
      { title: "Module 3: Web Application Security (OWASP Top 10)", topics: ["SQL Injection (SQLi) Identification & Prevention", "Cross-Site Scripting (XSS) & CSRF Attacks", "Burp Suite Pro Web App Assessment", "Authentication & Session Hijacking", "API Security Auditing"] },
      { title: "Module 4: Cryptography, Firewalls & Network Defense", topics: ["Symmetric & Asymmetric Encryption Standards", "Public Key Infrastructure (PKI) & Digital Certificates", "Next-Gen Firewall (NGFW) & VPN Configurations", "Intrusion Detection/Prevention Systems (IDS/IPS)", "Wireless Network Hacking & WPA3 Security"] },
      { title: "Module 5: Incident Response, SIEM & Digital Forensics", topics: ["Security Operations Center (SOC) Workflows", "SIEM Log Analysis with Splunk / ELK Stack", "Digital Forensics & Memory Dump Analysis", "Malware Analysis Fundamentals (Static & Dynamic)", "Threat Hunting & Ransomware Mitigation"] },
      { title: "Module 6: Cloud Security, Compliance & CTF Capstone", topics: ["AWS & Azure Cloud Security Configuration", "ISO 27001, NIST & GDPR Compliance Frameworks", "Container & Kubernetes Security Auditing", "Live Capture The Flag (CTF) Security Challenge", "Vulnerability Assessment & Penetration Testing (VAPT) Report Capstone"] }
    ]
  },
  {
    slug: "cloud-computing",
    title: "Cloud Computing",
    category: "Information Technology",
    duration: "6 Months",
    fees: "₹36,000",
    price: 36000,
    description: "Master enterprise cloud architecture, serverless computing, container orchestration, and DevOps automated infrastructure.",
    features: ["AWS/Azure/GCP", "DevOps Integration", "Serverless Architecture", "Cloud Cert Prep"],
    curriculum: [
      { title: "Module 1: Cloud Fundamentals & Networking Architecture", topics: ["Cloud Service Models (IaaS, PaaS, SaaS, Serverless)", "Virtualization Technologies & Hypervisors", "Cloud Virtual Private Cloud (VPC) & Subnetting", "Route Tables, Internet Gateways & NAT Gateways", "Domain Name System (DNS) & Content Delivery Networks (CDN)"] },
      { title: "Module 2: AWS Core Compute, Storage & Database Services", topics: ["Amazon EC2 Instances & Security Groups", "Amazon S3 Storage Buckets & Lifecycle Policies", "AWS IAM Roles, Users & Policies", "Relational Databases (AWS RDS & Aurora)", "NoSQL Databases (DynamoDB)"] },
      { title: "Module 3: High Availability, Auto-Scaling & Serverless", topics: ["Elastic Load Balancing (ALB/NLB) Setup", "Auto Scaling Groups (ASG) & Health Checks", "AWS Lambda Event-Driven Serverless Compute", "API Gateway Integration & Microservices", "Amazon SQS & SNS Messaging Queues"] },
      { title: "Module 4: Containerization & Orchestration", topics: ["Docker Architecture & Dockerfile Creation", "Docker Compose Multi-Container Setup", "Kubernetes Cluster Architecture & Concepts", "Deploying Pods, Services & Ingress Controllers", "Helm Charts for Application Management"] },
      { title: "Module 5: Infrastructure as Code (IaC) & DevOps CI/CD", topics: ["Terraform Declarative Configuration (HCL)", "State Management & Remote Backends", "GitHub Actions CI/CD Pipeline Construction", "Automated Infrastructure Provisioning", "CloudWatch Monitoring & AWS CloudTrail Logging"] },
      { title: "Module 6: Multi-Cloud, Cost Optimization & Cloud Capstone", topics: ["Microsoft Azure & GCP Core Equivalents", "Cloud Cost Optimization & FinOps Strategies", "Disaster Recovery & High Availability Planning", "Deploying Enterprise Multi-Region Scalable Application Capstone", "AWS Solutions Architect Certification Prep"] }
    ]
  },

  // --- Management ---
  {
    slug: "digital-marketing",
    title: "Digital Marketing",
    category: "Management",
    duration: "3 Months",
    fees: "₹36,000",
    price: 36000,
    description: "Master performance marketing, SEO, Google Ads, Meta Ads, and AI-driven content growth strategies to scale digital brands.",
    features: ["SEO & SEM", "Social Media Ads", "AI Content Generation", "Google Certifications"],
    curriculum: [
      { title: "Module 1: Digital Marketing Strategy & Brand Positioning", topics: ["Digital Marketing Funnel Architecture (AIDA)", "Customer Buyer Persona Development", "Competitor Benchmarking & Market Research", "Brand Identity & Value Proposition Design", "Website Architecture & UX for Conversion"] },
      { title: "Module 2: Search Engine Optimization (SEO Masterclass)", topics: ["Keyword Research Tools (Ahrefs, Semrush, Google Keyword Planner)", "On-Page SEO Optimization (Meta Tags, Content Structure)", "Technical SEO Audits (Site Speed, Schema Markup, Crawlability)", "Off-Page SEO & High-Authority Backlink Building", "Local SEO & Google Business Profile Optimization"] },
      { title: "Module 3: Performance Marketing (Google Ads & Meta PPC)", topics: ["Google Search Ads Campaign Setup & Bidding Strategies", "Google Display, Video (YouTube) & Shopping Ads", "Meta (Facebook/Instagram) Ad Account & Pixel Setup", "Custom & Lookalike Audience Targeting Strategies", "Retargeting Campaigns & Conversion Rate Optimization (CRO)"] },
      { title: "Module 4: Social Media, Content Automation & Web Analytics", topics: ["Social Media Content Calendar Strategy (LinkedIn, Instagram, YouTube)", "AI-Powered Content Copywriting (ChatGPT, Jasper)", "Email Marketing Automation & Lead Nurturing (Mailchimp/Klaviyo)", "Google Analytics 4 (GA4) Custom Dashboard Setup", "Live Brand Growth Campaign Capstone Project"] }
    ]
  },
  {
    slug: "business-analytics",
    title: "Business Analytics",
    category: "Management",
    duration: "6 Months",
    fees: "₹36,000",
    price: 36000,
    description: "Bridge the gap between business strategy and data science. Learn to use data analytics, SQL, and BI tools for corporate decision-making.",
    features: ["Data-Driven Decision Making", "KPI Tracking", "BI Tools", "Strategy Planning"],
    curriculum: [
      { title: "Module 1: Advanced Business Excel & Automation", topics: ["Advanced Lookup Functions (VLOOKUP, XLOOKUP, INDEX/MATCH)", "Pivot Tables, Slicers & Dynamic Charting", "Data Cleansing & Error Handling Techniques", "Financial Modeling & Business Math Functions", "VBA & Macro Automation Fundamentals"] },
      { title: "Module 2: SQL for Business Decision Making", topics: ["Relational Database Structures & SQL Basics", "Aggregations, Grouping & Business KPI Extraction", "Joins, Subqueries & CTEs for Complex Analysis", "Window Functions for Trend & Cohort Analysis", "Database Query Performance Optimization"] },
      { title: "Module 3: Business Intelligence with Power BI & Tableau", topics: ["Connecting & Cleaning Data with Power Query", "Data Modeling & Star Schema Architecture", "DAX Formulas & Measures for Business Metrics", "Interactive Tableau Dashboards & Story Points", "Executive Dashboard Publishing & Scheduled Refresh"] },
      { title: "Module 4: Predictive Business Analytics & Forecasting", topics: ["Linear & Multiple Regression for Sales Forecasting", "Customer Segmentation & RFM Analysis", "Customer Lifetime Value (CLV) & Churn Modeling", "Market Basket Analysis & Cross-Selling Insights", "Risk & Scenario Analysis (Monte Carlo Simulation)"] },
      { title: "Module 5: AI & Automation in Business Intelligence", topics: ["Prompt Engineering for Analytical Reports (ChatGPT/Claude)", "Automating Data Ingestion & ETL Pipelines", "Natural Language Queries in BI Tools", "Ethical AI & Data Governance Frameworks", "Executive Presentation Strategies"] },
      { title: "Module 6: Capstone Business Consulting Project", topics: ["Real-World Corporate Business Case Study", "End-to-End Data Extraction, Cleaning & Analysis", "Interactive Executive Dashboard Creation", "Final Strategic Business Recommendation Report", "Consulting Pitch Presentation"] }
    ]
  },
  {
    slug: "finance",
    title: "Finance",
    category: "Management",
    duration: "6 Months",
    fees: "₹36,000",
    price: 36000,
    description: "Gain deep expertise in corporate finance, financial modeling, valuation techniques, Indian tax compliance, and investment analysis.",
    features: ["Financial Modeling", "Valuation", "Risk Management", "FinTech Trends"],
    curriculum: [
      { title: "Module 1: Financial Accounting & Statement Analysis", topics: ["Understanding Balance Sheets, Income Statements & Cash Flows", "Financial Ratio Analysis (Liquidity, Solvency, Profitability)", "Working Capital Management", "Audit Standards & Financial Reporting", "Interpreting Annual Reports & SEC Filings"] },
      { title: "Module 2: Corporate Finance & Capital Budgeting", topics: ["Time Value of Money (TVM) & Discounting", "Cost of Capital (WACC Calculation)", "Capital Budgeting Techniques (NPV, IRR, Payback Period)", "Capital Structure & Leverage Analysis", "Corporate Dividend Policies"] },
      { title: "Module 3: Financial Modeling & Valuation Masterclass", topics: ["Excel Financial Modeling Best Practices", "Building 3-Statement Financial Models", "Discounted Cash Flow (DCF) Valuation Modeling", "Comparable Company Analysis (Comps) & Precedent Transactions", "Sensitivity & Scenario Analysis"] },
      { title: "Module 4: Tally Prime, GST & Indian Taxation Compliance", topics: ["Tally Prime Accounting Setup & Ledger Management", "GST Registration, Invoicing & E-Way Bills", "GSTR-1, GSTR-3B Return Filing Procedures", "Tax Deducted at Source (TDS) Calculation & Compliance", "Income Tax Filing & Direct Taxation Rules"] },
      { title: "Module 5: Investment Analysis & Portfolio Management", topics: ["Equity Research & Valuation Metrics (P/E, EV/EBITDA)", "Fixed Income Securities & Bond Yield Calculations", "Derivatives (Futures, Options & Hedging Strategies)", "Modern Portfolio Theory & Asset Allocation", "FinTech Trends & Algorithmic Trading Basics"] },
      { title: "Module 6: Comprehensive Corporate Finance Capstone", topics: ["Full Company Financial Model & DCF Valuation", "Mergers & Acquisitions (M&A) Deal Structuring", "Investment Pitch Deck Preparation", "Valuation Defense Presentation", "Career Guidance for Banking & Finance Roles"] }
    ]
  },
  {
    slug: "hr",
    title: "Human Resources (HR)",
    category: "Management",
    duration: "3 Months",
    fees: "₹36,000",
    price: 36000,
    description: "Learn modern HR management, talent acquisition, Indian statutory compliance, payroll automation, and HR analytics.",
    features: ["Talent Acquisition", "HR Analytics", "Labor Laws", "Organizational Behavior"],
    curriculum: [
      { title: "Module 1: Strategic Talent Acquisition & Recruitment", topics: ["End-to-End Recruitment Lifecycle Management", "Strategic Sourcing via LinkedIn Recruiter & Job Portals", "Writing Compelling Job Descriptions & Employer Branding", "Behavioral & Competency-Based Interviewing Techniques", "Offer Letter Negotiation & Candidate Experience"] },
      { title: "Module 2: Core HR Operations & Employee Engagement", topics: ["Employee Onboarding & Documentation Workflows", "Performance Management Systems (PMS: OKRs vs KPIs)", "Employee Engagement & Retention Strategies", "Conflict Resolution & Grievance Redressal", "Organizational Culture & Change Management"] },
      { title: "Module 3: Payroll Management & Indian Statutory Compliance", topics: ["Salary Structure Designing (CTC, Basic, HRA, Special Allowance)", "Provident Fund (PF), ESIC & Professional Tax (PT) Compliance", "Gratuity, Bonus Act & Leave Policy Drafting", "Payroll Software Automation & Tax Computations", "Indian Labour Laws & Workplace Compliance"] },
      { title: "Module 4: HR Analytics, HRIS & AI in Human Resources", topics: ["HRIS Software Implementation (Zoho People, Workday)", "People Analytics Metrics (Turnover Rate, Time-to-Hire, eNPS)", "Predictive Employee Retention Modeling", "AI Tools for Resume Screening & Talent Matching", "HR Project Capstone & Mock Interview Coaching"] }
    ]
  },
  {
    slug: "sales",
    title: "Sales & Business Development",
    category: "Management",
    duration: "3 Months",
    fees: "₹36,000",
    price: 36000,
    description: "Master consultative B2B & B2C selling, strategic negotiation, CRM pipeline management, and revenue growth strategies.",
    features: ["B2B Sales", "Negotiation Tactics", "CRM Mastery", "Lead Generation"],
    curriculum: [
      { title: "Module 1: Consultative Selling & Prospecting Masterclass", topics: ["B2B vs B2C Sales Funnel Architecture", "Cold Outreach via Email, Phone & LinkedIn Sales Navigator", "Prospect Qualification (BANT & MEDDPICC Frameworks)", "SPIN Selling & Challenger Sales Methodologies", "Crafting High-Converting Sales Pitches"] },
      { title: "Module 2: Strategic Negotiation & Closing Techniques", topics: ["Understanding Buyer Psychology & Pain Points", "Overcoming Pricing & Competition Objections", "Value-Based Selling vs Price Discounting", "Closing Tactics & Contract Negotiation", "Building Long-Term Client Trust & Rapport"] },
      { title: "Module 3: CRM Management & Sales Automation", topics: ["Salesforce & HubSpot CRM Setup & Administration", "Managing Sales Pipelines & Deal Stages", "Automating Lead Nurturing Workflows", "Sales Forecast Reporting & Metric Analysis", "AI Tools for Cold Email Writing & Lead Intelligence"] },
      { title: "Module 4: Key Account Management & Revenue Growth", topics: ["Key Account Management Strategies", "Upselling, Cross-Selling & Renewal Tactics", "Territory Planning & Quota Attainment", "RFP (Request for Proposal) Response Drafting", "Live Business Development Campaign Capstone Build"] }
    ]
  },

  // --- Design ---
  {
    slug: "ui-ux-design",
    title: "UI/UX Design",
    category: "Design",
    duration: "6 Months",
    fees: "₹36,000",
    price: 36000,
    description: "Design intuitive, beautiful, user-centric digital products. Master Figma, UX research, interactive prototyping, and design systems.",
    features: ["Figma Mastery", "User Research", "Prototyping", "Design Systems"],
    curriculum: [
      { title: "Module 1: Design Thinking & UX Research Methodology", topics: ["Double Diamond Design Thinking Framework", "User Research Methods (Interviews, Surveys, Contextual Inquiry)", "User Persona Creation & Empathy Mapping", "User Journey Mapping & Problem Statements", "Competitive UX Audits & Heuristic Evaluation"] },
      { title: "Module 2: Information Architecture & Wireframing", topics: ["Card Sorting & Information Architecture (IA)", "Creating Site Maps & App Task Flows", "Low-Fidelity Paper Sketching & Digital Wireframing", "Content Strategy & Copywriting for Interfaces", "Balsamiq & Figma Low-Fi Prototyping"] },
      { title: "Module 3: Visual UI Design & Figma Mastery", topics: ["Visual Hierarchy, Layout Grids & Composition", "Color Psychology & Accessible Palette Creation", "Typography Selection & Type Scale Systems", "Figma Advanced Tools (Auto-Layout, Constraints, Variants)", "Designing Components & UI Elements (Buttons, Inputs, Cards)"] },
      { title: "Module 4: Design Systems & Interactive Prototyping", topics: ["Building Scalable Design Systems & Token Architecture", "Figma Interactive Components & Micro-Animations", "Smart Animate & Advanced Transition Physics", "Designing for Mobile (iOS Human Interface / Material 3)", "Responsive Web Interface Design"] },
      { title: "Module 5: Usability Testing, Accessibility & AI Tools", topics: ["Conducting Moderated & Unmoderated Usability Tests", "Analyzing User Metrics & Iterating Designs", "WCAG 2.1 Accessibility Standards & Color Contrast", "AI Plugins for Figma & Asset Generation (Midjourney)", "Developer Handoff Specifications & Redlines"] },
      { title: "Module 6: Capstone UI/UX Project & Portfolio", topics: ["End-to-End Mobile App or Web Product Design Project", "Comprehensive UX Case Study Documentation", "Publishing Portfolio on Behance, Dribbble & Personal Site", "Interactive Prototype Presentation", "Design Interview Prep & Portfolio Defense"] }
    ]
  },
  {
    slug: "graphic-design",
    title: "Graphic Design",
    category: "Design",
    duration: "3 Months",
    fees: "₹36,000",
    price: 36000,
    description: "Master visual communication, vector illustration, photo retouching, and brand identity design using Adobe Creative Cloud.",
    features: ["Adobe Creative Cloud", "Branding", "Print & Digital Media", "Portfolio Build"],
    curriculum: [
      { title: "Module 1: Graphic Design Principles & Color Psychology", topics: ["Core Design Principles (Balance, Contrast, Alignment, Proximity)", "Color Theory, Harmonies & Psychological Impact", "Typography Masterclass (Font Pairing, Kerning, Tracking)", "Composition Grids & Golden Ratio in Design", "Visual Storytelling & Brand Concepts"] },
      { title: "Module 2: Vector Art & Logo Design with Adobe Illustrator", topics: ["Pen Tool Mastery & Vector Path Manipulation", "Logo Design Process & Mark Creation", "Iconography & Custom Vector Illustrations", "Brand Style Guide & Stationery Suite Creation", "Packaging & Label Design Fundamentals"] },
      { title: "Module 3: Photo Editing & Compositing with Adobe Photoshop", topics: ["Non-Destructive Image Editing & Layer Masks", "High-End Photo Retouching & Color Correction", "Advanced Compositing & Matte Painting Techniques", "Designing Social Media Creatives & Banners", "Generative AI Fill & Prompt Engineering in Photoshop"] },
      { title: "Module 4: Print Media with InDesign & Portfolio Build", topics: ["Adobe InDesign Page Layouts & Master Pages", "Brochure, Magazine & Catalog Design", "Pre-Press Preparation, Bleed, Crop & CMYK Exports", "Building a Professional Graphic Design Portfolio", "Freelancing & Client Project Management"] }
    ]
  },
  {
    slug: "motion-graphics",
    title: "Motion Graphics",
    category: "Design",
    duration: "3 Months",
    fees: "₹36,000",
    price: 36000,
    description: "Bring static designs to life. Master Adobe After Effects, kinetic typography, character animation, and visual effects.",
    features: ["After Effects", "Kinetic Typography", "2D Animation", "VFX Basics"],
    curriculum: [
      { title: "Module 1: Principles of Animation & Motion Basics", topics: ["12 Principles of Animation Applied to Motion Graphics", "Keyframe Types, Easing Curves & Speed Graphs", "Timeline Architecture & Composition Setup in After Effects", "Importing & Organizing Illustrator/Photoshop Assets", "Pre-compositions & Layer Parent-Child Hierarchy"] },
      { title: "Module 2: Shape Layers & Kinetic Typography", topics: ["Shape Layer Animators & Trim Paths", "Kinetic Typography Animation Techniques", "Text Animators, Range Selectors & Expressions", "Logo Animation & Motion Branding", "Infographic & Data Visualization Animation"] },
      { title: "Module 3: 3D Layers, Cameras & Visual Effects", topics: ["Working with 3D Layers & Lights in After Effects", "Camera Motion, Orbiting & Depth of Field", "Green Screen Chroma Keying & Rotoscoping", "Particle Systems (Particular) & Fractal Noise Effects", "Duik Bassel 2D Character Rigging & Animation"] },
      { title: "Module 4: Commercial Reel & Showreel Production", topics: ["Audio Synchronization & Sound Design Integration", "Third-Party Plugins (Element 3D, Motion 3)", "Render Queue & Adobe Media Encoder Compression", "Assembling a Professional Motion Design Showreel", "Portfolio Publishing & Client Presentation"] }
    ]
  },
  {
    slug: "video-editing",
    title: "Video Editing",
    category: "Design",
    duration: "3 Months",
    fees: "₹36,000",
    price: 36000,
    description: "Tell compelling visual stories. Master Adobe Premiere Pro, DaVinci Resolve color grading, audio engineering, and social content cuts.",
    features: ["Premiere Pro", "Color Grading", "Audio Mixing", "Storytelling"],
    curriculum: [
      { title: "Module 1: Video Editing Principles & Storytelling", topics: ["The Art of Editing: Cuts, Transitions & Pacing", "Analyzing Footage & Script/Storyboard Mapping", "File Management, Media Ingest & Proxy Workflows", "Rough Cut vs Fine Cut Editing Techniques", "B-Roll Placement & Narrative Pacing"] },
      { title: "Module 2: Adobe Premiere Pro Masterclass", topics: ["Timeline Editing Tools (Ripple, Roll, Slip, Slide)", "Multi-Camera Editing & Audio Syncing", "Text, Lower Thirds & Motion Graphics Templates (MOGRTs)", "Speed Ramping, Optical Flow & Time Remapping", "Green Screen Keying & Mask Tracking"] },
      { title: "Module 3: DaVinci Resolve & Professional Color Grading", topics: ["Color Correction vs Creative Color Grading", "Reading Scopes (Waveform, Vectorscope, Histogram)", "Primary & Secondary Color Adjustments", "Applying & Customizing LUTs (Look-Up Tables)", "DaVinci Resolve Node Architecture & Shot Matching"] },
      { title: "Module 4: Audio Engineering & Short-Form Content", topics: ["Audio Noise Reduction & Equalization (EQ)", "Sound Design, Foley & Background Score Mixing", "Editing High-Engagement Shorts, Reels & YouTube Content", "AI Auto-Reframing & Captions Generation", "Final Rendering Codecs & Master File Export"] }
    ]
  },
  {
    slug: "animation",
    title: "Animation",
    category: "Design",
    duration: "6 Months",
    fees: "₹36,000",
    price: 36000,
    description: "Master 3D animation, character modeling, rigging, texturing, and rendering in Blender and Maya for games, films, and VFX studios.",
    features: ["Blender/Maya", "Character Design", "3D Modeling", "Rigging"],
    curriculum: [
      { title: "Module 1: 3D Space & Hard-Surface Modeling", topics: ["Navigating 3D Viewports (Blender & Maya)", "Polygon Modeling Tools (Extrude, Bevel, Loop Cut)", "Hard-Surface Modeling (Props, Vehicles, Environments)", "Non-Destructive Modifiers & Sub-Division Surfaces", "3D Scene Composition & Camera Placement"] },
      { title: "Module 2: Texturing, Shading & UV Unwrapping", topics: ["UV Unwrapping & Seam Placement Techniques", "PBR (Physically Based Rendering) Shader Creation", "Texture Painting & Node-Based Materials", "Substance Painter Workflows for 3D Assets", "Lighting Setups (3-Point Lighting, HDRI Environment Maps)"] },
      { title: "Module 3: Character Rigging & Skeleton Setup", topics: ["Bones, Armatures & Skeleton Hierarchy Creation", "Inverse Kinematics (IK) vs Forward Kinematics (FK)", "Weight Painting & Vertex Group Skinning", "Custom Control Handles & Constraints", "Facial Rig Controls & Blend Shapes"] },
      { title: "Module 4: 3D Character Animation", topics: ["Applying 12 Animation Principles to 3D Space", "Walk & Run Cycles for Characters", "Weight, Balance, Anticipation & Momentum", "Acting, Body Language & Lip Sync Animation", "Graph Editor Curve Adjustment"] },
      { title: "Module 5: Rendering Engines & Visual Effects Compositing", topics: ["Raytracing Render Engines (Blender Cycles / Maya Arnold)", "Render Passes (AOV, Depth, Normal, Shadow Passes)", "Particle Systems & Physics Simulations (Cloth, Rigid Body)", "Compositing 3D Renders in After Effects / Nuke", "AI Denoisers & Render Optimization"] },
      { title: "Module 6: 3D Short Film Capstone & Showreel", topics: ["Pre-Production (Storyboarding & Animatic Creation)", "Complete 3D Short Film or Character Animation Project", "Post-Production Editing & Audio Integration", "Industry-Ready 3D Animation Showreel", "Portfolio Review & Placement Guidance for Game/VFX Studios"] }
    ]
  }
];

export function getCourseBySlug(slug: string): Course | undefined {
  const normalizedSlug = decodeURIComponent(slug).toLowerCase().replace(/[\s_]+/g, '-');
  return courses.find(course => course.slug === normalizedSlug);
}

