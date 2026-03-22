import { Link } from "react-router-dom";
import styles from "./EmptyCollectionState.module.css";

export function EmptyCollectionState() {
  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.glowPrimary} aria-hidden />
        <div className={styles.glowTertiary} aria-hidden />
        <div className={styles.inner}>
          <div className={styles.iconBox} aria-hidden>
            <span className="material-symbols-outlined">dynamic_form</span>
          </div>
          <h1 className={styles.title}>Orquesta tu colección</h1>
          <p className={styles.desc}>
            Elige un request en el panel lateral para inspeccionarlo, o crea uno nuevo para empezar a probar tu API con
            el backend por índices.
          </p>
          <div className={styles.actions}>
            <Link to="/request" className={styles.actionCard}>
              <span className="material-symbols-outlined">add_box</span>
              <span className={styles.actionTitle}>Crear request</span>
              <span className={styles.actionHint}>Empezar con GET o POST en blanco</span>
            </Link>
            <button type="button" className={styles.actionCard}>
              <span className="material-symbols-outlined">upload_file</span>
              <span className={styles.actionTitle}>Importar definición</span>
              <span className={styles.actionHint}>OpenAPI, Swagger o cURL</span>
            </button>
          </div>
          <p className={styles.footer}>
            <kbd className={styles.kbd}>Ctrl</kbd> + <kbd className={styles.kbd}>N</kbd>
            <span className={styles.footerSep}>·</span>
            <a href="https://tauri.app" className={styles.docLink} target="_blank" rel="noreferrer">
              Documentación
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
