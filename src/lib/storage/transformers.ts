import { isValidPublicContactUrl } from '@/lib/contact-links';
import { getDisplayHackathonStatus } from '@/lib/hackathon-detail';
import type {
  Hackathon,
  HackathonSection,
  HackathonSectionType,
  LeaderboardEntry,
  Team,
} from '@/lib/types';

interface RawHackathon {
  slug: string;
  title: string;
  status: string;
  tags: string[];
  thumbnailUrl?: string;
  period: {
    submissionDeadlineAt: string;
    endAt: string;
  };
  links?: {
    rules?: string;
    faq?: string;
  };
}

interface RawDetailSections {
  [key: string]: unknown;
}

interface RawDetail {
  slug: string;
  title: string;
  sections: RawDetailSections;
  extraDetails?: RawDetail[];
}

interface RawTeam {
  teamCode: string;
  hackathonSlug: string;
  name: string;
  isOpen: boolean;
  memberCount: number;
  lookingFor: string[];
  intro: string;
  contact: { url: string };
  createdAt: string;
}

interface RawLeaderboardEntry {
  rank: number;
  teamName: string;
  score: number;
  submittedAt?: string;
  scoreBreakdown?: Record<string, number>;
}

interface RawLeaderboard {
  hackathonSlug: string;
  entries: RawLeaderboardEntry[];
  extraLeaderboards?: RawLeaderboard[];
}

const SECTION_TYPE_MAP: Record<string, HackathonSectionType> = {
  overview: 'overview',
  info: 'guide',
  eval: 'eval',
  schedule: 'schedule',
  prize: 'prize',
  teams: 'teams',
  submit: 'submit',
  leaderboard: 'leaderboard',
};

function buildSections(slug: string, raw: RawDetailSections): HackathonSection[] {
  return Object.entries(raw)
    .filter(([key]) => key in SECTION_TYPE_MAP)
    .map(([key, value], idx) => ({
      id: `${slug}-${key}`,
      hackathonSlug: slug,
      type: SECTION_TYPE_MAP[key],
      title: SECTION_TYPE_MAP[key].charAt(0).toUpperCase() + SECTION_TYPE_MAP[key].slice(1),
      content: JSON.stringify(value),
      displayOrder: idx + 1,
      isRequired: true,
    }));
}

function sumPrize(sections: RawDetailSections): number {
  const prize = sections.prize as { items?: { amountKRW: number }[] } | undefined;
  if (!prize?.items) return 0;
  return prize.items.reduce((sum, item) => sum + item.amountKRW, 0);
}

function extractSummary(sections: RawDetailSections): string {
  const overview = sections.overview as { summary?: string } | undefined;
  return overview?.summary ?? '';
}

function extractFirstMilestone(sections: RawDetailSections): string | undefined {
  const schedule = sections.schedule as { milestones?: { at: string }[] } | undefined;
  return schedule?.milestones?.[0]?.at;
}

export function transformHackathons(
  rawList: RawHackathon[],
  rawDetail: RawDetail,
): Hackathon[] {
  const allDetails: RawDetail[] = [rawDetail, ...(rawDetail.extraDetails ?? [])];
  const detailMap = new Map(allDetails.map(detail => [detail.slug, detail]));

  return rawList.map(hackathon => {
    const detail = detailMap.get(hackathon.slug);
    const sections = detail?.sections ?? {};
    const eventStartAt = extractFirstMilestone(sections);

    return {
      id: hackathon.slug,
      slug: hackathon.slug,
      title: hackathon.title,
      status: getDisplayHackathonStatus(
        hackathon.status as Hackathon['status'],
        hackathon.period.endAt,
      ),
      summary: extractSummary(sections),
      tags: hackathon.tags,
      thumbnailUrl: hackathon.thumbnailUrl,
      eventStartAt,
      eventEndAt: hackathon.period.endAt,
      registrationStartAt: eventStartAt,
      registrationEndAt: hackathon.period.submissionDeadlineAt,
      prizeTotalKRW: sumPrize(sections),
      sections: buildSections(hackathon.slug, sections),
    };
  });
}

export function transformTeams(rawTeams: RawTeam[]): Team[] {
  return rawTeams.map(team => ({
    id: team.teamCode,
    hackathonSlug: team.hackathonSlug,
    name: team.name,
    intro: team.intro,
    isOpen: team.isOpen,
    lookingFor: team.lookingFor,
    contactUrl: isValidPublicContactUrl(team.contact.url) ? team.contact.url : undefined,
    memberCount: team.memberCount,
    createdAt: team.createdAt,
  }));
}

export function transformLeaderboard(raw: RawLeaderboard): LeaderboardEntry[] {
  const allBoards: RawLeaderboard[] = [raw, ...(raw.extraLeaderboards ?? [])];

  return allBoards.flatMap(board =>
    board.entries.map(entry => ({
      id: `${board.hackathonSlug}-rank-${entry.rank}`,
      hackathonSlug: board.hackathonSlug,
      subjectType: 'team' as const,
      subjectId: entry.teamName.toLowerCase().replace(/\s+/g, '-'),
      name: entry.teamName,
      rank: entry.rank,
      score: entry.score,
      status: 'ranked' as const,
      scoreBreakdown: entry.scoreBreakdown,
    })),
  );
}
