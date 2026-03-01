import { createContext, useContext } from 'react';
import type { VirtualFileSystem } from '../VirtualFileSystem';

const VFSContext = createContext<VirtualFileSystem | null>(null);

export const VFSProvider = VFSContext.Provider;

export function useVFS(): VirtualFileSystem {
  const vfs = useContext(VFSContext);
  if (!vfs) {
    throw new Error('useVFS must be used within a VFSProvider');
  }
  return vfs;
}
