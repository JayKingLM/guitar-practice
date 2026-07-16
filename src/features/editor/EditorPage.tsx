import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, FileCode2, Save } from 'lucide-react';
import { getScore, updateScoreText } from '@/db';
import type { ScoreRecord } from '@/types';
import { readAsText } from '@/utils';
import { ScoreView, useAlphaTab } from '@/features/score';

export function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const debounceRef = useRef<number | null>(null);
  const [record, setRecord] = useState<ScoreRecord | null>(null);
  const [text, setText] = useState('');
  const [previewText, setPreviewText] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    (async () => {
      if (!id) return;
      const score = await getScore(id);
      if (!score) return;
      const source = score.isAlphaTex ? await readAsText(score.data) : '';
      setRecord(score);
      setText(source);
      setPreviewText(source);
    })();
  }, [id]);

  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => setPreviewText(text), 500);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [text]);

  const controller = useAlphaTab({ data: previewText || null, isAlphaTex: true });

  useEffect(() => {
    if (controller.isReady) controller.setZoom(0.72);
  }, [controller.isReady, controller.setZoom]);

  const save = async () => {
    if (!id) return;
    setStatus('saving');
    await updateScoreText(id, text);
    setStatus('saved');
    window.setTimeout(() => setStatus('idle'), 1400);
  };

  if (!record) return <div className="center-state"><span className="spinner" /></div>;

  return (
    <div className="editor-app">
      <header className="editor-toolbar">
        <div className="editor-title">
          <button className="icon-button" title="返回练习" onClick={() => navigate(`/player/${record.id}`)}><ArrowLeft size={19} /></button>
          <div><strong>{record.meta.title || record.name}</strong><span>曲谱校正</span></div>
        </div>
        <div className="editor-status">
          {controller.error ? <span className="syntax-error">代码有误</span> : <span className="syntax-ok"><Check size={15} /> 可以渲染</span>}
          <button className="primary-button" onClick={save} disabled={status === 'saving'}>
            {status === 'saved' ? <Check size={18} /> : <Save size={18} />}
            {status === 'saving' ? '保存中' : status === 'saved' ? '已保存' : '保存修改'}
          </button>
        </div>
      </header>

      <main className="editor-workspace">
        <section className="editor-pane code-pane">
          <div className="pane-label"><FileCode2 size={16} /><span>AlphaTex 源代码</span><em>{text.split('\n').length} 行</em></div>
          <textarea value={text} onChange={(event) => setText(event.target.value)} spellCheck={false} />
        </section>

        <section className="editor-pane preview-pane">
          <div className="pane-label"><Check size={16} /><span>实时谱面</span></div>
          <ScoreView controller={controller} />
        </section>
      </main>
    </div>
  );
}
