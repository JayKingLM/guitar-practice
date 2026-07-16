import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  AudioWaveform,
  Eye,
  EyeOff,
  FilePenLine,
  Guitar,
  Maximize2,
  Minimize2,
  Music2,
  PanelTop,
  Pause,
  Play,
  RotateCcw,
  Rows3,
  Settings2,
  SlidersHorizontal,
  TimerReset,
  Volume2,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import type { ScoreMeta, ScoreRecord, ScoreSettings } from '@/types';
import { normalizeSettings } from '@/types';
import { getScore } from '@/db';
import { useLibraryStore } from '@/features/library/libraryStore';
import { weatherSectionAt } from '@/features/library/weatherScore';
import { WEATHER_SCORE_ID } from '@/features/library/builtins';
import { ScoreView, useAlphaTab } from '@/features/score';
import { readAsText } from '@/utils';
import { ProgressBar } from './ProgressBar';

type SettingsPanel = 'mixer' | 'display' | null;

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(
    target.closest('input, textarea, select, [contenteditable="true"]'),
  );
}

function applyScoreDisplayPreferences(tex: string, settings: ScoreSettings | null) {
  if (!settings) return tex;
  return tex
    .split(/(?=^[\t ]*\\track\b)/gm)
    .map((trackBlock) => {
      const isNumberedTrack = /\\staff\s*\{[^}]*\bnumbered\b[^}]*\}/.test(trackBlock);
      return trackBlock.replace(/\{([^{}]*)\}/g, (_block, content: string) => {
        let next = content;
        if (!settings.showLyrics) {
          next = isNumberedTrack
            ? next.replace(/\s*lyrics(?:\s+\d+)?\s+"(?:[^"\\]|\\.)*"/g, '')
            : next.replace(/\s*lyrics\s+1\s+"(?:[^"\\]|\\.)*"/g, '');
        }
        if (!settings.showMelody && !isNumberedTrack) {
          next = next.replace(/\s*lyrics\s+"(?:[^"\\]|\\.)*"/g, '');
        }
        return next.trim() ? `{${next.trim()}}` : '';
      });
    })
    .join('');
}

