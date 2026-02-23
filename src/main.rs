use runa::filesystem::{read_files, write_file};

fn main() {
    let dir = std::env::args()
        .nth(1)
        .unwrap_or_else(|| ".".to_string());

    let path = std::env::args()
        .nth(2)
        .unwrap_or_else(|| "".to_string());

    let file = std::env::args()
        .nth(3)
        .unwrap_or_else(|| "".to_string());

    if let Err(e) = read_files(dir) {
        eprintln!("Error: {}", e);
        std::process::exit(1);
    }

    if let Err(e) = write_file(&path, &file) {
        eprintln!("Error: {}", e);
        std::process::exit(1);
    }
}
