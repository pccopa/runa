//! Punto de encuentro futuro entre el núcleo Rust y la UI (Tauri / IPC).
//! La aplicación de escritorio se ejecuta con `npm run tauri dev` en la raíz del repo.

use std::path::Path;

/// Entrada histórica del binario `runa`; la interfaz vive en el proceso Tauri.
pub fn run_ui(_base: impl AsRef<Path>) -> Result<(), String> {
    Err(
        "La interfaz gráfica es la app Tauri + React. Desde la raíz del repositorio ejecuta: npm install && npm run tauri dev"
            .into(),
    )
}
