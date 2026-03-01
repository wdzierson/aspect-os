import type { StorageAdapter, VFSNode } from '../types';

export class LocalStorageAdapter implements StorageAdapter {
  private prefix: string;

  constructor(prefix = 'vfs_') {
    this.prefix = prefix;
  }

  private getKey(path: string): string {
    return this.prefix + path;
  }

  async read(path: string): Promise<VFSNode | null> {
    try {
      const data = localStorage.getItem(this.getKey(path));
      if (!data) return null;

      const parsed = JSON.parse(data);
      if (parsed.metadata) {
        parsed.metadata.created = new Date(parsed.metadata.created);
        parsed.metadata.modified = new Date(parsed.metadata.modified);
        parsed.metadata.accessed = new Date(parsed.metadata.accessed);
      }

      return parsed;
    } catch {
      console.warn(`VFS LocalStorageAdapter: failed to read ${path}`);
      return null;
    }
  }

  async write(path: string, node: VFSNode): Promise<void> {
    try {
      localStorage.setItem(this.getKey(path), JSON.stringify(node));
    } catch (error) {
      throw new Error(`Failed to write to localStorage: ${error}`);
    }
  }

  async delete(path: string): Promise<void> {
    localStorage.removeItem(this.getKey(path));
  }

  async list(path: string): Promise<string[]> {
    const keys: string[] = [];
    const pathKey = this.getKey(path);

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(pathKey + '/')) {
        const relativePath = key.substring(this.prefix.length);
        keys.push(relativePath);
      }
    }

    return keys;
  }

  async exists(path: string): Promise<boolean> {
    return localStorage.getItem(this.getKey(path)) !== null;
  }

  async mkdir(_path: string): Promise<void> {
    // Directories are stored as VFSNode entries by the VFS layer
  }
}

/** Infer MIME type from a filename extension. */
export function inferMimeType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();

  switch (ext) {
    case 'txt':  return 'text/plain';
    case 'md':   return 'text/markdown';
    case 'html': return 'text/html';
    case 'css':  return 'text/css';
    case 'js':   return 'text/javascript';
    case 'ts':   return 'text/typescript';
    case 'jsx':  return 'text/jsx';
    case 'tsx':  return 'text/tsx';
    case 'json': return 'application/json';
    case 'xml':  return 'application/xml';
    case 'yaml':
    case 'yml':  return 'application/yaml';
    case 'png':  return 'image/png';
    case 'jpg':
    case 'jpeg': return 'image/jpeg';
    case 'gif':  return 'image/gif';
    case 'svg':  return 'image/svg+xml';
    case 'webp': return 'image/webp';
    case 'mp3':  return 'audio/mpeg';
    case 'm4a':  return 'audio/mp4';
    case 'wav':  return 'audio/wav';
    case 'ogg':  return 'audio/ogg';
    case 'flac': return 'audio/flac';
    case 'mp4':  return 'video/mp4';
    case 'avi':  return 'video/x-msvideo';
    case 'mov':  return 'video/quicktime';
    case 'webm': return 'video/webm';
    case 'pdf':  return 'application/pdf';
    case 'zip':  return 'application/zip';
    default:     return 'application/octet-stream';
  }
}
