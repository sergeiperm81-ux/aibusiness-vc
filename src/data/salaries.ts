export interface AISalary {
  id: string;
  role: string;
  avgSalary: string;
  salaryRange: string;
  demandGrowth: string;
  experience: string;
  topCompanies: string[];
  skills: string[];
  description: string;
  remoteAvailability: string;
}

export const salaries: AISalary[] = [
  {
    id: "ai-research-scientist",
    role: "AI Research Scientist",
    avgSalary: "$235,000",
    salaryRange: "$150,000 — $489,000",
    demandGrowth: "+42%",
    experience: "PhD + 2-5 years",
    topCompanies: ["Google DeepMind", "OpenAI", "Anthropic", "Meta FAIR", "Microsoft Research"],
    skills: ["PyTorch", "Transformers", "Research methodology", "Mathematics", "Paper writing"],
    description: "Conduct fundamental AI research. Publish papers, develop new architectures, and push the boundaries of what AI can do.",
    remoteAvailability: "Hybrid (most require some onsite)",
  },
  {
    id: "machine-learning-engineer",
    role: "Machine Learning Engineer",
    avgSalary: "$206,000",
    salaryRange: "$150,000 — $451,000",
    demandGrowth: "+38%",
    experience: "3-5 years",
    topCompanies: ["Google", "Meta", "Amazon", "Apple", "Netflix", "Stripe"],
    skills: ["Python", "PyTorch/TensorFlow", "MLOps", "Data pipelines", "Cloud (AWS/GCP)"],
    description: "Build, train, and deploy machine learning models in production. Bridge the gap between research and real-world applications.",
    remoteAvailability: "Hybrid to Remote",
  },
  {
    id: "ai-engineer",
    role: "AI Engineer",
    avgSalary: "$185,000",
    salaryRange: "$130,000 — $350,000",
    demandGrowth: "+56%",
    experience: "2-4 years",
    topCompanies: ["OpenAI", "Anthropic", "Vercel", "Databricks", "Snowflake"],
    skills: ["LLM APIs", "RAG", "Vector databases", "Python", "Prompt engineering"],
    description: "Build AI-powered applications using LLMs and foundation models. The hottest engineering role of 2026.",
    remoteAvailability: "Remote-friendly",
  },
  {
    id: "prompt-engineer",
    role: "Prompt Engineer",
    avgSalary: "$136,407",
    salaryRange: "$101,000 — $192,000",
    demandGrowth: "+135.8%",
    experience: "1-3 years",
    topCompanies: ["Anthropic", "OpenAI", "Scale AI", "Salesforce", "Adobe"],
    skills: ["LLM understanding", "Clear communication", "Testing methodology", "JSON/APIs", "Domain expertise"],
    description: "Design and optimize prompts for AI models. Fastest-growing AI role with 135.8% demand surge.",
    remoteAvailability: "Highly remote-friendly",
  },
  {
    id: "mlops-engineer",
    role: "MLOps Engineer",
    avgSalary: "$178,000",
    salaryRange: "$140,000 — $280,000",
    demandGrowth: "+45%",
    experience: "3-5 years",
    topCompanies: ["Databricks", "AWS", "Google", "Microsoft", "Uber"],
    skills: ["Kubernetes", "Docker", "CI/CD", "ML monitoring", "Cloud infrastructure"],
    description: "Manage the infrastructure for ML model deployment, monitoring, and scaling. 10-15% premium over standard ML roles.",
    remoteAvailability: "Hybrid to Remote",
  },
  {
    id: "nlp-engineer",
    role: "NLP Engineer",
    avgSalary: "$175,000",
    salaryRange: "$140,000 — $280,000",
    demandGrowth: "+33%",
    experience: "2-5 years",
    topCompanies: ["Google", "OpenAI", "Cohere", "Hugging Face", "Grammarly"],
    skills: ["Transformers", "BERT/GPT architectures", "Text processing", "Python", "Linguistics"],
    description: "Specialize in natural language processing — text understanding, generation, and analysis.",
    remoteAvailability: "Remote-friendly",
  },
  {
    id: "computer-vision-engineer",
    role: "Computer Vision Engineer",
    avgSalary: "$172,000",
    salaryRange: "$140,000 — $280,000",
    demandGrowth: "+28%",
    experience: "3-5 years",
    topCompanies: ["Tesla", "Waymo", "Apple", "NVIDIA", "Meta"],
    skills: ["CNNs", "Object detection", "Image segmentation", "OpenCV", "PyTorch"],
    description: "Build systems that understand images and video — autonomous driving, medical imaging, robotics.",
    remoteAvailability: "Mostly Hybrid/Onsite",
  },
  {
    id: "ai-product-manager",
    role: "AI Product Manager",
    avgSalary: "$168,000",
    salaryRange: "$130,000 — $250,000",
    demandGrowth: "+40%",
    experience: "3-7 years PM + AI knowledge",
    topCompanies: ["Google", "Microsoft", "Salesforce", "HubSpot", "Notion"],
    skills: ["Product strategy", "AI/ML literacy", "Data analysis", "Stakeholder management", "User research"],
    description: "Define and deliver AI-powered products. Bridge between technical AI teams and business goals.",
    remoteAvailability: "Hybrid to Remote",
  },
  {
    id: "ai-ethics-researcher",
    role: "AI Ethics & Safety Researcher",
    avgSalary: "$158,000",
    salaryRange: "$120,000 — $220,000",
    demandGrowth: "+62%",
    experience: "2-5 years",
    topCompanies: ["Anthropic", "OpenAI", "Google DeepMind", "Partnership on AI", "RAND"],
    skills: ["AI safety", "Alignment research", "Policy analysis", "Red teaming", "Technical writing"],
    description: "Ensure AI systems are safe, fair, and aligned with human values. Fastest-growing non-engineering AI role.",
    remoteAvailability: "Remote-friendly",
  },
  {
    id: "data-annotator",
    role: "AI Data Annotator / Trainer",
    avgSalary: "$47,270",
    salaryRange: "$35,000 — $100,000+",
    demandGrowth: "+25%",
    experience: "None required",
    topCompanies: ["Scale AI", "DataAnnotation.tech", "Outlier AI", "Appen", "Mindrift"],
    skills: ["Attention to detail", "English fluency", "Domain knowledge (bonus)", "Following instructions"],
    description: "Train AI models by labeling data and evaluating outputs. Entry-level gateway to AI careers. Domain experts earn $50-100/hr.",
    remoteAvailability: "Fully Remote",
  },
  {
    id: "chief-ai-officer",
    role: "Chief AI Officer (CAIO)",
    avgSalary: "$351,766",
    salaryRange: "$250,000 — $643,731",
    demandGrowth: "+300%",
    experience: "10+ years",
    topCompanies: ["Fortune 500 companies across all industries"],
    skills: ["AI strategy", "Executive leadership", "Change management", "Technical breadth", "Business acumen"],
    description: "Lead AI strategy at the executive level. The newest C-suite title with explosive demand.",
    remoteAvailability: "Hybrid/Onsite",
  },
];

export function getSalaryById(id: string): AISalary | undefined {
  return salaries.find((s) => s.id === id);
}
