'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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

export default function TeamsSection({ content, hackathonSlug }: TeamsSectionProps) {
  const data: TeamsData = JSON.parse(content);
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    const all = getItem<Team[]>(STORAGE_KEYS.TEAMS) ?? [];
    setTeams(all.filter(t => t.hackathonSlug === hackathonSlug));
  }, [hackathonSlug]);

  return (
    <div className="space-y-4">
      {teams.length === 0 ? (
        <EmptyState message="아직 등록된 팀이 없습니다" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {teams.map(t => (
            <Card key={t.id} hover={false}>
              <div className="flex items-start justify-between mb-1">
                <h4 className="font-dunggeunmo font-bold text-sm">{t.name}</h4>
                <span className={`font-pixel text-[8px] px-1.5 py-0.5 ${
                  t.isOpen ? 'bg-accent-mint text-dark-bg' : 'bg-dark-border text-card-white'
                }`}>
                  {t.isOpen ? 'RECRUITING' : 'CLOSED'}
                </span>
              </div>
              <p className="font-dunggeunmo text-xs text-dark-bg/70 mb-2">{t.intro}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {t.lookingFor.map(role => (
                    <span key={role} className="font-pixel text-[7px] px-1.5 py-0.5 bg-dark-bg/10">
                      #{role}
                    </span>
                  ))}
                </div>
                <span className="font-dunggeunmo text-xs text-dark-bg/60">
                  {t.memberCount}명
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {data.campEnabled && (
        <div className="text-center pt-2">
          <PixelButton href="/camp" variant="ghost">
            CAMP에서 팀 찾기 →
          </PixelButton>
        </div>
      )}
    </div>
  );
}
