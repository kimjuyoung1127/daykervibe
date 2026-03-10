interface GuideData {
  notice?: string[];
  links?: {
    rules?: string;
    faq?: string;
  };
}

export default function GuideSection({ content }: { content: string }) {
  const data: GuideData = JSON.parse(content);

  return (
    <div className="space-y-4">
      {data.notice && data.notice.length > 0 && (
        <div className="bg-dark-border/50 border border-dark-border rounded-sm p-4">
          <h4 className="font-pixel text-[10px] text-accent-yellow mb-3">NOTICE</h4>
          <ul className="space-y-2">
            {data.notice.map((n, i) => (
              <li key={i} className="font-dunggeunmo text-sm text-card-white/80 flex gap-2">
                <span className="text-accent-orange">▸</span>
                {n}
              </li>
            ))}
          </ul>
        </div>
      )}
      {data.links && (
        <div className="flex gap-3">
          {data.links.rules && (
            <a
              href={data.links.rules}
              target="_blank"
              rel="noopener noreferrer"
              className="font-pixel text-[10px] text-accent-mint hover:underline"
            >
              RULES →
            </a>
          )}
          {data.links.faq && (
            <a
              href={data.links.faq}
              target="_blank"
              rel="noopener noreferrer"
              className="font-pixel text-[10px] text-accent-mint hover:underline"
            >
              FAQ →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
