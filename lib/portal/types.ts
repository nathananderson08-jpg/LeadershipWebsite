// ═══════════════════════════════════════
// Database Types
// ═══════════════════════════════════════

export type UserRole = 'primary_admin' | 'admin' | 'practitioner';
export type SeniorityLevel = 'senior' | 'junior';
export type PipelineStage = 'identifying' | 'partially_identified' | 'fully_identified';
export type AssignmentStatus = 'invited' | 'accepted' | 'confirmed' | 'declined' | 'rejected';
export type AvailabilityType = 'available' | 'blocked';
export type ProgramType = 'coaching' | 'top_team' | 'transformational';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  seniority: SeniorityLevel | null;
  program_types: ProgramType[];
  phone: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface Program {
  id: string;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string;
  location: string | null;
  senior_required: number;
  junior_required: number;
  pipeline_stage: PipelineStage;
  google_event_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProgramAssignment {
  id: string;
  program_id: string;
  practitioner_id: string;
  role_in_program: SeniorityLevel;
  status: AssignmentStatus;
  invitation_token: string;
  invited_at: string;
  responded_at: string | null;
}

export interface AvailabilityBlock {
  id: string;
  practitioner_id: string;
  start_date: string;
  end_date: string;
  type: AvailabilityType;
  note: string | null;
  created_at: string;
}

// ═══════════════════════════════════════
// Extended types (with joins)
// ═══════════════════════════════════════

export interface ProgramWithAssignments extends Program {
  assignments: (ProgramAssignment & { practitioner: Profile })[];
}

export interface AssignmentWithDetails extends ProgramAssignment {
  program: Program;
  practitioner: Profile;
}

// ═══════════════════════════════════════
// Form types
// ═══════════════════════════════════════

export interface CreateProgramInput {
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  location?: string;
  senior_required: number;
  junior_required: number;
}

export interface CreateUserInput {
  email: string;
  full_name: string;
  role: UserRole;
  seniority?: SeniorityLevel;
  program_types?: ProgramType[];
  phone?: string;
  bio?: string;
}

export interface AvailabilityInput {
  start_date: string;
  end_date: string;
  type: AvailabilityType;
  note?: string;
}
