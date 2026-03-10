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
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex min-h-12 items-center gap-3">
          <Image
            src="/logo.svg"
            alt="EXPEDITION HUB"
            width={44}
            height={44}
            className="h-11 w-11 sm:h-12 sm:w-12"
          />
          <div className="hidden sm:flex flex-col leading-none">
            <span className="font-pixel text-[10px] text-accent-orange">
              EXPEDITION HUB
            </span>
            <span className="mt-1 font-pixel text-[8px] text-card-white/55">
              HACK PORTAL
            </span>
          </div>
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
                className={`inline-flex min-h-10 items-center px-2 py-2 font-dunggeunmo text-sm transition-colors ${
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
