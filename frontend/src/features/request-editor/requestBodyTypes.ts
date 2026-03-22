import type { KvRow } from "./kvRows";
import { newKvRow, rowHasContent } from "./kvRows";

export type RequestBodyMode = "none" | "json" | "text" | "x_www_form_urlencoded" | "multipart";

export type RequestBodyState = {
  mode: RequestBodyMode;
  json: string;
  text: string;
  urlencoded: KvRow[];
  multipart: KvRow[];
};

export const defaultRequestBody = (): RequestBodyState => ({
  mode: "json",
  json: '{\n  "hello": "world"\n}',
  text: "",
  urlencoded: [newKvRow()],
  multipart: [newKvRow()],
});

export function requestBodyContentType(mode: RequestBodyMode): string | null {
  switch (mode) {
    case "none":
      return null;
    case "json":
      return "application/json";
    case "text":
      return "text/plain; charset=utf-8";
    case "x_www_form_urlencoded":
      return "application/x-www-form-urlencoded";
    case "multipart":
      return "multipart/form-data";
    default:
      return null;
  }
}

export function bodyHasPayload(s: RequestBodyState): boolean {
  switch (s.mode) {
    case "none":
      return false;
    case "json":
      return s.json.trim() !== "";
    case "text":
      return s.text.trim() !== "";
    case "x_www_form_urlencoded":
      return s.urlencoded.some((r) => r.active && rowHasContent(r));
    case "multipart":
      return s.multipart.some((r) => r.active && rowHasContent(r));
    default:
      return false;
  }
}
