import { useCallback, useEffect, useRef, useState } from 'react';
import * as alphaTab from '@coderline/alphatab';
import type { ScoreMeta, PlaybackState } from '@/types';
import {
  createAlphaTabApi,
  barRangeToPlaybackRange,
  prepareAlphaTexForRendering,
} from './alphaTabService';
import { extractMeta } from './metadata';

export interface UseAlphaTabArgs {
  /** The score bytes (binary) or alphaTex text to render. */
  data: ArrayBuffer | string | null;
  /** True when `data` is alphaTex text. */
  isAlphaTex: boolean;
  /** Callback when metadata is parsed from the loaded score. */
  onMeta?: (meta: ScoreMeta) => void;
  /** Render additional tracks that explicitly use numbered notation. */
  renderNumberedTracks?: boolean;
  /** Place chord diagrams at their beats instead of in the page header. */
  chordDiagramsInScore?: boolean;
}

export interface AlphaTabController {
  /** Ref for the alphaTab render target. */
  containerRef: React.RefObject<HTMLDivElement>;
  /** Ref for the scrolling viewport (for cursor auto-scroll). */
  viewportRef: React.RefObject<HTMLDivElement>;
  /** Whether the score finished rendering. */
  isReady: boolean;
  /** Whether the synthesizer soundfont finished loading (playback ready). */
  isPlayerReady: boolean;
  /** Current playback state. */
  playback: PlaybackState;
  /** Loading / error message, if any. */
  error: string | null;
  /** Total bars in the current score. */
  barCount: number;
  /** 1-based current bar under the cursor while playing. */
  currentBar: number;
  /** Fractional playback progress 0..1. */
  progress: number;
  playPause: () => void;
  stop: () => void;
  setSpeed: (multiplier: number) => void;
  setZoom: (zoom: number) => void;
  setLoop: (enabled: boolean, startBar: number | null, endBar: number | null) => void;
  setMetronome: (enabled: boolean) => void;
  setCountIn: (enabled: boolean) => void;
  setVolumes: (values: {
    master: number;
    guitar: number;
    melody: number;
    metronome: number;
    guitarEnabled: boolean;
    melodyEnabled: boolean;
  }) => void;
  setVisibleSystems: (count: number) => void;
  clearSelection: () => void;
  selectBars: (startBar: number, endBar: number) => void;
  /** Jump playback to a given 1-based bar. */
  goToBar: (bar: number) => void;
}

/**
 * Owns a single AlphaTabApi instance for the lifetime of the score view.
 * Rendering, playback, cursor, looping, tempo, metronome and count-in all
 * flow through here so React components stay declarative.
 */
