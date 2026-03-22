import styles from "./StatusBar.module.css";

export function StatusBar() {
  return (
    <footer className={styles.bar} role="contentinfo">
      <div className={styles.segment}>
        <span className={styles.label}>Entorno</span>
        <span className={styles.value}>
          <span className={`material-symbols-outlined ${styles.globe}`} aria-hidden>
            public
          </span>
          Production
        </span>
      </div>
      <div className={styles.divider} aria-hidden />
      <div className={styles.segment}>
        <span className={styles.label}>Última latencia</span>
        <span className={styles.value}>
          <span className={`material-symbols-outlined ${styles.chart}`} aria-hidden>
            bar_chart
          </span>
          — ms
        </span>
      </div>
      <div className={styles.spacer} />
      <div className={styles.pill}>
        <span className={styles.dot} aria-hidden />
        Sistema en línea
      </div>
      <span className={styles.version}>Runa 0.1.0</span>
    </footer>
  );
}
