use std::path::Path;
use super::{read_metadata, FileProcessor};

#[derive(Debug, Clone)]
pub struct YamlProcessor;

impl FileProcessor for YamlProcessor {
    fn validate(&self, path: &Path) {
        match read_metadata(&path) {
            Ok(Some(line)) => {
                println!("Valid file for Runa project");
            },
            Ok(None) => {
                println!("Invalid file for Runa project")
            },
            Err(err)=> {
                println!("Invalid file metadata {:?}", err);
            }
        }
    }
}

