import type { Hackathon, HackathonSection } from '@/lib/types';
import SourceLimitedSection from './SourceLimitedSection';
import EvalSection from './sections/EvalSection';
import GuideSection from './sections/GuideSection';
import LeaderboardSection from './sections/LeaderboardSection';
import OverviewSection from './sections/OverviewSection';
import PrizeSection from './sections/PrizeSection';
import ScheduleSection from './sections/ScheduleSection';
import SubmitSection from './sections/SubmitSection';
import TeamsSection from './sections/TeamsSection';

interface SourceLimitedPayload {
  state?: 'source-limited';
}

interface SectionRendererProps {
  section: HackathonSection;
  hackathon: Hackathon;
}

function parseSourceLimited(content: string): SourceLimitedPayload | null {
  try {
    return JSON.parse(content) as SourceLimitedPayload;
  } catch {
    return null;
  }
}

export default function SectionRenderer({ section, hackathon }: SectionRendererProps) {
  const sourceLimited = parseSourceLimited(section.content)?.state === 'source-limited';

  if (sourceLimited) {
    switch (section.type) {
      case 'teams':
        return (
          <TeamsSection
            content={section.content}
            hackathonSlug={hackathon.slug}
            hackathonStatus={hackathon.status}
          />
        );
      case 'submit':
        return (
          <SubmitSection
            content={section.content}
            hackathonSlug={hackathon.slug}
            hackathonStatus={hackathon.status}
          />
        );
      default:
        return <SourceLimitedSection content={section.content} />;
    }
  }

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
      return (
        <TeamsSection
          content={section.content}
          hackathonSlug={hackathon.slug}
          hackathonStatus={hackathon.status}
        />
      );
    case 'submit':
      return (
        <SubmitSection
          content={section.content}
          hackathonSlug={hackathon.slug}
          hackathonStatus={hackathon.status}
        />
      );
    case 'leaderboard':
      return <LeaderboardSection content={section.content} hackathonSlug={hackathon.slug} />;
    default:
      return (
        <p className="font-dunggeunmo text-sm text-card-white/50">
          이 섹션은 아직 지원되지 않습니다.
        </p>
      );
  }
}
