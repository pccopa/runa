/** Espejo de `runa::bridge::RequestFileDto`. */
export type RequestFileDto = {
  uri: string;
  method: string;
  headers: { key: string; value: string }[];
  params: { key: string; value: string }[];
  bodyJson?: string | null;
};
