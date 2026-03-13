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