'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDate, formatPrize } from '@/lib/format';
import { getItem } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import { getDisplayHackathonStatus } from '@/lib/hackathon-detail';
import type { Hackathon, HackathonStatus } from '@/lib/types';
import PageShell from '@/components/layout/PageShell';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import LoadingState from '@/components/ui/LoadingState';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';

type FilterKey = 'all' | HackathonStatus;
type TagFilterKey = 'all' | string;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'upcoming', label: '모집중' },
  { key: 'ongoing', label: '진행중' },
  { key: 'ended', label: '종료' },
];

const STATUS_PRIORITY: Record<HackathonStatus, number> = {
  upcoming: 0,
  ongoing: 1,
  ended: 2,
};
export default function HackathonsPage() {
  const [hackathons, setHackathons] = useState<Hackathon[] | null>(null);
  const [filter, setFilter] = useState<FilterKey>('all');
  const [tagFilter, setTagFilter] = useState<TagFilterKey>('all');
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;
      try {
        const data = getItem<Hackathon[]>(STORAGE_KEYS.HACKATHONS);

        if (data !== null && !Array.isArray(data)) {
          throw new Error('해커톤 목록 데이터를 불러오지 못했습니다.');
        }

        setHackathons(data ?? []);
        setLoadError(null);
      } catch (error) {
        setHackathons([]);
        setLoadError(
          error instanceof Error ? error.message : '해커톤 목록 데이터를 불러오지 못했습니다.',
        );
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (hackathons === null) return <LoadingState />;
  if (loadError) {
    return (
      <PageShell>
        <ErrorState message={loadError} />
      </PageShell>
    );
  }

  const normalizedHackathons = hackathons.map(hackathon => ({
    ...hackathon,
    status: getDisplayHackathonStatus(hackathon.status, hackathon.eventEndAt),
  }));

  const availableTags = Array.from(
    new Set(normalizedHackathons.flatMap(hackathon => hackathon.tags)),
  ).sort((a, b) => a.localeCompare(b, 'ko-KR'));

  const filtered = normalizedHackathons
    .map((hackathon, index) => ({ hackathon, index }))
    .filter(({ hackathon }) => filter === 'all' || hackathon.status === filter)
    .filter(({ hackathon }) => tagFilter === 'all' || hackathon.tags.includes(tagFilter))
    .sort((a, b) => {
      const priorityDiff =
        STATUS_PRIORITY[a.hackathon.status] - STATUS_PRIORITY[b.hackathon.status];

      if (priorityDiff !== 0) return priorityDiff;
      return a.index - b.index;
    })
    .map(({ hackathon }) => hackathon);

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
        <div className="w-full sm:hidden">
          <label
            htmlFor="hackathon-tag-filter"
            className="mb-1 block font-dunggeunmo text-xs text-card-white/50"
          >
            태그 필터
          </label>
          <select
            id="hackathon-tag-filter"
            value={tagFilter}
            onChange={event => setTagFilter(event.target.value)}
            className="min-h-10 w-full border-2 border-dark-border bg-dark-bg/30 px-3 py-2 font-dunggeunmo text-sm text-card-white"
          >
            <option value="all">전체 태그</option>
            {availableTags.map(tag => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
        <div className="hidden w-full flex-wrap gap-2 sm:flex">
          <button
            onClick={() => setTagFilter('all')}
            className={`min-h-9 border px-3 py-1.5 font-dunggeunmo text-xs transition-colors ${
              tagFilter === 'all'
                ? 'border-accent-mint bg-accent-mint/15 text-accent-mint'
                : 'border-dark-border text-card-white/60 hover:border-card-white/40'
            }`}
          >
            전체 태그
          </button>
          {availableTags.map(tag => (
            <button
              key={tag}
              onClick={() => setTagFilter(tag)}
              className={`min-h-9 border px-3 py-1.5 font-dunggeunmo text-xs font-bold transition-colors ${
                tagFilter === tag
                  ? 'border-accent-mint bg-accent-mint/15 text-accent-mint'
                  : 'border-dark-border text-card-white/60 hover:border-card-white/40'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        <span className="basis-full font-dunggeunmo text-xs text-card-white/50">
          {filtered.length} / {hackathons.length}
        </span>
      </div>

      {/* Card Grid */}
      {filtered.length === 0 ? (
        <EmptyState message="해당 조건의 해커톤이 없습니다" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(hackathon => (
            <Link key={hackathon.slug} href={`/hackathons/${hackathon.slug}`}>
              <Card className="h-full flex flex-col p-3">
                {hackathon.thumbnailUrl && (
                  <div className="mb-3 overflow-hidden border-2 border-dark-border/70 bg-dark-bg/5">
                    <Image
                      src={hackathon.thumbnailUrl}
                      alt={hackathon.title}
                      width={1200}
                      height={900}
                      sizes="(min-width: 1152px) 552px, (min-width: 640px) calc((100vw - 3rem) / 2), calc(100vw - 2rem)"
                      className="max-h-[160px] w-full object-cover"
                    />
                  </div>
                )}
                <div className="mb-2 flex items-start justify-between gap-2">
                  <StatusBadge status={hackathon.status} />
                  {hackathon.teamCount !== undefined && (
                    <span className="shrink-0 text-right font-dunggeunmo text-[11px] leading-tight text-dark-bg/60 sm:text-xs">
                      {hackathon.teamCount} teams
                    </span>
                  )}
                </div>

                <h3 className="mb-2 break-words font-dunggeunmo text-base font-bold leading-snug line-clamp-2">
                  {hackathon.title}
                </h3>

                {hackathon.summary && (
                  <p className="mb-3 break-words font-dunggeunmo text-sm leading-snug text-dark-bg/72 line-clamp-2">
                    {hackathon.summary}
                  </p>
                )}

                <p className="mb-3 font-dunggeunmo text-[11px] leading-snug text-dark-bg/60 sm:text-xs">
                  {formatDate(hackathon.eventStartAt)} ~ {formatDate(hackathon.eventEndAt)}
                </p>

                <div className="mt-auto flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {hackathon.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="max-w-full break-words rounded-sm bg-dark-bg/10 px-2 py-0.5 font-pixel text-[8px] leading-tight text-dark-bg/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {hackathon.prizeTotalKRW > 0 && (
                    <span className="font-pixel text-[10px] leading-tight text-dark-bg/80">
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
