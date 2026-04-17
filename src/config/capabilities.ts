import { RoleId } from './roles';

export const capabilities: Record<RoleId, { description: string; stack: string[] }> = {
  swe: {
    description: 'End-to-end product engineering across web, services, and data layers.',
    stack: ['Python', 'TypeScript', 'React · Next.js', 'Node.js', 'FastAPI · Flask', 'Docker · K8s', 'AWS · Azure', 'Vercel']
  },
  backend: {
    description: 'Distributed systems engineered for throughput, fault-tolerance, and sub-10ms p99.',
    stack: ['Go', 'Java (Spring Boot)', 'gRPC · Kafka', 'Redis · Postgres', 'Raft · PBFT', 'Kubernetes · HPA', 'Prometheus · Grafana']
  },
  ai: {
    description: 'LLM agents, RAG, and safety-validated reasoning pipelines. Structured prompting as an engineering discipline.',
    stack: ['Claude · GPT-4', 'LangGraph', 'Semantic Kernel', 'FAISS · Qdrant', 'Chain-of-Thought', 'RAG · Few-Shot', 'LLM Safety Eval']
  },
  ml: {
    description: 'Production ML pipelines, feature engineering, and model serving at scale.',
    stack: ['PyTorch', 'scikit-learn', 'TensorFlow', 'Feature Fusion', 'LSTM-Attention', 'FinBERT · spaCy', 'ETL @ 4.2B rows']
  }
};
