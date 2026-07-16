import * as alphaTab from '@coderline/alphatab';
import type { ScoreRecord, ScoreMeta, ScoreSource } from '@/types';
import { defaultSettings } from '@/types';
import { extractMeta } from '@/features/score/metadata';
import { getExtension, stripExtension, uid } from '@/utils';

export interface ParsedImport {
  format: 'alphatex';
  isAlphaTex: true;
  meta: ScoreMeta;
  data: Blob;
  suggestedName: string;
}

/**
 * Validate an alphaTex source file and extract its metadata before saving it.
 *
 * Throws with a friendly message when the file can't be parsed.
 */
export async function parseScoreFile(file: File): Promise<ParsedImport> {
  const extension = getExtension(file.name);
  if (extension !== 'alphatex' && extension !== 'txt') {
    throw new Error('这里只接收 alphaTex 曲谱代码（.alphatex 或 .txt）。');
  }

  const settings = new alphaTab.Settings();
  let score: alphaTab.model.Score;

  try {
    const text = await file.text();
    const importer = new alphaTab.importer.AlphaTexImporter();
    importer.initFromString(text, settings);
    score = importer.readScore();
  } catch (e) {
    throw new Error(
      `无法解析该文件，可能已损坏或不是有效的曲谱文件。（${
        e instanceof Error ? e.message : '未知错误'
      }）`,
    );
  }

  const meta = extractMeta(score);
  const suggestedName =
    score.title && score.title.trim().length > 0
      ? score.title.trim()
      : stripExtension(file.name);

  return {
    format: 'alphatex',
    isAlphaTex: true,
    meta,
    data: file,
    suggestedName,
  };
}

/** Build a ScoreRecord ready to store from a parsed import. */
export function buildRecord(
  parsed: ParsedImport,
  source: ScoreSource = 'import',
): ScoreRecord {
  const now = Date.now();
  return {
    id: uid(),
    format: parsed.format,
    source,
    name: parsed.suggestedName,
    meta: parsed.meta,
    settings: defaultSettings(),
    data: parsed.data,
    isAlphaTex: parsed.isAlphaTex,
    createdAt: now,
    updatedAt: now,
    lastOpenedAt: null,
  };
}

/**
 * Create a score record directly from alphaTex text (used by the PDF
 * recognition correction editor and the "paste alphaTex" flow).
 */
export function buildAlphaTexRecord(
  tex: string,
  name: string,
  source: ScoreSource = 'alphatex',
): ScoreRecord {
  const now = Date.now();
  const settings = new alphaTab.Settings();
  let meta: ScoreMeta = { title: name, artist: '' };
  try {
    const importer = new alphaTab.importer.AlphaTexImporter();
    importer.initFromString(tex, settings);
    const score = importer.readScore();
    meta = extractMeta(score);
    if (!meta.title || meta.title === '未命名曲谱') meta.title = name;
  } catch {
    /* keep fallback meta; editor will surface parse errors separately */
  }
  return {
    id: uid(),
    format: 'alphatex',
    source,
    name,
    meta,
    settings: defaultSettings(),
    data: new Blob([tex], { type: 'text/plain' }),
    isAlphaTex: true,
    createdAt: now,
    updatedAt: now,
    lastOpenedAt: null,
  };
}
