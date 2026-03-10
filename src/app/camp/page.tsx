'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getItem, setItem } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import { getPendingSubmitDraft } from '@/lib/submission-drafts';
import type { Hackathon, Team } from '@/lib/types';
import PageShell from '@/components/layout/PageShell';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import LoadingState from '@/components/ui/LoadingState';
import PixelButton from '@/components/ui/PixelButton';
import TeamCard from '@/components/ui/TeamCard';

export default function CampPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <CampPageContent />
    </Suspense>
  );
}

function CampPageContent() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [teams, setTeams] = useState<Team[] | null>(null);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formIntro, setFormIntro] = useState('');
  const [formHackathon, setFormHackathon] = useState('');
  const [formLookingFor, setFormLookingFor] = useState('');
  const [formContact, setFormContact] = useState('');
  const filter = searchParams.get('hackathon')?.trim() || 'all';

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;

      const storedTeams = getItem<Team[]>(STORAGE_KEYS.TEAMS);
      const storedHackathons = getItem<Hackathon[]>(STORAGE_KEYS.HACKATHONS);

      setTeams(storedTeams ?? []);
      setHackathons(storedHackathons ?? []);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const activeHackathon = hackathons.find(hackathon => hackathon.slug === filter);
  const pendingDraft = useMemo(
    () => (filter === 'all' ? null : getPendingSubmitDraft(filter)),
    [filter],
  );

  if (teams === null) return <LoadingState />;

  const filteredTeams =
    filter === 'all' ? teams : teams.filter(team => team.hackathonSlug === filter);
  const openTeams = filteredTeams.filter(team => team.isOpen);
  const closedTeams = filteredTeams.filter(team => !team.isOpen);

  function handleFilterChange(nextFilter: string) {
    const nextSearchParams = new URLSearchParams(searchParams.toString());

    if (nextFilter === 'all') {
      nextSearchParams.delete('hackathon');
    } else {
      nextSearchParams.set('hackathon', nextFilter);
    }

    const nextQuery = nextSearchParams.toString();
    router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }

  function handleCreate() {
    if (!formName.trim()) return;

    const currentTeams = teams ?? [];
    const newTeam: Team = {
      id: `T-${Date.now()}`,
      hackathonSlug: formHackathon || undefined,
      name: formName.trim(),
      intro: formIntro.trim(),
      isOpen: true,
      lookingFor: formLookingFor
        .split(',')
        .map(role => role.trim())
        .filter(Boolean),
      contactUrl: formContact.trim() || undefined,
      memberCount: 1,
      createdAt: new Date().toISOString(),
    };

    const updatedTeams = [...currentTeams, newTeam];
    setTeams(updatedTeams);
    setItem(STORAGE_KEYS.TEAMS, updatedTeams);

    setFormName('');
    setFormIntro('');
    setFormHackathon('');
    setFormLookingFor('');
    setFormContact('');
    setShowForm(false);
  }

  return (
    <PageShell>
      <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-2 font-pixel text-lg text-accent-orange">RECRUIT HUB</h1>
          <p className="font-dunggeunmo text-card-white/70">
            같이 도전할 팀을 찾거나, 새로운 팀을 열어 모집할 수 있습니다.
          </p>
          {activeHackathon && (
            <p className="mt-2 font-dunggeunmo text-xs text-accent-mint">
              Showing teams for {activeHackathon.title}
            </p>
          )}
        </div>
        <PixelButton
          onClick={() => {
            if (!showForm && filter !== 'all' && !formHackathon) {
              setFormHackathon(filter);
            }

            setShowForm(!showForm);
          }}
          className="min-h-10"
        >
          {showForm ? '닫기' : '+ 원정대 만들기'}
        </PixelButton>
      </div>

      {pendingDraft && activeHackathon && (
        <div className="mb-6 border border-accent-orange/35 bg-accent-orange/10 px-4 py-3">
          <p className="font-pixel text-[9px] text-accent-orange">PENDING SUBMIT DRAFT</p>
          <p className="mt-1 font-dunggeunmo text-sm text-card-white/80">
            {activeHackathon.title} 상세에서 저장한 제출 초안이 있습니다. 팀을 찾거나 작전실로 들어가 이어서 정리할 수 있습니다.
          </p>
        </div>
      )}

      {showForm && (
        <Card hover={false} variant="dark" className="mb-6">
          <h2 className="mb-4 font-pixel text-[10px] text-accent-yellow">NEW EXPEDITION</h2>
          <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-dunggeunmo text-xs text-card-white/70">
                원정대명 *
              </label>
              <input
                value={formName}
                onChange={event => setFormName(event.target.value)}
                className="w-full border-2 border-dark-border bg-dark-bg px-3 py-2 font-dunggeunmo text-sm text-card-white"
                placeholder="예: Team Alpha"
              />
            </div>
            <div>
              <label className="mb-1 block font-dunggeunmo text-xs text-card-white/70">
                연결 해커톤
              </label>
              <select
                value={formHackathon}
                onChange={event => setFormHackathon(event.target.value)}
                className="w-full border-2 border-dark-border bg-dark-bg px-3 py-2 font-dunggeunmo text-sm text-card-white"
              >
                <option value="">선택 없음</option>
                {hackathons.map(hackathon => (
                  <option key={hackathon.slug} value={hackathon.slug}>
                    {hackathon.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block font-dunggeunmo text-xs text-card-white/70">소개</label>
              <textarea
                value={formIntro}
                onChange={event => setFormIntro(event.target.value)}
                className="w-full border-2 border-dark-border bg-dark-bg px-3 py-2 font-dunggeunmo text-sm text-card-white"
                rows={2}
                placeholder="팀 소개를 적어주세요."
              />
            </div>
            <div>
              <label className="mb-1 block font-dunggeunmo text-xs text-card-white/70">
                모집 역할 (콤마 구분)
              </label>
              <input
                value={formLookingFor}
                onChange={event => setFormLookingFor(event.target.value)}
                className="w-full border-2 border-dark-border bg-dark-bg px-3 py-2 font-dunggeunmo text-sm text-card-white"
                placeholder="예: Frontend, Designer"
              />
            </div>
            <div>
              <label className="mb-1 block font-dunggeunmo text-xs text-card-white/70">
                연락 링크
              </label>
              <input
                value={formContact}
                onChange={event => setFormContact(event.target.value)}
                className="w-full border-2 border-dark-border bg-dark-bg px-3 py-2 font-dunggeunmo text-sm text-card-white"
                placeholder="https://..."
              />
            </div>
          </div>
          <PixelButton onClick={handleCreate}>원정대 생성</PixelButton>
        </Card>
      )}

      <div className="mb-6">
        {/* 모바일: select 드롭다운 */}
        <select
          value={filter}
          onChange={e => handleFilterChange(e.target.value)}
          className="mb-2 min-h-10 w-full border-2 border-dark-border bg-dark-bg px-3 py-2 font-pixel text-[10px] text-card-white sm:hidden"
        >
          <option value="all">전체</option>
          {hackathons.map(hackathon => (
            <option key={hackathon.slug} value={hackathon.slug}>
              {hackathon.title}
            </option>
          ))}
        </select>

        {/* 데스크톱: 버튼 행 */}
        <div className="hidden flex-wrap gap-2 sm:flex">
          <button
            onClick={() => handleFilterChange('all')}
            className={`min-h-10 border-2 px-3 py-2 font-pixel text-[10px] transition-colors ${
              filter === 'all'
                ? 'border-accent-orange bg-accent-orange text-dark-bg'
                : 'border-dark-border bg-transparent text-card-white/70 hover:border-card-white/50'
            }`}
          >
            전체
          </button>
          {hackathons.map(hackathon => (
            <button
              key={hackathon.slug}
              onClick={() => handleFilterChange(hackathon.slug)}
              className={`min-h-10 max-w-[180px] truncate border-2 px-3 py-2 text-left font-pixel text-[9px] leading-relaxed transition-colors ${
                filter === hackathon.slug
                  ? 'border-accent-orange bg-accent-orange text-dark-bg'
                  : 'border-dark-border bg-transparent text-card-white/70 hover:border-card-white/50'
              }`}
            >
              {hackathon.title}
            </button>
          ))}
        </div>

        <span className="mt-2 block font-dunggeunmo text-xs text-card-white/50">
          {filteredTeams.length}개 원정대
        </span>
      </div>

      {filteredTeams.length === 0 ? (
        <EmptyState message="해당 조건의 원정대가 없습니다." />
      ) : (
        <div className="space-y-6">
          {openTeams.length > 0 && (
            <div>
              <h2 className="mb-3 font-pixel text-[10px] text-accent-mint">
                RECRUITING ({openTeams.length})
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {openTeams.map(team => (
                  <TeamCard key={team.id} team={team} hackathons={hackathons} />
                ))}
              </div>
            </div>
          )}
          {closedTeams.length > 0 && (
            <div>
              <h2 className="mb-3 font-pixel text-[10px] text-card-white/50">
                CLOSED ({closedTeams.length})
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {closedTeams.map(team => (
                  <TeamCard key={team.id} team={team} hackathons={hackathons} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </PageShell>
  );
}

