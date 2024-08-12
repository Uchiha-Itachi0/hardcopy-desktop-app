// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
pub mod commands;
pub mod utils;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            commands::greetings::greet,
            commands::auth::request_otp_command,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
