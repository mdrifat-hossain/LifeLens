import React from "react";
import { useState, useEffect } from 'react';
import { useApi } from "../../utils/api";
import { RiRobot2Fill } from "react-icons/ri";
import { FaSave } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";
import { IoBagCheck } from "react-icons/io5";
import { useAuth } from "@clerk/clerk-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MealChangeAndAlerts = ({ mealData, onUpdateMeal }) => {

    const [isLoading, setIsLoading] = useState(false)
    const { makeRequest } = useApi();
    const [text, setText] = useState("");
    const { userId } = useAuth();
    const [error, setError] = useState(null);

    const placeholders = [
        "E.g., I want something spicy for Monday's breakfast.",
        "Suggest a vegetarian dinner for Friday.",
        "Plan a protein-rich lunch for Wednesday.",
    ];

    const [displayText, setDisplayText] = useState("");
    const [index, setIndex] = useState(0); // current phrase
    const [subIndex, setSubIndex] = useState(0); // current char
    const [deleting, setDeleting] = useState(false);
    const [errorDialog, setErrorDialog] = useState(null); // stores error reason
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        const fetchMeals = async () => {
            if (!userId) return;

            setIsLoading(true);
            setError(null);

            try {
                const res = await makeRequest("get-health-alert");

                if (res.status === "success" && res.data.length > 0) {
                    const parsedAlert = JSON.parse(res.data[0].alert);

                    setAlerts(parsedAlert.alerts); // setAlerts expects array
                } else {
                    console.log("No alerts found");
                    setError("Failed to load alerts.");
                }
            } catch (err) {
                console.error("Error fetching alerts:", err.message);
                setError("Network error.");
            } finally {
                setIsLoading(false);
            }


        };

        fetchMeals();
    }, [userId]);


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


    const handleGenerate = async () => {
        if (!text.trim()) return;

        try {
            setIsLoading(true);

            const res = await makeRequest("change-meal-plan", {
                method: "POST",
                body: JSON.stringify(text),

            });


            if (res.status === "error") {
                setErrorDialog(res.reason); // show dialog
            }
            else if (res.status === "rate_limit_error") {
                setErrorDialog(res.reason);
            }
            else if (res.status === "success" && res.data) {

                toast.success("Meal has been changed as per your request", {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: false,
                    progress: undefined,
                });

                // res.data.nutrition is already an object, no need to parse
                const nutrition = res.data.nutrition;

                const newMeal = {
                    title: `${capitalize(res.data.meal_type)}: ${res.data.name}`, // note: 'name' field
                    details: `Calories: ${nutrition.calories} | Protein: ${nutrition.protein_g}g | Carbs: ${nutrition.carbs_g}g | Fat: ${nutrition.fat_g}g`,
                    image: "https://via.placeholder.com/150", // optional, replace with actual image if available
                };

                console.log(newMeal);

                // Call the parent callback to update mealData
                if (onUpdateMeal) {
                    onUpdateMeal(res.data.day, res.data.meal_type, newMeal);
                }
            }

        } catch (err) {
            console.error("❌ Error sending request:", err);
            setErrorDialog("Network error. Please try again.");
        } finally {
            setText("");
            setIsLoading(false);
        }
    };
    // Helper to capitalize meal type
    const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);


    const colorMap = {
        red: {
            bg: "bg-red-50 dark:bg-red-900",
            border: "border-red-400 dark:border-red-600",
            title: "text-red-800 dark:text-red-200",
            text: "text-red-700 dark:text-red-300",
        },
        orange: {
            bg: "bg-orange-50 dark:bg-orange-900",
            border: "border-orange-400 dark:border-orange-600",
            title: "text-orange-800 dark:text-orange-200",
            text: "text-orange-700 dark:text-orange-300",
        },
        yellow: {
            bg: "bg-yellow-50 dark:bg-yellow-900",
            border: "border-yellow-400 dark:border-yellow-600",
            title: "text-yellow-800 dark:text-yellow-200",
            text: "text-yellow-700 dark:text-yellow-300",
        },
        green: {
            bg: "bg-green-50 dark:bg-green-900",
            border: "border-green-400 dark:border-green-600",
            title: "text-green-800 dark:text-green-200",
            text: "text-green-700 dark:text-green-300",
        },
    };



    const healthAlertGenerator = async () => {
        try {
            const res = await makeRequest("health-habit-alert", { method: "POST" });
            if (res.status === "success") {
                console.log(res);
            }
        } catch (err) {
            console.error("❌ Error fetching data:", err.message);
        } finally {
            setIsLoading(false);
        }
    };


    return (

        <div className="layout-content-container flex-1 flex-col ">
            <ToastContainer />
            <h1 className="text-light-text dark:text-dark-text text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 text-left pb-3 pt-5">
                Customize Your Meal Plan
            </h1>
            <p className="text-light-text/70 dark:text-dark-text text-base font-normal leading-normal pb-3 pt-1 px-4">
                Not happy with a meal? Select the day and meal you'd like to change, and let us know your cravings or preferences below.
            </p>
            <div className="flex flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                    <textarea
                        disabled={isLoading}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={displayText}
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-light-text dark:text-dark-text 
      focus:outline-0 focus:ring-0 border border-[#dce0e5] dark:border-accent/30 bg-light-background dark:bg-dark-background focus:border-[#dce0e5] min-h-36 
      placeholder:text-[#637488] p-[15px] text-base font-normal leading-normal"
                    />
                </label>
            </div>
            <div className="flex px-4 py-3 justify-end">
                <button
                    onClick={handleGenerate}
                    disabled={isLoading || mealData.length === 0}
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-light-text text-sm font-bold leading-normal tracking-[0.015em] disabled:opacity-50 disabled:cursor-not-allowed shadow hover:shadow-lg transition"
                >
                    <span className="truncate">{isLoading ? "Generating..." : "Generate Meal"}</span>
                </button>
            </div>


            <h3 className="text-light-text dark:text-dark-text text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-4 pt-4">
                Health Suggestions
            </h3>

            {/* Suggested Meal Cards */}
            {/* {[1, 2, 3].map((num) => (
                <div key={num} className="p-4">
                    <div className="flex items-stretch justify-between gap-4 rounded-xl">
                        <div className="flex flex-[2_2_0px] flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <p className="text-[#111418] text-base font-bold leading-tight">
                                    Suggested Meal {num}
                                </p>
                                <p className="text-[#637488] text-sm font-normal leading-normal">
                                    Calories: {400 - num * 25} | Protein: {20 - num * 2}g | Carbs: {30 + num * 5}g | Fat: {15 - num}g
                                </p>
                            </div>
                            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 flex-row-reverse bg-[#f0f2f4] text-[#111418] text-sm font-medium leading-normal w-fit">
                                <span className="truncate">Replace</span>
                            </button>
                        </div>
                        <div
                            className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl flex-1"
                            style={{
                                backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAHSOCgH-0tjkaAHs0lWYntXAGXf1CazoELXNc41LNWljGIF8AVyf8HlLYf1NKzTaEVq2KSZfc4TiCui8024bcmobrqHRjH3DPEOz9q-m6TYFnZPesaxctuT_87Yi2QK6QjZs10KRkuGLKvkj4A-Lk8y_nqqoHb0FzsdwbQU91-XuCghxB8LePuaKqfqbL4loaXcf27jmcmjcC9L6qSzDPMaGGzgQg8KFu6-xtlEWdMRE-iwPdvysfZNGaCLAi8Jd2SIhW932giwrQ")`,
                            }}
                        ></div>
                    </div>
                </div>
            ))} */}

            <button
                onClick={healthAlertGenerator}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-light-text text-sm ml-5 mb-5">
                Temp btn for Alert</button>

            <div className="grid grid-rows-3 md:grid-rows-3 gap-6 ml-4">


                {alerts.map((a, idx) => {
                    const colors = colorMap[a.risk_color] || colorMap.red;
                    return (
                        <div
                            key={idx}
                            className={`${colors.bg} p-4 rounded-lg border-l-4 ${colors.border}`}
                        >
                            <p className={`font-semibold ${colors.title} flex items-center`}>
                                <IoBagCheck className="w-6 h-6 mr-2" />
                                {a.title}
                            </p>
                            <p className={`text-sm ${colors.text} mt-2`}>{a.issue}</p>
                            <p className={`text-sm font-semibold ${colors.title} mt-2 inline-block`}>
                                {a.action}
                            </p>
                        </div>
                    );
                })}


            </div>


            {/* Error Dialog */}
            {errorDialog && (
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
            )}

        </div>
    );
}

export default MealChangeAndAlerts;