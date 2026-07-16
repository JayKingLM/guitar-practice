import { useEffect, type ReactNode } from 'react';
import { CloseIcon } from './icons';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  /** Max width class, defaults to a comfortable dialog width. */
  widthClass?: string;
}

/** Accessible-ish modal overlay with backdrop + escape-to-close. */
export function Modal({ open, onClose, title, children, widthClass = 'max-w-md' }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        className={`relative w-full ${widthClass} card p-5 animate-[fadeIn_0.15s_ease-out]`}
      >
        {title && (
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
            <button className="btn-icon" onClick={onClose} aria-label="关闭">
              <CloseIcon />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
