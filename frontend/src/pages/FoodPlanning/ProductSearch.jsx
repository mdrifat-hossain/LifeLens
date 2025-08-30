import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { RiRobot2Fill } from "react-icons/ri";
import { FaSave } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";
import { IoBagCheck } from "react-icons/io5";
import { useApi } from "../../utils/api";
import { grid } from 'ldrs';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

grid.register();

function ProductSearch() {
    const { makeRequest } = useApi();
    const [mode, setMode] = useState("manual")
    const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const [text, setText] = useState("");
    const [displayText, setDisplayText] = useState("");
    const [index, setIndex] = useState(0); // current phrase
    const [subIndex, setSubIndex] = useState(0); // current char
    const [deleting, setDeleting] = useState(false);
    const [errorDialog, setErrorDialog] = useState(null); // stores error reason
    const [alerts, setAlerts] = useState([]);
    const [data, setData] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [selectedShop, setSelectedShop] = useState("All Shops");
    const [sortOption, setSortOption] = useState("Default");
    const [shoppingList, setShoppingList] = useState([]);

    const errorAddingCart = () => {
        toast.error("Item is already selected", {
        position: "bottom-right",
        autoClose: 5000, 
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
    });
    }


    const isFirstLoad = useRef(true);

    useEffect(() => {
        const storedList = localStorage.getItem("shoppingList");
        if (storedList) {
            setShoppingList(JSON.parse(storedList));
        }
    }, []);

    useEffect(() => {
        if (isFirstLoad.current) {
            isFirstLoad.current = false;
            return;
        }
        localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
    }, [shoppingList]);
    // Add item
    const addItem = (item) => {
        // prevent duplicates
        if (!shoppingList.find((i) => i.name === item.name)) {
            setShoppingList((prev) => [...prev, item]);
        }
        else {
            errorAddingCart();
            
        }
    };
    // Remove item
    const removeItem = (name) => {
        setShoppingList((prev) => prev.filter((i) => i.name !== name));
    };
    // Compute total price
    const totalPrice = shoppingList.reduce((sum, item) => {

        const price = parseFloat(item.discounted_price || item.original_price);
        return sum + price;
    }, 0);




    // Flatten all items into one list with category info
    const allItems = Object.entries(data).flatMap(([category, items]) =>
        items.map((item) => ({ ...item, category }))
    );

    // Extract unique shops dynamically
    const shops = ["All Shops", ...new Set(allItems.map((item) => item.shop))];

    // Apply both filters
    let filteredItems = allItems.filter((item) => {
        const categoryMatch =
            selectedCategory === "All Categories" || item.category === selectedCategory;
        const shopMatch =
            selectedShop === "All Shops" || item.shop === selectedShop;
        return categoryMatch && shopMatch;
    });

    if (sortOption === "Low to High") {
        filteredItems = [...filteredItems].sort(
            (a, b) => (a.discounted_price || a.original_price) - (b.discounted_price || b.original_price)
        );
    } else if (sortOption === "High to Low") {
        filteredItems = [...filteredItems].sort(
            (a, b) => (b.discounted_price || b.original_price) - (a.discounted_price || a.original_price)
        );
    }


    const placeholders = React.useMemo(() => [
        "What do I need for chicken tacos?",
        "Show me items for homemade margherita pizza",
        "I want to bake chocolate chip cookies",
        "What do I need for a high-protein vegetarian meal?"
    ], []);

    useEffect(() => {
        if (index >= placeholders.length) return;

        if (
            !deleting &&
            subIndex === placeholders[index].length + 1 // finished typing
        ) {
            setTimeout(() => setDeleting(true), 1500); // pause before deleting
            return;
        }

        if (deleting && subIndex === 0) {
            setDeleting(false);
            setIndex((prev) => (prev + 1) % placeholders.length); // move to next phrase
            return;
        }

        const timeout = setTimeout(() => {
            setSubIndex((prev) => prev + (deleting ? -1 : 1));
        }, deleting ? 40 : 70); // speed: delete faster than typing

        return () => clearTimeout(timeout);
    }, [subIndex, deleting, index, placeholders]);

    useEffect(() => {
        setDisplayText(placeholders[index].substring(0, subIndex));
    }, [subIndex, index]);



    const handleSearch = async () => {
        setData([])
        setIsLoading(true);

        if (query.trim() !== "") {
            try {
                const data = await makeRequest("grocery-search", {
                    method: "POST",
                    body: JSON.stringify(query),
                });

                console.log("Backend response:", data.results);
                setData(data.results)

            } catch (error) {
                console.error("Error searching product:", error);
            } finally {
                setIsLoading(false);
                setQuery("");
            }
        }
    };
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && query.trim() !== "") {
            e.preventDefault();
            handleSearch();
        }
    }



    const handleGenerate = async () => {
        if (!text.trim()) return;

        try {
            setData([])
            setIsLoading(true);

            const res = await makeRequest("generate-grocery-product", {
                method: "POST",
                body: JSON.stringify(text),
            });

            if (res.status === "error") {
                setErrorDialog(res.reason); // show dialog
            } else if (res.status === "success" && res.results) {

                setData(res.results)
            }

        } catch (err) {
            console.error("❌ Error sending request:", err);
            setErrorDialog("Network error. Please try again.");
        } finally {
            setText("");
            setIsLoading(false);
        }
    };



    return (
        <main className="container mx-auto px-4 sm:px-6 ">
            <ToastContainer />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className='flex items-center justify-between mb-4'>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4 inline-block">
                                Product Search
                            </h2>
                            <div className="items-c mb-4 inline-flex">
                                <button
                                    className={`cursor-pointer flex items-center justify-center px-4 py-2 ${mode === "manual" ? "bg-blue-100 text-blue-600" : " bg-gray-100 text-gray-500"} rounded-l-md font-medium`} onClick={() => setMode("manual")}>
                                    <svg className="w-6 h-6 text-blue-800 mr-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                                    </svg>
                                    Manual
                                </button>
                                <button
                                    className={`cursor-pointer flex items-center justify-center px-4 py-2 ${mode === "ai" ? "bg-blue-100 text-blue-600" : " bg-gray-100 text-gray-500"} rounded-r-md font-medium`} onClick={() => setMode("ai")}>
                                    <RiRobot2Fill className="mr-2 text-xl" />

                                    AI
                                    Assistant
                                </button>
                            </div>
                        </div>
                        {mode === "manual" && (
                            <div className="relative mb-4 flex">
                                <svg className="absolute top-2 left-2 w-6 h-6 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                                </svg>
                                <input
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="Search for products..."
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    disabled={isLoading}
                                />
                            </div>)}
                        {mode === "ai" && (
                            <div class="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-5">
                                <div class="flex items-start space-x-4 ">
                                    <RiRobot2Fill className="text-blue-600 text-xl mr-2" />
                                    <div class="flex-1">
                                        <p class="text-sm text-blue-600 mb-2 ">
                                            AI Shopping Assistant
                                        </p>
                                        <textarea
                                            value={text}
                                            onChange={(e) => setText(e.target.value)}
                                            placeholder={displayText}
                                            disabled={isLoading}
                                            class="w-full h-20 p-2 border bg-white border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        ></textarea>
                                        <button
                                            disabled={isLoading}
                                            onClick={handleGenerate}
                                            class="mt-4 px-4 py-2 cursor-pointer bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Get Suggestions
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex space-x-4 mb-6">

                            {/* Category Filter */}
                            <div className="relative w-full mb-4">
                                <select
                                    className="border border-gray-300 rounded-md pl-4 pr-10 py-2 w-full appearance-none bg-white focus:outline-none"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    <option>All Categories</option>
                                    {Object.keys(data).map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                    ▼
                                </span>
                            </div>

                            {/* Shop Filter */}
                            <div className="relative w-full mb-4">
                                <select
                                    className="border border-gray-300 rounded-md pl-4 pr-10 py-2 w-full appearance-none bg-white focus:outline-none"
                                    value={selectedShop}
                                    onChange={(e) => setSelectedShop(e.target.value)}
                                >
                                    {shops.map((shop, idx) => (
                                        <option key={idx} value={shop}>
                                            {shop}
                                        </option>
                                    ))}
                                </select>
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                    ▼
                                </span>
                            </div>

                            {/* Sort By */}
                            <div className="relative w-full mb-4">
                                <select
                                    className="border border-gray-300 rounded-md pl-4 pr-10 py-2 w-full appearance-none bg-white focus:outline-none"
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                >
                                    <option value="Default">Sort By</option>
                                    <option value="Low to High">Low to High</option>
                                    <option value="High to Low">High to Low</option>
                                </select>
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                    ▼
                                </span>
                            </div>



                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Search Results
                        </h3>


                        {/* Items Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                            {/* Overlay wrapper */}

                            {isLoading && (
                                <div className="m-30 col-span-full inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                                    <l-grid size="60" speed="1.5" color="black"></l-grid>
                                </div>
                            )}

                            {/* Empty state */}
                            {!isLoading && filteredItems.length === 0 && (
                                <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                                    <svg
                                        className="w-12 h-12 text-gray-400 mb-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9 13h6m-3-3v6m-9 5h18a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <h3 className="text-lg font-semibold text-gray-700">No items found</h3>
                                    <p className="text-gray-500 mt-1">Try searching with another keyword or pick a different category.</p>
                                </div>
                            )}

                            {/* Items go here */}
                            {filteredItems.map((item, idx) => (
                                <div
                                    key={item.category + idx}
                                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                                >
                                    <div className="flex items-center">
                                        <img
                                            alt={item.name}
                                            className="w-16 h-16 rounded-md"
                                            src={item.image_link}
                                        />
                                        <div className="ml-4">
                                            <a
                                                href={item.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-medium text-gray-800 hover:underline"
                                            >
                                                {item.name}
                                            </a>

                                            {/* Price */}
                                            {item.discounted_price ? (
                                                <div className="flex items-center gap-2">
                                                    <p className="font-semibold text-green-600">
                                                        ৳{item.discounted_price}
                                                    </p>
                                                    <p className="text-sm text-gray-500 line-through">
                                                        ৳{item.original_price}
                                                    </p>
                                                </div>
                                            ) : (
                                                <p className="font-semibold text-green-600">
                                                    ৳{item.original_price}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* + button */}
                                    <button
                                        className="bg-green-100 text-green-600 p-2 rounded-full hover:bg-green-200"
                                        onClick={() => addItem(item)}
                                    >
                                        <svg
                                            className="w-6 h-6 text-green-800"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M5 12h14m-7 7V5"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            ))}

                        </div>



                    </div>
                </div>
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Shopping List
                            </h2>
                            <span
                                className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full"
                            >{shoppingList.length} items</span>
                        </div>
                        {/* <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-gray-800">Organic Bananas</p>
                                    <p className="text-sm text-gray-500">$2.49</p>
                                </div>
                                <button className="text-red-500 hover:text-red-700">
                                    <svg className="w-6 h-6 text-red-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>

                                </button>
                            </div>
                        </div> */}

                        <div className="space-y-3">

                            {shoppingList.length === 0 && (
                                <p className="text-sm text-gray-500">No items added yet.</p>
                            )}

                            {shoppingList.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="flex justify-between items-center p-3 border rounded-lg bg-gray-50"
                                >
                                    <div>
                                        <a
                                            href={item.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-medium text-gray-800 hover:underline"
                                        >
                                            {item.name}
                                        </a>
                                        <p className="text-sm text-gray-500">
                                            ৳{item.discounted_price || item.original_price}
                                        </p>
                                    </div>
                                    <button
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => removeItem(item.name)}
                                    >
                                        <svg
                                            className="w-6 h-6 text-red-800"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>


                        <div className="border-t border-gray-200 my-4"></div>
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-gray-600 font-medium">Total:</p>
                            <p className="text-xl font-bold text-gray-900">৳{totalPrice.toFixed(2)}</p>
                        </div>
                        

                        <button
                            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center hover:bg-blue-700"
                        >
                            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7h-1M8 7h-.688M13 5v4m-2-2h4" />
                            </svg>

                            Add to Main List
                        </button>
                        <button
                            className="w-full mt-2 text-gray-600 bg-gray-200 font-semibold py-3 rounded-lg flex items-center justify-center hover:bg-gray-100"
                        >
                            <FaSave className="w-6 h-6 mr-2 text-gray-800" />
                            Save for Later
                        </button>
                        <div
                            className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg"
                        >
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <IoIosWarning className="w-6 h-6 text-yellow-600" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-yellow-800">
                                        Budget Impact
                                    </p>
                                    <p className="text-sm text-yellow-700 mt-1">
                                        This purchase will use 8% of your weekly grocery budget
                                        ($170)
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
                        <h2
                            className="text-xl font-semibold text-gray-900 mb-4 flex items-center"
                        >
                            <div className="bg-amber-100 p-2 rounded-full mr-4">
                                <svg className="w-6 h-6 text-amber-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 9a3 3 0 0 1 3-3m-2 15h4m0-3c0-4.1 4-4.9 4-9A6 6 0 1 0 6 9c0 4 4 5 4 9h4Z" />
                                </svg>

                            </div>
                            Smart Savings Suggestions
                        </h2>
                        <div className="grid grid-rows-3 md:grid-rows-3 gap-6">
                            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                                <p className="font-semibold text-green-800 flex items-center">
                                    <IoBagCheck className="w-6 h-6 mr-2" />
                                    Better Deal
                                </p>
                                <p className="text-sm text-green-700 mt-2">
                                    Store brand milk costs $1.50 less
                                </p>
                                <a
                                    className="text-sm font-semibold text-green-800 mt-2 inline-block"
                                    href="#"
                                >Switch &amp; Save</a>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                                <p className="font-semibold text-blue-800 flex items-center">
                                    <svg className="w-6 h-6 mr-2 text-blue-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path fill-rule="evenodd" d="M14 7h-4v3a1 1 0 0 1-2 0V7H6a1 1 0 0 0-.997.923l-.917 11.924A2 2 0 0 0 6.08 22h11.84a2 2 0 0 0 1.994-2.153l-.917-11.924A1 1 0 0 0 18 7h-2v3a1 1 0 1 1-2 0V7Zm-2-3a2 2 0 0 0-2 2v1H8V6a4 4 0 0 1 8 0v1h-2V6a2 2 0 0 0-2-2Z" clip-rule="evenodd" />
                                    </svg>
                                    Bulk
                                    Savings
                                </p>
                                <p className="text-sm text-blue-700 mt-2">
                                    Buy 3 lbs of bananas, save 15%
                                </p>
                                <a
                                    className="text-sm font-semibold text-blue-800 mt-2 inline-block"
                                    href="#"
                                >Add to Cart</a>
                            </div>
                            <div
                                className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400"
                            >
                                <p className="font-semibold text-purple-800 flex items-center">
                                    <svg className="w-6 h-6 mr-2 text-purple-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z" clip-rule="evenodd" />
                                    </svg>
                                    Seasonal
                                </p>
                                <p className="text-sm text-purple-700 mt-2">
                                    Apples are 30% cheaper this week
                                </p>
                                <a
                                    className="text-sm font-semibold text-purple-800 mt-2 inline-block"
                                    href="#"
                                >View Options</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
                <h2
                    className="text-xl font-semibold text-gray-900 mb-4 flex items-center"
                >
                    <div className="bg-amber-100 p-2 rounded-full mr-4">
                        <svg className="w-6 h-6 text-amber-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 9a3 3 0 0 1 3-3m-2 15h4m0-3c0-4.1 4-4.9 4-9A6 6 0 1 0 6 9c0 4 4 5 4 9h4Z" />
                        </svg>

                    </div>
                    Smart Savings Suggestions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                        <p className="font-semibold text-green-800 flex items-center">
                            <IoBagCheck className="w-6 h-6 mr-2" />
                            Better Deal
                        </p>
                        <p className="text-sm text-green-700 mt-2">
                            Store brand milk costs $1.50 less
                        </p>
                        <a
                            className="text-sm font-semibold text-green-600 mt-2 inline-block"
                            href="#"
                        >Switch &amp; Save</a>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                        <p className="font-semibold text-blue-800 flex items-center">
                            <svg className="w-6 h-6 mr-2 text-blue-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fill-rule="evenodd" d="M14 7h-4v3a1 1 0 0 1-2 0V7H6a1 1 0 0 0-.997.923l-.917 11.924A2 2 0 0 0 6.08 22h11.84a2 2 0 0 0 1.994-2.153l-.917-11.924A1 1 0 0 0 18 7h-2v3a1 1 0 1 1-2 0V7Zm-2-3a2 2 0 0 0-2 2v1H8V6a4 4 0 0 1 8 0v1h-2V6a2 2 0 0 0-2-2Z" clip-rule="evenodd" />
                            </svg>
                            Bulk
                            Savings
                        </p>
                        <p className="text-sm text-blue-700 mt-2">
                            Buy 3 lbs of bananas, save 15%
                        </p>
                        <a
                            className="text-sm font-semibold text-blue-600 mt-2 inline-block"
                            href="#"
                        >Add to Cart</a>
                    </div>
                    <div
                        className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400"
                    >
                        <p className="font-semibold text-purple-800 flex items-center">
                            <svg className="w-6 h-6 mr-2 text-purple-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z" clip-rule="evenodd" />
                            </svg>
                            Seasonal
                        </p>
                        <p className="text-sm text-purple-700 mt-2">
                            Apples are 30% cheaper this week
                        </p>
                        <a
                            className="text-sm font-semibold text-purple-600 mt-2 inline-block"
                            href="#"
                        >View Options</a>
                    </div>
                </div>
            </div> */}

            {/* Error Dialog */}
            {
                errorDialog && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 transition-opacity duration-300">
                        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 transform transition-transform duration-300 scale-100">
                            <h2 className="text-lg font-bold mb-4 text-red-600">Error</h2>
                            <p className="mb-6 text-gray-700">{errorDialog}</p>
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setErrorDialog(null)}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </main >
    )
}

export default ProductSearch