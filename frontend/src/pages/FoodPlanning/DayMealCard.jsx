import { useState } from "react";

function DayMealCard({ title, details, image, recipe }) {
    const [showRecipe, setShowRecipe] = useState(false);

    return (
        <div className="p-4">
            <div className="flex flex-col gap-4 rounded-xl bg-white shadow-lg p-6 transition-all duration-300">
                <div className="flex items-stretch justify-between gap-4">
                    <div className="flex flex-[2_2_0px] flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <p className="text-base font-bold">{title}</p>
                            <p className="text-sm text-[#637488]">{details}</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowRecipe(!showRecipe)}
                                className="bg-[#f0f2f4] text-sm font-medium rounded-xl h-8 px-4 w-fit inline-block"
                            >
                                <span className="truncate">
                                    {showRecipe ? "Hide Recipe" : "View Recipe"}
                                </span>
                            </button>
                            <button className="bg-[#f0f2f4] text-sm font-medium rounded-xl h-8 px-4 inline-block">
                                Edit
                            </button>
                        </div>
                    </div>
                    <div
                        className="aspect-video bg-center bg-no-repeat bg-cover rounded-xl flex-1"
                        style={{ backgroundImage: `url(${image})` }}
                    ></div>
                </div>

                {/* ✅ Animated recipe section */}
                <div
                    className={`transition-all duration-500 overflow-hidden ${showRecipe ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0"
                        }`}
                >
                    {Array.isArray(recipe) && recipe.length > 0 ? (
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-gray-800">Recipe</h3>
                            <ol className="list-decimal list-inside space-y-1 text-gray-700">
                                {recipe.map((step, idx) => (
                                    <li key={idx}>{step}</li>
                                ))}
                            </ol>
                        </div>
                    ) : (
                        <p className="text-gray-500">No recipe available.</p>
                    )}
                </div>
            </div>
        </div>

    );
}

export default DayMealCard;
