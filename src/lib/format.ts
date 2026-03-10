/**
 * Centralized formatting utilities.
 * Replaces duplicated formatPrize, formatDateTime, formatDate, dDay, formatKRW
 * across hackathon-detail.ts, hackathons/page.tsx, SummaryBar.tsx,
 * PrizeSection.tsx, ScheduleSection.tsx, and rankings/page.tsx.
 */

export function formatPrize(krw: number): string {
  if (krw >= 10000) return `${(krw / 10000).toLocaleString()}만원`;
  return `${krw.toLocaleString()}원`;
}

export function formatKRW(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`;
}

export function formatDateTime(iso?: string): string {
  if (!iso) return '미공개';

  return new Date(iso).toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(iso?: string): string {
  if (!iso) return '미공개';

  return new Date(iso).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export function formatDatetime(iso: string): string {
  return new Date(iso).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function dDay(endAt: string): string {
  const diff = Math.ceil((new Date(endAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (diff > 0) return `D-${diff}`;
  if (diff === 0) return 'D-DAY';
  return '종료';
}

export function formatPoints(points: number): string {
  return points.toLocaleString();
}
