# PayAgent Protocol ⚡🤖

> Autonomous Intent-to-Payment Orchestrator for PayPal Sandbox with Zero-Trust Financial Guardrails. Built for the **PayPal AI Hackathon 2026**.

## 📌 Problem Statement
As autonomous AI agents execute tasks across the web, granting them unconstrained access to capital leads to unauthorized billing, prompt injections, and catastrophic overspending. Existing payment gateways lack agent-native guardrails like policy limits, dual-sign human escalation, and vendor allowlisting.

## 💡 Solution: PayAgent Protocol
PayAgent Protocol acts as a deterministic firewall between AI agents and PayPal APIs:
- **Intent Parsing & Verification**: Extracts catalog requirements, quantities, and pricing constraints.
- **Zero-Trust Financial Policies**: Enforces hard transaction caps ($500) and daily budgets ($1200).
- **Dynamic Dual-Sign Co-Signing**: Automatically pauses transactions exceeding human review thresholds ($200) until co-signed.
- **Automated Sandbox Capture**: Dispatches pre-authorized payloads using the PayPal Orders v2 schema.

## 🛠 Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS, Lucide Icons
- **Language**: TypeScript
- **Payment Layer**: PayPal Orders API v2 (Sandbox)
- **Deployment**: Vercel

## 🚀 Getting Started Locally

```bash
git clone [https://github.com/your-username/payagent-protocol.git](https://github.com/your-username/payagent-protocol.git)
cd payagent-protocol
npm install
npm run dev