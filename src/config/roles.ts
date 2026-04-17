export const roles = [
  { id: 'swe',     label: 'Software Engineer', tint: 'var(--tag-swe)',     metricValue: '100%',   metricLabel: 'OWASP pass rate' },
  { id: 'backend', label: 'Backend Engineer',  tint: 'var(--tag-backend)', metricValue: '19,200', metricLabel: 'RPS sustained' },
  { id: 'ai',      label: 'AI Engineer',       tint: 'var(--tag-ai)',      metricValue: 'κ 0.82', metricLabel: 'FDA-grade agreement' },
  { id: 'ml',      label: 'ML Engineer',       tint: 'var(--tag-ml)',      metricValue: '0.892',  metricLabel: 'AUROC fused model' },
] as const;

export type RoleId = (typeof roles)[number]['id'];
export type Role = (typeof roles)[number];
