import { TextInput } from "@/components/ui/TextInput";
import styles from "./CollectionsToolbar.module.css";

type Props = {
  onRefresh?: () => void;
  refreshDisabled?: boolean;
};

export function CollectionsToolbar({ onRefresh, refreshDisabled }: Props) {
  return (
    <div className={styles.bar}>
      <div className={styles.left}>
        <div className={styles.chip}>
          <span className={`material-symbols-outlined ${styles.chipIcon}`} aria-hidden>
            filter_list
          </span>
          <span className={styles.chipLabel}>Collections</span>
        </div>
        <div className={styles.sep} aria-hidden />
        <TextInput className={styles.filter} placeholder="Filtrar colecciones…" aria-label="Filtrar colecciones" />
      </div>
      <div className={styles.actions}>
        {onRefresh ? (
          <button
            type="button"
            className={styles.textBtn}
            onClick={onRefresh}
            disabled={refreshDisabled}
            title="Volver a leer el árbol desde disco"
          >
            <span className="material-symbols-outlined">refresh</span>
            Actualizar
          </button>
        ) : null}
        <button type="button" className={styles.textBtn}>
          <span className="material-symbols-outlined">create_new_folder</span>
          Nueva carpeta
        </button>
        <button type="button" className={styles.textBtn}>
          <span className="material-symbols-outlined">import_export</span>
          Importar
        </button>
      </div>
    </div>
  );
}
