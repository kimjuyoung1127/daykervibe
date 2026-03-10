import PixelButton from '@/components/ui/PixelButton';

interface SubmitData {
  guide?: string[];
  submissionItems?: {
    key: string;
    title: string;
    format: string;
  }[];
  submissionUrl?: string;
  allowedArtifactTypes?: string[];
}

export default function SubmitSection({ content }: { content: string }) {
  const data: SubmitData = JSON.parse(content);

  return (
    <div className="space-y-4">
      {/* Submission Guide */}
      {data.guide && data.guide.length > 0 && (
        <div className="bg-dark-border/50 border border-dark-border rounded-sm p-4">
          <h4 className="font-pixel text-[10px] text-accent-yellow mb-3">SUBMISSION GUIDE</h4>
          <ol className="space-y-2">
            {data.guide.map((g, i) => (
              <li key={i} className="font-dunggeunmo text-sm text-card-white/80 flex gap-2">
                <span className="font-pixel text-[10px] text-accent-orange">{i + 1}.</span>
                {g}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Submission Steps */}
      {data.submissionItems && data.submissionItems.length > 0 && (
        <div className="border-2 border-dark-border rounded-sm overflow-hidden">
          <div className="bg-dark-border/70 px-4 py-2">
            <span className="font-pixel text-[10px] text-accent-orange">SUBMISSION PROCESS</span>
          </div>
          {data.submissionItems.map((item, i) => (
            <div key={item.key} className="flex items-center gap-3 px-4 py-3 border-b border-dark-border/50">
              <span className="font-pixel text-xs text-accent-mint w-6 text-center">{i + 1}</span>
              <div>
                <p className="font-dunggeunmo text-sm text-card-white">{item.title}</p>
                <p className="font-pixel text-[8px] text-card-white/40">{item.format}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {data.submissionUrl && (
        <div className="text-center pt-2">
          <PixelButton href={data.submissionUrl}>제출하기</PixelButton>
        </div>
      )}
    </div>
  );
}
