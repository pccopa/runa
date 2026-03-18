use crate::models::{FileMetadata, MetadataError};
use super::FileProcessor;

#[derive(Debug, Clone)]
pub struct JsonProcessor;

impl FileProcessor for JsonProcessor {

    fn convert(&self, metadata: &str) -> Result<FileMetadata, MetadataError> {
        todo!()
    }
}
