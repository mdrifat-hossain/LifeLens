import React from 'react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useApi } from "../../utils/api";

import { FaListUl } from "react-icons/fa";
import { TbCurrencyTaka } from "react-icons/tb";
import { MdShoppingBasket } from "react-icons/md";
import { CiBookmarkCheck } from "react-icons/ci";
import { IoRestaurantSharp } from "react-icons/io5";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { TbTrash } from "react-icons/tb";

function GroceryList() {
    const { makeRequest } = useApi();

    const [stats, setStats] = useState({
        total_lists: 0,
        this_month_total: 0,
        avg_per_trip: 0,
        food_expense: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await makeRequest("grocery_dashboard_stats", {
                    method: "GET",
                });
                setStats(data);
            } catch (err) {
                console.error("Error fetching stats:", err);
            }
        };

        fetchStats();
    }, []);

    const [groceries, setGroceries] = useState([]); // items loaded from server (ID, grocery_name, available_amount)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [workingItems, setWorkingItems] = useState([]); // local editable copy
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    // helper: parse "6.0 kg" -> {num: 6.0, unit: "kg"}
    const parseAvailableAmount = (text) => {
        if (!text) return { num: 0, unit: "pcs" };
        const s = String(text).trim();
        // try "12 pcs", "6.0 kg", "2 liters"
        const m = s.match(/^([\d.]+)\s*(.*)$/);
        if (m) {
            const num = parseFloat(m[1]) || 0;
            const unit = (m[2] || "pcs").trim() || "pcs";
            return { num, unit };
        }
        // fallback: if just number
        const nm = parseFloat(s);
        if (!isNaN(nm)) return { num: nm, unit: "pcs" };
        return { num: 0, unit: "pcs" };
    };

    // fetch groceries from backend
    const fetchGroceries = async () => {
        setLoading(true);
        try {
            const data = await makeRequest("available_groceries", { method: "GET" });
            const rows = (data && data.available_groceries) || [];
            // normalize into UI-friendly objects
            const mapped = rows.map((r) => {
                const parsed = parseAvailableAmount(r.available_amount);
                return {
                    ID: r.ID,
                    grocery_name: r.grocery_name || "",
                    available_amount: r.available_amount || "",
                    amount_num: parsed.num,
                    amount_unit: parsed.unit,
                };
            });
            setGroceries(mapped);
        } catch (err) {
            console.error("Error fetching groceries:", err);
            setGroceries([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroceries();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // compute totals: completed = items with amount_num > 0
    const totalItems = groceries.length;
    const completedItems = groceries.filter((g) => Number(g.amount_num) > 0).length;
    const progressPercent = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);

    // open modal: create a deep editable copy of groceries
    const openModal = () => {
        const copy = groceries.map((g) => ({ ...g }));
        setWorkingItems(copy);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setWorkingItems([]);
    };

    // change handlers in modal
    // const updateWorkingItem = (id, changes) => {
    //     setWorkingItems((prev) => prev.map((it) => (it.ID === id ? { ...it, ...changes } : it)));
    // };

    // add new local row (ID null -> server will insert)
    const addNewRow = () => {
        const newItem = {
            __tempId: Date.now(), // unique temporary ID
            grocery_name: "",
            amount_num: "",
            amount_unit: "",
            available_amount: "",
            isNew: true,
        };

        setWorkingItems(prev => [...prev, newItem]);

        // Scroll to bottom after render
        setTimeout(() => {
            const modal = document.querySelector('.scroll-area');
            if (modal) modal.scrollTo({ top: modal.scrollHeight, behavior: 'smooth' });
        }, 100);
    };

    // Update item field
    const updateWorkingItem = (id, updatedFields) => {
        setWorkingItems(prev =>
            prev.map(it =>
                (it.ID ?? it.__tempId) === id
                    ? { ...it, ...updatedFields }
                    : it
            )
        );
    };


    // delete (remove from working list)
    const deleteRow = async (id, tempId) => {
        if (!window.confirm("Delete this item?")) return;

        // If it's a DB item (has ID), delete from server
        if (id) {
            try {
                await makeRequest(`delete_available_grocery/${id}`, { method: "DELETE" });
            } catch (err) {
                console.error("Error deleting grocery:", err);
                alert("Failed to delete from server!");
                return;
            }
        }

        // Remove from UI
        setWorkingItems((prev) => prev.filter((it) => (it.ID ? it.ID !== id : it.__tempId !== tempId)));
    };

    // when user edits num/unit, update available_amount preview too
    const syncAmountText = (num, unit) => {
        if (num === "" || num === null || isNaN(Number(num))) return `0 ${unit || "pcs"}`;
        return `${Number(num)} ${unit || "pcs"}`;
    };

    // Save changes -> send to backend
    const handleSave = async () => {
        // basic validation: ensure names not empty
        for (const it of workingItems) {
            if (!it.grocery_name || !it.grocery_name.trim()) {
                alert("Please provide a name for all items (or delete empty rows).");
                return;
            }
            // normalize numbers
            const num = Number(it.amount_num) || 0;
            if (num < 0) {
                alert("Quantity cannot be negative.");
                return;
            }
        }

        const payloadItems = workingItems.map((it) => {
            const amountText = syncAmountText(it.amount_num || 0, it.amount_unit || "pcs");
            return {
                ID: it.ID, // null for new items
                grocery_name: it.grocery_name.trim(),
                available_amount: amountText,
            };
        });

        try {
            setSaving(true);
            await makeRequest("update_available_groceries", {
                method: "POST",
                body: JSON.stringify({ groceries: payloadItems }),
            });
            alert("Groceries updated successfully.");
            closeModal();
            // re-fetch to update the card
            await fetchGroceries();
        } catch (err) {
            console.error("Failed to update groceries:", err);
            alert("Failed to save changes. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const [lists, setLists] = useState([]);
    const [filter, setFilter] = useState("all"); // all, this_month, last_month
    const [summary, setSummary] = useState({ totalSpent: 0, completedLists: 0, moneySaved: 0 });
    const [showAll, setShowAll] = useState(false);
    const [selectedList, setSelectedList] = useState(null);
    const [receiptItems, setReceiptItems] = useState([]);

    const displayedLists = showAll ? lists : lists.slice(0, 5);

    useEffect(() => {
        fetchGroceryLists();
    }, [filter]);

    // ✅ Fetch all grocery lists
    const fetchGroceryLists = async () => {
        try {
            const data = await makeRequest(`grocery-lists?filter=${filter}`, { method: "GET" });

            // 🛠 Ensure data is always an array
            const dataArray = Array.isArray(data) ? data : [];
            console.log("✅ Fetched grocery lists:", dataArray);

            setLists(dataArray);

            // 🧮 Calculate summary
            const totalSpent = dataArray.reduce((sum, l) => sum + parseFloat(l.total_price || 0), 0);
            const moneySaved = dataArray.reduce((sum, l) => sum + parseFloat(l.money_saved || 0), 0);
            const completedLists = dataArray.length;

            setSummary({ totalSpent, completedLists, moneySaved });
        } catch (err) {
            console.error("❌ Error fetching grocery lists:", err);
            setLists([]);
            setSummary({ totalSpent: 0, completedLists: 0, moneySaved: 0 });
        }
    };

    // ✅ View individual grocery list details (receipt)
    const handleViewReceipt = async (list_id) => {
        try {
            const data = await makeRequest(`grocery-list/${list_id}`, { method: "GET" });
            console.log("✅ Fetched receipt details:", data);
            setSelectedList(data);
            setReceiptItems(data.items || []);
        } catch (err) {
            console.error("❌ Error loading receipt:", err);
        }
    };



    return (
        <div className="mx-auto flex-2 px-10">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-light-text dark:text-dark-text">Grocery Lists</h1>
                    <p className="text-light-text/50 dark:text-dark-text/50 mt-1">
                        Manage your shopping lists and track grocery expenses
                    </p>
                </div>
                <button className="bg-primary text-light-text px-4 py-2 rounded-lg font-semibold flex items-center shadow-sm hover:bg-primary/90">
                    <Link to="/meal-plan/grocery-list/product-search" className="flex items-center gap-3">
                        <svg className="w-6 h-6 text-light-text" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-7 7V5" />
                        </svg>
                        New List</Link>
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-accent p-4 rounded-xl shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm text-dark-text">Total Lists</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.total_lists}</p>
                    </div>
                    <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
                        <FaListUl className="w-6 h-6 text-blue-800" />
                    </div>
                </div>

                <div className="bg-accent p-4 rounded-xl shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm text-dark-text">This Month</p>
                        <p className="text-2xl font-bold text-gray-900">
                            <TbCurrencyTaka className="inline" /> {stats.this_month_total}
                        </p>
                    </div>
                    <div className="bg-green-100 text-green-600 p-3 rounded-lg">
                        <TbCurrencyTaka className="w-6 h-6 text-green-800" />
                    </div>
                </div>

                <div className="bg-accent p-4 rounded-xl shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm text-dark-text">Avg per Trip</p>
                        <p className="text-2xl font-bold text-gray-900">
                            <TbCurrencyTaka className="inline" /> {stats.avg_per_trip.toFixed(2)}
                        </p>
                    </div>
                    <div className="bg-yellow-100 text-yellow-600 p-3 rounded-lg">
                        <CiBookmarkCheck className="w-6 h-6 text-yellow-800" />
                    </div>
                </div>

                <div className="bg-accent p-4 rounded-xl shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm text-dark-text">Limit Remains</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.food_expense}%</p>
                    </div>
                    <div className="bg-purple-100 text-purple-600 p-3 rounded-lg">
                        <MdOutlineProductionQuantityLimits className="w-6 h-6 text-purple-800" />
                    </div>
                </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 flex items-start">
                <div className="bg-blue-100 text-blue-600 p-2 rounded-full mr-4">
                    <svg className="w-6 h-6 text-blue-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 9a3 3 0 0 1 3-3m-2 15h4m0-3c0-4.1 4-4.9 4-9A6 6 0 1 0 6 9c0 4 4 5 4 9h4Z" />
                    </svg>

                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">
                        Smart Savings Suggestion
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                        Based on your spending patterns, you could save $45 this month by
                        switching to generic brands for cleaning supplies and buying in
                        bulk.
                    </p>
                    <a
                        className="text-blue-600 font-semibold text-sm mt-2 inline-flex items-center"
                        href="#"
                    >
                        View Details
                        <svg className="w-6 h-6 text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5m14 0-4 4m4-4-4-4" />
                        </svg>

                    </a>
                </div>
            </div>
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-light-text dark:text-dark-text">Your Lists</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-light-background dark:bg-dark-background p-4 rounded-xl shadow-sm border border-accent/50 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start">
                                <div className="flex items-center">
                                    <div className="bg-green-100 text-green-600 p-2 rounded-lg mr-3">
                                        <MdShoppingBasket className="w-6 h-6 text-green-800" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-light-text dark:text-dark-text">Weekly Groceries</h4>
                                        <p className="text-xs text-light-text/70 dark:text-dark-text/60 mt-1">Manage available groceries</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-6 h-6 text-gray-800 dark:text-dark-text" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M12 6h.01M12 12h.01M12 18h.01" />
                                    </svg>
                                </div>
                            </div>

                            <div className="mt-4 text-light-text/80 dark:text-dark-text/50">
                                <div className="flex justify-between items-center text-sm mb-1">
                                    <span>Items</span>
                                    <span>{completedItems} / {totalItems}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${progressPercent}%` }} />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={openModal}
                            className="w-full bg-green-500 text-light-text py-2 mt-4 rounded-lg font-semibold hover:bg-green-600 cursor-pointer"
                        >
                            View List
                        </button>
                    </div>

                    {/* Modal */}
                    {isModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            {/* overlay */}
                            <div className="absolute inset-0 bg-black/40" onClick={() => { if (!saving) closeModal(); }} />

                            <div className="relative max-w-3xl w-full bg-white dark:bg-dark-background rounded-lg shadow-lg p-5 z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold dark:text-primary">Available Groceries</h3>
                                    <div className="flex items-center gap-2">
                                        <button
                                            className="text-sm text-gray-500 hover:text-gray-800"
                                            onClick={() => { if (!saving) closeModal(); }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={saving}
                                            className={`ml-2 px-4 py-2 rounded text-white ${saving ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}
                                        >
                                            {saving ? "Saving..." : "Save Changes"}
                                        </button>
                                    </div>
                                </div>

                                <div className="max-h-[60vh] overflow-y-auto space-y-1 scroll-area">
                                    {/* header row */}
                                    <div className="grid grid-cols-12 gap-2 items-center text-xs font-medium text-gray-500 mb-2">
                                        <div className="col-span-6">Item Name</div>
                                        <div className="col-span-3">Quantity</div>
                                        <div className="col-span-2">Unit</div>
                                        <div className="col-span-1">Action</div>
                                    </div>

                                    {/* rows */}
                                    {workingItems.map((it) => (
                                        <div key={it.ID ?? it.__tempId}
                                            className={`grid grid-cols-12 gap-2 items-center p-2 rounded dark:text-white transition-all duration-200 ${it.isNew ? "border border-green-400 bg-green-50" : "border border-transparent"
                                                }`}>
                                            <div className="col-span-6">
                                                <input
                                                    type="text"
                                                    className="w-full border px-2 py-1 rounded"
                                                    value={it.grocery_name}
                                                    onChange={(e) => updateWorkingItem(it.ID ?? it.__tempId, { grocery_name: e.target.value })}
                                                    placeholder="Item name"
                                                />
                                            </div>
                                            <div className="col-span-3">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    className="w-full border px-2 py-1 rounded"
                                                    value={it.amount_num}
                                                    onChange={(e) => {
                                                        const val = e.target.value === "" ? "" : Number(e.target.value);
                                                        updateWorkingItem(it.ID ?? it.__tempId, { amount_num: val, available_amount: syncAmountText(val, it.amount_unit) });
                                                    }}
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <input
                                                    type="text"
                                                    className="w-full border px-2 py-1 rounded"
                                                    value={it.amount_unit}
                                                    onChange={(e) => {
                                                        const unit = e.target.value;
                                                        updateWorkingItem(it.ID ?? it.__tempId, { amount_unit: unit, available_amount: syncAmountText(it.amount_num, unit) });
                                                    }}
                                                />
                                            </div>
                                            <div className="col-span-1 flex justify-center">
                                                <button
                                                    title="Delete"
                                                    className="text-red-500 hover:text-red-700"
                                                    onClick={() => deleteRow(it.ID, it.__tempId)}
                                                >
                                                    <TbTrash />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {workingItems.length === 0 && (
                                        <div className="text-sm text-gray-500">No items. Click "Add Item" to create one.</div>
                                    )}
                                </div>

                                <div className="mt-4 flex items-center justify-between">
                                    <button
                                        onClick={addNewRow}
                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                    >
                                        Add Item
                                    </button>

                                    <div className="text-sm text-gray-500">Tip: leave name blank and delete the row to cancel it.</div>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* <div className="bg-light-background dark:bg-dark-background p-4 rounded-xl shadow-sm border border-accent/70 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start">
                                <div className="flex items-center">
                                    <div className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
                                        <svg className="w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>

                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-light-text dark:text-dark-text">
                                            Party Supplies
                                        </h4>
                                    </div>
                                </div>
                                <div className="flex items-center">

                                    <svg className="w-6 h-6 text-gray-800 dark:text-dark-text" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M12 6h.01M12 12h.01M12 18h.01" />
                                    </svg>

                                </div>
                            </div>
                            <div className="mt-4 text-light-text/80 dark:text-dark-text/50">
                                <div className="flex justify-between items-center text-sm mb-1">
                                    <span>Items</span>
                                    <span>8 / 8</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-500 h-2 rounded-full w-full">

                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-3">
                                <span className="text-sm text-light-text/80 dark:text-dark-text/50">Total Spent</span>
                                <span className="font-bold text-light-text dark:text-dark-text">$42.75</span>
                            </div>
                        </div>
                        <button className="w-full bg-blue-500 text-light-text py-2 mt-4 rounded-lg font-semibold hover:bg-blue-600 cursor-pointer">
                            View List
                        </button>
                    </div> */}


                </div>
            </div>
            <div className="mb-8">
                {/* Header + Filter */}
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-light-text dark:text-dark-text">Shopping History</h2>
                        <p className="text-sm text-gray-500">Your completed grocery lists and spending patterns</p>
                    </div>
                    <div className="flex gap-2">
                        {["all", "this_month", "last_month"].map((f) => (
                            <button
                                key={f}
                                className={`text-sm px-3 py-1.5 rounded-md flex items-center border ${filter === f ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300"}`}
                                onClick={() => setFilter(f)}
                            >
                                {f === "all" ? "All" : f === "this_month" ? "This Month" : "Last Month"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Summary */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6 flex justify-around items-center text-center">
                    <div>
                        <p className="text-2xl font-bold text-gray-900">৳{summary.totalSpent.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">Total Spent</p>
                    </div>
                    <div className="border-l border-gray-200 h-12"></div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{summary.completedLists}</p>
                        <p className="text-sm text-gray-500">Completed Lists</p>
                    </div>
                    <div className="border-l border-gray-200 h-12"></div>
                    <div>
                        <p className="text-2xl font-bold text-green-600">৳{summary.moneySaved.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">Money Saved</p>
                    </div>
                </div>

                {/* Grocery List History */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-200">
                    {displayedLists.map((list) => (
                        <div key={list.list_id} className="p-4 transition-all duration-300">
                            {/* ✅ Top section: icon, info, and total */}
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <div
                                        className={`p-3 rounded-lg mr-4 ${list.money_saved >= 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                                            }`}
                                    >
                                        {list.list_name.toLowerCase().includes("dinner") ? (
                                            <IoRestaurantSharp className="w-6 h-6 text-blue-800" />
                                        ) : (
                                            <MdShoppingBasket className="w-6 h-6 text-green-800" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{list.list_name}</p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(list.created_at).toLocaleDateString()} • {list.items_count} items
                                        </p>
                                        <p
                                            className={`text-sm ${list.money_saved >= 0 ? "text-green-600" : "text-red-500"
                                                }`}
                                        >
                                            {list.money_saved >= 0
                                                ? `Saved ৳${list.money_saved.toFixed(2)}`
                                                : `৳${Math.abs(list.money_saved).toFixed(2)} over budget`}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="font-bold text-gray-900">৳{list.total_price.toFixed(2)}</p>
                                    {/* ✅ View Receipt button — full width below */}
                                    <div className="mt-1 text-right">
                                        {selectedList && selectedList.list_id === list.list_id ? (
                                            <button
                                                className="text-sm text-gray-500 font-semibold hover:text-red-500 transition-colors"
                                                onClick={() => setSelectedList(null)}
                                            >
                                                Close ✕
                                            </button>
                                        ) : (
                                            <button
                                                className="text-sm text-blue-600 font-semibold hover:underline whitespace-nowrap"
                                                onClick={() => handleViewReceipt(list.list_id)}
                                            >
                                                View Receipt
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>



                            {/* ✅ Expandable receipt area (below button) */}
                            <div
                                className={`overflow-hidden transition-all duration-500 ease-in-out ${selectedList && selectedList.list_id === list.list_id
                                    ? "max-h-[500px] opacity-100 mt-3"
                                    : "max-h-0 opacity-0"
                                    }`}
                            >
                                <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                                    <p className="font-semibold text-gray-800 mb-2">Items:</p>
                                    {receiptItems.length > 0 ? (
                                        <ul className="text-sm text-gray-700 space-y-1">
                                            {receiptItems.map((item) => (
                                                <li key={item.item_id}>
                                                    {item.grocery_name} — {item.quantity} × ৳{item.price_per_unit.toFixed(2)} = ৳
                                                    {item.item_total.toFixed(2)}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-500 text-sm">No items found.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>


                {/* View All History */}
                <div className="text-center mt-6">
                    {!showAll ? (
                        <button
                            className="text-blue-600 font-semibold"
                            onClick={() => setShowAll(true)}
                        >
                            View All History
                        </button>
                    ) : (
                        <button
                            className="text-gray-600 font-semibold"
                            onClick={() => setShowAll(false)}
                        >
                            Show Less
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default GroceryList