import type { ScoreFormat } from '@/types';
import { STRUCTURED_EXTENSIONS } from '@/types';

/** Generate a stable unique id (crypto.randomUUID with fallback). */
export function uid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
}

/** Lowercased extension without the dot, or '' if none. */
export function getExtension(filename: string): string {
  const idx = filename.lastIndexOf('.');
  if (idx < 0) return '';
  return filename.slice(idx + 1).toLowerCase();
}

/** Strip the extension from a filename for a friendlier display name. */
export function stripExtension(filename: string): string {
  const idx = filename.lastIndexOf('.');
  return idx < 0 ? filename : filename.slice(0, idx);
}

/** Map a filename to a supported ScoreFormat, or null if unsupported. */
export function detectFormat(filename: string): ScoreFormat | null {
  const ext = getExtension(filename);
  if ((STRUCTURED_EXTENSIONS as string[]).includes(ext)) {
    return ext as ScoreFormat;
  }
  return null;
}

/** True if the format is alphaTex text (vs. binary score file). */
export function isAlphaTexFormat(format: ScoreFormat): boolean {
  return format === 'alphatex';
}

/** Human-friendly relative time, e.g. "3 分钟前". */
export function relativeTime(ts: number | null | undefined): string {
  if (!ts) return '从未打开';
  const diff = Date.now() - ts;
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return '刚刚';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} 分钟前`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} 小时前`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day} 天前`;
  const mon = Math.floor(day / 30);
  if (mon < 12) return `${mon} 个月前`;
  return `${Math.floor(mon / 12)} 年前`;
}

/** Format a byte count as a compact size string. */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/** The accept string for the import file picker. */
export const IMPORT_ACCEPT =
  '.alphatex,.txt,text/plain';
