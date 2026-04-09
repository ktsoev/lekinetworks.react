/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the LEKI site API proxy (no trailing slash), e.g. https://api.leki.example.com */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
