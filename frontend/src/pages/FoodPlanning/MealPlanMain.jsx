import MealDaySection from './MealDaySection';
import MealChangeAndAlerts from './MealChangeAndAlerts';
import { useState, useEffect } from 'react';
import { useApi } from "../../utils/api";
import { useAuth } from "@clerk/clerk-react";

function MealPlanMain() {
    const { makeRequest } = useApi();
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null);
    const { userId } = useAuth();

    const [mealData, setMealData] = useState({ weekly: [], daily: [] });
    const [day, setDay] = useState(null)
    const [activeTab, setActiveTab] = useState("daily");


    useEffect(() => {
        const fetchMeals = async () => {
            if (!userId) return;

            setIsLoading(true);
            setError(null);

            try {
                const res = await makeRequest("get-all-meal");
                if (res.status === "success") {
                    set_Meal_Data(res)
                } else {
                    setError("Failed to load meals.");
                }
            } catch (err) {
                console.error("❌ Error fetching meals:", err.message);
                setError("Permission denied or network error.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMeals();
    }, [userId]);

    // helper to capitalize
    const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

    const generate_meal = async () => {
        setMealData({ weekly: [], daily: [] })
        setIsLoading(true);

        try {
            const res = await makeRequest("all-meal-generator", { method: "POST" });
            if (res.status === "success") {
                set_Meal_Data(res)
            }
        } catch (err) {
            console.error("❌ Error fetching data:", err.message);
        } finally {
            setIsLoading(false);
        }
    };


    const set_Meal_Data = (res) => {
        const grouped = {};
        const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
        setDay(today);
        let todayMeals = [];

        res.data.forEach(item => {
            const nutrition = JSON.parse(item.nutrition);

            let parsedRecipe = item.recipe;
            try {
                if (typeof parsedRecipe === "string") {
                    parsedRecipe = JSON.parse(parsedRecipe);
                }
            } catch (err) {
                console.error("Error parsing recipe:", err);
                parsedRecipe = [];
            }

            const mealObj = {
                title: `${capitalize(item.meal_type)}: ${item.meal_name.replace(/"/g, '')}`,
                details: `Calories: ${nutrition.calories} | Protein: ${nutrition.protein_g}g | Carbs: ${nutrition.carbs_g}g | Fat: ${nutrition.fat_g}g`,
                image: "https://media.post.rvohealth.io/wp-content/uploads/2024/06/oatmeal-bowl-blueberries-strawberries-breakfast-1200x628-facebook.jpg",
                recipe: parsedRecipe // ✅ FIXED
            };
            console.log("Recipe for", item.meal_name, ":", parsedRecipe);

            if (!grouped[item.meal_day]) {
                grouped[item.meal_day] = { day: item.meal_day, meals: [] };
            }
            grouped[item.meal_day].meals.push(mealObj);

            if (item.meal_day.toLowerCase() === today.toLowerCase()) {
                todayMeals.push(mealObj);
            }
        });

        setMealData({
            weekly: Object.values(grouped),
            daily: todayMeals
        });
    };




    const updateMeal = (day, mealType, newMeal) => {
        setMealData(prev => {
            // Update weekly meals
            const updatedWeekly = prev.weekly.map(d => {
                if (d.day === day) {
                    const updatedMeals = d.meals.map(m => {
                        const currentType = m.title.split(":")[0].toLowerCase();
                        if (currentType === mealType.toLowerCase()) {
                            return newMeal; // replace
                        }
                        return m;
                    });
                    return { ...d, meals: updatedMeals };
                }
                return d;
            });

            // Recompute daily (today's meals) from updatedWeekly
            const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
            const todayMeals = updatedWeekly.find(d => d.day.toLowerCase() === today.toLowerCase());

            return {
                weekly: updatedWeekly,
                daily: todayMeals ? todayMeals.meals : []
            };
        });
    };




    return (
        <div className="flex-2 mx-auto">
            <div className="flex px-10">
                <div className="flex-2">
                    {/* Header */}
                    <div className="flex justify-between gap-3 px-4">
                        <div className="min-w-72 flex flex-col gap-3">
                            <p className="text-[32px] font-bold leading-tight">Meal Plan</p>
                            <p className="text-sm text-[#637488]">
                                Detailed view of your daily and weekly meal plans...
                            </p>
                        </div>

                        <button
                            onClick={generate_meal}
                            disabled={isLoading || mealData.length === 0}
                            className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#1979e6] text-white hover:shadow-lg shadow text-sm font-semibold leading-normal tracking-[0.015em] mt-5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed `}
                        >
                            <span className="truncate">
                                {isLoading ? "Generating..." : "Regenerate Meal Plan"}
                            </span>
                        </button>


                    </div>

                    {/* Tabs */}
                    <div className="pb-3">
                        <div className="flex border-b border-[#dce0e5] px-4 gap-8">
                            <button
                                onClick={() => setActiveTab("daily")}
                                className={`flex cursor-pointer flex-col items-center justify-center border-b-[3px] ${activeTab === "daily" ? "border-b-[#111418] text-[#111418]" : "border-b-transparent text-[#637488]"
                                    } pb-[13px] pt-4`}
                            >
                                <p className="text-sm font-bold leading-normal tracking-[0.015em]">Daily</p>
                            </button>
                            <button
                                onClick={() => setActiveTab("weekly")}
                                className={`flex cursor-pointer flex-col items-center justify-center border-b-[3px] ${activeTab === "weekly" ? "border-b-[#111418] text-[#111418]" : "border-b-transparent text-[#637488]"
                                    } pb-[13px] pt-4`}
                            >
                                <p className="text-sm font-bold leading-normal tracking-[0.015em]">Weekly</p>
                            </button>
                        </div>
                    </div>


                    {/* Loader overlay */}
                    {isLoading && (
                        <div className="m-50 col-span-full inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                            <l-grid size="60" speed="1.5" color="black"></l-grid>
                        </div>
                    )}


                    {/* Content */}
                    {!isLoading && (
                        activeTab === "daily" ? (
                            mealData.daily?.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-96 text-center px-6">
                                    <div className="w-20 h-20 rounded-full bg-[#f0f4ff] flex items-center justify-center mb-4">
                                        <svg
                                            className="w-10 h-10 text-[#1979e6]"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 4v16m8-8H4"
                                            />
                                        </svg>
                                    </div>
                                    <h2 className="text-xl font-bold text-[#111418] mb-2">
                                        No Meals for Today
                                    </h2>
                                    <p className="text-[#637488] mb-4">
                                        Click the button to generate your personalized meal plan.
                                    </p>
                                    <button
                                        onClick={generate_meal}
                                        disabled={isLoading}
                                        className={`px-6 py-2 rounded-lg cursor-pointer font-semibold bg-[#1979e6] disabled:opacity-50 disabled:cursor-not-allowed text-white shadow hover:shadow-lg transition`}
                                    >
                                        {isLoading ? "Generating..." : "Generate Meal Plan"}
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <h2 className='text-[22px] font-bold px-4 pb-3 pt-5'>{day}</h2>
                                    {mealData.daily.map((meal, idx) => (
                                        <MealDaySection key={idx} meals={[meal]} />
                                    ))}
                                </div>
                            )
                        ) : (
                            mealData.weekly?.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-96 text-center px-6">
                                    <div className="w-20 h-20 rounded-full bg-[#f0f4ff] flex items-center justify-center mb-4">
                                        <svg
                                            className="w-10 h-10 text-[#1979e6]"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 4v16m8-8H4"
                                            />
                                        </svg>
                                    </div>
                                    <h2 className="text-xl font-bold text-[#111418] mb-2">
                                        No Weekly Plan Yet
                                    </h2>
                                    <p className="text-[#637488] mb-4">
                                        Click the button to generate your personalized meal plan.
                                    </p>
                                    <button
                                        onClick={generate_meal}
                                        disabled={isLoading}
                                        className={`px-6 py-2 rounded-lg cursor-pointer font-semibold bg-[#1979e6] disabled:opacity-50 disabled:cursor-not-allowed text-white shadow hover:shadow-lg transition`}
                                    >
                                        {isLoading ? "Generating..." : "Generate Meal Plan"}
                                    </button>
                                </div>
                            ) : (
                                mealData.weekly.map((data, idx) => (
                                    <MealDaySection key={idx} day={data.day} meals={data.meals} />
                                ))
                            )
                        )
                    )}

                </div>

                <MealChangeAndAlerts mealData={mealData} onUpdateMeal={updateMeal} />

            </div>
        </div>
    );

}

export default MealPlanMain;
