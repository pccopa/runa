import { applyKvPatch, type KvRow } from "./kvRows";
import type { RequestBodyMode, RequestBodyState } from "./requestBodyTypes";
import { requestBodyContentType } from "./requestBodyTypes";
import hp from "./HttpPayloadPanel.module.css";
import { KeyValueTable } from "./KeyValueTable";

const MODE_OPTIONS: { value: RequestBodyMode; label: string }[] = [
  { value: "none", label: "Ninguno" },
  { value: "json", label: "JSON" },
  { value: "text", label: "Texto" },
  { value: "x_www_form_urlencoded", label: "URL encoded" },
  { value: "multipart", label: "Multipart" },
];

type Props = {
  value: RequestBodyState;
  onChange: (next: RequestBodyState) => void;
};

export function RequestBodyPanel({ value, onChange }: Props) {
  const ct = requestBodyContentType(value.mode);

  const setMode = (mode: RequestBodyMode) => {
    onChange({ ...value, mode });
  };

  const patchUrl = (id: string, patch: Partial<KvRow>) => {
    onChange({ ...value, urlencoded: applyKvPatch(value.urlencoded, id, patch) });
  };

  const patchMultipart = (id: string, patch: Partial<KvRow>) => {
    onChange({ ...value, multipart: applyKvPatch(value.multipart, id, patch) });
  };

  return (
    <div className={hp.root}>
      <div className={hp.head}>
        <span className={hp.title}>Cuerpo</span>
        {ct ? (
          <span className={hp.typeBadge} title="Content-Type de la petición">
            {ct}
          </span>
        ) : (
          <span className={hp.typeBadge}>Sin Content-Type</span>
        )}
      </div>

      <div className={hp.segmentWrap}>
        <div className={hp.segment} role="radiogroup" aria-label="Tipo de cuerpo (Content-Type)">
          {MODE_OPTIONS.map(({ value: v, label }) => (
            <label key={v} className={hp.segmentLabel}>
              <input
                type="radio"
                name="runa-request-body-mode"
                className={hp.segmentInput}
                checked={value.mode === v}
                onChange={() => setMode(v)}
              />
              <span className={hp.segmentText}>{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={hp.editorShell}>
        {value.mode === "none" && (
          <p className={hp.emptyBody}>No se enviará cuerpo en la petición (adecuado para GET o DELETE sin payload).</p>
        )}

        {value.mode === "json" && (
          <textarea
            className={hp.textarea}
            value={value.json}
            onChange={(e) => onChange({ ...value, json: e.target.value })}
            spellCheck={false}
            autoComplete="off"
            aria-label="Cuerpo JSON"
          />
        )}

        {value.mode === "text" && (
          <textarea
            className={hp.textarea}
            value={value.text}
            onChange={(e) => onChange({ ...value, text: e.target.value })}
            spellCheck={false}
            autoComplete="off"
            aria-label="Cuerpo de texto plano"
          />
        )}

        {value.mode === "x_www_form_urlencoded" && (
          <>
            <p className={hp.formHint}>
              Pares clave-valor codificados como <span className="mono">application/x-www-form-urlencoded</span>.
            </p>
            <div className={hp.tableScroll}>
              <KeyValueTable rows={value.urlencoded} onChange={patchUrl} valueAccentWhen={null} />
            </div>
          </>
        )}

        {value.mode === "multipart" && (
          <>
            <p className={hp.formHint}>
              Campos de formulario para <span className="mono">multipart/form-data</span>. La subida de archivos se
              añadirá después.
            </p>
            <div className={hp.tableScroll}>
              <KeyValueTable rows={value.multipart} onChange={patchMultipart} valueAccentWhen={null} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
