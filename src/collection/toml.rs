use std::path::Path;
use crate::models::{FileMetadata, MetadataError};
use super::FileProcessor;

#[derive(Debug, Clone)]
pub struct TomlProcessor;

impl FileProcessor for TomlProcessor {
    // fn validate(&self, path: &Path) -> Result<FileMetadata, MetadataError> {
    //     println!("toml archivo validado");
    //     Err(MetadataError::UnsupportedVersion)
    // }

    fn convert(&self, metadata: &str) -> Result<FileMetadata, MetadataError> {
        todo!()
    }
}
