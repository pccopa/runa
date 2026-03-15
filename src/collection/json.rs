use std::path::Path;
use super::FileProcessor;

#[derive(Debug, Clone)]
pub struct JsonProcessor;

impl FileProcessor for JsonProcessor {
    fn validate(&self, path: &Path) {
        println!("json archivo validado");
    }
}
