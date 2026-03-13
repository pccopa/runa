use super::FileProcessor;
use crate::models::File;
use serde_yaml;

#[derive(Debug, Clone)]
pub struct YamlProcessor;

impl FileProcessor for YamlProcessor {
    fn validate(&self, content: &str) {
        match serde_yaml::from_str::<File>(content) {
            Ok(file) => {
                println!("{:?}", file);
            }
            Err(err) => {
                eprintln!("Invalid YAML file: {}", err);
            }
        }
    }
}
