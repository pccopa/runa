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
    fn validate(&self, content: &str) {
        match self {
            ProcessorType::Json(p) => p.validate(content),
            ProcessorType::Toml(p) => p.validate(content),
            ProcessorType::Yaml(p) => p.validate(content),
        }
    }
}
