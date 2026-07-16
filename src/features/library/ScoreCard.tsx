import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ScoreRecord } from '@/types';
import { relativeTime } from '@/utils';
import { TrashIcon, EditIcon, MusicIcon } from '@/components';

interface ScoreCardProps {
  record: ScoreRecord;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

/** A library card: title, format, bpm, time signature, last opened + actions. */
export function ScoreCard({ record, onRename, onDelete }: ScoreCardProps) {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(record.name);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const formatLabel = record.isAlphaTex ? 'alphaTex' : record.format.toUpperCase();

  const commitRename = () => {
    const trimmed = name.trim();
    if (trimmed && trimmed !== record.name) onRename(record.id, trimmed);
    else setName(record.name);
    setEditing(false);
  };

  return (
    <div className="card group relative flex flex-col overflow-hidden transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-panel">
      {/* Cover */}
      <button
        className="relative flex h-32 w-full items-center justify-center bg-gradient-to-br from-ink-800 to-ink-900"
        onClick={() => navigate(`/player/${record.id}`)}
        title="打开曲谱"
      >
        <MusicIcon width={40} height={40} className="text-ink-600" />
        <span className="absolute left-3 top-3 rounded-md bg-accent-500 px-2 py-0.5 text-[11px] font-bold text-ink-950">
          {formatLabel}
        </span>
      </button>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        {editing ? (
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitRename();
              if (e.key === 'Escape') {
                setName(record.name);
                setEditing(false);
              }
            }}
            className="mb-1 w-full rounded-md bg-ink-800 px-2 py-1 text-sm font-semibold text-slate-100 outline-none ring-1 ring-accent-500/50"
          />
        ) : (
          <button
            className="mb-1 truncate text-left text-sm font-semibold text-slate-100 hover:text-accent-400"
            onClick={() => navigate(`/player/${record.id}`)}
            title={record.meta.title || record.name}
          >
            {record.meta.title || record.name}
          </button>
        )}

        {record.meta.artist && (
          <p className="mb-2 truncate text-xs text-slate-500">{record.meta.artist}</p>
        )}

        <div className="mb-3 flex flex-wrap gap-1.5">
          {record.meta.tempo && (
            <span className="chip !py-0.5 !text-[11px]">{record.meta.tempo} BPM</span>
          )}
          {record.meta.timeSignature && (
            <span className="chip !py-0.5 !text-[11px]">{record.meta.timeSignature}</span>
          )}
          {record.meta.key && (
            <span className="chip !py-0.5 !text-[11px]">{record.meta.key}</span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            {relativeTime(record.lastOpenedAt)}
          </span>
          <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              className="btn-icon h-8 w-8"
              onClick={() => setEditing(true)}
              title="重命名"
            >
              <EditIcon width={16} height={16} />
            </button>
            <button
              className="btn-icon h-8 w-8 hover:text-red-400"
              onClick={() => setConfirmDelete(true)}
              title="删除"
            >
              <TrashIcon width={16} height={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink-950/95 p-4 text-center">
          <p className="text-sm text-slate-200">删除这份曲谱？</p>
          <p className="text-xs text-slate-500">此操作无法撤销。</p>
          <div className="flex gap-2">
            <button
              className="btn-ghost !bg-ink-800"
              onClick={() => setConfirmDelete(false)}
            >
              取消
            </button>
            <button
              className="btn bg-red-500 text-white hover:bg-red-400"
              onClick={() => onDelete(record.id)}
            >
              删除
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
