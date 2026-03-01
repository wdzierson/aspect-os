export interface VFSNode {
  name: string;
  type: 'file' | 'directory';
  path: string;
  parent: string | null;
  content?: string;
  metadata: {
    size?: number;
    created: Date;
    modified: Date;
    accessed: Date;
    permissions: string;
    owner: string;
    mimeType?: string;
  };
  children?: string[];
}

export interface StorageAdapter {
  read(path: string): Promise<VFSNode | null>;
  write(path: string, node: VFSNode): Promise<void>;
  delete(path: string): Promise<void>;
  list(path: string): Promise<string[]>;
  exists(path: string): Promise<boolean>;
  mkdir(path: string): Promise<void>;
}

export interface VFSEvent {
  type: 'created' | 'modified' | 'deleted' | 'moved';
  path: string;
  newPath?: string;
  timestamp: Date;
}

export interface VFSConfig {
  defaultUsername?: string;
  defaultDirectories?: string[];
}
