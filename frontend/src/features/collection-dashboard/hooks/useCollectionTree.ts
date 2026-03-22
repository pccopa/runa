import { useCallback, useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { flatDtoToCollectionRoots } from "@/features/collection-dashboard/api/mapTree";
import type { CollectionTreeDto } from "@/features/collection-dashboard/api/types";
import type { CollectionTreeNode } from "@/features/collection-dashboard/model/tree";

function resolveProjectPath(): string {
  const fromEnv = import.meta.env.VITE_RUNA_PROJECT?.trim();
  if (fromEnv) {
    return fromEnv;
  }
  return "";
}

export function useCollectionTree() {
  const [roots, setRoots] = useState<CollectionTreeNode[]>([]);
  const [rootPath, setRootPath] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (projectPath: string) => {
    if (!projectPath) {
      setRoots([]);
      setRootPath("");
      setError("Define la ruta del proyecto Runa (variable de entorno VITE_RUNA_PROJECT o diálogo futuro).");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const dto = await invoke<CollectionTreeDto>("load_collection_tree", { projectPath });
      setRootPath(dto.rootPath);
      setRoots(flatDtoToCollectionRoots(dto));
    } catch (e) {
      setRoots([]);
      setRootPath("");
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(resolveProjectPath());
  }, [load]);

  return {
    roots,
    rootPath,
    loading,
    error,
    reload: () => load(resolveProjectPath()),
  };
}
