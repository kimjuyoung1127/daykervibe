'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getItem, setItem } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import type {
  Team,
  Hackathon,
  TeamMember,
  WarRoom,
  WarRoomWorkflowCard,
  WarRoomChecklistItem,
  SubmissionArtifact,
  SubmissionStage,
  WorkflowColumn,
} from '@/lib/types';
import PageShell from '@/components/layout/PageShell';
import Card from '@/components/ui/Card';
import PixelButton from '@/components/ui/PixelButton';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';

const STAGES: { key: SubmissionStage; label: string }[] = [
  { key: 'teaming', label: '팀 구성' },
  { key: 'plan', label: '기획서' },
  { key: 'web', label: '웹 제출' },
  { key: 'pdf', label: 'PDF' },
  { key: 'done', label: '완료' },
];

const COLUMNS: { key: WorkflowColumn; label: string }[] = [
  { key: 'plan', label: '기획서 준비' },
  { key: 'web', label: '웹 제출 준비' },
  { key: 'pdf', label: 'PDF 준비' },
  { key: 'submitted', label: '제출 완료' },
];

export default function WarRoomPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState<Team | null>(null);
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [warRoom, setWarRoom] = useState<WarRoom | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [cards, setCards] = useState<WarRoomWorkflowCard[]>([]);
  const [checklist, setChecklist] = useState<WarRoomChecklistItem[]>([]);
  const [artifacts, setArtifacts] = useState<SubmissionArtifact[]>([]);

  // Form states
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardColumn, setNewCardColumn] = useState<WorkflowColumn>('plan');
  const [newCheckLabel, setNewCheckLabel] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkLabel, setNewLinkLabel] = useState('');

  useEffect(() => {
    const teams = getItem<Team[]>(STORAGE_KEYS.TEAMS) ?? [];
    const t = teams.find(t => t.id === teamId);
    setTeam(t ?? null);

    if (t?.hackathonSlug) {
      const hacks = getItem<Hackathon[]>(STORAGE_KEYS.HACKATHONS) ?? [];
      setHackathon(hacks.find(h => h.slug === t.hackathonSlug) ?? null);
    }

    const allMembers = getItem<TeamMember[]>(STORAGE_KEYS.TEAM_MEMBERS) ?? [];
    setMembers(allMembers.filter(m => m.teamId === teamId));

    const allWarRooms = getItem<WarRoom[]>(STORAGE_KEYS.WAR_ROOMS) ?? [];
    const wr = allWarRooms.find(w => w.teamId === teamId);
    setWarRoom(wr ?? null);

    if (wr) {
      const allCards = getItem<WarRoomWorkflowCard[]>(STORAGE_KEYS.WAR_ROOM_WORKFLOW_CARDS) ?? [];
      setCards(allCards.filter(c => c.warRoomId === wr.id));

      const allChecks = getItem<WarRoomChecklistItem[]>(STORAGE_KEYS.WAR_ROOM_CHECKLIST) ?? [];
      setChecklist(allChecks.filter(c => c.warRoomId === wr.id));
    }

    const allArtifacts = getItem<SubmissionArtifact[]>(STORAGE_KEYS.SUBMISSION_ARTIFACTS) ?? [];
    setArtifacts(allArtifacts);

    setLoading(false);
  }, [teamId]);

  if (loading) return <LoadingState />;
  if (!team) return <ErrorState message={`팀 "${teamId}"를 찾을 수 없습니다`} />;

  // Ensure warRoom exists (auto-create if missing)
  function ensureWarRoom(): WarRoom {
    if (warRoom) return warRoom;
    const newWR: WarRoom = {
      id: `wr-${teamId}`,
      teamId,
      title: `${team!.name} 작전실`,
      summary: '',
      submissionStage: 'teaming',
      lastUpdated: new Date().toISOString(),
    };
    const allWarRooms = getItem<WarRoom[]>(STORAGE_KEYS.WAR_ROOMS) ?? [];
    setItem(STORAGE_KEYS.WAR_ROOMS, [...allWarRooms, newWR]);
    setWarRoom(newWR);
    return newWR;
  }

  function handleStageChange(stage: SubmissionStage) {
    const wr = ensureWarRoom();
    const updated = { ...wr, submissionStage: stage, lastUpdated: new Date().toISOString() };
    setWarRoom(updated);
    const all = getItem<WarRoom[]>(STORAGE_KEYS.WAR_ROOMS) ?? [];
    setItem(STORAGE_KEYS.WAR_ROOMS, all.map(w => w.id === updated.id ? updated : w));
  }

  function handleNotesChange(notes: string) {
    const wr = ensureWarRoom();
    const updated = { ...wr, notes, lastUpdated: new Date().toISOString() };
    setWarRoom(updated);
    const all = getItem<WarRoom[]>(STORAGE_KEYS.WAR_ROOMS) ?? [];
    setItem(STORAGE_KEYS.WAR_ROOMS, all.map(w => w.id === updated.id ? updated : w));
  }

  function handleAddCard() {
    if (!newCardTitle.trim()) return;
    const wr = ensureWarRoom();
    const newCard: WarRoomWorkflowCard = {
      id: `wc-${Date.now()}`,
      warRoomId: wr.id,
      title: newCardTitle.trim(),
      column: newCardColumn,
      order: cards.filter(c => c.column === newCardColumn).length,
      isBlocked: false,
    };
    const updated = [...cards, newCard];
    setCards(updated);
    const all = getItem<WarRoomWorkflowCard[]>(STORAGE_KEYS.WAR_ROOM_WORKFLOW_CARDS) ?? [];
    setItem(STORAGE_KEYS.WAR_ROOM_WORKFLOW_CARDS, [...all, newCard]);
    setNewCardTitle('');
  }

  function handleToggleCheck(id: string) {
    const statusOrder = ['todo', 'doing', 'done'] as const;
    const updated = checklist.map(c => {
      if (c.id !== id) return c;
      const curIdx = statusOrder.indexOf(c.status);
      const nextStatus = statusOrder[(curIdx + 1) % 3];
      return { ...c, status: nextStatus };
    });
    setChecklist(updated);
    const all = getItem<WarRoomChecklistItem[]>(STORAGE_KEYS.WAR_ROOM_CHECKLIST) ?? [];
    const merged = all.map(c => updated.find(u => u.id === c.id) ?? c);
    setItem(STORAGE_KEYS.WAR_ROOM_CHECKLIST, merged);
  }

  function handleAddCheckItem() {
    if (!newCheckLabel.trim()) return;
    const wr = ensureWarRoom();
    const newItem: WarRoomChecklistItem = {
      id: `cl-${Date.now()}`,
      warRoomId: wr.id,
      label: newCheckLabel.trim(),
      status: 'todo',
    };
    const updated = [...checklist, newItem];
    setChecklist(updated);
    const all = getItem<WarRoomChecklistItem[]>(STORAGE_KEYS.WAR_ROOM_CHECKLIST) ?? [];
    setItem(STORAGE_KEYS.WAR_ROOM_CHECKLIST, [...all, newItem]);
    setNewCheckLabel('');
  }

  function handleAddLink() {
    if (!newLinkUrl.trim()) return;
    const newArtifact: SubmissionArtifact = {
      id: `sa-${Date.now()}`,
      submissionId: teamId,
      kind: 'web_url',
      url: newLinkUrl.trim(),
      label: newLinkLabel.trim() || undefined,
    };
    const updated = [...artifacts, newArtifact];
    setArtifacts(updated);
    const all = getItem<SubmissionArtifact[]>(STORAGE_KEYS.SUBMISSION_ARTIFACTS) ?? [];
    setItem(STORAGE_KEYS.SUBMISSION_ARTIFACTS, [...all, newArtifact]);
    setNewLinkUrl('');
    setNewLinkLabel('');
  }

  const currentStage = warRoom?.submissionStage ?? 'teaming';

  return (
    <PageShell>
      {/* Header */}
      <h1 className="font-pixel text-accent-orange text-lg mb-6">WAR ROOM</h1>

      {/* Basecamp Summary */}
      <Card hover={false} className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="font-pixel text-[10px] text-accent-yellow">BASECAMP</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <span className="font-dunggeunmo text-xs text-dark-bg/50 block">원정대</span>
            <span className="font-dunggeunmo font-bold">{team.name}</span>
          </div>
          <div>
            <span className="font-dunggeunmo text-xs text-dark-bg/50 block">연결 해커톤</span>
            <span className="font-dunggeunmo font-bold">
              {hackathon?.title ?? '미연결'}
            </span>
          </div>
          <div>
            <span className="font-dunggeunmo text-xs text-dark-bg/50 block">제출 단계</span>
            <span className="font-pixel text-[10px] text-accent-mint">
              {STAGES.find(s => s.key === currentStage)?.label}
            </span>
          </div>
          <div>
            <span className="font-dunggeunmo text-xs text-dark-bg/50 block">멤버</span>
            <span className="font-dunggeunmo">
              {members.length > 0
                ? members.map(m => m.displayName).join(', ')
                : `${team.memberCount}명`}
            </span>
          </div>
        </div>
        {warRoom?.nextActionLabel && (
          <div className="mt-3 px-3 py-2 bg-accent-orange/10 border border-accent-orange/30">
            <span className="font-pixel text-[8px] text-accent-orange">NEXT: </span>
            <span className="font-dunggeunmo text-sm">{warRoom.nextActionLabel}</span>
          </div>
        )}
      </Card>

      {/* Submission Stage Stepper */}
      <div className="mb-6">
        <h2 className="font-pixel text-[10px] text-card-white/50 mb-3">SUBMISSION STAGE</h2>
        <div className="flex gap-1 overflow-x-auto">
          {STAGES.map((s, idx) => {
            const stageIdx = STAGES.findIndex(st => st.key === currentStage);
            const isActive = s.key === currentStage;
            const isPast = idx < stageIdx;
            return (
              <button
                key={s.key}
                onClick={() => handleStageChange(s.key)}
                className={`flex-1 min-w-[80px] px-2 py-2 font-pixel text-[8px] border-2 transition-colors ${
                  isActive
                    ? 'bg-accent-orange text-dark-bg border-accent-orange'
                    : isPast
                    ? 'bg-accent-mint/20 text-accent-mint border-accent-mint/40'
                    : 'bg-transparent text-card-white/40 border-dark-border'
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Workflow Board */}
      <div className="mb-6">
        <h2 className="font-pixel text-[10px] text-card-white/50 mb-3">WORKFLOW BOARD</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {COLUMNS.map(col => {
            const colCards = cards
              .filter(c => c.column === col.key)
              .sort((a, b) => a.order - b.order);
            return (
              <div key={col.key} className="border-2 border-dark-border p-3 min-h-[120px]">
                <h3 className="font-pixel text-[8px] text-accent-purple mb-2">{col.label}</h3>
                <div className="space-y-2">
                  {colCards.map(card => (
                    <div
                      key={card.id}
                      className={`px-2 py-1.5 bg-card-white/10 border border-dark-border text-sm font-dunggeunmo ${
                        card.isBlocked ? 'border-accent-pink/50 text-accent-pink' : 'text-card-white'
                      }`}
                    >
                      {card.title}
                      {card.ownerLabel && (
                        <span className="block text-[10px] text-card-white/40 mt-0.5">{card.ownerLabel}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add card form */}
        <div className="flex gap-2 mt-3">
          <input
            value={newCardTitle}
            onChange={e => setNewCardTitle(e.target.value)}
            className="flex-1 px-3 py-1.5 bg-dark-bg/30 border-2 border-dark-border text-card-white font-dunggeunmo text-sm"
            placeholder="새 카드 제목"
          />
          <select
            value={newCardColumn}
            onChange={e => setNewCardColumn(e.target.value as WorkflowColumn)}
            className="px-2 py-1.5 bg-dark-bg/30 border-2 border-dark-border text-card-white font-dunggeunmo text-sm"
          >
            {COLUMNS.map(c => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>
          <PixelButton onClick={handleAddCard}>추가</PixelButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Checklist */}
        <div>
          <h2 className="font-pixel text-[10px] text-card-white/50 mb-3">CHECKLIST</h2>
          <div className="border-2 border-dark-border p-3">
            {checklist.length === 0 ? (
              <p className="font-dunggeunmo text-sm text-card-white/40">체크리스트가 비어있습니다</p>
            ) : (
              <div className="space-y-2">
                {checklist.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleToggleCheck(item.id)}
                    className="w-full text-left flex items-center gap-2 px-2 py-1.5 hover:bg-card-white/5 transition-colors"
                  >
                    <span className={`font-pixel text-[10px] w-12 ${
                      item.status === 'done' ? 'text-accent-mint' :
                      item.status === 'doing' ? 'text-accent-yellow' :
                      'text-card-white/40'
                    }`}>
                      {item.status === 'done' ? '[v]' : item.status === 'doing' ? '[~]' : '[ ]'}
                    </span>
                    <span className={`font-dunggeunmo text-sm ${
                      item.status === 'done' ? 'line-through text-card-white/40' : 'text-card-white'
                    }`}>
                      {item.label}
                    </span>
                    {item.assigneeLabel && (
                      <span className="ml-auto font-dunggeunmo text-[10px] text-card-white/30">
                        {item.assigneeLabel}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
            <div className="flex gap-2 mt-3">
              <input
                value={newCheckLabel}
                onChange={e => setNewCheckLabel(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-dark-bg/30 border-2 border-dark-border text-card-white font-dunggeunmo text-sm"
                placeholder="새 항목"
                onKeyDown={e => e.key === 'Enter' && handleAddCheckItem()}
              />
              <PixelButton onClick={handleAddCheckItem}>추가</PixelButton>
            </div>
          </div>
        </div>

        {/* Team Notes */}
        <div>
          <h2 className="font-pixel text-[10px] text-card-white/50 mb-3">TEAM NOTES</h2>
          <div className="border-2 border-dark-border p-3">
            <textarea
              value={warRoom?.notes ?? ''}
              onChange={e => handleNotesChange(e.target.value)}
              className="w-full h-[200px] bg-transparent text-card-white font-dunggeunmo text-sm resize-none focus:outline-none"
              placeholder="팀 메모를 작성하세요..."
            />
          </div>
        </div>
      </div>

      {/* Link Management */}
      <div className="mb-6">
        <h2 className="font-pixel text-[10px] text-card-white/50 mb-3">LINKS</h2>
        <div className="border-2 border-dark-border p-3">
          {artifacts.length === 0 ? (
            <p className="font-dunggeunmo text-sm text-card-white/40 mb-3">등록된 링크가 없습니다</p>
          ) : (
            <div className="space-y-2 mb-3">
              {artifacts.map(a => (
                <div key={a.id} className="flex items-center gap-2 px-2 py-1.5 bg-card-white/5">
                  <span className="font-pixel text-[8px] text-accent-purple">{a.kind.replace('_', ' ').toUpperCase()}</span>
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-dunggeunmo text-sm text-accent-orange hover:underline truncate"
                  >
                    {a.label || a.url}
                  </a>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              value={newLinkLabel}
              onChange={e => setNewLinkLabel(e.target.value)}
              className="w-32 px-3 py-1.5 bg-dark-bg/30 border-2 border-dark-border text-card-white font-dunggeunmo text-sm"
              placeholder="라벨"
            />
            <input
              value={newLinkUrl}
              onChange={e => setNewLinkUrl(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-dark-bg/30 border-2 border-dark-border text-card-white font-dunggeunmo text-sm"
              placeholder="https://..."
              onKeyDown={e => e.key === 'Enter' && handleAddLink()}
            />
            <PixelButton onClick={handleAddLink}>추가</PixelButton>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
