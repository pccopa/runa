use serde::Serialize;

use crate::models::File;

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct KeyValDto {
    pub key: String,
    pub value: String,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RequestFileDto {
    pub uri: String,
    pub method: String,
    pub headers: Vec<KeyValDto>,
    pub params: Vec<KeyValDto>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub body_json: Option<String>,
}

impl From<File> for RequestFileDto {
    fn from(f: File) -> Self {
        let headers = f
            .headers
            .into_iter()
            .map(|(key, value)| KeyValDto { key, value })
            .collect();
        let params = f
            .params
            .into_iter()
            .map(|(key, value)| KeyValDto { key, value })
            .collect();
        let body_json = f.body.as_ref().and_then(yaml_value_to_json_string);
        RequestFileDto {
            uri: f.uri,
            method: f.method.as_str().to_string(),
            headers,
            params,
            body_json,
        }
    }
}

fn yaml_value_to_json_string(v: &serde_yaml::Value) -> Option<String> {
    let j = serde_json::to_value(v).ok()?;
    if j.is_null() {
        return None;
    }
    serde_json::to_string_pretty(&j).ok()
}
