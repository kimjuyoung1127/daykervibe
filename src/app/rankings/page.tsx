'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { formatPoints } from '@/lib/format';
import { getItem } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import type { RankingProfile } from '@/lib/types';
import PageShell from '@/components/layout/PageShell';
import LoadingState from '@/components/ui/LoadingState';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';

type PeriodFilter = '7d' | '30d' | 'all';

const PERIOD_LABELS: { key: PeriodFilter; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: '30d', label: '30일' },
  { key: '7d', label: '7일' },
];

function getRankStyle(rank: number): string {
  if (rank === 1) return 'text-accent-yellow';
  if (rank === 2) return 'text-accent-mint';
  if (rank === 3) return 'text-accent-pink';
  return 'text-card-white/70';
}

function getRankBg(rank: number): string {
  if (rank === 1) return 'bg-accent-yellow/10 border-accent-yellow/30';
  if (rank === 2) return 'bg-accent-mint/10 border-accent-mint/30';
  if (rank === 3) return 'bg-accent-pink/10 border-accent-pink/30';
  return 'bg-dark-bg/5 border-dark-border';
}

export default function RankingsPage() {
  const [rankings, setRankings] = useState<RankingProfile[] | null>(null);
  const [period, setPeriod] = useState<PeriodFilter>('all');
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;
      try {
        const data = getItem<RankingProfile[]>(STORAGE_KEYS.RANKINGS);

        if (data !== null && !Array.isArray(data)) {
          throw new Error('랭킹 데이터를 불러오지 못했습니다.');
        }

        setRankings(data ?? []);
        setLoadError(null);
      } catch (error) {
        setRankings([]);
        setLoadError(
          error instanceof Error ? error.message : '랭킹 데이터를 불러오지 못했습니다.',
        );
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (rankings === null) return <LoadingState />;
  if (loadError) {
    return (
      <PageShell>
        <ErrorState message={loadError} />
      </PageShell>
    );
  }

  const filtered = rankings
    .filter(r => r.period === period)
    .sort((a, b) => b.points - a.points);

  return (
    <PageShell>
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-pixel text-accent-orange text-lg mb-2">GLOBAL RANKINGS</h1>
        <p className="font-dunggeunmo text-card-white/70">
          탐험가들의 활약을 확인하세요
        </p>
      </div>

      <div className="mb-6 overflow-hidden border-2 border-dark-border bg-dark-border/30">
        <Image
          src="/ranking3.webp"
          alt="Top 3 ranking visual"
          width={1400}
          height={700}
          sizes="(min-width: 1152px) 1120px, calc(100vw - 2rem)"
          className="h-auto w-full object-cover"
        />
      </div>

      {/* Period Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {PERIOD_LABELS.map(p => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className={`font-pixel text-[10px] px-3 py-1.5 border-2 transition-colors ${
              period === p.key
                ? 'bg-accent-orange text-dark-bg border-accent-orange'
                : 'bg-transparent text-card-white/70 border-dark-border hover:border-card-white/50'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Rankings Table */}
      {filtered.length === 0 ? (
        <EmptyState message="해당 기간의 랭킹 데이터가 없습니다" />
      ) : (
        <div className="space-y-2">
          {/* Header row */}
          <div className="hidden grid-cols-12 gap-3 px-4 py-2 font-pixel text-[8px] text-card-white/50 md:grid">
            <span className="col-span-1">RANK</span>
            <span className="col-span-4">NICKNAME</span>
            <span className="col-span-2 text-right">POINTS</span>
            <span className="col-span-5">ACTIVITY</span>
          </div>

          {/* Rows */}
          {filtered.map((r, idx) => {
            const rank = idx + 1;
            return (
              <div
                key={r.id}
                className={`border-2 px-4 py-3 transition-colors ${getRankBg(rank)}`}
              >
                <div className="flex items-start justify-between gap-3 md:hidden">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <span className={`shrink-0 font-pixel text-sm ${getRankStyle(rank)}`}>
                        #{rank}
                      </span>
                      <span className="min-w-0 break-words font-dunggeunmo font-bold leading-tight text-card-white">
                        {r.nickname}
                      </span>
                    </div>
                    <p className="mt-2 break-words font-dunggeunmo text-xs leading-snug text-card-white/60">
                      {r.activitySummary ?? '-'}
                    </p>
                  </div>
                  <span className={`shrink-0 pt-0.5 text-right font-pixel text-xs ${getRankStyle(rank)}`}>
                    {formatPoints(r.points)}
                  </span>
                </div>
                <div className="hidden grid-cols-12 gap-3 md:grid">
                  <span className={`col-span-1 font-pixel text-sm ${getRankStyle(rank)}`}>
                    #{rank}
                  </span>
                  <span className="col-span-4 min-w-0 truncate font-dunggeunmo font-bold text-card-white">
                    {r.nickname}
                  </span>
                  <span className={`col-span-2 font-pixel text-xs text-right ${getRankStyle(rank)}`}>
                    {formatPoints(r.points)}
                  </span>
                  <span className="col-span-5 min-w-0 truncate font-dunggeunmo text-xs text-card-white/60">
                    {r.activitySummary ?? '-'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PageShell>
  );
}
