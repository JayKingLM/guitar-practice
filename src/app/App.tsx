import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LibraryPage } from '@/features/library/LibraryPage';
import { PlayerPage } from '@/features/player/PlayerPage';
import { EditorPage } from '@/features/editor/EditorPage';

/**
 * Top-level app. Uses hash routing so the built app works when opened from
 * the filesystem or any static host without server-side rewrites.
 */
export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LibraryPage />} />
        <Route path="/player/:id" element={<PlayerPage />} />
        <Route path="/editor/:id" element={<EditorPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
