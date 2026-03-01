/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DARK_MODE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
