use std::fs;
use std::io;
use std::path::{Path, PathBuf};

use crate::collection::{get_file_processor, validate};
use crate::models::{FileMetadata, ValidMetadata};

const RUNA_MARKER: &str = ".runa";

fn dir_has_runa_marker(dir: &Path) -> bool {
    dir.join(RUNA_MARKER).is_file()
}

fn process_files_in_dir(dir: &Path, base: &Path) -> io::Result<()> {
    let entries = fs::read_dir(dir)?;
    let mut items: Vec<_> = entries.collect::<Result<_, _>>()?;
    items.sort_by_key(|e| e.file_name());

    for entry in items {
        let path = entry.path();
        let metadata = entry.metadata()?;
        // let rel = path.strip_prefix(base).unwrap_or(&path);
        // let rel_str = rel.display().to_string();

        if metadata.is_file() {
            match validate(&path) {
                Ok(FileMetadata) => { println! ("Valid file: {}", path.display()) }
                Err(_) => { println! ("Invalid file: {}", path.display()) }
            }
            // let ext = path.extension().and_then(|e| e.to_str()).unwrap_or("");
            // match get_file_processor(&path) {
            //     None => { println! ("No strategy found for file type. Ignoring."); }
            //     Some(processor) => {
            //         let result = processor.validate(&path);
            //         match result {
            //             Ok(r) => { println! ("Valid file: {}", path.display()) }
            //             Err(e) => { println! ("{}", e);}
            //         }
            //     }
            // };
        }
    }
    Ok(())
}

fn walk_tree<P: AsRef<Path>>(dir_path: P, base: &Path) -> io::Result<()> {
    let dir = dir_path.as_ref();

    let is_project = dir_has_runa_marker(dir);
    if is_project {
        let name = dir.strip_prefix(base).unwrap_or(dir);
        println!("{}/", name.display());
        process_files_in_dir(dir, dir)?;
    }

    let entries = fs::read_dir(dir)?;

    for entry in entries {
        let entry = entry?;
        let path = entry.path();
        let metadata = entry.metadata()?;

        if metadata.is_dir() {
            if !is_project || dir_has_runa_marker(&path) {
                walk_tree(&path, base)?;
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
        println!("{}/ no es proyecto Runa", base.display());
        return Ok(());
    }
    walk_tree(&base, &base)?;
    Ok(())
}
