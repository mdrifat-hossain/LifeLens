import React from 'react'
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from 'react';
import { useApi } from "../../utils/api";
import { RiVideoAiFill } from "react-icons/ri";
import { FaArrowRightLong } from "react-icons/fa6";
import { BsStars } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";
import ProjectCard from './ProjectCard';
import "react-toastify/dist/ReactToastify.css";

function CareerDashboard() {
    const { makeRequest } = useApi();

    const [levels, setLevels] = useState([]); // ✅ start as empty array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [skillSuggestion, setSkillSuggestion] = useState([]);
    const [text, setText] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [errorDialog, setErrorDialog] = useState(null);
    const [projects, setProjects] = useState([]);

    const colorMap = {
        Yellow: "bg-yellow-50 border-yellow-400 text-yellow-800",
        Blue: "bg-blue-50 border-blue-400 text-blue-800",
        Red: "bg-red-50 border-red-400 text-red-800",
        Green: "bg-green-50 border-green-400 text-green-800",
        Purple: "bg-purple-50 border-purple-400 text-purple-800",
    };

    const inProgress = projects.filter(p => p.status === "in_progress");
    const notStarted = projects.filter(p => p.status === "not_started");
    const completed = projects.filter(p => p.status === "completed");

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

        const getProjectIdea = async () => {
            try {
                const res = await makeRequest("get-project-idea", { method: "GET" });
                console.log("API response:", res);

                if (res && Array.isArray(res.project_ideas)) {
                    // Normalize status to lowercase
                    const normalized = res.project_ideas.map(p => ({ ...p, status: p.status.toLowerCase() }));
                    setProjects(normalized);
                }
            } catch (err) {
                console.error("Error fetching projects:", err);
            }
        };


        fetchData();
        getSkillSuggestion();
        getProjectIdea();
    }, []);

    const handleGenerate = async () => {
        if (!text.trim()) return;

        try {
            setIsLoading(true);

            const res = await makeRequest("project-idea-generator", {
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

                toast.success("A new project idea has been generated", {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: false,
                    progress: undefined,
                });

                console.log(res.data);
            }

        } catch (err) {
            console.error("❌ Error sending request:", err);
            setErrorDialog("Network error. Please try again.");
        } finally {
            setText("");
            setIsLoading(false);
        }
    };

    const handleUpdateStatus = async (projectId, newStatus) => {
        try {
            const res = await makeRequest(`update-project-status/${projectId}`, {
                method: "PUT",
                body: JSON.stringify({ new_status: newStatus }),
            });

            if (res.status === "success") {
                // Update frontend immediately
                setProjects(prev =>
                    prev.map(p => (p.id === projectId ? { ...p, status: newStatus } : p))
                );
            } else {
                console.error("Update failed:", res);
            }
        } catch (err) {
            console.error("Error updating project status:", err);
        }
    };

    const handleDelete = async (projectId) => {
        try {
            const res = await makeRequest(`delete-project/${projectId}`, { method: "DELETE" });

            if (res.status === "success") {
                setProjects(prev => prev.filter(p => p.id !== projectId));
            } else {
                console.error("Delete failed:", res);
            }
        } catch (err) {
            console.error("Error deleting project:", err);
        }
    };


    if (loading) {
        return <div className="text-gray-600">Loading progress...</div>;
    }

    if (error) {
        return <div className="text-red-600">{error}</div>;
    }



    return (
        <div className="container mx-auto p-8 space-y-8">
            <ToastContainer />
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
                            disabled={isLoading}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full p-4 pr-20 border border-primary rounded-lg focus:outline-0 dark:text-dark-text"
                            id="ai-prompt"
                            placeholder="Example: I want to build a fintech application that helps users track expenses and provides AI-powered savings recommendations."
                            rows="3"></textarea>
                    </div>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={isLoading || text.length === 0}
                    className="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-700 flex items-center space-x-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer">
                    <span className="material-icons">auto_awesome</span>
                    <span className="truncate">{isLoading ? "Generating..." : "Generate Project Ideas"}</span>
                </button>

                <div>
                    {/* In Progress Section */}
                    {projects.filter(p => p.status === "in_progress").length != 0 && (
                        <h2 className="text-xl font-bold text-gray-800 dark:text-dark-text mt-10">In Progress</h2>
                    )}
                    {projects
                        .filter(p => p.status === "in_progress")
                        .map((p, idx) => (
                            <ProjectCard
                                key={idx}
                                project={p}
                                onStatusChange={handleUpdateStatus}
                                onDeleteChange={handleDelete}
                                section="in_progress"
                            />
                        ))}

                    {/* Not Started Section */}
                    
                    {projects.filter(p => p.status === "not_started").length != 0 && (
                        <h2 className="text-xl font-bold text-gray-800 dark:text-dark-text mt-10">Not Started</h2>
                    )}
                    {projects
                        .filter(p => p.status === "not_started")
                        .map((p, idx) => (
                            <ProjectCard
                                key={idx}
                                project={p}
                                onStatusChange={handleUpdateStatus}
                                onDeleteChange={handleDelete}
                                section="not_started"
                            />
                        ))}

                    {/* Completed Section */}
                    
                    {projects.filter(p => p.status === "completed").length != 0 && (
                        <h2 className="text-xl font-bold text-gray-800 dark:text-dark-text mt-10">Completed</h2>
                    )}
                    {projects
                        .filter(p => p.status === "completed")
                        .map((p, idx) => (
                            <ProjectCard
                                key={idx}
                                project={p}
                                onStatusChange={handleUpdateStatus}
                                onDeleteChange={handleDelete}
                                section="completed"
                            />
                        ))}
                </div>



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

    )
}

export default CareerDashboard