export function useAlphaTab(args: UseAlphaTabArgs): AlphaTabController {
  const {
    data,
    isAlphaTex,
    onMeta,
    renderNumberedTracks = true,
    chordDiagramsInScore = false,
  } = args;
  const hasData = data !== null;

  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<alphaTab.AlphaTabApi | null>(null);
  const onMetaRef = useRef(onMeta);
  onMetaRef.current = onMeta;
  const renderNumberedTracksRef = useRef(renderNumberedTracks);
  renderNumberedTracksRef.current = renderNumberedTracks;
  const chordDiagramsInScoreRef = useRef(chordDiagramsInScore);
  chordDiagramsInScoreRef.current = chordDiagramsInScore;

  const [isReady, setIsReady] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [playback, setPlayback] = useState<PlaybackState>('stopped');
  const [error, setError] = useState<string | null>(null);
  const [barCount, setBarCount] = useState(0);
  const [currentBar, setCurrentBar] = useState(1);
  const [progress, setProgress] = useState(0);
  const visibleSystemsRef = useRef(4);
  const topSystemRef = useRef(0);

  // Create the API once the container exists.
  useEffect(() => {
    if (!containerRef.current || !viewportRef.current) return;
    setError(null);
    setIsReady(false);
    setIsPlayerReady(false);

    let api: alphaTab.AlphaTabApi;
    try {
      api = createAlphaTabApi({
        element: containerRef.current,
        scrollElement: viewportRef.current,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : '初始化渲染引擎失败');
      return;
    }
    apiRef.current = api;
    let refinementFrame: number | null = null;
    const scheduleScoreRefinement = () => {
      if (refinementFrame !== null) return;
      refinementFrame = requestAnimationFrame(() => {
        refinementFrame = null;
        refineRenderedScore(containerRef.current, api.score);
      });
    };
    const scoreObserver = new MutationObserver(scheduleScoreRefinement);
    scoreObserver.observe(containerRef.current, { childList: true, subtree: true });

    api.scoreLoaded.on((score) => {
      score.stylesheet.globalDisplayChordDiagramsInScore = chordDiagramsInScoreRef.current;
      score.stylesheet.globalDisplayChordDiagramsOnTop = !chordDiagramsInScoreRef.current;
      score.stylesheet.perTrackChordDiagramsOnTop = null;
      setBarCount(score.masterBars.length);
      topSystemRef.current = 0;

      if (renderNumberedTracksRef.current) {
        const visibleTracks = score.tracks.filter(
          (track, index) =>
            index === 0 || track.staves.some((staff) => staff.showNumbered),
        );
        if (visibleTracks.length > 1) {
          // scoreLoaded fires while alphaTab is still finalizing MIDI and bounds.
          // Defer the second render so multi-track cursor data is complete first.
          queueMicrotask(() => {
            if (apiRef.current === api && api.score === score) {
              api.renderTracks(visibleTracks);
            }
          });
        }
      }

      try {
        onMetaRef.current?.(extractMeta(score));
      } catch {
        /* metadata extraction is best-effort */
      }
    });
    api.renderFinished.on(() => {
      refineRenderedScore(containerRef.current, api.score);
      scheduleScoreRefinement();
      setIsReady(true);
    });
    api.playerReady.on(() => setIsPlayerReady(true));
    api.playerStateChanged.on((e) => {
      setPlayback(
        e.state === alphaTab.synth.PlayerState.Playing ? 'playing' : 'paused',
      );
    });
    api.playerPositionChanged.on((e) => {
      if (e.endTime > 0) setProgress(e.currentTime / e.endTime);
    });
    api.activeBeatsChanged.on((e) => {
      const beats = e.activeBeats;
      if (beats && beats.length > 0) {
        const bar = beats[0].voice.bar.index + 1;
        setCurrentBar(bar);

        const lookup = api.boundsLookup?.findMasterBarByIndex(bar - 1);
        const system = lookup?.staffSystemBounds;
        const viewport = viewportRef.current;
        const target = containerRef.current;
        if (system && viewport && target) {
          const visible = Math.max(2, visibleSystemsRef.current);
          const currentSystem = system.index;
          const topSystem = topSystemRef.current;
          const outside = currentSystem < topSystem || currentSystem >= topSystem + visible;
          const reachedPreviewLine = currentSystem === topSystem + visible - 1;
          if (outside || reachedPreviewLine) {
            topSystemRef.current = currentSystem;
            viewport.scrollTo({
              top: Math.max(0, target.offsetTop + system.realBounds.y - 18),
              behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
                ? 'auto'
                : 'smooth',
            });
          }
        }
      }
    });
    api.error.on((err) => {
      setError(err?.message ?? '渲染或播放出错');
    });

    return () => {
      scoreObserver.disconnect();
      if (refinementFrame !== null) cancelAnimationFrame(refinementFrame);
      try {
        api.destroy();
      } catch {
        /* ignore */
      }
      apiRef.current = null;
    };
  }, [hasData]);

  // Load / reload score data whenever it changes.
  useEffect(() => {
    const api = apiRef.current;
    if (!api || data == null) return;
    setIsReady(false);
    setError(null);
    setPlayback('stopped');
    setProgress(0);
    setCurrentBar(1);
    try {
      if (isAlphaTex && typeof data === 'string') {
        api.tex(prepareAlphaTexForRendering(data));
      } else if (data instanceof ArrayBuffer) {
        api.load(new Uint8Array(data));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '无法加载曲谱数据');
    }
  }, [data, isAlphaTex, renderNumberedTracks, chordDiagramsInScore]);

  const playPause = useCallback(() => {
    const api = apiRef.current;
    if (!api) return;
    if (playback !== 'playing') {
      try {
        api.applyPlaybackRangeFromHighlight();
      } catch {
        /* No highlighted range means normal whole-song playback. */
      }
    }
    api.playPause();
  }, [playback]);

  const stop = useCallback(() => {
    apiRef.current?.stop();
    setPlayback('stopped');
    setProgress(0);
    setCurrentBar(1);
  }, []);

  const setSpeed = useCallback((multiplier: number) => {
    if (apiRef.current) apiRef.current.playbackSpeed = multiplier;
  }, []);

  const setZoom = useCallback((zoom: number) => {
    const api = apiRef.current;
    if (!api) return;
    api.settings.display.scale = zoom;
    api.updateSettings();
    api.render();
  }, []);

  const setLoop = useCallback(
    (enabled: boolean, startBar: number | null, endBar: number | null) => {
      const api = apiRef.current;
      if (!api) return;
      api.isLooping = enabled;
      api.playbackRange = enabled
        ? barRangeToPlaybackRange(api, startBar, endBar)
        : null;
    },
    [],
  );

  const setMetronome = useCallback((enabled: boolean) => {
    if (apiRef.current) apiRef.current.metronomeVolume = enabled ? 0.7 : 0;
  }, []);

  const setCountIn = useCallback((enabled: boolean) => {
    if (apiRef.current) apiRef.current.countInVolume = enabled ? 0.78 : 0;
  }, []);

  const setVolumes = useCallback(
    (values: {
      master: number;
      guitar: number;
      melody: number;
      metronome: number;
      guitarEnabled: boolean;
      melodyEnabled: boolean;
    }) => {
      const api = apiRef.current;
      if (!api) return;
      api.masterVolume = values.master;
      api.metronomeVolume = values.metronome;
      const tracks = api.score?.tracks ?? [];
      if (tracks[0]) {
        api.changeTrackVolume([tracks[0]], values.guitarEnabled ? values.guitar : 0);
      }
      if (tracks[1]) {
        api.changeTrackVolume([tracks[1]], values.melodyEnabled ? values.melody : 0);
      }
    },
    [],
  );

  const setVisibleSystems = useCallback((count: number) => {
    visibleSystemsRef.current = Math.max(2, Math.min(8, count));
  }, []);

  const clearSelection = useCallback(() => {
    const api = apiRef.current;
    if (!api) return;
    api.clearPlaybackRangeHighlight();
    api.playbackRange = null;
  }, []);

  const selectBars = useCallback((startBar: number, endBar: number) => {
    const api = apiRef.current;
    const track = api?.score?.tracks[0];
    const staff = track?.staves[0];
    if (!api || !staff) return;
    const start = Math.max(0, Math.min(startBar - 1, staff.bars.length - 1));
    const end = Math.max(start, Math.min(endBar - 1, staff.bars.length - 1));
    const startBeat = staff.bars[start]?.voices[0]?.beats[0];
    const endBeats = staff.bars[end]?.voices[0]?.beats;
    const endBeat = endBeats?.[endBeats.length - 1];
    if (!startBeat || !endBeat) return;
    api.highlightPlaybackRange(startBeat, endBeat);
    api.applyPlaybackRangeFromHighlight();
  }, []);

  const goToBar = useCallback((bar: number) => {
    const api = apiRef.current;
    if (!api || !api.score) return;
    const bars = api.score.masterBars;
    const idx = Math.max(0, Math.min(bar - 1, bars.length - 1));
    api.tickPosition = bars[idx].start;
    setCurrentBar(idx + 1);
    if (api.endTick > 0) setProgress(bars[idx].start / api.endTick);

    const system = api.boundsLookup?.findMasterBarByIndex(idx)?.staffSystemBounds;
    const viewport = viewportRef.current;
    const target = containerRef.current;
    if (system && viewport && target) {
      topSystemRef.current = system.index;
      viewport.scrollTo({
        top: Math.max(0, target.offsetTop + system.realBounds.y - 18),
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
      });
    }
  }, []);

  return {
    containerRef,
    viewportRef,
    isReady,
    isPlayerReady,
    playback,
    error,
    barCount,
    currentBar,
    progress,
    playPause,
    stop,
    setSpeed,
    setZoom,
    setLoop,
    setMetronome,
    setCountIn,
    setVolumes,
    setVisibleSystems,
    clearSelection,
    selectBars,
    goToBar,
  };
}

function refineRenderedScore(
  container: HTMLElement | null,
  score: alphaTab.model.Score | null,
) {
  if (!container) return;
  const sectionLabels = new Set(
    score?.masterBars.flatMap((bar) => {
      const section = bar.section;
      return section ? [section.marker, section.text].filter(Boolean) : [];
    }) ?? [],
  );

  for (const node of container.querySelectorAll<SVGTextElement>('svg text')) {
    if (node.textContent === '\uE1E7' && !node.hasAttribute('text-anchor')) {
      node.setAttribute('transform', 'translate(0 -3.5)');
    } else if (node.textContent && sectionLabels.has(node.textContent)) {
      node.setAttribute('transform', 'translate(0 -24)');
    }
  }
}
