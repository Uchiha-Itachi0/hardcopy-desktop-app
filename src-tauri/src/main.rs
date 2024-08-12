// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
pub mod commands;
pub mod utils;

use tauri::command;
use std::process::Command;

#[command]
fn get_printers() -> Result<Vec<String>, String> {
    #[cfg(target_os = "windows")]
    {
        let output = Command::new("powershell")
            .arg("-Command")
            .arg("Get-Printer | Select-Object -ExpandProperty Name")
            .output()
            .map_err(|e| format!("Failed to get printers: {:?}", e))?;

        let printers = String::from_utf8_lossy(&output.stdout)
            .lines()
            .map(|s| s.to_string())
            .collect();

        return Ok(printers);
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
fn print_file(printer: String, file_data: String, copies: u32, start_page: u32, end_page: u32, color_preference: String) -> Result<(), String> {
    let decoded_data = base64::decode(&file_data)
        .map_err(|err| format!("Failed to decode base64: {:?}", err))?;

    let temp_pdf_path = std::env::temp_dir().join("temp_print_file.pdf");
    std::fs::write(&temp_pdf_path, decoded_data)
        .map_err(|err| format!("Failed to write PDF file: {:?}", err))?;

    #[cfg(target_os = "windows")]
    {
        let color_mode = if color_preference.to_lowercase() == "grayscale" { "GrayScale" } else { "Color" };

        let output = Command::new("powershell")
            .arg("-Command")
            .arg(format!(
                "Start-Process -FilePath \"{}\" -ArgumentList \"/p /h {}\"; \
                $PrintJob = Get-PrintJob -PrinterName \"{}\" | Select-Object -Last 1; \
                Set-PrintJob -PrinterName \"{}\" -Id $PrintJob.Id -Copies {}; \
                Set-PrintJob -PrinterName \"{}\" -Id $PrintJob.Id -PageRange \"{}-{}\"; \
                Set-PrintJob -PrinterName \"{}\" -Id $PrintJob.Id -ColorMode {}",
                temp_pdf_path.to_string_lossy(),
                printer,
                printer,
                printer,
                copies,
                printer,
                start_page,
                end_page,
                printer,
                color_mode
            ))
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
