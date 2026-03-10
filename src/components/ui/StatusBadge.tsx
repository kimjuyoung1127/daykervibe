import type { HackathonStatus } from '@/lib/types';

const BADGE_STYLES: Record<HackathonStatus, string> = {
  upcoming: 'bg-accent-orange text-dark-bg',
  ongoing: 'bg-accent-mint text-dark-bg',
  ended: 'bg-dark-border text-card-white',
};

const BADGE_LABELS: Record<HackathonStatus, string> = {
  upcoming: 'UPCOMING',
  ongoing: 'ONGOING',
  ended: 'ENDED',
};

interface StatusBadgeProps {
  status: HackathonStatus;
  className?: string;
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  return (
    <span
      className={`inline-block font-pixel text-[10px] px-2 py-1 ${BADGE_STYLES[status]} ${className}`}
    >
      {BADGE_LABELS[status]}
    </span>
  );
}
