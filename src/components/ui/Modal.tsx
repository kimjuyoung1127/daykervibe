'use client';

import { ReactNode, useEffect } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-dark-bg/80 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg border-2 border-accent-orange/40 bg-dark-card p-6"
        onClick={event => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          {title && (
            <h2 className="font-pixel text-[10px] text-accent-yellow">{title}</h2>
          )}
          <button
            onClick={onClose}
            className="ml-auto font-pixel text-xs text-card-white/50 hover:text-card-white"
          >
            [X]
          </button>
        </div>
        <div className="font-dunggeunmo text-sm text-card-white/80">{children}</div>
      </div>
    </div>
  );
}
