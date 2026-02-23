use std::fs;
use std::io;
use std::path::{Path, PathBuf};

fn walk_tree<P: AsRef<Path>>(dir_path: P, base: &Path) -> io::Result<()> {
    let entries = fs::read_dir(dir_path)?;

    let mut items: Vec<_> = entries.collect::<Result<_, _>>()?;
    items.sort_by_key(|e| e.file_name());

    for entry in items {
        let path = entry.path();
        let metadata = entry.metadata()?;
        let rel = path.strip_prefix(base).unwrap_or(&path);
        let rel_str = rel.display().to_string();

        if metadata.is_file() {
            println!("{}", rel_str);
        } else if metadata.is_dir() {
            println!("{}/", rel_str);
            walk_tree(&path, base)?;
        }
    }

    Ok(())
}

pub fn read_files<P: AsRef<Path>>(dir_path: P) -> io::Result<()> {
    let base = dir_path
        .as_ref()
        .canonicalize()
        .unwrap_or_else(|_| PathBuf::from(dir_path.as_ref()));
    println!("{}/", base.display());
    walk_tree(&base, &base)?;
    Ok(())
}
