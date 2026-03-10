'use client';

import { DragEvent, Fragment, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { isHttpUrl } from '@/lib/contact-links';
import { getItem, setItem } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import { applyPendingSubmitDraftToTeam } from '@/lib/submission-drafts';
import type {
  Hackathon,
  Submission,
  SubmissionArtifact,
  SubmissionStage,
  Team,
  TeamMember,
  WarRoom,
  WarRoomChecklistItem,
  WarRoomWorkflowCard,
  WorkflowColumn,
} from '@/lib/types';
import PageShell from '@/components/layout/PageShell';
import Card from '@/components/ui/Card';
import ErrorState from '@/components/ui/ErrorState';
import LoadingState from '@/components/ui/LoadingState';
import PixelButton from '@/components/ui/PixelButton';

const STAGES: { key: SubmissionStage; label: string }[] = [
  { key: 'teaming', label: '팀 구성' },
  { key: 'plan', label: '기획안' },
  { key: 'web', label: '웹 제출' },
  { key: 'pdf', label: 'PDF' },
  { key: 'done', label: '완료' },
];

const COLUMNS: { key: WorkflowColumn; label: string }[] = [
  { key: 'plan', label: '기획 준비' },
  { key: 'web', label: '웹 제출 준비' },
  { key: 'pdf', label: 'PDF 준비' },
  { key: 'submitted', label: '제출 완료' },
];

type DragOverState = {
  column: WorkflowColumn;
  index: number;
} | null;

function normalizeWorkflowCards(cards: WarRoomWorkflowCard[]): WarRoomWorkflowCard[] {
  return COLUMNS.flatMap(({ key }) =>
    cards
      .filter(card => card.column === key)
      .sort((a, b) => a.order - b.order)
      .map((card, index) => ({
        ...card,
        order: index,
      })),
  );
}

function moveWorkflowCard(
  cards: WarRoomWorkflowCard[],
  cardId: string,
  toColumn: WorkflowColumn,
  toIndex: number,
): WarRoomWorkflowCard[] {
  const normalized = normalizeWorkflowCards(cards);
  const movingCard = normalized.find(card => card.id === cardId);

  if (!movingCard) return normalized;

  const grouped = Object.fromEntries(
    COLUMNS.map(({ key }) => [key, normalized.filter(card => card.column === key)]),
  ) as Record<WorkflowColumn, WarRoomWorkflowCard[]>;

  grouped[movingCard.column] = grouped[movingCard.column].filter(card => card.id !== cardId);

  const destinationCards =
    movingCard.column === toColumn ? grouped[toColumn] : [...grouped[toColumn]];
  const insertionIndex = Math.max(0, Math.min(toIndex, destinationCards.length));

  destinationCards.splice(insertionIndex, 0, {
    ...movingCard,
    column: toColumn,
  });
  grouped[toColumn] = destinationCards;

  return COLUMNS.flatMap(({ key }) =>
    grouped[key].map((card, index) => ({
      ...card,
      order: index,
    })),
  );
}

export default function WarRoomPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState<Team | null>(null);
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [warRoom, setWarRoom] = useState<WarRoom | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [cards, setCards] = useState<WarRoomWorkflowCard[]>([]);
  const [checklist, setChecklist] = useState<WarRoomChecklistItem[]>([]);
  const [artifacts, setArtifacts] = useState<SubmissionArtifact[]>([]);
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [dragOverState, setDragOverState] = useState<DragOverState>(null);
  const [importedDraft, setImportedDraft] = useState(false);

  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardColumn, setNewCardColumn] = useState<WorkflowColumn>('plan');
  const [newCheckLabel, setNewCheckLabel] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkLabel, setNewLinkLabel] = useState('');

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;

      const allTeams = getItem<Team[]>(STORAGE_KEYS.TEAMS) ?? [];
      const currentTeam = allTeams.find(entry => entry.id === teamId) ?? null;
      setTeam(currentTeam);

      if (!currentTeam) {
        setLoading(false);
        return;
      }

      const didImportDraft = applyPendingSubmitDraftToTeam(currentTeam);
      setImportedDraft(didImportDraft);

      if (currentTeam.hackathonSlug) {
        const allHackathons = getItem<Hackathon[]>(STORAGE_KEYS.HACKATHONS) ?? [];
        setHackathon(
          allHackathons.find(entry => entry.slug === currentTeam.hackathonSlug) ?? null,
        );
      } else {
        setHackathon(null);
      }

      const allMembers = getItem<TeamMember[]>(STORAGE_KEYS.TEAM_MEMBERS) ?? [];
      setMembers(allMembers.filter(member => member.teamId === teamId));

      const allWarRooms = getItem<WarRoom[]>(STORAGE_KEYS.WAR_ROOMS) ?? [];
      const currentWarRoom = allWarRooms.find(entry => entry.teamId === teamId) ?? null;
      setWarRoom(currentWarRoom);

      if (currentWarRoom) {
        const allCards = getItem<WarRoomWorkflowCard[]>(STORAGE_KEYS.WAR_ROOM_WORKFLOW_CARDS) ?? [];
        setCards(
          normalizeWorkflowCards(allCards.filter(card => card.warRoomId === currentWarRoom.id)),
        );

        const allChecks = getItem<WarRoomChecklistItem[]>(STORAGE_KEYS.WAR_ROOM_CHECKLIST) ?? [];
        setChecklist(allChecks.filter(item => item.warRoomId === currentWarRoom.id));
      } else {
        setCards([]);
        setChecklist([]);
      }

      const allSubmissions = getItem<Submission[]>(STORAGE_KEYS.SUBMISSIONS) ?? [];
      const currentSubmission = allSubmissions.find(entry => entry.teamId === teamId) ?? null;
      setSubmissionId(currentSubmission?.id ?? null);

      const allArtifacts = getItem<SubmissionArtifact[]>(STORAGE_KEYS.SUBMISSION_ARTIFACTS) ?? [];
      setArtifacts(
        currentSubmission
          ? allArtifacts.filter(artifact => artifact.submissionId === currentSubmission.id)
          : [],
      );

      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [teamId]);

  if (loading) return <LoadingState />;
  if (!team) return <ErrorState message={`팀 "${teamId}"을 찾을 수 없습니다.`} />;

  const currentTeam = team;
  const currentStage = warRoom?.submissionStage ?? 'teaming';
  const tacticalMapStyle = {} as const;

  function getColumnCards(column: WorkflowColumn): WarRoomWorkflowCard[] {
    return cards.filter(card => card.column === column).sort((a, b) => a.order - b.order);
  }

  function ensureWarRoom(): WarRoom {
    if (warRoom) return warRoom;

    const newWarRoom: WarRoom = {
      id: `wr-${teamId}`,
      teamId,
      title: `${currentTeam.name} War Room`,
      summary: '',
      submissionStage: 'teaming',
      lastUpdated: new Date().toISOString(),
    };

    const allWarRooms = getItem<WarRoom[]>(STORAGE_KEYS.WAR_ROOMS) ?? [];
    setItem(STORAGE_KEYS.WAR_ROOMS, [...allWarRooms, newWarRoom]);
    setWarRoom(newWarRoom);
    return newWarRoom;
  }

  function ensureSubmission(): Submission {
    const allSubmissions = getItem<Submission[]>(STORAGE_KEYS.SUBMISSIONS) ?? [];
    const existing = allSubmissions.find(entry => entry.teamId === teamId);

    if (existing) {
      setSubmissionId(existing.id);
      return existing;
    }

    const newSubmission: Submission = {
      id: `sub-${teamId}`,
      teamId,
      hackathonSlug: currentTeam.hackathonSlug ?? 'unassigned',
      planStatus: 'empty',
      webStatus: 'draft',
      pdfStatus: 'empty',
    };

    setItem(STORAGE_KEYS.SUBMISSIONS, [...allSubmissions, newSubmission]);
    setSubmissionId(newSubmission.id);
    return newSubmission;
  }

  function persistWorkflowCards(nextCards: WarRoomWorkflowCard[]) {
    const warRoomEntry = ensureWarRoom();
    const normalized = normalizeWorkflowCards(nextCards);
    const allCards = getItem<WarRoomWorkflowCard[]>(STORAGE_KEYS.WAR_ROOM_WORKFLOW_CARDS) ?? [];
    const otherCards = allCards.filter(card => card.warRoomId !== warRoomEntry.id);

    setCards(normalized);
    setItem(STORAGE_KEYS.WAR_ROOM_WORKFLOW_CARDS, [...otherCards, ...normalized]);
  }

  function moveCardTo(cardId: string, toColumn: WorkflowColumn, toIndex: number) {
    persistWorkflowCards(moveWorkflowCard(cards, cardId, toColumn, toIndex));
    setDraggedCardId(null);
    setDragOverState(null);
  }

  function moveCardByControls(
    cardId: string,
    direction: 'up' | 'down' | 'prev-column' | 'next-column',
  ) {
    const card = cards.find(entry => entry.id === cardId);
    if (!card) return;

    const columnCards = getColumnCards(card.column);
    const currentIndex = columnCards.findIndex(entry => entry.id === cardId);
    const columnIndex = COLUMNS.findIndex(entry => entry.key === card.column);

    if (direction === 'up' && currentIndex > 0) {
      moveCardTo(cardId, card.column, currentIndex - 1);
      return;
    }

    if (direction === 'down' && currentIndex < columnCards.length - 1) {
      moveCardTo(cardId, card.column, currentIndex + 1);
      return;
    }

    if (direction === 'prev-column' && columnIndex > 0) {
      const previousColumn = COLUMNS[columnIndex - 1].key;
      const previousCards = getColumnCards(previousColumn);
      moveCardTo(cardId, previousColumn, Math.min(currentIndex, previousCards.length));
      return;
    }

    if (direction === 'next-column' && columnIndex < COLUMNS.length - 1) {
      const nextColumn = COLUMNS[columnIndex + 1].key;
      const nextCards = getColumnCards(nextColumn);
      moveCardTo(cardId, nextColumn, Math.min(currentIndex, nextCards.length));
    }
  }

  function handleStageChange(stage: SubmissionStage) {
    const warRoomEntry = ensureWarRoom();
    const updated = {
      ...warRoomEntry,
      submissionStage: stage,
      lastUpdated: new Date().toISOString(),
    };
    const allWarRooms = getItem<WarRoom[]>(STORAGE_KEYS.WAR_ROOMS) ?? [];

    setWarRoom(updated);
    setItem(
      STORAGE_KEYS.WAR_ROOMS,
      allWarRooms.map(entry => (entry.id === updated.id ? updated : entry)),
    );
  }

  function handleNotesChange(notes: string) {
    const warRoomEntry = ensureWarRoom();
    const updated = {
      ...warRoomEntry,
      notes,
      lastUpdated: new Date().toISOString(),
    };
    const allWarRooms = getItem<WarRoom[]>(STORAGE_KEYS.WAR_ROOMS) ?? [];

    setWarRoom(updated);
    setItem(
      STORAGE_KEYS.WAR_ROOMS,
      allWarRooms.map(entry => (entry.id === updated.id ? updated : entry)),
    );
  }

  function handleAddCard() {
    if (!newCardTitle.trim()) return;

    const warRoomEntry = ensureWarRoom();
    const newCard: WarRoomWorkflowCard = {
      id: `wc-${Date.now()}`,
      warRoomId: warRoomEntry.id,
      title: newCardTitle.trim(),
      column: newCardColumn,
      order: getColumnCards(newCardColumn).length,
      isBlocked: false,
    };

    persistWorkflowCards([...cards, newCard]);
    setNewCardTitle('');
  }

  function handleToggleCheck(id: string) {
    const statusOrder = ['todo', 'doing', 'done'] as const;
    const updated = checklist.map(item => {
      if (item.id !== id) return item;
      const currentIndex = statusOrder.indexOf(item.status);
      return {
        ...item,
        status: statusOrder[(currentIndex + 1) % 3],
      };
    });

    const allChecks = getItem<WarRoomChecklistItem[]>(STORAGE_KEYS.WAR_ROOM_CHECKLIST) ?? [];
    const merged = allChecks.map(item => updated.find(entry => entry.id === item.id) ?? item);

    setChecklist(updated);
    setItem(STORAGE_KEYS.WAR_ROOM_CHECKLIST, merged);
  }

  function handleAddCheckItem() {
    if (!newCheckLabel.trim()) return;

    const warRoomEntry = ensureWarRoom();
    const newItem: WarRoomChecklistItem = {
      id: `cl-${Date.now()}`,
      warRoomId: warRoomEntry.id,
      label: newCheckLabel.trim(),
      status: 'todo',
    };

    const allChecks = getItem<WarRoomChecklistItem[]>(STORAGE_KEYS.WAR_ROOM_CHECKLIST) ?? [];
    setChecklist([...checklist, newItem]);
    setItem(STORAGE_KEYS.WAR_ROOM_CHECKLIST, [...allChecks, newItem]);
    setNewCheckLabel('');
  }

  function handleAddLink() {
    const nextUrl = newLinkUrl.trim();
    if (!nextUrl || !isHttpUrl(nextUrl)) return;

    const submission = ensureSubmission();
    const newArtifact: SubmissionArtifact = {
      id: `sa-${Date.now()}`,
      submissionId: submission.id,
      kind: 'web_url',
      url: nextUrl,
      label: newLinkLabel.trim() || undefined,
    };

    const allArtifacts = getItem<SubmissionArtifact[]>(STORAGE_KEYS.SUBMISSION_ARTIFACTS) ?? [];
    setArtifacts([...artifacts, newArtifact]);
    setItem(STORAGE_KEYS.SUBMISSION_ARTIFACTS, [...allArtifacts, newArtifact]);
    setNewLinkUrl('');
    setNewLinkLabel('');
  }

  function resolveDraggedCardId(event?: DragEvent<HTMLDivElement>): string | null {
    const fromTransfer = event?.dataTransfer.getData('text/plain');
    return draggedCardId ?? fromTransfer ?? null;
  }

  function getDropIndexFromCard(
    event: DragEvent<HTMLDivElement>,
    column: WorkflowColumn,
    targetCardId: string,
  ): number {
    const targetCards = getColumnCards(column);
    const targetIndex = targetCards.findIndex(card => card.id === targetCardId);
    const bounds = event.currentTarget.getBoundingClientRect();
    const insertAfter = event.clientY >= bounds.top + bounds.height / 2;
    return targetIndex + (insertAfter ? 1 : 0);
  }

  function handleDragStart(event: DragEvent<HTMLDivElement>, cardId: string) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', cardId);
    setDraggedCardId(cardId);
  }

  function handleDragEnd() {
    setDraggedCardId(null);
    setDragOverState(null);
  }

  function handleColumnDragOver(event: DragEvent<HTMLDivElement>, column: WorkflowColumn) {
    event.preventDefault();

    const activeCardId = resolveDraggedCardId(event);
    if (!activeCardId) return;
    if (draggedCardId !== activeCardId) setDraggedCardId(activeCardId);

    setDragOverState({
      column,
      index: getColumnCards(column).length,
    });
  }

  function handleColumnDrop(event: DragEvent<HTMLDivElement>, column: WorkflowColumn) {
    event.preventDefault();

    const activeCardId = resolveDraggedCardId(event);
    if (!activeCardId) return;
    moveCardTo(activeCardId, column, getColumnCards(column).length);
  }

  function handleCardDragOver(
    event: DragEvent<HTMLDivElement>,
    column: WorkflowColumn,
    targetCardId: string,
  ) {
    event.preventDefault();

    const activeCardId = resolveDraggedCardId(event);
    if (!activeCardId) return;
    if (draggedCardId !== activeCardId) setDraggedCardId(activeCardId);

    setDragOverState({
      column,
      index: getDropIndexFromCard(event, column, targetCardId),
    });
  }

  function handleCardDrop(
    event: DragEvent<HTMLDivElement>,
    column: WorkflowColumn,
    targetCardId: string,
  ) {
    event.preventDefault();
    event.stopPropagation();

    const activeCardId = resolveDraggedCardId(event);
    if (!activeCardId) return;
    moveCardTo(activeCardId, column, getDropIndexFromCard(event, column, targetCardId));
  }

  return (
    <PageShell className="overflow-x-hidden">
      <h1 className="mb-6 font-pixel text-lg text-accent-orange">WAR ROOM</h1>

      <Card hover={false} className="relative mb-6 overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.3]"
          style={tacticalMapStyle}
        />
        <div className="relative z-10">
          <div className="mb-3 flex items-center gap-2">
            <h2 className="font-pixel text-[10px] text-accent-yellow">BASECAMP</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <span className="block font-dunggeunmo text-xs text-dark-bg/50">원정대</span>
              <span className="font-dunggeunmo font-bold">{currentTeam.name}</span>
            </div>
            <div>
              <span className="block font-dunggeunmo text-xs text-dark-bg/50">연결 해커톤</span>
              <span className="break-words font-dunggeunmo font-bold">
                {hackathon?.title ?? '미연결'}
              </span>
            </div>
            <div>
              <span className="block font-dunggeunmo text-xs text-dark-bg/50">제출 단계</span>
              <span className="inline-flex items-center border border-accent-mint/35 bg-accent-mint/20 px-2 py-1 font-pixel text-[9px] text-dark-bg">
                {STAGES.find(stage => stage.key === currentStage)?.label}
              </span>
            </div>
            <div>
              <span className="block font-dunggeunmo text-xs text-dark-bg/50">팀 구성</span>
              <span className="inline-flex items-center border border-accent-purple/30 bg-accent-purple/14 px-2 py-1 font-pixel text-[9px] text-dark-bg">
                {currentTeam.isOpen ? '모집중' : '구성 완료'}
              </span>
            </div>
            <div>
              <span className="block font-dunggeunmo text-xs text-dark-bg/50">멤버</span>
              <span className="font-dunggeunmo font-bold">{members.length || currentTeam.memberCount}명</span>
            </div>
          </div>
          {warRoom?.nextActionLabel && (
            <div className="mt-3 border border-accent-orange/30 bg-accent-orange/10 px-3 py-2">
              <span className="font-pixel text-[8px] text-accent-orange">NEXT: </span>
              <span className="font-dunggeunmo text-sm">{warRoom.nextActionLabel}</span>
            </div>
          )}
        </div>
      </Card>

      {importedDraft && (
        <div className="mb-6 border border-accent-mint/35 bg-accent-mint/10 px-4 py-3">
          <p className="font-pixel text-[9px] text-accent-mint">DRAFT IMPORTED</p>
          <p className="mt-1 font-dunggeunmo text-sm text-card-white/80">
            해커톤 상세에서 저장한 제출 초안을 이 작전실로 불러왔습니다.
          </p>
        </div>
      )}

      <div className="mb-6">
        <h2 className="mb-3 font-pixel text-[10px] text-card-white/50">SUBMISSION STAGE</h2>
        <div className="overflow-x-auto pb-1">
          <div className="flex min-w-max gap-2">
            {STAGES.map((stage, index) => {
              const currentStageIndex = STAGES.findIndex(entry => entry.key === currentStage);
              const isActive = stage.key === currentStage;
              const isPast = index < currentStageIndex;

              return (
                <button
                  key={stage.key}
                  onClick={() => handleStageChange(stage.key)}
                  className={`min-h-10 min-w-[88px] flex-none border-2 px-3 py-2 font-pixel text-[8px] transition-colors ${isActive
                    ? 'border-accent-orange bg-accent-orange text-dark-bg'
                    : isPast
                      ? 'border-accent-mint/40 bg-accent-mint/20 text-accent-mint'
                      : 'border-dark-border bg-transparent text-card-white/40'
                    }`}
                >
                  {stage.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative mb-6 overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.22]"
          style={tacticalMapStyle}
        />
        <div className="relative z-10">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="font-pixel text-[10px] text-card-white/50">WORKFLOW BOARD</h2>
            <span className="font-dunggeunmo text-xs text-card-white/40">
              데스크톱에서는 드래그, 모바일에서는 이동 버튼을 사용할 수 있습니다.
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {COLUMNS.map(column => {
              const columnCards = getColumnCards(column.key);
              const isColumnActive = dragOverState?.column === column.key;

              return (
                <div
                  key={column.key}
                  className={`min-h-[120px] border-2 p-3 transition-colors ${isColumnActive ? 'border-accent-orange/70 bg-accent-orange/5' : 'border-dark-border'
                    }`}
                >
                  <h3 className="mb-2 font-pixel text-[8px] text-accent-purple">{column.label}</h3>
                  <div
                    className="space-y-2 rounded-sm"
                    onDragOver={event => handleColumnDragOver(event, column.key)}
                    onDrop={event => handleColumnDrop(event, column.key)}
                  >
                    {columnCards.length === 0 && isColumnActive && dragOverState?.index === 0 && (
                      <div className="h-2 rounded-sm bg-accent-orange/60" />
                    )}

                    {columnCards.map((card, index) => {
                      const columnIndex = COLUMNS.findIndex(entry => entry.key === column.key);
                      const isFirstCard = index === 0;
                      const isLastCard = index === columnCards.length - 1;
                      const canMovePrevColumn = columnIndex > 0;
                      const canMoveNextColumn = columnIndex < COLUMNS.length - 1;
                      const showBeforeMarker =
                        dragOverState?.column === column.key && dragOverState.index === index;
                      const showAfterMarker =
                        dragOverState?.column === column.key &&
                        dragOverState.index === columnCards.length &&
                        isLastCard;

                      return (
                        <Fragment key={card.id}>
                          {showBeforeMarker && <div className="h-2 rounded-sm bg-accent-orange/60" />}
                          <div
                            draggable
                            onDragStart={event => handleDragStart(event, card.id)}
                            onDragEnd={handleDragEnd}
                            onDragOver={event => handleCardDragOver(event, column.key, card.id)}
                            onDrop={event => handleCardDrop(event, column.key, card.id)}
                            className={`border border-dark-border bg-card-white/10 px-2 py-2 font-dunggeunmo text-sm transition-colors ${card.isBlocked ? 'border-accent-pink/50 text-accent-pink' : 'text-card-white'
                              } ${draggedCardId === card.id ? 'opacity-60 ring-1 ring-accent-orange/70' : ''
                              }`}
                          >
                            <div className="cursor-grab active:cursor-grabbing">
                              {card.title}
                              {card.ownerLabel && (
                                <span className="mt-0.5 block text-[10px] text-card-white/40">
                                  {card.ownerLabel}
                                </span>
                              )}
                            </div>

                            <div className="mt-2 flex flex-wrap gap-1 sm:hidden">
                              <button
                                type="button"
                                disabled={!canMovePrevColumn}
                                onClick={() => moveCardByControls(card.id, 'prev-column')}
                                className="min-h-9 min-w-16 border border-dark-border px-2 py-1 font-pixel text-[8px] text-card-white/70 disabled:cursor-not-allowed disabled:opacity-30"
                              >
                                이전 컬럼
                              </button>
                              <button
                                type="button"
                                disabled={!canMoveNextColumn}
                                onClick={() => moveCardByControls(card.id, 'next-column')}
                                className="min-h-9 min-w-16 border border-dark-border px-2 py-1 font-pixel text-[8px] text-card-white/70 disabled:cursor-not-allowed disabled:opacity-30"
                              >
                                다음 컬럼
                              </button>
                              <button
                                type="button"
                                disabled={isFirstCard}
                                onClick={() => moveCardByControls(card.id, 'up')}
                                className="min-h-9 min-w-12 border border-dark-border px-2 py-1 font-pixel text-[8px] text-card-white/70 disabled:cursor-not-allowed disabled:opacity-30"
                              >
                                위로
                              </button>
                              <button
                                type="button"
                                disabled={isLastCard}
                                onClick={() => moveCardByControls(card.id, 'down')}
                                className="min-h-9 min-w-12 border border-dark-border px-2 py-1 font-pixel text-[8px] text-card-white/70 disabled:cursor-not-allowed disabled:opacity-30"
                              >
                                아래로
                              </button>
                            </div>
                          </div>
                          {showAfterMarker && <div className="h-2 rounded-sm bg-accent-orange/60" />}
                        </Fragment>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
            <input
              value={newCardTitle}
              onChange={event => setNewCardTitle(event.target.value)}
              className="min-h-10 min-w-0 border-2 border-dark-border bg-dark-bg/30 px-3 py-2 font-dunggeunmo text-sm text-card-white"
              placeholder="새 카드 제목"
            />
            <select
              value={newCardColumn}
              onChange={event => setNewCardColumn(event.target.value as WorkflowColumn)}
              className="min-h-10 min-w-0 border-2 border-dark-border bg-dark-bg/30 px-3 py-2 font-dunggeunmo text-sm text-card-white"
            >
              {COLUMNS.map(column => (
                <option key={column.key} value={column.key}>
                  {column.label}
                </option>
              ))}
            </select>
            <PixelButton onClick={handleAddCard} className="min-h-10">
              추가
            </PixelButton>
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 font-pixel text-[10px] text-card-white/50">CHECKLIST</h2>
          <div className="border-2 border-dark-border p-3">
            {checklist.length === 0 ? (
              <p className="font-dunggeunmo text-sm text-card-white/40">체크리스트가 비어 있습니다.</p>
            ) : (
              <div className="space-y-2">
                {checklist.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleToggleCheck(item.id)}
                    className="flex min-h-10 w-full items-start gap-2 px-2 py-2 text-left transition-colors hover:bg-card-white/5 sm:items-center"
                  >
                    <span
                      className={`w-12 font-pixel text-[10px] ${item.status === 'done'
                        ? 'text-accent-mint'
                        : item.status === 'doing'
                          ? 'text-accent-yellow'
                          : 'text-card-white/40'
                        }`}
                    >
                      {item.status === 'done' ? '[v]' : item.status === 'doing' ? '[~]' : '[ ]'}
                    </span>
                    <span
                      className={`min-w-0 font-dunggeunmo text-sm ${item.status === 'done' ? 'line-through text-card-white/40' : 'text-card-white'
                        }`}
                    >
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
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
              <input
                value={newCheckLabel}
                onChange={event => setNewCheckLabel(event.target.value)}
                className="min-h-10 min-w-0 border-2 border-dark-border bg-dark-bg/30 px-3 py-2 font-dunggeunmo text-sm text-card-white"
                placeholder="체크 항목"
                onKeyDown={event => event.key === 'Enter' && handleAddCheckItem()}
              />
              <PixelButton onClick={handleAddCheckItem} className="min-h-10">
                추가
              </PixelButton>
            </div>
          </div>
        </div>

        <div>
          <h2 className="mb-3 font-pixel text-[10px] text-card-white/50">TEAM NOTES</h2>
          <div className="border-2 border-dark-border p-3">
            <textarea
              value={warRoom?.notes ?? ''}
              onChange={event => handleNotesChange(event.target.value)}
              className="h-[200px] w-full resize-none bg-transparent font-dunggeunmo text-sm text-card-white focus:outline-none"
              placeholder="팀 메모를 작성하세요."
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="mb-3 font-pixel text-[10px] text-card-white/50">LINKS</h2>
        <div className="border-2 border-dark-border p-3">
          {artifacts.length === 0 ? (
            <p className="mb-3 font-dunggeunmo text-sm text-card-white/40">등록된 링크가 없습니다.</p>
          ) : (
            <div className="mb-3 space-y-2">
              {artifacts.map(artifact => (
                <div
                  key={artifact.id}
                  className="flex min-w-0 flex-col gap-1 bg-card-white/5 px-2 py-2 sm:flex-row sm:items-center sm:gap-2"
                >
                  <span className="font-pixel text-[8px] text-accent-purple">
                    {artifact.kind.replace('_', ' ').toUpperCase()}
                  </span>
                  <a
                    href={artifact.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-10 min-w-0 items-center break-all font-dunggeunmo text-sm text-accent-orange hover:underline sm:truncate"
                  >
                    {artifact.label || artifact.url}
                  </a>
                </div>
              ))}
            </div>
          )}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-[8rem_minmax(0,1fr)_auto]">
            <input
              value={newLinkLabel}
              onChange={event => setNewLinkLabel(event.target.value)}
              className="min-h-10 min-w-0 border-2 border-dark-border bg-dark-bg/30 px-3 py-2 font-dunggeunmo text-sm text-card-white"
              placeholder="라벨"
            />
            <input
              value={newLinkUrl}
              onChange={event => setNewLinkUrl(event.target.value)}
              className="min-h-10 min-w-0 border-2 border-dark-border bg-dark-bg/30 px-3 py-2 font-dunggeunmo text-sm text-card-white"
              placeholder="https://..."
              onKeyDown={event => event.key === 'Enter' && handleAddLink()}
            />
            <PixelButton onClick={handleAddLink} className="min-h-10">
              추가
            </PixelButton>
          </div>
          {submissionId && (
            <p className="mt-2 font-dunggeunmo text-xs text-card-white/30">
              현재 팀 제출 ID: {submissionId}
            </p>
          )}
        </div>
      </div>
    </PageShell>
  );
}
