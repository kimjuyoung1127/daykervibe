import type { Hackathon } from '@/lib/types';
import StatusBadge from '@/components/ui/StatusBadge';

function formatPrize(krw: number): string {
  if (krw >= 10000) return `${(krw / 10000).toLocaleString()}만원`;
  return `${krw.toLocaleString()}원`;
}

function dDay(endAt: string): string {
  const diff = Math.ceil((new Date(endAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (diff > 0) return `D-${diff}`;
  if (diff === 0) return 'D-DAY';
  return '종료';
}

interface SummaryBarProps {
  hackathon: Hackathon;
}

export default function SummaryBar({ hackathon }: SummaryBarProps) {
  const stats = [
    { label: 'STATUS', value: <StatusBadge status={hackathon.status} /> },
    { label: 'D-DAY', value: dDay(hackathon.eventEndAt) },
    { label: 'TEAMS', value: hackathon.teamCount ?? '—' },
    { label: 'PRIZE', value: hackathon.prizeTotalKRW > 0 ? formatPrize(hackathon.prizeTotalKRW) : '—' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-dark-border/50 border-2 border-dark-border rounded-sm">
      {stats.map(s => (
        <div key={s.label} className="text-center">
          <p className="font-pixel text-[8px] text-card-white/50 mb-1">{s.label}</p>
          <div className="font-dunggeunmo text-sm text-card-white">{s.value}</div>
        </div>
      ))}
    </div>
  );
}
