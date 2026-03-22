import { HashRouter, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { CollectionHomeView } from "@/features/collection-dashboard/CollectionHomeView";
import { CollectionWorkspaceLayout } from "@/features/collection-dashboard/CollectionWorkspaceLayout";
import { CreateRequestView } from "@/features/request-editor/CreateRequestView";
import { RoutePlaceholder } from "@/features/workspace/RoutePlaceholder";

export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route element={<CollectionWorkspaceLayout />}>
            <Route index element={<CollectionHomeView />} />
            <Route path="request" element={<CreateRequestView />} />
          </Route>
          <Route
            path="workspaces"
            element={<RoutePlaceholder title="Workspaces" description="Selector de workspaces (próximamente)." />}
          />
          <Route path="environments" element={<RoutePlaceholder title="Entornos" description="Variables por entorno (próximamente)." />} />
          <Route path="history" element={<RoutePlaceholder title="Historial" description="Actividad reciente (próximamente)." />} />
          <Route path="apis" element={<RoutePlaceholder title="APIs" description="Vista agregada de APIs (próximamente)." />} />
          <Route path="mock-servers" element={<RoutePlaceholder title="Mock servers" description="Servidores mock (próximamente)." />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
