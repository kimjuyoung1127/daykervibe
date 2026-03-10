import { isValidPublicContactUrl } from '@/lib/contact-links';
import type { Hackathon, Team } from '@/lib/types';
import Card from '@/components/ui/Card';
import PixelButton from '@/components/ui/PixelButton';

interface TeamCardProps {
  team: Team;
  /** 'camp' uses dark card with full hackathon tag; 'detail' uses default card within hackathon context */
  variant?: 'camp' | 'detail';
  /** When true, disables recruiting actions and war-room CTA */
  isEnded?: boolean;
  /** Hackathon list for resolving hackathon title (camp variant) */
  hackathons?: Hackathon[];
  /** Callback to toggle recruitment open/closed */
  onToggleRecruit?: (teamId: string) => void;
  /** Callback to start editing a team */
  onEdit?: (team: Team) => void;
}

export default function TeamCard({
  team,
  variant = 'camp',
  isEnded = false,
  hackathons,
  onToggleRecruit,
  onEdit,
}: TeamCardProps) {
  if (variant === 'detail') {
    return <DetailTeamCard team={team} isEnded={isEnded} />;
  }

  return (
    <CampTeamCard
      team={team}
      hackathons={hackathons ?? []}
      onToggleRecruit={onToggleRecruit}
      onEdit={onEdit}
    />
  );
}

function CampTeamCard({
  team,
  hackathons,
  onToggleRecruit,
  onEdit,
}: {
  team: Team;
  hackathons: Hackathon[];
  onToggleRecruit?: (teamId: string) => void;
  onEdit?: (team: Team) => void;
}) {
  const hackathon = hackathons.find(item => item.slug === team.hackathonSlug);
  const hasContact = team.isOpen && isValidPublicContactUrl(team.contactUrl);

  return (
    <Card variant="dark" className="flex flex-col">
      <div className="mb-2 flex items-start justify-between">
        <h3 className="font-dunggeunmo text-base font-bold">{team.name}</h3>
        <span
          className={`px-2 py-0.5 font-pixel text-[8px] ${
            team.isOpen
              ? 'border border-accent-mint/45 bg-accent-mint/35 text-accent-mint'
              : 'border border-card-white/20 bg-card-white/10 text-card-white/50'
          }`}
        >
          {team.isOpen ? 'RECRUITING' : 'CLOSED'}
        </span>
      </div>

      {hackathon && (
        <span className="mb-2 inline-flex max-w-full items-center border border-accent-purple/30 bg-accent-purple/14 px-2 py-1 font-dunggeunmo text-xs font-bold text-accent-purple">
          {hackathon.title}
        </span>
      )}

      <p className="mb-3 font-dunggeunmo text-sm text-card-white/70">{team.intro}</p>

      {team.lookingFor.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1">
          {team.lookingFor.map(role => (
            <span
              key={role}
              className="border border-accent-yellow/40 bg-accent-yellow/20 px-2 py-0.5 font-pixel text-[8px] text-accent-orange"
            >
              {role}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-dunggeunmo text-xs text-card-white/50">{team.memberCount}명</span>
          <div className="flex flex-wrap items-center gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(team)}
                className="min-h-8 border border-card-white/20 bg-card-white/5 px-2 py-1 font-pixel text-[8px] text-card-white/60 transition-colors hover:border-accent-yellow/50 hover:text-accent-yellow"
              >
                수정
              </button>
            )}
            {onToggleRecruit && (
              <button
                onClick={() => onToggleRecruit(team.id)}
                className={`min-h-8 border px-2 py-1 font-pixel text-[8px] transition-colors ${
                  team.isOpen
                    ? 'border-accent-pink/40 bg-accent-pink/10 text-accent-pink hover:bg-accent-pink/20'
                    : 'border-accent-mint/40 bg-accent-mint/10 text-accent-mint hover:bg-accent-mint/20'
                }`}
              >
                {team.isOpen ? '모집 마감' : '모집 재개'}
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <PixelButton
            href={`/war-room/${team.id}`}
            variant="ghost"
            className="px-3 py-2 text-[8px]"
          >
            작전실 열기
          </PixelButton>
          {team.isOpen ? (
            hasContact ? (
              <a
                href={team.contactUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center font-pixel text-[10px] text-accent-orange hover:underline"
              >
                연락하기
              </a>
            ) : (
              <span className="inline-flex min-h-10 items-center border border-card-white/15 bg-card-white/5 px-3 font-pixel text-[9px] text-card-white/45">
                연락처 준비중
              </span>
            )
          ) : (
            <span className="inline-flex min-h-10 items-center border border-card-white/15 bg-card-white/5 px-3 font-pixel text-[9px] text-card-white/45">
              모집 마감
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}

function DetailTeamCard({ team, isEnded }: { team: Team; isEnded: boolean }) {
  const canRecruit = !isEnded && team.isOpen;
  const hasContact = canRecruit && isValidPublicContactUrl(team.contactUrl);

  return (
    <Card hover={false} className="flex flex-col">
      <div className="mb-1 flex items-start justify-between gap-3">
        <h4 className="font-dunggeunmo text-sm font-bold">{team.name}</h4>
        <span
          className={`px-1.5 py-0.5 font-pixel text-[8px] ${
            isEnded
              ? 'border border-dark-border bg-dark-bg/8 text-dark-bg/65'
              : team.isOpen
                ? 'border border-accent-mint/45 bg-accent-mint/35 text-dark-bg'
                : 'bg-dark-border text-card-white'
          }`}
        >
          {isEnded ? 'ENDED' : team.isOpen ? 'RECRUITING' : 'CLOSED'}
        </span>
      </div>
      <p className="mb-2 font-dunggeunmo text-xs text-dark-bg/70">{team.intro}</p>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1">
          {team.lookingFor.map(role => (
            <span
              key={role}
              className="border border-accent-yellow/35 bg-accent-yellow/18 px-1.5 py-0.5 font-pixel text-[7px] text-dark-bg/80"
            >
              #{role}
            </span>
          ))}
        </div>
        <span className="font-dunggeunmo text-xs text-dark-bg/60">
          {team.memberCount}명
        </span>
      </div>
      <div className="mt-auto flex flex-wrap justify-end gap-2">
        {isEnded ? (
          <span className="inline-flex min-h-10 items-center border border-dark-border/40 bg-dark-bg/5 px-3 font-pixel text-[9px] text-dark-bg/45">
            종료된 해커톤
          </span>
        ) : team.isOpen ? (
          hasContact ? (
            <a
              href={team.contactUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center font-pixel text-[10px] text-accent-orange hover:underline"
            >
              연락하기
            </a>
          ) : (
            <span className="inline-flex min-h-10 items-center border border-dark-border/40 bg-dark-bg/5 px-3 font-pixel text-[9px] text-dark-bg/45">
              연락처 준비중
            </span>
          )
        ) : (
          <span className="inline-flex min-h-10 items-center border border-dark-border/40 bg-dark-bg/5 px-3 font-pixel text-[9px] text-dark-bg/45">
            모집 마감
          </span>
        )}

        {!isEnded && (
          <PixelButton
            href={`/war-room/${team.id}`}
            variant="ghost"
            className="px-3 py-2 text-[8px]"
          >
            작전실 이동
          </PixelButton>
        )}
      </div>
    </Card>
  );
}
