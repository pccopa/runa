use log::error;
use runa::ui::run_ui;

fn main() {
    dotenv::dotenv().ok();
    env_logger::init();

    let base = std::env::args()
        .nth(1)
        .unwrap_or_else(|| ".".to_string());

    if let Err(e) = run_ui(&base) {
        error!("Error en la UI: {}", e);
        std::process::exit(1);
    }
}
