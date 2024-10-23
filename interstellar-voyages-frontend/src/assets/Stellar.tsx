import { useState, useEffect } from 'react';

// Mock function to simulate sending a payment to multiple recipients (unchanged)
const mockSendMultiPayment = (recipients:any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Multi-payment sent to ${recipients.length} recipients:`);
      // recipients.forEach(({ address , amount }) => {
      //   console.log(`- ${amount} XLM to ${address}`);
      // });
      resolve({ success: true });
    }, 1500);
  });
};

// Mock function to simulate balance inquiry (unchanged)
const mockGetBalance = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const balance = (Math.random() * 9900 + 100).toFixed(2);
      resolve({ balance: balance });
    }, 500);
  });
};

// Mock function to generate transaction history
const mockGetTransactionHistory = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const numTransactions = Math.floor(Math.random() * 10) + 5; // 5 to 14 transactions
      const transactions = Array.from({ length: numTransactions }, (_, i) => ({
        id: `tx${i + 1}`,
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Random date within last 30 days
        type: Math.random() > 0.5 ? 'sent' : 'received',
        amount: (Math.random() * 100).toFixed(2),
        counterparty: `GXYZ...${Math.random().toString(36).substring(2, 6)}`,
        message: Math.random() > 0.7 ? `Message ${i + 1}` : null,
      }))// Sort by date, most recent first
      resolve(transactions);
    }, 1000);
  });
};

const StellarPaymentsApp = () => {
  const [accountId, setAccountId] = useState('');
  const [balance, setBalance] = useState(null);
  const [status, setStatus] = useState('');
  const [recipients, setRecipients] = useState([{ address: '', amount: '' }]);
  const [message, setMessage] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('send');

  const handleBalanceInquiry = async () => {
    if (!accountId) {
      setStatus('Please enter an Account ID for balance inquiry');
      return;
    }
    setStatus('Fetching balance...');
    try {
      const result = await mockGetBalance() as any;
      setBalance(result.balance);
      setStatus('Balance fetched successfully!');
    } catch (error) {
      setStatus('Error fetching balance. Please try again.');
    }
  };

  const handleAddRecipient = () => {
    setRecipients([...recipients, { address: '', amount: '' }]);
  };

  const handleRemoveRecipient = (index: number) => {
    const newRecipients = recipients.filter((_, i) => i !== index);
    setRecipients(newRecipients);
  };

  const handleRecipientChange = (index: number, field: string, value: string) => {
    const newRecipients = recipients.map((recipient, i) => {
      if (i === index) {
        return { ...recipient, [field]: value };
      }
      return recipient;
    });
    setRecipients(newRecipients);
  };

  const handleSubmit = async () => {
    if (recipients.some(r => !r.address || !r.amount)) {
      setStatus('Please fill in all recipient fields');
      return;
    }
    setStatus('Sending payments...');
    try {
      await mockSendMultiPayment(recipients);
      setStatus('Payments sent successfully!');
      setRecipients([{ address: '', amount: '' }]);
      setMessage('');
    } catch (error) {
      setStatus('Error sending payments. Please try again.');
    }
  };

  const fetchTransactionHistory = async () => {
    if (!accountId) {
      setStatus('Please enter an Account ID to view transaction history');
      return;
    }
    setStatus('Fetching transaction history...');
    try {
      const history = await mockGetTransactionHistory() as any;
      setTransactions(history);
      setStatus('Transaction history fetched successfully!');
    } catch (error) {
      setStatus('Error fetching transaction history. Please try again.');
    }
  };

  useEffect(() => {
    if (activeTab === 'history' && accountId) {
      fetchTransactionHistory();
    }
  }, [activeTab, accountId]);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Stellar Payments App</h1>
      
      {/* Balance Inquiry Section */}
      <div className="mb-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Balance Inquiry</h2>
        <div className="flex space-x-4">
          <input
            type="text"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            placeholder="Enter Account ID"
            className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <button 
            onClick={handleBalanceInquiry}
            className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none focus:shadow-outline"
          >
            Check Balance
          </button>
        </div>
        {balance !== null && (
          <p className="mt-4 text-center font-medium">Balance: {balance} XLM</p>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex mb-4">
        <button
          className={`flex-1 py-2 ${activeTab === 'send' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('send')}
        >
          Send Payment
        </button>
        <button
          className={`flex-1 py-2 ${activeTab === 'history' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('history')}
        >
          Transaction History
        </button>
      </div>

      {activeTab === 'send' && (
        /* Multi-Payment Section */
        <div className="space-y-4">
          {recipients.map((recipient, index) => (
            <div key={index} className="flex space-x-2">
              <input
                type="text"
                value={recipient.address}
                onChange={(e) => handleRecipientChange(index, 'address', e.target.value)}
                placeholder="Recipient Address"
                className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <input
                type="number"
                value={recipient.amount}
                onChange={(e) => handleRecipientChange(index, 'amount', e.target.value)}
                placeholder="Amount (XLM)"
                className="w-1/4 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <button
                onClick={() => handleRemoveRecipient(index)}
                className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:shadow-outline"
              >
                Remove
              </button>
            </div>
          ))}
          <button 
            onClick={handleAddRecipient}
            className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline"
          >
            Add Recipient
          </button>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Message (optional):
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              ></textarea>
            </label>
          </div>
          <button 
            onClick={handleSubmit}
            className="w-full px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none focus:shadow-outline"
          >
            Send Payments
          </button>
        </div>
      )}

      {activeTab === 'history' && (
        /* Transaction History Section */
        <div>
          <button 
            onClick={fetchTransactionHistory}
            className="w-full px-4 py-2 mb-4 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline"
          >
            Refresh Transaction History
          </button>
          {transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Amount</th>
                    <th className="px-4 py-2 text-left">Counterparty</th>
                    <th className="px-4 py-2 text-left">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx} className="border-t">
                   
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No transactions found.</p>
          )}
        </div>
      )}

      {status && <p className="mt-4 text-center text-sm font-medium text-gray-700">{status}</p>}
    </div>
  );
};

export default StellarPaymentsApp;