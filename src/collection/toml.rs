use crate::models::{FileMetadata, MetadataError};
use super::FileProcessor;

#[derive(Debug, Clone)]
pub struct TomlProcessor;

impl FileProcessor for TomlProcessor {

    fn convert(&self, metadata: &str) -> Result<FileMetadata, MetadataError> {
        todo!()
    }
}
