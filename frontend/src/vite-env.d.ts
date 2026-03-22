/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Ruta absoluta al directorio del proyecto Runa (debe contener `.runa`). Solo desarrollo / pruebas. */
  readonly VITE_RUNA_PROJECT?: string;
  /** `true` para mostrar líneas ├└│ en el árbol de colección (por defecto: solo sangría estilo Win11). */
  readonly VITE_SHOW_TREE_CONNECTORS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}
