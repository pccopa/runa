import styles from "./MethodBadge.module.css";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS" | "HEAD";

export const HTTP_METHODS: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"];

const methodClass: Record<HttpMethod, string> = {
  GET: styles.get,
  POST: styles.post,
  PUT: styles.put,
  PATCH: styles.patch,
  DELETE: styles.delete,
  OPTIONS: styles.neutral,
  HEAD: styles.neutral,
};

type Props = {
  method: HttpMethod;
  className?: string;
};

export function MethodBadge({ method, className }: Props) {
  return (
    <span className={[styles.badge, "mono", methodClass[method], className].filter(Boolean).join(" ")}>
      {method}
    </span>
  );
}
