// Every piece of text on the site lives here. Edit this file to change content.

export const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const ASSET_BASE = process.env.NEXT_PUBLIC_ASSET_BASE ?? BASE;
export const asset = (p: string) => `${ASSET_BASE}${p}`;

export const site = {
  firstName: "Abhishek",
  fullName: "Abhishek Chugh",
  role: "Software Developer",
  roleLong: "Backend, DevOps & MLOps",
  focus: "/BACKEND · DEVOPS · MLOPS",
  location: "Cologne, Germany",
  email: "abhishekchugh707@gmail.com",
  github: "https://github.com/abhishekchugh707",
  linkedin: "https://www.linkedin.com/in/abhishekchugh707",
  // Web3Forms access key: public by design, it only lets the form send to this inbox.
  formKey: "a544eeef-d9cc-491c-86b8-3c8fa2057db2",
  cv: "/Abhishek_Chugh_CV.pdf",
  description:
    "Abhishek Chugh, software developer in Germany. Backends, data and ML pipelines, and the CI/CD that ships them.",
};

export const bio = {
  status: "Open to full-time roles",
  latest: {
    org: "Fraunhofer IAO",
    title: "Software Developer · Full Stack",
    place: "Stuttgart, Germany",
  },
  lead: [
    { t: "I build " },
    { t: "production backends", b: true },
    { t: " and " },
    { t: "ML pipelines", b: true },
    { t: ", plus the CI/CD that ships them." },
  ],
};

export const skills = [
  {
    id: "backend",
    title: "Backend & Full-Stack",
    note: "REST services, microservices, auth, and the frontends on top",
    items: ["Python", "Java", "TypeScript", "FastAPI", "Node.js", "SQLAlchemy", "OAuth2 / Keycloak", "Angular", "React"],
  },
  {
    id: "ml",
    title: "ML & MLOps",
    note: "Forecasting, model selection, experiment tracking, LLM tooling",
    items: ["MLflow", "PyTorch", "scikit-learn", "Transformers", "Time-series forecasting", "DSPy", "LLMs"],
  },
  {
    id: "data",
    title: "Data, DevOps & Cloud",
    note: "Databases, streaming pipelines, containers and delivery",
    items: ["PostgreSQL", "TimescaleDB", "SQL", "Kafka", "Spark", "Neo4j", "Docker", "CI/CD", "Git", "Linux", "Google Cloud"],
  },
];

