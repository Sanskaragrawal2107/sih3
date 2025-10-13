/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LLAMA_API_KEY: string
  readonly VITE_LLAMA_ORG_ID: string
  readonly VITE_LLAMA_INDEX_NAME: string
  readonly VITE_LLAMA_PROJECT_NAME: string
  readonly VITE_GEMINI_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
