import React from 'react'
import { Link } from 'react-router-dom'
import { FaListUl } from "react-icons/fa";
import { TbCurrencyTaka } from "react-icons/tb";
import { MdShoppingBasket } from "react-icons/md";
import { CiBookmarkCheck } from "react-icons/ci";
import { IoRestaurantSharp } from "react-icons/io5";

function GroceryList() {
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
                        <p className="text-2xl font-bold text-gray-900">12</p>
                    </div>
                    <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
                        <svg className="w-6 h-6 text-blue-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5" />
                        </svg>

                    </div>
                </div>
                <div className="bg-accent p-4 rounded-xl shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm text-dark-text">This Month</p>
                        <p className="text-2xl font-bold text-gray-900">$324</p>
                    </div>
                    <div className="bg-green-100 text-green-600 p-3 rounded-lg">
                        <TbCurrencyTaka className="w-6 h-6 text-green-800" />
                    </div>
                </div>
                <div className="bg-accent p-4 rounded-xl shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm text-dark-text">Avg per Trip</p>
                        <p className="text-2xl font-bold text-gray-900">$68</p>
                    </div>
                    <div className="bg-yellow-100 text-yellow-600 p-3 rounded-lg">
                        <svg className="w-6 h-6 text-amber-400-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312" />
                        </svg>

                    </div>
                </div>
                <div className="bg-accent p-4 rounded-xl shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm text-dark-text">Success Goal</p>
                        <p className="text-2xl font-bold text-gray-900">78%</p>
                    </div>
                    <div className="bg-purple-100 text-purple-600 p-3 rounded-lg">
                        <svg className="w-6 h-6 text-fuchsia-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.529 9.988a2.502 2.502 0 1 1 5 .191A2.441 2.441 0 0 1 12 12.582V14m-.01 3.008H12M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>

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
                                        <h4 className="font-semibold text-light-text dark:text-dark-text">
                                            Weekly Groceries
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
                                <div className="flex justify-between items-center text-sm  mb-1">
                                    <span>Items</span>
                                    <span>12 / 15</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full w-4/5"></div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-3">
                                <span className="text-sm text-light-text/80 dark:text-dark-text/50">Estimated Total</span>
                                <span className="font-bold text-light-text dark:text-dark-text">$85.50</span>
                            </div>
                        </div>
                        <button className="w-full bg-green-500 text-light-text py-2 mt-4 rounded-lg font-semibold hover:bg-green-600 cursor-pointer">
                            View List
                        </button>
                    </div>
                    <div className="bg-light-background dark:bg-dark-background p-4 rounded-xl shadow-sm border border-accent/70 flex flex-col justify-between">
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
                    </div>
                    
                    
                </div>
            </div>
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-light-text dark:text-dark-text">Shopping History</h2>
                        <p className="text-sm text-gray-500">
                            Your completed grocery lists and spending patterns
                        </p>
                    </div>
                    <button className="text-sm text-gray-700 bg-white border border-gray-300 rounded-md px-3 py-1.5 flex items-center">
                        Last 30 days
                        <svg className="w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7" />
                        </svg>

                    </button>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6 flex justify-around items-center text-center">
                    <div>
                        <p className="text-2xl font-bold text-gray-900">$1,247</p>
                        <p className="text-sm text-gray-500">Total Spent</p>
                    </div>
                    <div className="border-l border-gray-200 h-12"></div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">18</p>
                        <p className="text-sm text-gray-500">Completed Lists</p>
                    </div>
                    <div className="border-l border-gray-200 h-12"></div>
                    <div>
                        <p className="text-2xl font-bold text-green-600">$156</p>
                        <p className="text-sm text-gray-500">Money Saved</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-200">
                    <div className="p-4 flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="bg-green-100 text-green-600 p-3 rounded-lg mr-4">
                                <MdShoppingBasket className="w-6 h-6 text-green-800" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">Weekly Groceries</p>
                                <p className="text-sm text-gray-500">Sep 12, 2024 • 15 items</p>
                                <p className="text-sm text-green-600">Saved $12 with coupons</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-gray-900">$87.45</p>
                            <a className="text-sm text-blue-600 font-semibold" href="#"
                            >View Receipt</a>
                        </div>
                    </div>
                    <div className="p-4 flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="bg-purple-100 text-purple-600 p-3 rounded-lg mr-4">
                                <svg className="w-6 h-6 text-purple-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 17.4302V15h4.33332M5 17.4302V21h14v-6h-4.3333M5 17.4302c.38672.3365.923.5698 1.66666.5698 2.66664 0 2.66666-3 2.66666-3m5.33338 0H9.33332m5.33338 0s0 3-2.6667 3c-2.66668 0-2.66668-3-2.66668-3m5.33338 0s0 3 2.6666 3c.7437 0 1.28-.2333 1.6667-.5698m-7-9.43017c.1093 0 2-1.11929 2-2.5s-1.9079-2.5-2-2.5c-.0921 0-2 1.11929-2 2.5s1.8947 2.5 2 2.5Zm0 0V11m-6 0v4h12v-4H6Z" />
                                </svg>

                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">Birthday Party</p>
                                <p className="text-sm text-gray-500">Sep 08, 2024 • 12 items</p>
                                <p className="text-sm text-red-500">$8 over budget</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-gray-900">$156.78</p>
                            <a className="text-sm text-blue-600 font-semibold" href="#"
                            >View Receipt</a>
                        </div>
                    </div>
                    <div className="p-4 flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="bg-blue-100 text-blue-600 p-3 rounded-lg mr-4">
                                <IoRestaurantSharp className="w-6 h-6 text-blue-800" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">Dinner Ingredients</p>
                                <p className="text-sm text-gray-500">Sep 05, 2024 • 8 items</p>
                                <p className="text-sm text-green-600">
                                    Saved $5 with store brand
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-gray-900">$43.22</p>
                            <a className="text-sm text-blue-600 font-semibold" href="#"
                            >View Receipt</a>
                        </div>
                    </div>
                </div>
                <div className="text-center mt-6">
                    <button className="text-blue-600 font-semibold">
                        View All History
                    </button>
                </div>
            </div>
        </div>
    )
}

export default GroceryList