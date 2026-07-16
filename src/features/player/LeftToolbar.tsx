import { ToolButton, LibraryIcon, MusicIcon } from '@/components';

interface LeftToolbarProps {
  showPanel: boolean;
  onTogglePanel: () => void;
}

/**
 * Left mini toolbar. Intentionally sparse for v1 — designed to be extended
 * with tools like track selection, fingering diagrams, and annotations.
 */
export function LeftToolbar({ showPanel, onTogglePanel }: LeftToolbarProps) {
  return (
    <nav className="hidden w-14 shrink-0 flex-col items-center gap-1 border-r border-ink-800 bg-ink-900 py-3 sm:flex">
      <ToolButton
        title={showPanel ? '隐藏信息栏' : '显示信息栏'}
        active={showPanel}
        onClick={onTogglePanel}
      >
        <LibraryIcon />
      </ToolButton>
      <ToolButton title="音轨（即将推出）" disabled>
        <MusicIcon />
      </ToolButton>

      <div className="mt-auto px-1 text-center text-[9px] leading-tight text-slate-600">
        更多工具
        <br />
        即将推出
      </div>
    </nav>
  );
}
