/** @visibility public */
export interface RankingProfile {
  id: string;
  nickname: string;
  points: number;
  period: '7d' | '30d' | 'all';
  activitySummary?: string;
}
