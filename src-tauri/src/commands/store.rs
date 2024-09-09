use reqwest::Client;
use serde::{Deserialize, Serialize};
use crate::utils::base_url::BASE_URL;
use crate::commands::auth::load_token;
/// Data model for the store request.
#[derive(Serialize)]
pub struct GetStoreRequestModel {
    storeId: String,
    pageNumber: u32,
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
pub struct GetOrderErrorResponseModel {
    message: String,
    success: bool,
}

async fn get_stores(request_data: GetStoreRequestModel, token: &str) -> Result<Vec<Order>, GetOrderErrorResponseModel> {
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
                    Err(_) => Err(GetOrderErrorResponseModel {
                        message: "Failed to parse successful response".to_string(),
                        success: false,
                    })
                }
            } else {
                let error_data: Result<GetOrderErrorResponseModel, _> = resp.json().await;
                match error_data {
                    Ok(data) => Err(data),
                    Err(_) => Err(GetOrderErrorResponseModel {
                        message: "Failed to parse error response".to_string(),
                        success: false,
                    })
                }
            }
        },
        Err(_) => Err(GetOrderErrorResponseModel {
            message: "Failed to reach server".to_string(),
            success: false,
        })
    }
}

#[tauri::command]
pub async fn get_stores_command(app_handle: tauri::AppHandle, page_number: u32) -> Result<Vec<Order>, GetOrderErrorResponseModel> {
    // Load the stored token
    let stored_token = load_token(&app_handle);

    match stored_token {
        Some(token_data) => {
            let request_data = GetStoreRequestModel {
                storeId: token_data.store_id,
                pageNumber: page_number,
            };

            get_stores(request_data, &token_data.token).await
        },
        None => Err(GetOrderErrorResponseModel {
            message: "No stored token found. Please log in.".to_string(),
            success: false,
        })
    }
}