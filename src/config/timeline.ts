export interface TimelineEvent {
  type: 'work' | 'edu' | 'achievement';
  date: string;
  sortDate: string; // Used to chronologically order the rail
  title: string;
  role: string;
  location: string;
  highlight?: string;
  link?: string;
  projectDetail?: {
    subtitle: string;
    description: string;
    metrics: string[];
    tags: string[];
    artifactSlug: string;
  };
}

export const timelineEvents: TimelineEvent[] = [
  {
    type: 'edu',
    date: 'Jun 2019',
    sortDate: '2019-06',
    title: 'B.Tech CS',
    role: 'VIT Amaravati Begins',
    location: 'Amaravati',
    highlight: 'Started foundational engineering studies'
  },
  {
    type: 'work',
    date: '2022',
    sortDate: '2022-06',
    title: 'Matchday AI',
    role: 'Computer Vision Intern',
    location: 'Hyderabad',
    highlight: 'Real-time 3D perception PyTorch pipelines',
    projectDetail: {
      subtitle: 'Computer Vision Pipelines',
      description: 'Engineered OpenCV and PyTorch pipelines for live match broadcast analytics and 3D perception.',
      metrics: ['Real-time 3D', 'PyTorch/OpenCV', 'Live broadcast'],
      tags: ['Computer Vision', 'AI Engineer'],
      artifactSlug: 'matchday'
    }
  },
  {
    type: 'edu',
    date: 'May 2023',
    sortDate: '2023-05',
    title: 'B.Tech CS',
    role: 'Graduated',
    location: 'Amaravati',
    highlight: 'Earned degree focusing on core computation'
  },
  {
    type: 'work',
    date: 'Jun 2023',
    sortDate: '2023-06',
    title: 'Oriana IT',
    role: 'Full-Stack Intern',
    location: 'Chennai',
    highlight: 'Engineered responsive web applications'
  },
  {
    type: 'work',
    date: 'Jul 2023',
    sortDate: '2023-07',
    title: 'HCLTech',
    role: 'Software Engineer',
    location: 'Chennai',
    highlight: 'Sub-100ms latency model-serving APIs',
    projectDetail: {
      subtitle: 'Model-Serving Backend Services',
      description: 'Developed Python RESTful APIs serving scikit-learn/TensorFlow ML pipelines and optimized large-scale data retrieval in SQL/Hadoop.',
      metrics: ['Sub-100ms latency', 'Hadoop/SQL', 'RESTful APIs'],
      tags: ['Backend Engineer', 'ML Engineer'],
      artifactSlug: 'hcltech'
    }
  },
  {
    type: 'edu',
    date: 'Jan 2024',
    sortDate: '2024-01',
    title: 'M.S. CS',
    role: 'Stony Brook Begins',
    location: 'New York',
    highlight: 'Advanced graduate coursework in ML/Systems'
  },
  {
    type: 'achievement',
    date: 'Jan 2025',
    sortDate: '2025-01',
    title: 'LOGOSYN',
    role: 'NexHacks Hackathon',
    location: 'New York',
    highlight: 'Trust layer for uncertain telemetry',
    link: 'https://devpost.com/software/logosyn'
  },
  {
    type: 'work',
    date: 'Jun 2024',
    sortDate: '2024-06',
    title: 'Stony Brook KSL',
    role: 'Graduate Researcher',
    location: 'New York',
    highlight: '4.2B sample clinical AI validation platform'
  },
  {
    type: 'edu',
    date: 'May 2025',
    sortDate: '2025-05',
    title: 'Thesis',
    role: 'Published (ProQuest)',
    location: 'New York',
    highlight: 'Feature-fusion and LLM safety publication'
  },
  {
    type: 'edu',
    date: 'Dec 2025',
    sortDate: '2025-12',
    title: 'M.S. CS',
    role: 'Graduated (GPA 4.0)',
    location: 'New York',
    highlight: 'Completed with perfect academic standing'
  }
];

