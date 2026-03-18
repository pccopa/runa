mod json;
mod toml;
mod yaml;

use std::path::{Path, PathBuf};
pub use json::JsonProcessor;
pub use toml::TomlProcessor;
pub use yaml::YamlProcessor;
use std::fs::File as StdFile;
use std::io::{BufRead, BufReader, Error};
use crate::models::{FileMetadata, MetadataError, ValidMetadata};
// pub use read_metadata;
pub trait FileProcessor {
    // fn validate(&self, content: &Path) -> Result<FileMetadata, MetadataError>;
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
            println!("Valid file for Runa project");
            Ok(metadata)
        },
        Ok(None) => {
            println!("Invalid file for Runa project");
            Err(MetadataError::InvalidProject)
        },
        Err(err)=> {
            println!("Invalid file metadata {:?}", err);
            Err(MetadataError::InvalidMetadata)
        }
    }
}



// #[derive(Debug, Clone)]
// pub enum ProcessorType {
//     Json(JsonProcessor),
//     Toml(TomlProcessor),
//     Yaml(YamlProcessor),
// }

// impl ProcessorType {
// }
//
// impl ProcessorType {
//     pub fn all() -> [Self; 3] {
//         [
//             ProcessorType::Json(JsonProcessor),
//             ProcessorType::Toml(TomlProcessor),
//             ProcessorType::Yaml(YamlProcessor),
//         ]
//     }
//
//     pub fn extensions(&self) -> &'static [&'static str] {
//         match self {
//             ProcessorType::Json(_) => &["json"],
//             ProcessorType::Toml(_) => &["toml"],
//             ProcessorType::Yaml(_) => &["yml", "yaml"],
//         }
//     }
//
//     pub fn matches_extension(&self, ext: &str) -> bool {
//         self.extensions().contains(&ext)
//     }
// }
//
// impl FileProcessor for ProcessorType {
//     fn validate(&self, path: &Path) -> Result<FileMetadata, MetadataError> {
//         match self {
//             ProcessorType::Json(p) => p.validate(path),
//             ProcessorType::Toml(p) => p.validate(path),
//             ProcessorType::Yaml(p) => p.validate(path),
//         }
//     }
//
//     fn convert(&self, metadata: &str) -> Result<FileMetadata, MetadataError> {
//         match self {
//             ProcessorType::Json(p) => p.convert(metadata),
//             ProcessorType::Toml(p) => p.convert(metadata),
//             ProcessorType::Yaml(p) => p.convert(metadata),
//         }
//
//     }
// }
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
        println! ("No cumple con RUNA_KEY: {}", line);
        return None;
    }
    let content = line.trim_start_matches(RUNA_KEY).trim();
    match processor{
        Some(processor) => processor.convert(content).ok(),
        None => None,
    }
}
