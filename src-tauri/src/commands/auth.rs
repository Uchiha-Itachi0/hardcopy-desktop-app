use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::error::Error;
use crate::utils::base_url::BASE_URL;
use std::fs;
use std::path::PathBuf;
use tauri::api::path::app_data_dir;

/// Data model for the OTP request.
#[derive(Serialize)]
pub struct OTPRequestModel {
    mobileNumber: String,
}

/// Data model for the OTP response.
#[derive(Deserialize, Serialize)]
pub struct OTPResponseModel {
    pub success: bool,
    pub message: String,
    // pub status: u16,
}

/// Data model for the Login Request
#[derive(Serialize, Debug)]
pub struct LoginRequestModel {
    mobileNumber: String,
    otp: String
}

#[derive(Serialize, Deserialize)]
pub struct LoginSuccessResponseModel {
    message: String,
    success: bool,
    data: LoginData,
}

#[derive(Serialize, Deserialize)]
pub struct LoginData {
    token: String,
    storeId: String,
}

#[derive(Serialize, Deserialize)]
pub struct LoginErrorResponseModel {
    message: String,
    success: bool,
}

#[derive(Serialize, Deserialize)]
pub struct StoredToken {
    pub(crate) token: String,
    pub(crate) store_id: String,
}

pub fn get_token_file_path(app_handle: &tauri::AppHandle) -> PathBuf {
    let app_data_dir = app_data_dir(&app_handle.config()).expect("Failed to get app data directory");
    app_data_dir.join("user_session.json")
}

/// Save token and store_id to a file.
pub fn save_token(app_handle: &tauri::AppHandle, token: &str, store_id: &str) -> Result<(), Box<dyn std::error::Error>> {
    let token_data = StoredToken {
        token: token.to_string(),
        store_id: store_id.to_string(),
    };

    // Convert token data to JSON.
    let token_json = serde_json::to_string(&token_data)?;

    // Get file path for token storage.
    let file_path = get_token_file_path(app_handle);

    // Get the directory path and create it if it doesn't exist.
    if let Some(parent_dir) = file_path.parent() {
        if !parent_dir.exists() {
            fs::create_dir_all(parent_dir)?; // Create directory if it doesn't exist.
        }
    }

    // Write the token JSON data to the file.
    fs::write(file_path, token_json)?;

    Ok(())
}

pub fn load_token(app_handle: &tauri::AppHandle) -> Option<StoredToken> {
    let file_path = get_token_file_path(app_handle);
    fs::read_to_string(file_path)
        .ok()
        .and_then(|token_json| serde_json::from_str::<StoredToken>(&token_json).ok())
}

/// Sends an OTP request to the server.
///
/// # Arguments
///
/// * `otp_request_data` - A struct containing the mobile number for the OTP request.
///
/// # Returns
///
/// * A result containing an `OTPResponseModel` or an error if the request fails.
async fn request_otp(otp_request_data: OTPRequestModel) -> Result<OTPResponseModel, Box<dyn Error>> {
    let client = Client::new();
    let url = format!("{}/api/auth/requestOtp/store", BASE_URL);

    let response = client.post(&url)
        .json(&otp_request_data)
        .send()
        .await?;


    if response.status().is_success() {
        let response_data: OTPResponseModel = response.json().await?;
        Ok(OTPResponseModel {
            success: response_data.success,
            message: response_data.message,
        })
    } else {
        let error_message = if let Ok(error_data) = response.json::<OTPResponseModel>().await {
            error_data.message
        } else {
            "Something went wrong. We are trying to fix the issue".to_string()
        };
        Ok(OTPResponseModel {
            success: false,
            message: error_message,
        })
    }
}

/// Sends an OTP request to the server.
///
/// # Arguments
///
/// * `otp_request_data` - A struct containing the mobile number for the OTP request.
///
/// # Returns
///
/// * A result containing an `OTPResponseModel` or an error if the request fails.

async fn handle_login(login_request_data: LoginRequestModel) -> Result<LoginSuccessResponseModel, LoginErrorResponseModel> {
    let client: Client = Client::new();
    let url: String = format!("{}/api/auth/login/store", BASE_URL);

    let response = client.post(&url)
        .json(&login_request_data)
        .send()
        .await;

    match response {
        Ok(resp) => {
            if resp.status().is_success() {
                let response_data: Result<LoginSuccessResponseModel, _> = resp.json().await;
                match response_data {
                    Ok(data) => Ok(data),
                    Err(_) => Err(LoginErrorResponseModel {
                        message: "Failed to parse successful response".to_string(),
                        success: false,
                    })
                }
            } else {
                let error_data: Result<LoginErrorResponseModel, _> = resp.json().await;
                match error_data {
                    Ok(data) => Err(data),
                    Err(_) => Err(LoginErrorResponseModel {
                        message: "Failed to parse error response".to_string(),
                        success: false,
                    })
                }
            }
        },
        Err(_) => Err(LoginErrorResponseModel {
            message: "Failed to reach server".to_string(),
            success: false,
        })
    }
}

/// Tauri command to handle OTP requests.
///
/// # Arguments
///
/// * `mobile_number` - The mobile number for which to request an OTP.
///
/// # Returns
///
/// * A result containing an `OTPResponseModel` or an error message.
#[tauri::command]
pub async fn request_otp_command(mobile_number: String) -> Result<OTPResponseModel, OTPResponseModel> {
    let otp_request_data = OTPRequestModel {
        mobileNumber: format!("+91{}", mobile_number),
    };
    match request_otp(otp_request_data).await {
        Ok(response) => Ok(response),
        Err(e) => Err(OTPResponseModel {
            success: false,
            message: e.to_string(),
            // status: 501
        }),
    }
}

/// Tauri command to handle login requests from the front end.
///
/// # Arguments
///
/// * `mobile_number` - The mobile number for which to request an OTP.
/// * `otp` - The OTP to be verified.
///
/// # Returns
///
/// * A result containing either a `LoginSuccessResponseModel` or a `LoginErrorResponseModel`.
#[tauri::command]
pub async fn handle_login_command(app_handle: tauri::AppHandle, mobile_number: String, otp: String) -> Result<LoginSuccessResponseModel, LoginErrorResponseModel> {
    let login_request_data = LoginRequestModel {
        mobileNumber: format!("+91{}", mobile_number),
        otp,
    };

    match handle_login(login_request_data).await {
        Ok(response) => {
            if let Err(e) = save_token(&app_handle, &response.data.token, &response.data.storeId) {
                eprintln!("Failed to save token: {}", e);
            }
            Ok(response)
        },
        Err(error) => Err(error),
    }
}

#[tauri::command]
pub fn check_stored_session(app_handle: tauri::AppHandle) -> Option<StoredToken> {
    load_token(&app_handle)
}

#[tauri::command]
pub fn logout(app_handle: tauri::AppHandle) -> Result<(), String> {
    let file_path = get_token_file_path(&app_handle);
    fs::remove_file(file_path).map_err(|e| e.to_string())
}
