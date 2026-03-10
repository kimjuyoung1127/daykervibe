'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getItem } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import type { Hackathon, HackathonStatus } from '@/lib/types';
import PageShell from '@/components/layout/PageShell';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import LoadingState from '@/components/ui/LoadingState';
import EmptyState from '@/components/ui/EmptyState';

type FilterKey = 'all' | HackathonStatus;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'upcoming', label: '모집중' },
  { key: 'ongoing', label: '진행중' },
  { key: 'ended', label: '종료' },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

function formatPrize(krw: number): string {
  if (krw >= 10000) return `${(krw / 10000).toLocaleString()}만원`;
  return `${krw.toLocaleString()}원`;
}

export default function HackathonsPage() {
  const [hackathons, setHackathons] = useState<Hackathon[] | null>(null);
  const [filter, setFilter] = useState<FilterKey>('all');

  useEffect(() => {
    const data = getItem<Hackathon[]>(STORAGE_KEYS.HACKATHONS);
    setHackathons(data ?? []);
  }, []);

  if (hackathons === null) return <LoadingState />;

  const filtered = hackathons.filter(h => filter === 'all' || h.status === filter);

  return (
    <PageShell>
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-pixel text-accent-orange text-lg mb-2">QUEST BOARD</h1>
        <p className="font-dunggeunmo text-card-white/70">
          참가 가능한 해커톤을 탐색하세요
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`font-pixel text-[10px] px-3 py-1.5 whitespace-nowrap border-2 transition-colors ${
              filter === f.key
                ? 'bg-accent-orange text-dark-bg border-accent-orange'
                : 'bg-transparent text-card-white/70 border-dark-border hover:border-card-white/50'
            }`}
          >
            {f.label}
          </button>
        ))}
        <span className="ml-auto font-dunggeunmo text-xs text-card-white/50 self-center">
          {filtered.length} / {hackathons.length}
        </span>
      </div>

      {/* Card Grid */}
      {filtered.length === 0 ? (
        <EmptyState message="해당 조건의 해커톤이 없습니다" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map(h => (
            <Link key={h.slug} href={`/hackathons/${h.slug}`}>
              <Card className="h-full flex flex-col">
                {/* Thumbnail placeholder */}
                <div className="h-32 bg-dark-bg/20 border-b border-dark-border mb-3 flex items-center justify-center">
                  <span className="font-pixel text-[8px] text-dark-bg/30">THUMBNAIL</span>
                </div>

                {/* Content */}
                <div className="flex items-start justify-between mb-2">
                  <StatusBadge status={h.status} />
                  {h.teamCount !== undefined && (
                    <span className="font-dunggeunmo text-xs text-dark-bg/60">
                      {h.teamCount} teams
                    </span>
                  )}
                </div>

                <h3 className="font-dunggeunmo font-bold text-base mb-1 line-clamp-2">
                  {h.title}
                </h3>

                <p className="font-dunggeunmo text-xs text-dark-bg/60 mb-3">
                  {formatDate(h.eventStartAt)} ~ {formatDate(h.eventEndAt)}
                </p>

                {/* Tags + Prize */}
                <div className="mt-auto flex items-end justify-between">
                  <div className="flex flex-wrap gap-1">
                    {h.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="font-pixel text-[8px] px-2 py-0.5 bg-dark-bg/10 rounded-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {h.prizeTotalKRW > 0 && (
                    <span className="font-pixel text-[10px] text-accent-orange">
                      {formatPrize(h.prizeTotalKRW)}
                    </span>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </PageShell>
  );
}
