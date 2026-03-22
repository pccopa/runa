use runa::bridge::CollectionTreeDto;
use runa::filesystem::reader::read_files;
use std::path::PathBuf;

#[tauri::command]
pub fn load_collection_tree(project_path: String) -> Result<CollectionTreeDto, String> {
    let path = PathBuf::from(project_path.trim());
    let tree = read_files(&path).map_err(|e| e.to_string())?;
    Ok(CollectionTreeDto::from(&tree))
}
