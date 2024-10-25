## Soroban Payment & Messaging System
A smart contract built on Soroban that enables XLM payments with attached messages and multi-recipient transfers. This system allows users to send payments, attach messages to transactions, and view their transaction history on the Stellar network.

## Features
💸 Single Payment: Send XLM to individual recipients with optional messages
🔄 Multi-recipient Transfer: Send XLM to multiple recipients in a single transaction
💬 Message Attachment: Attach messages to your payments
📊 Balance Checking: Check XLM balance for any address
📜 Transaction History: View complete history of sent and received payments
🔍 Payment Summary: Access summaries of multi-recipient payments

## Prerequisites

Rust (latest stable version)
Soroban CLI (version 21.7.3)
Stellar account with XLM for testing
Node.js and npm (for running the test suite)

Installation

Clone the repository:

git clone https://github.com/yourusername/soroban-payment-messaging.git
cd soroban-payment-messaging

Install Soroban CLI if you haven't already:
cargo install --locked soroban-cli@21.7.3

Build the contract:
cargo build --release

Testing : 
cargo test
