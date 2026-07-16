import { useEffect, useRef, useState, type ReactNode } from 'react';

interface PopoverProps {
  /** The trigger element (button). */
  trigger: (opts: { open: boolean; toggle: () => void }) => ReactNode;
  /** The popover content. */
  children: (opts: { close: () => void }) => ReactNode;
  /** Alignment relative to trigger. */
  align?: 'left' | 'center' | 'right';
}

/** A click-triggered popover that closes on outside click / escape. */
export function Popover({ trigger, children, align = 'center' }: PopoverProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const alignClass =
    align === 'left'
      ? 'left-0'
      : align === 'right'
        ? 'right-0'
        : 'left-1/2 -translate-x-1/2';

  return (
    <div className="relative" ref={ref}>
      {trigger({ open, toggle: () => setOpen((v) => !v) })}
      {open && (
        <div
          className={`absolute top-full z-40 mt-2 ${alignClass} min-w-[13rem] rounded-xl2 border border-ink-700/70 bg-ink-850 p-3 shadow-panel`}
        >
          {children({ close: () => setOpen(false) })}
        </div>
      )}
    </div>
  );
}
