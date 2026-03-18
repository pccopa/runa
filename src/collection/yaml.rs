use std::path::Path;
use crate::models::{FileMetadata, MetadataError};
use super::{read_metadata, FileProcessor};
use serde_yaml;

#[derive(Debug, Clone)]
pub struct YamlProcessor;

impl FileProcessor for YamlProcessor {
    // fn validate(&self, path: &Path) -> Result<FileMetadata, MetadataError> {
    //     match read_metadata(path) {
    //         Ok(Some(metadata)) => {
    //             println!("Valid file for Runa project");
    //             Ok(metadata)
    //         },
    //         Ok(None) => {
    //             println!("Invalid file for Runa project");
    //             Err(MetadataError::InvalidProject)
    //         },
    //         Err(err)=> {
    //             println!("Invalid file metadata {:?}", err);
    //             Err(MetadataError::InvalidMetadata)
    //         }
    //     }
    // }

    fn convert(&self, metadata: &str) -> Result<FileMetadata, MetadataError> {
        match serde_yaml::from_str::<FileMetadata> (metadata) {
            Ok(metadata) => Ok(metadata),
            Err(_) => Err(MetadataError::InvalidMetadata)
        }
    }
}