export function PlayerPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const persistSettings = useLibraryStore((state) => state.persistSettings);
  const markOpened = useLibraryStore((state) => state.markOpened);
  const rootRef = useRef<HTMLDivElement>(null);
  const saveTimer = useRef<number | null>(null);
  const panelRef = useRef<HTMLElement>(null);
  const panelTriggersRef = useRef<HTMLDivElement>(null);

  const [record, setRecord] = useState<ScoreRecord | null>(null);
  const [data, setData] = useState<ArrayBuffer | string | null>(null);
  const [settings, setSettings] = useState<ScoreSettings | null>(null);
  const [nativeBpm, setNativeBpm] = useState<number | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [activePanel, setActivePanel] = useState<SettingsPanel>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!id) return;
      const score = await getScore(id);
      if (cancelled) return;
      if (!score) {
        setNotFound(true);
        return;
      }
      const normalized = normalizeSettings(score.settings);
      setRecord({ ...score, settings: normalized });
      setSettings(normalized);
      setNativeBpm(score.meta.tempo ?? null);
      await markOpened(score.id);
      setData(score.isAlphaTex ? await readAsText(score.data) : await score.data.arrayBuffer());
    })();
    return () => {
      cancelled = true;
    };
  }, [id, markOpened]);

  const displayData = useMemo(
    () => typeof data === 'string' ? applyScoreDisplayPreferences(data, settings) : data,
    [data, settings?.showLyrics, settings?.showMelody],
  );

  const controller = useAlphaTab({
    data: displayData,
    isAlphaTex: record?.isAlphaTex ?? false,
    renderNumberedTracks: settings?.showMelody ?? true,
    chordDiagramsInScore: settings?.showChordDiagrams ?? true,
    onMeta: useCallback((meta: ScoreMeta) => {
      setNativeBpm(meta.tempo ?? null);
    }, []),
  });

  const updateSettings = useCallback(
    (patch: Partial<ScoreSettings>) => {
      setSettings((previous) => {
        if (!previous) return previous;
        const next = { ...previous, ...patch };
        if (saveTimer.current) window.clearTimeout(saveTimer.current);
        saveTimer.current = window.setTimeout(() => {
          if (id) persistSettings(id, next);
        }, 320);
        return next;
      });
    },
    [id, persistSettings],
  );

  const effectiveBpm = settings?.bpmOverride ?? nativeBpm ?? 77;

  useEffect(() => {
    if (!settings) return;
    controller.setSpeed(nativeBpm ? effectiveBpm / nativeBpm : 1);
  }, [controller.setSpeed, effectiveBpm, nativeBpm, settings]);

  useEffect(() => {
    if (!settings || !controller.isReady) return;
    controller.setZoom(settings.zoom);
  }, [controller.isReady, controller.setZoom, settings?.zoom]);

  useEffect(() => {
    if (!settings) return;
    controller.setVisibleSystems(settings.visibleSystems);
  }, [controller.setVisibleSystems, settings?.visibleSystems]);

  useEffect(() => {
    if (!settings || !controller.isPlayerReady) return;
    controller.setCountIn(settings.countIn);
    controller.setVolumes({
      master: settings.masterVolume,
      guitar: settings.guitarVolume,
      melody: settings.melodyVolume,
      metronome: settings.metronome ? settings.metronomeVolume : 0,
      guitarEnabled: settings.guitarEnabled,
      melodyEnabled: settings.melodyEnabled,
    });
  }, [
    controller.isPlayerReady,
    controller.setCountIn,
    controller.setVolumes,
    settings,
  ]);

  useEffect(() => {
    const onFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFullscreen);
    return () => document.removeEventListener('fullscreenchange', onFullscreen);
  }, []);

  useEffect(() => {
    if (!activePanel) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (panelRef.current?.contains(target) || panelTriggersRef.current?.contains(target)) {
        return;
      }
      setActivePanel(null);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActivePanel(null);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [activePanel]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.code !== 'Space' ||
        event.repeat ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        isTypingTarget(event.target)
      ) {
        return;
      }
      event.preventDefault();
      if (controller.isPlayerReady) controller.playPause();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [controller.isPlayerReady, controller.playPause]);

  const toggleFullscreen = useCallback(() => {
    if (!rootRef.current) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else rootRef.current.requestFullscreen();
  }, []);

  const isWeather = record?.id === WEATHER_SCORE_ID;
  const currentSection = isWeather ? weatherSectionAt(controller.currentBar) : null;

  if (notFound) {
    return (
      <div className="center-state">
        <Music2 size={28} />
        <strong>找不到这份曲谱</strong>
        <button className="text-button" onClick={() => navigate('/?browse=1')}>返回曲库</button>
      </div>
    );
  }

  if (!record || !settings) {
    return <div className="center-state"><span className="spinner" /></div>;
  }

  return (
    <div ref={rootRef} className="practice-app">
      <header className="practice-header">
        <div className="song-identity">
          <button className="icon-button" title="返回曲库" onClick={() => navigate('/?browse=1')}>
            <ArrowLeft size={19} />
          </button>
          <div className="song-heading">
            <strong>{record.meta.title || record.name}</strong>
            <span>
              {record.meta.artist || '未知歌手'} · {currentSection?.name ?? '练习'} · {controller.currentBar}/{controller.barCount || record.meta.barCount || '—'} 小节
            </span>
          </div>
        </div>

        <div className="transport" aria-label="播放控制">
          <button className="icon-button" title="从头开始" onClick={controller.stop} disabled={!controller.isPlayerReady}>
            <RotateCcw size={19} />
          </button>
          <button
            className="play-button"
            title={controller.playback === 'playing' ? '暂停' : '播放'}
            onClick={controller.playPause}
            disabled={!controller.isPlayerReady}
            aria-keyshortcuts="Space"
          >
            {controller.playback === 'playing' ? <Pause size={22} /> : <Play size={22} fill="currentColor" />}
          </button>
          <div className="bpm-control" title="练习速度">
            <button onClick={() => updateSettings({ bpmOverride: Math.max(30, effectiveBpm - 1) })}>−</button>
            <label>
              <input
                value={effectiveBpm}
                type="number"
                min={30}
                max={260}
                onChange={(event) => updateSettings({ bpmOverride: Number(event.target.value) || 77 })}
              />
              <span>BPM</span>
            </label>
            <button onClick={() => updateSettings({ bpmOverride: Math.min(260, effectiveBpm + 1) })}>+</button>
          </div>
          <button
            className={`tool-toggle ${settings.countIn ? 'active' : ''}`}
            title="预备一小节"
            onClick={() => updateSettings({ countIn: !settings.countIn })}
          >
            <TimerReset size={18} />
            <span>预备</span>
          </button>
          <button
            className={`tool-toggle ${settings.metronome ? 'active' : ''}`}
            title="节拍器"
            onClick={() => updateSettings({ metronome: !settings.metronome })}
          >
            <AudioWaveform size={18} />
            <span>节拍</span>
          </button>
        </div>

        <div className="header-actions">
          <button className="icon-button" title="编辑曲谱" onClick={() => navigate(`/editor/${record.id}`)}>
            <FilePenLine size={19} />
          </button>
          <div ref={panelTriggersRef} className="panel-triggers">
            <button
              className={`icon-button ${activePanel === 'mixer' ? 'active' : ''}`}
              title="声音"
              aria-expanded={activePanel === 'mixer'}
              onClick={() => setActivePanel((value) => value === 'mixer' ? null : 'mixer')}
            >
              <SlidersHorizontal size={19} />
            </button>
            <button
              className={`icon-button ${activePanel === 'display' ? 'active' : ''}`}
              title="显示"
              aria-expanded={activePanel === 'display'}
              onClick={() => setActivePanel((value) => value === 'display' ? null : 'display')}
            >
              <Settings2 size={19} />
            </button>
          </div>
          <button className="icon-button" title={isFullscreen ? '退出全屏' : '全屏'} onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize2 size={19} /> : <Maximize2 size={19} />}
          </button>
        </div>
      </header>

      <main className="practice-stage">
        <ScoreView controller={controller} />
      </main>

      <ProgressBar
        progress={controller.progress}
        currentBar={controller.currentBar}
        barCount={controller.barCount}
        onSeekBar={controller.goToBar}
        onClearSelection={controller.clearSelection}
        onSelectBars={controller.selectBars}
      />

      {activePanel === 'mixer' && (
        <aside ref={panelRef} className="settings-drawer" aria-label="声音设置">
          <DrawerHeader title="声音" onClose={() => setActivePanel(null)} />
          <VolumeRow icon={<Volume2 size={18} />} label="总音量" value={settings.masterVolume} onChange={(masterVolume) => updateSettings({ masterVolume })} />
          <ChannelRow
            icon={<AudioWaveform size={18} />}
            label="节拍器"
            enabled={settings.metronome}
            value={settings.metronomeVolume}
            onToggle={() => updateSettings({ metronome: !settings.metronome })}
            onChange={(metronomeVolume) => updateSettings({ metronomeVolume })}
          />
          <ChannelRow
            icon={<Music2 size={18} />}
            label="数字旋律"
            enabled={settings.melodyEnabled}
            value={settings.melodyVolume}
            onToggle={() => updateSettings({ melodyEnabled: !settings.melodyEnabled })}
            onChange={(melodyVolume) => updateSettings({ melodyVolume })}
          />
          <ChannelRow
            icon={<Guitar size={18} />}
            label="吉他伴奏"
            enabled={settings.guitarEnabled}
            value={settings.guitarVolume}
            onToggle={() => updateSettings({ guitarEnabled: !settings.guitarEnabled })}
            onChange={(guitarVolume) => updateSettings({ guitarVolume })}
          />
        </aside>
      )}

      {activePanel === 'display' && (
        <aside ref={panelRef} className="settings-drawer display-drawer" aria-label="谱面显示设置">
          <DrawerHeader title="谱面" onClose={() => setActivePanel(null)} />
          <div className="setting-block">
            <div className="setting-label"><span>缩放</span><strong>{Math.round(settings.zoom * 100)}%</strong></div>
            <div className="zoom-row">
              <ZoomOut size={17} />
              <input type="range" min="0.55" max="1.5" step="0.05" value={settings.zoom} onChange={(event) => updateSettings({ zoom: Number(event.target.value) })} />
              <ZoomIn size={17} />
            </div>
          </div>
          <div className="setting-block">
            <div className="setting-label"><span>同屏行数</span><strong>{settings.visibleSystems}</strong></div>
            <input type="range" min="2" max="7" step="1" value={settings.visibleSystems} onChange={(event) => {
              const visibleSystems = Number(event.target.value);
              updateSettings({ visibleSystems, zoom: Math.max(0.58, 1.24 - visibleSystems * 0.08) });
            }} />
          </div>
          <div className="setting-block chord-layout-setting">
            <div className="setting-label"><span>和弦图位置</span></div>
            <div className="segmented-control" aria-label="和弦图位置">
              <button
                className={settings.showChordDiagrams ? '' : 'active'}
                aria-pressed={!settings.showChordDiagrams}
                onClick={() => updateSettings({ showChordDiagrams: false })}
              >
                <PanelTop size={16} />
                <span>页首汇总</span>
              </button>
              <button
                className={settings.showChordDiagrams ? 'active' : ''}
                aria-pressed={settings.showChordDiagrams}
                onClick={() => updateSettings({ showChordDiagrams: true })}
              >
                <Rows3 size={16} />
                <span>逐小节</span>
              </button>
            </div>
          </div>
          <VisibilityToggle label="数字旋律" checked={settings.showMelody} onClick={() => updateSettings({ showMelody: !settings.showMelody })} />
          <VisibilityToggle label="中文歌词" checked={settings.showLyrics} onClick={() => updateSettings({ showLyrics: !settings.showLyrics })} />
        </aside>
      )}
    </div>
  );
}

function DrawerHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="drawer-header">
      <strong>{title}</strong>
      <button className="icon-button" title="关闭" onClick={onClose}><X size={18} /></button>
    </div>
  );
}

function VolumeRow({ icon, label, value, onChange }: { icon: React.ReactNode; label: string; value: number; onChange: (value: number) => void }) {
  return (
    <div className="channel-row">
      <span className="channel-icon">{icon}</span>
      <span className="channel-name">{label}</span>
      <input type="range" min="0" max="1" step="0.01" value={value} onChange={(event) => onChange(Number(event.target.value))} />
      <span className="channel-value">{Math.round(value * 100)}</span>
    </div>
  );
}

function ChannelRow({ icon, label, enabled, value, onToggle, onChange }: { icon: React.ReactNode; label: string; enabled: boolean; value: number; onToggle: () => void; onChange: (value: number) => void }) {
  return (
    <div className={`channel-row ${enabled ? '' : 'muted'}`}>
      <button className="channel-toggle" title={enabled ? `关闭${label}` : `打开${label}`} onClick={onToggle}>
        {enabled ? icon : <Volume2 size={18} />}
      </button>
      <span className="channel-name">{label}</span>
      <input type="range" min="0" max="1" step="0.01" value={value} disabled={!enabled} onChange={(event) => onChange(Number(event.target.value))} />
      <span className="channel-value">{enabled ? Math.round(value * 100) : '关'}</span>
    </div>
  );
}

function VisibilityToggle({ label, checked, onClick }: { label: string; checked: boolean; onClick: () => void }) {
  return (
    <button className="visibility-toggle" onClick={onClick}>
      {checked ? <Eye size={18} /> : <EyeOff size={18} />}
      <span>{label}</span>
      <em>{checked ? '显示' : '隐藏'}</em>
    </button>
  );
}
