/** @visibility public */
export interface LeaderboardEntry {
  id: string;
  hackathonSlug: string;
  subjectType: 'team' | 'user';
  subjectId: string;
  name: string;
  rank?: number;
  score: number;
  status: 'ranked' | 'not_submitted';
  scoreBreakdown?: Record<string, number>;
}
