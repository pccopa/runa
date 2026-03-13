use crate::models::Method;
use serde::Deserialize;
use serde_yaml::Value;

#[derive(Debug, Deserialize)]
pub struct File {
    uri: String,
    headers: Vec<(String, String)>,
    params: Vec<(String, String)>,
    method: Method,
    body: Option<Value>,
    documentation: Option<String>,

}
