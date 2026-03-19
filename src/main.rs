use log::error;
use runa::filesystem::read_files;

fn main() {
    dotenv::dotenv().ok();
    env_logger::init();

    let base = std::env::args()
        .nth(1)
        .unwrap_or_else(|| ".".to_string());

    if let Err(e) = read_files(base) {
        error!("Error: {}", e);
        std::process::exit(1);
    }
}
