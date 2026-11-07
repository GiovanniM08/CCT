window.addEventListener(
    "DOMContentLoaded",
    () => {

        const button =
            document.getElementById("send-btn");

        const promptInput =
            document.getElementById("prompt");

        const chat =
            document.getElementById("chat");

        button.addEventListener(
            "click",
            () => {

                const prompt =
                    promptInput.value;

                if (!prompt.trim()) {
                    return;
                }

                const div =
                    document.createElement("div");

                div.className =
                    "user-message";

                div.textContent =
                    prompt;

                chat.appendChild(div);

                promptInput.value = "";
            }
        );
    }
);