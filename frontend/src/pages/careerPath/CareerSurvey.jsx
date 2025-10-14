import React from 'react'
import { useState, useMemo, useEffect } from 'react';
import { BsInfoCircle } from "react-icons/bs";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { IoIosClose } from "react-icons/io";
import { useApi } from "../../utils/api";
import { grid } from 'ldrs';
import Select from 'react-select'
import countryList from 'react-select-country-list'
import { useTheme } from '../../layout/useTheme';
import { useNavigate } from "react-router-dom";

// Register the web component
grid.register();



function CareerSurvey() {
    const { darkMode } = useTheme();
    const surveyQuestions = [
        {
            question: "Do you prefer remote, hybrid, or onsite work?",
            type: "select",
            options: ["Remote", "Hybrid", "Onsite"],
        },
        {
            question: "What is your preferred working country/region (if different from current)?",
            type: "multi-country",
            options: [],
        },
        {
            question: "Which industries are you most interested in exploring for your career? (Multiple selection allowed)",
            type: "multi-select",
            options: [
                "Technology (e.g., software, AI, IT)",
                "Finance & Banking",
                "Healthcare & Life Sciences",
                "Education & Research",
                "Arts, Media & Entertainment",
                "Government & Public Service",
                "Nonprofit & Social Impact",
                "Sustainability & Environment",
                "Manufacturing & Engineering",
                "Hospitality & Tourism",
                "Retail & Consumer Goods",
                "Other",
            ],
            allowMultiple: true,
            allowInput: true,
            placeholder: "Enter another industry of interest",
        },
        {
            question: "Which specific job roles or functions are you aiming for? (Multiple selection allowed)",
            type: "multi-select",
            options: [
                "Technical Specialist / Engineer",
                "Manager / Team Lead",
                "Researcher / Academic",
                "Creative / Designer",
                "Healthcare Professional",
                "Educator / Trainer",
                "Entrepreneur / Startup Founder",
                "Consultant / Advisor",
                "Other",
            ],
            allowMultiple: true,
            allowInput: true,
            placeholder: "Enter another job role",
        },
        {
            question: "What do you ultimately want to become in your career? (Multiple selection allowed)",
            type: "multi-select",
            options: [
                "AI / Machine Learning Engineer",
                "Software Engineer",
                "Data Analyst / Data Scientist",
                "Doctor / Healthcare Professional",
                "Teacher / Educator",
                "Researcher / Academic",
                "Entrepreneur / Startup Founder",
                "Lawyer / Legal Professional",
                "Artist / Creative Professional",
                "Engineer (non-software)",
                "Manager / Leader",
                "Public Servant / Government Official",
                "Other",
            ],
            allowInput: true,
            placeholder: "Enter your dream role or career",
        },
        {
            question: "What industry do you prefer for your career?",
            type: "select",
            options: [
                "Computer Science (Soft Eng, AI Eng, Cybersecurity, etc)",
                "Electrical Engineer",
                "Mechanical Engineer",
                "Civil Engineer",
                "Finance related",
                "Other",
            ],
            allowInput: true,
            placeholder: "Enter your long-term career goal",
        },
        {
            question: "Which field or domain are you most passionate about? (Multiple selection allowed)",
            type: "multi-select",
            options: [
                "Artificial Intelligence / Machine Learning",
                "Software Development / IT",
                "Data Analysis / Data Science",
                "Healthcare / Medicine",
                "Education / Teaching",
                "Finance / Banking",
                "Marketing / Sales",
                "Research & Development",
                "Arts / Media / Entertainment",
                "Sustainability / Environment",
                "Other",
            ],
            allowMultiple: true,
            allowInput: true,
            placeholder: "Enter another field you’re interested in",
        },
        {
            question: "Which type of work activities excite you the most? (Multiple selection allowed)",
            type: "multi-select",
            options: [
                "Problem-solving and analysis",
                "Creating software or products",
                "Research and experimentation",
                "Teaching or mentoring",
                "Managing teams and projects",
                "Creative design and innovation",
                "Working with data",
                "Helping others / social impact",
                "Other",
            ],
            allowMultiple: true,
            allowInput: true,
            placeholder: "Enter another work type you enjoy",
        },
        {
            question: "Are there specific industries you are most interested in working for? (Multiple selection allowed)",
            type: "multi-select",
            options: [
                "Finance & Banking",
                "Healthcare",
                "Technology / IT",
                "Education / Academia",
                "Manufacturing / Engineering",
                "Media / Entertainment",
                "Nonprofit / Social Impact",
                "Government / Public Service",
                "Other",
            ],
            allowMultiple: true,
            allowInput: true,
            placeholder: "Enter another industry you prefer",
        },
        {
            question: "Which type of skills or knowledge do you want to focus on developing? (Multiple selection allowed)",
            type: "multi-select",
            options: [
                "Technical / hard skills",
                "Leadership / management skills",
                "Creative / design skills",
                "Research / analytical skills",
                "Communication / soft skills",
                "Other",
            ],
            allowMultiple: true,
            allowInput: true,
            placeholder: "Enter another skill area you want to grow in",
        }

    ];


    const keywords = ['job_type', 'preferred_working_country', 'preferred_industry', 'preferred_job_roles', 'career_goal', 'preferred_career', 'preferred_field_or_domain', 'preferred_work_activity', 'industry_to_work_for', 'skill_to_develop']

    const { makeRequest } = useApi();
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
            const res = await makeRequest("get-career-survey-answer");
            if (res.status === "success" && res.data) {
                const userData = res.data;

                const prefilled = keywords.map((key, i) => {
                    const question = surveyQuestions[i];
                    const answerValue = userData[key];

                    // Skip if no value
                    if (answerValue == null) return { value: null, custom: "" };

                    // Handle multi-country (array of country codes)
                    if (question.type === "multi-country") {
                        if (Array.isArray(answerValue)) {
                            return { value: answerValue };
                        }
                        return { value: [answerValue] };
                    }

                    // Handle multi-select questions
                    if (question.type === "multi-select") {
                        if (Array.isArray(answerValue)) {
                            const recognized = [];
                            let custom = "";

                            answerValue.forEach((val) => {
                                if (
                                    question.options?.some(
                                        (opt) => String(opt).trim() === String(val).trim()
                                    )
                                ) {
                                    recognized.push(val);
                                } else if (question.allowInput) {
                                    recognized.push("Other");
                                    custom = val; // Store unrecognized value as custom input
                                }
                            });

                            return { value: recognized, custom };
                        }
                    }

                    // Handle single-select questions
                    if (question.type === "select") {
                        if (
                            question.options?.some(
                                (opt) => String(opt).trim() === String(answerValue).trim()
                            )
                        ) {
                            return { value: String(answerValue), custom: "" };
                        }
                        if (question.allowInput) {
                            return { value: "Other", custom: String(answerValue) };
                        }
                    }

                    // Handle free-text answers
                    if (question.type === "text") {
                        return { value: String(answerValue), custom: String(answerValue) };
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
            const data = await makeRequest("career_survey", {
                method: "POST",
                body: JSON.stringify(results),
            });

            console.log("Backend response:", data);
            if (data?.status === "success") {
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Error submitting survey:", error);
        } finally {
            setIsLoading(false);
            // healthAlertGenerator();

        }
    };

    const canProceed = (() => {
        const q = surveyQuestions[current];
        const ans = answers[current] || {}; // fallback to empty object

        // If question has options, require a choice
        if (q.options?.length) {
            if (!ans.value) return false;

            // If "Other" selected, require custom text
            if (q.options.includes("Other") && ans.value === "Other") {
                return Boolean((ans.custom || "").trim());
            }

            // If multi-select, just need at least one value
            if (q.type === "multi-select") {
                return Array.isArray(ans.value) && ans.value.length > 0;
            }

            return true;
        }

        // If input-only question, require non-empty
        if (q.allowInput && (!q.options || q.options.length === 0)) {
            return Boolean((ans.custom || "").trim());
        }

        return true;
    })();



    return (
        <div className="py-16 px-4 sm:px-6 lg:px-8 h-screen">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-dark-text mb-4">
                    Help us tailor your career plan
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

                        const currentAnswer = answers[index] || {};
                        // const countries = Array.isArray(currentAnswer.value) ? currentAnswer.value : [];

                        const isOtherSelected =
                            q.options?.includes("Other") &&
                            (Array.isArray(currentAnswer.value)
                                ? currentAnswer.value.includes("Other")
                                : currentAnswer.value === "Other");

                        const options = useMemo(() => countryList().getData(), []);

                        const handleSelect = (opt) => {
                            setAnswers((prev) => {
                                const next = [...prev];

                                if (q.type === "multi-select") {
                                    const prevVals = Array.isArray(next[index]?.value)
                                        ? next[index].value
                                        : [];
                                    if (prevVals.includes(opt)) {
                                        next[index] = {
                                            ...next[index],
                                            value: prevVals.filter((v) => v !== opt),
                                        };
                                    } else {
                                        next[index] = {
                                            ...next[index],
                                            value: [...prevVals, opt],
                                        };
                                    }
                                } else {
                                    next[index] = { value: opt };
                                }

                                return next;
                            });
                        };

                        return (
                            <div key={index} className={position}>
                                <h2 className="text-xl font-semibold text-center mb-6 p-4 pb-0 dark:text-dark-text">
                                    {q.question}
                                </h2>

                                <div className="space-y-4 ml-5 mr-5">
                                    {/* Country selector using react-select-country-list */}

                                    {q.type === "multi-country" && (
                                        <div className="space-y-3">
                                            {(Array.isArray(currentAnswer.value) ? currentAnswer.value : [""]).map((val, i) => (
                                                <div key={i} className="flex items-center space-x-2">
                                                    <Select
                                                        options={options}
                                                        value={options.find((opt) => opt.value === val) || null}
                                                        onChange={(selected) =>
                                                            setAnswers((prev) => {
                                                                const next = [...prev];
                                                                const updated = Array.isArray(next[index]?.value) ? [...next[index].value] : [selected.value];
                                                                updated[i] = selected.value;
                                                                next[index] = { value: updated };
                                                                return next;
                                                            })
                                                        }
                                                        menuPortalTarget={document.body}
                                                        styles={{
                                                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                            menu: (base) => ({ ...base, zIndex: 9999 }),
                                                            menuList: (base) => ({ ...base, maxHeight: 200 }),
                                                        }}
                                                        className="flex-1"
                                                    />

                                                    {/* Show Remove button only if it's not the first country */}
                                                    {i > 0 && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setAnswers((prev) => {
                                                                    const next = [...prev];
                                                                    const updated = [...(next[index]?.value || [])];
                                                                    updated.splice(i, 1); // remove this country
                                                                    next[index] = { value: updated };
                                                                    return next;
                                                                })
                                                            }
                                                            className="px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                                                        >
                                                            ×
                                                        </button>
                                                    )}
                                                </div>
                                            ))}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setAnswers((prev) => {
                                                        const next = [...prev];
                                                        const updated = Array.isArray(next[index]?.value) ? [...next[index].value] : [""];
                                                        updated.push(""); // add new empty country slot
                                                        next[index] = { value: updated };
                                                        return next;
                                                    })
                                                }
                                                className="w-full py-2 px-4 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600"
                                            >
                                                + Add another country
                                            </button>
                                        </div>
                                    )}




                                    {/* Single-select */}
                                    {q.type === "select" &&
                                        q.options?.map((opt) => (
                                            <button
                                                key={opt}
                                                onClick={() => handleSelect(opt)}
                                                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${currentAnswer.value === opt
                                                    ? "bg-green-600 text-white dark:text-light-text"
                                                    : "bg-green-200 text-green-800 hover:bg-green-300"
                                                    }`}
                                            >
                                                {opt}
                                            </button>
                                        ))}

                                    {/* Multi-select */}
                                    {q.type === "multi-select" &&
                                        q.options?.map((opt) => {
                                            const selected = Array.isArray(currentAnswer.value)
                                                ? currentAnswer.value.includes(opt)
                                                : false;

                                            return (
                                                <button
                                                    key={opt}
                                                    onClick={() => handleSelect(opt)}
                                                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${selected
                                                        ? "bg-green-600 text-white dark:text-light-text"
                                                        : "bg-green-200 text-green-800 hover:bg-green-300"
                                                        }`}
                                                >
                                                    {opt}
                                                </button>
                                            );
                                        })}


                                    {/* Text input */}
                                    {q.type === "text" && (
                                        <input
                                            type="text"
                                            placeholder={q.placeholder || "Type your answer"}
                                            value={currentAnswer.custom || ""}
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
                                            className="w-full px-4 py-3 border border-accent text-light-text dark:text-dark-text rounded-lg focus:border-green-500 focus:outline-none"
                                        />
                                    )}

                                    {/* "Other" option with input */}
                                    {isOtherSelected && (
                                        <input
                                            type="text"
                                            placeholder={q.placeholder || "Please specify"}
                                            value={currentAnswer.custom || ""}
                                            onChange={(e) =>
                                                setAnswers((prev) => {
                                                    const next = [...prev];
                                                    if (q.type === "multi-select") {
                                                        next[index] = {
                                                            value: [
                                                                ...(currentAnswer.value || []),
                                                                "Other",
                                                            ],
                                                            custom: e.target.value,
                                                        };
                                                    } else {
                                                        next[index] = {
                                                            value: "Other",
                                                            custom: e.target.value,
                                                        };
                                                    }
                                                    return next;
                                                })
                                            }
                                            className="w-full px-4 py-3 border border-accent text-dark-text rounded-lg focus:border-green-500 focus:outline-none"
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

export default CareerSurvey;
