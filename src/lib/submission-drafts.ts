import { isHttpUrl } from '@/lib/contact-links';
import { getItem, removeItem, setItem } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import type {
  PendingSubmitDraft,
  Submission,
  SubmissionArtifact,
  Team,
  WarRoom,
} from '@/lib/types';

function getAllDrafts(): PendingSubmitDraft[] {
  return getItem<PendingSubmitDraft[]>(STORAGE_KEYS.PENDING_SUBMIT_DRAFTS) ?? [];
}

export function getPendingSubmitDraft(hackathonSlug: string): PendingSubmitDraft | null {
  return getAllDrafts().find(draft => draft.hackathonSlug === hackathonSlug) ?? null;
}

export function savePendingSubmitDraft(draft: PendingSubmitDraft): void {
  const otherDrafts = getAllDrafts().filter(entry => entry.hackathonSlug !== draft.hackathonSlug);
  setItem(STORAGE_KEYS.PENDING_SUBMIT_DRAFTS, [...otherDrafts, draft]);
}

export function clearPendingSubmitDraft(hackathonSlug: string): void {
  const nextDrafts = getAllDrafts().filter(entry => entry.hackathonSlug !== hackathonSlug);

  if (nextDrafts.length === 0) {
    removeItem(STORAGE_KEYS.PENDING_SUBMIT_DRAFTS);
    return;
  }

  setItem(STORAGE_KEYS.PENDING_SUBMIT_DRAFTS, nextDrafts);
}

function mergeNotes(existingNotes: string | undefined, nextLines: string[]): string {
  const baseLines =
    existingNotes
      ?.split('\n')
      .map(line => line.trim())
      .filter(Boolean) ?? [];

  for (const line of nextLines) {
    if (!baseLines.includes(line)) {
      baseLines.push(line);
    }
  }

  return baseLines.join('\n');
}

function promoteStage(submission: Submission, stage?: 'plan' | 'web' | 'pdf') {
  if (stage === 'plan') submission.planStatus = 'draft';
  if (stage === 'web') submission.webStatus = 'draft';
  if (stage === 'pdf') submission.pdfStatus = 'draft';
}

export function applyPendingSubmitDraftToTeam(team: Team): boolean {
  if (!team.hackathonSlug) return false;

  const draft = getPendingSubmitDraft(team.hackathonSlug);
  if (!draft) return false;

  const allWarRooms = getItem<WarRoom[]>(STORAGE_KEYS.WAR_ROOMS) ?? [];
  const existingWarRoom = allWarRooms.find(entry => entry.teamId === team.id);

  const warRoom: WarRoom = existingWarRoom ?? {
    id: `wr-${team.id}`,
    teamId: team.id,
    title: `${team.name} War Room`,
    summary: '',
    submissionStage: 'teaming',
    lastUpdated: new Date().toISOString(),
  };

  const allSubmissions = getItem<Submission[]>(STORAGE_KEYS.SUBMISSIONS) ?? [];
  const existingSubmission = allSubmissions.find(entry => entry.teamId === team.id);

  const submission: Submission = existingSubmission ?? {
    id: `sub-${team.id}`,
    teamId: team.id,
    hackathonSlug: team.hackathonSlug,
    planStatus: 'empty',
    webStatus: 'empty',
    pdfStatus: 'empty',
  };

  const draftNoteLines: string[] = [];

  if (draft.notes?.trim()) {
    draftNoteLines.push(draft.notes.trim());
  }

  for (const field of draft.fields) {
    const value = field.value.trim();
    if (!value) continue;

    const isValidUrlField = field.inputType === 'url' && isHttpUrl(value);
    const shouldPromoteStage =
      (field.inputType === 'text' && Boolean(field.stage)) ||
      (field.inputType === 'url' && Boolean(field.stage) && isValidUrlField);

    if (shouldPromoteStage) {
      promoteStage(submission, field.stage);
    }

    if (field.inputType !== 'url' || !field.artifactKind || !isValidUrlField) {
      draftNoteLines.push(`${field.label}: ${value}`);
    }
  }

  const mergedWarRoom: WarRoom = {
    ...warRoom,
    notes: mergeNotes(warRoom.notes, draftNoteLines),
    lastUpdated: draft.updatedAt,
  };

  setItem(
    STORAGE_KEYS.WAR_ROOMS,
    existingWarRoom
      ? allWarRooms.map(entry => (entry.id === mergedWarRoom.id ? mergedWarRoom : entry))
      : [...allWarRooms, mergedWarRoom],
  );

  setItem(
    STORAGE_KEYS.SUBMISSIONS,
    existingSubmission
      ? allSubmissions.map(entry => (entry.id === submission.id ? submission : entry))
      : [...allSubmissions, submission],
  );

  const allArtifacts = getItem<SubmissionArtifact[]>(STORAGE_KEYS.SUBMISSION_ARTIFACTS) ?? [];
  const existingArtifacts = allArtifacts.filter(entry => entry.submissionId === submission.id);
  const otherArtifacts = allArtifacts.filter(entry => entry.submissionId !== submission.id);
  const nextArtifacts = [...existingArtifacts];

  for (const field of draft.fields) {
    const value = field.value.trim();
    if (field.inputType !== 'url' || !field.artifactKind || !isHttpUrl(value)) continue;

    const duplicate = nextArtifacts.find(
      entry => entry.kind === field.artifactKind && entry.url === value,
    );

    if (!duplicate) {
      nextArtifacts.push({
        id: `sa-${field.key}-${Date.now()}-${nextArtifacts.length}`,
        submissionId: submission.id,
        kind: field.artifactKind,
        url: value,
        label: field.label,
      });
    }
  }

  setItem(STORAGE_KEYS.SUBMISSION_ARTIFACTS, [...otherArtifacts, ...nextArtifacts]);
  clearPendingSubmitDraft(team.hackathonSlug);

  return true;
}
