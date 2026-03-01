import type { StorageAdapter, VFSNode } from '../types';

export class MemoryAdapter implements StorageAdapter {
  private storage: Map<string, VFSNode> = new Map();

  async read(path: string): Promise<VFSNode | null> {
    const node = this.storage.get(path);
    if (node) {
      node.metadata.accessed = new Date();
    }
    return node || null;
  }

  async write(path: string, node: VFSNode): Promise<void> {
    this.storage.set(path, { ...node });
  }

  async delete(path: string): Promise<void> {
    this.storage.delete(path);
  }

  async list(path: string): Promise<string[]> {
    const keys: string[] = [];
    const pathPrefix = path === '/' ? '/' : path + '/';

    for (const [key] of this.storage) {
      if (key.startsWith(pathPrefix) && key !== path) {
        const relativePath = key.substring(pathPrefix.length);
        if (!relativePath.includes('/')) {
          keys.push(key);
        }
      }
    }

    return keys;
  }

  async exists(path: string): Promise<boolean> {
    return this.storage.has(path);
  }

  async mkdir(_path: string): Promise<void> {
    // Directories are tracked implicitly via VFSNode entries
  }

  clear(): void {
    this.storage.clear();
  }

  size(): number {
    return this.storage.size;
  }
}
