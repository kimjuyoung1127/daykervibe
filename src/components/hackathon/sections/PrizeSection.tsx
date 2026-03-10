interface PrizeData {
  items?: {
    place: string;
    amountKRW: number;
  }[];
}

function formatKRW(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`;
}

export default function PrizeSection({ content }: { content: string }) {
  const data: PrizeData = JSON.parse(content);

  if (!data.items || data.items.length === 0) {
    return <p className="font-dunggeunmo text-sm text-card-white/50">상금 정보가 없습니다</p>;
  }

  const total = data.items.reduce((s, i) => s + i.amountKRW, 0);

  return (
    <div className="space-y-4">
      <div className="border-2 border-dark-border rounded-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-dark-border/70 border-b border-dark-border">
              <th className="font-pixel text-[8px] text-card-white/50 text-left px-4 py-2">PLACE</th>
              <th className="font-pixel text-[8px] text-card-white/50 text-right px-4 py-2">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map(item => (
              <tr key={item.place} className="border-b border-dark-border/50">
                <td className="font-dunggeunmo text-sm text-card-white/80 px-4 py-2">
                  {item.place}
                </td>
                <td className="font-pixel text-[10px] text-accent-yellow text-right px-4 py-2">
                  {formatKRW(item.amountKRW)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-right">
        <span className="font-pixel text-[10px] text-card-white/50">TOTAL </span>
        <span className="font-pixel text-sm text-accent-orange">{formatKRW(total)}</span>
      </div>
    </div>
  );
}
