export type { VFSNode, StorageAdapter, VFSEvent, VFSConfig } from './types';

export { VirtualFileSystem, createVFS } from './VirtualFileSystem';

export { MemoryAdapter } from './adapters/MemoryAdapter';
export { LocalStorageAdapter, inferMimeType } from './adapters/LocalStorageAdapter';

export { VFSProvider, useVFS } from './hooks/useVFS';
