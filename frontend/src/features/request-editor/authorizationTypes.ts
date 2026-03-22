export type AuthKind = "none" | "api_key" | "bearer" | "basic" | "oauth2";

export type ApiKeyAddTo = "header" | "query";

export type OAuth2Mode = "access_token" | "client_credentials";

export type AuthConfig = {
  kind: AuthKind;
  apiKey: {
    keyName: string;
    value: string;
    addTo: ApiKeyAddTo;
  };
  bearer: { token: string };
  basic: { username: string; password: string };
  oauth2: {
    mode: OAuth2Mode;
    accessToken: string;
    refreshToken: string;
    tokenUrl: string;
    clientId: string;
    clientSecret: string;
    scope: string;
  };
};

export const defaultAuthConfig = (): AuthConfig => ({
  kind: "none",
  apiKey: { keyName: "", value: "", addTo: "header" },
  bearer: { token: "" },
  basic: { username: "", password: "" },
  oauth2: {
    mode: "access_token",
    accessToken: "",
    refreshToken: "",
    tokenUrl: "",
    clientId: "",
    clientSecret: "",
    scope: "",
  },
});

export function authIsConfigured(config: AuthConfig): boolean {
  switch (config.kind) {
    case "none":
      return false;
    case "api_key":
      return (
        config.apiKey.keyName.trim() !== "" &&
        config.apiKey.value.trim() !== ""
      );
    case "bearer":
      return config.bearer.token.trim() !== "";
    case "basic":
      return (
        config.basic.username.trim() !== "" &&
        config.basic.password.trim() !== ""
      );
    case "oauth2":
      if (config.oauth2.mode === "access_token") {
        return config.oauth2.accessToken.trim() !== "";
      }
      return (
        config.oauth2.tokenUrl.trim() !== "" &&
        config.oauth2.clientId.trim() !== "" &&
        config.oauth2.clientSecret.trim() !== ""
      );
    default:
      return false;
  }
}
