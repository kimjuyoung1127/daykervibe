'use client';

import { useEffect } from 'react';
import { seedLocalStorage } from '@/lib/storage/seed';

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    seedLocalStorage();
  }, []);

  return <>{children}</>;
}
