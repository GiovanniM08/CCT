use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct Message {
    role: String,
    content: String,
}

#[tauri::command]
async fn send_prompt(
    endpoint: String,
    api_key: String,
    model: String,
    instructions: String,
    messages: Vec<Message>,
) -> Result<String, String> {

    let client = reqwest::Client::new();

    let mut request_messages = vec![
        serde_json::json!({
            "role": "system",
            "content": instructions
        })
    ];

    for msg in messages {
        request_messages.push(
            serde_json::json!({
                "role": msg.role,
                "content": msg.content
            })
        );
    }

    let response = client
        .post(endpoint)
        .header(
            "Content-Type",
            "application/json"
        )
        .header(
            "Authorization",
            format!("Bearer {}", api_key)
        )
        .json(
            &serde_json::json!({
                "model": model,
                "messages": request_messages
            })
        )
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let body: serde_json::Value =
        response
            .json()
            .await
            .map_err(|e| e.to_string())?;

    Ok(body.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(
            tauri::generate_handler![
                send_prompt
            ]
        )
        .run(tauri::generate_context!())
        .expect(
            "error while running tauri application"
        );
}
