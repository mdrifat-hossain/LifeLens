import React, { useEffect, useRef } from "react";
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
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        const ctx = chartRef.current.getContext("2d");

        const data = {
            labels: [
                "Nov 15", "Nov 16", "Nov 17", "Nov 18", "Nov 19",
                "Nov 20", "Nov 21", "Nov 22", "Nov 23", "Nov 24",
                "Nov 25", "Nov 26", "Nov 27", "Nov 28", "Nov 29",
                "Nov 30", "Dec 01", "Dec 02", "Dec 03", "Dec 04", "Dec 05"
            ],
            datasets: [
                {
                    label: "Income",
                    data: [3000, 1000, 2500, 2000, 3100, 0, 1700, 0, 700, 1500, 3000, 6000, 5800, 9200, 11000, 0, 1900, 4000, 0, 6000, 5400],
                    backgroundColor: "rgba(34, 197, 94, 0.8)", // green
                    barPercentage: 0.4,
                    categoryPercentage: 0.5
                },
                {
                    label: "Expense",
                    data: [1200, 800, 1000, 1500, 0, 100, 1300, 500, 400, 600, 900, 1200, 1300, 1500, 0, 200, 1000, 1600, 200, 300, 100],
                    backgroundColor: "rgba(239, 68, 68, 0.8)", // red
                    barPercentage: 0.4,
                    categoryPercentage: 0.5
                }
            ]
        };

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => `$${value}`
                    },
                    title: {
                        display: true,
                        text: "Amount"
                    }
                },
                x: {
                    stacked: false // side-by-side bars
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: ctx => `${ctx.dataset.label}: $${ctx.raw}`
                    }
                },
                legend: {
                    position: "top"
                }
            }
        };

        // Destroy old chart instance before creating new one (fixes "Canvas already in use" issue)
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        chartInstance.current = new ChartJS(ctx, {
            type: "bar",
            data,
            options
        });

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, []);

    return (
        <div className="container mx-auto p-8">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-indigo-600">Personal</h1>
                    <p className="text-gray-500">Savings Account</p>
                </div>
                <div className="text-right">
                    <p className="text-3xl font-semibold">$152124.40</p>
                    <p className="text-gray-500 text-sm">187 Transactions</p>
                </div>
            </header>
            <main>
                <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-700">Transaction Overview</h2>
                        <div className="relative">
                            <button
                                className="flex items-center text-gray-600 bg-gray-100 border border-gray-300 rounded-md px-4 py-2 text-sm">
                                Last Month
                                <span className="material-icons ml-2 text-sm">expand_more</span>
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-around mb-6">
                        <div>
                            <p className="text-sm text-gray-500">Total Income</p>
                            <p className="text-2xl font-semibold text-green-500">$57378.46</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Expenses</p>
                            <p className="text-2xl font-semibold text-red-500">$16118.94</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Net</p>
                            <p className="text-2xl font-semibold text-green-500">$41259.52</p>
                        </div>
                    </div>


                    <div className="w-full h-80 relative">

                            <canvas ref={chartRef} id="transactionChart"></canvas>

                    </div>



                    <div className="flex justify-center items-center mt-4">
                        <div className="flex items-center mr-6">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-sm text-gray-600">Income</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                            <span className="text-sm text-gray-600">Expense</span>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <div className="relative">
                            <span
                                className="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">search</span>
                            <input className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm w-80"
                                placeholder="Search transactions..." type="text" />
                        </div>
                        <div>
                            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm">All Types</button>
                        </div>
                    </div>
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="p-4" scope="col">
                                    <input className="rounded" type="checkbox" />
                                </th>
                                <th className="py-3 px-6 flex items-center" scope="col">
                                    Date <span className="material-icons text-sm ml-1">arrow_downward</span>
                                </th>
                                <th className="py-3 px-6" scope="col">
                                    Description
                                </th>
                                <th className="py-3 px-6" scope="col">
                                    Category
                                </th>
                                <th className="py-3 px-6 text-right" scope="col">
                                    Amount
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-white border-b hover:bg-gray-50">
                                <td className="p-4">
                                    <input className="rounded" type="checkbox" />
                                </td>
                                <td className="py-4 px-6">
                                    Dec 12, 2024
                                </td>
                                <td className="py-4 px-6 font-medium text-gray-900">
                                    Flat Rent (Recurring)
                                </td>
                                <td className="py-4 px-6">
                                    <span
                                        className="bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">Rental</span>
                                </td>
                                <td className="py-4 px-6 text-right text-red-500 font-medium">
                                    -$1500.00
                                </td>
                            </tr>
                            <tr className="bg-white border-b hover:bg-gray-50">
                                <td className="p-4">
                                    <input className="rounded" type="checkbox" />
                                </td>
                                <td className="py-4 px-6">
                                    Dec 8, 2024
                                </td>
                                <td className="py-4 px-6 font-medium text-gray-900">
                                    Netflix (Recurring)
                                </td>
                                <td className="py-4 px-6">
                                    <span
                                        className="bg-purple-100 text-purple-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">Entertainment</span>
                                </td>
                                <td className="py-4 px-6 text-right text-red-500 font-medium">
                                    -$10.00
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    )
}

export default TransactionDetails