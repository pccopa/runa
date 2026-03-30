use std::fs;
use std::path::Path;

use crate::models::File;

/// Lee un archivo Runa (primera línea metadatos `# Runa Project:`) y deserializa el cuerpo YAML como `File`.
pub fn load_request_document(path: &Path) -> Result<File, String> {
    let raw = fs::read_to_string(path).map_err(|e| e.to_string())?;
    let first_nl = raw
        .find('\n')
        .ok_or_else(|| "Archivo inválido: falta el cuerpo YAML tras la línea de metadatos.".to_string())?;
    let yaml_part = raw[first_nl + 1..].trim_start();
    if yaml_part.is_empty() {
        return Err("Archivo inválido: cuerpo YAML vacío.".to_string());
    }
    serde_yaml::from_str::<File>(yaml_part).map_err(|e| format!("YAML: {e}"))
}
