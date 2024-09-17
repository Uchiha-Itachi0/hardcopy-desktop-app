use reqwest::Client;
use serde::{Deserialize, Serialize};
use crate::utils::base_url::BASE_URL;
use crate::commands::auth::load_token;
/// Data model for the store request.
#[derive(Serialize)]
pub struct GetOrderRequestModel {
    storeId: String,
    pageNumber: u32,
}

#[derive(Serialize)]
pub struct GetFilesRequestModel {
    id: Vec<String>
}

#[derive(Serialize, Deserialize)]
pub struct Order {
    id: u32,
    orderStatus: String,
    fileNames: Vec<String>,
    localDateTime: String,
    orderAmount: f64,
    userId: String,
    userName: String,
}

#[derive(Serialize, Deserialize)]
pub struct CommonErrorResponse {
    message: String,
    success: bool,
}

#[derive(Serialize, Deserialize)]
pub struct FileModel {
    fileName: String,
    fileType: String,
    color: String,
    startPage: String,
    endPage: String,
    numberOfCopies: u32
}

#[derive(Serialize, Deserialize)]
pub struct GetFileResponseModel {
    files: Vec<FileModel>,
    unableToFetch: Vec<String>
}

async fn get_stores(request_data: GetOrderRequestModel, token: &str) -> Result<Vec<Order>, CommonErrorResponse> {
    let client = Client::new();
    let url = format!("{}/api/order/getByStore", BASE_URL);

    let response = client.post(&url)
        .bearer_auth(token)
        .json(&request_data)
        .send()
        .await;

    match response {
        Ok(resp) => {
            if resp.status().is_success() {
                let response_data: Result<Vec<Order>, _> = resp.json().await;
                match response_data {
                    Ok(data) => Ok(data),
                    Err(_) => Err(CommonErrorResponse {
                        message: "Failed to parse successful response".to_string(),
                        success: false,
                    })
                }
            } else {
                let error_data: Result<CommonErrorResponse, _> = resp.json().await;
                match error_data {
                    Ok(data) => Err(data),
                    Err(_) => Err(CommonErrorResponse {
                        message: "Failed to parse error response".to_string(),
                        success: false,
                    })
                }
            }
        },
        Err(_) => Err(CommonErrorResponse {
            message: "Failed to reach server".to_string(),
            success: false,
        })
    }
}

async fn get_files_by_id(request_data: GetFilesRequestModel, token: &str) -> Result<GetFileResponseModel ,CommonErrorResponse> {
    let client: Client = Client::new();
    let url: String = format!("{}/api/file/getById", BASE_URL);

    let response = client.post(&url)
        .bearer_auth(token)
        .json(&request_data)
        .send()
        .await;

    match response {
        Ok(resp) => {
            if resp.status().is_success() {
                let response_data: Result<GetFileResponseModel, _> = resp.json().await;
                match response_data {
                    Ok(data) => Ok(data),
                    Err(_) => Err(CommonErrorResponse {
                        message: "Failed to parse successful Response".to_string(),
                        success: false,
                    })
                }
            } else {
                let error_data: Result<CommonErrorResponse, _> = resp.json().await;
                match error_data {
                    Ok(data) => Err(data),
                    Err(_) => Err(CommonErrorResponse {
                        message: "Failed to Parse the Error Response".to_string(),
                        success: false,
                    })
                }
            }
        }
        Err(_) => Err(CommonErrorResponse {
            message: "Failed to reach the server".to_string(),
            success: false,
        })
    }

}

#[tauri::command]
pub async fn get_stores_command(app_handle: tauri::AppHandle, page_number: u32) -> Result<Vec<Order>, CommonErrorResponse> {
    // Load the stored token
    let stored_token = load_token(&app_handle);

    match stored_token {
        Some(token_data) => {
            let request_data = GetOrderRequestModel {
                storeId: token_data.store_id,
                pageNumber: page_number,
            };

            get_stores(request_data, &token_data.token).await
        },
        None => Err(CommonErrorResponse {
            message: "No stored token found. Please log in.".to_string(),
            success: false,
        })
    }
}

#[tauri::command]
pub async fn get_files_command(app_handle: tauri::AppHandle, file_ids: Vec<String>) -> Result<GetFileResponseModel, CommonErrorResponse> {
    // Load the stored token
    let stored_token = load_token(&app_handle);

    match stored_token {
        Some(token_data) => {
            // Prepare the request data
            let request_data = GetFilesRequestModel {
                id: file_ids,
            };

            // Call the `get_files_by_id` function, passing the token
            get_files_by_id(request_data, &token_data.token).await
        },
        None => Err(CommonErrorResponse {
            message: "No stored token found. Please log in.".to_string(),
            success: false,
        }),
    }
}
