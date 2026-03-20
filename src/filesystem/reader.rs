use std::fmt::Debug;
use std::fs;
use std::io;
use std::path::{Path, PathBuf};
use log::{debug, error, info};
use crate::collection::validate;
use crate::models::files::NodeType;
use crate::models::Tree;

const RUNA_MARKER: &str = ".runa";

fn dir_has_runa_marker(dir: &Path) -> bool {
    dir.join(RUNA_MARKER).is_file()
}

fn process_files_in_dir(dir: &Path, base: &Path, tree: &mut Tree, dir_idx: usize) -> io::Result<()> {
    let entries = fs::read_dir(dir)?;
    let mut items: Vec<_> = entries.collect::<Result<_, _>>()?;
    items.sort_by_key(|e| e.file_name());

    for entry in items {
        let path = entry.path();
        let metadata = entry.metadata()?;

        if metadata.is_file() {
            match validate(&path) {
                Ok(m) => {
                    debug! ("Valid file: {}", path.display());
                    info!("{:#?}", m);
                    let nombre = path.file_name().unwrap().to_string_lossy().to_string();
                    tree.add_node(Some(dir_idx), nombre, NodeType::File, Some(m));
                }
                Err(_) => { debug! ("Invalid file: {}", path.display()) }
            }
        }
    }
    Ok(())
}

fn walk_tree<P: AsRef<Path>>(dir_path: P, base: &Path, tree: &mut Tree, parent: Option<usize>) -> io::Result<()> {
    let dir = dir_path.as_ref();

    let is_project = dir_has_runa_marker(dir);
    let mut current_project_idx = parent;

    if is_project {
        let name = dir.strip_prefix(base).unwrap_or(dir);
        let directory = name.to_str().unwrap();
        let dir_idx = tree.add_node(parent, directory.to_string(), NodeType::Directory, None);
        debug!("{}/", name.display());
        process_files_in_dir(dir, dir, tree, dir_idx)?;
        current_project_idx = Some(dir_idx);
    }

    let entries = fs::read_dir(dir)?;

    for entry in entries {
        let entry = entry?;
        let path = entry.path();
        let metadata = entry.metadata()?;

        if metadata.is_dir() {
            if !is_project || dir_has_runa_marker(&path) {
                walk_tree(&path, base, tree, current_project_idx)?;
            }
        }
    }

    Ok(())
}

pub fn read_files<P: AsRef<Path>>(dir_path: P) -> io::Result<()> {
    let base = dir_path
        .as_ref()
        .canonicalize()
        .unwrap_or_else(|_| PathBuf::from(dir_path.as_ref()));

    if !dir_has_runa_marker(&base) {
        debug!("{}/ no es proyecto Runa", base.display());
        return Ok(());
    }
    let mut tree = Tree::new(base.clone());
    walk_tree(&base, &base, &mut tree, None)?;
    info!("{:#?}", tree);
    Ok(())
}
