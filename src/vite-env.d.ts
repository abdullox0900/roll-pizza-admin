/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // boshqa muhit o'zgaruvchilarini ham shu yerda e'lon qilishingiz mumkin
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
