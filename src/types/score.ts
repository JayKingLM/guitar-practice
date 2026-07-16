// Core domain types for GuitarTab Studio.

/** File formats the app can import and render as structured tab. */
export type ScoreFormat =
  | 'gp'
  | 'gp3'
  | 'gp4'
  | 'gp5'
  | 'gpx'
  | 'gp7'
  | 'gp8'
  | 'musicxml'
  | 'xml'
  | 'alphatex';

export const STRUCTURED_EXTENSIONS: ScoreFormat[] = [
  'gp',
  'gp3',
  'gp4',
  'gp5',
  'gpx',
  'gp7',
  'gp8',
  'musicxml',
  'xml',
  'alphatex',
];

/** How the score entered the library. */
export type ScoreSource = 'import' | 'alphatex';

/** Per-score user settings that persist across sessions. */
export interface ScoreSettings {
  /** Playback speed multiplier applied on top of the score's own tempo (1 = 100%). */
  playbackSpeed: number;
  /** User-overridden BPM (null = use the score's native tempo). */
  bpmOverride: number | null;
  /** Capo fret (0 = none). Visual/informational; alphaTab transposition handled separately. */
  capo: number;
  /** Loop enabled. */
  loopEnabled: boolean;
  /** Loop start bar (1-based) or null. */
  loopStartBar: number | null;
  /** Loop end bar (1-based) or null. */
  loopEndBar: number | null;
  /** Rendering zoom (1 = 100%). */
  zoom: number;
  /** Count-in before playback. */
  countIn: boolean;
  /** Metronome enabled. */
  metronome: boolean;
  /** Master synthesizer volume. */
  masterVolume: number;
  /** Guitar track volume. */
  guitarVolume: number;
  /** Guitar accompaniment channel enabled. */
  guitarEnabled: boolean;
  /** Melody guide track volume. */
  melodyVolume: number;
  /** Melody guide channel enabled. */
  melodyEnabled: boolean;
  /** Metronome channel volume. */
  metronomeVolume: number;
  /** Number of score systems targeted in the visible viewport. */
  visibleSystems: number;
  /** Show the compact numbered-melody strip. */
  showMelody: boolean;
  /** Show the lyric line below the score. */
  showLyrics: boolean;
  /** Show full fingering diagrams at chord positions in the score. */
  showChordDiagrams: boolean;
}

export function defaultSettings(): ScoreSettings {
  return {
    playbackSpeed: 1,
    bpmOverride: null,
    capo: 0,
    loopEnabled: false,
    loopStartBar: null,
    loopEndBar: null,
    zoom: 1,
    countIn: false,
    metronome: false,
    masterVolume: 0.85,
    guitarVolume: 0.72,
    guitarEnabled: false,
    melodyVolume: 0.42,
    melodyEnabled: true,
    metronomeVolume: 0.7,
    visibleSystems: 4,
    showMelody: true,
    showLyrics: true,
    showChordDiagrams: true,
  };
}

export function normalizeSettings(settings?: Partial<ScoreSettings>): ScoreSettings {
  return { ...defaultSettings(), ...settings };
}

/** Metadata extracted from the score (or entered by the user). */
export interface ScoreMeta {
  title: string;
  artist: string;
  album?: string;
  /** Free-form difficulty label, e.g. "入门 / Beginner". */
  difficulty?: string;
  /** Genre / type, e.g. "民谣", "指弹". */
  genre?: string;
  /** Tuning display, e.g. "E A D G B E". */
  tuning?: string;
  /** Musical key display, e.g. "C", "G". */
  key?: string;
  /** Native tempo in BPM parsed from the file. */
  tempo?: number;
  /** Time signature as "num/den", e.g. "4/4". */
  timeSignature?: string;
  /** Number of bars. */
  barCount?: number;
  /** Track names in the file. */
  trackNames?: string[];
  /** Free notes / remarks. */
  notes?: string;
}

/** A stored score record in the local library (Dexie). */
export interface ScoreRecord {
  id: string;
  format: ScoreFormat;
  source: ScoreSource;
  /** Display name (user-renamable). */
  name: string;
  meta: ScoreMeta;
  settings: ScoreSettings;
  /** Original file bytes for gp/musicxml, or UTF-8 text bytes for alphatex. */
  data: Blob;
  /** True when `data` is UTF-8 alphaTex text rather than a binary score file. */
  isAlphaTex: boolean;
  createdAt: number;
  updatedAt: number;
  lastOpenedAt: number | null;
}

/** Playback state exposed by the player store. */
export type PlaybackState = 'stopped' | 'playing' | 'paused';
