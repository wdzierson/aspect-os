import type { VFSNode, StorageAdapter, VFSEvent, VFSConfig } from './types';

const calculateFileSize = (content: string, mimeType?: string): number => {
  if (!content) return 0;

  if (mimeType?.startsWith('image/')) {
    const base64String = content.replace(/^data:image\/[a-z]+;base64,/, '');
    if (base64String.length === 0) return 0;
    const padding = (base64String.match(/=/g) || []).length;
    return Math.floor((base64String.length * 3) / 4) - padding;
  }

  return new Blob([content]).size;
};

export class VirtualFileSystem {
  private adapters: Map<string, StorageAdapter> = new Map();
  private mountPoints: Map<string, string> = new Map();
  private listeners: Map<string, (event: VFSEvent) => void> = new Map();
  private cache: Map<string, VFSNode> = new Map();
  private currentUsername: string;
  private defaultDirectories: string[];

  constructor(config?: VFSConfig) {
    this.currentUsername = config?.defaultUsername ?? 'user';
    this.defaultDirectories = config?.defaultDirectories ?? [
      'Desktop', 'Documents', 'Downloads', 'Music', 'Pictures', 'Videos',
    ];
  }

  // ── User management ──────────────────────────────────────────────

  setCurrentUser(username: string): void {
    this.currentUsername = username;
  }

  getCurrentUser(): string {
    return this.currentUsername;
  }

  // ── Adapter management ───────────────────────────────────────────

  registerAdapter(name: string, adapter: StorageAdapter): void {
    this.adapters.set(name, adapter);
  }

  mount(path: string, adapterName: string): void {
    if (!this.adapters.has(adapterName)) {
      throw new Error(`Adapter "${adapterName}" not registered`);
    }
    this.mountPoints.set(path, adapterName);
  }

  async initializeAfterMount(): Promise<void> {
    await this.initializeFileSystem();
  }

  // ── Path utilities ───────────────────────────────────────────────

  normalizePath(path: string): string {
    if (!path.startsWith('/')) {
      path = '/' + path;
    }

    const parts = path.split('/').filter(part => part && part !== '.');
    const normalized: string[] = [];

    for (const part of parts) {
      if (part === '..') {
        normalized.pop();
      } else {
        normalized.push(part);
      }
    }

    return '/' + normalized.join('/');
  }

  dirname(path: string): string {
    const normalized = this.normalizePath(path);
    const lastSlash = normalized.lastIndexOf('/');
    return lastSlash <= 0 ? '/' : normalized.substring(0, lastSlash);
  }

  basename(path: string): string {
    const normalized = this.normalizePath(path);
    return normalized.substring(normalized.lastIndexOf('/') + 1);
  }

  join(...paths: string[]): string {
    return this.normalizePath(paths.join('/'));
  }

  // ── Core file operations ─────────────────────────────────────────

  async read(path: string): Promise<VFSNode | null> {
    const normalizedPath = this.normalizePath(path);

    if (this.cache.has(normalizedPath)) {
      const cached = this.cache.get(normalizedPath)!;
      cached.metadata.accessed = new Date();
      return cached;
    }

    const adapter = this.getAdapter(normalizedPath);
    if (!adapter) return null;

    const node = await adapter.read(normalizedPath);
    if (node) {
      this.cache.set(normalizedPath, node);
    }

    return node;
  }

  async write(path: string, content: string, mimeType?: string): Promise<void> {
    const normalizedPath = this.normalizePath(path);
    const parentPath = this.dirname(normalizedPath);

    await this.ensureDirectory(parentPath);

    const adapter = this.getAdapter(normalizedPath);
    if (!adapter) {
      throw new Error(`No adapter available for path: ${normalizedPath}`);
    }

    const existing = await adapter.read(normalizedPath);
    const now = new Date();
    const fileSize = calculateFileSize(content, mimeType);

    const node: VFSNode = {
      name: this.basename(normalizedPath),
      type: 'file',
      path: normalizedPath,
      parent: parentPath,
      content,
      metadata: {
        size: fileSize,
        created: existing?.metadata.created || now,
        modified: now,
        accessed: now,
        permissions: '644',
        owner: this.currentUsername,
        mimeType: mimeType || 'text/plain',
      },
    };

    await adapter.write(normalizedPath, node);
    this.cache.set(normalizedPath, node);

    await this.addToDirectory(parentPath, normalizedPath);

    this.emitEvent({
      type: existing ? 'modified' : 'created',
      path: normalizedPath,
      timestamp: now,
    });
  }

  async delete(path: string): Promise<void> {
    const normalizedPath = this.normalizePath(path);
    const adapter = this.getAdapter(normalizedPath);

    if (!adapter) {
      throw new Error(`No adapter available for path: ${normalizedPath}`);
    }

    const node = await adapter.read(normalizedPath);
    if (!node) return;

    if (node.type === 'directory' && node.children) {
      for (const childPath of node.children) {
        await this.delete(childPath);
      }
    }

    await adapter.delete(normalizedPath);
    this.cache.delete(normalizedPath);

    if (node.parent) {
      await this.removeFromDirectory(node.parent, normalizedPath);

      const parentNode = this.cache.get(node.parent);
      const parentAdapter = this.getAdapter(node.parent);
      if (parentNode && parentAdapter) {
        await parentAdapter.write(node.parent, parentNode);
      }
    }

    this.emitEvent({
      type: 'deleted',
      path: normalizedPath,
      timestamp: new Date(),
    });
  }

