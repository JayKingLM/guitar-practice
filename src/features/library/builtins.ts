import { db } from '@/db/db';
import { buildAlphaTexRecord } from '@/features/import';
import { normalizeSettings } from '@/types';
import { WEATHER_TEX } from './weatherScore';

export const WEATHER_SCORE_ID = 'weather-huangxuan-mvp';
const BUILTIN_NOTE = '可编辑 alphaTex 练习谱 v3';

export async function ensureBuiltInWeatherScore() {
  const existing = await db.scores.get(WEATHER_SCORE_ID);
  if (existing?.meta.notes === BUILTIN_NOTE) return existing;

  const record = buildAlphaTexRecord(WEATHER_TEX, '怪天气', 'alphatex');
  record.id = WEATHER_SCORE_ID;
  record.name = '怪天气';
  record.meta = {
    ...record.meta,
    title: '怪天气',
    artist: '黄宣',
    tempo: 77,
    timeSignature: '4/4',
    key: 'A',
    barCount: 81,
    genre: '弹唱',
    trackNames: ['钢弦吉他', '数字旋律'],
    notes: BUILTIN_NOTE,
  };
  record.settings = normalizeSettings({
    countIn: true,
    metronome: true,
    bpmOverride: 77,
    guitarEnabled: false,
    melodyEnabled: true,
    zoom: 0.92,
    visibleSystems: 4,
  });
  record.createdAt = Date.now();
  record.updatedAt = Date.now();

  if (existing) {
    record.settings = normalizeSettings(existing.settings);
    record.createdAt = existing.createdAt;
    record.lastOpenedAt = existing.lastOpenedAt;
  }
  await db.scores.put(record);
  return record;
}
