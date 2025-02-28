declare module '*.json' {
  const value: any;
  export default value;
}

interface ImportMetaEnv {
  BASE_URL: string
  VUE_APP_API_URL: string
  NODE_ENV: 'development' | 'production' | 'test'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// process.env 타입 확장
interface ProcessEnv {
  NODE_ENV: string
  VUE_APP_API_URL?: string
  VUE_APP_TITLE?: string
  BASE_URL: string
}

declare namespace NodeJS {
  interface ProcessEnv extends ProcessEnv {}
}
