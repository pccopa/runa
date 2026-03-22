import { Outlet } from "react-router-dom";
import { PrimarySidebar } from "@/components/layout/PrimarySidebar";
import { ShellLayoutProvider } from "@/components/layout/ShellLayoutContext";
import { StatusBar } from "@/components/layout/StatusBar";
import { TopBar } from "@/components/layout/TopBar";
import "./layout.css";

export function AppShell() {
  return (
    <ShellLayoutProvider>
      <div className="app-shell">
        <TopBar />
        <div className="app-shell__body">
          <PrimarySidebar />
          <div className="app-shell__workspace">
            <Outlet />
          </div>
        </div>
        <StatusBar />
      </div>
    </ShellLayoutProvider>
  );
}
