use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::error::Error;
use crate::utils::base_url::BASE_URL;

/// Data model for the OTP request.
#[derive(Serialize)]
struct OTPRequestModel {
    mobileNumber: String,
}

/// Data model for the OTP response.
#[derive(Deserialize, Serialize)]
pub struct OTPResponseModel {
    pub success: bool,
    pub message: String,
    // pub status: u16,
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

    let status = response.status().as_u16();

    if response.status().is_success() {
        let response_data: OTPResponseModel = response.json().await?;
        Ok(OTPResponseModel {
            success: response_data.success,
            message: response_data.message,
            // status,
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
            // status,
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
