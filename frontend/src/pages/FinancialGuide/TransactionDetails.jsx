import React, { useEffect, useRef, useState } from "react";
import { MdExpandMore } from "react-icons/md";
import { useLocation } from "react-router-dom";
import {
    Chart as ChartJS,
    BarController,
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { useApi } from "../../utils/api"; // your fetch wrapper

ChartJS.register(
    BarController,
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend
);

function TransactionDetails() {
    const { makeRequest } = useApi();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const accountId = queryParams.get("account_id");

    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    const [transactions, setTransactions] = useState([]);
    const [filter, setFilter] = useState("this_month");
    const [totals, setTotals] = useState({ income: 0, expenses: 0, net: 0 });
    const [editTxn, setEditTxn] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const [account, setAccount] = useState(null);
    useEffect(() => {
        const fetchAccount = async () => {
            try {
                let data;

                if (accountId) {
                    // fetch single account
                    data = await makeRequest(`get-single-account?account_id=${accountId}`, {
                        method: "GET"
                    });
                    setAccount(data.account);
                    console.log("Fetched single account:", data.account);
                } else {
                    // fetch all accounts
                    data = await makeRequest("all-account-details", {
                        method: "GET"
                    });
                    setAccount(data.account || []); // assuming backend returns {accounts: [...]}
                    console.log("Fetched all accounts:", data.account);
                }
            } catch (err) {
                console.error("Error fetching account(s):", err);
            }
        };

        fetchAccount();
    }, [accountId]);


    // Fetch transactions
    const fetchTransactions = async () => {
        try {
            let url = "get-transactions";
            if (accountId) {
                url += `?account_id=${accountId}`;
            }

            const res = await makeRequest(url, { method: "GET" });
            let allTxns = res.transactions || [];

            console.log("Fetched transactions:", allTxns);

            // filtering logic stays same
            const now = new Date();
            const filtered = allTxns.filter(txn => {
                const txnDate = new Date(txn.created_at);
                if (filter === "this_month") {
                    return txnDate.getMonth() === now.getMonth() && txnDate.getFullYear() === now.getFullYear();
                } else if (filter === "last_month") {
                    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
                    return txnDate.getMonth() === lastMonth.getMonth() && txnDate.getFullYear() === lastMonth.getFullYear();
                }
                return true;
            });

            setTransactions(filtered);

            const income = filtered
                .filter(txn => txn.type === "CREDIT")
                .reduce((sum, txn) => sum + parseFloat(txn.amount), 0);
            const expenses = filtered
                .filter(txn => txn.type === "DEBIT")
                .reduce((sum, txn) => sum + parseFloat(txn.amount), 0);

            setTotals({ income, expenses, net: income - expenses });
        } catch (err) {
            console.error("Error fetching transactions:", err);
        }
    };


    useEffect(() => {
        fetchTransactions();
    }, [accountId, filter]);

    useEffect(() => {
        if (!chartRef.current) return;

        const ctx = chartRef.current.getContext("2d");

        // Step 1: Group transactions by date
        const grouped = {};
        transactions.forEach(txn => {
            const d = new Date(txn.created_at);
            const dateKey = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; // use YYYY-M-D for sorting
            if (!grouped[dateKey]) grouped[dateKey] = { income: 0, expense: 0 };
            if (txn.type === "CREDIT") grouped[dateKey].income += parseFloat(txn.amount);
            if (txn.type === "DEBIT") grouped[dateKey].expense += parseFloat(txn.amount);
        });

        // Step 2: Sort dates chronologically
        const sortedDates = Object.keys(grouped).sort((a, b) => new Date(a) - new Date(b));

        // Step 3: Prepare labels and data arrays
        const labels = sortedDates.map(date => {
            const d = new Date(date);
            return `${d.toLocaleString("default", { month: "short" })} ${d.getDate()}`;
        });

        const incomeData = sortedDates.map(date => grouped[date].income);
        const expenseData = sortedDates.map(date => grouped[date].expense);

        const data = {
            labels,
            datasets: [
                { label: "Income", data: incomeData, backgroundColor: "rgba(34, 197, 94, 0.8)", barPercentage: 0.4, categoryPercentage: 0.5 },
                { label: "Expense", data: expenseData, backgroundColor: "rgba(239, 68, 68, 0.8)", barPercentage: 0.4, categoryPercentage: 0.5 },
            ],
        };

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, ticks: { callback: v => `$${v}` }, title: { display: true, text: "Amount" } },
                x: { stacked: false }
            },
            plugins: {
                tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: $${ctx.raw}` } },
                legend: { position: "top" },
            },
        };

        if (chartInstance.current) chartInstance.current.destroy();
        chartInstance.current = new ChartJS(ctx, { type: "bar", data, options });

        return () => { if (chartInstance.current) chartInstance.current.destroy(); };
    }, [transactions]);


    // Delete transaction
    const handleDelete = async (txnId, accountID) => {
        if (!window.confirm("Are you sure you want to delete this transaction?")) return;
        try {
            await makeRequest(`delete-transaction/${txnId}`, { method: "DELETE" });
            fetchTransactions();
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    // Edit transaction
    const handleEdit = (txn) => {
        setEditTxn({ ...txn });
        setShowModal(true);
    };

    const submitEdit = async () => {
        try {
            console.log("Submitting edit for transaction:", editTxn);
            await makeRequest(`update-transaction/${editTxn.transaction_ID}`, {
                method: "PUT",
                body: JSON.stringify({
                    amount: editTxn.amount,
                    description: editTxn.description,
                    type: editTxn.type,
                    category_ID: editTxn.category_ID,
                }),
            });
            setShowModal(false);
            fetchTransactions();
        } catch (err) {
            console.error("Update failed:", err);
        }
    };

    return (
        <div className="container mx-auto p-8 h-fit-screen">
            {/* Header & Chart UI here (same as previous) */}
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-green-500 dark:text-dark-text">
                        {account ? account.account_name : "Loading..."}
                    </h1>
                </div>

                <div className="text-right">
                    <p className="text-3xl font-semibold dark:text-dark-text">
                        {account && account.balance !== null && account.balance !== undefined
                            ? `৳${account.balance.toLocaleString()}`
                            : "৳0"}
                    </p>
                    <p className="text-gray-500 dark:text-dark-text/50 text-sm">{transactions.length} Transactions</p>
                </div>
            </header>
            <main>
                <div className="bg-light-background dark:bg-dark-background border-1 border-accent/30 p-6 rounded-lg shadow-lg mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-700 dark:text-dark-text">Transaction Overview</h2>
                        <div className="relative">
                            <select
                                value={filter}
                                onChange={e => setFilter(e.target.value)}
                                className="appearance-none bg-light-background dark:bg-dark-background border border-accent/70 text-gray-700 dark:text-dark-text py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none">
                                <option value="this_month">This Month</option>
                                <option value="last_month">Last Month</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <MdExpandMore className="text-gray-500" size={20} />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-around mb-6">
                        <div><p className="text-sm text-gray-500 dark:text-dark-text/50">Total Income</p><p className="text-2xl font-semibold text-green-500">৳{totals.income.toLocaleString()}</p></div>
                        <div><p className="text-sm text-gray-500 dark:text-dark-text/50">Total Expenses</p><p className="text-2xl font-semibold text-red-500">৳{totals.expenses.toLocaleString()}</p></div>
                        <div><p className="text-sm text-gray-500 dark:text-dark-text/50">Net</p><p className="text-2xl font-semibold text-green-500">৳{totals.net.toLocaleString()}</p></div>
                    </div>
                    <div className="w-full h-80 relative"><canvas ref={chartRef} id="transactionChart"></canvas></div>
                </div>

                {/* Transactions table */}
                <div className="bg-light-background dark:bg-dark-background p-6 rounded-lg shadow-lg border-1 border-accent/50">
                    <table className="w-full text-sm text-left bg-light-background dark:bg-dark-background">
                        <thead className="text-xs text-gray-700 dark:text-dark-text/50 uppercase">
                            <tr>
                                <th className="p-4"><input className="rounded" type="checkbox" /></th>
                                <th className="py-3 px-6">Date</th>
                                <th className="py-3 px-6">Description</th>
                                <th className="py-3 px-6">Category</th>
                                <th className="py-3 px-6 text-right">Amount</th>
                                <th className="py-3 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(txn => (
                                <tr key={txn.transaction_ID} className="bg-light-background dark:bg-dark-background border-b border-accent/30 dark:text-dark-text">
                                    <td className="p-4"><input className="rounded" type="checkbox" /></td>
                                    <td className="py-4 px-6">{new Date(txn.created_at).toLocaleDateString()}</td>
                                    <td className="py-4 px-6 font-medium text-gray-900 dark:text-dark-text">{txn.description}</td>
                                    <td className="py-4 px-6"><span className="bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">{txn.category_name || "N/A"}</span></td>
                                    <td className={`py-4 px-6 text-right font-medium ${txn.type === "DEBIT" ? "text-red-500" : "text-green-500"}`}>৳{parseFloat(txn.amount).toLocaleString()}</td>
                                    <td className="py-4 px-6 text-right space-x-2">
                                        <button onClick={() => handleEdit(txn)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Edit</button>
                                        <button onClick={() => handleDelete(txn.transaction_ID, txn.account_ID)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* Edit Modal */}
            {showModal && editTxn && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                    <div className="bg-light-background dark:bg-dark-background border border-accent/70 text-light-text dark:text-dark-text p-6 rounded-lg w-96">
                        <h2 className="text-lg font-semibold mb-4">Edit Transaction</h2>
                        <input
                            className="w-full mb-2 p-2 border rounded"
                            value={editTxn.amount}
                            onChange={e => setEditTxn({ ...editTxn, amount: e.target.value })}
                            placeholder="Amount"
                        />
                        <input
                            className="w-full mb-2 p-2 border rounded"
                            value={editTxn.description}
                            onChange={e => setEditTxn({ ...editTxn, description: e.target.value })}
                            placeholder="Description"
                        />
                        <select
                            className="w-full mb-2 p-2 border rounded"
                            value={editTxn.type}
                            onChange={e => setEditTxn({ ...editTxn, type: e.target.value })}
                        >
                            <option value="CREDIT">Income</option>
                            <option value="DEBIT">Expense</option>
                        </select>
                        <input
                            className="w-full mb-2 p-2 border rounded"
                            value={editTxn.category_ID || ""}
                            onChange={e => setEditTxn({ ...editTxn, category_ID: e.target.value })}
                            placeholder="Category ID"
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 rounded border"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitEdit}
                                className="px-4 py-2 rounded bg-blue-500 text-white"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default TransactionDetails;
