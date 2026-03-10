import Image from 'next/image';

interface EmptyStateProps {
  message?: string;
}

export default function EmptyState({ message = 'NO DATA FOUND' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 border-2 border-dashed border-dark-border rounded-sm">
      <Image src="/checklist.svg" alt="empty" width={48} height={48} className="opacity-50" />
      <p className="font-pixel text-sm text-card-white/60">{message}</p>
    </div>
  );
}
