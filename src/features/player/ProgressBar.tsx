import { useRef, useState } from 'react';
import { MousePointer2, X } from 'lucide-react';

interface ProgressBarProps {
  progress: number;
  currentBar: number;
  barCount: number;
  onSeekBar: (bar: number) => void;
  onSelectBars: (startBar: number, endBar: number) => void;
  onClearSelection: () => void;
}

export function ProgressBar({
  progress,
  currentBar,
  barCount,
  onSeekBar,
  onSelectBars,
  onClearSelection,
}: ProgressBarProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<number | null>(null);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragEnd, setDragEnd] = useState<number | null>(null);
  const [selected, setSelected] = useState<[number, number] | null>(null);

  const barAt = (clientX: number) => {
    const rect = railRef.current?.getBoundingClientRect();
    if (!rect || !barCount) return 1;
    const ratio = Math.max(0, Math.min(0.9999, (clientX - rect.left) / rect.width));
    return Math.floor(ratio * barCount) + 1;
  };

  const finishDrag = (clientX: number) => {
    const origin = dragStartRef.current;
    if (origin == null) return;
    const end = barAt(clientX);
    const startBar = Math.min(origin, end);
    const endBar = Math.max(origin, end);
    if (startBar === endBar) {
      onSeekBar(startBar);
      setSelected(null);
      onClearSelection();
    } else {
      setSelected([startBar, endBar]);
      onSelectBars(startBar, endBar);
    }
    setDragStart(null);
    setDragEnd(null);
    dragStartRef.current = null;
  };

  const selection = dragStart != null && dragEnd != null
    ? [Math.min(dragStart, dragEnd), Math.max(dragStart, dragEnd)] as [number, number]
    : selected;
  const selectionLeft = selection && barCount ? ((selection[0] - 1) / barCount) * 100 : 0;
  const selectionWidth = selection && barCount ? ((selection[1] - selection[0] + 1) / barCount) * 100 : 0;
  const progressWidth = Math.max(0, Math.min(1, progress)) * 100;

  return (
    <footer className="timeline">
      <div className="timeline-position">
        <MousePointer2 size={15} />
        <span>{selected ? `${selected[0]}–${selected[1]} 小节` : `${currentBar} / ${barCount || 81}`}</span>
      </div>
      <div
        ref={railRef}
        className="timeline-rail"
        title="点击定位，拖拽选段"
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          const bar = barAt(event.clientX);
          dragStartRef.current = bar;
          setDragStart(bar);
          setDragEnd(bar);
        }}
        onPointerMove={(event) => {
          if (dragStartRef.current != null) setDragEnd(barAt(event.clientX));
        }}
        onPointerUp={(event) => finishDrag(event.clientX)}
      >
        <div className="timeline-fill" style={{ width: `${progressWidth}%` }} />
        {selection && (
          <div className="timeline-selection" style={{ left: `${selectionLeft}%`, width: `${selectionWidth}%` }} />
        )}
        <div className="timeline-thumb" style={{ left: `${progressWidth}%` }} />
      </div>
      <button
        className="selection-clear"
        title="清除选段"
        disabled={!selected}
        onClick={() => {
          setSelected(null);
          onClearSelection();
        }}
      >
        <X size={15} />
      </button>
    </footer>
  );
}
