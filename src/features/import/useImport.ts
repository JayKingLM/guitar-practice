import { useCallback, useRef, useState } from 'react';
import { useLibraryStore } from '@/features/library/libraryStore';
import { parseScoreFile, buildRecord } from './importService';
import { IMPORT_ACCEPT } from '@/utils';

export interface ImportResult {
  ok: number;
  failed: { name: string; reason: string }[];
}

/**
 * Handles importing one or many structured score files into the local library.
 * Returns handlers for a hidden file input and drag-and-drop.
 */
export function useImport() {
  const add = useLibraryStore((s) => s.add);
  const [busy, setBusy] = useState(false);
  const [lastResult, setLastResult] = useState<ImportResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const importFiles = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files);
      if (list.length === 0) return;
      setBusy(true);
      const result: ImportResult = { ok: 0, failed: [] };
      for (const file of list) {
        try {
          const parsed = await parseScoreFile(file);
          await add(buildRecord(parsed));
          result.ok += 1;
        } catch (e) {
          result.failed.push({
            name: file.name,
            reason: e instanceof Error ? e.message : '未知错误',
          });
        }
      }
      setBusy(false);
      setLastResult(result);
      return result;
    },
    [add],
  );

  const openPicker = useCallback(() => inputRef.current?.click(), []);

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) importFiles(e.target.files);
      e.target.value = '';
    },
    [importFiles],
  );

  const clearResult = useCallback(() => setLastResult(null), []);

  return {
    inputRef,
    accept: IMPORT_ACCEPT,
    busy,
    lastResult,
    importFiles,
    openPicker,
    onInputChange,
    clearResult,
  };
}
