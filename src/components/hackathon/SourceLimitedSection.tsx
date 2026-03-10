interface SourceLimitedContent {
  title?: string;
  message?: string;
  rows?: { label: string; value: string }[];
}

interface SourceLimitedSectionProps {
  content: string;
}

export default function SourceLimitedSection({ content }: SourceLimitedSectionProps) {
  const data: SourceLimitedContent = JSON.parse(content);

  return (
    <div className="space-y-4 rounded-sm border-2 border-dark-border bg-dark-border/35 p-4">
      <div>
        <h4 className="mb-2 font-pixel text-[10px] text-accent-yellow">
          {data.title ?? 'DETAIL LIMITED'}
        </h4>
        <p className="font-dunggeunmo text-sm text-card-white/75">
          {data.message ?? '공개 가능한 범위의 정보만 제공됩니다.'}
        </p>
      </div>

      {data.rows && data.rows.length > 0 && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {data.rows.map(row => (
            <div
              key={row.label}
              className="rounded-sm border border-dark-border bg-dark-bg/20 px-3 py-2"
            >
              <span className="block font-pixel text-[8px] text-card-white/45">
                {row.label}
              </span>
              <span className="font-dunggeunmo text-sm text-card-white">{row.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
