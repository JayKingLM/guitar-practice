import type { ReactNode } from 'react';

interface ToolButtonProps {
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: ReactNode;
  /** Optional label shown below/next to the icon. */
  label?: string;
}

/**
 * A rounded control-bar button with an active (accent) state and a native
 * tooltip. Used across the top control bar and left toolbar.
 */
export function ToolButton({
  onClick,
  active,
  disabled,
  title,
  children,
  label,
}: ToolButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      aria-pressed={active}
      className={[
        'group inline-flex flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors duration-150',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        active
          ? 'bg-accent-500/15 text-accent-400 ring-1 ring-accent-500/40'
          : 'text-slate-300 hover:bg-ink-700/70 hover:text-slate-100',
      ].join(' ')}
    >
      <span className="flex h-6 items-center justify-center">{children}</span>
      {label && <span className="leading-none">{label}</span>}
    </button>
  );
}
