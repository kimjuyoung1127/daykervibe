import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className = '', hover = true, onClick }: CardProps) {
  return (
    <div
      className={`bg-card-white text-dark-bg border-2 border-dark-border rounded-sm p-4 ${
        hover ? 'pixel-shadow-hover cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
