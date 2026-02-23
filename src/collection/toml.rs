use super::FileProcessor;

#[derive(Debug, Clone)]
pub struct TomlProcessor;

impl FileProcessor for TomlProcessor {
    fn validate(&self, _content: &str) {
        println!("archivo validado");
    }
}
