import { useState, useRef, useEffect, useCallback } from 'react';

interface Line {
  type: 'input' | 'output' | 'error';
  text: string;
}

const WELCOME = `AspectOS Terminal v1.0.0
Type "help" for available commands.
`;

function processCommand(cmd: string, cwd: string, setCwd: (d: string) => void): { output: string; isError?: boolean } {
  const parts = cmd.trim().split(/\s+/);
  const base = parts[0]?.toLowerCase() ?? '';
  const args = parts.slice(1).join(' ');

  switch (base) {
    case '':
      return { output: '' };
    case 'help':
      return { output: `Available commands:
  help          Show this help message
  ls [-la]      List directory contents
  cd <dir>      Change directory
  pwd           Print working directory
  whoami        Print current user
  date          Print current date/time
  echo <text>   Echo text
  cat <file>    Display file contents
  clear         Clear terminal
  uname -a      System information
  top           Show running processes
  neofetch      System info with ASCII art
  ping <host>   Ping a host
  git status    Show git status
  node -v       Node.js version
  npm -v        npm version
  python3 --version  Python version` };
    case 'ls':
      if (args.includes('-la') || args.includes('-l')) {
        return { output: `total 48
drwxr-xr-x  8 user  staff   256 Mar  1 12:00 .
drwxr-xr-x  5 root  admin   160 Mar  1 09:00 ..
drwx------  4 user  staff   128 Mar  1 11:30 Desktop
drwx------  6 user  staff   192 Mar  1 10:15 Documents
drwx------  3 user  staff    96 Mar  1 09:45 Downloads
drwx------  5 user  staff   160 Mar  1 08:00 Music
drwx------  4 user  staff   128 Mar  1 11:00 Pictures
drwxr-xr-x  3 user  staff    96 Mar  1 12:00 Applications` };
      }
      return { output: 'Desktop     Documents   Downloads   Music       Pictures    Applications' };
    case 'cd': {
      const dir = args || '~';
      setCwd(dir === '~' ? '~' : dir.startsWith('/') ? dir : `${cwd === '~' ? '~' : cwd}/${dir}`);
      return { output: '' };
    }
    case 'pwd':
      return { output: cwd === '~' ? '/Users/user' : cwd };
    case 'whoami':
      return { output: 'user' };
    case 'date':
      return { output: new Date().toString() };
    case 'echo':
      return { output: args };
    case 'cat':
      if (args.includes('readme') || args.includes('README')) {
        return { output: `# AspectOS
A reusable macOS-style windowed OS experience for the browser.
Built with React, TypeScript, Tailwind CSS, and Zustand.

Packages:
  @aspect/os-core   — Headless window manager, app registry, event bus
  @aspect/os-ui     — React components (windows, desktop, menus, dialogs)
  @aspect/os-theme  — Design tokens, CSS variables, Tailwind preset
  @aspect/os-vfs    — Optional virtual file system` };
      }
      return { output: `cat: ${args || '(no file)'}: No such file or directory`, isError: true };
    case 'clear':
      return { output: '__CLEAR__' };
    case 'uname':
      return { output: 'AspectOS 1.0.0 Darwin Kernel Version 24.0.0 arm64' };
    case 'top':
      return { output: `PID    CPU%   MEM%   NAME
1      0.1    2.3    kernel_task
42     1.2    8.4    WindowServer
128    0.8    5.1    aspectos-desktop
256    0.3    3.2    Messages
512    0.0    1.8    Terminal
1024   0.5    4.6    ComponentShowcase` };
    case 'neofetch': {
      const w = typeof window !== 'undefined' ? window.innerWidth : 1920;
      const h = typeof window !== 'undefined' ? window.innerHeight : 1080;
      return { output: `
       .:'          user@aspect-os
      .:'           ─────────────────
    .:'             OS:         AspectOS 1.0.0
  .:'  ::::::::     Host:       Browser Runtime
 :'  ::::::::::     Kernel:     React 18.3.1
 :  ::::::::::::    Shell:      aspect-sh 1.0
 :  ::::::::::::    Resolution: ${w}x${h}
 :  ::::::::::::    Terminal:   AspectOS Terminal
  :  ::::::::::     CPU:        WebAssembly Virtual Core
   ':  ::::::::     Memory:     128MB / 512MB
    ':.             Packages:   4 (npm)
      ':.           Theme:      AspectOS Modern
        ':.
` };
    }
    case 'ping': {
      const host = args || 'localhost';
      const pings = Array.from({ length: 4 }, (_, i) => {
        const ms = (20 + Math.random() * 60).toFixed(1);
        return `64 bytes from ${host}: icmp_seq=${i} ttl=64 time=${ms} ms`;
      });
      return { output: `PING ${host}: 56 data bytes\n${pings.join('\n')}\n\n--- ${host} ping statistics ---\n4 packets transmitted, 4 packets received, 0.0% packet loss` };
    }
    case 'git':
      if (args === 'status') {
        return { output: "On branch main\nnothing to commit, working tree clean" };
      }
      return { output: `git: '${args}' is not a git command.`, isError: true };
    case 'node':
      return { output: 'v20.0.0' };
    case 'npm':
      return { output: '10.0.0' };
    case 'python3':
      return { output: 'Python 3.12.0' };
    case 'curl':
      return { output: "curl: try 'curl --help' for more information", isError: true };
    default:
      return { output: `${base}: command not found`, isError: true };
  }
}

