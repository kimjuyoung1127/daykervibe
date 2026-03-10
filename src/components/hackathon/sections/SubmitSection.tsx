'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isHttpUrl } from '@/lib/contact-links';
import { getItem } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import { getPendingSubmitDraft, savePendingSubmitDraft } from '@/lib/submission-drafts';
import type {
  ArtifactKind,
  HackathonStatus,
  PendingSubmitDraftField,
  PendingSubmitInputType,
  Team,
} from '@/lib/types';
import PixelButton from '@/components/ui/PixelButton';

interface SubmitData {
  guide?: string[];
  submissionItems?: {
    key: string;
    title: string;
    format: string;
  }[];
  submissionUrl?: string;
  allowedArtifactTypes?: string[];
  sourceLimited?: boolean;
}

interface FieldConfig {
  key: string;
  label: string;
  inputType: PendingSubmitInputType;
  stage?: 'plan' | 'web' | 'pdf';
  artifactKind?: ArtifactKind;
  placeholder?: string;
  helperText?: string;
  multiline?: boolean;
}

const SUBMISSION_ITEM_CONFIG: Record<
  string,
  Pick<FieldConfig, 'inputType' | 'stage' | 'artifactKind' | 'placeholder' | 'multiline'>
> = {
  plan: {
    inputType: 'text',
    stage: 'plan',
    artifactKind: 'plan_url',
    placeholder: '기획 요약이나 참고 문서 링크를 적어두세요.',
    multiline: true,
  },
  web: {
    inputType: 'url',
    stage: 'web',
    artifactKind: 'web_url',
    placeholder: 'https://',
  },
  pdf: {
    inputType: 'url',
    stage: 'pdf',
    artifactKind: 'pdf_url',
    placeholder: 'https://',
  },
};

const ARTIFACT_TYPE_CONFIG: Record<
  string,
  Pick<
    FieldConfig,
    'key' | 'label' | 'inputType' | 'stage' | 'artifactKind' | 'placeholder' | 'multiline'
  >
> = {
  text: {
    key: 'text',
    label: '제출 내용',
    inputType: 'text',
    stage: 'plan',
    placeholder: '제출 초안 요약이나 전달 메모를 적어두세요.',
    multiline: true,
  },
  url: {
    key: 'url',
    label: '웹 링크',
    inputType: 'url',
    stage: 'web',
    artifactKind: 'web_url',
    placeholder: 'https://',
  },
  pdf: {
    key: 'pdf',
    label: 'PDF 링크',
    inputType: 'url',
    stage: 'pdf',
    artifactKind: 'pdf_url',
    placeholder: 'https://',
  },
};

function isNoteOnlyFileRequirement(value: string): boolean {
  const normalized = value.toLowerCase();
  return normalized.includes('zip') || normalized.includes('csv') || normalized.includes('pdf file');
}

function createNoteOnlyFileFields(baseKey: string, title: string): FieldConfig[] {
  return [
    {
      key: `${baseKey}-file-name`,
      label: `${title} 준비 파일명`,
      inputType: 'text',
      placeholder: '예: submission.zip',
      helperText: '이 패널에서는 준비 메모만 저장합니다.',
      multiline: false,
    },
    {
      key: `${baseKey}-file-note`,
      label: `${title} 파일 준비 메모`,
      inputType: 'text',
      placeholder: '업로드 전 체크 포인트나 파일 상태를 적어두세요.',
      helperText: '실제 파일 관리와 최종 제출 확정은 작전실에서 이어집니다.',
      multiline: true,
    },
  ];
}