export type Project = {
  id: string;
  name: string;
  caption: string;
  action: string;
  category: string;
  icon: "chart" | "shield" | "graph" | "text" | "agent" | "radar";
  /** Optional picture in public/projects/. Without one, a drawn icon is shown. */
  image?: string;
  tint: string;
  summary: string;
  stack: string[];
  facts: { k: string; v: string }[];
  stats: { v: string; k: string }[];
  body: string[];
  links?: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    id: "genpro",
    name: "GenPro",
    caption: "Fraunhofer IAO · Case study",
    action: "Read case study",
    category: "Energy production forecasting platform",
    icon: "chart",
    image: "/projects/genpro.webp",
    tint: "#d1d2cf",
    summary:
      "A platform that lets plant operators (solar, wind, hydro and more) forecast their production from their own data. I built it end to end: data ingestion, model training, a REST API and a real-time dashboard.",
    stack: ["FastAPI", "PyTorch", "scikit-learn", "MLflow", "PostgreSQL / TimescaleDB", "Angular", "ECharts", "Keycloak", "Docker", "CI/CD"],
    facts: [
      { k: "Role", v: "Software Developer" },
      { k: "Ownership", v: "Data layer to dashboard" },
      { k: "Where", v: "Fraunhofer IAO, Stuttgart" },
      { k: "When", v: "2024 – 2026" },
    ],
    stats: [
      { v: "0.97", k: "Best R² (0.92 on average)" },
      { v: "9", k: "Models compared per operator" },
      { v: "~60%", k: "Less deployment effort" },
      { v: "<200 ms", k: "Live updates in the EV simulator" },
    ],
    body: [
      "Designed an automated model-selection pipeline that trains and compares 9 models (4 PyTorch Transformers, 5 scikit-learn variants) on each operator's data, tracked in MLflow.",
      "Built the backend services that store sensor data and serve forecasts: FastAPI, PostgreSQL/TimescaleDB, Open-Meteo weather data, and one SQLAlchemy layer shared across microservices.",
      "Created the dashboard where operators log in and compare forecasts with actual production (Angular, ECharts, OAuth2 + Keycloak).",
      "Set up CI/CD with automated pytest suites for every microservice, and delivered a real-time EV charging station simulator.",
    ],
  },
  {
    id: "jobmatch",
    name: "Job Match Agent",
    caption: "RAG + agents · 2026",
    action: "View project",
    category: "Ask questions about job postings in plain language",
    icon: "agent",
    image: "/projects/jobmatch.webp",
    links: [{ label: "Source on GitHub", href: "https://github.com/abhishekchugh707/job-match-agent" }],
    tint: "#d5d1e0",
    summary:
      "A RAG system and tool-calling agent that answers questions about job postings. Every statement cites its source posting, and the agent decides on its own whether to search, open, compare or find skill gaps.",
    stack: ["Python", "FastAPI", "PostgreSQL", "pgvector", "Gemini API", "RAG", "MCP", "CI"],
    facts: [
      { k: "Type", v: "Personal project" },
      { k: "Focus", v: "Grounded answers, agents, evaluation" },
      { k: "Interfaces", v: "REST API and MCP server" },
      { k: "When", v: "2026" },
    ],
    stats: [
      { v: "21/21", k: "Right job ranked first" },
      { v: "3/3", k: "Unanswerable questions declined" },
      { v: "24", k: "Questions in the eval suite" },
      { v: "0", k: "Uncited claims kept" },
    ],
    body: [
      "Every answer cites the posting it came from; citations to postings the model was never given are removed automatically.",
      "Fixed a classic weakness of semantic search, which treats \"remote position\" and \"no remote work\" as near-identical: exact database filters for remote work, location and hard requirements run first.",
      "A tool-calling agent chooses its own steps (search, open a posting, compare jobs, find skill gaps) and logs a trace of each one. The same tools are exposed to other AI apps through an MCP server.",
      "Retries and automatic fallback between Gemini models keep requests working when a model is overloaded. The test suite runs in CI against a real PostgreSQL database on every push.",
    ],
  },
  {
    id: "jobscanner",
    name: "Job Scanner",
    caption: "Job search tool · 2026",
    action: "View project",
    category: "Finds new jobs at the source, minutes after they go live",
    icon: "radar",
    image: "/projects/jobscanner.webp",
    links: [{ label: "Source on GitHub", href: "https://github.com/abhishekchugh707/job-scanner" }],
    tint: "#c7cdc7",
    summary:
      "A job search tool that reads company careers pages directly instead of waiting for job boards, then ranks every posting against my skills and flags where I know someone for a referral.",
    stack: ["Python", "REST APIs", "SQLite", "Embeddings", "Bundesagentur für Arbeit API"],
    facts: [
      { k: "Type", v: "Personal tool, used daily" },
      { k: "Sources", v: "Careers pages, hiring platforms, BA API" },
      { k: "Matching", v: "Weighted scoring + multilingual embeddings" },
      { k: "When", v: "2026" },
    ],
    stats: [
      { v: "185+", k: "Company careers pages read directly" },
      { v: "10", k: "Hiring platforms supported" },
      { v: "Minutes", k: "From posting to my list" },
    ],
    body: [
      "Reads 185+ careers pages through 10 hiring platforms and the Bundesagentur für Arbeit API, so new postings show up minutes after they go live, often before the job boards.",
      "Ranks every job against my skills with weighted scoring and a multilingual embedding model, and filters out roles that don't fit on seniority, location or other hard requirements.",
      "Connects to my LinkedIn network: jobs at companies where I know someone are flagged, so I can ask for a referral first.",
      "Grows its own coverage by adding the careers feed of any new company it finds. Duplicates are merged, and a \"why didn't I see this job?\" check shows which filter dropped a posting.",
    ],
  },
  {
    id: "thesis",
    name: "AI Security",
    caption: "Master thesis · 2025",
    action: "View project",
    category: "Preventing unauthorized access to AI model APIs in MLOps",
    icon: "shield",
    image: "/projects/thesis.webp",
    tint: "#dcd6cc",
    summary:
      "API keys and JWTs secure most AI model APIs today, but they were built for web apps, not machine-to-machine pipelines. I attacked each method to see what actually holds up.",
    stack: ["FastAPI", "Auth0", "OAuth 2.0", "JWT", "API keys", "Hugging Face", "OWASP API Top 10"],
    facts: [
      { k: "Type", v: "M.Sc. thesis, Universität Stuttgart" },
      { k: "Method", v: "PRISMA review + attack testbed" },
      { k: "Compared", v: "API keys, JWT, OAuth 2.0" },
      { k: "When", v: "2025" },
    ],
    stats: [
      { v: "4", k: "Attack types run on each method" },
      { v: "3,000", k: "Requests benchmarked per method" },
      { v: "3", k: "Deployment settings with recommendations" },
    ],
    body: [
      "Ran a systematic literature review (PRISMA) on how AI model APIs are secured in practice.",
      "Built a FastAPI testbed with Auth0 and Hugging Face endpoints, and ran token replay, key leakage, expired token and OAuth misconfiguration attacks following the OWASP API Security Top 10.",
      "Showed that stolen tokens could be reused with both JWT and OAuth 2.0 unless bound to the sender (DPoP, mTLS), and that a leaked API key kept working until replaced by hand.",
      "Turned the security, integration-effort and latency trade-offs into recommendations for public APIs, internal microservices and CI/CD pipelines.",
    ],
  },
  {
    id: "kg",
    name: "TransitKG",
    caption: "Real-time data pipeline · 2024",
    action: "View project",
    category: "Knowledge graphs in analytical architectures",
    icon: "graph",
    image: "/projects/transitkg.webp",
    tint: "#cfd3d8",
    summary:
      "A real-time pipeline for live public transport data from Stuttgart's VVS network, ending in a Neo4j graph you can query in plain language.",
    stack: ["Kafka", "Spark", "Apache Hudi", "MinIO", "Neo4j", "Cypher", "DistilBERT"],
    facts: [
      { k: "Type", v: "University project" },
      { k: "Data", v: "Live VVS transport feed" },
      { k: "Pipeline", v: "Kafka → MinIO → Spark/Hudi → Neo4j" },
      { k: "When", v: "2024" },
    ],
    stats: [
      { v: "3", k: "Data products shipped" },
      { v: "Live", k: "Status for every line" },
    ],
    body: [
      "Streamed live transport data through Kafka into MinIO, processed it with Spark and Hudi, then loaded it into Neo4j for graph queries.",
      "Designed the graph model (stations, routes, platforms, vehicles) and wrote the Cypher queries for connectivity, line status and platform usage.",
      "Delivered a live transport status dashboard, a platform usage analysis tool, and a Q&A interface that turns plain-language questions into Cypher with DistilBERT.",
    ],
  },
  {
    id: "nlp",
    name: "News Sentiment",
    caption: "NLP benchmarking · 2024",
    action: "View project",
    category: "Reputation and sentiment classification on German news",
    icon: "text",
    image: "/projects/news.webp",
    tint: "#e0d9cf",
    summary:
      "Compared 8 language models on sorting German news articles by reputation topic and sentiment, and found that smaller fine-tuned models beat the big LLMs.",
    stack: ["Hugging Face", "Llama 2 7B", "Flan-T5", "BERT", "XLM-RoBERTa", "DSPy", "Quantization"],
    facts: [
      { k: "Type", v: "University project" },
      { k: "Task", v: "Multilabel classification" },
      { k: "Best model", v: "XLM-RoBERTa Large" },
      { k: "When", v: "2024" },
    ],
    stats: [
      { v: "8", k: "Language models compared" },
      { v: "0.73", k: "Best macro F1" },
      { v: "4-bit", k: "Quantized Llama 2" },
    ],
    body: [
      "Compared Llama 2 7B, Flan-T5, BERT variants and XLM-RoBERTa on reputation topic and sentiment for German news.",
      "Applied 4-bit quantization and L1 pruning to Llama 2 7B to cut size and compute with minimal accuracy loss.",
      "Used DSPy for systematic prompt optimization, and found fine-tuned smaller models (German BERT, XLM-RoBERTa) outperformed larger LLMs on this task.",
    ],
  },
];

