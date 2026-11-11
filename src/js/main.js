const { invoke } = window.__TAURI__.core;

const messages = [];
let isLoading = false;
let lastAnswer = "";

window.addEventListener(
    "DOMContentLoaded",
    () => {
        loadSettings()
        document
            .getElementById("send-btn")
            .addEventListener("click", handleSend);
        
        document
            .getElementById("prompt")
            .addEventListener(
                "keydown",
                (event) => {
                    if (
                        event.key === "Enter" &&
                        !event.shiftKey
                    ) {
                        event.preventDefault();
                        handleSend();
                    }
                }
            );
        document
            .getElementById("copy-btn")
            .addEventListener("click", copyAnswer);
        document
            .getElementById("save-btn")
            .addEventListener("click", saveConfiguration);

        const unlimited = document.getElementById("unlimited-memory");
        const limit =document.getElementById("memory-limit");
        unlimited.addEventListener("change", () => {
            limit.disabled = unlimited.checked;
        });
        limit.disabled = unlimited.checked;
    }
);

function renderConversation(prompt, answer) {
    const chat =
        document.getElementById("chat");

    chat.innerHTML =
        `<div class="user-message"><strong>User: </strong>${prompt}</div>
         <div class="assistant-message"><strong>AI:</strong></div>
         <div class="assistant-content">${answer}</div>`;
}




async function handleSend() {
    if (isLoading) { //avoid sending 2 messages at once
        return;
    }
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

    if (!endpoint.trim()) {
        alert("Missing endpoint.");
        return;
    }
    
    const memoryLimit = Number(document.getElementById("memory-limit").value);
    if (!Number.isInteger(memoryLimit) || memoryLimit < 0) {
        alert("Memory limit must be a positive integer.");
        return;
    }

    saveSettings();
    setLoading(true);

    messages.push({
        role: "user",
        content: prompt
    });

    const unlimited = document.getElementById("unlimited-memory").checked;

    if (!unlimited) {
        const maxIterations = Number(document.getElementById("memory-limit").value);
        const maxMessages = maxIterations * 2 + 1;

        while (messages.length > maxMessages) { // removes the oldest whole iteration from the memory
            messages.shift(); 
            if (messages.length > 0) {
                messages.shift();
            }
        }
    }

    try {
        setLoading(true);
        const result = await invoke(
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

        lastAnswer = answer;

        messages.push({
            role: "assistant",
            content: answer
        });

        document.getElementById("prompt").value = ""; // cleans the writing box

        console.log("Messages:");
        console.log(messages);

        renderConversation(prompt, answer);
    }
    catch(error) {
        renderConversation(prompt, "Error: No AI connected.");
        console.error(error);
    }
    finally {
      setLoading(false);
    }
}

// to visually change the button
function setLoading(loading) {
    isLoading = loading;

    const button =
        document.getElementById("send-btn");
    const prompt =
        document.getElementById("prompt");

    if (loading) {
        button.textContent = "Wait";
        button.disabled = true;
        prompt.disabled = true;
    } else {
        button.textContent = "Send";
        button.disabled = false;
        prompt.disabled = false;
    }
}

const answer =
    json.choices[0].message.content;

lastAnswer = answer;

async function copyAnswer() {
    if (!lastAnswer) {
        return;
    }
    await navigator.clipboard.writeText(lastAnswer);
    const button = document.getElementById("copy-btn");
    button.textContent = "Copied!";
    setTimeout(() => {button.textContent = "Copy AI Response";}, 1500);
}

function loadSettings() {
    document.getElementById("endpoint-url").value = localStorage.getItem("endpoint-url") ?? "";

    document.getElementById("api-key").value = localStorage.getItem("api-key") ?? "";

    document.getElementById("model-name").value = localStorage.getItem("model-name") ?? "";

    document.getElementById("memory-limit").value = localStorage.getItem("memory-limit") ?? "40";

    document.getElementById("unlimited-memory").checked = localStorage.getItem("unlimited-memory") === "true";

    document.getElementById("instructions").value = localStorage.getItem("instructions") ?? "";
}

function saveSettings() {
    localStorage.setItem("endpoint-url", document.getElementById("endpoint-url").value);

    localStorage.setItem("api-key", document.getElementById("api-key").value);

    localStorage.setItem("model-name", document.getElementById("model-name").value);

    localStorage.setItem("memory-limit", document.getElementById("memory-limit").value);

    localStorage.setItem("unlimited-memory", document.getElementById("unlimited-memory").checked);

    localStorage.setItem("instructions", document.getElementById("instructions").value);
}

function saveConfiguration() {
    saveSettings();
    const button = document.getElementById("save-btn");
    button.textContent = "Saved!";
    setTimeout(() => {button.textContent = "Save Configuration";}, 1500);
}

