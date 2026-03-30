import type { HttpMethod } from "@/components/ui/MethodBadge";
import { HTTP_METHODS } from "@/components/ui/MethodBadge";
import type { RequestFileDto } from "@/features/collection-dashboard/api/requestTypes";
import { defaultAuthConfig, type AuthConfig } from "./authorizationTypes";
import { newKvRow, type KvRow } from "./kvRows";
import type { RequestBodyState } from "./requestBodyTypes";
import type { RequestEditorSnapshot } from "./requestWorkspaceTypes";

function parseMethod(raw: string): HttpMethod {
  const u = (raw ?? "GET").toUpperCase();
  return (HTTP_METHODS.includes(u as HttpMethod) ? u : "GET") as HttpMethod;
}

function pairsToKvRows(pairs: { key: string; value: string }[]): KvRow[] {
  const rows: KvRow[] = pairs.map((p) => ({
    id: crypto.randomUUID(),
    key: p.key,
    value: p.value,
    active: true,
  }));
  rows.push(newKvRow());
  return rows;
}

/** Separa `Authorization` (Bearer / Basic) al panel de auth; el resto queda en headers. */
function headersAndAuth(pairs: { key: string; value: string }[]): { headers: KvRow[]; auth: AuthConfig } {
  const rest: { key: string; value: string }[] = [];
  let auth = defaultAuthConfig();

  for (const { key, value } of pairs) {
    if (key.trim().toLowerCase() === "authorization") {
      const v = value.trim();
      const lower = v.toLowerCase();
      if (lower.startsWith("bearer ")) {
        auth = {
          ...defaultAuthConfig(),
          kind: "bearer",
          bearer: { token: v.slice(7).trim() },
        };
        continue;
      }
      if (lower.startsWith("basic ")) {
        try {
          const b64 = v.slice(6).trim();
          const decoded = atob(b64);
          const colon = decoded.indexOf(":");
          const username = colon >= 0 ? decoded.slice(0, colon) : decoded;
          const password = colon >= 0 ? decoded.slice(colon + 1) : "";
          auth = {
            ...defaultAuthConfig(),
            kind: "basic",
            basic: { username, password },
          };
        } catch {
          rest.push({ key, value });
        }
        continue;
      }
    }
    rest.push({ key, value });
  }

  return { headers: pairsToKvRows(rest), auth };
}

function bodyFromDto(dto: RequestFileDto): RequestBodyState {
  const j = dto.bodyJson?.trim();
  if (j) {
    return {
      mode: "json",
      json: j,
      text: "",
      urlencoded: [newKvRow()],
      multipart: [newKvRow()],
    };
  }
  return {
    mode: "none",
    json: "",
    text: "",
    urlencoded: [newKvRow()],
    multipart: [newKvRow()],
  };
}

export function requestFileDtoToSnapshot(dto: RequestFileDto): RequestEditorSnapshot {
  const { headers, auth } = headersAndAuth(dto.headers);
  return {
    method: parseMethod(dto.method),
    urlPath: dto.uri ?? "",
    section: "params",
    params: pairsToKvRows(dto.params),
    headers,
    auth,
    requestBody: bodyFromDto(dto),
  };
}
