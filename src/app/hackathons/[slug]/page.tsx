'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { getHackathonSectionsWithFallback, getDisplayHackathonStatus } from '@/lib/hackathon-detail';
import { getItem } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import type { Hackathon, HackathonSectionType, Team } from '@/lib/types';
import SectionRenderer from '@/components/hackathon/SectionRenderer';
import SectionTabs from '@/components/hackathon/SectionTabs';
import SummaryBar from '@/components/hackathon/SummaryBar';
import PageShell from '@/components/layout/PageShell';
import ErrorState from '@/components/ui/ErrorState';
import LoadingState from '@/components/ui/LoadingState';

export default function HackathonDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [hackathon, setHackathon] = useState<Hackathon | null | undefined>(undefined);
  const [teamCountOverride, setTeamCountOverride] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<HackathonSectionType>('overview');

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;

      const allHackathons = getItem<Hackathon[]>(STORAGE_KEYS.HACKATHONS) ?? [];
      const foundHackathon = allHackathons.find(entry => entry.slug === slug) ?? null;
      setHackathon(foundHackathon);

      const allTeams = getItem<Team[]>(STORAGE_KEYS.TEAMS) ?? [];
      setTeamCountOverride(allTeams.filter(team => team.hackathonSlug === slug).length);

      if (foundHackathon) {
        const sections = getHackathonSectionsWithFallback(foundHackathon);
        setActiveTab(sections[0]?.type ?? 'overview');
      }
    });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const normalizedHackathon = useMemo(() => {
    if (!hackathon) return hackathon;

    return {
      ...hackathon,
      status: getDisplayHackathonStatus(hackathon.status, hackathon.eventEndAt),
      teamCount: teamCountOverride ?? hackathon.teamCount,
    };
  }, [hackathon, teamCountOverride]);

  const sectionCatalog = useMemo(
    () => (normalizedHackathon ? getHackathonSectionsWithFallback(normalizedHackathon) : []),
    [normalizedHackathon],
  );

  if (hackathon === undefined) return <LoadingState />;

  if (hackathon === null || !normalizedHackathon) {
    return (
      <PageShell>
        <ErrorState message={`해커톤 "${slug}"을 찾을 수 없습니다.`} />
      </PageShell>
    );
  }

  const sectionTypes = sectionCatalog.map(section => section.type);
  const activeSection =
    sectionCatalog.find(section => section.type === activeTab) ?? sectionCatalog[0];

  return (
    <PageShell>
      <div className="mb-6">
        <div className="mb-2 flex flex-wrap gap-1">
          {normalizedHackathon.tags.map(tag => (
            <span
              key={tag}
              className="bg-accent-orange/20 px-2 py-0.5 font-pixel text-[8px] text-accent-orange"
            >
              {tag}
            </span>
          ))}
        </div>
        <h1 className="mb-2 font-pixel text-lg text-accent-orange sm:text-xl">
          {normalizedHackathon.title}
        </h1>
        {normalizedHackathon.summary && (
          <p className="font-dunggeunmo text-sm text-card-white/70">
            {normalizedHackathon.summary}
          </p>
        )}
      </div>

      {normalizedHackathon.thumbnailUrl && (
        <div className="mb-6 overflow-hidden border-2 border-dark-border bg-dark-border/30">
          <Image
            src={normalizedHackathon.thumbnailUrl}
            alt={`${normalizedHackathon.title} banner`}
            width={1600}
            height={640}
            sizes="(min-width: 1152px) 1120px, calc(100vw - 2rem)"
            className="h-auto w-full object-cover"
          />
        </div>
      )}

      <div className="mb-6">
        <SummaryBar hackathon={normalizedHackathon} />
      </div>

      <div className="mb-6">
        <SectionTabs sections={sectionTypes} active={activeTab} onSelect={setActiveTab} />
      </div>

      <div className="min-h-[200px]">
        <SectionRenderer section={activeSection} hackathon={normalizedHackathon} />
      </div>
    </PageShell>
  );
}
