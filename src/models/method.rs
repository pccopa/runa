use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub enum Method {
    #[serde(alias = "GET", alias = "get")]
    Get,

    #[serde(alias = "POST", alias = "post")]
    Post,

    #[serde(alias = "PUT", alias = "put")]
    Put,

    #[serde(alias = "DELETE", alias = "delete")]
    Delete,

    #[serde(alias = "PATCH", alias = "patch")]
    Patch,

    #[serde(alias = "OPTIONS", alias = "options")]
    Options,

    #[serde(alias = "HEAD", alias = "head")]
    Head,
}

impl Method {
    /// Etiqueta HTTP para UI (chips, curl, etc.).
    pub fn as_str(&self) -> &'static str {
        match self {
            Method::Get => "GET",
            Method::Post => "POST",
            Method::Put => "PUT",
            Method::Delete => "DELETE",
            Method::Patch => "PATCH",
            Method::Options => "OPTIONS",
            Method::Head => "HEAD",
        }
    }
}