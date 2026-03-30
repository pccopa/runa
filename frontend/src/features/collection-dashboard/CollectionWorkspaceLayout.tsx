import { useCallback, useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { CollectionTreePanel } from "@/features/collection-dashboard/CollectionTreePanel";
import { CollectionsToolbar } from "@/features/collection-dashboard/CollectionsToolbar";
import { FavoritesPanel } from "@/features/collection-dashboard/FavoritesPanel";
import { useCollectionTree } from "@/features/collection-dashboard/hooks/useCollectionTree";
import { RequestWorkspaceProvider } from "@/features/request-editor/RequestWorkspaceContext";
import styles from "./CollectionDashboardView.module.css";

const TREE_DEFAULT_PX = 280;
const TREE_MIN_PX = 160;
const TREE_MAX_RATIO = 0.72;

function resolveShowTreeConnectors(explicit?: boolean) {
  if (explicit !== undefined) {
    return explicit;
  }
  return import.meta.env.VITE_SHOW_TREE_CONNECTORS === "true";
}

export type CollectionWorkspaceLayoutProps = {
  showTreeConnectors?: boolean;
};

/** Árbol de colección + panel principal; el contenido derecho va en rutas anidadas (`<Outlet />`). */
export function CollectionWorkspaceLayout({ showTreeConnectors: showLinesProp }: CollectionWorkspaceLayoutProps = {}) {
  const { roots, rootPath, loading, error, reload } = useCollectionTree();
  const showTreeConnectors = resolveShowTreeConnectors(showLinesProp);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const [treeWidth, setTreeWidth] = useState(TREE_DEFAULT_PX);
  const dragging = useRef(false);

  const onResizeMove = useCallback((e: MouseEvent) => {
    if (!dragging.current || !workspaceRef.current) {
      return;
    }
    const r = workspaceRef.current.getBoundingClientRect();
    const next = e.clientX - r.left;
    const max = Math.max(TREE_MIN_PX + 100, r.width * TREE_MAX_RATIO);
    setTreeWidth(Math.min(Math.max(TREE_MIN_PX, next), max));
  }, []);

  const onResizeEnd = useCallback(() => {
    if (!dragging.current) {
      return;
    }
    dragging.current = false;
    document.body.style.removeProperty("user-select");
    document.body.style.removeProperty("cursor");
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onResizeMove);
    window.addEventListener("mouseup", onResizeEnd);
    return () => {
      window.removeEventListener("mousemove", onResizeMove);
      window.removeEventListener("mouseup", onResizeEnd);
    };
  }, [onResizeMove, onResizeEnd]);

  const onResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";
  };

  return (
    <RequestWorkspaceProvider projectPath={rootPath}>
    <div className={styles.root}>
      <CollectionsToolbar onRefresh={reload} refreshDisabled={loading} />
      {rootPath ? (
        <p className={styles.pathHint} title={rootPath}>
          Proyecto: {rootPath}
        </p>
      ) : null}
      {error ? (
        <div className={`${styles.banner} ${styles.bannerError}`} role="status">
          {error}
        </div>
      ) : null}
      {loading ? (
        <div className={`${styles.banner} ${styles.bannerLoading}`} role="status">
          Cargando colección…
        </div>
      ) : null}
      <div className={styles.workspace} ref={workspaceRef}>
        <div className={styles.treeColumn} style={{ width: treeWidth }}>
          <FavoritesPanel />
          <div className={styles.treeColumnTree}>
            <CollectionTreePanel roots={roots} showTreeConnectors={showTreeConnectors} />
          </div>
        </div>
        <div
          className={styles.resizeHandle}
          role="separator"
          aria-orientation="vertical"
          aria-label="Redimensionar panel del árbol"
          title="Arrastrar para cambiar el ancho"
          onMouseDown={onResizeStart}
        />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
    </RequestWorkspaceProvider>
  );
}
