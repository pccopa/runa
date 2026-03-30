import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import { invoke } from "@tauri-apps/api/core";
import type { RequestFileDto } from "@/features/collection-dashboard/api/requestTypes";
import type { CollectionTreeNode } from "@/features/collection-dashboard/model/tree";
import { requestFileDtoToSnapshot } from "./mapRequestFileDto";
import type { RequestEditorSnapshot, RequestTab } from "./requestWorkspaceTypes";
import { emptyRequestSnapshot } from "./requestWorkspaceTypes";

type State = {
  tabs: RequestTab[];
  activeTabId: string | null;
  openError: string | null;
};

type Action =
  | {
      type: "OPEN_OR_FOCUS";
      payload: { fileKey: string; title: string; snapshot: RequestEditorSnapshot };
    }
  | { type: "SELECT_TAB"; tabId: string }
  | { type: "CLOSE_TAB"; tabId: string }
  | { type: "UPDATE_ACTIVE"; updater: (s: RequestEditorSnapshot) => RequestEditorSnapshot }
  | { type: "CLEAR_OPEN_ERROR" }
  | { type: "SET_OPEN_ERROR"; message: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "OPEN_OR_FOCUS": {
      const { fileKey, title, snapshot } = action.payload;
      const existing = state.tabs.find((t) => t.fileKey === fileKey);
      if (existing) {
        return { ...state, activeTabId: existing.id, openError: null };
      }
      const id = crypto.randomUUID();
      return {
        ...state,
        tabs: [...state.tabs, { id, fileKey, title, snapshot }],
        activeTabId: id,
        openError: null,
      };
    }
    case "SELECT_TAB":
      return state.tabs.some((t) => t.id === action.tabId)
        ? { ...state, activeTabId: action.tabId }
        : state;
    case "CLOSE_TAB": {
      const idx = state.tabs.findIndex((t) => t.id === action.tabId);
      if (idx < 0) return state;
      const tabs = state.tabs.filter((t) => t.id !== action.tabId);
      let activeTabId = state.activeTabId;
      if (activeTabId === action.tabId) {
        if (tabs.length === 0) {
          activeTabId = null;
        } else if (idx >= tabs.length) {
          activeTabId = tabs[tabs.length - 1]!.id;
        } else {
          activeTabId = tabs[idx]!.id;
        }
      }
      return { ...state, tabs, activeTabId };
    }
    case "UPDATE_ACTIVE": {
      if (!state.activeTabId) return state;
      return {
        ...state,
        tabs: state.tabs.map((t) =>
          t.id === state.activeTabId ? { ...t, snapshot: action.updater(t.snapshot) } : t,
        ),
      };
    }
    case "CLEAR_OPEN_ERROR":
      return { ...state, openError: null };
    case "SET_OPEN_ERROR":
      return { ...state, openError: action.message };
    default:
      return state;
  }
}

const initialState: State = {
  tabs: [],
  activeTabId: null,
  openError: null,
};

type Ctx = {
  projectPath: string;
  tabs: RequestTab[];
  activeTabId: string | null;
  activeSnapshot: RequestEditorSnapshot;
  hasActiveTab: boolean;
  openError: string | null;
  clearOpenError: () => void;
  selectTab: (tabId: string) => void;
  closeTab: (tabId: string) => void;
  updateActiveSnapshot: (updater: (s: RequestEditorSnapshot) => RequestEditorSnapshot) => void;
  openRequestFromTree: (node: Extract<CollectionTreeNode, { kind: "request" }>) => Promise<void>;
};

const RequestWorkspaceContext = createContext<Ctx | null>(null);

export function RequestWorkspaceProvider({
  projectPath,
  children,
}: {
  projectPath: string;
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const activeTab = useMemo(
    () => state.tabs.find((t) => t.id === state.activeTabId) ?? null,
    [state.tabs, state.activeTabId],
  );

  const emptySnapshotRef = useRef<RequestEditorSnapshot | null>(null);
  if (!emptySnapshotRef.current) {
    emptySnapshotRef.current = emptyRequestSnapshot();
  }

  const activeSnapshot = activeTab?.snapshot ?? emptySnapshotRef.current;
  const hasActiveTab = activeTab != null;

  const clearOpenError = useCallback(() => dispatch({ type: "CLEAR_OPEN_ERROR" }), []);

  const selectTab = useCallback((tabId: string) => {
    dispatch({ type: "SELECT_TAB", tabId });
  }, []);

  const closeTab = useCallback((tabId: string) => {
    dispatch({ type: "CLOSE_TAB", tabId });
  }, []);

  const updateActiveSnapshot = useCallback((updater: (s: RequestEditorSnapshot) => RequestEditorSnapshot) => {
    dispatch({ type: "UPDATE_ACTIVE", updater });
  }, []);

  const openRequestFromTree = useCallback(
    async (node: Extract<CollectionTreeNode, { kind: "request" }>) => {
      const p = projectPath.trim();
      if (!p) {
        dispatch({
          type: "SET_OPEN_ERROR",
          message: "No hay ruta de proyecto (configura VITE_RUNA_PROJECT).",
        });
        return;
      }
      const rel = node.relativePath.trim();
      if (!rel) {
        dispatch({ type: "SET_OPEN_ERROR", message: "Este nodo no tiene ruta de archivo." });
        return;
      }
      try {
        const dto = await invoke<RequestFileDto>("load_request_file", {
          projectPath: p,
          relativePath: rel,
        });
        const snapshot = requestFileDtoToSnapshot(dto);
        dispatch({
          type: "OPEN_OR_FOCUS",
          payload: { fileKey: rel, title: node.path, snapshot },
        });
      } catch (e) {
        dispatch({
          type: "SET_OPEN_ERROR",
          message: e instanceof Error ? e.message : String(e),
        });
      }
    },
    [projectPath],
  );

  const value = useMemo(
    () => ({
      projectPath,
      tabs: state.tabs,
      activeTabId: state.activeTabId,
      activeSnapshot,
      hasActiveTab,
      openError: state.openError,
      clearOpenError,
      selectTab,
      closeTab,
      updateActiveSnapshot,
      openRequestFromTree,
    }),
    [
      projectPath,
      state.tabs,
      state.activeTabId,
      activeSnapshot,
      hasActiveTab,
      state.openError,
      clearOpenError,
      selectTab,
      closeTab,
      updateActiveSnapshot,
      openRequestFromTree,
    ],
  );

  return <RequestWorkspaceContext.Provider value={value}>{children}</RequestWorkspaceContext.Provider>;
}

export function useRequestWorkspace(): Ctx {
  const ctx = useContext(RequestWorkspaceContext);
  if (!ctx) {
    throw new Error("useRequestWorkspace debe usarse dentro de RequestWorkspaceProvider");
  }
  return ctx;
}
