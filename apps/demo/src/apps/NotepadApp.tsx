import { useState, useEffect, useRef, useCallback } from 'react';
import { Bold, Italic, Type } from 'lucide-react';

const DEFAULT_CONTENT = `Welcome to AspectOS Notes!

This is a fully functional notepad within the OS desktop environment.

Features:
- Drag this window by the title bar
- Resize from the edges and corners
- Click the traffic light buttons to close, minimize, or maximize
- Open multiple windows simultaneously

Try typing here to see the word count and character count update in real time. The save indicator will appear once you stop typing for a moment.`;

export function NotepadApp() {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [fontSize, setFontSize] = useState('14');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'typing' | 'idle'>('idle');
  const saveTimer = useRef<ReturnType<typeof setTimeout>>();

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setSaveStatus('typing');

    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => setSaveStatus('saved'), 1000);
  }, []);

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-black/10 bg-white/5 backdrop-blur-sm">
        <button
          onClick={() => setIsBold((b) => !b)}
          className={`w-7 h-7 rounded flex items-center justify-center text-white/70 transition-colors ${
            isBold ? 'bg-white/20 text-white' : 'hover:bg-white/10'
          }`}
          title="Bold"
        >
          <Bold className="w-3.5 h-3.5" strokeWidth={2.5} />
        </button>
        <button
          onClick={() => setIsItalic((i) => !i)}
          className={`w-7 h-7 rounded flex items-center justify-center text-white/70 transition-colors ${
            isItalic ? 'bg-white/20 text-white' : 'hover:bg-white/10'
          }`}
          title="Italic"
        >
          <Italic className="w-3.5 h-3.5" strokeWidth={2.5} />
        </button>

        <div className="w-px h-4 bg-white/10 mx-1" />

        <Type className="w-3.5 h-3.5 text-white/40" strokeWidth={1.5} />
        <select
          value={fontSize}
          onChange={(e) => setFontSize(e.target.value)}
          className="bg-white/10 border border-white/15 text-white text-xs rounded px-1.5 py-0.5 outline-none cursor-pointer"
        >
          {['11', '12', '13', '14', '16', '18', '20', '24', '28', '32'].map(
            (s) => (
              <option key={s} value={s} className="bg-gray-800 text-white">
                {s}px
              </option>
            ),
          )}
        </select>

        <div className="flex-1" />

        <span
          className={`text-[10px] transition-opacity duration-300 ${
            saveStatus === 'saved'
              ? 'text-green-400/80 opacity-100'
              : saveStatus === 'typing'
                ? 'text-white/30 opacity-100'
                : 'opacity-0'
          }`}
        >
          {saveStatus === 'saved' ? '✓ Saved' : saveStatus === 'typing' ? 'Editing…' : ''}
        </span>
      </div>

      {/* Editor */}
      <textarea
        value={content}
        onChange={handleChange}
        className="flex-1 w-full p-4 bg-transparent text-white/90 resize-none outline-none"
        style={{
          fontSize: `${fontSize}px`,
          fontWeight: isBold ? 700 : 400,
          fontStyle: isItalic ? 'italic' : 'normal',
          fontFamily: 'ui-monospace, "SF Mono", "Cascadia Code", "Fira Code", Menlo, monospace',
          lineHeight: 1.6,
        }}
        placeholder="Start typing…"
        spellCheck={false}
      />

      {/* Status bar */}
      <div className="flex items-center justify-between px-3 py-1 border-t border-black/10 text-[10px] text-white/40">
        <span>
          {wordCount} {wordCount === 1 ? 'word' : 'words'} · {charCount}{' '}
          {charCount === 1 ? 'character' : 'characters'}
        </span>
        <span>UTF-8 · Plain Text</span>
      </div>
    </div>
  );
}
