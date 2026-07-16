/** App wordmark — an original mark (not derived from any existing brand). */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2 select-none">
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-ink-800 ring-1 ring-ink-700">
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="h-4 w-[2px] rounded bg-accent-500" style={{ marginLeft: -8 }} />
          <span className="h-5 w-[2px] rounded bg-accent-400" />
          <span className="h-4 w-[2px] rounded bg-accent-500" style={{ marginLeft: 8 }} />
        </span>
      </span>
      {!compact && (
        <span className="text-[15px] font-semibold tracking-tight text-slate-100">
          GuitarTab <span className="text-accent-400">Studio</span>
        </span>
      )}
    </div>
  );
}