export const experience = [
  {
    id: "fraunhofer",
    badge: "Most recent",
    date: "Oct 2024 – Sep 2026",
    title: "Software Developer",
    place: "Fraunhofer IAO",
    city: "Stuttgart",
    text: "Built GenPro end to end, from the data layer to the operator dashboard, and set up CI/CD for every service.",
  },
  {
    id: "msc",
    date: "2022 – 2026",
    title: "M.Sc. Software Engineering",
    place: "Universität Stuttgart",
    text: "Thesis on preventing unauthorized access to AI model APIs in MLOps.",
  },
  {
    id: "avery",
    date: "Dec 2023 – Jun 2024",
    title: "Data Migration Engineer",
    place: "Avery Dennison Smartrac",
    city: "Working student",
    text: "SQL extraction of 20M+ rows and automated field mapping for a platform migration.",
  },
  {
    id: "schedule",
    date: "May 2023 – Nov 2023",
    title: "Software Developer",
    place: "Schedule Display",
    city: "Working student",
    text: "Meeting-room displays in Java, Node.js and React on Firebase. Queries up to 40% faster.",
  },
];

// Shown faintly behind the hero title.
export const heroCode = `const abhishek = {
  name: "Abhishek Chugh",
  role: "Software Developer",
  focus: ["Backend & APIs", "DevOps", "ML & MLOps"],
  based: "Cologne, Germany",
  experience: [
    { role: "Software Developer · Full Stack",
      company: "Fraunhofer IAO", city: "Stuttgart",
      project: "GenPro", r2: 0.97, deployEffort: "-60%" },
    { role: "Data Migration Engineer",
      company: "Avery Dennison Smartrac", rows: "20M+" },
    { role: "Software Developer",
      company: "Schedule Display", fasterQueries: "40%" }
  ],
  education: [
    { degree: "M.Sc. Software Engineering",
      university: "Universität Stuttgart", until: 2026 },
    { degree: "B.Tech. Electronics & Telecom",
      university: "Bhilai Institute of Technology" }
  ],
  thesis: "Preventing unauthorized access to AI model APIs",
  skills: {
    backend: ["Python", "Java", "TypeScript", "FastAPI",
      "Node.js", "SQLAlchemy", "OAuth2", "Keycloak"],
    ml: ["MLflow", "PyTorch", "scikit-learn", "Transformers"],
    data: ["PostgreSQL", "TimescaleDB", "Kafka", "Spark",
      "Neo4j", "Docker", "CI/CD", "Google Cloud"]
  },
  languages: ["English", "Hindi", "German B1"],
  email: "abhishekchugh707@gmail.com",
  github: "github.com/abhishekchugh707",
  openTo: ["Backend", "DevOps", "Full-stack", "ML/MLOps"]
};

export default function Portfolio() {
  return <main>
    <header><h1>{abhishek.name}</h1><p>{abhishek.role}</p></header>
    {abhishek.experience.map(job => <article key={job.company}>
      <h3>{job.role}</h3><p>{job.company}</p>
    </article>)}
    <footer><a href={"mailto:" + abhishek.email}>Let's talk.</a></footer>
  </main>;
}`;
