## Soroban Payment & Messaging System
A smart contract built on Soroban that enables XLM payments with attached messages and multi-recipient transfers. This system allows users to send payments, attach messages to transactions, and view their transaction history on the Stellar network.

## Features
<div class="features-container">
  <!-- Single Payment -->
  <div class="feature-card">
    <h2>💸 Single Payment</h2>
    <p>Send XLM to individual recipients with optional messages.</p>
  </div>

  <!-- Multi-recipient Transfer -->
  <div class="feature-card">
    <h2>🔄 Multi-recipient Transfer</h2>
    <p>Send XLM to multiple recipients in a single transaction.</p>
  </div>

  <!-- Message Attachment -->
  <div class="feature-card">
    <h2>💬 Message Attachment</h2>
    <p>Attach messages to your payments.</p>
  </div>

  <!-- Balance Checking -->
  <div class="feature-card">
    <h2>📊 Balance Checking</h2>
    <p>Check XLM balance for any address.</p>
  </div>

  <!-- Transaction History -->
  <div class="feature-card">
    <h2>📜 Transaction History</h2>
    <p>View complete history of sent and received payments.</p>
  </div>
</div>


## Prerequisites

Rust (latest stable version)
Soroban CLI (version 21.7.3)
Stellar account with XLM for testing
Node.js and npm (for running the test suite)

Installation

1.Clone the repository:

git clone https://github.com/yourusername/soroban-payment-messaging.git
cd Stellar

2.Install Soroban CLI if you haven't already:
cargo install --locked soroban-cli@21.7.3

3.Build the contract:
cargo build --release

4.Run the application:
cargo run

5.Testing: 
cargo test
