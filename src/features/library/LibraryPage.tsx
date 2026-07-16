import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  FileMusic,
  Guitar,
  MoreHorizontal,
  Play,
  Search,
  Upload,
} from 'lucide-react';
import { useImport } from '@/features/import';
import { relativeTime } from '@/utils';
import { ensureBuiltInWeatherScore } from './builtins';
import { useLibraryStore } from './libraryStore';

export function LibraryPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { scores, loading, refresh } = useLibraryStore();
  const importer = useImport();
  const [query, setQuery] = useState('');
  const [booted, setBooted] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    (async () => {
      await ensureBuiltInWeatherScore();
      await refresh();
      setBooted(true);
    })();
  }, [refresh]);

  useEffect(() => {
    if (!booted || searchParams.has('browse')) return;
    const lastId = window.localStorage.getItem('guitar-last-score');
    if (lastId && scores.some((score) => score.id === lastId)) {
      navigate(`/player/${lastId}`, { replace: true });
    }
  }, [booted, navigate, scores, searchParams]);

  const filteredScores = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase();
    if (!keyword) return scores;
    return scores.filter((score) =>
      `${score.meta.title} ${score.meta.artist} ${score.name}`.toLocaleLowerCase().includes(keyword),
    );
  }, [query, scores]);

  return (
    <div
      className="library-app"
      onDragOver={(event) => {
        event.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragOver(false);
        if (event.dataTransfer.files.length) importer.importFiles(event.dataTransfer.files);
      }}
    >
      <header className="library-header">
        <div className="brand-lockup">
          <span className="brand-mark"><Guitar size={22} /></span>
          <div><strong>谱行</strong><span>Guitar practice</span></div>
        </div>
        <div className="library-actions">
          <button className="primary-button" onClick={importer.openPicker} disabled={importer.busy}>
            <Upload size={18} />
            <span>导入曲谱代码</span>
          </button>
          <input ref={importer.inputRef} type="file" multiple accept={importer.accept} hidden onChange={importer.onInputChange} />
        </div>
      </header>

      <main className="library-content">
        <section className="library-title-row">
          <div>
            <p className="eyebrow">本地曲库</p>
            <h1>练习从一张干净的谱开始</h1>
          </div>
          <label className="search-field">
            <Search size={18} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索歌曲或歌手" />
          </label>
        </section>

        <section className="score-list" aria-label="曲谱列表">
          <div className="score-list-head">
            <span>歌曲</span><span>速度</span><span>拍号</span><span>最近打开</span><span />
          </div>
          {loading || !booted ? (
            <div className="library-loading"><span className="spinner" /></div>
          ) : filteredScores.length === 0 ? (
            <div className="library-empty"><FileMusic size={26} /><strong>没有匹配的歌曲</strong></div>
          ) : filteredScores.map((score, index) => (
            <article className="score-row" key={score.id}>
              <button className="score-main" onClick={() => navigate(`/player/${score.id}`)}>
                <span className="score-index">{String(index + 1).padStart(2, '0')}</span>
                <span className="score-copy">
                  <strong>{score.meta.title || score.name}</strong>
                  <em>{score.meta.artist || '未知歌手'}</em>
                </span>
              </button>
              <span className="score-data mono">{score.settings.bpmOverride ?? score.meta.tempo ?? '—'} BPM</span>
              <span className="score-data">{score.meta.timeSignature ?? '4/4'}</span>
              <span className="score-data">{relativeTime(score.lastOpenedAt)}</span>
              <div className="row-actions">
                <button className="icon-button" title="打开曲谱" onClick={() => navigate(`/player/${score.id}`)}><Play size={17} fill="currentColor" /></button>
                <button className="icon-button" title="更多" onClick={() => navigate(`/editor/${score.id}`)}><MoreHorizontal size={19} /></button>
              </div>
            </article>
          ))}
        </section>
      </main>

      <footer className="library-footer">
        <span>{scores.length} 首歌曲</span>
        <span>仅保存在这台电脑</span>
      </footer>

      {dragOver && (
        <div className="drop-overlay">
          <Upload size={34} />
          <strong>松开曲谱代码即可导入</strong>
        </div>
      )}

      {importer.lastResult && (
        <button className="import-toast" onClick={importer.clearResult}>
          已导入 {importer.lastResult.ok} 份曲谱
          {importer.lastResult.failed.length > 0 && `，${importer.lastResult.failed.length} 份需要检查`}
        </button>
      )}
    </div>
  );
}
