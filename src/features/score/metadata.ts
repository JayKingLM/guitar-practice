import * as alphaTab from '@coderline/alphatab';
import type { ScoreMeta } from '@/types';

/** Map alphaTab's KeySignature enum value to a readable key name. */
function keyName(sig: number): string {
  const names: Record<number, string> = {
    [-7]: 'Cb',
    [-6]: 'Gb',
    [-5]: 'Db',
    [-4]: 'Ab',
    [-3]: 'Eb',
    [-2]: 'Bb',
    [-1]: 'F',
    [0]: 'C',
    [1]: 'G',
    [2]: 'D',
    [3]: 'A',
    [4]: 'E',
    [5]: 'B',
    [6]: 'F#',
    [7]: 'C#',
  };
  return names[sig] ?? 'C';
}

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/** Convert a MIDI note number to a note name with octave, e.g. 40 -> "E2". */
function midiToName(midi: number): string {
  const name = NOTE_NAMES[midi % 12];
  const octave = Math.floor(midi / 12) - 1;
  return `${name}${octave}`;
}

/**
 * Extract display metadata from a loaded alphaTab Score.
 * Everything here is derived from the structured file, not guessed.
 */
export function extractMeta(score: alphaTab.model.Score): ScoreMeta {
  const firstBar = score.masterBars[0];
  const timeSignature = firstBar
    ? `${firstBar.timeSignatureNumerator}/${firstBar.timeSignatureDenominator}`
    : undefined;

  const key = firstBar ? keyName(firstBar.keySignature as unknown as number) : undefined;

  // Tuning + capo come from the first guitar-like staff we can find.
  let tuning: string | undefined;
  let capo = 0;
  const trackNames: string[] = [];
  for (const track of score.tracks) {
    trackNames.push(track.name || `Track ${track.index + 1}`);
    const staff = track.staves.find((s) => s.tuning && s.tuning.length > 0);
    if (staff && !tuning) {
      // alphaTab tuning is high-string-first; display low-to-high like "E A D G B E".
      const notes = [...staff.tuning].reverse().map(midiToName);
      tuning = notes.join(' ');
      capo = staff.capo ?? 0;
    }
  }

  return {
    title: score.title || '未命名曲谱',
    artist: score.artist || score.music || '',
    album: score.album || undefined,
    key,
    tempo: score.tempo || undefined,
    timeSignature,
    barCount: score.masterBars.length,
    tuning,
    trackNames,
    notes: capo > 0 ? `Capo ${capo}` : undefined,
  };
}
