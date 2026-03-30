use runa::bridge::{CollectionTreeDto, RequestFileDto};
use runa::filesystem::load_request_document;
use runa::filesystem::reader::read_files;
use std::path::{Path, PathBuf};

#[tauri::command]
pub fn load_collection_tree(project_path: String) -> Result<CollectionTreeDto, String> {
    let path = PathBuf::from(project_path.trim());
    let tree = read_files(&path).map_err(|e| e.to_string())?;
    Ok(CollectionTreeDto::from(&tree))
}

fn join_project_relative(base: &Path, relative_slash: &str) -> Result<PathBuf, String> {
    let mut path = base.to_path_buf();
    for seg in relative_slash.split('/').filter(|s| !s.is_empty()) {
        if seg == "." || seg == ".." {
            return Err("Ruta relativa inválida.".into());
        }
        path.push(seg);
    }
    Ok(path)
}

#[tauri::command]
pub fn load_request_file(project_path: String, relative_path: String) -> Result<RequestFileDto, String> {
    let base = PathBuf::from(project_path.trim());
    if !base.is_dir() {
        return Err("La ruta del proyecto no es un directorio.".into());
    }
    let full = join_project_relative(&base, relative_path.trim())?;
    let meta = std::fs::metadata(&full).map_err(|e| e.to_string())?;
    if !meta.is_file() {
        return Err("La ruta no apunta a un archivo.".into());
    }
    let file = load_request_document(&full)?;
    Ok(RequestFileDto::from(file))
}