  async mkdir(path: string): Promise<void> {
    const normalizedPath = this.normalizePath(path);
    const adapter = this.getAdapter(normalizedPath);

    if (!adapter) {
      throw new Error(`No adapter available for path: ${normalizedPath}`);
    }

    if (await adapter.exists(normalizedPath)) return;

    const parentPath = this.dirname(normalizedPath);
    if (parentPath !== '/' && parentPath !== normalizedPath) {
      await this.ensureDirectory(parentPath);
    }

    const now = new Date();
    const node: VFSNode = {
      name: this.basename(normalizedPath),
      type: 'directory',
      path: normalizedPath,
      parent: parentPath,
      children: [],
      metadata: {
        created: now,
        modified: now,
        accessed: now,
        permissions: '755',
        owner: this.currentUsername,
      },
    };

    await adapter.write(normalizedPath, node);
    this.cache.set(normalizedPath, node);

    if (parentPath !== normalizedPath) {
      await this.addToDirectory(parentPath, normalizedPath);
    }

    this.emitEvent({
      type: 'created',
      path: normalizedPath,
      timestamp: now,
    });
  }

  async list(path: string): Promise<VFSNode[]> {
    const normalizedPath = this.normalizePath(path);
    const adapter = this.getAdapter(normalizedPath);
    if (!adapter) return [];

    const dir = await adapter.read(normalizedPath);
    if (!dir || dir.type !== 'directory') return [];

    const children: VFSNode[] = [];
    if (dir.children) {
      for (const childPath of dir.children) {
        const fullPath = childPath.startsWith('/')
          ? childPath
          : this.join(normalizedPath, childPath);
        const child = await this.read(fullPath);
        if (child) children.push(child);
      }
    }

    return children.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  }

  async exists(path: string): Promise<boolean> {
    const normalizedPath = this.normalizePath(path);
    const adapter = this.getAdapter(normalizedPath);
    if (!adapter) return false;
    return adapter.exists(normalizedPath);
  }

  // ── Event system ─────────────────────────────────────────────────

  subscribe(id: string, callback: (event: VFSEvent) => void): void {
    this.listeners.set(id, callback);
  }

  unsubscribe(id: string): void {
    this.listeners.delete(id);
  }

  // ── Convenience: desktop shortcuts ───────────────────────────────

  async getDesktopFiles(): Promise<VFSNode[]> {
    return this.list(`/Users/${this.currentUsername}/Desktop`);
  }

  async saveToDesktop(filename: string, content: string): Promise<void> {
    await this.write(
      this.join(`/Users/${this.currentUsername}/Desktop`, filename),
      content,
    );
  }

  async deleteFromDesktop(filename: string): Promise<void> {
    await this.delete(
      this.join(`/Users/${this.currentUsername}/Desktop`, filename),
    );
  }

  // ── Private helpers ──────────────────────────────────────────────

  private getAdapter(path: string): StorageAdapter | null {
    const normalizedPath = this.normalizePath(path);

    let bestMatch = '';
    let adapterName = '';

    for (const [mountPath, name] of this.mountPoints) {
      if (normalizedPath.startsWith(mountPath) && mountPath.length > bestMatch.length) {
        bestMatch = mountPath;
        adapterName = name;
      }
    }

    if (adapterName) {
      return this.adapters.get(adapterName) || null;
    }

    // Fall back to first registered adapter
    return this.adapters.values().next().value ?? null;
  }

  private async initializeFileSystem(): Promise<void> {
    const userPath = `/Users/${this.currentUsername}`;
    const userDirs = this.defaultDirectories.map(d => `${userPath}/${d}`);

    const standardDirs = [
      { path: '/', children: ['/Users'] },
      { path: '/Users', children: [userPath] },
      { path: userPath, children: userDirs },
      ...userDirs.map(d => ({ path: d, children: [] as string[] })),
    ];

    const now = new Date();
    for (const dir of standardDirs) {
      this.cache.set(dir.path, {
        name: this.basename(dir.path),
        type: 'directory',
        path: dir.path,
        parent: this.dirname(dir.path),
        children: dir.children,
        metadata: {
          created: now,
          modified: now,
          accessed: now,
          permissions: '755',
          owner: dir.path.startsWith(userPath) ? this.currentUsername : 'root',
        },
      });
    }

    for (const dir of standardDirs) {
      await this.ensureDirectory(dir.path);
    }

    // Persist root with its children list
    const rootAdapter = this.getAdapter('/');
    const rootNode = this.cache.get('/');
    if (rootAdapter && rootNode) {
      await rootAdapter.write('/', rootNode);
    }
  }

  private async ensureDirectory(path: string): Promise<void> {
    if (await this.exists(path)) return;
    await this.mkdir(path);
  }

  private async addToDirectory(dirPath: string, childPath: string): Promise<void> {
    const adapter = this.getAdapter(dirPath);
    if (!adapter) return;

    const dir = await adapter.read(dirPath);
    if (!dir || dir.type !== 'directory') return;

    if (!dir.children) dir.children = [];

    if (!dir.children.includes(childPath)) {
      dir.children = [...dir.children, childPath];
      dir.metadata.modified = new Date();
      await adapter.write(dirPath, dir);
      this.cache.set(dirPath, dir);
    }
  }

  private async removeFromDirectory(dirPath: string, childPath: string): Promise<void> {
    const dir = await this.read(dirPath);
    if (!dir || dir.type !== 'directory' || !dir.children) return;

    dir.children = dir.children.filter(p => p !== childPath);
    dir.metadata.modified = new Date();

    const adapter = this.getAdapter(dirPath);
    if (adapter) {
      await adapter.write(dirPath, dir);
      this.cache.set(dirPath, dir);
    }
  }

  private emitEvent(event: VFSEvent): void {
    this.listeners.forEach(callback => callback(event));
  }
}

/** Create a VirtualFileSystem instance with optional configuration. */
export function createVFS(config?: VFSConfig): VirtualFileSystem {
  return new VirtualFileSystem(config);
}
