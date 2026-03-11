import type { HackathonSectionType } from '@/lib/types';

const TAB_LABELS: Record<HackathonSectionType, string> = {
  overview: '개요',
  guide: '안내',
  eval: '평가',
  schedule: '일정',
  prize: '상금',
  teams: '팀',
  submit: '제출',
  leaderboard: '리더보드',
};

interface SectionTabsProps {
  sections: HackathonSectionType[];
  active: HackathonSectionType;
  onSelect: (type: HackathonSectionType) => void;
}

export default function SectionTabs({ sections, active, onSelect }: SectionTabsProps) {
  return (
    <div className="flex gap-1 overflow-x-auto border-b-2 border-dark-border pb-1">
      {sections.map(type => (
        <button
          key={type}
          onClick={() => onSelect(type)}
          className={`-mb-[2px] min-h-10 whitespace-nowrap border-b-2 px-3 py-2 sm:px-5 sm:py-2.5 font-pixel text-[10px] sm:text-xs md:text-sm transition-colors ${
            active === type
              ? 'text-accent-orange border-accent-orange'
              : 'text-card-white/50 border-transparent hover:text-card-white/80'
          }`}
        >
          {TAB_LABELS[type]}
        </button>
      ))}
    </div>
  );
}
