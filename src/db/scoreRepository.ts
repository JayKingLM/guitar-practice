import { db } from './db';
import type { ScoreRecord, ScoreSettings } from '@/types';

/** Insert a new score record. */
export async function addScore(record: ScoreRecord): Promise<void> {
  await db.scores.add(record);
}

/** Fetch all scores, most-recently-touched first. */
export async function getAllScores(): Promise<ScoreRecord[]> {
  const all = await db.scores.toArray();
  return all.sort((a, b) => {
    const ta = a.lastOpenedAt ?? a.updatedAt;
    const tb = b.lastOpenedAt ?? b.updatedAt;
    return tb - ta;
  });
}

/** Fetch a single score by id. */
export async function getScore(id: string): Promise<ScoreRecord | undefined> {
  return db.scores.get(id);
}

/** Rename a score. */
export async function renameScore(id: string, name: string): Promise<void> {
  await db.scores.update(id, { name, updatedAt: Date.now() });
}

/** Delete a score. */
export async function deleteScore(id: string): Promise<void> {
  await db.scores.delete(id);
}

/** Persist updated per-score settings. */
export async function saveSettings(id: string, settings: ScoreSettings): Promise<void> {
  await db.scores.update(id, { settings, updatedAt: Date.now() });
}

/** Mark a score as opened now (drives "last opened" sort + label). */
export async function touchScore(id: string): Promise<void> {
  await db.scores.update(id, { lastOpenedAt: Date.now() });
}

/** Update metadata (used after re-parsing or manual edits). */
export async function updateMeta(
  id: string,
  patch: Partial<ScoreRecord['meta']>,
): Promise<void> {
  const rec = await db.scores.get(id);
  if (!rec) return;
  await db.scores.update(id, { meta: { ...rec.meta, ...patch }, updatedAt: Date.now() });
}

/** Replace editable alphaTex while preserving the song record and settings. */
export async function updateScoreText(id: string, text: string): Promise<void> {
  await db.scores.update(id, {
    data: new Blob([text], { type: 'text/plain;charset=utf-8' }),
    isAlphaTex: true,
    format: 'alphatex',
    updatedAt: Date.now(),
  });
}
