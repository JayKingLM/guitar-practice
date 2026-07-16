import { useNavigate } from 'react-router-dom';
import type { ScoreSettings, PlaybackState } from '@/types';
import {
  ToolButton,
  Popover,
  Stepper,
  BackIcon,
  PlayIcon,
  PauseIcon,
  RestartIcon,
  LoopIcon,
  CapoIcon,
  CountInIcon,
  MetronomeIcon,
  ZoomInIcon,
  ZoomOutIcon,
  FullscreenIcon,
  ExitFullscreenIcon,
  SpeedIcon,
} from '@/components';

const SPEED_PRESETS = [0.25, 0.5, 0.75, 1, 1.25, 1.5];

interface ControlBarProps {
  title: string;
  playback: PlaybackState;
  playerReady: boolean;
  settings: ScoreSettings;
  barCount: number;
  nativeBpm: number | null;
  isFullscreen: boolean;
  onPlayPause: () => void;
  onRestart: () => void;
  onChange: (patch: Partial<ScoreSettings>) => void;
  onToggleFullscreen: () => void;
}

/** The rounded top control bar with all playback + practice controls. */
export function ControlBar({
  title,
  playback,
  playerReady,
  settings,
  barCount,
  nativeBpm,
  isFullscreen,
  onPlayPause,
  onRestart,
  onChange,
  onToggleFullscreen,
}: ControlBarProps) {
  const navigate = useNavigate();
  const effectiveBpm = settings.bpmOverride ?? nativeBpm ?? 120;
  const zoomPct = Math.round(settings.zoom * 100);

  return (
    <header className="flex items-center gap-2 border-b border-ink-800 bg-ink-900/95 px-3 py-2 backdrop-blur">
      <button
        className="btn-ghost shrink-0"
        onClick={() => navigate('/')}
        title="返回曲谱库"
      >
        <BackIcon />
        <span className="hidden sm:inline">曲谱库</span>
      </button>

      <div className="mx-1 hidden min-w-0 flex-col md:flex">
        <span className="truncate text-sm font-semibold text-slate-100">{title}</span>
        <span className="text-[11px] text-slate-500">
          {barCount > 0 ? `${barCount} 小节` : '—'}
        </span>
      </div>

      <div className="mx-auto flex items-center gap-1">
        {/* Transport */}
        <ToolButton title="重来 (从头开始)" onClick={onRestart} disabled={!playerReady}>
          <RestartIcon />
        </ToolButton>
        <button
          className="btn-accent h-12 w-12 !rounded-full !px-0"
          onClick={onPlayPause}
          disabled={!playerReady}
          title={playback === 'playing' ? '暂停' : '播放'}
          aria-label={playback === 'playing' ? '暂停' : '播放'}
        >
          {playback === 'playing' ? (
            <PauseIcon width={24} height={24} />
          ) : (
            <PlayIcon width={24} height={24} />
          )}
        </button>

        {/* Loop */}
        <ToolButton
          title="循环练习"
          label="循环"
          active={settings.loopEnabled}
          onClick={() =>
            onChange({
              loopEnabled: !settings.loopEnabled,
              loopStartBar: settings.loopStartBar ?? 1,
              loopEndBar: settings.loopEndBar ?? Math.min(4, barCount || 4),
            })
          }
        >
          <LoopIcon />
        </ToolButton>

        {settings.loopEnabled && (
          <Popover
            align="center"
            trigger={({ toggle, open }) => (
              <button
                className={`chip cursor-pointer ${open ? 'ring-1 ring-accent-500/50' : ''}`}
                onClick={toggle}
                title="设置循环区间"
              >
                {settings.loopStartBar}–{settings.loopEndBar} 小节
              </button>
            )}
          >
            {() => (
              <div className="space-y-3">
                <p className="field-label">循环区间（小节）</p>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-400">起始</span>
                  <Stepper
                    value={settings.loopStartBar ?? 1}
                    min={1}
                    max={barCount || 1}
                    onChange={(v) =>
                      onChange({
                        loopStartBar: v,
                        loopEndBar: Math.max(v, settings.loopEndBar ?? v),
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-400">结束</span>
                  <Stepper
                    value={settings.loopEndBar ?? 1}
                    min={settings.loopStartBar ?? 1}
                    max={barCount || 1}
                    onChange={(v) => onChange({ loopEndBar: v })}
                  />
                </div>
              </div>
            )}
          </Popover>
        )}

        <div className="mx-1 h-8 w-px bg-ink-700" />

        {/* Speed */}
        <Popover
          align="center"
          trigger={({ toggle, open }) => (
            <ToolButton
              title="播放速度"
              label={`${Math.round(settings.playbackSpeed * 100)}%`}
              active={open || settings.playbackSpeed !== 1}
              onClick={toggle}
            >
              <SpeedIcon />
            </ToolButton>
          )}
        >
          {({ close }) => (
            <div className="space-y-2">
              <p className="field-label">播放速度</p>
              <div className="grid grid-cols-3 gap-2">
                {SPEED_PRESETS.map((s) => (
                  <button
                    key={s}
                    className={`rounded-lg px-2 py-1.5 text-sm font-medium transition-colors ${
                      settings.playbackSpeed === s
                        ? 'bg-accent-500 text-ink-950'
                        : 'bg-ink-800 text-slate-300 hover:bg-ink-700'
                    }`}
                    onClick={() => {
                      onChange({ playbackSpeed: s });
                      close();
                    }}
                  >
                    {Math.round(s * 100)}%
                  </button>
                ))}
              </div>
            </div>
          )}
        </Popover>

        {/* BPM */}
        <Popover
          align="center"
          trigger={({ toggle, open }) => (
            <ToolButton
              title="速度 BPM"
              label={`${effectiveBpm}`}
              active={open || settings.bpmOverride !== null}
              onClick={toggle}
            >
              <span className="text-[13px] font-bold">♩</span>
            </ToolButton>
          )}
        >
          {() => (
            <div className="space-y-3">
              <p className="field-label">速度 BPM</p>
              <div className="flex justify-center">
                <Stepper
                  value={effectiveBpm}
                  min={20}
                  max={400}
                  step={1}
                  suffix="BPM"
                  onChange={(v) => onChange({ bpmOverride: v })}
                />
              </div>
              {settings.bpmOverride !== null && nativeBpm && (
                <button
                  className="w-full rounded-lg bg-ink-800 py-1.5 text-xs text-slate-400 hover:bg-ink-700"
                  onClick={() => onChange({ bpmOverride: null })}
                >
                  恢复原速 ({nativeBpm} BPM)
                </button>
              )}
            </div>
          )}
        </Popover>

        {/* Capo */}
        <Popover
          align="center"
          trigger={({ toggle, open }) => (
            <ToolButton
              title="变调夹 Capo"
              label={settings.capo > 0 ? `品${settings.capo}` : 'Capo'}
              active={open || settings.capo > 0}
              onClick={toggle}
            >
              <CapoIcon />
            </ToolButton>
          )}
        >
          {() => (
            <div className="space-y-3">
              <p className="field-label">变调夹 Capo</p>
              <div className="flex justify-center">
                <Stepper
                  value={settings.capo}
                  min={0}
                  max={12}
                  suffix="品"
                  onChange={(v) => onChange({ capo: v })}
                />
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500">
                变调夹位置为记录信息，用于练习参考。
              </p>
            </div>
          )}
        </Popover>

        <div className="mx-1 h-8 w-px bg-ink-700" />

        {/* Count-in */}
        <ToolButton
          title="预备拍"
          label="预备"
          active={settings.countIn}
          onClick={() => onChange({ countIn: !settings.countIn })}
        >
          <CountInIcon />
        </ToolButton>

        {/* Metronome */}
        <ToolButton
          title="节拍器"
          label="节拍"
          active={settings.metronome}
          onClick={() => onChange({ metronome: !settings.metronome })}
        >
          <MetronomeIcon />
        </ToolButton>

        <div className="mx-1 h-8 w-px bg-ink-700" />

        {/* Zoom */}
        <ToolButton
          title="缩小"
          onClick={() => onChange({ zoom: Math.max(0.5, settings.zoom - 0.1) })}
        >
          <ZoomOutIcon />
        </ToolButton>
        <span className="w-10 text-center text-xs font-medium text-slate-400 tabular-nums">
          {zoomPct}%
        </span>
        <ToolButton
          title="放大"
          onClick={() => onChange({ zoom: Math.min(2, settings.zoom + 0.1) })}
        >
          <ZoomInIcon />
        </ToolButton>
      </div>

      {/* Fullscreen */}
      <ToolButton
        title={isFullscreen ? '退出专注模式' : '专注 / 全屏模式'}
        onClick={onToggleFullscreen}
      >
        {isFullscreen ? <ExitFullscreenIcon /> : <FullscreenIcon />}
      </ToolButton>
    </header>
  );
}
