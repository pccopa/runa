import { useId, useState } from "react";
import styles from "./FavoritesPanel.module.css";

export function FavoritesPanel() {
  const [expanded, setExpanded] = useState(true);
  const panelId = useId();
  const headerId = `${panelId}-header`;

  return (
    <section
      className={styles.root}
      aria-labelledby={headerId}
      data-expanded={expanded ? "true" : "false"}
    >
      <button
        id={headerId}
        type="button"
        className={styles.header}
        aria-expanded={expanded}
        aria-controls={expanded ? `${panelId}-body` : undefined}
        onClick={() => setExpanded((v) => !v)}
      >
        <span className={`material-symbols-outlined ${styles.chevron}`} aria-hidden>
          {expanded ? "expand_less" : "expand_more"}
        </span>
        <span className={styles.title}>Favoritos</span>
        <span className={styles.hint} aria-hidden>
          Accesos rápidos
        </span>
      </button>
      {expanded ? (
        <div id={`${panelId}-body`} className={styles.body} role="region" aria-label="Lista de favoritos">
          <p className={styles.empty}>Aún no hay requests favoritos. Los añadiremos aquí cuando estén disponibles.</p>
        </div>
      ) : null}
    </section>
  );
}
