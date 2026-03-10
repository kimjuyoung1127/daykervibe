import { formatDatetime } from '@/lib/format';

interface ScheduleData {
  timezone?: string;
  milestones?: {
    name: string;
    at: string;
  }[];
}

function isPast(iso: string): boolean {
  return new Date(iso).getTime() < Date.now();
}

export default function ScheduleSection({ content }: { content: string }) {
  const data: ScheduleData = JSON.parse(content);

  if (!data.milestones || data.milestones.length === 0) {
    return <p className="font-dunggeunmo text-sm text-card-white/50">일정 정보가 없습니다</p>;
  }

  return (
    <div className="space-y-0">
      {data.milestones.map((m, i) => {
        const past = isPast(m.at);
        return (
          <div key={i} className="flex gap-4 relative">
            {/* Timeline line */}
            <div className="flex flex-col items-center">
              <div
                className={`w-3 h-3 rounded-full border-2 ${
                  past
                    ? 'bg-accent-mint border-accent-mint'
                    : 'bg-transparent border-accent-orange'
                }`}
              />
              {i < data.milestones!.length - 1 && (
                <div className="w-0.5 flex-1 bg-dark-border min-h-[32px]" />
              )}
            </div>

            {/* Content */}
            <div className="pb-4">
              <p className={`font-dunggeunmo text-sm ${past ? 'text-card-white/50' : 'text-card-white'}`}>
                {m.name}
              </p>
              <p className="font-pixel text-[8px] text-card-white/40 mt-0.5">
                {formatDatetime(m.at)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
