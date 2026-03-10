'use client';

import { useEffect, useState } from 'react';
import { isValidPublicContactUrl } from '@/lib/contact-links';
import { getItem } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import type { HackathonStatus, Team } from '@/lib/types';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import PixelButton from '@/components/ui/PixelButton';

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
          {teams.map(team => {
            const canRecruit = !isEnded && team.isOpen;
            const hasContact = canRecruit && isValidPublicContactUrl(team.contactUrl);

            return (
              <Card key={team.id} hover={false} className="flex flex-col">
                <div className="mb-1 flex items-start justify-between gap-3">
                  <h4 className="font-dunggeunmo text-sm font-bold">{team.name}</h4>
                  <span
                    className={`px-1.5 py-0.5 font-pixel text-[8px] ${
                      isEnded
                        ? 'border border-dark-border bg-dark-bg/8 text-dark-bg/65'
                        : team.isOpen
                          ? 'border border-accent-mint/45 bg-accent-mint/35 text-dark-bg'
                          : 'bg-dark-border text-card-white'
                    }`}
                  >
                    {isEnded ? 'ENDED' : team.isOpen ? 'RECRUITING' : 'CLOSED'}
                  </span>
                </div>
                <p className="mb-2 font-dunggeunmo text-xs text-dark-bg/70">{team.intro}</p>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1">
                    {team.lookingFor.map(role => (
                      <span
                        key={role}
                        className="border border-accent-yellow/35 bg-accent-yellow/18 px-1.5 py-0.5 font-pixel text-[7px] text-dark-bg/80"
                      >
                        #{role}
                      </span>
                    ))}
                  </div>
                  <span className="font-dunggeunmo text-xs text-dark-bg/60">
                    {team.memberCount}명
                  </span>
                </div>
                <div className="mt-auto flex flex-wrap justify-end gap-2">
                  {isEnded ? (
                    <span className="inline-flex min-h-10 items-center border border-dark-border/40 bg-dark-bg/5 px-3 font-pixel text-[9px] text-dark-bg/45">
                      종료된 해커톤
                    </span>
                  ) : team.isOpen ? (
                    hasContact ? (
                      <a
                        href={team.contactUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-10 items-center font-pixel text-[10px] text-accent-orange hover:underline"
                      >
                        연락하기
                      </a>
                    ) : (
                      <span className="inline-flex min-h-10 items-center border border-dark-border/40 bg-dark-bg/5 px-3 font-pixel text-[9px] text-dark-bg/45">
                        연락처 준비중
                      </span>
                    )
                  ) : (
                    <span className="inline-flex min-h-10 items-center border border-dark-border/40 bg-dark-bg/5 px-3 font-pixel text-[9px] text-dark-bg/45">
                      모집 마감
                    </span>
                  )}

                  {!isEnded && (
                    <PixelButton
                      href={`/war-room/${team.id}`}
                      variant="ghost"
                      className="px-3 py-2 text-[8px]"
                    >
                      작전실 이동
                    </PixelButton>
                  )}
                </div>
              </Card>
            );
          })}
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
