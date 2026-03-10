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
    <div className="flex gap-1 overflow-x-auto border-b-2 border-dark-border pb-0">
      {sections.map(type => (
        <button
          key={type}
          onClick={() => onSelect(type)}
          className={`font-pixel text-[10px] px-3 py-2 whitespace-nowrap border-b-2 -mb-[2px] transition-colors ${
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
