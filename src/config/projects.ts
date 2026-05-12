export const projects = [
  {
    id: 'CF-001',
    title: 'Multi-Camera BEV Perception',
    subtitle: 'Autonomous Driving Lift-Splat-Shoot System',
    description: 'Engineered an end-to-end perception pipeline fusing 6 surround-view cameras into a unified bird\u2019s-eye-view using Lift-Splat-Shoot, with CenterPoint detection achieving 29.4 mAP on nuScenes val. Added temporal multi-object tracking (ByteTrack + Kalman filter) achieving 27.1 AMOTA.',
    tags: ['AI Engineer', 'ML Engineer'],
    year: '2025',
    metrics: ['29.4 mAP', '27.1 AMOTA', 'nuScenes'],
    slug: 'bev-perception',
    github: 'https://github.com/preethamdandu/Multi-Camera-BEV-Perception-System'
  },
  {
    id: 'CF-002',
    title: 'FinSignal',
    subtitle: 'End-to-End ML Pipeline for Document Intelligence',
    description: 'Built a production ML pipeline with fine-tuned transformer models and custom entity extraction, processing 500+ documents with automated evaluation; engineered scalable data ingestion, vector indexing, and model serving infrastructure reducing manual analysis time by 65%.',
    tags: ['AI Engineer', 'ML Engineer', 'Backend Engineer'],
    year: '2025',
    metrics: ['0.78 NDCG@10', '<1s retrieval', 'PostgreSQL/Redis'],
    slug: 'finsignal-nlp',
    github: 'https://github.com/preethamdandu/FinSignal'
  },
  {
    id: 'CF-003',
    title: 'Knowledge Systems Lab',
    subtitle: '3-Tier Platform + Feature Fusion + LLM Safety for Clinical AI',
    description: 'Architected PostgreSQL platform ingesting 4.2B signal samples \u00b7 0.892 AUROC feature-fusion model \u00b7 \u03ba = 0.82 LLM safety pipeline. Published as M.S. thesis.',
    tags: ['ML Engineer', 'AI Engineer', 'Backend Engineer'],
    year: '2024\u20132025',
    metrics: ['4.2B samples', '0.892 AUROC', '\u03ba = 0.82'],
    slug: 'ksl-thesis',
    github: 'https://github.com/preethamdandu/ksl-thesis'
  },
  {
    id: 'CF-004',
    title: 'FinGuard',
    subtitle: 'Cloud-Native Payment & Expense Platform',
    description: 'Architected Java microservices platform with a Python anomaly engine, reducing fraud by 30%.',
    tags: ['Backend Engineer', 'Software Engineer'],
    year: '2024\u20132025',
    metrics: ['100% RBAC coverage', '30% fraud reduction', '1,000+ users'],
    slug: 'finguard',
    github: 'https://github.com/preethamdandu/FinGaurd'
  },
  {
    id: 'CF-008',
    title: 'Tuniegenie',
    subtitle: 'LLM-Powered Music Recommender',
    description: 'Built a multi-agent AI system combining collaborative filtering (Surprise) with GPT-4 contextual enhancements. Automated playlist curation reduced manual effort by 99.5%, applying RLHF feedback loops to continuously tune personalization.',
    tags: ['AI Engineer', 'ML Engineer'],
    year: '2025',
    metrics: ['99.5% effort drop', '2.84s exec time', 'GPT-4/LangChain'],
    slug: 'unie-genie',
    github: 'https://github.com/preethamdandu/tunie-music-app'
  },
  {
    id: 'CF-009',
    title: 'Global University Rankings Explorer',
    subtitle: 'Interactive Analytics Dashboard',
    description: 'Built a high-performance Flask & D3.js dashboard enabling visual analytics across worldwide universities. Curated a proportional, country-aware dataset, reducing served payload size by 29% to accelerate client-side rendering.',
    tags: ['Software Engineer', 'Data Visualization'],
    year: '2024\u20132025',
    metrics: ['29% size reduction', 'D3.js / Flask', 'Real-time filtering'],
    slug: 'university-explorer',
    github: 'https://github.com/preethamdandu/university-explorer'
  },
  {
    id: 'CF-010',
    title: 'Fault-Tolerant Distributed Systems',
    subtitle: 'Consensus Engineering in Go',
    description: 'Developed and optimized distributed consensus protocols. Modified Raft for linearizable transactions and implemented PBFT to guarantee Byzantine fault tolerance and strict cluster replication sync.',
    tags: ['Backend Engineer', 'Distributed Systems'],
    year: '2024\u20132025',
    metrics: ['100% Txn Integrity', '99.99% Node Uptime', 'Golang'],
    slug: 'raft-pbft',
    github: 'https://github.com/preethamdandu/raft-pbft'
  },
  {
    id: 'CF-011',
    title: 'NeuroSearch Agent',
    subtitle: 'Autonomous Semantic Knowledge Retrieval',
    description: 'Engineered an autonomous agentic pipeline utilizing Microsoft Semantic Kernel and LLMs for executing complex analytical workflows and dense semantic queries across knowledge graphs.',
    tags: ['AI Engineer', 'Backend Engineer'],
    year: '2024\u20132025',
    metrics: ['Autonomous Execution', 'Zero-shot Routing', 'Semantic Kernel'],
    slug: 'neurosearch-agent',
    github: 'https://github.com/preethamdandu/neurosearch-agent'
  }
];
