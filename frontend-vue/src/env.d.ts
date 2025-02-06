/// <reference types="@vue/runtime-core" />

declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}

declare module 'process' {
    global {
        namespace NodeJS {
            interface ProcessEnv {
                NODE_ENV: 'development' | 'production'
            }
        }
    }
}

interface ImportMetaEnv {
    readonly VITE_API_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
