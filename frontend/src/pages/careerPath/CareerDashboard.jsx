import React from 'react'
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from 'react';
import { useApi } from "../../utils/api";
import { RiVideoAiFill } from "react-icons/ri";
import { FaArrowRightLong } from "react-icons/fa6";
import { BsStars } from "react-icons/bs";

function CareerDashboard() {
    const { makeRequest } = useApi();

    const [levels, setLevels] = useState([]); // ✅ start as empty array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [skillSuggestion, setSkillSuggestion] = useState([]);

    const colorMap = {
        Yellow: "bg-yellow-50 border-yellow-400 text-yellow-800",
        Blue: "bg-blue-50 border-blue-400 text-blue-800",
        Red: "bg-red-50 border-red-400 text-red-800",
        Green: "bg-green-50 border-green-400 text-green-800",
        Purple: "bg-purple-50 border-purple-400 text-purple-800",
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await makeRequest("get_learning_path_progress", {
                    method: "GET"
                });
                console.log("Progress response:", res); // ✅ you'll see the actual array or object

                // ✅ if backend returns array
                if (Array.isArray(res)) {
                    setLevels(res);
                }
                // ✅ if backend returns { levels: [...] }
                else if (res && Array.isArray(res.levels)) {
                    setLevels(res.levels);
                }
                else {
                    setLevels([]); // fallback
                }
            } catch (err) {
                console.error("Error fetching progress:", err);
                setError("Failed to load progress");
            } finally {
                setLoading(false);
            }
        };

        const getSkillSuggestion = async () => {
            try {
                const res = await makeRequest("skill-suggestion", { method: "GET" });

                if (res.status === "success") {
                    let suggestionData;

                    // First, get the string inside `res.suggestion`
                    if (typeof res.suggestion === "string") {
                        suggestionData = JSON.parse(res.suggestion);
                    } else if (res.suggestion?.suggestions) {
                        // Already parsed
                        suggestionData = res.suggestion;
                    } else {
                        // Sometimes res.suggestion is {suggestion: 'json string'}
                        suggestionData = JSON.parse(res.suggestion.suggestion);
                    }

                    setSkillSuggestion(suggestionData.suggestions || []);
                    console.log("Fetched suggestions:", suggestionData);

                } else {
                    console.log("No suggestions found");
                }
            } catch (err) {
                console.error("Error fetching routines:", err);
            }
        };

        fetchData();
        getSkillSuggestion();
    }, []);


    if (loading) {
        return <div className="text-gray-600">Loading progress...</div>;
    }

    if (error) {
        return <div className="text-red-600">{error}</div>;
    }



    return (
        <div className="container mx-auto p-8 space-y-8">
            <div className="gradient-bg text-light-text dark:text-dark-text rounded-xl">
                <h1 className="text-4xl font-bold">Your Financial Technology Learning Journey</h1>
                <p className="mt-2 text-lg">Master the skills needed to build sophisticated financial applications and advance
                    your career in fintech.</p>
                <div className="mt-6 flex space-x-4">
                    <div className="bg-gray-400 dark:bg-white/20 px-4 py-2 rounded-lg text-sm">Progress: 65%</div>
                    <div className="bg-gray-400 dark:bg-white/20 px-4 py-2 rounded-lg text-sm">12 Skills Acquired</div>
                    <div className="bg-gray-400 dark:bg-white/20 px-4 py-2 rounded-lg text-sm">8 Projects Completed</div>
                </div>
            </div>

            <button>
                <Link
                    to="/career-path/skills-trend"
                    className="flex items-center font-semibold cursor-pointer bg-primary text-light-text px-4 py-2 rounded-lg shadow hover:bg-primary/90 gap-2"
                >
                    <span>Current Skill's Trend</span>
                    <FaArrowRightLong />
                </Link>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-accent/50 p-6 rounded-xl shadow-lg">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-dark-text">Learning Roadmap</h2>
                        <Link
                            to="learning-path" // 👈 your route here
                            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-indigo-300 
                            text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition dark:bg-green-950 dark:hover:bg-green-900">
                            <BsStars className="text-green-500 text-lg" />
                            <span>
                                View all & <span className="text-green-600 font-semibold">AI</span> help
                            </span>
                            <span className="material-icons text-base text-indigo-600">arrow_forward</span>
                        </Link>
                    </div>

                    <div className="space-y-12">
                        {levels.length > 0
                            ? Object.entries(
                                levels.reduce((acc, item) => {
                                    if (!acc[item.path_title]) acc[item.path_title] = [];
                                    acc[item.path_title].push(item);
                                    return acc;
                                }, {})
                            ).map(([pathTitle, pathLevels], idx) => (
                                <div key={idx} className="space-y-8">
                                    {/* Learning Path Title */}
                                    <div className="mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {pathTitle}
                                        </h2>
                                        {pathLevels[0].path_description && (
                                            <p className="text-gray-600 dark:text-gray-300 mt-1">
                                                {pathLevels[0].path_description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Timeline + Levels */}
                                    <div className="relative pl-10">
                                        {/* Vertical timeline line */}
                                        <div className="absolute left-15 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

                                        {pathLevels.map((item, i) => (
                                            <div key={i} className="flex items-start mb-6">
                                                {/* Circle status */}
                                                <div className="z-10 flex-shrink-0 relative">
                                                    <div
                                                        className={`rounded-full h-10 w-10 flex items-center justify-center ${item.status === "Completed"
                                                            ? "bg-green-500 text-white"
                                                            : item.status === "In Progress"
                                                                ? "bg-blue-600 text-white"
                                                                : "bg-gray-300 text-gray-500"
                                                            }`}
                                                    >
                                                        <span className="material-icons">
                                                            {item.status === "Completed"
                                                                ? "check"
                                                                : item.status === "In Progress"
                                                                    ? "play_arrow"
                                                                    : "lock"}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Text section */}
                                                <div className="ml-6 flex-grow">
                                                    <h3
                                                        className={`font-semibold ${item.status === "Locked"
                                                            ? "text-gray-400"
                                                            : "text-gray-900 dark:text-white"
                                                            }`}
                                                    >
                                                        {item.title}
                                                    </h3>
                                                    <p
                                                        className={`text-sm ${item.status === "Locked"
                                                            ? "text-gray-400"
                                                            : "text-gray-500 dark:text-gray-300"
                                                            }`}
                                                    >
                                                        {item.description}
                                                    </p>

                                                    {/* Tags + Duration */}
                                                    <div className="mt-2 flex items-center space-x-2">
                                                        <span
                                                            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${item.status === "Completed"
                                                                ? "bg-green-100 text-green-700"
                                                                : item.status === "In Progress"
                                                                    ? "bg-blue-100 text-blue-700"
                                                                    : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                                                                }`}
                                                        >
                                                            {item.status}
                                                        </span>
                                                        <span className="text-gray-400 dark:text-gray-300 text-sm">
                                                            {item.duration_weeks} weeks
                                                        </span>
                                                    </div>

                                                    {/* Progress bar */}
                                                    {item.status === "In Progress" && (
                                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-3">
                                                            <div
                                                                className="bg-blue-600 h-2 rounded-full"
                                                                style={{ width: `${item.progress}%` }}
                                                            ></div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                            : (
                                <div className="text-gray-500 dark:text-gray-400">No progress data available</div>
                            )}
                    </div>



                </div>
                <div className="space-y-8">
                    <div className="bg-white dark:bg-dark-background border-1 border-accent p-6 rounded-xl shadow-lg">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-dark-text mb-4">Skills You Can Learn This Week</h2>
                        <div className="space-y-4">
                            {Array.isArray(skillSuggestion) && skillSuggestion.length > 0 ? (
                                skillSuggestion.map((a, idx) => {
                                    const colorClass = colorMap[a.color] || "bg-gray-50 border-gray-300 text-gray-800";

                                    return (
                                        <div
                                            key={idx}
                                            className={`border-l-4 p-4 rounded-r-lg ${colorClass}`}
                                        >
                                            <div className="flex">
                                                <div className="mr-3">
                                                    <span className="text-2xl">{a.react_icon}</span>
                                                </div>
                                                <div>
                                                    <p className="font-bold">{a.title}</p>
                                                    <p className="text-sm mt-1">{a.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-gray-500 text-sm">No suggestions available.</p>
                            )}
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg dark:bg-dark-background border-1 border-accent">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-dark-text mb-4">Recommended Courses</h2>
                        <div className="space-y-4">
                            {Array.isArray(skillSuggestion) && skillSuggestion.length > 0 ? (
                                skillSuggestion.map((a, idx) => (

                                    <div key={idx} className="flex items-center space-x-3 mb-3">
                                        <div className='flex items-center space-x-2'>
                                            <RiVideoAiFill className='text-white' size={26} />
                                            <div>
                                                <h3 className="font-semibold text-sm text-gray-800 dark:text-dark-text">{a.title}</h3>
                                                <div className='flex space-x-5'>
                                                    <a href={`http://youtube.com/results?search_query=${a.title}`} target="_blank">
                                                        <p className="text-xs text-gray-500 cursor-pointer hover:text-primary">YouTube</p>
                                                    </a>
                                                    <a href={`https://www.coursera.org/search?query=${a.title}`} target="_blank">
                                                        <p className="text-xs text-gray-500 cursor-pointer hover:text-primary">Coursera</p>
                                                    </a>
                                                    <a href={`https://www.udemy.com/courses/search/?src=ukw&q=${a.title}`} target="_blank">
                                                        <p className="text-xs text-gray-500 cursor-pointer hover:text-primary">Udemy</p>
                                                    </a>
                                                    <a href={`https://www.edx.org/search?q=${a.title}`} target="_blank">
                                                        <p className="text-xs text-gray-500 cursor-pointer hover:text-primary">edX</p>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm">No suggestions available.</p>
                            )}


                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-dark-background border-1 border-accent p-8 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-dark-text mb-2">AI Project Idea Generator</h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-text/50 mb-2" for="ai-prompt">Tell AI about your goals,
                        interests, or skills you want to develop:</label>
                    <div className="relative">
                        <textarea
                            className="w-full p-4 pr-20 border border-primary rounded-lg focus:outline-0 dark:text-dark-text"
                            id="ai-prompt"
                            placeholder="Example: I want to build a fintech application that helps users track expenses and provides AI-powered savings recommendations. I'm familiar with React but need to learn backend development..."
                            rows="3"></textarea>
                    </div>
                </div>
                <button
                    className="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-700 flex items-center space-x-2">
                    <span className="material-icons">auto_awesome</span>
                    <span>Generate Project Ideas</span>
                </button>


                <h2 className="text-xl font-bold text-gray-800 dark:text-dark-text mt-10">AI-Suggested Projects</h2>
                <div className="bg-white dark:bg-dark-background p-8 rounded-xl shadow-md border border-green-300 mt-5">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-dark-text">Smart Budget Tracker with AI Insights</h3>
                            <p className="text-sm text-gray-500">Perfect for: <span className="font-medium text-indigo-400">Frontend
                                + Backend + AI Integration</span></p>
                        </div>
                        <span
                            className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">Recommended</span>
                    </div>
                    <p className="text-gray-600 dark:text-dark-text/50 mb-6">Build a comprehensive financial tracking application that categorizes
                        expenses automatically and provides AI-powered savings recommendations based on spending patterns.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div>
                            <h4 className="text-sm font-semibold text-gray-500 dark:text-dark-text/50 mb-2">Tech Stack</h4>
                            <div className="flex flex-wrap gap-2">
                                <span
                                    className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">React.js</span>
                                <span
                                    className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Node.js</span>
                                <span
                                    className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">MongoDB</span>
                                <span
                                    className="bg-pink-100 text-pink-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Chart.js</span>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-500 mb-2">Duration</h4>
                            <p className="text-gray-800 dark:text-dark-text/50 font-medium">6-8 weeks</p>
                            <p className="text-xs text-gray-500">~40 hours total</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-500 mb-2">Complexity</h4>
                            <div className="flex items-center">
                                <span className="material-icons text-yellow-500 text-base">star</span>
                                <span className="material-icons text-yellow-500 text-base">star</span>
                                <span className="material-icons text-yellow-500 text-base">star</span>
                                <span className="material-icons text-gray-300 text-base">star_border</span>
                                <span className="material-icons text-gray-300 text-base">star_border</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Intermediate</p>
                        </div>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg mb-6">
                        <h4 className="font-semibold text-gray-800 mb-2">Why This Project?</h4>
                        <p className="text-sm text-gray-600">This project combines essential fintech skills: data visualization,
                            user authentication, API integration, and machine learning basics. It directly addresses real
                            market needs in personal finance management and showcases your ability to build full-stack
                            applications with AI features.</p>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-dark-text/50">
                            <div className="flex items-center space-x-1"><span
                                className="material-icons text-green-500 text-base">check_circle</span> <span>Portfolio
                                    Ready</span></div>
                            <div className="flex items-center space-x-1"><span
                                className="material-icons text-green-500 text-base">check_circle</span> <span>Job Market
                                    Aligned</span></div>
                            <div className="flex items-center space-x-1"><span
                                className="material-icons text-green-500 text-base">check_circle</span> <span>Skill
                                    Building</span></div>
                        </div>
                        <button
                            className="bg-indigo-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-indigo-700">Start
                            Project</button>
                    </div>
                </div>
            </div>

        </div>

    )
}

export default CareerDashboard