export function TerminalApp() {
  const [history, setHistory] = useState<Line[]>([{ type: 'output', text: WELCOME }]);
  const [input, setInput] = useState('');
  const [cwd, setCwd] = useState('~');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [history]);

  const submit = useCallback(() => {
    const trimmed = input.trim();
    const prompt = `user@aspect-os ${cwd} % `;
    setHistory((h) => [...h, { type: 'input', text: prompt + trimmed }]);

    if (trimmed) {
      setCmdHistory((h) => [trimmed, ...h]);
      setHistIdx(-1);

      const { output, isError } = processCommand(trimmed, cwd, setCwd);
      if (output === '__CLEAR__') {
        setHistory([]);
      } else if (output) {
        setHistory((h) => [...h, { type: isError ? 'error' : 'output', text: output }]);
      }
    }
    setInput('');
  }, [input, cwd]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        submit();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (cmdHistory.length > 0) {
          const next = Math.min(histIdx + 1, cmdHistory.length - 1);
          setHistIdx(next);
          setInput(cmdHistory[next]);
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (histIdx > 0) {
          const next = histIdx - 1;
          setHistIdx(next);
          setInput(cmdHistory[next]);
        } else {
          setHistIdx(-1);
          setInput('');
        }
      } else if (e.key === 'l' && e.ctrlKey) {
        e.preventDefault();
        setHistory([]);
      }
    },
    [submit, cmdHistory, histIdx],
  );

  const prompt = `user@aspect-os ${cwd} % `;

  return (
    <div
      className="h-full flex flex-col font-mono text-sm select-text cursor-text"
      style={{ background: '#1e1e2e', color: '#cdd6f4' }}
      onClick={() => inputRef.current?.focus()}
    >
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 pb-0">
        {history.map((line, i) => (
          <pre
            key={i}
            className="whitespace-pre-wrap break-words leading-relaxed"
            style={{
              color: line.type === 'input' ? '#cdd6f4' : line.type === 'error' ? '#f38ba8' : '#bac2de',
            }}
          >
            {line.type === 'input' ? (
              <>
                <span style={{ color: '#a6e3a1' }}>{line.text.split(' % ')[0]} % </span>
                <span>{line.text.split(' % ').slice(1).join(' % ')}</span>
              </>
            ) : (
              line.text
            )}
          </pre>
        ))}

        {/* Active prompt */}
        <div className="flex items-center leading-relaxed">
          <span style={{ color: '#a6e3a1' }}>{prompt}</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none caret-[#a6e3a1]"
            style={{ color: '#cdd6f4', caretColor: '#a6e3a1' }}
            autoFocus
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
