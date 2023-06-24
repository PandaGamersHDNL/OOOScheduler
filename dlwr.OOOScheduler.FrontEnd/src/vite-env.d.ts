/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URI: string,
    readonly VITE_REDIRECT_URI: string,

    readonly VITE_CLIENT_ID: string,
    readonly VITE_TENANT_ID: string,
    readonly VITE_CLIENT_SECRET,
    readonly VITE_SCOPES: string,
    readonly VITE_GRAPH_SCOPES: string,
    readonly VITE_MESSAGE_EXTENTION_ID: string
    // more env variables...
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }