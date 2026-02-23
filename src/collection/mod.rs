mod json;
mod toml;
mod yaml;

pub use json::JsonProcessor;
pub use toml::TomlProcessor;
pub use yaml::YamlProcessor;

pub trait FileProcessor {
    fn validate(&self, content: &str);
}

#[derive(Debug, Clone)]
pub enum ProcessorType {
    Json(JsonProcessor),
    Toml(TomlProcessor),
    Yaml(YamlProcessor),
}

impl FileProcessor for ProcessorType {
    fn validate(&self, content: &str) {
        match self {
            ProcessorType::Json(p) => p.validate(content),
            ProcessorType::Toml(p) => p.validate(content),
            ProcessorType::Yaml(p) => p.validate(content),
        }
    }
}
