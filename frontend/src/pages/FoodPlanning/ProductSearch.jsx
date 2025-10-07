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
import { useTheme } from '../../layout/useTheme';

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
    const { darkMode } = useTheme();


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
        setShoppingList((prev) => {
            // Check if item already exists
            const existing = prev.find(i => i.name === item.name);
            if (existing) {
                // Increment quantity
                return prev.map(i =>
                    i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
                );
            } else {
                // Add new item with quantity 1
                return [...prev, { ...item, quantity: 1 }];
            }
        });
    };

    // Remove one unit of item
    const removeItem = (name) => {
        setShoppingList((prev) =>
            prev
                .map(i =>
                    i.name === name ? { ...i, quantity: i.quantity - 1 } : i
                )
                .filter(i => i.quantity > 0) // Remove if quantity is 0
        );
    };


    // const totalPrice = shoppingList.reduce((sum, item) => {
    //     const price = parseFloat(item.discounted_price || item.original_price);
    //     return sum + price * item.quantity;
    // }, 0);





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

    //
    const [listName, setListName] = useState("");

    const totalPrice = shoppingList.reduce(
        (sum, item) => sum + parseFloat(item.discounted_price || item.original_price) * item.quantity,
        0
    );

    const handleAddToMainList = async () => {
        // ✅ Trim and validate list name
        const trimmedListName = listName.trim();
        if (!trimmedListName) return alert("Please enter a list name");
        if (trimmedListName.length > 30) return alert("List name cannot exceed 30 characters");

        // ✅ Calculate total price
        const totalPrice = shoppingList.reduce(
            (sum, item) => sum + (parseFloat(item.discounted_price || item.original_price) * item.quantity),
            0
        );

        // ✅ Prepare payload
        const payload = {
            list_name: trimmedListName,
            total_price: parseFloat(totalPrice.toFixed(2)),
            items: shoppingList.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: parseFloat(item.discounted_price || item.original_price),
            })),
        };

        try {
            const data = await makeRequest("add_grocery_list", {
                method: "POST",
                body: JSON.stringify(payload),
            });

            // ✅ On success: alert and reset all inputs
            alert("List saved successfully!");
            setListName("");          // reset list name
            setShoppingList([]);      // reset shopping list items
        } catch (err) {
            console.error("Error saving shopping list:", err);
            alert("Failed to save the list. Please try again.");
        }
    };



    return (
        <main className="container mx-auto px-4 sm:px-6 ">
            <ToastContainer />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-light-background dark:bg-dark-background border-accent/50 border-1 p-6 rounded-lg shadow-lg">
                        <div className='flex items-center justify-between mb-4'>
                            <h2 className="text-3xl font-bold text-light-text dark:text-dark-text mb-4 inline-block">
                                Product Search
                            </h2>
                            <div className="items-c mb-4 inline-flex">
                                <button
                                    className={`cursor-pointer flex items-center justify-center px-4 py-2 ${mode === "manual" ? "bg-primary/70 dark:bg-primary text-light-text" : " bg-gray-100 dark:bg-accent text-gray-500 dark:text-dark-text"} rounded-l-md font-medium`} onClick={() => setMode("manual")}>
                                    <svg className="w-6 h-6 text-light-text mr-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                                    </svg>
                                    Manual
                                </button>
                                <button
                                    className={`cursor-pointer flex items-center justify-center px-4 py-2 ${mode === "ai" ? "bg-primary/70 dark:bg-primary text-light-text" : " bg-gray-100 dark:bg-accent text-gray-500 dark:text-dark-text"} rounded-r-md font-medium`} onClick={() => setMode("ai")}>
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
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-accent/50 rounded-md  disabled:opacity-50 disabled:cursor-not-allowed dark:text-dark-text focus:outline-0 focus:ring-0"
                                    placeholder="Search for products..."
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    disabled={isLoading}
                                />
                            </div>)}
                        {mode === "ai" && (
                            <div class="bg-primary/20 border border-accent/50 p-4 rounded-lg mb-5">
                                <div class="flex items-start space-x-4 ">
                                    <RiRobot2Fill className="text-accent text-xl mr-2" />
                                    <div class="flex-1">
                                        <p class="text-sm text-light-text dark:text-dark-text mb-2 ">
                                            AI Shopping Assistant
                                        </p>
                                        <textarea
                                            value={text}
                                            onChange={(e) => setText(e.target.value)}
                                            placeholder={displayText}
                                            disabled={isLoading}
                                            class="w-full h-20 p-2 bg-white dark:bg-dark-background rounded-md text-sm focus:ring-primary dark:text-dark-text disabled:opacity-50 disabled:cursor-not-allowed focus:outline-0 focus:ring-0"
                                        ></textarea>
                                        <button
                                            disabled={isLoading}
                                            onClick={handleGenerate}
                                            class="mt-4 px-4 py-2 cursor-pointer bg-primary text-light-text text-sm font-medium rounded-md hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                    className="border border-accent/50 rounded-md pl-4 pr-10 py-2 w-full appearance-none bg-light-background dark:bg-dark-background dark:text-dark-text focus:outline-none"
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
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-light-text dark:text-dark-text">
                                    ▼
                                </span>
                            </div>

                            {/* Shop Filter */}
                            <div className="relative w-full mb-4">
                                <select
                                    className="border border-accent/50 dark:bg-dark-background rounded-md pl-4 pr-10 py-2 w-full appearance-none bg-light-background focus:outline-none dark:text-dark-text"
                                    value={selectedShop}
                                    onChange={(e) => setSelectedShop(e.target.value)}
                                >
                                    {shops.map((shop, idx) => (
                                        <option key={idx} value={shop}>
                                            {shop}
                                        </option>
                                    ))}
                                </select>
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-light-text dark:text-dark-text">
                                    ▼
                                </span>
                            </div>

                            {/* Sort By */}
                            <div className="relative w-full mb-4">
                                <select
                                    className="border border-accent/50 dark:bg-dark-background rounded-md pl-4 pr-10 py-2 w-full appearance-none bg-light-background focus:outline-none dark:text-dark-text"
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                >
                                    <option value="Default">Sort By</option>
                                    <option value="Low to High">Low to High</option>
                                    <option value="High to Low">High to Low</option>
                                </select>
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-light-text dark:text-dark-text">
                                    ▼
                                </span>
                            </div>



                        </div>
                        <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
                            Search Results
                        </h3>


                        {/* Items Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                            {/* Overlay wrapper */}

                            {isLoading && (
                                <div className="m-50 col-span-full inset-0 flex items-center justify-center bg-light-background dark:bg-dark-background bg-opacity-70 z-10 dark:text-dark-text">
                                    <l-grid
                                        size="60"
                                        speed="1.5"
                                        color={darkMode ? "white" : "black"} // ✅ dynamic color
                                    ></l-grid>
                                </div>
                            )}


                            {/* Empty state */}
                            {!isLoading && filteredItems.length === 0 && (
                                <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                                    <svg
                                        className="w-12 h-12 text-gray-400 dark:text-accent mb-4"
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
                                    <h3 className="text-lg font-semibold text-gray-700 dark:text-dark-text">No items found</h3>
                                    <p className="text-gray-500 dark:text-[#b4b4b4] mt-1">Try searching with another keyword or pick a different category.</p>
                                </div>
                            )}

                            {/* Items go here */}
                            {filteredItems.map((item, idx) => (
                                <div
                                    key={item.category + idx}
                                    className="flex items-center justify-between p-4 border border-accent/50 rounded-lg"
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
                                                className="font-medium text-gray-800 dark:text-dark-text hover:underline"
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
                    <div className="bg-light-background dark:bg-dark-background border-accent/50 border-1 p-6 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">
                                Shopping List
                            </h2>
                            <input
                                type="text"
                                placeholder="List name..."
                                className="ml-2 border rounded px-2 py-1 text-sm border-accent/50 dark:text-dark-text"
                                value={listName}
                                onChange={(e) => setListName(e.target.value)}
                            />
                            <span
                                className="text-sm font-medium text-gray-500 bg-gray-100 dark:bg-dark-background border-1 border-accent/50 px-2 py-1 rounded-full"
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
                                <p className="text-sm text-gray-500 dark:text-dark-text">No items added yet.</p>
                            )}

                            {/* {shoppingList.map((item, idx) => (
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
                            ))} */}

                            {shoppingList.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-accent/20 border-accent border-1"
                                >
                                    <div>
                                        <a
                                            href={item.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-medium text-gray-800 dark:text-dark-text hover:underline"
                                        >
                                            {item.name} {item.quantity > 1 && <span className="text-sm text-gray-500">x{item.quantity}</span>}
                                        </a>
                                        <p className="text-sm text-gray-500 dark:text-[#b4b4b4]">
                                            ৳{(parseFloat(item.discounted_price || item.original_price) * item.quantity).toFixed(2)}
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


                        <div className="border-t border-gray-200 dark:border-accent my-4"></div>
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-gray-600 dark:text-dark-text font-medium">Total:</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-dark-text">৳{totalPrice.toFixed(2)}</p>
                        </div>


                        <button
                            className="w-full bg-primary text-light-text font-semibold py-3 rounded-lg flex items-center justify-center hover:bg-primary/80 cursor-pointer"
                            onClick={handleAddToMainList}
                        >
                            <svg className="w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7h-1M8 7h-.688M13 5v4m-2-2h4" />
                            </svg>

                            Add to Main List
                        </button>
                        {/* <button
                            className="w-full mt-2 text-gray-600 bg-gray-200 font-semibold py-3 rounded-lg flex items-center justify-center hover:bg-gray-100"
                        >
                            <FaSave className="w-6 h-6 mr-2 text-gray-800" />
                            Save for Later
                        </button> */}
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
                    <div className="mt-8 bg-white border-1 border-accent/50 dark:bg-dark-background p-6 rounded-lg shadow-sm">
                        <h2
                            className="text-xl font-semibold text-gray-900 dark:text-dark-text mb-4 flex items-center"
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
                                        <path fillRule="evenodd" d="M14 7h-4v3a1 1 0 0 1-2 0V7H6a1 1 0 0 0-.997.923l-.917 11.924A2 2 0 0 0 6.08 22h11.84a2 2 0 0 0 1.994-2.153l-.917-11.924A1 1 0 0 0 18 7h-2v3a1 1 0 1 1-2 0V7Zm-2-3a2 2 0 0 0-2 2v1H8V6a4 4 0 0 1 8 0v1h-2V6a2 2 0 0 0-2-2Z" clipRule="evenodd" />
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
                                        <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z" clip-rule="evenodd" />
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