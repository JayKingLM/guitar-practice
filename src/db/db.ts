import Dexie, { type Table } from 'dexie';
import type { ScoreRecord } from '@/types';

/**
 * Local library database.
 *
 * Everything the user imports lives here in IndexedDB via Dexie:
 *  - the original file bytes (Blob), so re-rendering never needs the network
 *  - parsed metadata
 *  - per-score user settings (bpm/capo/loop/zoom/…)
 *
 * This is what makes scores survive a page refresh.
 */
export class GuitarTabDB extends Dexie {
  scores!: Table<ScoreRecord, string>;

  constructor() {
    super('guitartab-studio');
    this.version(1).stores({
      // Indexed fields only; the full record (incl. Blob) is stored as the value.
      scores: 'id, name, format, source, createdAt, updatedAt, lastOpenedAt',
    });
  }
}

export const db = new GuitarTabDB();
