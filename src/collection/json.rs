use super::FileProcessor;

#[derive(Debug, Clone)]
pub struct JsonProcessor;

impl FileProcessor for JsonProcessor {
    fn validate(&self, _content: &str) {
        println!("archivo validado");
    }
}
