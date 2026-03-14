# Mock API payloads

This folder contains static JSON payloads that mirror the requests and responses for the chat backend, so you can reference realistic examples while the live APIs are not yet wired or are unstable.

| File | Description |
| ---- | ----------- |
| `conversations.json` | Sample `GET /api/conversations/user/{userId}` response listing existing conversations. |
| `messages.json` | Sample `GET /api/messages/{conversationId}` response. |
| `users-tenant-13.json` | Sample `GET http://localhost:4000/api/v1/auth/tenants/13/users` response. |
| `create-conversation-request.json` | Example body for `POST /api/conversations`. |
| `send-message-request.json` | Example body for `POST /api/messages`. |
| `mark-message-read-request.json` | Example body for `PUT /api/messages/read`. |
