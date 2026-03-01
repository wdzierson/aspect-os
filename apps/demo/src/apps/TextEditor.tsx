import { useState } from 'react';

export function TextEditor() {
  const [content, setContent] = useState(
    'Welcome to AspectOS TextEdit!\n\nThis is a demo of the OS UI library.\nTry editing this text, opening other apps,\nand dragging windows around the desktop.',
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border/50 bg-muted/30 text-xs text-muted-foreground">
        <span>Untitled.txt</span>
        <span>—</span>
        <span>{content.length} characters</span>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 w-full p-4 bg-background text-foreground text-sm font-mono resize-none outline-none"
        placeholder="Start typing..."
        spellCheck={false}
      />
    </div>
  );
}
