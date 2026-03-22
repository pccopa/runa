import { NavLink, useLocation } from "react-router-dom";
import { useShellLayout } from "@/components/layout/ShellLayoutContext";
import styles from "./PrimarySidebar.module.css";

function collectionsNavActive(pathname: string) {
  return pathname === "/" || pathname.startsWith("/request");
}

const primaryLinks: {
  to: string;
  icon: string;
  label: string;
  isActive?: (pathname: string) => boolean;
}[] = [
  { to: "/", icon: "folder", label: "Collections", isActive: collectionsNavActive },
  { to: "/apis", icon: "api", label: "APIs", isActive: (p) => p.startsWith("/apis") },
  { to: "/environments", icon: "layers", label: "Environments", isActive: (p) => p.startsWith("/environments") },
  { to: "/mock-servers", icon: "dns", label: "Mock servers", isActive: (p) => p.startsWith("/mock-servers") },
  { to: "/history", icon: "history", label: "History", isActive: (p) => p.startsWith("/history") },
];

export function PrimarySidebar() {
  const { pathname } = useLocation();
  const { sidebarCollapsed, toggleSidebar } = useShellLayout();

  return (
    <aside
      className={[styles.aside, sidebarCollapsed && styles.asideCollapsed].filter(Boolean).join(" ")}
      aria-label="Navegación principal"
      aria-expanded={!sidebarCollapsed}
    >
      <div className={styles.toolbar}>
        <button
          type="button"
          className={styles.collapseBtn}
          onClick={toggleSidebar}
          title={sidebarCollapsed ? "Expandir barra lateral" : "Contraer barra lateral"}
          aria-label={sidebarCollapsed ? "Expandir barra lateral" : "Contraer barra lateral"}
        >
          <i
            className={`fa-solid ${sidebarCollapsed ? "fa-angles-right" : "fa-angles-left"}`}
            aria-hidden
          />
        </button>
      </div>
      <div className={styles.brandBlock}>
        <p className={styles.brandEyebrow}>Runa</p>
        <p className={styles.brandTitle}>API Orchestrator</p>
      </div>
      <div className={styles.ctaWrap}>
        <NavLink to="/request" className={styles.cta} title="Nuevo request">
          <span className={`material-symbols-outlined ${styles.ctaIcon}`}>add</span>
          <span className={styles.ctaLabel}>Nuevo request</span>
        </NavLink>
      </div>
      <nav className={styles.nav}>
        {primaryLinks.map((link) => (
          <NavLink
            key={link.label}
            to={link.to}
            title={link.label}
            className={({ isActive }) => {
              const active = link.isActive ? link.isActive(pathname) : isActive;
              return [styles.navItem, active && styles.navItemActive].filter(Boolean).join(" ");
            }}
          >
            <span className={`material-symbols-outlined ${styles.navIcon}`}>{link.icon}</span>
            <span className={styles.navLabel}>{link.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className={styles.profile}>
        <div className={styles.avatar} aria-hidden>
          <span className="material-symbols-outlined">person</span>
        </div>
        <div className={styles.profileText}>
          <span className={styles.profileName}>Usuario local</span>
          <span className={styles.profileRole}>Sin cuenta</span>
        </div>
      </div>
    </aside>
  );
}
