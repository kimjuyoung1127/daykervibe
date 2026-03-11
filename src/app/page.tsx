'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getItem } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import type { Hackathon } from '@/lib/types';
import PageShell from '@/components/layout/PageShell';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import PixelButton from '@/components/ui/PixelButton';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import LoadingState from '@/components/ui/LoadingState';

const FEATURES = [
  { icon: '/search.svg', title: 'RECRUIT', desc: '해커톤을 탐색하고 참가 신청하세요' },
  { icon: '/team.svg', title: 'TEAM', desc: '팀을 모집하거나 합류하세요' },
  { icon: '/rocket.svg', title: 'WAR ROOM', desc: '팀 작전실에서 제출을 준비하세요' },
  { icon: '/checklist.svg', title: 'SUBMIT', desc: '기획서, 웹, PDF를 단계별 제출' },
  { icon: '/trophy.svg', title: 'EVALUATE', desc: '리더보드와 랭킹을 확인하세요' },
];

export default function Home() {
  const [hackathons, setHackathons] = useState<Hackathon[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;
      try {
        const data = getItem<Hackathon[]>(STORAGE_KEYS.HACKATHONS);

        if (data !== null && !Array.isArray(data)) {
          throw new Error('해커톤 데이터를 불러오지 못했습니다.');
        }

        setHackathons(data ?? []);
        setLoadError(null);
      } catch (error) {
        setHackathons([]);
        setLoadError(
          error instanceof Error ? error.message : '해커톤 데이터를 불러오지 못했습니다.',
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
  if (hackathons.length === 0) {
    return (
      <PageShell>
        <EmptyState message="표시할 해커톤이 없습니다." />
      </PageShell>
    );
  }

  const featured = hackathons
    .filter(h => h.status !== 'ended')
    .concat(hackathons.filter(h => h.status === 'ended'))
    .slice(0, 3);

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="flex-1">
              <p className="font-pixel text-accent-mint text-[10px] mb-4">
                ADVENTURE AWAITS IN PIXEL
              </p>
              <h1 className="font-pixel text-2xl sm:text-3xl leading-relaxed text-accent-orange mb-4">
                HACKATHON<br />
                <span className="text-accent-yellow">OPERATIONS</span><br />
                PORTAL
              </h1>
              <p className="font-dunggeunmo text-lg text-card-white/80 mb-8 max-w-md">
                바이브 코딩 스타일의 해커톤 운영 포털.
                지금 바로 모험을 시작하세요.
              </p>
              <div className="flex flex-wrap gap-3">
                <PixelButton href="/hackathons">해커톤 보기</PixelButton>
                <PixelButton href="/camp" variant="secondary">팀 찾기</PixelButton>
                <PixelButton href="/rankings" variant="ghost">랭킹 보기</PixelButton>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Image
                src="/og-image-hero.webp"
                alt="Expedition Hub"
                width={630}
                height={630}
                sizes="(min-width: 1024px) 520px, (min-width: 640px) 420px, calc(100vw - 2rem)"
                priority
                className="opacity-80"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Trending Missions ── */}
      <section className="bg-dark-border/30">
        <PageShell>
          <div className="flex items-center gap-2 mb-6">
            <span className="font-pixel text-accent-yellow text-xs">TRENDING MISSIONS</span>
            <span className="font-dunggeunmo text-card-white/50">—</span>
            <span className="font-dunggeunmo text-card-white/70">인기 해커톤 리스트</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map(h => (
              <Link key={h.slug} href={`/hackathons/${h.slug}`}>
                <Card className="h-full">
                  {h.thumbnailUrl && (
                    <div className="mb-3 overflow-hidden border-2 border-dark-border/70 bg-dark-bg/5">
                      <Image
                        src={h.thumbnailUrl}
                        alt={h.title}
                        width={1200}
                        height={900}
                        sizes="(min-width: 1024px) 360px, (min-width: 640px) calc(50vw - 2rem), calc(100vw - 2rem)"
                        className="h-auto w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-2">
                    <StatusBadge status={h.status} />
                  </div>
                  <h3 className="font-dunggeunmo font-bold text-base mb-2 line-clamp-2">
                    {h.title}
                  </h3>
                  <p className="font-dunggeunmo text-sm text-dark-bg/70 mb-3 line-clamp-2">
                    {h.summary}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {h.tags.map(tag => (
                      <span
                        key={tag}
                        className="font-pixel text-[8px] px-2 py-0.5 bg-dark-bg/10 rounded-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </PageShell>
      </section>

      {/* ── Portal Features ── */}
      <section>
        <PageShell>
          <h2 className="font-pixel text-accent-mint text-sm text-center mb-2">
            PORTAL FEATURES
          </h2>
          <p className="font-dunggeunmo text-xl text-center text-card-white mb-8">
            모든 여정을 하나의 포털에서
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {FEATURES.map(f => (
              <div
                key={f.title}
                className="flex flex-col items-center text-center gap-2 p-4"
              >
                <Image src={f.icon} alt={f.title} width={40} height={40} />
                <span className="font-pixel text-[10px] text-accent-orange">{f.title}</span>
                <span className="font-dunggeunmo text-xs text-card-white/70">{f.desc}</span>
              </div>
            ))}
          </div>
        </PageShell>
      </section>

      {/* ── CTA Footer ── */}
      <section className="bg-accent-orange">
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <h2 className="font-pixel text-dark-bg text-lg mb-2">
            준비되셨나요?
          </h2>
          <p className="font-dunggeunmo text-dark-bg/80 text-lg mb-6">
            모험을 시작할 시간입니다!
          </p>
          <div className="flex justify-center gap-3">
            <PixelButton href="/camp" variant="secondary">팀 생성하기</PixelButton>
            <PixelButton href="/hackathons" variant="secondary">둘러보기</PixelButton>
          </div>
        </div>
      </section>
    </>
  );
}
