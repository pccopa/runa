use std::fs;
use std::io;
use std::path::{Path, PathBuf};
use log::{debug, info};
use crate::collection::validate;
use crate::models::files::NodeType;
use crate::models::Tree;

const RUNA_MARKER: &str = ".runa";

fn dir_has_runa_marker(dir: &Path) -> bool {
    dir.join(RUNA_MARKER).is_file()
}

fn process_files_in_dir(dir: &Path, _base: &Path, tree: &mut Tree, dir_idx: usize) -> io::Result<()> {
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
                    let nombre = path
                        .file_name()
                        .map(|n| n.to_string_lossy())
                        .unwrap_or_else(|| "".into());
                    tree.add_node(Some(dir_idx), nombre.into_owned(), NodeType::File, Some(m));
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
    let mut current_parent_idx = parent;

    if is_project {
        let name = dir.strip_prefix(base).unwrap_or(dir);
        let directory = name
            .file_name()
            .map(|n| n.to_string_lossy())
            .unwrap_or_else(|| "".into());
        let dir_idx = tree.add_node(parent, directory.into_owned(), NodeType::Directory, None);
        debug!("{}/", name.display());
        process_files_in_dir(dir, dir, tree, dir_idx)?;
        current_parent_idx = Some(dir_idx);
    }

    let entries = fs::read_dir(dir)?;

    for entry in entries {
        let entry = entry?;
        let path = entry.path();
        let metadata = entry.metadata()?;

        if metadata.is_dir() {
            if !is_project || dir_has_runa_marker(&path) {
                walk_tree(&path, base, tree, current_parent_idx)?;
            }
        }
    }

    Ok(())
}

pub fn read_files<P: AsRef<Path>>(dir_path: P) -> io::Result<Tree> {
    let base = dir_path
        .as_ref()
        .canonicalize()
        .unwrap_or_else(|_| PathBuf::from(dir_path.as_ref()));

    let mut tree = Tree::new(base.clone());
    if !dir_has_runa_marker(&base) {
        debug!("{}/ no es proyecto Runa", base.display());
        return Ok(tree);
    }
    walk_tree(&base, &base, &mut tree, None)?;
    Ok(tree)
}
