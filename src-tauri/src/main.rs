// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Arc;
use tauri_plugin_printer;

pub mod commands;
pub mod utils;


fn main() {


    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            commands::greetings::greet,
            commands::auth::request_otp_command,
            commands::auth::handle_login_command,
            commands::auth::check_stored_session,
            commands::auth::logout,
            commands::store::get_stores_command,
            commands::store::get_files_command,
        ])
        .plugin(tauri_plugin_printer::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
