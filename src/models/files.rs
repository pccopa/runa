use crate::models::Method;
use serde::de::{self, Deserializer};
use serde::{Deserialize, Serialize};
use serde_yaml::Value;
use thiserror::Error;

#[derive(Debug, Deserialize)]
pub struct File {
    uri: String,
    headers: Vec<(String, String)>,
    params: Vec<(String, String)>,
    method: Method,
    body: Option<Value>,
    documentation: Option<String>,

}

#[derive(Debug, Deserialize)]
pub struct FileMetadata {
    runa: String,
    version: String,
    #[serde(deserialize_with = "deserialize_method")]
    method: Method,
    order: i16,
}

impl FileMetadata {
    pub fn validate(&self) -> Result<(), MetadataError> {
        if self.runa != "runa" {
            return Err(MetadataError::InvalidProject);
        }

        if self.version != "1" {
            return Err(MetadataError::UnsupportedVersion);
        }
        Ok(())
    }
}
fn deserialize_method<'de, D>(deserializer: D) -> Result<Method, D::Error>
where
    D: Deserializer<'de>,
{
    let m: Method = Method::deserialize(deserializer)
        .map_err(|_| de::Error::custom("Unsupported method"))?;
    Ok(m)
}

#[derive(Debug, Error)]
pub enum MetadataError {
    #[error("Invalid metadata")]
    InvalidMetadata,
    #[error("Invalid project")]
    InvalidProject,
    #[error("Unsupported Runa Version")]
    UnsupportedVersion,
    #[error("Wrong format")]
    WrongFormat,
    #[error("Unsupported method")]
    WrongMethod,

}
