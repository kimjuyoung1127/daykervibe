'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getItem } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import { getDisplayHackathonStatus } from '@/lib/hackathon-detail';
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

function formatDate(iso?: string): string {
  if (!iso) return '미공개';

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
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;
      const data = getItem<Hackathon[]>(STORAGE_KEYS.HACKATHONS);
      setHackathons(data ?? []);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (hackathons === null) return <LoadingState />;

  const normalizedHackathons = hackathons.map(hackathon => ({
    ...hackathon,
    status: getDisplayHackathonStatus(hackathon.status, hackathon.eventEndAt),
  }));

  const filtered = normalizedHackathons.filter(
    hackathon => filter === 'all' || hackathon.status === filter,
  );

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
      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`min-h-10 border-2 px-3 py-2 font-pixel text-[10px] transition-colors ${
              filter === f.key
                ? 'bg-accent-orange text-dark-bg border-accent-orange'
                : 'bg-transparent text-card-white/70 border-dark-border hover:border-card-white/50'
            }`}
          >
            {f.label}
          </button>
        ))}
        <span className="basis-full font-dunggeunmo text-xs text-card-white/50">
          {filtered.length} / {hackathons.length}
        </span>
      </div>

      {/* Card Grid */}
      {filtered.length === 0 ? (
        <EmptyState message="해당 조건의 해커톤이 없습니다" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map(hackathon => (
            <Link key={hackathon.slug} href={`/hackathons/${hackathon.slug}`}>
              <Card className="h-full flex flex-col">
                {hackathon.thumbnailUrl && (
                  <div className="mb-3 overflow-hidden border-2 border-dark-border/70 bg-dark-bg/5">
                    <Image
                      src={hackathon.thumbnailUrl}
                      alt={hackathon.title}
                      width={1200}
                      height={900}
                      sizes="(min-width: 1152px) 552px, (min-width: 640px) calc((100vw - 3rem) / 2), calc(100vw - 2rem)"
                      className="h-auto w-full object-cover"
                    />
                  </div>
                )}
                <div className="mb-2 flex items-start justify-between gap-3">
                  <StatusBadge status={hackathon.status} />
                  {hackathon.teamCount !== undefined && (
                    <span className="font-dunggeunmo text-xs text-dark-bg/60">
                      {hackathon.teamCount} teams
                    </span>
                  )}
                </div>

                <h3 className="mb-2 font-dunggeunmo text-base font-bold line-clamp-2">
                  {hackathon.title}
                </h3>

                {hackathon.summary && (
                  <p className="mb-3 font-dunggeunmo text-sm text-dark-bg/72 line-clamp-2">
                    {hackathon.summary}
                  </p>
                )}

                <p className="mb-3 font-dunggeunmo text-xs text-dark-bg/60">
                  {formatDate(hackathon.eventStartAt)} ~ {formatDate(hackathon.eventEndAt)}
                </p>

                <div className="mt-auto flex items-end justify-between gap-3">
                  <div className="flex flex-wrap gap-1">
                    {hackathon.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="rounded-sm bg-dark-bg/10 px-2 py-0.5 font-pixel text-[8px] text-dark-bg/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {hackathon.prizeTotalKRW > 0 && (
                    <span className="font-pixel text-[10px] text-dark-bg/80">
                      {formatPrize(hackathon.prizeTotalKRW)}
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
