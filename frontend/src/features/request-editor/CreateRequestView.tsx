import { useCallback, useId, useMemo, useRef, useState } from "react";
import type { HttpMethod } from "@/components/ui/MethodBadge";
import { HttpMethodSelect } from "@/components/ui/HttpMethodSelect";
import { MethodBadge } from "@/components/ui/MethodBadge";
import { AuthorizationPanel } from "./AuthorizationPanel";
import { authIsConfigured, type AuthConfig } from "./authorizationTypes";
import { applyKvPatch, type KvRow } from "./kvRows";
import { KeyValueTable } from "./KeyValueTable";
import { RequestBodyPanel } from "./RequestBodyPanel";
import { bodyHasPayload, type RequestBodyState } from "./requestBodyTypes";
import { useRequestWorkspace } from "./RequestWorkspaceContext";
import type { SectionTab } from "./requestWorkspaceTypes";
import { ResponsePayloadPanel } from "./ResponsePayloadPanel";
import styles from "./CreateRequestView.module.css";

const SPLITTER_PX = 3;
const MIN_REQUEST_PCT = 18;
const MAX_REQUEST_PCT = 82;

export function CreateRequestView() {
  const methodId = useId();
  const {
    tabs,
    activeTabId,
    activeSnapshot,
    hasActiveTab,
    openError,
    clearOpenError,
    selectTab,
    closeTab,
    updateActiveSnapshot,
  } = useRequestWorkspace();

  const [requestPanelPct, setRequestPanelPct] = useState(50);
  const [splitDragging, setSplitDragging] = useState(false);
  const workspaceRef = useRef<HTMLDivElement>(null);

  const method = activeSnapshot.method;
  const urlPath = activeSnapshot.urlPath;
  const section = activeSnapshot.section;
  const params = activeSnapshot.params;
  const headers = activeSnapshot.headers;
  const auth = activeSnapshot.auth;
  const requestBody = activeSnapshot.requestBody;

  const hasHeaderDot = useMemo(() => headers.some((h) => h.key.trim() && h.active), [headers]);
  const hasAuthorizationDot = useMemo(() => authIsConfigured(auth), [auth]);
  const hasBodyDot = useMemo(() => bodyHasPayload(requestBody), [requestBody]);

  const setMethod = useCallback(
    (m: HttpMethod) => updateActiveSnapshot((s) => ({ ...s, method: m })),
    [updateActiveSnapshot],
  );
  const setUrlPath = useCallback(
    (v: string) => updateActiveSnapshot((s) => ({ ...s, urlPath: v })),
    [updateActiveSnapshot],
  );
  const setSection = useCallback(
    (sec: SectionTab) => updateActiveSnapshot((s) => ({ ...s, section: sec })),
    [updateActiveSnapshot],
  );
  const setAuth = useCallback(
    (next: AuthConfig) => updateActiveSnapshot((s) => ({ ...s, auth: next })),
    [updateActiveSnapshot],
  );
  const setRequestBody = useCallback(
    (next: RequestBodyState) => updateActiveSnapshot((s) => ({ ...s, requestBody: next })),
    [updateActiveSnapshot],
  );

  const updateParam = useCallback(
    (id: string, patch: Partial<KvRow>) => {
      updateActiveSnapshot((s) => ({ ...s, params: applyKvPatch(s.params, id, patch) }));
    },
    [updateActiveSnapshot],
  );

  const updateHeader = useCallback(
    (id: string, patch: Partial<KvRow>) => {
      updateActiveSnapshot((s) => ({ ...s, headers: applyKvPatch(s.headers, id, patch) }));
    },
    [updateActiveSnapshot],
  );

  const handleSplitPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      const row = workspaceRef.current;
      const handle = e.currentTarget;
      if (!row) return;

      const rect = row.getBoundingClientRect();
      const total = rect.width - SPLITTER_PX;
      if (total <= 1) return;

      e.preventDefault();
      const pointerId = e.pointerId;
      handle.setPointerCapture(pointerId);
      setSplitDragging(true);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      const startX = e.clientX;
      const startPct = requestPanelPct;

      const clampPct = (pct: number) =>
        Math.min(MAX_REQUEST_PCT, Math.max(MIN_REQUEST_PCT, pct));

      const onMove = (ev: PointerEvent) => {
        if (ev.pointerId !== pointerId) return;
        const r = row.getBoundingClientRect();
        const w = r.width - SPLITTER_PX;
        if (w <= 1) return;
        const dx = ev.clientX - startX;
        const dPct = (dx / w) * 100;
        setRequestPanelPct(clampPct(startPct + dPct));
      };

      const end = (ev: PointerEvent) => {
        if (ev.pointerId !== pointerId) return;
        handle.releasePointerCapture(pointerId);
        handle.removeEventListener("pointermove", onMove);
        handle.removeEventListener("pointerup", end);
        handle.removeEventListener("pointercancel", end);
        setSplitDragging(false);
        document.body.style.removeProperty("cursor");
        document.body.style.removeProperty("user-select");
      };

      handle.addEventListener("pointermove", onMove);
      handle.addEventListener("pointerup", end);
      handle.addEventListener("pointercancel", end);
    },
    [requestPanelPct],
  );

  return (
    <div className={styles.root}>
      {openError ? (
        <div className={styles.openErrorBanner} role="alert">
          <span>{openError}</span>
          <button type="button" className={styles.openErrorDismiss} onClick={clearOpenError} aria-label="Cerrar aviso">
            <span className="material-symbols-outlined" aria-hidden>
              close
            </span>
          </button>
        </div>
      ) : null}

      <div className={styles.tabStrip} role="tablist" aria-label="Requests abiertos">
        {tabs.length === 0 ? (
          <span className={styles.tabStripHint}>Ningún request abierto — elige uno en el árbol.</span>
        ) : (
          tabs.map((t) => (
            <div
              key={t.id}
              className={[styles.tabSlot, t.id === activeTabId ? styles.tabSlotActive : ""]
                .filter(Boolean)
                .join(" ")}
            >
              <button
                type="button"
                role="tab"
                aria-selected={t.id === activeTabId}
                className={styles.tabMain}
                onClick={() => selectTab(t.id)}
              >
                <MethodBadge method={t.snapshot.method} />
                <span className={styles.tabTitle}>{t.title}</span>
              </button>
              <button
                type="button"
                className={styles.tabClose}
                aria-label={`Cerrar ${t.title}`}
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(t.id);
                }}
              >
                <span className="material-symbols-outlined" aria-hidden>
                  close
                </span>
              </button>
            </div>
          ))
        )}
      </div>

      <div className={styles.body}>
        <div
          ref={workspaceRef}
          className={styles.workspaceRow}
          style={{
            gridTemplateColumns: `${requestPanelPct}fr ${SPLITTER_PX}px ${100 - requestPanelPct}fr`,
          }}
        >
          <div className={styles.requestPane}>
            {!hasActiveTab ? (
              <div className={styles.noTab}>
                <p className={styles.noTabText}>
                  Selecciona un archivo de request en el árbol de la izquierda para cargar método, URL, cabeceras,
                  parámetros y cuerpo.
                </p>
              </div>
            ) : (
              <>
                <div className={styles.urlRow}>
                  <label htmlFor={methodId} className="sr-only">
                    Método HTTP
                  </label>
                  <HttpMethodSelect id={methodId} value={method} onChange={setMethod} />
                  <div className={styles.urlField}>
                    <span className={styles.varChip} title="Variable de entorno">
                      {"{{base_url}}"}
                    </span>
                    <input
                      className={styles.urlInput}
                      type="text"
                      value={urlPath}
                      onChange={(e) => setUrlPath(e.target.value)}
                      placeholder="/ruta"
                      spellCheck={false}
                      autoComplete="off"
                      aria-label="Ruta o URL"
                    />
                  </div>
                  <button type="button" className={styles.sendBtn}>
                    Enviar
                  </button>
                </div>

                <div className={styles.sectionTabs} role="tablist" aria-label="Sección de la petición">
                  {(
                    [
                      ["params", "Params"],
                      ["authorization", "Authorization"],
                      ["headers", "Headers"],
                      ["body", "Body"],
                      ["settings", "Settings"],
                    ] as const
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      role="tab"
                      aria-selected={section === key}
                      className={[
                        styles.sectionTab,
                        section === key ? styles.sectionTabActive : "",
                        key === "headers" && hasHeaderDot ? styles.sectionTabDot : "",
                        key === "authorization" && hasAuthorizationDot ? styles.sectionTabDot : "",
                        key === "body" && hasBodyDot ? styles.sectionTabDot : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() => setSection(key)}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div
                  className={section === "body" ? styles.sectionBodyTight : styles.sectionBody}
                  data-section={section}
                >
                  {section === "params" && (
                    <KeyValueTable rows={params} onChange={updateParam} valueAccentWhen="true" />
                  )}
                  {section === "headers" && (
                    <KeyValueTable rows={headers} onChange={updateHeader} valueAccentWhen={null} />
                  )}
                  {section === "authorization" && <AuthorizationPanel value={auth} onChange={setAuth} />}
                  {section === "body" && (
                    <RequestBodyPanel value={requestBody} onChange={setRequestBody} />
                  )}
                  {section === "settings" && (
                    <p className={styles.placeholderSection}>Ajustes de la petición (próximamente).</p>
                  )}
                </div>
              </>
            )}
          </div>

          <div
            className={[styles.splitVertical, splitDragging ? styles.splitVerticalActive : ""]
              .filter(Boolean)
              .join(" ")}
            role="separator"
            aria-orientation="vertical"
            aria-label="Redimensionar paneles petición y respuesta"
            onPointerDown={handleSplitPointerDown}
          />

          <div className={styles.responsePane}>
            <ResponsePayloadPanel empty />
          </div>
        </div>
      </div>
    </div>
  );
}