function buildFieldConfigs(data: SubmitData): FieldConfig[] {
  const fields: FieldConfig[] = [];

  if (data.submissionItems?.length) {
    for (const item of data.submissionItems) {
      if (isNoteOnlyFileRequirement(item.format)) {
        fields.push(...createNoteOnlyFileFields(item.key, item.title));
        continue;
      }

      const defaults = SUBMISSION_ITEM_CONFIG[item.key];
      const inputType = defaults?.inputType ?? (item.format.includes('url') ? 'url' : 'text');

      fields.push({
        key: item.key,
        label: item.title,
        inputType,
        stage: defaults?.stage,
        artifactKind: defaults?.artifactKind,
        placeholder: defaults?.placeholder,
        multiline: defaults?.multiline ?? inputType !== 'url',
        helperText:
          inputType === 'url'
            ? '유효한 http/https URL만 제출 준비 상태와 링크 기록에 반영됩니다.'
            : undefined,
      });
    }
  }

  if (fields.length === 0 && data.allowedArtifactTypes?.length) {
    for (const artifactType of data.allowedArtifactTypes) {
      if (artifactType === 'zip' || artifactType === 'csv') {
        fields.push(...createNoteOnlyFileFields(artifactType, artifactType.toUpperCase()));
        continue;
      }

      const config = ARTIFACT_TYPE_CONFIG[artifactType];
      if (!config) continue;

      fields.push({
        key: config.key,
        label: config.label,
        inputType: config.inputType,
        stage: config.stage,
        artifactKind: config.artifactKind,
        placeholder: config.placeholder,
        multiline: config.multiline,
        helperText:
          config.inputType === 'url'
            ? '유효한 http/https URL만 제출 준비 상태와 링크 기록에 반영됩니다.'
            : undefined,
      });
    }
  }

  return fields;
}

function toDraftFields(
  fieldConfigs: FieldConfig[],
  fieldValues: Record<string, string>,
): PendingSubmitDraftField[] {
  return fieldConfigs.map(field => ({
    key: field.key,
    label: field.label,
    inputType: field.inputType,
    value: fieldValues[field.key] ?? '',
    stage: field.stage,
    artifactKind: field.artifactKind,
  }));
}

