use std::io::Error;
use std::path::Path;
use crate::models::{FileMetadata, MetadataError};
use super::FileProcessor;

#[derive(Debug, Clone)]
pub struct JsonProcessor;

impl FileProcessor for JsonProcessor {
    // fn validate(&self, path: &Path) -> Result<FileMetadata, MetadataError> {
    //     println!("json archivo validado");
    //     Err(MetadataError::UnsupportedVersion)
    // }

    fn convert(&self, metadata: &str) -> Result<FileMetadata, MetadataError> {
        todo!()
    }
}
