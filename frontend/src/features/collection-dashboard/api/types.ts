/** Espejo de `runa::bridge::CollectionTreeDto` (serde camelCase). */
export type CollectionNodeType = "directory" | "file";

export type CollectionNodeDto = {
  index: number;
  parent: number | null;
  children: number[];
  nodeType: CollectionNodeType;
  filename: string;
  displayName?: string;
  order?: number;
  method?: string;
  /** Ruta relativa al proyecto; solo `file`. */
  relativePath?: string;
};

export type CollectionTreeDto = {
  rootPath: string;
  nodes: CollectionNodeDto[];
};
