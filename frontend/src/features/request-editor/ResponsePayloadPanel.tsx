import { useState } from "react";
import hp from "./HttpPayloadPanel.module.css";

export type ResponseBodyView = "json" | "text" | "raw";

const VIEW_OPTIONS: { value: ResponseBodyView; label: string }[] = [
  { value: "json", label: "JSON" },
  { value: "text", label: "Texto" },
  { value: "raw", label: "Bruto" },
];

type Props = {
  statusLine: string;
  timeMs: number;
  sizeLabel: string;
  contentType: string;
  bodyLines: string[];
  rawText: string;
};

export function ResponsePayloadPanel({ statusLine, timeMs, sizeLabel, contentType, bodyLines, rawText }: Props) {
  const [view, setView] = useState<ResponseBodyView>("json");

  return (
    <div className={hp.root}>
      <div className={hp.head}>
        <span className={hp.title}>Respuesta</span>
        <span className={`${hp.statusPill} ${hp.statusOk}`}>{statusLine}</span>
        <span className={hp.meta}>Time: {timeMs}ms</span>
        <span className={hp.meta}>Size: {sizeLabel}</span>
        <span className={hp.typeBadge} title="Content-Type de la respuesta">
          {contentType}
        </span>
      </div>

      <div className={hp.segmentWrap}>
        <div className={hp.segment} role="tablist" aria-label="Vista del cuerpo de la respuesta">
          {VIEW_OPTIONS.map(({ value: v, label }) => (
            <label key={v} className={hp.segmentLabel}>
              <input
                type="radio"
                name="runa-response-body-view"
                className={hp.segmentInput}
                checked={view === v}
                onChange={() => setView(v)}
              />
              <span className={hp.segmentText}>{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={hp.editorShell}>
        {view === "json" && (
          <pre className={hp.editorBody}>
            <span className="sr-only">Cuerpo JSON</span>
            <div className={hp.lineNums}>
              {bodyLines.map((line, i) => (
                <div key={i} className={hp.lineRow}>
                  <span className={hp.lineNo}>{i + 1}</span>
                  <span className={hp.lineCode}>{line}</span>
                </div>
              ))}
            </div>
          </pre>
        )}

        {view === "text" && (
          <pre className={hp.editorBody}>
            <span className="sr-only">Cuerpo como texto</span>
            {rawText}
          </pre>
        )}

        {view === "raw" && (
          <pre className={hp.editorBody}>
            <span className="sr-only">Cuerpo en bruto</span>
            {rawText}
          </pre>
        )}
      </div>
    </div>
  );
}
