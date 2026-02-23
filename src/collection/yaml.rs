use super::FileProcessor;

#[derive(Debug, Clone)]
pub struct YamlProcessor;

impl FileProcessor for YamlProcessor {
    fn validate(&self, _content: &str) {
        println!("archivo validado");
    }
}
