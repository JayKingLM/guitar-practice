import type { SVGProps } from 'react';

// Lightweight inline icon set (stroke-based, 24px grid). Keeps the bundle lean
// and the visual language consistent across the app.

type IconProps = SVGProps<SVGSVGElement>;

function base(props: IconProps) {
  return {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    ...props,
  };
}

export const PlayIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 4.5v15l13-7.5z" fill="currentColor" stroke="none" />
  </svg>
);

export const PauseIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none" />
    <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none" />
  </svg>
);

export const RestartIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 12a9 9 0 1 0 3-6.7" />
    <path d="M3 4v5h5" />
  </svg>
);

export const LoopIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M17 2l4 4-4 4" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <path d="M7 22l-4-4 4-4" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </svg>
);

export const BackIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M19 12H5" />
    <path d="M12 19l-7-7 7-7" />
  </svg>
);

export const MetronomeIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M9 3h6l3 18H6L9 3z" />
    <path d="M6 15h12" />
    <path d="M12 12l4-6" />
  </svg>
);

export const CapoIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3" y="9" width="18" height="6" rx="3" />
    <path d="M7 9V7M12 9V7M17 9V7" />
  </svg>
);

export const CountInIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export const ZoomInIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3M11 8v6M8 11h6" />
  </svg>
);

export const ZoomOutIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3M8 11h6" />
  </svg>
);

export const FullscreenIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M3 16v3a2 2 0 0 0 2 2h3" />
  </svg>
);

export const ExitFullscreenIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 8h3a2 2 0 0 0 2-2V3M21 8h-3a2 2 0 0 1-2-2V3M16 21v-3a2 2 0 0 1 2-2h3M8 21v-3a2 2 0 0 0-2-2H3" />
  </svg>
);

export const TrashIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
  </svg>
);

export const EditIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
  </svg>
);

export const PlusIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const UploadIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 15V3M7 8l5-5 5 5" />
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
  </svg>
);

export const MusicIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

export const ScanIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
    <path d="M3 12h18" />
  </svg>
);

export const LibraryIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

export const CloseIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

export const SpeedIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 2v4M12 12l4-2" />
    <circle cx="12" cy="14" r="8" />
  </svg>
);
