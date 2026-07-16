import type { ScoreRecord } from '@/types';

interface InfoRowProps {
  label: string;
  value?: string | number | null;
}

function InfoRow({ label, value }: InfoRowProps) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div className="flex items-baseline justify-between gap-4 py-2">
      <span className="field-label">{label}</span>
      <span className="text-right text-sm font-medium text-slate-200">{value}</span>
    </div>
  );
}

interface MetadataPanelProps {
  record: ScoreRecord;
  /** Live values that can differ from stored meta while the user tweaks them. */
  liveBpm: number | null;
  liveCapo: number;
}

/** Right-hand dark info panel: song details + tuning/tempo/etc. */
export function MetadataPanel({ record, liveBpm, liveCapo }: MetadataPanelProps) {
  const { meta } = record;
  const formatLabel = record.isAlphaTex ? 'alphaTex' : record.format.toUpperCase();

  return (
    <aside className="flex h-full w-full flex-col overflow-y-auto bg-ink-900 px-5 py-6">
      <div className="mb-5">
        <p className="field-label mb-1">曲谱信息</p>
        <h2 className="text-xl font-bold leading-tight text-slate-50">
          {meta.title || record.name}
        </h2>
        {meta.artist && (
          <p className="mt-1 text-sm text-slate-400">{meta.artist}</p>
        )}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <span className="chip">{formatLabel}</span>
        {meta.genre && <span className="chip">{meta.genre}</span>}
        {meta.difficulty && <span className="chip">{meta.difficulty}</span>}
      </div>

      <div className="divide-y divide-ink-700/50 border-y border-ink-700/50">
        <InfoRow label="调性 Key" value={meta.key} />
        <InfoRow
          label="速度 Tempo"
          value={liveBpm ? `${liveBpm} BPM` : meta.tempo ? `${meta.tempo} BPM` : null}
        />
        <InfoRow label="拍号 Time" value={meta.timeSignature} />
        <InfoRow label="变调夹 Capo" value={liveCapo > 0 ? `第 ${liveCapo} 品` : '无'} />
        <InfoRow label="调弦 Tuning" value={meta.tuning} />
        <InfoRow label="小节数 Bars" value={meta.barCount} />
        <InfoRow label="专辑 Album" value={meta.album} />
      </div>

      {meta.trackNames && meta.trackNames.length > 0 && (
        <div className="mt-5">
          <p className="field-label mb-2">音轨 Tracks</p>
          <ul className="space-y-1">
            {meta.trackNames.map((name, i) => (
              <li
                key={i}
                className="rounded-lg bg-ink-800 px-3 py-1.5 text-sm text-slate-300"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {meta.notes && (
        <div className="mt-5">
          <p className="field-label mb-2">备注 Notes</p>
          <p className="rounded-lg bg-ink-800 px-3 py-2 text-sm text-slate-300">
            {meta.notes}
          </p>
        </div>
      )}

      <div className="mt-auto pt-6">
        <p className="text-[11px] leading-relaxed text-slate-600">
          曲谱由结构化数据实时渲染，非图片。所有信息来自导入的曲谱文件。
        </p>
      </div>
    </aside>
  );
}
