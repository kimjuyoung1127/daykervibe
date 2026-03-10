import type { Hackathon, HackathonSection, HackathonSectionType, Team, LeaderboardEntry } from '@/lib/types';

/* ── Raw JSON shapes ── */

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

/* ── Helpers ── */

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
  return prize.items.reduce((sum, i) => sum + i.amountKRW, 0);
}

function extractSummary(sections: RawDetailSections): string {
  const ov = sections.overview as { summary?: string } | undefined;
  return ov?.summary ?? '';
}

function extractFirstMilestone(sections: RawDetailSections): string {
  const sched = sections.schedule as { milestones?: { at: string }[] } | undefined;
  return sched?.milestones?.[0]?.at ?? new Date().toISOString();
}

/* ── Public transformers ── */

export function transformHackathons(
  rawList: RawHackathon[],
  rawDetail: RawDetail,
): Hackathon[] {
  // Collect all details (primary + extras)
  const allDetails: RawDetail[] = [rawDetail, ...(rawDetail.extraDetails ?? [])];
  const detailMap = new Map(allDetails.map(d => [d.slug, d]));

  return rawList.map(h => {
    const detail = detailMap.get(h.slug);
    const sections = detail?.sections ?? {};
    const eventStartAt = extractFirstMilestone(sections);

    return {
      id: h.slug,
      slug: h.slug,
      title: h.title,
      status: h.status as Hackathon['status'],
      summary: extractSummary(sections),
      tags: h.tags,
      thumbnailUrl: h.thumbnailUrl,
      eventStartAt,
      eventEndAt: h.period.endAt,
      registrationStartAt: eventStartAt,
      registrationEndAt: h.period.submissionDeadlineAt,
      prizeTotalKRW: sumPrize(sections),
      sections: buildSections(h.slug, sections),
    };
  });
}

export function transformTeams(rawTeams: RawTeam[]): Team[] {
  return rawTeams.map(t => ({
    id: t.teamCode,
    hackathonSlug: t.hackathonSlug,
    name: t.name,
    intro: t.intro,
    isOpen: t.isOpen,
    lookingFor: t.lookingFor,
    contactUrl: t.contact.url,
    memberCount: t.memberCount,
    createdAt: t.createdAt,
  }));
}

export function transformLeaderboard(raw: RawLeaderboard): LeaderboardEntry[] {
  const allBoards: RawLeaderboard[] = [raw, ...(raw.extraLeaderboards ?? [])];

  return allBoards.flatMap(board =>
    board.entries.map(e => ({
      id: `${board.hackathonSlug}-rank-${e.rank}`,
      hackathonSlug: board.hackathonSlug,
      subjectType: 'team' as const,
      subjectId: e.teamName.toLowerCase().replace(/\s+/g, '-'),
      name: e.teamName,
      rank: e.rank,
      score: e.score,
      status: 'ranked' as const,
      scoreBreakdown: e.scoreBreakdown,
    })),
  );
}
