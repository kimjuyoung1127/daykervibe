import { dDay, formatPrize } from '@/lib/format';
import type { Hackathon } from '@/lib/types';
import StatusBadge from '@/components/ui/StatusBadge';

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
