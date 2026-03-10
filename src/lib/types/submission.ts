/** @visibility public (notes is team-local) */
export type SubmissionStatus = 'empty' | 'draft' | 'submitted';

/** @visibility team-local */
export type ArtifactKind = 'plan_url' | 'web_url' | 'github_url' | 'pdf_url';

/** @visibility browser-local */
export type PendingSubmitInputType = 'text' | 'url' | 'file';

export interface Submission {
  id: string;
  /** @visibility public */
  hackathonSlug: string;
  /** @visibility public */
  teamId?: string;
  /** @visibility public */
  planStatus: SubmissionStatus;
  /** @visibility public */
  webStatus: SubmissionStatus;
  /** @visibility public */
  pdfStatus: SubmissionStatus;
  /** @visibility team-local */
  notes?: string;
  /** @visibility public */
  submittedAt?: string;
}

/** @visibility team-local */
export interface SubmissionArtifact {
  id: string;
  submissionId: string;
  kind: ArtifactKind;
  url: string;
  label?: string;
}

/** @visibility browser-local */
export interface PendingSubmitDraftField {
  key: string;
  label: string;
  inputType: PendingSubmitInputType;
  value: string;
  stage?: 'plan' | 'web' | 'pdf';
  artifactKind?: ArtifactKind;
}

/** @visibility browser-local */
export interface PendingSubmitDraft {
  hackathonSlug: string;
  notes?: string;
  fields: PendingSubmitDraftField[];
  updatedAt: string;
}
