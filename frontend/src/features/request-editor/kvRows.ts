export type KvRow = { id: string; key: string; value: string; active: boolean };

export function newKvRow(): KvRow {
  return { id: crypto.randomUUID(), key: "", value: "", active: true };
}

export function rowHasContent(row: KvRow): boolean {
  return row.key.trim() !== "" || row.value.trim() !== "";
}

/** Mantiene una fila vacía al final cuando la última fila tiene datos. */
export function applyKvPatch(rows: KvRow[], id: string, patch: Partial<KvRow>): KvRow[] {
  let next = rows.map((r) => (r.id === id ? { ...r, ...patch } : r));
  while (next.length >= 2 && !rowHasContent(next[next.length - 1]) && !rowHasContent(next[next.length - 2])) {
    next = next.slice(0, -1);
  }
  const last = next[next.length - 1];
  if (last && rowHasContent(last)) {
    next = [...next, newKvRow()];
  }
  return next;
}
