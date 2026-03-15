use std::path::Path;
use super::FileProcessor;

#[derive(Debug, Clone)]
pub struct TomlProcessor;

impl FileProcessor for TomlProcessor {
    fn validate(&self, path: &Path) {
        println!("toml archivo validado");
    }
}
