use crate::models::{FileMetadata, MetadataError};
use super::{FileProcessor};
use serde_yaml;

#[derive(Debug, Clone)]
pub struct YamlProcessor;

impl FileProcessor for YamlProcessor {

    fn convert(&self, metadata: &str) -> Result<FileMetadata, MetadataError> {
        match serde_yaml::from_str::<FileMetadata> (metadata) {
            Ok(metadata) => Ok(metadata),
            Err(_) => Err(MetadataError::InvalidMetadata)
        }
    }
}

