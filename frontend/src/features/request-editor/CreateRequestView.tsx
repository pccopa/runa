import { useCallback, useId, useMemo, useRef, useState } from "react";
import type { HttpMethod } from "@/components/ui/MethodBadge";
import { HTTP_METHODS } from "@/components/ui/MethodBadge";
import { AuthorizationPanel } from "./AuthorizationPanel";
import { authIsConfigured, defaultAuthConfig } from "./authorizationTypes";
import { applyKvPatch, newKvRow, type KvRow } from "./kvRows";
import { KeyValueTable } from "./KeyValueTable";
import { RequestBodyPanel } from "./RequestBodyPanel";
import { bodyHasPayload, defaultRequestBody } from "./requestBodyTypes";
import { ResponsePayloadPanel } from "./ResponsePayloadPanel";
import styles from "./CreateRequestView.module.css";

type SectionTab = "params" | "authorization" | "headers" | "body" | "settings";

const MOCK_JSON_LINES = [
  "{",
  '  "id": "usr_8f2a",',
  '  "email": "architect@example.com",',
  '  "display_name": "Architect_One",',
  '  "role": "admin",',
  '  "active": true,',
  '  "plan": {',
  '    "tier": "enterprise",',
  '    "seats": 42',
  "  }",
  "}",
];

const SPLITTER_PX = 3;
/** Porcentaje del ancho útil (sin separador) asignado al panel de request; el response recibe el resto. */
const MIN_REQUEST_PCT = 18;
const MAX_REQUEST_PCT = 82;

export function CreateRequestView() {
  const methodId = useId();
  const [openTabs] = useState(() => [
    { id: "t1", method: "GET" as HttpMethod, title: "Fetch User Profile" },
    { id: "t2", method: "POST" as HttpMethod, title: "Update Auth" },
  ]);
  const [activeTabId, setActiveTabId] = useState("t1");
  const [method, setMethod] = useState<HttpMethod>("GET");
  const [urlPath, setUrlPath] = useState("/api/v2/users/me");
  const [section, setSection] = useState<SectionTab>("params");
  const [params, setParams] = useState<KvRow[]>([
    { id: "p1", key: "include_details", value: "true", active: true },
    { id: "p2", key: "api_version", value: "v2.0.4", active: true },
    newKvRow(),
  ]);
  const [headers, setHeaders] = useState<KvRow[]>([
    { id: "h1", key: "Accept", value: "application/json", active: true },
    newKvRow(),
  ]);
  const [auth, setAuth] = useState(defaultAuthConfig);
  const [requestBody, setRequestBody] = useState(defaultRequestBody);
  const [requestPanelPct, setRequestPanelPct] = useState(50);
  const [splitDragging, setSplitDragging] = useState(false);
  const workspaceRef = useRef<HTMLDivElement>(null);

  const hasHeaderDot = useMemo(() => headers.some((h) => h.key.trim() && h.active), [headers]);
  const hasAuthorizationDot = useMemo(() => authIsConfigured(auth), [auth]);
  const hasBodyDot = useMemo(() => bodyHasPayload(requestBody), [requestBody]);

  const mockResponseRaw = useMemo(() => MOCK_JSON_LINES.join("\n"), []);

  const updateParam = (id: string, patch: Partial<KvRow>) => {
    setParams((rows) => applyKvPatch(rows, id, patch));
  };

  const updateHeader = (id: string, patch: Partial<KvRow>) => {
    setHeaders((rows) => applyKvPatch(rows, id, patch));
  };

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
      <div className={styles.tabStrip} role="tablist" aria-label="Pestañas de petición">
        {openTabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={t.id === activeTabId}
            className={t.id === activeTabId ? `${styles.tab} ${styles.tabActive}` : styles.tab}
            onClick={() => {
              setActiveTabId(t.id);
              setMethod(t.method);
            }}
          >
            <span className={styles.methodTag}>{t.method}</span>
            <span>{t.title}</span>
          </button>
        ))}
        <button type="button" className={styles.tabAdd} aria-label="Nueva pestaña">
          +
        </button>
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
            <div className={styles.urlRow}>
              <div className={styles.methodSelectWrap}>
                <label htmlFor={methodId} className="sr-only">
                  Método HTTP
                </label>
                <select
                  id={methodId}
                  className={styles.methodSelect}
                  value={method}
                  onChange={(e) => setMethod(e.target.value as HttpMethod)}
                >
                  {HTTP_METHODS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <span className={`material-symbols-outlined ${styles.chevron}`} aria-hidden>
                  expand_more
                </span>
              </div>
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
            <ResponsePayloadPanel
              statusLine="200 OK"
              timeMs={124}
              sizeLabel="1.4 KB"
              contentType="application/json; charset=utf-8"
              bodyLines={MOCK_JSON_LINES}
              rawText={mockResponseRaw}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
