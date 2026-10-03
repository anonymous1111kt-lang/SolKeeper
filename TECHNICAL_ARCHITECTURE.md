# Solana Token Risk Analyzer - Technical Architecture

## 🚀 Project Overview
The Solana Token Risk Analyzer is a real-time security tool designed to protect retail investors from malicious smart contracts, honeypots, and rug pulls on the Solana blockchain. 

It explicitly tackles new vectors of attack, such as hidden Transfer Fees introduced by the **Solana Token-2022 Program**.

## 🛠 Tech Stack
*   **Frontend:** Next.js 14 (App Router), React, TypeScript
*   **Styling:** Tailwind CSS (with Glassmorphism & Web3 Dark Theme)
*   **Icons:** Lucide React
*   **Backend:** Next.js Serverless API Routes
*   **Data Source:** Rugcheck.xyz REST API (Live On-Chain Data)

## 🏗 Architecture & Data Flow
1.  **User Input:** The user pastes a Solana Token Contract Address (Mint Address) into the frontend search bar.
2.  **API Proxy:** The frontend sends a POST request to our internal Next.js API route (`/api/analyze`). This proxy hides the implementation logic and prevents CORS issues on the client side.
3.  **On-Chain Data Fetch:** The API route makes a secure server-side call to the `api.rugcheck.xyz/v1/tokens/{address}/report` endpoint to fetch the live ledger data.
4.  **Risk Calculation:** The backend parses the massive blockchain response and extracts five key metrics:
    *   **Token-2022 Extensions:** Detects if the newer Token-2022 program is being used to hide malicious transfer fees (taxes) or non-transferability mechanics.
    *   **Mint Authority:** Checks if the creator can infinitely mint new tokens (Scam risk).
    *   **Freeze Authority:** Checks if the creator can freeze user wallets (Honeypot risk).
    *   **Liquidity Status:** Scans Raydium/Orca pools to verify if the Liquidity Pool (LP) tokens are locked.
    *   **Top Holder Concentration:** Calculates the exact percentage of the total supply held by the top 10 wallets.
5.  **Data Visualization:** The frontend receives the formatted risk profile and dynamically renders a glowing Red (High Risk) or Green (Low Risk) dashboard using interactive metric cards.

## 🎨 UI/UX Design Decisions
*   **Web3 Aesthetic:** Utilizes a deep space background (`#0B0F19`) with purple/blue glowing gradients to match modern DeFi and Web3 applications.
*   **Instant Visual Feedback:** Color-coded status indicators (Red/Yellow/Green) allow users to understand complex smart contract risks in less than 5 seconds without needing a technical background.
*   **Glassmorphism:** Uses backdrop blurs and subtle glowing borders to create a premium, interactive feel.
