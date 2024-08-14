// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
pub mod commands;
pub mod utils;

use base64::decode;
use std::process::Command;
use tauri::command;
use std::fs::File;
use std::io::Write;
use base64::{Engine as _, engine::general_purpose};

#[command]
fn get_printers() -> Result<Vec<String>, String> {
    #[cfg(target_os = "windows")]
    {
        let output = Command::new("wmic")
            .args(&["printer", "get", "name"])
            .output()
            .map_err(|e| format!("Failed to get printers: {:?}", e))?;

        let printers = String::from_utf8_lossy(&output.stdout)
            .lines()
            .skip(1) // Skip the header
            .filter(|s| !s.trim().is_empty())
            .map(|s| s.trim().to_string())
            .collect();

        Ok(printers)
    }

    #[cfg(target_os = "macos")]
    #[cfg(target_os = "linux")]
    {
        let output = Command::new("lpstat")
            .arg("-p")
            .output()
            .map_err(|e| format!("Failed to get printers: {:?}", e))?;

        let printers = String::from_utf8_lossy(&output.stdout)
            .lines()
            .filter_map(|line| line.split_whitespace().nth(1).map(String::from))
            .collect();

        return Ok(printers);
    }
}

#[command]
fn print_file(
    printer: String,
    file_data: String,
    copies: u32,
    start_page: u32,
    end_page: u32,
    color_preference: String,
) -> Result<(), String> {
    let decoded_data = general_purpose::STANDARD.decode(&file_data)
        .map_err(|err| format!("Failed to decode base64: {:?}", err))?;

    let temp_pdf_path = std::env::temp_dir().join("temp_print_file.pdf");
    let mut file = File::create(&temp_pdf_path)
        .map_err(|err| format!("Failed to create PDF file: {:?}", err))?;
    file.write_all(&decoded_data)
        .map_err(|err| format!("Failed to write PDF file: {:?}", err))?;

    #[cfg(target_os = "windows")]
    {
        let mut args = vec![
            "/C".to_string(),
            "print".to_string(),
            "/d:".to_string() + &printer,
        ];

        if copies > 1 {
            args.push(format!("/n:{}", copies));
        }

        if start_page != 1 || end_page != u32::MAX {
            args.push(format!("/pages:{}-{}", start_page, end_page));
        }

        if color_preference.to_lowercase() == "grayscale" {
            args.push("/grayscale".to_string());
        }

        args.push(temp_pdf_path.to_string_lossy().to_string());

        let output = Command::new("cmd")
            .args(&args)
            .output()
            .map_err(|err| format!("Failed to execute print command: {:?}", err))?;

        if !output.status.success() {
            return Err(format!(
                "Print command failed: {}",
                String::from_utf8_lossy(&output.stderr)
            ));
        }
    }

    #[cfg(target_os = "macos")]
    #[cfg(target_os = "linux")]
    {
        let mut command = Command::new("lp");

        command
            .arg("-d")
            .arg(&printer)
            .arg("-n")
            .arg(copies.to_string())
            .arg("-P")
            .arg(format!("{}-{}", start_page, end_page));

        if color_preference.to_lowercase() == "grayscale" {
            command.arg("-o").arg("ColorModel=Gray");
        }

        command.arg(temp_pdf_path.to_string_lossy().to_string());

        let output = command.output().map_err(|err| format!("Failed to execute print command: {:?}", err))?;

        if !output.status.success() {
            return Err(format!(
                "Print command failed: {}",
                String::from_utf8_lossy(&output.stderr)
            ));
        }
    }

    std::fs::remove_file(temp_pdf_path)
        .map_err(|err| format!("Failed to delete temporary file: {:?}", err))?;

    Ok(())
}
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            commands::greetings::greet,
            commands::auth::request_otp_command,
            get_printers, print_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
