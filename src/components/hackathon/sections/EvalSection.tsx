interface EvalData {
  metricName?: string;
  description?: string;
  scoreDisplay?: {
    label?: string;
    breakdown?: {
      key: string;
      label: string;
      weightPercent: number;
    }[];
  };
  limits?: {
    maxRuntimeSec?: number;
    maxSubmissionsPerDay?: number;
  };
}

export default function EvalSection({ content }: { content: string }) {
  const data: EvalData = JSON.parse(content);

  return (
    <div className="space-y-4">
      {data.metricName && (
        <div className="flex items-center gap-2 mb-2">
          <span className="font-pixel text-[10px] text-accent-purple">METRIC</span>
          <span className="font-dunggeunmo text-base text-card-white">{data.metricName}</span>
        </div>
      )}

      {data.description && (
        <p className="font-dunggeunmo text-sm text-card-white/80">{data.description}</p>
      )}

      {/* Rubric Table */}
      {data.scoreDisplay?.breakdown && data.scoreDisplay.breakdown.length > 0 && (
        <div className="border-2 border-dark-border rounded-sm overflow-hidden">
          <div className="bg-dark-border/70 px-4 py-2">
            <span className="font-pixel text-[10px] text-accent-orange">
              {data.scoreDisplay.label ?? 'EVALUATION RUBRIC'}
            </span>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="font-pixel text-[8px] text-card-white/50 text-left px-4 py-2">CATEGORY</th>
                <th className="font-pixel text-[8px] text-card-white/50 text-right px-4 py-2">WEIGHT</th>
              </tr>
            </thead>
            <tbody>
              {data.scoreDisplay.breakdown.map(b => (
                <tr key={b.key} className="border-b border-dark-border/50">
                  <td className="font-dunggeunmo text-sm text-card-white/80 px-4 py-2">{b.label}</td>
                  <td className="font-pixel text-[10px] text-accent-orange text-right px-4 py-2">
                    {b.weightPercent}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data.limits && (
        <div className="bg-dark-border/50 border border-dark-border rounded-sm p-4">
          <h4 className="font-pixel text-[10px] text-accent-yellow mb-2">LIMITS</h4>
          <ul className="font-dunggeunmo text-sm text-card-white/70 space-y-1">
            {data.limits.maxRuntimeSec && (
              <li>최대 실행 시간: {data.limits.maxRuntimeSec}초</li>
            )}
            {data.limits.maxSubmissionsPerDay && (
              <li>일일 최대 제출: {data.limits.maxSubmissionsPerDay}회</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
