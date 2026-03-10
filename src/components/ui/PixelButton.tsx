import { ReactNode } from 'react';
import Link from 'next/link';

type Variant = 'primary' | 'secondary' | 'ghost';

const VARIANT_STYLES: Record<Variant, string> = {
  primary: 'bg-accent-orange text-dark-bg hover:brightness-110',
  secondary: 'bg-dark-border text-card-white border-2 border-card-white hover:bg-card-white hover:text-dark-bg',
  ghost: 'bg-transparent text-accent-orange border-2 border-accent-orange hover:bg-accent-orange hover:text-dark-bg',
};

interface PixelButtonProps {
  children: ReactNode;
  variant?: Variant;
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
}

export default function PixelButton({
  children,
  variant = 'primary',
  href,
  onClick,
  className = '',
  type = 'button',
}: PixelButtonProps) {
  const base = `inline-flex items-center justify-center font-pixel text-xs px-4 py-2 transition-all ${VARIANT_STYLES[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={base}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={base}>
      {children}
    </button>
  );
}
