import Image from 'next/image';

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = 'LOADING...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <Image src="/search.svg" alt="loading" width={48} height={48} className="animate-pulse" />
      <p className="font-pixel text-sm text-accent-orange animate-blink">{message}</p>
    </div>
  );
}
