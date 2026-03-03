export interface DesktopTextFile {
  name: string;
  content: string;
  type: 'text';
  updatedAt: string;
}

const STORAGE_KEY = 'aspectos-desktop-files';
const EVENT_NAME = 'aspectos-desktop-files-changed';

export function getDesktopFiles(): DesktopTextFile[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as DesktopTextFile[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persist(files: DesktopTextFile[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: files }));
}

export function saveDesktopTextFile(name: string, content: string): DesktopTextFile {
  const normalized = name.endsWith('.txt') ? name : `${name}.txt`;
  const files = getDesktopFiles();
  const next: DesktopTextFile = {
    name: normalized,
    content,
    type: 'text',
    updatedAt: new Date().toISOString(),
  };
  const updated = [...files.filter((f) => f.name !== normalized), next];
  persist(updated);
  return next;
}

export function deleteDesktopFile(name: string): void {
  const files = getDesktopFiles();
  const updated = files.filter((f) => f.name !== name);
  if (updated.length !== files.length) persist(updated);
}

export function subscribeDesktopFiles(
  callback: (files: DesktopTextFile[]) => void,
): () => void {
  const handler = (event: Event) => callback((event as CustomEvent<DesktopTextFile[]>).detail);
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}
