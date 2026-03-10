'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/', label: 'HOME' },
  { href: '/hackathons', label: 'HACKATHONS' },
  { href: '/camp', label: 'CAMP' },
  { href: '/rankings', label: 'RANKINGS' },
];

export default function TopNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-dark-bg border-b-2 border-dark-border">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="EXPEDITION HUB" width={32} height={32} />
          <span className="font-pixel text-accent-orange text-xs hidden sm:inline">
            HACK PORTAL
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-1 sm:gap-4">
          {NAV_LINKS.map(link => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-dunggeunmo text-sm px-2 py-1 transition-colors ${
                  isActive
                    ? 'text-accent-orange border-b-2 border-accent-orange'
                    : 'text-card-white/70 hover:text-card-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
