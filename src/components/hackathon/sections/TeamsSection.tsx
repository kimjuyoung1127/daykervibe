'use client';

import { useEffect, useState } from 'react';
import { getItem } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import type { HackathonStatus, Team } from '@/lib/types';
import EmptyState from '@/components/ui/EmptyState';
import PixelButton from '@/components/ui/PixelButton';
import TeamCard from '@/components/ui/TeamCard';

interface TeamsData {
  campEnabled?: boolean;
  listUrl?: string;
  sourceLimited?: boolean;
}

interface TeamsSectionProps {
  content: string;
  hackathonSlug: string;
  hackathonStatus: HackathonStatus;
}

export default function TeamsSection({
  content,
  hackathonSlug,
  hackathonStatus,
}: TeamsSectionProps) {
  const data: TeamsData = JSON.parse(content);
  const [teams, setTeams] = useState<Team[]>([]);
  const isEnded = hackathonStatus === 'ended';

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;

      const allTeams = getItem<Team[]>(STORAGE_KEYS.TEAMS) ?? [];
      setTeams(allTeams.filter(team => team.hackathonSlug === hackathonSlug));
    });

    return () => {
      cancelled = true;
    };
  }, [hackathonSlug]);

  const campUrl = data.listUrl ?? `/camp?hackathon=${encodeURIComponent(hackathonSlug)}`;

  return (
    <div className="space-y-4">
      {teams.length === 0 ? (
        <EmptyState
          message={
            data.sourceLimited
              ? '공개된 팀 정보가 아직 없습니다.'
              : '아직 등록된 팀이 없습니다.'
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {teams.map(team => (
            <TeamCard key={team.id} team={team} variant="detail" isEnded={isEnded} />
          ))}
        </div>
      )}

      {data.campEnabled && !isEnded && (
        <div className="pt-2 text-center">
          <PixelButton href={campUrl} variant="ghost">
            CAMP에서 팀 찾기
          </PixelButton>
        </div>
      )}
    </div>
  );
}
