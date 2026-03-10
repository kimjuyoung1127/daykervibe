'use client';

import { useEffect, useState } from 'react';
import { getItem, setItem } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import type { Hackathon, Team } from '@/lib/types';
import PageShell from '@/components/layout/PageShell';
import Card from '@/components/ui/Card';
import PixelButton from '@/components/ui/PixelButton';
import LoadingState from '@/components/ui/LoadingState';
import EmptyState from '@/components/ui/EmptyState';

export default function CampPage() {
  const [teams, setTeams] = useState<Team[] | null>(null);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formIntro, setFormIntro] = useState('');
  const [formHackathon, setFormHackathon] = useState('');
  const [formLookingFor, setFormLookingFor] = useState('');
  const [formContact, setFormContact] = useState('');

  useEffect(() => {
    const t = getItem<Team[]>(STORAGE_KEYS.TEAMS);
    setTeams(t ?? []);
    const h = getItem<Hackathon[]>(STORAGE_KEYS.HACKATHONS);
    setHackathons(h ?? []);
  }, []);

  if (teams === null) return <LoadingState />;

  const filtered = filter === 'all'
    ? teams
    : teams.filter(t => t.hackathonSlug === filter);

  const openTeams = filtered.filter(t => t.isOpen);
  const closedTeams = filtered.filter(t => !t.isOpen);

  function handleCreate() {
    if (!formName.trim() || !teams) return;

    const newTeam: Team = {
      id: `T-${Date.now()}`,
      hackathonSlug: formHackathon || undefined,
      name: formName.trim(),
      intro: formIntro.trim(),
      isOpen: true,
      lookingFor: formLookingFor.split(',').map(s => s.trim()).filter(Boolean),
      contactUrl: formContact.trim(),
      memberCount: 1,
      createdAt: new Date().toISOString(),
    };

    const updated = [...teams, newTeam];
    setTeams(updated);
    setItem(STORAGE_KEYS.TEAMS, updated);

    setFormName('');
    setFormIntro('');
    setFormHackathon('');
    setFormLookingFor('');
    setFormContact('');
    setShowForm(false);
  }

  return (
    <PageShell>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-pixel text-accent-orange text-lg mb-2">RECRUIT HUB</h1>
          <p className="font-dunggeunmo text-card-white/70">
            원정대를 찾거나, 새로운 원정대를 만드세요
          </p>
        </div>
        <PixelButton onClick={() => setShowForm(!showForm)}>
          {showForm ? '닫기' : '+ 원정대 만들기'}
        </PixelButton>
      </div>

      {/* Create Form */}
      {showForm && (
        <Card hover={false} className="mb-6">
          <h2 className="font-pixel text-[10px] text-accent-yellow mb-4">NEW EXPEDITION</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="font-dunggeunmo text-xs text-dark-bg/70 block mb-1">원정대명 *</label>
              <input
                value={formName}
                onChange={e => setFormName(e.target.value)}
                className="w-full px-3 py-2 bg-dark-bg/5 border-2 border-dark-border text-dark-bg font-dunggeunmo text-sm"
                placeholder="예: Team Alpha"
              />
            </div>
            <div>
              <label className="font-dunggeunmo text-xs text-dark-bg/70 block mb-1">연결 해커톤</label>
              <select
                value={formHackathon}
                onChange={e => setFormHackathon(e.target.value)}
                className="w-full px-3 py-2 bg-dark-bg/5 border-2 border-dark-border text-dark-bg font-dunggeunmo text-sm"
              >
                <option value="">선택 안 함</option>
                {hackathons.map(h => (
                  <option key={h.slug} value={h.slug}>{h.title}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="font-dunggeunmo text-xs text-dark-bg/70 block mb-1">소개</label>
              <textarea
                value={formIntro}
                onChange={e => setFormIntro(e.target.value)}
                className="w-full px-3 py-2 bg-dark-bg/5 border-2 border-dark-border text-dark-bg font-dunggeunmo text-sm"
                rows={2}
                placeholder="팀 소개를 작성하세요"
              />
            </div>
            <div>
              <label className="font-dunggeunmo text-xs text-dark-bg/70 block mb-1">모집 포지션 (콤마 구분)</label>
              <input
                value={formLookingFor}
                onChange={e => setFormLookingFor(e.target.value)}
                className="w-full px-3 py-2 bg-dark-bg/5 border-2 border-dark-border text-dark-bg font-dunggeunmo text-sm"
                placeholder="예: Frontend, Designer"
              />
            </div>
            <div>
              <label className="font-dunggeunmo text-xs text-dark-bg/70 block mb-1">연락 링크</label>
              <input
                value={formContact}
                onChange={e => setFormContact(e.target.value)}
                className="w-full px-3 py-2 bg-dark-bg/5 border-2 border-dark-border text-dark-bg font-dunggeunmo text-sm"
                placeholder="https://..."
              />
            </div>
          </div>
          <PixelButton onClick={handleCreate}>원정대 생성</PixelButton>
        </Card>
      )}

      {/* Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        <button
          onClick={() => setFilter('all')}
          className={`font-pixel text-[10px] px-3 py-1.5 whitespace-nowrap border-2 transition-colors ${
            filter === 'all'
              ? 'bg-accent-orange text-dark-bg border-accent-orange'
              : 'bg-transparent text-card-white/70 border-dark-border hover:border-card-white/50'
          }`}
        >
          전체
        </button>
        {hackathons.map(h => (
          <button
            key={h.slug}
            onClick={() => setFilter(h.slug)}
            className={`font-pixel text-[10px] px-3 py-1.5 whitespace-nowrap border-2 transition-colors ${
              filter === h.slug
                ? 'bg-accent-orange text-dark-bg border-accent-orange'
                : 'bg-transparent text-card-white/70 border-dark-border hover:border-card-white/50'
            }`}
          >
            {h.title.length > 15 ? h.title.slice(0, 15) + '…' : h.title}
          </button>
        ))}
        <span className="ml-auto font-dunggeunmo text-xs text-card-white/50 self-center">
          {filtered.length}개 원정대
        </span>
      </div>

      {/* Team List */}
      {filtered.length === 0 ? (
        <EmptyState message="해당 조건의 원정대가 없습니다" />
      ) : (
        <div className="space-y-6">
          {openTeams.length > 0 && (
            <div>
              <h2 className="font-pixel text-[10px] text-accent-mint mb-3">RECRUITING ({openTeams.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {openTeams.map(team => (
                  <TeamCard key={team.id} team={team} hackathons={hackathons} />
                ))}
              </div>
            </div>
          )}
          {closedTeams.length > 0 && (
            <div>
              <h2 className="font-pixel text-[10px] text-card-white/50 mb-3">CLOSED ({closedTeams.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

function TeamCard({ team, hackathons }: { team: Team; hackathons: Hackathon[] }) {
  const hackathon = hackathons.find(h => h.slug === team.hackathonSlug);

  return (
    <Card className="flex flex-col">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-dunggeunmo font-bold text-base">{team.name}</h3>
        <span
          className={`font-pixel text-[8px] px-2 py-0.5 ${
            team.isOpen
              ? 'bg-accent-mint/20 text-accent-mint border border-accent-mint/40'
              : 'bg-dark-border/20 text-dark-bg/50 border border-dark-border'
          }`}
        >
          {team.isOpen ? 'RECRUITING' : 'CLOSED'}
        </span>
      </div>

      {hackathon && (
        <span className="font-pixel text-[8px] text-accent-purple mb-2 block">
          {hackathon.title}
        </span>
      )}

      <p className="font-dunggeunmo text-sm text-dark-bg/70 mb-3">{team.intro}</p>

      {team.lookingFor.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {team.lookingFor.map(role => (
            <span
              key={role}
              className="font-pixel text-[8px] px-2 py-0.5 bg-accent-yellow/20 text-accent-orange border border-accent-yellow/40"
            >
              {role}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between">
        <span className="font-dunggeunmo text-xs text-dark-bg/50">
          {team.memberCount}명
        </span>
        {team.isOpen && team.contactUrl && (
          <a
            href={team.contactUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-pixel text-[8px] text-accent-orange hover:underline"
          >
            연락하기 →
          </a>
        )}
      </div>
    </Card>
  );
}
