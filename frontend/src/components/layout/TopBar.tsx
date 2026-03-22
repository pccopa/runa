import { Link, useLocation } from "react-router-dom";
import { IconButton } from "@/components/ui/IconButton";
import { TextInput } from "@/components/ui/TextInput";
import styles from "./TopBar.module.css";

function collectionsActive(pathname: string) {
  return pathname === "/" || pathname.startsWith("/request");
}

const topNav: { to: string; label: string; isActive: (pathname: string) => boolean }[] = [
  { to: "/workspaces", label: "Workspaces", isActive: (p) => p.startsWith("/workspaces") },
  { to: "/", label: "Collections", isActive: collectionsActive },
  { to: "/environments", label: "Environments", isActive: (p) => p.startsWith("/environments") },
  { to: "/history", label: "History", isActive: (p) => p.startsWith("/history") },
];

export function TopBar() {
  const { pathname } = useLocation();

  return (
    <header className={styles.bar}>
      <div className={styles.left}>
        <span className={styles.brand}>Runa</span>
        <nav className={styles.nav} aria-label="Secciones principales">
          {topNav.map((item) => {
            const active = item.isActive(pathname);
            return (
              <Link
                key={item.label}
                to={item.to}
                className={[styles.navLink, active && styles.navLinkActive].filter(Boolean).join(" ")}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className={styles.right}>
        <div className={styles.searchWrap}>
          <TextInput
            className={styles.search}
            placeholder="Buscar…"
            aria-label="Buscar en la aplicación"
          />
          <span className={`material-symbols-outlined ${styles.searchIcon}`} aria-hidden>
            search
          </span>
        </div>
        <div className={styles.iconGroup}>
          <IconButton label="Ajustes" icon="settings" />
          <IconButton label="Ayuda" icon="help" />
          <IconButton label="Perfil" icon="account_circle" />
        </div>
      </div>
    </header>
  );
}
