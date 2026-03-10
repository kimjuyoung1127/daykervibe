/** @visibility public */
export type HackathonStatus = 'upcoming' | 'ongoing' | 'ended';

/** @visibility public */
export type HackathonSectionType =
  | 'overview' | 'guide' | 'eval' | 'schedule'
  | 'prize' | 'teams' | 'submit' | 'leaderboard';

/** @visibility public */
export interface HackathonSection {
  id: string;
  hackathonSlug: string;
  type: HackathonSectionType;
  title: string;
  /** JSON-stringified or markdown content */
  content: string;
  displayOrder: number;
  isRequired: boolean;
}

/** @visibility public */
export interface Hackathon {
  id: string;
  slug: string;
  title: string;
  status: HackathonStatus;
  summary: string;
  tags: string[];
  eventStartAt: string;
  eventEndAt: string;
  registrationStartAt: string;
  registrationEndAt: string;
  teamCount?: number;
  viewCount?: number;
  prizeTotalKRW: number;
  thumbnailUrl?: string;
  sections: HackathonSection[];
}
