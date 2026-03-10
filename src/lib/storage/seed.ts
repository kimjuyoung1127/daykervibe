import { STORAGE_KEYS, SEEDED_FLAG } from './keys';
import { getItem, hasItem, setItem } from './local-storage';
import { transformHackathons, transformLeaderboard, transformTeams } from './transformers';

import rawHackathons from '../../../hackathonsjson/public_hackathons.json';
import rawDetail from '../../../hackathonsjson/public_hackathon_detail.json';
import rawLeaderboard from '../../../hackathonsjson/public_leaderboard.json';
import rawTeams from '../../../hackathonsjson/public_teams.json';

import type { RankingProfile, Team } from '@/lib/types';

function syncPublicData(): Team[] {
  const publicHackathons = transformHackathons(
    rawHackathons as Parameters<typeof transformHackathons>[0],
    rawDetail as Parameters<typeof transformHackathons>[1],
  );
  const publicTeams = transformTeams(rawTeams as Parameters<typeof transformTeams>[0]);
  const publicLeaderboard = transformLeaderboard(
    rawLeaderboard as Parameters<typeof transformLeaderboard>[0],
  );

  const storedTeams = getItem<Team[]>(STORAGE_KEYS.TEAMS) ?? [];
  const publicTeamIds = new Set(publicTeams.map(team => team.id));
  const customTeams = storedTeams.filter(team => !publicTeamIds.has(team.id));
  const mergedTeams = [...publicTeams, ...customTeams];

  const teamCounts = mergedTeams.reduce<Record<string, number>>((acc, team) => {
    if (team.hackathonSlug) {
      acc[team.hackathonSlug] = (acc[team.hackathonSlug] ?? 0) + 1;
    }
    return acc;
  }, {});

  const mergedHackathons = publicHackathons.map(hackathon => ({
    ...hackathon,
    teamCount: teamCounts[hackathon.slug] ?? 0,
  }));

  setItem(STORAGE_KEYS.HACKATHONS, mergedHackathons);
  setItem(STORAGE_KEYS.TEAMS, mergedTeams);
  setItem(STORAGE_KEYS.LEADERBOARDS, publicLeaderboard);

  return mergedTeams;
}

function seedRankings(): void {
  const rankings: RankingProfile[] = [
    { id: 'r-1', nickname: 'PixelMaster', points: 2850, period: 'all', activitySummary: '3 contests, 1 win' },
    { id: 'r-2', nickname: 'CodeNinja', points: 2340, period: 'all', activitySummary: '2 contests, 1 runner-up' },
    { id: 'r-3', nickname: 'Jason', points: 1920, period: 'all', activitySummary: '2 contests, strong contribution score' },
    { id: 'r-4', nickname: 'ByteRunner', points: 1650, period: 'all', activitySummary: '1 contest, steady finisher' },
    { id: 'r-5', nickname: 'Ari', points: 1420, period: 'all', activitySummary: '2 contests entered' },
    { id: 'r-6', nickname: 'DevExplorer', points: 1100, period: 'all', activitySummary: '1 contest entered' },
    { id: 'r-7', nickname: 'Momo', points: 980, period: 'all', activitySummary: '1 contest entered' },
    { id: 'r-8', nickname: 'HackHero', points: 750, period: 'all', activitySummary: '1 contest entered' },
    { id: 'r-9', nickname: 'PixelMaster', points: 1200, period: '30d', activitySummary: 'active shipping streak this month' },
    { id: 'r-10', nickname: 'CodeNinja', points: 980, period: '30d', activitySummary: 'two projects this month' },
    { id: 'r-11', nickname: 'Jason', points: 820, period: '30d', activitySummary: 'one strong project this month' },
    { id: 'r-12', nickname: 'ByteRunner', points: 600, period: '30d', activitySummary: 'steady monthly participation' },
    { id: 'r-13', nickname: 'PixelMaster', points: 450, period: '7d', activitySummary: 'this week launch' },
    { id: 'r-14', nickname: 'Jason', points: 380, period: '7d', activitySummary: 'this week contribution' },
    { id: 'r-15', nickname: 'CodeNinja', points: 290, period: '7d', activitySummary: 'this week contest' },
  ];

  setItem(STORAGE_KEYS.RANKINGS, rankings);
}

