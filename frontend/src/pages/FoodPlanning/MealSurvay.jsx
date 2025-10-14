import React from 'react'
import { useState, useEffect } from 'react';
import { BsInfoCircle } from "react-icons/bs";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { IoIosClose } from "react-icons/io";
import { useApi } from "../../utils/api";
import { grid } from 'ldrs';
import { useTheme } from '../../layout/useTheme';
import { useNavigate } from "react-router-dom";

// Register the web component
grid.register();



function MealSurvey() {
    const surveyQuestions = [
        {
            question: "What is your age group?",
            options: ["18–24", "25–34", "35–44", "45–54", "55+"],
        },
        {
            question: "What is your gender?",
            options: ["Female", "Male", "Prefer not to say"],
        },
        {
            question: "What is your height (in cm)?",
            options: ["<150", "150–159", "160–169", "170–179", "180–189", "≥190"],
        },
        {
            question: "What is your weight (in kg)?",
            options: ["<50", "50–59", "60–69", "70–79", "80–89", "90–99", "≥100"],
        },
        {
            question: "What is your overall dietary pattern?",
            options: [
                "No restriction (omnivore)",
                "Halal only",
                "Vegetarian (eggs & dairy ok)",
                "Lacto-vegetarian (dairy ok, no eggs)",
                "Vegan",
                "Pescatarian",
                "Other",
            ],
            allowInput: true,
            placeholder: "Please specify your dietary pattern",
        },
        {
            question: "Do you have any food allergies?",
            options: [
                "None",
                "Peanuts",
                "Tree nuts",
                "Milk / Dairy",
                "Eggs",
                "Fish",
                "Other",
            ],
            allowInput: true,
            placeholder: "Please specify other allergies",
        },
        {
            question: "How many meals do you typically have per day?",
            options: ["2", "3", "4", "5"],
        },
        {
            question: "How many snacks do you usually have per day?",
            options: ["No snacks", "1 snack/day", "2 snacks/day", "Flexible"],
        },
        {
            question: "What time do you usually have breakfast?",
            options: ["Skip breakfast", "Before 8:00", "8:00–10:00", "After 10:00"],
        },
        {
            question: "Which cuisines do you prefer?",
            options: [
                "Bangladeshi",
                "Indian",
                "Chinese",
                "Middle Eastern",
                "Western",
                "Mediterranean",
                "Thai",
                "Japanese",
                "Other",
            ],
            allowInput: true,
            placeholder: "Please specify other cuisines",
        },
        {
            question: "How much caffeine do you consume daily?",
            options: ["None", "1 serving/day", "2 servings/day", "3+ servings/day"],
        },
        {
            question: "What is your typical activity level?",
            options: [
                "Sedentary (desk, little exercise)",
                "Lightly active (1–3 days/week)",
                "Moderately active (3–5 days/week)",
                "Very active (6–7 days/week)",
                "Athlete / heavy labor",
            ],
        },
        {
            question: "What is your primary type of exercise?",
            options: [
                "None",
                "Walking / light cardio",
                "Running / cycling / cardio",
                "Strength training",
                "Sports (e.g., football, cricket)",
                "Mixed",
            ],
        },
        {
            question: "How many hours of sleep do you typically get?",
            options: ["<6 hours", "6–7 hours", "7–8 hours", ">8 hours"],
        },
        {
            question: "What is your average daily water intake?",
            options: ["<1 L/day", "1–1.5 L/day", "1.5–2 L/day", ">2 L/day"],
        },
        {
            question: "Do you have any medical conditions that affect your diet?",
            options: [
                "None",
                "Diabetes / Prediabetes",
                "Hypertension",
                "Thyroid issues",
                "Kidney disease",
                "GERD / Acidity",
                "Prefer not to say",
                "Other",
            ],
            allowInput: true,
            placeholder: "Please specify other medical conditions",
        },
        {
            question: "Have you been advised by a doctor to follow any specific diets?",
            options: [
                "None",
                "Low sodium",
                "Low fat",
                "Low carb",
                "High protein",
                "Renal-friendly",
                "Diabetic-friendly",
                "Prefer not to say",
                "Other",
            ],
            allowInput: true,
            placeholder: "Please specify other diets",
        },
        {
            question: "How strict should your meal plan be?",
            options: [
                "Very strict (fixed meals)",
                "Balanced (80/20)",
                "Flexible (guidelines & swaps)",
            ],
        },
    ];
    const keywords = ['age', 'gender', 'height', 'weight', 'dietary_pattern', 'food_allergies', 'meals_per_day',
        'snacks_per_day', 'breakfast_time', 'cuisines', 'caffeine_consumption', 'activity_level',
        'exercises', 'sleep_duration', 'water_intake', 'medical_conditions', 'specific_diets', 'meal_plan'
    ]



    const { makeRequest } = useApi();
    const { darkMode } = useTheme();
    const [current, setCurrent] = useState(0);
    const [isLoading, setIsLoading] = useState(false)
    const [answers, setAnswers] = useState(() =>
        surveyQuestions.map(() => ({ value: null, custom: "" }))
    );
    const navigate = useNavigate();

    const total = surveyQuestions.length;

    const handleNext = () => {
        if (current < total - 1) setCurrent(current + 1);
    };

    const handlePrev = () => {
        if (current > 0) setCurrent(current - 1);
    };

    const selectOption = (option) => {
        setAnswers((prev) => {
            const next = [...prev];
            next[current] = { value: option, custom: "" };
            return next;
        });
    };

    useEffect(() => {
        fetchSurveyAnswers();
    }, []);

    const fetchSurveyAnswers = async () => {
        setIsLoading(true);

        try {
            const res = await makeRequest("get-foodPlanning-survey");
            if (res.status === "success" && res.data?.length > 0) {
                const userData = res.data[0];

                const prefilled = keywords.map((key, i) => {
                    const question = surveyQuestions[i];
                    const answerValue = userData[key];

                    if (
                        question.options?.some(
                            (opt) => String(opt).trim() === String(answerValue).trim()
                        )
                    ) {
                        return { value: String(answerValue), custom: "" };
                    }

                    if (answerValue && question.allowInput) {
                        return { value: "Other", custom: String(answerValue) };
                    }

                    return { value: null, custom: "" };
                });

                setAnswers(prefilled);
                setCurrent(0);
            }
        } catch (err) {
            console.error("❌ Error fetching survey answers:", err.message);
        } finally {
            setIsLoading(false);
        }
    };



    const submitSurvey = async () => {
        setIsLoading(true);

        const results = surveyQuestions.map((q, i) => {
            const ans = answers[i];
            let finalAnswer = null;

            if (q.options?.includes("Other") && ans.value === "Other") {
                finalAnswer = ans.custom || "Other";
            } else if (q.allowInput && (!q.options || q.options.length === 0)) {
                finalAnswer = ans.custom || null;
            } else {
                finalAnswer = ans.value;
            }

            return { question: keywords[i], answer: finalAnswer };
        });

        try {
            const data = await makeRequest("food_planning_survey", {
                method: "POST",
                body: JSON.stringify(results),
            });
            if (data?.status === "success") {
                navigate("/dashboard");
            }

        } catch (error) {
            console.error("Error submitting survey:", error);
        } finally {
            healthAlertGenerator();
            setIsLoading(false);
        }
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



    const canProceed = (() => {
        const q = surveyQuestions[current];
        const ans = answers[current];

        // If question has options, require a choice
        if (q.options?.length) {
            if (ans.value === null) return false;
            // If "Other" selected, require custom text
            if (q.options.includes("Other") && ans.value === "Other") {
                return Boolean(ans.custom.trim());
            }
            return true;
        }

        // If input-only question, require non-empty
        if (q.allowInput && (!q.options || q.options.length === 0)) {
            return Boolean(ans.custom.trim());
        }

        return true;
    })();

    return (
        <div className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-dark-text mb-4">
                    Help us tailor your meal plan
                </h1>
                <p className="text-gray-600 dark:text-dark-text/40 mb-8 max-w-2xl mx-auto">
                    These questions help personalize your plan to your needs and
                    preferences.
                </p>
            </div>

            {/* <div className="max-w-md mx-auto bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start mb-12">
                <BsFillInfoCircleFill className="w-6 h-6 text-blue-600 mr-4" />
                <div className="flex-grow">
                    <p className="font-semibold text-blue-800">Welcome back</p>
                    <p className="text-sm text-blue-700">
                        You may continue where you left off or
                        <a className="underline font-medium ml-1" href="#">restart the questionnaire</a>.
                    </p>
                </div>
                <button className="text-blue-600 hover:text-blue-800">
                    <IoIosClose className="w-6 h-6" />
                </button>
            </div> */}

            <div className="max-w-md mx-auto mt-12 rounded-lg shadow-sm border border-accent">
                {/* Progress */}
                {
                    !isLoading && (
                        <div className="mb-6 p-4 pb-0">
                            <div className="flex justify-between items-center mb-1">
                                <p className="text-sm font-medium text-gray-500">
                                    Question {current + 1} / {total}
                                </p>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-green-600 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${((current + 1) / total) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    )
                }
                {
                    isLoading && (
                        <div className="mb-6 p-4 pb-0">
                            <div className="flex justify-between items-center mb-1">
                                <p className="text-sm font-medium">
                                </p>
                            </div>
                            <div className="w-full rounded-full h-2">
                            </div>
                        </div>
                    )
                }

                <div className="relative overflow-hidden">

                    {/* Survey Questions */}
                    {surveyQuestions.map((q, index) => {
                        let position = "absolute top-0 w-full transition-transform duration-500";
                        if (index === current) position += " translate-x-0 relative";
                        else if (index < current) position += " -translate-x-full";
                        else position += " translate-x-full";

                        const isOtherSelected =
                            q.options?.includes("Other") && answers[index]?.value === "Other";

                        return (
                            <div key={index} className={position}>
                                <h2 className="text-xl font-semibold text-center mb-6 p-4 pb-0 dark:text-dark-text">
                                    {q.question}
                                </h2>

                                <div className="space-y-4 ml-5 mr-5">
                                    {/* Options */}
                                    {q.options?.length > 0 &&
                                        q.options.map((opt) => (
                                            <button
                                                key={opt}
                                                onClick={() => selectOption(opt)}
                                                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${answers[index]?.value === opt
                                                    ? "bg-green-600 text-white dark:text-light-text"
                                                    : "bg-green-200 text-green-800 hover:bg-green-300"
                                                    }`}
                                            >
                                                {opt}
                                            </button>
                                        ))}

                                    {/* Show input ONLY when "Other" selected */}
                                    {isOtherSelected && (
                                        <input
                                            type="text"
                                            placeholder={q.placeholder || "Please specify"}
                                            value={answers[index]?.custom || ""}
                                            onChange={(e) =>
                                                setAnswers((prev) => {
                                                    const next = [...prev];
                                                    next[index] = { value: "Other", custom: e.target.value };
                                                    return next;
                                                })
                                            }
                                            className="w-full px-4 py-3 border border-accent text-dark-text rounded-lg focus:border-green-500 focus:outline-none"
                                        />
                                    )}

                                    {/* Input-only questions */}
                                    {q.allowInput && (!q.options || q.options.length === 0) && (
                                        <input
                                            type="text"
                                            placeholder={q.placeholder || "Type your answer"}
                                            value={answers[index]?.custom || ""}
                                            onChange={(e) =>
                                                setAnswers((prev) => {
                                                    const next = [...prev];
                                                    next[index] = {
                                                        value: e.target.value,
                                                        custom: e.target.value,
                                                    };
                                                    return next;
                                                })
                                            }
                                            className="w-full px-4 py-3 border border-accent dark:text-dark-text rounded-lg focus:border-green-500 focus:outline-none"
                                        />
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {/* Loader overlay */}
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-light-background dark:bg-dark-background bg-opacity-70 z-50">
                            <l-grid size="60" speed="1.5" color={darkMode ? "white" : "black"} ></l-grid>
                        </div>
                    )}

                </div>

                {/* Navigation */}
                <div className="mt-8 flex justify-between p-5 pt-0">
                    <button
                        onClick={handlePrev}
                        disabled={isLoading || current === 0}
                        className="flex items-center cursor-pointer text-gray-600 hover:text-gray-900 font-medium text-sm py-2 px-4 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        ← Previous
                    </button>

                    {current < total - 1 ? (
                        <button
                            onClick={handleNext}
                            disabled={!canProceed}
                            className="flex items-center cursor-pointer text-white bg-green-600 hover:bg-green-700 font-medium text-sm py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next →
                        </button>
                    ) : (
                        <button
                            onClick={submitSurvey}
                            disabled={isLoading}
                            className="flex items-center cursor-pointer text-white bg-blue-600 hover:bg-blue-700 font-medium text-sm py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Finish
                        </button>
                    )}
                </div>

                <div className="relative mt-6 bg-gray-100 dark:bg-accent p-4 rounded-lg flex items-start text-sm">
                    <BsInfoCircle className="w-6 h-6 text-blue-500 mr-2" />
                    <p className="text-gray-600 dark:text-dark-text">
                        This survey will help us tailor your meal plan. Your answers are
                        important for a personalized experience.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default MealSurvey;