export default function SubmitSection({
  content,
  hackathonSlug,
  hackathonStatus,
}: {
  content: string;
  hackathonSlug: string;
  hackathonStatus: HackathonStatus;
}) {
  const router = useRouter();
  const data = useMemo(() => JSON.parse(content) as SubmitData, [content]);
  const fieldConfigs = useMemo(() => buildFieldConfigs(data), [data]);
  const [matchingTeams, setMatchingTeams] = useState<Team[]>([]);
  const [notes, setNotes] = useState('');
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const isEnded = hackathonStatus === 'ended';

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;

      const teams = getItem<Team[]>(STORAGE_KEYS.TEAMS) ?? [];
      setMatchingTeams(teams.filter(team => team.hackathonSlug === hackathonSlug));

      const pendingDraft = getPendingSubmitDraft(hackathonSlug);
      if (!pendingDraft || isEnded) return;

      setNotes(pendingDraft.notes ?? '');
      setFieldValues(
        pendingDraft.fields.reduce<Record<string, string>>((acc, field) => {
          acc[field.key] = field.value;
          return acc;
        }, {}),
      );
    });

    return () => {
      cancelled = true;
    };
  }, [hackathonSlug, isEnded]);

  const primaryHref =
    matchingTeams.length === 1
      ? `/war-room/${matchingTeams[0].id}`
      : `/camp?hackathon=${encodeURIComponent(hackathonSlug)}`;
  const primaryLabel =
    matchingTeams.length === 1 ? '작전실에서 제출 준비하기' : '팀 찾고 제출 준비하기';
  const externalSubmissionUrl =
    !isEnded && data.submissionUrl && isHttpUrl(data.submissionUrl) ? data.submissionUrl : undefined;

  function updateFieldValue(key: string, value: string) {
    setFieldValues(current => ({
      ...current,
      [key]: value,
    }));
  }

  function handleContinue() {
    savePendingSubmitDraft({
      hackathonSlug,
      notes: notes.trim() || undefined,
      fields: toDraftFields(fieldConfigs, fieldValues),
      updatedAt: new Date().toISOString(),
    });

    router.push(primaryHref);
  }

  return (
    <div className="space-y-4">
      {data.guide && data.guide.length > 0 && (
        <div className="rounded-sm border border-dark-border bg-dark-border/50 p-4">
          <h4 className="mb-3 font-pixel text-[10px] text-accent-yellow">SUBMISSION GUIDE</h4>
          <ol className="space-y-2">
            {data.guide.map((guide, index) => (
              <li key={guide} className="flex gap-2 font-dunggeunmo text-sm text-card-white/80">
                <span className="font-pixel text-[10px] text-accent-orange">{index + 1}.</span>
                <span>{guide}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="space-y-4 rounded-sm border-2 border-dark-border p-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="font-pixel text-[10px] text-accent-mint">
              {isEnded ? 'SUBMISSION CLOSED' : 'MINIMAL SUBMIT PANEL'}
            </h4>
            {!isEnded && matchingTeams.length === 1 && (
              <span className="font-dunggeunmo text-xs text-card-white/50">
                로컬 팀: {matchingTeams[0].name}
              </span>
            )}
          </div>

          {isEnded ? (
            <>
              <p className="font-dunggeunmo text-sm text-card-white/70">
                이 해커톤의 제출 기간은 종료되었습니다. 공개 상세에서는 제출 아카이브 상태만
                확인할 수 있습니다.
              </p>
              <p className="font-dunggeunmo text-xs text-card-white/50">
                종료된 해커톤에서는 새 제출 초안 저장, 작전실 진입, 캠프 기반 팀 찾기 같은 준비
                액션을 노출하지 않습니다.
              </p>
            </>
          ) : (
            <>
              <p className="font-dunggeunmo text-sm text-card-white/70">
                공개 상세에서는 최소 제출 초안만 저장하고, 실제 팀 단위 제출 관리와 링크 확정은
                작전실에서 이어집니다.
              </p>
              <p className="font-dunggeunmo text-xs text-card-white/50">
                파일형 제출 항목은 업로드가 아니라 준비 메모로만 저장됩니다. 유효한 http/https URL만
                제출 준비 상태와 링크 기록에 반영됩니다.
              </p>
            </>
          )}

          {data.sourceLimited && (
            <p className="font-dunggeunmo text-xs text-card-white/50">
              {isEnded
                ? '현재는 공개 가능한 기록만 표시합니다. 공식 제출 형식 세부는 공개 소스에 남아 있지 않습니다.'
                : '현재는 공개된 정보 범위 안에서 초안만 저장할 수 있습니다. 공식 제출 형식은 이후 공지 기준으로 보완될 수 있습니다.'}
            </p>
          )}
        </div>

        {!isEnded && (
          <>
            <div>
              <label className="mb-1 block font-dunggeunmo text-xs text-card-white/60">
                제출 메모
              </label>
              <textarea
                value={notes}
                onChange={event => setNotes(event.target.value)}
                rows={4}
                className="w-full border-2 border-dark-border bg-dark-bg/30 px-3 py-2 font-dunggeunmo text-sm text-card-white"
                placeholder="아이디어 요약, 제출 누락, 제출 전 확인 메모 등을 적어둘 수 있습니다."
              />
            </div>

            {fieldConfigs.length > 0 && (
              <div className="space-y-3">
                {fieldConfigs.map(field => (
                  <div key={field.key}>
                    <label className="mb-1 block font-dunggeunmo text-xs text-card-white/60">
                      {field.label}
                    </label>
                    {field.multiline ? (
                      <textarea
                        value={fieldValues[field.key] ?? ''}
                        onChange={event => updateFieldValue(field.key, event.target.value)}
                        rows={3}
                        className="w-full border-2 border-dark-border bg-dark-bg/30 px-3 py-2 font-dunggeunmo text-sm text-card-white"
                        placeholder={field.placeholder}
                      />
                    ) : (
                      <input
                        value={fieldValues[field.key] ?? ''}
                        onChange={event => updateFieldValue(field.key, event.target.value)}
                        className="w-full border-2 border-dark-border bg-dark-bg/30 px-3 py-2 font-dunggeunmo text-sm text-card-white"
                        placeholder={field.placeholder}
                        inputMode={field.inputType === 'url' ? 'url' : 'text'}
                      />
                    )}
                    {field.helperText && (
                      <p className="mt-1 font-dunggeunmo text-xs text-card-white/45">
                        {field.helperText}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <PixelButton onClick={handleContinue}>{primaryLabel}</PixelButton>
              {externalSubmissionUrl && (
                <PixelButton href={externalSubmissionUrl} variant="ghost">
                  공식 제출 페이지
                </PixelButton>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
