/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly PONG_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
