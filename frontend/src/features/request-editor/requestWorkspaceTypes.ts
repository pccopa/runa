import type { HttpMethod } from "@/components/ui/MethodBadge";
import { defaultAuthConfig, type AuthConfig } from "./authorizationTypes";
import { newKvRow, type KvRow } from "./kvRows";
import type { RequestBodyState } from "./requestBodyTypes";

export type SectionTab = "params" | "authorization" | "headers" | "body" | "settings";

export type RequestEditorSnapshot = {
  method: HttpMethod;
  urlPath: string;
  section: SectionTab;
  params: KvRow[];
  headers: KvRow[];
  auth: AuthConfig;
  requestBody: RequestBodyState;
};

const emptyBody = (): RequestBodyState => ({
  mode: "none",
  json: "",
  text: "",
  urlencoded: [newKvRow()],
  multipart: [newKvRow()],
});

export function emptyRequestSnapshot(): RequestEditorSnapshot {
  return {
    method: "GET",
    urlPath: "",
    section: "params",
    params: [newKvRow()],
    headers: [newKvRow()],
    auth: defaultAuthConfig(),
    requestBody: emptyBody(),
  };
}

export type RequestTab = {
  id: string;
  /** Identidad estable: `relativePath` del archivo en el proyecto. */
  fileKey: string;
  title: string;
  snapshot: RequestEditorSnapshot;
};
