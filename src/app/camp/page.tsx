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
import ErrorState from '@/components/ui/ErrorState';
import LoadingState from '@/components/ui/LoadingState';
import PixelButton from '@/components/ui/PixelButton';
import TeamCard from '@/components/ui/TeamCard';
import rawTeams from '../../../hackathonsjson/public_teams.json';

const RECRUIT_ROLE_OPTIONS = [
  'Frontend',
  'Backend',
  'Designer',
  'PM',
  'AI',
  'Full Stack',
];

function normalizeRoleLabel(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

function hasRole(roles: string[], candidate: string): boolean {
  return roles.some(role => role.toLowerCase() === candidate.toLowerCase());
}

const PUBLIC_TEAM_IDS = new Set(
  (rawTeams as { teamCode: string }[]).map(team => team.teamCode),
);

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
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formIntro, setFormIntro] = useState('');
  const [formHackathon, setFormHackathon] = useState('');
  const [formIsOpen, setFormIsOpen] = useState(true);
  const [formLookingFor, setFormLookingFor] = useState<string[]>([]);
  const [customRoleInput, setCustomRoleInput] = useState('');
  const [formContact, setFormContact] = useState('');
  const filter = searchParams.get('hackathon')?.trim() || 'all';

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;

      try {
        const storedTeams = getItem<Team[]>(STORAGE_KEYS.TEAMS);
        const storedHackathons = getItem<Hackathon[]>(STORAGE_KEYS.HACKATHONS);

        if (storedTeams !== null && !Array.isArray(storedTeams)) {
          throw new Error('팀 데이터 형식이 올바르지 않습니다.');
        }

        if (storedHackathons !== null && !Array.isArray(storedHackathons)) {
          throw new Error('해커톤 데이터 형식이 올바르지 않습니다.');
        }

        setTeams(storedTeams ?? []);
        setHackathons(storedHackathons ?? []);
        setLoadError(null);
      } catch (error) {
        setTeams([]);
        setHackathons([]);
        setLoadError(
          error instanceof Error ? error.message : '원정대 데이터를 불러오지 못했습니다.',
        );
      }
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
  if (loadError) {
    return (
      <PageShell>
        <ErrorState message={loadError} />
      </PageShell>
    );
  }

  const filteredTeams =
    filter === 'all' ? teams : teams.filter(team => team.hackathonSlug === filter);
  const openTeams = filteredTeams.filter(team => team.isOpen);
  const closedTeams = filteredTeams.filter(team => !team.isOpen);

  function resetForm() {
    setFormName('');
    setFormIntro('');
    setFormHackathon('');
    setFormIsOpen(true);
    setFormLookingFor([]);
    setCustomRoleInput('');
    setFormContact('');
    setEditingTeamId(null);
  }

  function isEditableCustomTeam(team: Team): boolean {
    return !PUBLIC_TEAM_IDS.has(team.id);
  }

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

  function handleSubmitTeam() {
    if (!formName.trim()) return;

    const currentTeams = teams ?? [];
    const timestamp = new Date().toISOString();
    const updatedTeams = editingTeamId
      ? currentTeams.map(team =>
          team.id === editingTeamId
            ? {
                ...team,
                hackathonSlug: formHackathon || undefined,
                name: formName.trim(),
                intro: formIntro.trim(),
                isOpen: formIsOpen,
                lookingFor: formLookingFor,
                contactUrl: formContact.trim() || undefined,
                updatedAt: timestamp,
              }
            : team,
        )
      : [
          ...currentTeams,
          {
            id: `T-${Date.now()}`,
            hackathonSlug: formHackathon || undefined,
            name: formName.trim(),
            intro: formIntro.trim(),
            isOpen: formIsOpen,
            lookingFor: formLookingFor,
            contactUrl: formContact.trim() || undefined,
            memberCount: 1,
            createdAt: timestamp,
          },
        ];

    setTeams(updatedTeams);
    setItem(STORAGE_KEYS.TEAMS, updatedTeams);

    resetForm();
    setShowForm(false);
  }

  function handleEditTeam(team: Team) {
    if (!isEditableCustomTeam(team)) return;

    setEditingTeamId(team.id);
    setFormName(team.name);
    setFormIntro(team.intro);
    setFormHackathon(team.hackathonSlug ?? '');
    setFormIsOpen(team.isOpen);
    setFormLookingFor(team.lookingFor);
    setCustomRoleInput('');
    setFormContact(team.contactUrl ?? '');
    setShowForm(true);
  }

  function handleCloseRecruitment(teamId: string) {
    const updatedTeams = (teams ?? []).map(team =>
      team.id === teamId ? { ...team, isOpen: false, updatedAt: new Date().toISOString() } : team,
    );

    setTeams(updatedTeams);
    setItem(STORAGE_KEYS.TEAMS, updatedTeams);
  }

  function toggleRole(role: string) {
    setFormLookingFor(current =>
      hasRole(current, role)
        ? current.filter(entry => entry.toLowerCase() !== role.toLowerCase())
        : [...current, role],
    );
  }

  function addCustomRole() {
    const nextRole = normalizeRoleLabel(customRoleInput);
    if (!nextRole || hasRole(formLookingFor, nextRole)) {
      setCustomRoleInput('');
      return;
    }

    setFormLookingFor(current => [...current, nextRole]);
    setCustomRoleInput('');
  }

  function removeRole(role: string) {
    setFormLookingFor(current =>
      current.filter(entry => entry.toLowerCase() !== role.toLowerCase()),
    );
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

            if (showForm) {
              resetForm();
            }

            setShowForm(!showForm);
          }}
          className="min-h-10"
        >
          {showForm ? '닫기' : editingTeamId ? '원정대 수정' : '+ 원정대 만들기'}
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
          <h2 className="mb-4 font-pixel text-[10px] text-accent-yellow">
            {editingTeamId ? 'EDIT EXPEDITION' : 'NEW EXPEDITION'}
          </h2>
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
            <div className="sm:col-span-2">
              <label className="mb-1 block font-dunggeunmo text-xs text-card-white/70">
                모집 상태
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setFormIsOpen(true)}
                  className={`min-h-10 border px-3 py-2 font-dunggeunmo text-xs font-bold transition-colors ${
                    formIsOpen
                      ? 'border-accent-mint bg-accent-mint/18 text-accent-mint'
                      : 'border-dark-border bg-dark-bg text-card-white/70 hover:border-card-white/40'
                  }`}
                >
                  모집중
                </button>
                <button
                  type="button"
                  onClick={() => setFormIsOpen(false)}
                  className={`min-h-10 border px-3 py-2 font-dunggeunmo text-xs font-bold transition-colors ${
                    !formIsOpen
                      ? 'border-card-white/30 bg-card-white/10 text-card-white'
                      : 'border-dark-border bg-dark-bg text-card-white/70 hover:border-card-white/40'
                  }`}
                >
                  모집 마감
                </button>
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block font-dunggeunmo text-xs text-card-white/70">
                모집 역할
              </label>
              <p className="mb-2 font-dunggeunmo text-xs text-card-white/45">
                기본 역할을 고르거나 직접 추가할 수 있습니다.
              </p>
              <div className="mb-3 flex flex-wrap gap-2">
                {RECRUIT_ROLE_OPTIONS.map(role => {
                  const isSelected = hasRole(formLookingFor, role);

                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => toggleRole(role)}
                      className={`min-h-10 border px-3 py-2 font-dunggeunmo text-xs font-bold leading-tight transition-colors ${
                        isSelected
                          ? 'border-accent-orange bg-accent-orange/16 text-accent-orange'
                          : 'border-dark-border bg-dark-bg text-card-white/70 hover:border-card-white/40'
                      }`}
                    >
                      {role}
                    </button>
                  );
                })}
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
                <input
                  value={customRoleInput}
                  onChange={event => setCustomRoleInput(event.target.value)}
                  className="w-full border-2 border-dark-border bg-dark-bg px-3 py-2 font-dunggeunmo text-sm text-card-white"
                  placeholder="직접 역할 추가"
                  onKeyDown={event => event.key === 'Enter' && addCustomRole()}
                />
                <PixelButton onClick={addCustomRole} className="min-h-10">
                  역할 추가
                </PixelButton>
              </div>
              {formLookingFor.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {formLookingFor.map(role => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => removeRole(role)}
                      className="inline-flex min-h-9 max-w-full items-center gap-2 border border-accent-yellow/40 bg-accent-yellow/18 px-2.5 py-1 font-dunggeunmo text-xs font-bold leading-tight text-accent-orange"
                    >
                      <span className="break-words">{role}</span>
                      <span className="font-pixel text-[8px] text-accent-pink">X</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="sm:col-span-2">
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
          <div className="flex flex-wrap gap-2">
            <PixelButton onClick={handleSubmitTeam}>
              {editingTeamId ? '원정대 수정 저장' : '원정대 생성'}
            </PixelButton>
            <PixelButton
              variant="ghost"
              onClick={() => {
                resetForm();
                setShowForm(false);
              }}
            >
              취소
            </PixelButton>
          </div>
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
                  <TeamCard
                    key={team.id}
                    team={team}
                    hackathons={hackathons}
                    canEdit={isEditableCustomTeam(team)}
                    onEdit={() => handleEditTeam(team)}
                    onCloseRecruitment={() => handleCloseRecruitment(team.id)}
                  />
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
                  <TeamCard
                    key={team.id}
                    team={team}
                    hackathons={hackathons}
                    canEdit={isEditableCustomTeam(team)}
                    onEdit={() => handleEditTeam(team)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </PageShell>
  );
}
