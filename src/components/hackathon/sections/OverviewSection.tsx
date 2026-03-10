interface OverviewData {
  summary?: string;
  teamPolicy?: {
    allowSolo?: boolean;
    maxTeamSize?: number;
  };
}

export default function OverviewSection({ content }: { content: string }) {
  const data: OverviewData = JSON.parse(content);

  return (
    <div className="space-y-4">
      {data.summary && (
        <p className="font-dunggeunmo text-base text-card-white/90 leading-relaxed">
          {data.summary}
        </p>
      )}
      {data.teamPolicy && (
        <div className="bg-dark-border/50 border border-dark-border rounded-sm p-4">
          <h4 className="font-pixel text-[10px] text-accent-mint mb-2">TEAM POLICY</h4>
          <ul className="font-dunggeunmo text-sm text-card-white/70 space-y-1">
            <li>솔로 참가: {data.teamPolicy.allowSolo ? '가능' : '불가'}</li>
            {data.teamPolicy.maxTeamSize && (
              <li>최대 팀원: {data.teamPolicy.maxTeamSize}명</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
