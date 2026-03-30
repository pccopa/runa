import { useState, type CSSProperties } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MethodBadge } from "@/components/ui/MethodBadge";
import type { CollectionTreeNode } from "@/features/collection-dashboard/model/tree";
import { useRequestWorkspace } from "@/features/request-editor/RequestWorkspaceContext";
import styles from "./CollectionTreePanel.module.css";

/** Máscara de guías (solo si `showTreeConnectors`). */
type LineMask = boolean[];

function TreeGuides({ lineMask }: { lineMask: LineMask }) {
  const d = lineMask.length;
  if (d === 0) {
    return null;
  }
  const continues = lineMask.slice(0, -1);
  const branchMid = lineMask[d - 1];
  return (
    <div className={styles.guides} aria-hidden>
      {continues.map((on, k) => (
        <span key={k} className={on ? styles.guideVertOn : styles.guideVertOff} />
      ))}
      <span className={branchMid ? styles.guideJunctionMid : styles.guideJunctionLast} />
    </div>
  );
}

function TreeFolder({
  node,
  depth,
  showTreeConnectors,
  lineMask,
}: {
  node: Extract<CollectionTreeNode, { kind: "folder" }>;
  depth: number;
  showTreeConnectors: boolean;
  lineMask: LineMask;
}) {
  const [open, setOpen] = useState(node.defaultOpen ?? false);

  return (
    <div className={styles.folder}>
      <div
        className={[styles.rowLine, !showTreeConnectors && styles.rowLinePlain].filter(Boolean).join(" ")}
        style={
          !showTreeConnectors
            ? ({ "--tree-plain-depth": String(depth) } as CSSProperties)
            : undefined
        }
      >
        {showTreeConnectors ? <TreeGuides lineMask={lineMask} /> : null}
        <button type="button" className={styles.folderRow} onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          <span className={`material-symbols-outlined ${styles.folderIcon}`}>
            {open ? "folder_open" : "folder"}
          </span>
          <span className={styles.folderLabel}>{node.label}</span>
          <span className={`material-symbols-outlined ${styles.more}`}>more_vert</span>
        </button>
      </div>
      {open && node.children.length > 0 && (
        <div className={styles.children}>
          {node.children.map((child, i) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              showTreeConnectors={showTreeConnectors}
              lineMask={
                showTreeConnectors ? [...lineMask, i !== node.children.length - 1] : []
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TreeRequest({
  node,
  depth,
  showTreeConnectors,
  lineMask,
}: {
  node: Extract<CollectionTreeNode, { kind: "request" }>;
  depth: number;
  showTreeConnectors: boolean;
  lineMask: LineMask;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { openRequestFromTree } = useRequestWorkspace();
  const canOpen = Boolean(node.relativePath?.trim());

  const onActivate = async () => {
    if (!canOpen) return;
    await openRequestFromTree(node);
    if (location.pathname !== "/request") {
      navigate("/request");
    }
  };

  return (
    <div
      className={[styles.rowLine, !showTreeConnectors && styles.rowLinePlain].filter(Boolean).join(" ")}
      style={
        !showTreeConnectors
          ? ({ "--tree-plain-depth": String(depth) } as CSSProperties)
          : undefined
      }
    >
      {showTreeConnectors ? <TreeGuides lineMask={lineMask} /> : null}
      <button
        type="button"
        className={styles.requestRow}
        disabled={!canOpen}
        title={canOpen ? "Abrir request" : "Sin ruta de archivo"}
        onClick={() => void onActivate()}
      >
        <MethodBadge method={node.method} />
        <span className={`mono ${styles.requestPath}`}>{node.path}</span>
      </button>
    </div>
  );
}

function TreeNode({
  node,
  depth,
  showTreeConnectors,
  lineMask,
}: {
  node: CollectionTreeNode;
  depth: number;
  showTreeConnectors: boolean;
  lineMask: LineMask;
}) {
  if (node.kind === "folder") {
    return (
      <TreeFolder
        node={node}
        depth={depth}
        showTreeConnectors={showTreeConnectors}
        lineMask={lineMask}
      />
    );
  }
  return (
    <TreeRequest
      node={node}
      depth={depth}
      showTreeConnectors={showTreeConnectors}
      lineMask={lineMask}
    />
  );
}

export type CollectionTreePanelProps = {
  roots: CollectionTreeNode[];
  /**
   * `true`: conectores ├ └ │.
   * `false` (por defecto): solo sangría, similar al árbol del Explorador de Windows 11.
   */
  showTreeConnectors?: boolean;
};

export function CollectionTreePanel({ roots, showTreeConnectors = false }: CollectionTreePanelProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.scroll}>
        {roots.length === 0 ? (
          <p className={styles.empty}>No hay carpetas ni requests en la colección.</p>
        ) : (
          <div className={styles.scrollInner}>
            {roots.map((node) => (
              <TreeNode
                key={node.id}
                node={node}
                depth={0}
                showTreeConnectors={showTreeConnectors}
                lineMask={[]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
