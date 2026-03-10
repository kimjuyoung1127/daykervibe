'use client';

import { useEffect, useState } from 'react';
import { getItem } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import type { LeaderboardEntry } from '@/lib/types';
import EmptyState from '@/components/ui/EmptyState';

interface LeaderboardSectionProps {
  content: string;
  hackathonSlug: string;
}

export default function LeaderboardSection({ content, hackathonSlug }: LeaderboardSectionProps) {
  const data = JSON.parse(content) as { note?: string };
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const all = getItem<LeaderboardEntry[]>(STORAGE_KEYS.LEADERBOARDS) ?? [];
    setEntries(
      all
        .filter(e => e.hackathonSlug === hackathonSlug)
        .sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999)),
    );
  }, [hackathonSlug]);

  return (
    <div className="space-y-4">
      {data.note && (
        <p className="font-dunggeunmo text-xs text-card-white/50 italic">{data.note}</p>
      )}

      {entries.length === 0 ? (
        <EmptyState message="리더보드 데이터가 없습니다" />
      ) : (
        <div className="border-2 border-dark-border rounded-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-dark-border/70 border-b border-dark-border">
                <th className="font-pixel text-[8px] text-card-white/50 text-left px-4 py-2">RANK</th>
                <th className="font-pixel text-[8px] text-card-white/50 text-left px-4 py-2">TEAM</th>
                <th className="font-pixel text-[8px] text-card-white/50 text-right px-4 py-2">SCORE</th>
                <th className="font-pixel text-[8px] text-card-white/50 text-right px-4 py-2">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(e => (
                <tr key={e.id} className="border-b border-dark-border/50">
                  <td className="font-pixel text-sm text-accent-yellow px-4 py-2">
                    #{e.rank ?? '—'}
                  </td>
                  <td className="font-dunggeunmo text-sm text-card-white px-4 py-2">
                    {e.name}
                  </td>
                  <td className="font-pixel text-[10px] text-accent-orange text-right px-4 py-2">
                    {e.score}
                  </td>
                  <td className="text-right px-4 py-2">
                    <span className={`font-pixel text-[8px] px-1.5 py-0.5 ${
                      e.status === 'ranked'
                        ? 'bg-accent-mint text-dark-bg'
                        : 'bg-accent-pink text-dark-bg'
                    }`}>
                      {e.status === 'ranked' ? 'RANKED' : 'NOT SUBMITTED'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
