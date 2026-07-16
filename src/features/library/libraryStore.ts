import { create } from 'zustand';
import type { ScoreRecord, ScoreSettings } from '@/types';
import {
  getAllScores,
  addScore,
  deleteScore,
  renameScore,
  saveSettings,
  touchScore,
} from '@/db';

interface LibraryState {
  scores: ScoreRecord[];
  loading: boolean;
  error: string | null;
  /** Load all scores from IndexedDB. */
  refresh: () => Promise<void>;
  /** Add a score and refresh. */
  add: (record: ScoreRecord) => Promise<void>;
  /** Remove a score and refresh. */
  remove: (id: string) => Promise<void>;
  /** Rename a score and refresh. */
  rename: (id: string, name: string) => Promise<void>;
  /** Persist per-score settings (also updates in-memory list). */
  persistSettings: (id: string, settings: ScoreSettings) => Promise<void>;
  /** Mark a score as opened now. */
  markOpened: (id: string) => Promise<void>;
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
  scores: [],
  loading: false,
  error: null,

  refresh: async () => {
    set({ loading: true, error: null });
    try {
      const scores = await getAllScores();
      set({ scores, loading: false });
    } catch (e) {
      set({
        loading: false,
        error: e instanceof Error ? e.message : '读取本地曲谱库失败',
      });
    }
  },

  add: async (record) => {
    await addScore(record);
    await get().refresh();
  },

  remove: async (id) => {
    await deleteScore(id);
    await get().refresh();
  },

  rename: async (id, name) => {
    await renameScore(id, name);
    await get().refresh();
  },

  persistSettings: async (id, settings) => {
    await saveSettings(id, settings);
    set((state) => ({
      scores: state.scores.map((s) => (s.id === id ? { ...s, settings } : s)),
    }));
  },

  markOpened: async (id) => {
    await touchScore(id);
    window.localStorage.setItem('guitar-last-score', id);
    set((state) => ({
      scores: state.scores.map((score) =>
        score.id === id ? { ...score, lastOpenedAt: Date.now() } : score,
      ),
    }));
  },
}));
