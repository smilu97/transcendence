/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PONG_URL?: string;
  readonly VITE_PONG_WS_URL?: string;
  readonly VITE_PONG_CONTEXT_TYPE?: 'http' | 'memory';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
