const { invoke } = window.__TAURI__.core;

const messages = [];

window.addEventListener(
    "DOMContentLoaded",
    () => {

        document
            .getElementById("send-btn")
            .addEventListener(
                "click",
                handleSend
            );
    }
);

function addMessage(author, text) {

    const chat =
        document.getElementById("chat");

    const div =
        document.createElement("div");

    div.innerHTML =
        `<strong>${author}:</strong> ${text}`;

    chat.appendChild(div);
}



async function handleSend() {

    const endpoint =
        document.getElementById("endpoint-url").value;

    const apiKey =
        document.getElementById("api-key").value;

    const model =
        document.getElementById("model-name").value;

    const instructions =
        document.getElementById("instructions").value;

    const prompt =
        document.getElementById("prompt").value;

    if (!prompt.trim()) {
        return;
    }

    messages.push({
        role: "user",
        content: prompt
    });

    try {

        const result =
          await invoke(
              "send_prompt",
              {
                  endpoint,
                  apiKey,
                  model,
                  instructions,
                  messages
              }
          );

        const json =
            JSON.parse(result);

        const answer =
            json.choices[0].message.content;

        messages.push({
            role: "assistant",
            content: answer
        });

        console.log("Messages:");
        console.log(messages);

        addMessage("Usuario", prompt);
        addMessage("IA", answer);

    }
    catch(error) {

        addMessage(
            "Error",
            error.message
        );
    }
}