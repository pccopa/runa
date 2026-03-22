import type { KvRow } from "./kvRows";
import styles from "./CreateRequestView.module.css";

type Props = {
  rows: KvRow[];
  onChange: (id: string, patch: Partial<KvRow>) => void;
  valueAccentWhen: string | null;
};

export function KeyValueTable({ rows, onChange, valueAccentWhen }: Props) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
            <th className={styles.checkCell}>Active</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>
                <input
                  className={styles.cellInput}
                  value={row.key}
                  placeholder="New Key"
                  onChange={(e) => onChange(row.id, { key: e.target.value })}
                />
              </td>
              <td>
                <input
                  className={
                    valueAccentWhen !== null && row.value === valueAccentWhen
                      ? `${styles.cellInput} ${styles.cellInputValueAccent}`
                      : styles.cellInput
                  }
                  value={row.value}
                  placeholder="Value"
                  onChange={(e) => onChange(row.id, { value: e.target.value })}
                />
              </td>
              <td className={styles.checkCell}>
                <input
                  type="checkbox"
                  className={styles.check}
                  checked={row.active}
                  onChange={(e) => onChange(row.id, { active: e.target.checked })}
                  aria-label={`Activo: ${row.key || "fila"}`}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
