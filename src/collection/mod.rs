mod json;
mod toml;
mod yaml;

use std::path::{Path};
pub use json::JsonProcessor;
pub use toml::TomlProcessor;
pub use yaml::YamlProcessor;
use std::fs::File as StdFile;
use std::io::{BufRead, BufReader};
use log::debug;
use crate::models::{FileMetadata, MetadataError};

pub trait FileProcessor {
    fn convert(&self, metadata: &str) -> Result<FileMetadata, MetadataError>;
}

pub type Processor = Box<dyn FileProcessor>;

pub fn get_file_processor (path: &Path) -> Option<Processor> {
    let ext = path.extension().and_then(|e| e.to_str()).unwrap_or("");
    match ext {
        "json" => Some(Box::new(JsonProcessor)),
        "toml" => Some(Box::new(TomlProcessor)),
        "yml" | "yaml" => Some(Box::new(YamlProcessor)),
        _ => None,
    }
}

pub fn validate(path: &Path) -> Result<FileMetadata, MetadataError> {
    match read_metadata(path) {
        Ok(Some(metadata)) => {
            debug!("Valid file for Runa project");
            Ok(metadata)
        },
        Ok(None) => {
            debug!("Invalid file for Runa project");
            Err(MetadataError::InvalidProject)
        },
        Err(err)=> {
            debug!("Invalid file metadata {:?}", err);
            Err(MetadataError::InvalidMetadata)
        }
    }
}

pub fn read_metadata(path: &Path) -> std::io::Result<Option<FileMetadata>> {
    let file = StdFile::open(path)?;
    let mut reader = BufReader::new(file);

    let mut line = String::new();
    let bytes = reader.read_line(&mut line)?;

    if bytes == 0 {
        return Ok(None);
    }

    if let Some(metadata) = parse_metadata(&line, get_file_processor(path)) {
        if metadata.validate().is_ok() {
            return Ok(Some(metadata));
        }
    }
    Ok(None)
}

fn parse_metadata(line: &str, processor: Option<Processor>) -> Option<FileMetadata> {
    const RUNA_KEY: &str = "# Runa Project:";
    if !line.starts_with(RUNA_KEY) {
        debug! ("No cumple con RUNA_KEY: {}", line);
        return None;
    }
    let content = line.trim_start_matches(RUNA_KEY).trim();
    match processor{
        Some(processor) => processor.convert(content).ok(),
        None => None,
    }
}
