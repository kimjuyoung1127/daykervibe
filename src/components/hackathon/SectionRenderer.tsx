import type { HackathonSection } from '@/lib/types';
import OverviewSection from './sections/OverviewSection';
import GuideSection from './sections/GuideSection';
import EvalSection from './sections/EvalSection';
import ScheduleSection from './sections/ScheduleSection';
import PrizeSection from './sections/PrizeSection';
import TeamsSection from './sections/TeamsSection';
import SubmitSection from './sections/SubmitSection';
import LeaderboardSection from './sections/LeaderboardSection';

interface SectionRendererProps {
  section: HackathonSection;
  hackathonSlug: string;
}

export default function SectionRenderer({ section, hackathonSlug }: SectionRendererProps) {
  switch (section.type) {
    case 'overview':
      return <OverviewSection content={section.content} />;
    case 'guide':
      return <GuideSection content={section.content} />;
    case 'eval':
      return <EvalSection content={section.content} />;
    case 'schedule':
      return <ScheduleSection content={section.content} />;
    case 'prize':
      return <PrizeSection content={section.content} />;
    case 'teams':
      return <TeamsSection content={section.content} hackathonSlug={hackathonSlug} />;
    case 'submit':
      return <SubmitSection content={section.content} />;
    case 'leaderboard':
      return <LeaderboardSection content={section.content} hackathonSlug={hackathonSlug} />;
    default:
      return (
        <p className="font-dunggeunmo text-sm text-card-white/50">
          이 섹션은 아직 지원되지 않습니다.
        </p>
      );
  }
}
