use soroban_sdk::{contractimpl, symbol_short, Address, Env, String, Vec, Map};

#[derive(Clone)]
#[contracttype]
pub struct Transaction {
    from: Address,
    to: Address,
    amount: i128,
    message: Option<String>,
    timestamp: u64,
}

#[contract]
pub struct PaymentMessaging;

#[contractimpl]
impl PaymentMessaging {
    // Initialize the contract
    pub fn initialize(env: Env, admin: Address) {
        env.storage().set(&symbol_short!("admin"), &admin);
    }

    // Helper function to record a transaction
    fn record_transaction(env: &Env, from: &Address, to: &Address, amount: i128, message: Option<String>) {
        let transaction = Transaction {
            from: from.clone(),
            to: to.clone(),
            amount,
            message,
            timestamp: env.ledger().timestamp(),
        };

        // Store transaction in sender's history
        let sender_key = symbol_short!("history");
        let mut sender_history: Vec<Transaction> = env.storage().get(&sender_key).unwrap_or(Vec::new(env));
        sender_history.push_back(transaction.clone());
        env.storage().set(&sender_key, &sender_history);

        // Store transaction in recipient's history
        let recipient_key = symbol_short!("history");
        let mut recipient_history: Vec<Transaction> = env.storage().get(&recipient_key).unwrap_or(Vec::new(env));
        recipient_history.push_back(transaction);
        env.storage().set(&recipient_key, &recipient_history);
    }

    // Send payment with an optional message
    pub fn send_payment(env: Env, from: Address, to: Address, amount: i128, message: Option<String>) {
        from.require_auth();

        // Transfer XLM
        let token = env.official_token();
        token.transfer(&from, &to, &amount);

        // Record the transaction
        Self::record_transaction(&env, &from, &to, amount, message.clone());
    }

    // Send payment to multiple recipients
    pub fn send_multi_payment(
        env: Env,
        from: Address,
        recipients: Vec<(Address, i128)>,
        message: Option<String>,
    ) {
        from.require_auth();

        let token = env.official_token();

        // Transfer XLM to each recipient
        for (to, amount) in recipients.iter() {
            token.transfer(&from, &to, &amount);

            // Record each transaction
            Self::record_transaction(&env, &from, to, amount, message.clone());
        }

        // Store a summary of the multi-payment transaction
        let summary_key = symbol_short!("multi_summary");
        env.storage().set(&summary_key, &(from, recipients.len(), recipients.iter().map(|(_, amount)| amount).sum()));
    }

    // Get balance
    pub fn get_balance(env: Env, address: Address) -> i128 {
        let token = env.official_token();
        token.balance(&address)
    }

    // Get transaction history for a user
    pub fn get_transaction_history(env: Env, address: Address) -> Vec<Transaction> {
        let key = symbol_short!("history");
        env.storage().get(&key).unwrap_or(Vec::new(&env))
    }

    // Get the summary of the last multi-payment transaction
    pub fn get_last_multi_payment_summary(env: Env) -> Option<(Address, u32, i128)> {
        let summary_key = symbol_short!("multi_summary");
        env.storage().get(&summary_key);
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::{Address as _, Ledger};

    #[test]
    fn test_payment_messaging_with_history() {
        let env = Env::default();
        let contract_id = env.register_contract(None, PaymentMessaging);
        let client = PaymentMessagingClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let user1 = Address::generate(&env);
        let user2 = Address::generate(&env);
        let user3 = Address::generate(&env);

        client.initialize(&admin);

        // Mint some tokens for testing
        let token = env.official_token();
        token.mint(&user1, &1000);

        // Test single payment
        client.send_payment(&user1, &user2, &100, &Some(String::from_str(&env, "Hello!")));

        // Test multi-payment
        let recipients = Vec::from_array(
            &env,
            [
                (user2.clone(), 50),
                (user3.clone(), 75),
            ],
        );
        client.send_multi_payment(&user1, &recipients, &Some(String::from_str(&env, "Multi-payment")));

        // Check transaction history for user1 (sender)
        let user1_history = client.get_transaction_history(&user1);
        assert_eq!(user1_history.len(), 3);
        assert_eq!(user1_history.get(0).unwrap().amount, 100);
        assert_eq!(user1_history.get(1).unwrap().amount, 50);
        assert_eq!(user1_history.get(2).unwrap().amount, 75);

        // Check transaction history for user2 (recipient)
        let user2_history = client.get_transaction_history(&user2);
        assert_eq!(user2_history.len(), 2);
        assert_eq!(user2_history.get(0).unwrap().amount, 100);
        assert_eq!(user2_history.get(1).unwrap().amount, 50);

        // Check transaction history for user3 (recipient)
        let user3_history = client.get_transaction_history(&user3);
        assert_eq!(user3_history.len(), 1);
        assert_eq!(user3_history.get(0).unwrap().amount, 75);
    }
}