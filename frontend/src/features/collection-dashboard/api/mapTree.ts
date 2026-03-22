import type { HttpMethod } from "@/components/ui/MethodBadge";
import type { CollectionTreeDto } from "@/features/collection-dashboard/api/types";
import type { CollectionTreeNode } from "@/features/collection-dashboard/model/tree";

function parseMethod(raw: string | undefined): HttpMethod {
  const u = (raw ?? "GET").toUpperCase();
  const allowed: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"];
  return (allowed.includes(u as HttpMethod) ? u : "GET") as HttpMethod;
}

function sortFolderChildren(children: CollectionTreeNode[]) {
  children.sort((a, b) => {
    if (a.kind === "folder" && b.kind === "folder") {
      return a.label.localeCompare(b.label, undefined, { sensitivity: "base" });
    }
    if (a.kind === "folder") {
      return -1;
    }
    if (b.kind === "folder") {
      return 1;
    }
    const ao = a.sortOrder ?? 0;
    const bo = b.sortOrder ?? 0;
    if (ao !== bo) {
      return ao - bo;
    }
    return a.path.localeCompare(b.path, undefined, { sensitivity: "base" });
  });
}

/**
 * Reconstruye el árbol anidado de la UI a partir del listado plano por índices del backend.
 */
export function flatDtoToCollectionRoots(dto: CollectionTreeDto): CollectionTreeNode[] {
  if (dto.nodes.length === 0) {
    return [];
  }

  const folders = new Map<number, Extract<CollectionTreeNode, { kind: "folder" }>>();
  const requests = new Map<number, Extract<CollectionTreeNode, { kind: "request" }>>();

  for (const n of dto.nodes) {
    if (n.nodeType === "directory") {
      folders.set(n.index, {
        kind: "folder",
        id: `dir-${n.index}`,
        label: n.filename,
        defaultOpen: true,
        children: [],
      });
    } else {
      requests.set(n.index, {
        kind: "request",
        id: `file-${n.index}`,
        method: parseMethod(n.method),
        path: n.displayName ?? n.filename,
        sortOrder: n.order,
      });
    }
  }

  for (const n of dto.nodes) {
    if (n.nodeType !== "directory") {
      continue;
    }
    const folder = folders.get(n.index);
    if (!folder) {
      continue;
    }
    for (const c of n.children) {
      const sub = folders.get(c);
      const req = requests.get(c);
      if (sub) {
        folder.children.push(sub);
      } else if (req) {
        folder.children.push(req);
      }
    }
    sortFolderChildren(folder.children);
  }

  const roots = dto.nodes
    .filter((n) => n.parent == null)
    .sort((a, b) => a.index - b.index)
    .map((n) => folders.get(n.index) ?? requests.get(n.index))
    .filter((x): x is CollectionTreeNode => x != null);

  return roots;
}
