import { formatDateTime, formatPrize } from '@/lib/format';
import type {
  Hackathon,
  HackathonSection,
  HackathonSectionType,
  HackathonStatus,
} from '@/lib/types';

export const REQUIRED_HACKATHON_SECTION_TYPES: HackathonSectionType[] = [
  'overview',
  'guide',
  'eval',
  'schedule',
  'prize',
  'teams',
  'submit',
  'leaderboard',
];

type SourceLimitedContent = {
  state: 'source-limited';
  title?: string;
  message?: string;
  rows?: { label: string; value: string }[];
  note?: string;
  campEnabled?: boolean;
  guide?: string[];
  allowedArtifactTypes?: string[];
  sourceLimited?: boolean;
};

export function getDisplayHackathonStatus(
  status: HackathonStatus,
  eventEndAt: string,
  now = Date.now(),
): HackathonStatus {
  if (new Date(eventEndAt).getTime() < now) return 'ended';
  return status;
}

function buildSourceLimitedContent(
  hackathon: Hackathon,
  sectionType: HackathonSectionType,
): SourceLimitedContent {
  switch (sectionType) {
    case 'overview':
      return {
        state: 'source-limited',
        title: 'OVERVIEW LIMITED',
        message: '공식 상세 소개가 아직 공개되지 않았습니다.',
      };
    case 'guide':
      return {
        state: 'source-limited',
        title: 'GUIDE LIMITED',
        message: '세부 안내 항목이 아직 공개되지 않았습니다.',
      };
    case 'eval':
      return {
        state: 'source-limited',
        title: 'EVAL LIMITED',
        message: '평가 기준의 상세 정보가 아직 공개되지 않았습니다.',
      };
    case 'schedule':
      return {
        state: 'source-limited',
        title: 'SCHEDULE LIMITED',
        message: '현재는 공개된 일정 범위만 확인할 수 있습니다.',
        rows: [
          { label: '접수 시작', value: formatDateTime(hackathon.registrationStartAt) },
          { label: '접수 마감', value: formatDateTime(hackathon.registrationEndAt) },
          { label: '행사 시작', value: formatDateTime(hackathon.eventStartAt) },
          { label: '행사 종료', value: formatDateTime(hackathon.eventEndAt) },
        ],
      };
    case 'prize':
      return {
        state: 'source-limited',
        title: 'PRIZE LIMITED',
        message:
          hackathon.prizeTotalKRW > 0
            ? '현재는 공개된 상금 정보만 확인할 수 있습니다.'
            : '상금 정보가 아직 공개되지 않았습니다.',
        rows:
          hackathon.prizeTotalKRW > 0
            ? [{ label: '총 상금', value: formatPrize(hackathon.prizeTotalKRW) }]
            : [],
      };
    case 'teams':
      return {
        state: 'source-limited',
        sourceLimited: true,
        campEnabled: hackathon.status !== 'ended',
      };
    case 'submit':
      return {
        state: 'source-limited',
        sourceLimited: true,
        guide:
          hackathon.status === 'ended'
            ? [
                '이 해커톤의 제출 기간은 종료되었습니다.',
                '현재는 공개 가능한 기록만 확인할 수 있습니다.',
              ]
            : [
                '공식 제출 형식이나 세부 제출 구조가 아직 공개되지 않았습니다.',
                '지금은 제출 준비 초안만 저장하고, 다음 흐름으로 이어갈 수 있습니다.',
              ],
        allowedArtifactTypes: [],
      };
    case 'leaderboard':
      return {
        state: 'source-limited',
        title: 'LEADERBOARD LIMITED',
        message: '공개 리더보드 상세 안내가 아직 제공되지 않았습니다.',
      };
  }
}

export function createSourceLimitedSection(
  hackathon: Hackathon,
  sectionType: HackathonSectionType,
  displayOrder: number,
): HackathonSection {
  return {
    id: `${hackathon.slug}-${sectionType}-source-limited`,
    hackathonSlug: hackathon.slug,
    type: sectionType,
    title: sectionType,
    content: JSON.stringify(buildSourceLimitedContent(hackathon, sectionType)),
    displayOrder,
    isRequired: true,
  };
}

export function getHackathonSectionsWithFallback(hackathon: Hackathon): HackathonSection[] {
  return REQUIRED_HACKATHON_SECTION_TYPES.map((sectionType, index) => {
    const existing = hackathon.sections.find(section => section.type === sectionType);
    return existing ?? createSourceLimitedSection(hackathon, sectionType, index + 1);
  });
}
