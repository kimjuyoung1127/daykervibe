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
    { label: 'TEAMS', value: hackathon.teamCount ?? '미공개' },
    {
      label: 'PRIZE',
      value: hackathon.prizeTotalKRW > 0 ? formatPrize(hackathon.prizeTotalKRW) : '미공개',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 rounded-sm border-2 border-dark-border bg-dark-border/50 p-4 sm:grid-cols-4">
      {stats.map(stat => (
        <div key={stat.label} className="text-center">
          <p className="mb-1 font-pixel text-[8px] text-card-white/50">{stat.label}</p>
          <div className="font-dunggeunmo text-sm text-card-white">{stat.value}</div>
        </div>
      ))}
    </div>
  );
}
