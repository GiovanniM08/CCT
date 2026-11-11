# CCT
Complementary Chat Tool (CCT) is a lightweight AI chat client built with Tauri.

The application is designed to be as lightweight and efficient as possible while providing a simple interface for interacting with local or remote AI models. All conversations remain within the application and are sent only to the AI endpoint configured by the user. CCT operates entirely local on the user's machine and does not use any external services.

It supports both local AI servers (such as LM Studio) and AI-compatible APIs while maintaining a simple, private, and resource-efficient workflow.

# Run in development
``` powershell
npm run tauri dev
```

# Usage:
Insert the api key credentials: Url, Api key and model name.

(not all are mandatory, for example, connecting to LM studio locally only needs the url)

---

# LM Studio Example

LM Studio usually only requires the endpoint URL.

```text
Endpoint URL:
http://localhost:1234/v1/chat/completions

API Key:
(optional)

Model Name:
(optional)
```

---

# API Example

Example configuration for any remote AI provider:

```text
Endpoint URL:
https://provider.example.com/v1/chat/completions

API Key:
sk-********************************

Model Name:
provider-model-name
```

# Notes

- Configuration settings are automatically saved locally.
- Chat history is not persisted between application launches.
- Closing the application clears the conversation context (the context is stored in ram).