use std::io;
use std::path::Path;

pub fn write_file<P: AsRef<Path>>(path: &P, content: &str) -> io::Result<()> {
    let path = path.as_ref();
    if path.exists() {
        if path.is_file() {
            println!("{} is a file", path.display());
        } else { println!("{} is a directory", path.display()) }
    } else { println!("{} not exists", path.display()) }
    println!("{}", content);
    return Ok(());
}
