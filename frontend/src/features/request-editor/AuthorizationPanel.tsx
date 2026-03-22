import type { AuthConfig, AuthKind, OAuth2Mode } from "./authorizationTypes";
import styles from "./AuthorizationPanel.module.css";

const KIND_OPTIONS: { value: AuthKind; label: string }[] = [
  { value: "none", label: "Ninguna" },
  { value: "api_key", label: "API Key" },
  { value: "bearer", label: "Bearer" },
  { value: "basic", label: "Basic" },
  { value: "oauth2", label: "OAuth 2" },
];

type Props = {
  value: AuthConfig;
  onChange: (next: AuthConfig) => void;
};

export function AuthorizationPanel({ value, onChange }: Props) {
  const setKind = (kind: AuthKind) => {
    onChange({ ...value, kind });
  };

  const patch = <K extends keyof AuthConfig>(key: K, partial: Partial<AuthConfig[K]>) => {
    onChange({
      ...value,
      [key]: { ...(value[key] as object), ...partial },
    } as AuthConfig);
  };

  return (
    <div className={styles.panel}>
      <p className={styles.intro}>
        Elige cómo se enviará la credencial en la petición. Los campos marcados con{" "}
        <span aria-hidden>*</span> son obligatorios para ese tipo.
      </p>

      <div className={styles.segment} role="radiogroup" aria-label="Tipo de autorización">
        {KIND_OPTIONS.map(({ value: v, label }) => (
          <label key={v} className={styles.segmentLabel}>
            <input
              type="radio"
              name="runa-auth-kind"
              className={styles.segmentInput}
              checked={value.kind === v}
              onChange={() => setKind(v)}
            />
            <span className={styles.segmentText}>{label}</span>
          </label>
        ))}
      </div>

      {value.kind === "none" && (
        <div className={styles.card}>
          <p className={styles.cardMuted}>No se añadirá ninguna cabecera ni parámetro de autorización.</p>
        </div>
      )}

      {value.kind === "api_key" && (
        <div className={styles.card}>
          <p className={styles.hint} id="auth-apikey-hint">
            La clave se enviará como cabecera HTTP o como parámetro de consulta, según elijas.
          </p>
          <div className={styles.field} style={{ marginTop: "0.85rem" }}>
            <label className={`${styles.label} ${styles.required}`} htmlFor="auth-apikey-name">
              Nombre de la clave
            </label>
            <input
              id="auth-apikey-name"
              className={styles.input}
              value={value.apiKey.keyName}
              onChange={(e) => patch("apiKey", { keyName: e.target.value })}
              placeholder={value.apiKey.addTo === "header" ? "X-API-Key" : "api_key"}
              autoComplete="off"
              spellCheck={false}
              aria-required
              aria-describedby="auth-apikey-hint"
            />
          </div>
          <div className={styles.field}>
            <label className={`${styles.label} ${styles.required}`} htmlFor="auth-apikey-value">
              Valor
            </label>
            <input
              id="auth-apikey-value"
              className={styles.input}
              type="password"
              value={value.apiKey.value}
              onChange={(e) => patch("apiKey", { value: e.target.value })}
              placeholder="Tu clave o token"
              autoComplete="off"
              aria-required
            />
          </div>
          <div className={styles.field}>
            <span className={styles.label} id="auth-apikey-addto-label">
              Enviar en
            </span>
            <div className={styles.radioRow} role="group" aria-labelledby="auth-apikey-addto-label">
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  className={styles.radio}
                  name="runa-apikey-addto"
                  checked={value.apiKey.addTo === "header"}
                  onChange={() => patch("apiKey", { addTo: "header" })}
                />
                Cabecera
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  className={styles.radio}
                  name="runa-apikey-addto"
                  checked={value.apiKey.addTo === "query"}
                  onChange={() => patch("apiKey", { addTo: "query" })}
                />
                Query string
              </label>
            </div>
          </div>
        </div>
      )}

      {value.kind === "bearer" && (
        <div className={styles.card}>
          <div className={styles.field}>
            <label className={`${styles.label} ${styles.required}`} htmlFor="auth-bearer-token">
              Token
            </label>
            <p className={styles.hint} id="auth-bearer-hint">
              Se enviará la cabecera <code className="mono">Authorization: Bearer &lt;token&gt;</code>.
            </p>
            <input
              id="auth-bearer-token"
              className={styles.input}
              type="password"
              value={value.bearer.token}
              onChange={(e) => patch("bearer", { token: e.target.value })}
              placeholder="eyJhbGciOi..."
              autoComplete="off"
              aria-required
              aria-describedby="auth-bearer-hint"
            />
          </div>
        </div>
      )}

      {value.kind === "basic" && (
        <div className={styles.card}>
          <p className={styles.hint} id="auth-basic-hint">
            Codificación Base64 de <span className="mono">usuario:contraseña</span> en{" "}
            <span className="mono">Authorization: Basic …</span>
          </p>
          <div className={styles.row2} style={{ marginTop: "0.85rem" }}>
            <div className={styles.field} style={{ marginBottom: 0 }}>
              <label className={`${styles.label} ${styles.required}`} htmlFor="auth-basic-user">
                Usuario
              </label>
              <input
                id="auth-basic-user"
                className={styles.input}
                value={value.basic.username}
                onChange={(e) => patch("basic", { username: e.target.value })}
                autoComplete="username"
                aria-required
                aria-describedby="auth-basic-hint"
              />
            </div>
            <div className={styles.field} style={{ marginBottom: 0 }}>
              <label className={`${styles.label} ${styles.required}`} htmlFor="auth-basic-pass">
                Contraseña
              </label>
              <input
                id="auth-basic-pass"
                className={styles.input}
                type="password"
                value={value.basic.password}
                onChange={(e) => patch("basic", { password: e.target.value })}
                autoComplete="current-password"
                aria-required
              />
            </div>
          </div>
        </div>
      )}

      {value.kind === "oauth2" && (
        <div className={styles.card}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="auth-oauth-mode">
              Flujo
            </label>
            <select
              id="auth-oauth-mode"
              className={styles.select}
              value={value.oauth2.mode}
              onChange={(e) => patch("oauth2", { mode: e.target.value as OAuth2Mode })}
            >
              <option value="access_token">Token de acceso (manual)</option>
              <option value="client_credentials">Client Credentials</option>
            </select>
          </div>

          {value.oauth2.mode === "access_token" && (
            <>
              <hr className={styles.divider} />
              <h3 className={styles.subTitle}>Token ya obtenido</h3>
              <div className={styles.field}>
                <label className={`${styles.label} ${styles.required}`} htmlFor="auth-oauth-access">
                  Access token
                </label>
                <p className={styles.hint} id="auth-oauth-access-hint">
                  Equivale a Bearer: se usará en <span className="mono">Authorization: Bearer …</span>
                </p>
                <input
                  id="auth-oauth-access"
                  className={styles.input}
                  type="password"
                  value={value.oauth2.accessToken}
                  onChange={(e) => patch("oauth2", { accessToken: e.target.value })}
                  placeholder="Pega el access_token"
                  autoComplete="off"
                  aria-required
                  aria-describedby="auth-oauth-access-hint"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="auth-oauth-refresh">
                  Refresh token (opcional)
                </label>
                <input
                  id="auth-oauth-refresh"
                  className={styles.input}
                  type="password"
                  value={value.oauth2.refreshToken}
                  onChange={(e) => patch("oauth2", { refreshToken: e.target.value })}
                  placeholder="Para renovar el access token más adelante"
                  autoComplete="off"
                />
              </div>
            </>
          )}

          {value.oauth2.mode === "client_credentials" && (
            <>
              <hr className={styles.divider} />
              <h3 className={styles.subTitle}>Credenciales del cliente</h3>
              <div className={styles.field}>
                <label className={`${styles.label} ${styles.required}`} htmlFor="auth-oauth-url">
                  URL del token
                </label>
                <input
                  id="auth-oauth-url"
                  className={styles.input}
                  value={value.oauth2.tokenUrl}
                  onChange={(e) => patch("oauth2", { tokenUrl: e.target.value })}
                  placeholder="https://api.example.com/oauth/token"
                  autoComplete="off"
                  spellCheck={false}
                  aria-required
                />
              </div>
              <div className={styles.field}>
                <label className={`${styles.label} ${styles.required}`} htmlFor="auth-oauth-client-id">
                  Client ID
                </label>
                <input
                  id="auth-oauth-client-id"
                  className={styles.input}
                  value={value.oauth2.clientId}
                  onChange={(e) => patch("oauth2", { clientId: e.target.value })}
                  autoComplete="off"
                  spellCheck={false}
                  aria-required
                />
              </div>
              <div className={styles.field}>
                <label className={`${styles.label} ${styles.required}`} htmlFor="auth-oauth-client-secret">
                  Client secret
                </label>
                <input
                  id="auth-oauth-client-secret"
                  className={styles.input}
                  type="password"
                  value={value.oauth2.clientSecret}
                  onChange={(e) => patch("oauth2", { clientSecret: e.target.value })}
                  autoComplete="off"
                  aria-required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="auth-oauth-scope">
                  Scope (opcional)
                </label>
                <input
                  id="auth-oauth-scope"
                  className={styles.input}
                  value={value.oauth2.scope}
                  onChange={(e) => patch("oauth2", { scope: e.target.value })}
                  placeholder="read write"
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
              <p className={styles.hint}>
                La obtención del token en tiempo de ejecución se conectará a esta URL con{" "}
                <span className="mono">grant_type=client_credentials</span> cuando implementemos el envío real.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
