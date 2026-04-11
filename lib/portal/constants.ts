import type { PipelineStage, UserRole, ProgramType } from './types';

export const PIPELINE_STAGES: { key: PipelineStage; label: string; color: string }[] = [
  { key: 'identifying', label: 'Identifying Practitioners', color: '#f59e0b' },
  { key: 'partially_identified', label: 'Partially Identified', color: '#3b82f6' },
  { key: 'fully_identified', label: 'Fully Identified', color: '#10b981' },
];

export const ROLE_LABELS: Record<UserRole, string> = {
  primary_admin: 'Primary Admin',
  admin: 'Admin',
  practitioner: 'Practitioner',
};

export const SENIORITY_LABELS = {
  senior: 'Senior Practitioner',
  junior: 'Junior Practitioner',
} as const;

export const PROGRAM_TYPE_LABELS: Record<ProgramType, string> = {
  coaching: 'Coaching',
  top_team: 'Top Team',
  transformational: 'Transformational',
};

export const PROGRAM_TYPE_COLORS: Record<ProgramType, { bg: string; text: string; border: string }> = {
  coaching: { bg: 'rgba(108, 140, 255, 0.1)', text: '#6c8cff', border: 'rgba(108, 140, 255, 0.2)' },
  top_team: { bg: 'rgba(212, 175, 55, 0.1)', text: '#d4af37', border: 'rgba(212, 175, 55, 0.2)' },
  transformational: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981', border: 'rgba(16, 185, 129, 0.2)' },
};

export const ALL_PROGRAM_TYPES: ProgramType[] = ['coaching', 'top_team', 'transformational'];

export const ASSIGNMENT_STATUS_LABELS = {
  invited: 'Invited',
  accepted: 'Accepted',
  confirmed: 'Confirmed',
  declined: 'Declined',
  rejected: 'Rejected',
} as const;

export const ASSIGNMENT_STATUS_COLORS = {
  invited: '#c4a35a',
  accepted: '#6c8cff',
  confirmed: '#7ba57b',
  declined: '#c47272',
  rejected: '#c47272',
} as const;
