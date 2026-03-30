import type { HttpMethod } from "@/components/ui/MethodBadge";

/** Nodo del árbol de colección: mismo shape que podrá mapearse desde el backend por índices. */
export type CollectionTreeNode =
  | {
      kind: "folder";
      id: string;
      label: string;
      defaultOpen?: boolean;
      children: CollectionTreeNode[];
    }
  | {
      kind: "request";
      id: string;
      method: HttpMethod;
      path: string;
      /** Ruta relativa al directorio del proyecto (segmentos con `/`). */
      relativePath: string;
      /** Orden Runa (`order` en YAML); solo para ordenar en el panel. */
      sortOrder?: number;
    };