export function seedLocalStorage(): void {
  if (typeof window === 'undefined') return;

  const teams = syncPublicData();
  if (hasItem(SEEDED_FLAG)) return;

  const demoTeamId = teams.find(team => team.id === 'T-HANDOVER-01')?.id ?? 'T-HANDOVER-01';

  setItem(STORAGE_KEYS.TEAM_MEMBERS, [
    { id: 'tm-1', teamId: demoTeamId, displayName: 'Jason', roleLabel: 'Frontend', status: 'active', isPrivateProfile: false },
    { id: 'tm-2', teamId: demoTeamId, displayName: 'Ari', roleLabel: 'Backend', status: 'active', isPrivateProfile: false },
    { id: 'tm-3', teamId: demoTeamId, displayName: 'Momo', roleLabel: 'Designer', status: 'pending', isPrivateProfile: false },
  ]);

  setItem(STORAGE_KEYS.TEAM_INVITES, []);

  setItem(STORAGE_KEYS.WAR_ROOMS, [
    {
      id: 'wr-demo',
      teamId: demoTeamId,
      title: '404found War Room',
      summary: 'Complete core portal flows first, then polish responsive QA and submission prep.',
      submissionStage: 'web',
      nextActionLabel: 'Finalize deployment link and submission copy',
      lastUpdated: '2026-03-10T09:00:00+09:00',
      notes: '3/10 sync:\n- README updated\n- responsive QA completed\n- Vercel deployment still pending',
    },
  ]);

  setItem(STORAGE_KEYS.WAR_ROOM_WORKFLOW_CARDS, [
    { id: 'wc-1', warRoomId: 'wr-demo', title: 'Finalize PRD alignment', column: 'submitted', order: 0, isBlocked: false, ownerLabel: 'Jason' },
    { id: 'wc-2', warRoomId: 'wr-demo', title: 'Validate schema coverage', column: 'submitted', order: 1, isBlocked: false, ownerLabel: 'Ari' },
    { id: 'wc-3', warRoomId: 'wr-demo', title: 'Prepare Vercel deployment', column: 'web', order: 0, isBlocked: false, ownerLabel: 'Jason' },
    { id: 'wc-4', warRoomId: 'wr-demo', title: 'Package PDF evidence', column: 'pdf', order: 0, isBlocked: false, ownerLabel: 'Momo' },
  ]);

  setItem(STORAGE_KEYS.WAR_ROOM_CHECKLIST, [
    { id: 'cl-1', warRoomId: 'wr-demo', label: 'PRD final review', status: 'done', assigneeLabel: 'Jason' },
    { id: 'cl-2', warRoomId: 'wr-demo', label: 'Wireframe review', status: 'done', assigneeLabel: 'Momo' },
    { id: 'cl-3', warRoomId: 'wr-demo', label: 'Verify Vercel deployment', status: 'doing', assigneeLabel: 'Ari' },
    { id: 'cl-4', warRoomId: 'wr-demo', label: 'Prepare PDF submission bundle', status: 'todo', assigneeLabel: 'Momo' },
  ]);

  setItem(STORAGE_KEYS.SUBMISSIONS, [
    {
      id: 'sub-demo',
      hackathonSlug: 'daker-handover-2026-03',
      teamId: demoTeamId,
      planStatus: 'submitted',
      webStatus: 'draft',
      pdfStatus: 'empty',
      submittedAt: undefined,
    },
  ]);

  setItem(STORAGE_KEYS.SUBMISSION_ARTIFACTS, [
    { id: 'sa-1', submissionId: 'sub-demo', kind: 'plan_url', url: 'https://docs.google.com/document/d/example', label: 'Planning Doc' },
    { id: 'sa-2', submissionId: 'sub-demo', kind: 'github_url', url: 'https://github.com/example/hackathon', label: 'GitHub' },
  ]);

  seedRankings();
  setItem(STORAGE_KEYS.SYSTEM_NOTICES, []);
  setItem(SEEDED_FLAG, true);
}
