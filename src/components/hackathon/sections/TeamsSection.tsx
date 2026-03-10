'use client';

import { useEffect, useState } from 'react';
import { getItem } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import type { Team } from '@/lib/types';
import Card from '@/components/ui/Card';
import PixelButton from '@/components/ui/PixelButton';
import EmptyState from '@/components/ui/EmptyState';

interface TeamsData {
  campEnabled?: boolean;
  listUrl?: string;
}

interface TeamsSectionProps {
  content: string;
  hackathonSlug: string;
}

export default function TeamsSection({
  content,
  hackathonSlug,
}: TeamsSectionProps) {
  const data: TeamsData = JSON.parse(content);
  const [teams, setTeams] = useState<Team[]>([]);

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

  return (
    <div className="space-y-4">
      {teams.length === 0 ? (
        <EmptyState message="아직 등록된 팀이 없습니다" />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {teams.map(team => (
            <Card key={team.id} hover={false} className="flex flex-col">
              <div className="mb-1 flex items-start justify-between gap-3">
                <h4 className="font-dunggeunmo text-sm font-bold">{team.name}</h4>
                <span
                  className={`px-1.5 py-0.5 font-pixel text-[8px] ${
                    team.isOpen
                      ? 'bg-accent-mint text-dark-bg'
                      : 'bg-dark-border text-card-white'
                  }`}
                >
                  {team.isOpen ? 'RECRUITING' : 'CLOSED'}
                </span>
              </div>
              <p className="mb-2 font-dunggeunmo text-xs text-dark-bg/70">
                {team.intro}
              </p>
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1">
                  {team.lookingFor.map(role => (
                    <span
                      key={role}
                      className="bg-dark-bg/10 px-1.5 py-0.5 font-pixel text-[7px]"
                    >
                      #{role}
                    </span>
                  ))}
                </div>
                <span className="font-dunggeunmo text-xs text-dark-bg/60">
                  {team.memberCount}명
                </span>
              </div>
              <div className="mt-auto flex justify-end">
                <PixelButton
                  href={`/war-room/${team.id}`}
                  variant="ghost"
                  className="px-2 py-1 text-[8px]"
                >
                  작전실 이동
                </PixelButton>
              </div>
            </Card>
          ))}
        </div>
      )}

      {data.campEnabled && (
        <div className="text-center pt-2">
          <PixelButton href="/camp" variant="ghost">
            CAMP에서 팀 찾기
          </PixelButton>
        </div>
      )}
    </div>
  );
}
