
import * as Dialog from "@radix-ui/react-dialog";
import { useApi } from "../../utils/api";
import { Link } from "react-router-dom";
// import {useEffect } from "react";
import Highcharts from "highcharts";
// import { useState } from "react";
import { useState, useEffect } from 'react'

import { MdAccountBalanceWallet } from "react-icons/md";
import { FaArrowUp } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";
import { MdSavings } from "react-icons/md";
import { MdExpandMore } from "react-icons/md";
import { FaLightbulb } from "react-icons/fa";
import { FaArrowTrendUp } from "react-icons/fa6";
import { MdReport } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function FinancialDashboard() {

    const { makeRequest } = useApi();

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const res = await makeRequest("get-spending-by-category", { method: "GET" });

    //             // Assign colors manually for consistency
    //             const categoryColors = {
    //                 "Food & Dining": "#ef4444",
    //                 "Transportation": "#3b82f6",
    //                 "Shopping": "#8b5cf6",
    //                 "Entertainment": "#10b981",
    //                 "Utilities": "#f97316",
    //                 "Other": "#abdbe3",
    //             };

    //             const chartData = res.spending.map((item) => ({
    //                 name: item.category_name,
    //                 y: Number(item.total),
    //                 color: categoryColors[item.category_name] || "#ccc",
    //             }));

    //             Highcharts.chart("pie-chart", {
    //                 chart: {
    //                     type: "pie",
    //                     backgroundColor: "#4b8673",
    //                 },
    //                 title: { text: "" },
    //                 tooltip: { pointFormat: "{series.name}: <b>৳{point.y}</b>" },
    //                 plotOptions: {
    //                     pie: {
    //                         allowPointSelect: true,
    //                         cursor: "pointer",
    //                         dataLabels: { enabled: false },
    //                         showInLegend: true,
    //                     },
    //                 },
    //                 legend: {
    //                     layout: "horizontal",
    //                     align: "center",
    //                     verticalAlign: "bottom",
    //                     itemStyle: {
    //                         color: "#ffffff",
    //                         fontWeight: "bold",
    //                     },
    //                 },
    //                 credits: { enabled: false },
    //                 series: [
    //                     {
    //                         name: "Spending",
    //                         colorByPoint: true,
    //                         data: chartData,
    //                     },
    //                 ],
    //             });
    //         } catch (err) {
    //             console.error("Error loading spending chart:", err);
    //         }
    //     };

    //     fetchData();
    // }, []);

    const [period, setPeriod] = useState("this_month");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await makeRequest(`get-spending-by-category?period=${period}`, { method: "GET" });

                const categoryColors = {
                    "Food & Dining": "#ef4444",
                    "Transportation": "#3b82f6",
                    "Shopping": "#8b5cf6",
                    "Entertainment": "#10b981",
                    "Utilities": "#f97316",
                    "Other": "#abdbe3",
                };
                console.log("Response from backend:", res);

                const chartData = res.spending.map((item) => ({
                    name: item.category_name,
                    y: Number(item.total),
                    color: categoryColors[item.category_name] || "#ccc",
                }));

                Highcharts.chart("pie-chart", {
                    chart: { type: "pie", backgroundColor: "#4b8673" },
                    title: { text: "" },
                    tooltip: { pointFormat: "{series.name}: <b>৳{point.y}</b>" },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: "pointer",
                            dataLabels: { enabled: false },
                            showInLegend: true,
                        },
                    },
                    legend: {
                        layout: "horizontal",
                        align: "center",
                        verticalAlign: "bottom",
                        itemStyle: { color: "#ffffff", fontWeight: "bold" },
                    },
                    credits: { enabled: false },
                    series: [{ name: "Spending", colorByPoint: true, data: chartData }],
                });
            } catch (err) {
                console.error("Error loading spending chart:", err);
            }
        };

        fetchData();
    }, [period]); // refetch chart when `period` changes

    const [accounts, setAccounts] = useState([]);
    const [accountName, setAccountName] = useState("");
    const [balance, setBalance] = useState("");

    // fetch accounts
    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const res = await makeRequest("get-accounts", { method: "GET" });
                setAccounts(res.accounts || []);
            } catch (err) {
                console.error("Error fetching accounts:", err);
            }
        };
        fetchAccounts();
    }, []);

    // add account
    const handleAddAccount = async () => {
        // if (!accountName) return;

        if (!accountName?.trim()) {
            alert("Please enter an account name.");
            return;
        }

        if (accountName.trim().length > 30) {
            alert("Account name cannot exceed 30 characters.");
            return;
        }

        try {
            const res = await makeRequest("add-account", {
                method: "POST",
                body: JSON.stringify({
                    accountName,
                    balance: parseFloat(balance) || 0,
                }),
            });

            setAccounts([...accounts, res]);
            setAccountName("");
            setBalance("");
        } catch (err) {
            console.error("Error adding account:", err);
        }
    };

    const [transactionName, setTransactionName] = useState("");
    const [amount, setAmount] = useState("");
    const [accountId, setAccountId] = useState("");
    const [categoryId, setCategoryId] = useState("");
    // const [accounts, setAccounts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [type, setType] = useState("");
    const [financeSuggestion, setFinanceSuggestion] = useState([]);

    const defaultCategories = [
        { category_id: 1, category_name: "Food & Dining" },
        { category_id: 2, category_name: "Transportation" },
        { category_id: 3, category_name: "Entertainment" },
        { category_id: 4, category_name: "Shopping" },
        { category_id: 5, category_name: "Utilities" },
        { category_id: 6, category_name: "Other" },
    ];

    const colorMap = {
        Yellow: "bg-yellow-50 border-yellow-400 text-yellow-800",
        Blue: "bg-blue-50 border-blue-400 text-blue-800",
        Red: "bg-red-50 border-red-400 text-red-800",
        Green: "bg-green-50 border-green-400 text-green-800",
        Purple: "bg-purple-50 border-purple-400 text-purple-800",
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch accounts
                const accRes = await makeRequest("get-accounts", { method: "GET" });
                setAccounts(accRes.accounts || []);

                // setCategories(defaultCategories);

                // Fetch categories
                const catRes = await makeRequest("get-categories", { method: "GET" });
                // console.log("Fetched categories:", catRes);
                if (catRes.categories && catRes.categories.length > 0) {
                    setCategories(catRes.categories);
                    // console.log("Categories set from API:", catRes.categories);
                } else {
                    setCategories(defaultCategories); // ← this will set the defaults
                }

            } catch (err) {
                console.error("Error fetching accounts or categories:", err);
                setCategories(defaultCategories);
            }
        };

        const getFinanceSuggestion = async () => {
            try {
                const res = await makeRequest("finance-suggestion", { method: "GET" });

                if (res.status === "success") {
                    let suggestionData;

                    // First, get the string inside `res.suggestion`
                    if (typeof res.suggestion === "string") {
                        suggestionData = JSON.parse(res.suggestion);
                    } else if (res.suggestion?.suggestions) {
                        // Already parsed
                        suggestionData = res.suggestion;
                    } else {
                        // Sometimes res.suggestion is {suggestion: 'json string'}
                        suggestionData = JSON.parse(res.suggestion.suggestion);
                    }

                    setFinanceSuggestion(suggestionData.suggestions || []);
                    console.log("Fetched suggestions:", suggestionData);

                } else {
                    console.log("No suggestions found");
                }
            } catch (err) {
                console.error("Error fetching routines:", err);
            }
        };

        fetchData();
        getFinanceSuggestion();
    }, []);

    const handleAddTransaction = async () => {
        if (!transactionName?.trim()) {
            alert("Transaction name cannot be empty.");
            return;
        }


        if (!transactionName || !amount || !accountId || !categoryId || !type) {
            alert("Please fill all fields");
            return;
        }
                if (transactionName.trim().length > 50) {
            alert("Transaction name cannot exceed 50 characters.");
            return;
        }

        if (Number(amount) < 0) {
            alert("Amount cannot be negative.");
            return;
        }

        // console.log({
        //     transactionName,
        //     amount: parseFloat(amount),
        //     accountId: parseInt(accountId),
        //     categoryId: parseInt(categoryId),
        //     type,
        // });

        try {
            await makeRequest("add-transaction", {
                method: "POST",
                body: JSON.stringify({
                    description: transactionName,
                    amount: parseFloat(amount),
                    accountId: parseInt(accountId),
                    categoryId: parseInt(categoryId),
                    type: type
                }),
            });

            // Reset form
            setTransactionName("");
            setAmount("");
            setAccountId("");
            setCategoryId("");
            setType("");
            // alert("Transaction added successfully!");
        } catch (err) {
            console.error("Error adding transaction:", err);
        }
    };


    // const [accounts, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState("all");
    const [loading, setLoading] = useState(true);

    // Fetch accounts
    // useEffect(() => {
    //     const fetchAccounts = async () => {
    //         try {
    //             const res = await axios.get("/api/get-accounts", { withCredentials: true });
    //             setAccounts(res.data.accounts);
    //         } catch (err) {
    //             console.error("Error fetching accounts:", err);
    //         }
    //     };
    //     fetchAccounts();
    // }, []);

    // Fetch transactions
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);

                let endpoint = "get-transactions";
                if (selectedAccount !== "all") {
                    endpoint += `?account_id=${selectedAccount}`;
                }
                console.log("Fetching transactions from:", endpoint);

                const res = await makeRequest(endpoint, { method: "GET" });
                setTransactions(res.transactions || []);
            } catch (err) {
                console.error("Error fetching transactions:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, [selectedAccount]);


    const [budgets, setBudgets] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ category_id: "", limit_amount: "" });

    useEffect(() => {
        const fetchBudgets = async () => {
            try {
                const res = await makeRequest("get-budgets", { method: "GET" });
                setBudgets(res.budgets || []);
                // console.log("Fetched budgets:", res.budgets);
            } catch (err) {
                console.error("Error fetching budgets:", err);
            }
        };

        const fetchCategories = async () => {
            try {
                const catRes = await makeRequest("get-categories", { method: "GET" });
                setCategories(catRes.categories || []);
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };

        fetchBudgets();
        fetchCategories();
    }, []);

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        //Validate limit_amount
        if (Number(formData.limit_amount) < 0) {
            alert("Budget value can't be negative.");
            return;
        }
        try {
            await makeRequest("set-budget", {
                method: "POST",
                body: JSON.stringify({
                    category_id: Number(formData.category_id),
                    limit_amount: Number(formData.limit_amount),
                }),
                // headers: { "Content-Type": "application/json" },
            });
            setShowForm(false);
            setFormData({ category_id: "", limit_amount: "" });
            // console.log("Budget saved successfully", formData);
            // reload budgets
            const res = await makeRequest("get-budgets", { method: "GET" });
            setBudgets(res.budgets || []);
        } catch (err) {
            console.error("Error saving budget:", err);
        }
    };

    const [metrics, setMetrics] = useState({
        total_balance: 0,
        monthly_income: 0,
        monthly_expenses: 0,
        savings_rate: 0
    });

    useEffect(() => {
        const fetchMetrics = async () => {
            const res = await makeRequest("dashboard-metrics", { method: "GET" });
            setMetrics(res);
            console.log("Fetched metrics:", res);
        };
        fetchMetrics();
    }, []);


    return (
        <div className="max-w-7xl mx-auto mt-5 h-auto pb-8">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-light-text dark:text-dark-text">Dashboard</h1>
                    <p className="text-gray-500 dark:text-dark-text/50">Welcome back! Here's your financial overview</p>
                </div>



                <div className="flex justify-between items-center mb-6 space-x-5">

                    {/* Button */}
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center font-semibold cursor-pointer bg-primary text-light-text px-4 py-2 rounded-lg shadow hover:bg-primary/90"
                    >
                        Budget Planner
                    </button>

                    {/* Modal Dialog */}
                    {showForm && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm  z-50">
                            <div className="bg-light-background dark:bg-dark-background p-6 rounded-lg shadow-lg w-full max-w-md relative text-light-text dark:text-dark-text">
                                {/* Close Button */}
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="absolute top-5 text-2xl right-6 text-gray-600 dark:text-gray-300 hover:text-red-500"
                                >
                                    ✕
                                </button>

                                <h2 className="text-lg font-semibold mb-4 text-light-text dark:text-dark-text">
                                    Set Budget Limit
                                </h2>

                                {/* Budget Form */}
                                <form onSubmit={handleSubmit}>
                                    <select
                                        value={formData.category_id}
                                        onChange={(e) =>
                                            setFormData({ ...formData, category_id: e.target.value })
                                        }
                                        className="w-full border-1 border-accent rounded-lg px-3 py-2 mb-3
             bg-light-background text-light-text
             dark:bg-dark-background dark:text-dark-text
             focus:border-accent focus:ring focus:ring-accent focus:outline-none"
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat.category_id} value={cat.category_id}
                                                className="bg-light-background text-light-text dark:bg-light-background/20 dark:text-dark-text"
                                            >
                                                {cat.category_name}
                                            </option>
                                        ))}
                                    </select>

                                    <input
                                        type="number"
                                        placeholder="Budget Limit"
                                        value={formData.limit_amount}
                                        onChange={(e) =>
                                            setFormData({ ...formData, limit_amount: Number(e.target.value) })
                                        }
                                        className="border p-2 rounded-lg w-full mb-3 focus:border-accent focus:ring focus:ring-accent focus:outline-none border-accent"
                                        required
                                    />

                                    <button
                                        type="submit"
                                        className="w-full bg-primary text-light-text px-4 py-2 rounded hover:bg-primary/90"
                                    >
                                        Save Budget
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}



                    <Dialog.Root>
                        <Dialog.Trigger asChild>
                            <button className="flex items-center font-semibold cursor-pointer bg-primary text-light-text px-4 py-2 rounded-lg shadow hover:bg-primary/90">
                                <IoMdAdd className="mr-2" size={20} />
                                Add Transaction
                            </button>
                        </Dialog.Trigger>

                        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />

                        <Dialog.Content className="fixed top-1/2 left-1/2 w-[400px] -translate-x-1/2 -translate-y-1/2 bg-light-background dark:bg-dark-background p-6 rounded-xl shadow-lg text-light-text dark:text-dark-text z-50">
                            <Dialog.Title className="text-lg font-bold mb-4">Add Transaction</Dialog.Title>

                            <div className="mb-4">
                                <label className="block text-sm mb-1">Transaction Name</label>
                                <input
                                    type="text"
                                    className="w-full border-1 border-accent/50 rounded-lg px-3 py-2 focus:border-accent focus:ring focus:ring-accent focus:outline-none"
                                    value={transactionName}
                                    onChange={(e) => setTransactionName(e.target.value)}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm mb-1">Amount</label>
                                <input
                                    type="number"
                                    className="w-full border-1 border-accent/50 rounded-lg px-3 py-2 focus:border-accent focus:ring focus:ring-accent focus:outline-none"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm mb-1">Account</label>
                                <select
                                    value={accountId}
                                    onChange={(e) => setAccountId(e.target.value)}
                                    className="
             bg-light-background text-light-text
             dark:bg-dark-background dark:text-dark-text
              w-full border-1 border-accent/50 rounded-lg px-3 py-2 focus:border-accent focus:ring focus:ring-accent focus:outline-none"
                                >
                                    <option value="">Select Account</option>
                                    {accounts.map((acc) => (
                                        <option
                                            key={acc.account_id}
                                            value={acc.account_id}
                                            className="bg-light-background text-light-text dark:bg-light-background/20 dark:text-dark-text"
                                        >
                                            {acc.account_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm mb-1">Type</label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="bg-light-background text-light-text
             dark:bg-dark-background dark:text-dark-text
              w-full border-1 border-accent/50 rounded-lg px-3 py-2 focus:border-accent focus:ring focus:ring-accent focus:outline-none"
                                >
                                    <option value="" className="bg-light-background text-light-text dark:bg-light-background/20 dark:text-dark-text">Select Type</option>
                                    <option value="CREDIT" className="bg-light-background text-light-text dark:bg-light-background/20 dark:text-dark-text">Credit</option>
                                    <option value="DEBIT" className="bg-light-background text-light-text dark:bg-light-background/20 dark:text-dark-text">Debit</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm mb-1">Category</label>
                                <select
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    className="bg-light-background text-light-text
             dark:bg-dark-background dark:text-dark-text
              w-full border-1 border-accent/50 rounded-lg px-3 py-2 focus:border-accent focus:ring focus:ring-accent focus:outline-none"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option
                                            key={cat.category_id}
                                            value={cat.category_id}
                                            className="bg-light-background text-light-text dark:bg-light-background/20 dark:text-dark-text"
                                        >
                                            {cat.category_name}
                                        </option>
                                    ))}
                                </select>


                            </div>

                            <div className="flex justify-end space-x-3">
                                <Dialog.Close asChild>
                                    <button className="px-4 py-2 rounded-lg border border-accent/50">Cancel</button>
                                </Dialog.Close>
                                <Dialog.Close asChild>
                                    <button
                                        onClick={handleAddTransaction}
                                        className="px-4 py-2 rounded-lg bg-primary text-light-text"
                                    >
                                        Save
                                    </button>
                                </Dialog.Close>
                            </div>
                        </Dialog.Content>
                    </Dialog.Root>

                </div>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-accent p-6 rounded-lg shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-black text-md">Total Balance</p>
                            <p className="text-2xl font-bold text-dark-text mt-1">
                                ৳{(metrics?.total_balance ?? 0).toLocaleString()}
                            </p>
                        </div>
                        <div className="bg-green-100 mt-3 p-2 rounded-lg">
                            <MdAccountBalanceWallet className="text-green-500" size={24} />
                        </div>
                    </div>
                </div>
                <div className="bg-accent p-6 rounded-lg shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-black text-md">Monthly Income</p>
                            <p className="text-2xl font-bold text-dark-text mt-1">
                                ৳{(metrics?.monthly_income ?? 0).toLocaleString()}
                            </p>

                        </div>
                        <div className="bg-blue-100 mt-3 p-2 rounded-lg">
                            <FaArrowUp className="text-blue-500" size={24} />
                        </div>
                    </div>
                </div>
                <div className="bg-accent p-6 rounded-lg shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-black text-md">Monthly Expenses</p>
                            <p className="text-2xl font-bold text-dark-text mt-1">
                                ৳{(metrics?.monthly_expenses ?? 0).toLocaleString()}
                            </p>
                        </div>
                        <div className="bg-red-100 mt-3 p-2 rounded-lg">
                            <FaArrowDown className="text-red-500" size={24} />
                        </div>
                    </div>
                </div>
                <div className="bg-accent p-6 rounded-lg shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-black text-md">Savings Goal</p>
                            <p className="text-2xl font-bold text-dark-text mt-1">
                                {Math.round(metrics?.savings_rate ?? 0)}%
                            </p>
                        </div>
                        <div className="bg-purple-100 mt-3 p-2 rounded-lg">
                            <MdSavings className="text-purple-500" size={24} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* <div className="lg:col-span-2 bg-light-background dark:bg-dark-background border-1 border-accent/70 p-6 rounded-lg shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-dark-text">Expense Breakdown</h2>
                        <div className="relative">
                            <select
                                className="appearance-none bg-light-background dark:bg-dark-background border border-accent/70 text-gray-700 dark:text-dark-text py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none">
                                <option>This Month</option>
                                <option>Last Month</option>
                                <option>All</option>
                            </select>
                            <div
                                className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <MdExpandMore className="text-gray-500" size={20} />
                            </div>
                        </div>
                    </div>
                    <div id="pie-chart" className="w-full h-[400px] "></div>
                </div> */}
                <div className="lg:col-span-2 bg-light-background dark:bg-dark-background border-1 border-accent/70 p-6 rounded-lg shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-dark-text">Expense Breakdown</h2>
                        <div className="relative">
                            <select
                                value={period}
                                onChange={(e) => setPeriod(e.target.value)}
                                className="appearance-none bg-light-background dark:bg-dark-background border border-accent/70 text-gray-700 dark:text-dark-text py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none"
                            >
                                <option value="this_month">This Month</option>
                                <option value="last_month">Last Month</option>
                                <option value="all">All</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <MdExpandMore className="text-gray-500" size={20} />
                            </div>
                        </div>
                    </div>
                    <div id="pie-chart" className="w-full h-[400px]"></div>
                </div>
                <div className="bg-light-background dark:bg-dark-background border-1 border-accent/70 p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-dark-text mb-6">Smart Suggestions</h2>
                    <div className="space-y-6">

                        {Array.isArray(financeSuggestion) && financeSuggestion.length > 0 ? (
                            financeSuggestion.map((a, idx) => {
                                const colorClass = colorMap[a.color] || "bg-gray-50 border-gray-300 text-gray-800";

                                return (
                                    <div
                                        key={idx}
                                        className={`border-l-4 p-4 rounded-r-lg ${colorClass}`}
                                    >
                                        <div className="flex">
                                            <div className="mr-3">
                                                <span className="text-2xl">{a.react_icon}</span>
                                            </div>
                                            <div>
                                                <p className="font-bold">{a.title}</p>
                                                <p className="text-sm mt-1">{a.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-gray-500 text-sm">No suggestions available.</p>
                        )}



                    </div>
                </div>
            </div>


            <div className="mt-10">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text p-6 rounded-lg shadow-lg border-1 border-accent/70">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">Recent Transactions</h2>
                            <div className="relative">
                                <select
                                    value={selectedAccount}
                                    onChange={(e) => setSelectedAccount(e.target.value)}
                                    className="appearance-none border-1 border-accent/70 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none"
                                >
                                    <option value="all">All Accounts</option>
                                    {accounts.map((acc) => (
                                        <option key={acc.account_id} value={acc.account_id}
                                            className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
                                            {acc.account_name}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <MdExpandMore className="text-gray-500" size={20} />
                                </div>
                            </div>
                        </div>

                        {/* Transactions */}
                        <div>
                            {loading ? (
                                <p>Loading...</p>
                            ) : transactions.length === 0 ? (
                                <p className="text-gray-500">No transaction found</p>
                            ) : (
                                <>
                                    {transactions.slice(0, 5).map((tx) => (
                                        <div
                                            key={tx.transaction_ID}
                                            className="flex items-center justify-between py-4 border-b border-accent/30"
                                        >
                                            <div className="flex items-center">
                                                <div>
                                                    <p className="font-medium text-light-text/80 dark:text-dark-text/80">
                                                        {tx.description}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {tx.account_name} • {new Date(tx.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <p
                                                className={
                                                    tx.type === "DEBIT"
                                                        ? "text-red-500 font-semibold"
                                                        : "text-green-500 font-semibold"
                                                }
                                            >
                                                {tx.type === "DEBIT" ? "-" : "+"}৳{tx.amount}
                                            </p>
                                        </div>
                                    ))}

                                    {/* Show More button */}
                                    {transactions.length > 5 && (
                                        <div className="text-center mt-4">
                                            <Link
                                                to={
                                                    selectedAccount === "all"
                                                        ? "/financial-dashboard/financial-review"
                                                        : `/financial-dashboard/financial-review?account_id=${selectedAccount}`
                                                }
                                                className="text-accent font-semibold hover:underline"
                                            >
                                                Show More
                                            </Link>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    <div className="bg-light-background dark:bg-dark-background border-1 border-accent/70 text-light-text dark:text-dark-text p-6 rounded-lg shadow-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">Your Accounts</h2>

                            {/* Dialog for Add Account */}
                            <Dialog.Root>
                                <Dialog.Trigger asChild>
                                    <button className="flex items-center bg-primary font-semibold py-2 px-4 rounded-lg hover:bg-primary/70 text-light-text  cursor-pointer">
                                        <IoMdAdd className="mr-2" size={20} /> Add Account
                                    </button>
                                </Dialog.Trigger>

                                {/* Overlay */}
                                <Dialog.Overlay
                                    className="
                                        fixed inset-0 
                                        bg-black/40 
                                        backdrop-blur-sm 
                                        dark:bg-black/60
                                        "
                                />

                                {/* Dialog content */}
                                <Dialog.Content
                                    className="
                                        fixed top-1/2 left-1/2 
                                        w-[400px] 
                                        -translate-x-1/2 -translate-y-1/2
                                        rounded-xl 
                                        p-6 
                                        shadow-lg 
                                        bg-light-background 
                                        text-light-text 
                                        dark:bg-dark-background 
                                        dark:text-dark-text
                                        "
                                >
                                    <Dialog.Title className="text-lg font-bold mb-4">Add New Account</Dialog.Title>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-1">Account Name</label>
                                        <input
                                            type="text"
                                            className="w-full border rounded-lg px-3 py-2 bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text border-accent/50 focus:border-accent focus:ring focus:ring-accent focus:outline-none"
                                            value={accountName}
                                            onChange={(e) => setAccountName(e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-1">Initial Balance</label>
                                        <input
                                            type="number"
                                            className="w-full border rounded-lg px-3 py-2 bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text border-accent/50 focus:border-accent focus:ring focus:ring-accent focus:outline-none"
                                            value={balance}
                                            onChange={(e) => setBalance(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex justify-end space-x-3">
                                        <Dialog.Close asChild>
                                            <button className="px-4 py-2 rounded-lg border bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text border-accent/50">Cancel</button>
                                        </Dialog.Close>
                                        <Dialog.Close asChild>
                                            <button
                                                onClick={handleAddAccount}
                                                className="px-4 py-2 rounded-lg bg-primary text-light-text"
                                            >
                                                Save
                                            </button>
                                        </Dialog.Close>
                                    </div>
                                </Dialog.Content>
                            </Dialog.Root>

                        </div>

                        {/* Accounts list */}
                        <ul className="space-y-3">
                            {accounts.map((acc) => (
                                <li key={acc.account_id}>
                                    <Link
                                        to={`/financial-dashboard/financial-review?account_id=${acc.account_id}`}
                                        className="flex items-center justify-between bg-light-background dark:bg-dark-background border-1 border-accent/30 p-4 rounded-lg hover:bg-accent/20"
                                    >
                                        <p className="font-medium text-gray-800 dark:text-dark-text">{acc.account_name}</p>
                                        <p className="text-green-500 font-semibold">৳{acc.balance.toLocaleString()}</p>
                                    </Link>
                                </li>
                            ))}
                        </ul>

                    </div>
                </div>
                <div className="bg-light-background dark:bg-dark-background border-1 border-accent/70 p-6 rounded-lg shadow-lg mt-8">
                    <h2 className="text-xl font-semibold text-light-text dark:text-dark-text mb-6">
                        Budget Planner - Based on Past Expenses
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {budgets.map((b) => {
                            const percent = Math.min((b.spent / b.limit_amount) * 100, 100);
                            const over = b.spent > b.limit_amount;

                            return (
                                <div key={b.budget_id}>
                                    <div className="flex justify-between text-sm text-gray-600 dark:text-dark-text/70 mb-1">
                                        <span>{b.category_name}</span>
                                        <span>৳{b.spent} / ৳{b.limit_amount}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className={`${over ? "bg-red-500" : percent > 80 ? "bg-yellow-400" : "bg-green-500"} h-2.5 rounded-full`}
                                            style={{ width: `${percent}%` }}
                                        ></div>
                                    </div>
                                    <p className={`text-xs mt-1 ${over ? "text-red-500" : percent > 80 ? "text-yellow-600" : "text-green-500"}`}>
                                        {over
                                            ? `${((b.spent - b.limit_amount) / b.limit_amount * 100).toFixed(0)}% over budget`
                                            : `${(100 - percent).toFixed(0)}% under budget`}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>

    )
}

export default FinancialDashboard