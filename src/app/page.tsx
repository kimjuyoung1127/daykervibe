'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getItem } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import type { Hackathon, RankingProfile } from '@/lib/types';
import { formatPoints } from '@/lib/format';
import PageShell from '@/components/layout/PageShell';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import PixelButton from '@/components/ui/PixelButton';
import LoadingState from '@/components/ui/LoadingState';

const SSOT_DOCS = [
  { label: 'PRD', desc: '제품 요구사항 정의서', detail: '핵심 흐름 · 평가 기준 매핑' },
  { label: 'Schema', desc: '데이터 구조 설계', detail: '14개 엔티티 · 공개/팀로컬/비공개 경계' },
  { label: 'Wireframe', desc: '화면 설계서', detail: '6개 라우트 · 8비트 디자인 토큰' },
  { label: 'Architecture', desc: '시스템 아키텍처', detail: 'localStorage 우선 전략' },
];

const AUTOMATIONS = [
  { label: 'Code Review', desc: '코드↔문서 정합성 검증', detail: '라우트 수 · 타입 커버리지 · 미사용 키' },
  { label: 'Security', desc: '보안 경계 자동 검증', detail: 'team-local 격리 · URL 주입 · 크리덴셜 스캔' },
  { label: 'Doc Sync', desc: 'SSOT 드리프트 감지', detail: 'PRD↔Schema↔Wireframe 일관성' },
  { label: 'Nightly', desc: '일일 로그 정리', detail: '증빙 아카이브 · 중복 제거' },
  { label: 'Arch Sync', desc: '아키텍처 다이어그램 커버리지', detail: 'Mermaid 흐름도 검증' },
  { label: 'Health', desc: '자동화 상태 모니터링', detail: '프롬프트 · 상태 문서 무결성' },
];

const FEATURES = [
  { icon: '/search.svg', title: 'RECRUIT', desc: '해커톤을 탐색하고 참가 신청하세요' },
  { icon: '/team.svg', title: 'TEAM', desc: '팀을 모집하거나 합류하세요' },
  { icon: '/rocket.svg', title: 'WAR ROOM', desc: '팀 작전실에서 제출을 준비하세요' },
  { icon: '/checklist.svg', title: 'SUBMIT', desc: '기획서, 웹, PDF를 단계별 제출' },
  { icon: '/trophy.svg', title: 'EVALUATE', desc: '리더보드와 랭킹을 확인하세요' },
];

export default function Home() {
  const [hackathons, setHackathons] = useState<Hackathon[] | null>(null);
  const [rankings, setRankings] = useState<RankingProfile[]>([]);

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;
      const data = getItem<Hackathon[]>(STORAGE_KEYS.HACKATHONS);
      setHackathons(data ?? []);

      const rk = getItem<RankingProfile[]>(STORAGE_KEYS.RANKINGS) ?? [];
      const topAll = rk
        .filter(r => r.period === 'all')
        .sort((a, b) => b.points - a.points)
        .slice(0, 5);
      setRankings(topAll);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (hackathons === null) return <LoadingState />;

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

      {/* ── Rankings Preview ── */}
      {rankings.length > 0 && (
        <section className="bg-dark-border/30">
          <PageShell>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="font-pixel text-accent-yellow text-xs">TOP EXPLORERS</span>
                <span className="font-dunggeunmo text-card-white/50">—</span>
                <span className="font-dunggeunmo text-card-white/70">전체 랭킹 TOP 5</span>
              </div>
              <PixelButton href="/rankings" variant="ghost">전체 보기</PixelButton>
            </div>

            <div className="rounded-sm border-2 border-dark-border overflow-hidden">
              <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-dark-border/50 font-pixel text-[8px] text-card-white/50">
                <span className="col-span-1">RANK</span>
                <span className="col-span-5">NICKNAME</span>
                <span className="col-span-3 text-right">POINTS</span>
                <span className="col-span-3 text-right">ACTIVITY</span>
              </div>
              {rankings.map((r, i) => {
                const bg = i === 0 ? 'bg-accent-yellow/10' : i === 1 ? 'bg-accent-mint/10' : i === 2 ? 'bg-accent-pink/10' : '';
                return (
                  <div key={r.id} className={`grid grid-cols-12 gap-2 px-4 py-2 border-t border-dark-border/30 ${bg}`}>
                    <span className="col-span-1 font-pixel text-xs text-accent-orange">#{i + 1}</span>
                    <span className="col-span-5 font-dunggeunmo text-sm text-card-white truncate">{r.nickname}</span>
                    <span className="col-span-3 font-pixel text-xs text-accent-yellow text-right">{formatPoints(r.points)}</span>
                    <span className="col-span-3 font-dunggeunmo text-xs text-card-white/60 text-right truncate">{r.activitySummary ?? '-'}</span>
                  </div>
                );
              })}
            </div>
          </PageShell>
        </section>
      )}

      {/* ── Operations Quality Evidence ── */}
      <section>
        <PageShell>
          <h2 className="font-pixel text-accent-mint text-sm text-center mb-2">
            OPERATIONS QUALITY
          </h2>
          <p className="font-dunggeunmo text-xl text-center text-card-white mb-8">
            문서 기반 개발 + 자동화 품질 관리
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* SSOT Documents */}
            <div>
              <p className="font-pixel text-[10px] text-accent-yellow mb-3">SSOT DOCUMENTS</p>
              <div className="grid grid-cols-2 gap-3">
                {SSOT_DOCS.map(d => (
                  <Card key={d.label} variant="dark" className="p-3">
                    <span className="font-pixel text-xs text-accent-orange">{d.label}</span>
                    <p className="font-dunggeunmo text-sm text-card-white mt-1">{d.desc}</p>
                    <p className="font-dunggeunmo text-xs text-card-white/50 mt-1">{d.detail}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Automation Processes */}
            <div>
              <p className="font-pixel text-[10px] text-accent-yellow mb-3">AUTOMATION PROCESSES</p>
              <div className="grid grid-cols-2 gap-3">
                {AUTOMATIONS.map(a => (
                  <Card key={a.label} variant="dark" className="p-3">
                    <span className="font-pixel text-xs text-accent-mint">{a.label}</span>
                    <p className="font-dunggeunmo text-sm text-card-white mt-1">{a.desc}</p>
                    <p className="font-dunggeunmo text-xs text-card-white/50 mt-1">{a.detail}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <p className="font-dunggeunmo text-sm text-center text-card-white/60 mt-6">
            6개 자동화가 매일 문서↔코드 정합성, 보안 경계, 아키텍처 커버리지를 검증합니다
          </p>
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
