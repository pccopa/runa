use log::{error, info};
use runa::filesystem::read_files;

fn main() {
    dotenv::dotenv().ok();
    env_logger::init();

    let base = std::env::args()
        .nth(1)
        .unwrap_or_else(|| ".".to_string());

    let result = read_files(&base);
    match result {
        Ok(content) => { info!("{:#?}", content) },
        Err(err) => {
            error!("Error: {}", err);
            std::process::exit(1);
        }
    }
}
