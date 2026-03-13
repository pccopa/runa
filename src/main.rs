use runa::filesystem::read_files;

fn main() {
    let base = std::env::args()
        .nth(1)
        .unwrap_or_else(|| ".".to_string());

    if let Err(e) = read_files(base) {
        eprintln!("Error: {}", e);
        std::process::exit(1);
    }
}
