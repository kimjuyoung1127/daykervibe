import { STORAGE_KEYS, SEEDED_FLAG } from './keys';
import { setItem, hasItem } from './local-storage';
import { transformHackathons, transformTeams, transformLeaderboard } from './transformers';

import rawHackathons from '../../../hackathonsjson/public_hackathons.json';
import rawDetail from '../../../hackathonsjson/public_hackathon_detail.json';
import rawTeams from '../../../hackathonsjson/public_teams.json';
import rawLeaderboard from '../../../hackathonsjson/public_leaderboard.json';

export function seedLocalStorage(): void {
  if (typeof window === 'undefined') return;
  if (hasItem(SEEDED_FLAG)) return;

  // Transform and store public data
  const hackathons = transformHackathons(
    rawHackathons as Parameters<typeof transformHackathons>[0],
    rawDetail as Parameters<typeof transformHackathons>[1],
  );
  setItem(STORAGE_KEYS.HACKATHONS, hackathons);

  const teams = transformTeams(rawTeams as Parameters<typeof transformTeams>[0]);
  setItem(STORAGE_KEYS.TEAMS, teams);

  const leaderboard = transformLeaderboard(
    rawLeaderboard as Parameters<typeof transformLeaderboard>[0],
  );
  setItem(STORAGE_KEYS.LEADERBOARDS, leaderboard);

  // Demo team-local data (first team: T-HANDOVER-01)
  const demoTeamId = teams[2]?.id ?? 'T-HANDOVER-01';

  setItem(STORAGE_KEYS.TEAM_MEMBERS, [
    { id: 'tm-1', teamId: demoTeamId, displayName: '김탐험', roleLabel: 'Frontend', status: 'active', isPrivateProfile: false },
    { id: 'tm-2', teamId: demoTeamId, displayName: '이원정', roleLabel: 'Backend', status: 'active', isPrivateProfile: false },
    { id: 'tm-3', teamId: demoTeamId, displayName: '박모험', roleLabel: 'Designer', status: 'pending', isPrivateProfile: false },
  ]);

  setItem(STORAGE_KEYS.TEAM_INVITES, []);

  setItem(STORAGE_KEYS.WAR_ROOMS, [
    {
      id: 'wr-demo',
      teamId: demoTeamId,
      title: '404found 작전실',
      summary: '명세서 기반으로 기본 기능 완성 후 UX 확장',
      submissionStage: 'web',
      nextActionLabel: '웹 제출물 최종 점검',
      lastUpdated: '2026-03-10T09:00:00+09:00',
      notes: '3/10 회의: 기획서 완료, 웹 배포 진행 중\n- Vercel 배포 확인\n- README 업데이트 필요',
    },
  ]);

  setItem(STORAGE_KEYS.WAR_ROOM_WORKFLOW_CARDS, [
    { id: 'wc-1', warRoomId: 'wr-demo', title: 'PRD 작성', column: 'submitted', order: 0, isBlocked: false, ownerLabel: '김탐험' },
    { id: 'wc-2', warRoomId: 'wr-demo', title: 'Schema 정의', column: 'submitted', order: 1, isBlocked: false, ownerLabel: '이원정' },
    { id: 'wc-3', warRoomId: 'wr-demo', title: 'Vercel 배포', column: 'web', order: 0, isBlocked: false, ownerLabel: '김탐험' },
    { id: 'wc-4', warRoomId: 'wr-demo', title: 'PDF 작성', column: 'pdf', order: 0, isBlocked: false, ownerLabel: '박모험' },
  ]);

  setItem(STORAGE_KEYS.WAR_ROOM_CHECKLIST, [
    { id: 'cl-1', warRoomId: 'wr-demo', label: 'PRD 최종 검토', status: 'done', assigneeLabel: '김탐험' },
    { id: 'cl-2', warRoomId: 'wr-demo', label: 'Wireframe 검수', status: 'done', assigneeLabel: '박모험' },
    { id: 'cl-3', warRoomId: 'wr-demo', label: 'Vercel 배포 확인', status: 'doing', assigneeLabel: '이원정' },
    { id: 'cl-4', warRoomId: 'wr-demo', label: 'PDF 제출물 준비', status: 'todo', assigneeLabel: '박모험' },
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
    { id: 'sa-1', submissionId: 'sub-demo', kind: 'plan_url', url: 'https://docs.google.com/document/d/example', label: '기획서' },
    { id: 'sa-2', submissionId: 'sub-demo', kind: 'github_url', url: 'https://github.com/example/hackathon', label: 'GitHub' },
  ]);

  // Rankings demo data
  setItem(STORAGE_KEYS.RANKINGS, [
    { id: 'r-1', nickname: 'PixelMaster', points: 2850, period: 'all', activitySummary: '해커톤 3회 참가, 1회 우승' },
    { id: 'r-2', nickname: 'CodeNinja', points: 2340, period: 'all', activitySummary: '해커톤 2회 참가, 1회 준우승' },
    { id: 'r-3', nickname: '김탐험', points: 1920, period: 'all', activitySummary: '해커톤 2회 참가, 팀 기여 우수' },
    { id: 'r-4', nickname: 'ByteRunner', points: 1650, period: 'all', activitySummary: '해커톤 1회 참가, 특별상' },
    { id: 'r-5', nickname: '이원정', points: 1420, period: 'all', activitySummary: '해커톤 2회 참가' },
    { id: 'r-6', nickname: 'DevExplorer', points: 1100, period: 'all', activitySummary: '해커톤 1회 참가' },
    { id: 'r-7', nickname: '박모험', points: 980, period: 'all', activitySummary: '해커톤 1회 참가' },
    { id: 'r-8', nickname: 'HackHero', points: 750, period: 'all', activitySummary: '해커톤 1회 참가' },
    { id: 'r-9', nickname: 'PixelMaster', points: 1200, period: '30d', activitySummary: '이번 달 활발한 활동' },
    { id: 'r-10', nickname: 'CodeNinja', points: 980, period: '30d', activitySummary: '이번 달 2개 프로젝트' },
    { id: 'r-11', nickname: '김탐험', points: 820, period: '30d', activitySummary: '이번 달 1개 프로젝트' },
    { id: 'r-12', nickname: 'ByteRunner', points: 600, period: '30d', activitySummary: '이번 달 참가' },
    { id: 'r-13', nickname: 'PixelMaster', points: 450, period: '7d', activitySummary: '이번 주 활발' },
    { id: 'r-14', nickname: '김탐험', points: 380, period: '7d', activitySummary: '이번 주 기여' },
    { id: 'r-15', nickname: 'CodeNinja', points: 290, period: '7d', activitySummary: '이번 주 참가' },
  ]);

  setItem(STORAGE_KEYS.SYSTEM_NOTICES, []);

  // Mark as seeded
  setItem(SEEDED_FLAG, true);
}
