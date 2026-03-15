mod json;
mod toml;
mod yaml;

use std::path::Path;
pub use json::JsonProcessor;
pub use toml::TomlProcessor;
pub use yaml::YamlProcessor;
use std::fs::File as StdFile;
use std::io::{BufRead, BufReader};
use crate::models::FileMetadata;
use serde_yaml;

pub trait FileProcessor {
    fn validate(&self, content: &Path);
}

#[derive(Debug, Clone)]
pub enum ProcessorType {
    Json(JsonProcessor),
    Toml(TomlProcessor),
    Yaml(YamlProcessor),
}

impl ProcessorType {
    pub fn all() -> [Self; 3] {
        [
            ProcessorType::Json(JsonProcessor),
            ProcessorType::Toml(TomlProcessor),
            ProcessorType::Yaml(YamlProcessor),
        ]
    }

    pub fn extensions(&self) -> &'static [&'static str] {
        match self {
            ProcessorType::Json(_) => &["json"],
            ProcessorType::Toml(_) => &["toml"],
            ProcessorType::Yaml(_) => &["yml", "yaml"],
        }
    }

    pub fn matches_extension(&self, ext: &str) -> bool {
        self.extensions().contains(&ext)
    }
}

impl FileProcessor for ProcessorType {
    fn validate(&self, path: &Path) {
        match self {
            ProcessorType::Json(p) => p.validate(path),
            ProcessorType::Toml(p) => p.validate(path),
            ProcessorType::Yaml(p) => p.validate(path),
        }
    }
}
fn read_metadata(path: &Path) -> std::io::Result<Option<String>> {
    let file = StdFile::open(path)?;
    let mut reader = BufReader::new(file);

    let mut line = String::new();
    let bytes = reader.read_line(&mut line)?;

    if bytes == 0 {
        return Ok(None);
    }

    if let Some(metadata) = parse_metadata(&line) {
        if metadata.validate().is_ok() {
            return Ok(Some(line));
        }
    }
    Ok(None)
}

fn parse_metadata(line: &str) -> Option<FileMetadata> {
    const RUNA_KEY: &str = "# Runa Project:";
    if !line.starts_with(RUNA_KEY) {
        println! ("No cumple con RUNA_KEY: {}", line);
        return None;
    }
    let content = line.trim_start_matches(RUNA_KEY).trim();
    serde_yaml::from_str(content).ok()
}
