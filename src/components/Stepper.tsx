interface StepperProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  suffix?: string;
  className?: string;
}

/** Compact −/value/+ numeric stepper used for BPM, capo, loop bars, etc. */
export function Stepper({
  value,
  min = -Infinity,
  max = Infinity,
  step = 1,
  onChange,
  suffix,
  className = '',
}: StepperProps) {
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  return (
    <div
      className={`inline-flex items-center overflow-hidden rounded-full bg-ink-800 ${className}`}
    >
      <button
        type="button"
        className="btn-icon h-9 w-9 text-lg"
        onClick={() => onChange(clamp(value - step))}
        disabled={value <= min}
        aria-label="减少"
      >
        −
      </button>
      <span className="min-w-[3.5rem] text-center text-sm font-semibold text-slate-100 tabular-nums">
        {value}
        {suffix ? <span className="ml-0.5 text-xs text-slate-400">{suffix}</span> : null}
      </span>
      <button
        type="button"
        className="btn-icon h-9 w-9 text-lg"
        onClick={() => onChange(clamp(value + step))}
        disabled={value >= max}
        aria-label="增加"
      >
        +
      </button>
    </div>
  );
}
