## 🛠️ PayPal Developer Sandbox & AI Integration Architecture

### 1. PayPal Developer Platform (Sandbox)
- **Environment**: Configured for PayPal Developer Sandbox (`https://api-m.sandbox.paypal.com`).
- **APIs Used**: PayPal Orders v2 REST API for automated intent creation, capture, and settlement.
- **Workflow**: Autonomous verification of AI agent invoice authorization requests using Sandbox Client Credentials (`PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET`).

### 2. AI Reasoning & Guardrails
- **Model / Engine**: Multi-step AI agent orchestration powered by Google Gemini API / LLM decision engine.
- **Role**: Validates transaction risk thresholds, parses merchant intents, and triggers automated micro-settlement calls to PayPal Sandbox endpoints.

### 3. Local Setup & Testing
1. Clone the repository and install dependencies:
   ```bash
   npm install
