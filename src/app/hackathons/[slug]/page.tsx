'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getItem } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import type { Hackathon, HackathonSectionType } from '@/lib/types';
import PageShell from '@/components/layout/PageShell';
import SummaryBar from '@/components/hackathon/SummaryBar';
import SectionTabs from '@/components/hackathon/SectionTabs';
import SectionRenderer from '@/components/hackathon/SectionRenderer';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';

export default function HackathonDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [hackathon, setHackathon] = useState<Hackathon | null | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<HackathonSectionType>('overview');

  useEffect(() => {
    const all = getItem<Hackathon[]>(STORAGE_KEYS.HACKATHONS) ?? [];
    const found = all.find(h => h.slug === slug);
    setHackathon(found ?? null);

    // Set first available tab
    if (found && found.sections.length > 0) {
      setActiveTab(found.sections[0].type);
    }
  }, [slug]);

  // Loading
  if (hackathon === undefined) return <LoadingState />;

  // Not found
  if (hackathon === null) {
    return (
      <PageShell>
        <ErrorState message={`해커톤 "${slug}"을(를) 찾을 수 없습니다`} />
      </PageShell>
    );
  }

  const sectionTypes = hackathon.sections
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map(s => s.type);

  const activeSection = hackathon.sections.find(s => s.type === activeTab);

  return (
    <PageShell>
      {/* Title Banner */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-1 mb-2">
          {hackathon.tags.map(tag => (
            <span key={tag} className="font-pixel text-[8px] px-2 py-0.5 bg-accent-orange/20 text-accent-orange">
              {tag}
            </span>
          ))}
        </div>
        <h1 className="font-pixel text-lg sm:text-xl text-accent-orange mb-2">
          {hackathon.title}
        </h1>
        {hackathon.summary && (
          <p className="font-dunggeunmo text-sm text-card-white/70">
            {hackathon.summary}
          </p>
        )}
      </div>

      {/* Summary Bar */}
      <div className="mb-6">
        <SummaryBar hackathon={hackathon} />
      </div>

      {/* Section Tabs */}
      <div className="mb-6">
        <SectionTabs
          sections={sectionTypes}
          active={activeTab}
          onSelect={setActiveTab}
        />
      </div>

      {/* Section Content */}
      <div className="min-h-[200px]">
        {activeSection ? (
          <SectionRenderer
            section={activeSection}
            hackathonSlug={hackathon.slug}
          />
        ) : (
          <p className="font-dunggeunmo text-sm text-card-white/50">
            이 섹션의 콘텐츠가 없습니다.
          </p>
        )}
      </div>
    </PageShell>
  );
}
