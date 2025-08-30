
import { useEffect } from "react";
import Highcharts from "highcharts";
import { MdAccountBalanceWallet } from "react-icons/md";
import { FaArrowUp } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";
import { MdSavings } from "react-icons/md";
import { MdExpandMore } from "react-icons/md";
import { FaLightbulb } from "react-icons/fa";
import { FaArrowTrendUp } from "react-icons/fa6";
import { MdReport } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";

function FinancialDashboard() {

    useEffect(() => {
        Highcharts.chart("pie-chart", {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: "pie",
            },
            title: { text: "" },
            tooltip: { pointFormat: "{series.name}: <b>${point.y}</b>" },
            accessibility: { point: { valueSuffix: "%" } },
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
                itemStyle: {
                    color: "#6b7280",
                    fontWeight: "normal",
                },
            },
            credits: {
                enabled: true,
                text: "Highcharts.com",
                href: "https://www.highcharts.com",
            },
            series: [
                {
                    name: "Spending",
                    colorByPoint: true,
                    data: [
                        { name: "Food & Dining", y: 800, color: "#ef4444" },
                        { name: "Transportation", y: 300, color: "#3b82f6" },
                        { name: "Shopping", y: 450, color: "#8b5cf6" },
                        { name: "Entertainment", y: 150, color: "#10b981" },
                        { name: "Utilities", y: 250, color: "#f97316" },
                    ],
                },
            ],
        });
    }, []);

    return (
        <div className="max-w-7xl mx-auto">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                    <p className="text-gray-500">Welcome back! Here's your financial overview</p>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700">
                        <IoMdAdd className="mr-2" size={20} />
                        Add Transaction
                    </button>
                    <img alt="User avatar" className="w-10 h-10 rounded-full"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkoAPCB2xlqkehOL3jQUx5uv5fZJ5dvkl4Vmp8OE5Xgd5PLXOBVrl5lkSgVi1oTFES43N2gGtFSBMnfOjSfGld-TVdsgff5hMTGJZGNcNVIy23gVmINirZve4mI0gXvfpvRoxWeyCywncuVca73VDWpFiMlkz2qyyemWqEeflXCPPZflLIoGO68J7kUflbthdjiEp3X00jPRKUySpclN8WdZmx3novKYgySo4GHZFPn848PZ_8BHNpQ4QfeFmeo6ZS4U89QwmdZgc" />
                </div>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm">Total Balance</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">$12,450.00</p>
                        </div>
                        <div className="bg-green-100 p-2 rounded-lg">
                            <MdAccountBalanceWallet className="text-green-500" size={24} />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm">Monthly Income</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">$5,200.00</p>
                        </div>
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <FaArrowUp className="text-blue-500" size={24} />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm">Monthly Expenses</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">$3,850.00</p>
                        </div>
                        <div className="bg-red-100 p-2 rounded-lg">
                            <FaArrowDown className="text-red-500" size={24} />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm">Savings Goal</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">75%</p>
                        </div>
                        <div className="bg-purple-100 p-2 rounded-lg">
                            <MdSavings className="text-purple-500" size={24} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Expense Breakdown</h2>
                        <div className="relative">
                            <select
                                className="appearance-none bg-gray-100 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                                <option>This Month</option>
                                <option>Last Month</option>
                            </select>
                            <div
                                className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <MdExpandMore className="text-gray-500" size={20} />
                            </div>
                        </div>
                    </div>
                    <div id="pie-chart" className="w-full h-[400px]"></div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Smart Suggestions</h2>
                    <div className="space-y-6">
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                            <div className="flex">
                                <div className="mr-3">
                                    <FaLightbulb className="text-yellow-500" size={24} />
                                </div>
                                <div>
                                    <p className="font-bold text-yellow-800">Reduce Dining Out</p>
                                    <p className="text-sm text-yellow-700 mt-1">You spent 40% more on dining this month. Try
                                        cooking at home to save $200.</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                            <div className="flex">
                                <div className="mr-3">
                                    <FaArrowTrendUp className="text-green-500" size={24} />
                                </div>
                                <div>
                                    <p className="font-bold text-green-800">Increase Savings</p>
                                    <p className="text-sm text-green-700 mt-1">Based on your income, you could save an
                                        additional $300 monthly.</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                            <div className="flex">
                                <div className="mr-3">
                                    <MdReport className="text-blue-500" size={24} />
                                </div>
                                <div>
                                    <p className="font-bold text-blue-800">Budget Alert</p>
                                    <p className="text-sm text-blue-700 mt-1">You're 85% through your shopping budget for this
                                        month.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="mt-10">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">Recent Transactions</h2>
                            <div className="relative">
                                <select
                                    className="appearance-none bg-gray-100 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                                    <option>All Accounts</option>
                                </select>
                                <div
                                    className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <MdExpandMore className="text-gray-500" size={20} />
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between py-4 border-b border-gray-200">
                                <div className="flex items-center">
                                    {/* <div className="bg-red-100 p-3 rounded-lg mr-4">
                                        <span className="material-icons text-red-500">restaurant</span>
                                    </div> */}
                                    <div>
                                        <p className="font-medium text-gray-800">Restaurant XYZ</p>
                                        <p className="text-sm text-gray-500">Food &amp; Dining • Today</p>
                                    </div>
                                </div>
                                <p className="text-red-500 font-semibold">-$45.50</p>
                            </div>
                            <div className="flex items-center justify-between py-4 border-b border-gray-200">
                                <div className="flex items-center">
                                    {/* <div className="bg-green-100 p-3 rounded-lg mr-4">
                                        <span className="material-icons text-green-500">paid</span>
                                    </div> */}
                                    <div>
                                        <p className="font-medium text-gray-800">Salary Deposit</p>
                                        <p className="text-sm text-gray-500">Income • Yesterday</p>
                                    </div>
                                </div>
                                <p className="text-green-500 font-semibold">+$2,600.00</p>
                            </div>
                            <div className="flex items-center justify-between py-4 border-b border-gray-200">
                                <div className="flex items-center">
                                    {/* <div className="bg-blue-100 p-3 rounded-lg mr-4">
                                        <span className="material-icons text-blue-500">local_gas_station</span>
                                    </div> */}
                                    <div>
                                        <p className="font-medium text-gray-800">Gas Station</p>
                                        <p className="text-sm text-gray-500">Transportation • 2 days ago</p>
                                    </div>
                                </div>
                                <p className="text-red-500 font-semibold">-$65.20</p>
                            </div>
                            <div className="flex items-center justify-between py-4">
                                <div className="flex items-center">
                                    {/* <div className="bg-purple-100 p-3 rounded-lg mr-4">
                                        <span className="material-icons text-purple-500">shopping_cart</span>
                                    </div> */}
                                    <div>
                                        <p className="font-medium text-gray-800">Grocery Store</p>
                                        <p className="text-sm text-gray-500">Shopping • 3 days ago</p>
                                    </div>
                                </div>
                                <p className="text-red-500 font-semibold">-$125.80</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">Your Accounts</h2>
                            <button
                                className="flex items-center bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                                <IoMdAdd className="mr-2" size={20}/>
                                Add Account
                            </button>
                        </div>
                        <div>
                            <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg mb-4">
                                <div className="flex items-center">
                                    {/* <div className="bg-blue-100 p-3 rounded-lg mr-4">
                                        <span className="material-icons text-blue-500">account_balance</span>
                                    </div> */}
                                    <div>
                                        <p className="font-medium text-gray-800">Checking Account</p>
                                        <p className="text-sm text-gray-500">****1234</p>
                                    </div>
                                </div>
                                <p className="text-gray-800 font-semibold">$8,450.00</p>
                            </div>
                            <div className="flex items-center justify-between bg-green-50 p-4 rounded-lg mb-4">
                                <div className="flex items-center">
                                    {/* <div className="bg-green-100 p-3 rounded-lg mr-4">
                                        <span className="material-icons text-green-500">savings</span>
                                    </div> */}
                                    <div>
                                        <p className="font-medium text-gray-800">Savings Account</p>
                                        <p className="text-sm text-gray-500">****5678</p>
                                    </div>
                                </div>
                                <p className="text-gray-800 font-semibold">$4,000.00</p>
                            </div>
                            <div className="flex items-center justify-between bg-red-50 p-4 rounded-lg">
                                <div className="flex items-center">
                                    {/* <div className="bg-red-100 p-3 rounded-lg mr-4">
                                        <span className="material-icons text-red-500">credit_card</span>
                                    </div> */}
                                    <div>
                                        <p className="font-medium text-gray-800">Credit Card</p>
                                        <p className="text-sm text-gray-500">****9012</p>
                                    </div>
                                </div>
                                <p className="text-red-500 font-semibold">-$1,250.00</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm mt-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Budget Planner - Based on Past Expenses</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span>Food &amp; Dining</span>
                                <span>$800 / $600</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-red-500 h-2.5 w-full rounded-full"></div>
                            </div>
                            <p className="text-xs text-red-500 mt-1">33% over budget</p>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span>Transportation</span>
                                <span>$300 / $400</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-green-500 h-2.5 w-[75%] rounded-full"></div>
                            </div>
                            <p className="text-xs text-green-500 mt-1">25% under budget</p>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span>Shopping</span>
                                <span>$450 / $500</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-yellow-400 h-2.5 w-[90%] rounded-full"></div>
                            </div>
                            <p className="text-xs text-yellow-600 mt-1">90% of budget used</p>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span>Entertainment</span>
                                <span>$150 / $200</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-green-500 h-2.5 w-[75%] rounded-full"></div>
                            </div>
                            <p className="text-xs text-green-500 mt-1">25% under budget</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>

    )
}

export default FinancialDashboard