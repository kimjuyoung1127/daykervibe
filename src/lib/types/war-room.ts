/** @visibility team-local */
export type SubmissionStage = 'teaming' | 'plan' | 'web' | 'pdf' | 'done';

/** @visibility team-local */
export type WorkflowColumn = 'plan' | 'web' | 'pdf' | 'submitted';

/** @visibility team-local */
export type ChecklistStatus = 'todo' | 'doing' | 'done';

/** @visibility team-local */
export interface WarRoom {
  id: string;
  teamId: string;
  title: string;
  summary: string;
  submissionStage: SubmissionStage;
  nextActionLabel?: string;
  lastUpdated: string;
  notes?: string;
}

/** @visibility team-local */
export interface WarRoomWorkflowCard {
  id: string;
  warRoomId: string;
  title: string;
  column: WorkflowColumn;
  order: number;
  ownerLabel?: string;
  dueLabel?: string;
  notes?: string;
  isBlocked: boolean;
}

/** @visibility team-local */
export interface WarRoomChecklistItem {
  id: string;
  warRoomId: string;
  label: string;
  status: ChecklistStatus;
  assigneeLabel?: string;
  dueAt?: string;
}
