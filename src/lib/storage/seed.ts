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

  // Initialize empty team-local collections
  setItem(STORAGE_KEYS.TEAM_MEMBERS, []);
  setItem(STORAGE_KEYS.TEAM_INVITES, []);
  setItem(STORAGE_KEYS.WAR_ROOMS, []);
  setItem(STORAGE_KEYS.WAR_ROOM_WORKFLOW_CARDS, []);
  setItem(STORAGE_KEYS.WAR_ROOM_CHECKLIST, []);
  setItem(STORAGE_KEYS.SUBMISSIONS, []);
  setItem(STORAGE_KEYS.SUBMISSION_ARTIFACTS, []);
  setItem(STORAGE_KEYS.RANKINGS, []);
  setItem(STORAGE_KEYS.SYSTEM_NOTICES, []);

  // Mark as seeded
  setItem(SEEDED_FLAG, true);
}
