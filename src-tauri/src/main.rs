use tauri_plugin_printer;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_printer::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
