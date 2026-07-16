import { AlertCircle } from 'lucide-react';
import type { AlphaTabController } from './useAlphaTab';

interface ScoreViewProps {
  controller: AlphaTabController;
}

export function ScoreView({ controller }: ScoreViewProps) {
  const { containerRef, viewportRef, isReady, error } = controller;

  return (
    <div className="score-shell">
      <div ref={viewportRef} className="score-viewport at-surface">
        <div className="score-paper">
          <div ref={containerRef} className="score-render-target" />
        </div>
      </div>

      {!isReady && !error && (
        <div className="score-state">
          <span className="spinner" />
          <span>正在排版曲谱</span>
        </div>
      )}

      {error && (
        <div className="score-state error-state">
          <AlertCircle size={24} />
          <strong>曲谱代码需要校正</strong>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

