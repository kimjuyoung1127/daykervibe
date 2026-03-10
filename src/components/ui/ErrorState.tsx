import Image from 'next/image';
import PixelButton from './PixelButton';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  message = 'SYSTEM ERROR',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <Image src="/rocket.svg" alt="error" width={48} height={48} />
      <p className="font-pixel text-sm text-accent-pink">{message}</p>
      {onRetry && (
        <PixelButton variant="ghost" onClick={onRetry}>
          RETRY
        </PixelButton>
      )}
    </div>
  );
}
