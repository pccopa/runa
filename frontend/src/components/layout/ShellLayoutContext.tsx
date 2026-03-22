import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type ShellLayoutValue = {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
};

const ShellLayoutContext = createContext<ShellLayoutValue | null>(null);

export function ShellLayoutProvider({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const value = useMemo(
    () => ({
      sidebarCollapsed,
      toggleSidebar: () => setSidebarCollapsed((c) => !c),
    }),
    [sidebarCollapsed],
  );
  return <ShellLayoutContext.Provider value={value}>{children}</ShellLayoutContext.Provider>;
}

export function useShellLayout(): ShellLayoutValue {
  const ctx = useContext(ShellLayoutContext);
  if (!ctx) {
    throw new Error("useShellLayout debe usarse dentro de ShellLayoutProvider");
  }
  return ctx;
}
