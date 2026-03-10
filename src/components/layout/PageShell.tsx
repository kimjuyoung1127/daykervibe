import { ReactNode } from 'react';

interface PageShellProps {
  children: ReactNode;
  className?: string;
}

export default function PageShell({ children, className = '' }: PageShellProps) {
  return (
    <div className={`max-w-6xl mx-auto px-4 py-8 ${className}`}>
      {children}
    </div>
  );
}
