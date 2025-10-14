import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useApi } from "../../utils/api";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function RoutineDashboard() {
    const [taskChecked, taskSetChecked] = useState(false);
    const [routines, setRoutines] = useState([]);
    const [completed, setCompleted] = useState({}); // <-- here
    const { makeRequest } = useApi();
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [time, setTime] = useState(new Date());
    const [isOpen, setIsOpen] = useState(false);
    const [freeTimeSuggestions, setFreeTimeSuggestions] = useState([])


    const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = shortDays[new Date().getDay()];

    // useEffect(() => {
    //     const newCompleted = {};
    //     todaysRoutines.forEach(task => {
    //         newCompleted[task.routine_id] = task.completed; // or false if missing
    //     });
    //     setCompleted(newCompleted);
    // }, [todaysRoutines]);

    // Fetch tasks from DB on mount


    // Update clock every minute
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    // Task stats
    // const [tasks, setTasks] = useState([]);

    const completedTasks = (tasks || []).filter(t => t?.completed).length;
    const totalTasks = (tasks || []).length;
    const taskCompletion = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;





    // Time left in the day (till midnight)
    const minutesLeft = (24 * 60) - (time.getHours() * 60 + time.getMinutes());
    const hoursLeft = Math.floor(minutesLeft / 60);
    const minsLeft = minutesLeft % 60;


    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await makeRequest("get_tasks", { method: "GET" });
                setTasks(res.tasks || []);
            } catch (err) {
                console.error("Error fetching tasks:", err);
            }
        };
        fetchTasks();
    }, []);

    // Add new task
    // const handleAddTask = async () => {
    //     if (!newTask.trim()) return;

    //     try {
    //         await makeRequest("add_task", {
    //             method: "POST",
    //             body: JSON.stringify({ task_name: newTask }),
    //         });

    //         // After adding, fetch updated list from backend
    //         const res = await makeRequest("get_tasks", { method: "GET" });
    //         setTasks(res.tasks || []);

    //         setNewTask("");
    //         setShowForm(false);
    //     } catch (err) {
    //         console.error("Error adding task:", err);
    //     }
    // };

    const handleAddTask = async () => {
        // if (!newTask.trim()) return;
        const trimmedTask = newTask.trim();

        // ✅ Validate empty
        if (!trimmedTask) {
            toast.warning("Please enter a task name.", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
            });
            return;
        }

        // ✅ Validate length
        if (trimmedTask.length > 30) {
            toast.warning("Task name cannot exceed 30 characters.", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
            });
            return;
        }

        try {
            await makeRequest("add_task", {
                method: "POST",
                body: JSON.stringify({ task_name: newTask }),
            });

            // After adding, fetch updated list from backend
            const res = await makeRequest("get_tasks", { method: "GET" });
            setTasks(res.tasks || []);

            setNewTask("");
            setShowForm(false);
        } catch (err) {
            console.error("Error adding task:", err);
        }
    };


    // Toggle complete
    const handleToggleComplete = async (taskId) => {
        setTasks(prev =>
            prev.map(task =>
                task.task_id === taskId ? { ...task, completed: !task.completed } : task
            )
        );

        try {
            await makeRequest(`toggle_task/${taskId}`, { method: "PATCH" });
            fetchTodayProgress(); // <-- update progress bar
        } catch (err) {
            console.error("Error toggling task:", err);
        }
    };


    // Remove task
    const handleRemoveTask = async (taskId) => {
        setTasks((prev) => prev.filter((task) => task.task_id !== taskId));
        try {
            await makeRequest(`delete_task/${taskId}`, { method: "DELETE" });
        } catch (err) {
            console.error("Error deleting task:", err);
        }
    };


    const colorClasses = {
        purple: "bg-purple-100 text-purple-700",
        pink: "bg-pink-100 text-pink-700",
        green: "bg-green-100 text-green-700",
        yellow: "bg-yellow-100 text-yellow-700",
        blue: "bg-blue-100 text-blue-700",
        indigo: "bg-indigo-100 text-indigo-700",
    };

    useEffect(() => {
        const fetchRoutines = async () => {
            try {
                const res = await makeRequest("get_routines", { method: "GET" });
                const routines = res.routines || [];

                setRoutines(routines);

                // Initialize completed state from backend
                const completedMap = {};
                routines.forEach(r => {
                    completedMap[r.routine_id] = r.is_completed_today; // <-- use backend value
                });
                setCompleted(completedMap);

            } catch (err) {
                console.error("Error fetching routines:", err);
            }
        };


        const getFreeTimeSuggestion = async () => {
            try {
                const res = await makeRequest("free-time-suggestion", { method: "GET" });

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

                    setFreeTimeSuggestions(suggestionData.suggestions || []);

                } else {
                    console.log("No suggestions found");
                }
            } catch (err) {
                console.error("Error fetching routines:", err);
            }
        };

        fetchRoutines();
        getFreeTimeSuggestion();
    }, []);

    // Current routine
    // Get today's day abbreviation
    const todayAbbr = time.toLocaleDateString("en-US", { weekday: "short" }); // e.g., "Mon", "Tue"

    const currentRoutine = routines.find((r) => {
        // Skip routines not scheduled for today
        if (!r.days.includes(todayAbbr)) return false;

        // Convert times to minutes
        const now = time.getHours() * 60 + time.getMinutes();
        const [startHour, startMin] = r.start_time.split(":").map(Number);
        const [endHour, endMin] = r.end_time.split(":").map(Number);

        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;

        return now >= startMinutes && now <= endMinutes;
    });

    // group routines by day
    const routinesByDay = dayOrder.reduce((acc, day) => {
        const shortDay = day.slice(0, 3); // "Mon", "Tue", "Sun"
        acc[day] = routines.filter(r => r.days.includes(shortDay));
        return acc;
    }, {});

    const todaysRoutines = routines.filter(r => r.days.includes(today));

    const handleCheckboxChange = (id) => {
        setCompleted((prev) => ({
            ...prev,
            [id]: !prev[id], // toggle completion
        }));
    };

    const [progress, setProgress] = useState(0);
    const [completedRoutines, setCompletedRoutines] = useState(0);
    const [totalRoutines, setTotalRoutines] = useState(0);



    const handleRoutineCheckboxChange = async (routineId) => {
        try {
            // Optimistic UI update
            setCompleted(prev => ({ ...prev, [routineId]: !prev[routineId] }));

            // Make POST request with routine_id in body
            const res = await makeRequest("routines/toggle", {
                method: "POST",
                body: JSON.stringify({ routine_id: routineId }),
            });

            // Update local state with actual DB value
            setCompleted(prev => ({ ...prev, [routineId]: res.is_completed_today }));

            // Refresh today's progress
            fetchTodayProgress();
        } catch (err) {
            console.error("Error toggling routine:", err);
        }
    };


    const fetchTodayProgress = async () => {
        try {
            const res = await makeRequest("get_today_progress", { method: "GET" }); // routines
            const taskRes = tasks; // from local state


            // const totalRoutinesAndTasks = res.total_routines + taskRes.length;
            // const completedRoutinesAndTasks =
            //     res.completed_routines + taskRes.filter(t => t.completed).length;

            // const combinedProgress = totalRoutinesAndTasks > 0
            //     ? (completedRoutinesAndTasks / totalRoutinesAndTasks) * 100
            //     : 0;
            const routineProgress = res.total_routines > 0
                ? (res.completed_routines / res.total_routines) * 100
                : 0;

            setProgress(routineProgress);

            // setProgress(combinedProgress);
            setCompletedRoutines(res.completed_routines);
            setTotalRoutines(res.total_routines);
        } catch (err) {
            console.error("Error fetching today progress:", err);
        }
    };


    useEffect(() => {
        fetchTodayProgress();
    }, []);





    return (
        <div className="flex-grow p-6 lg:p-8 bg-light-background dark:bg-dark-background h-[calc(100vh-4rem)]">
            <ToastContainer />
            <div className="max-w-7xl mx-auto">
                <div className="bg-light-background dark:bg-dark-background p-6 rounded-lg shadow-lg mb-6 border-1 border-accent/50">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-dark-text">
                            Weekly Routine
                        </h2>
                        <Link to="/manage-day/edit" className="flex items-center gap-3 px-3 py-2">
                            <button
                                className="bg-primary px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-primary/70 cursor-pointer"
                            >
                                <svg className="w-6 h-6 text-gray-800 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" />
                                </svg>
                                <span>Edit Routine</span>

                            </button>
                        </Link>
                    </div>
                    <div className="mt-4">
                        <div className="border-2 border-accent/50 dark:border-accent/50 rounded-lg text-white">
                            <div
                                className="p-4 flex justify-between items-center cursor-pointer bg-accent  hover:bg-accent/8- transition duration-200 rounded-lg"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                <span className="tracking-wider">View Full Weekly Schedule</span>
                                {isOpen ? (
                                    <IoIosArrowUp className="text-white" />
                                ) : (
                                    <IoIosArrowDown className="text-white" />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Weekly Schedule Grid with smooth transition */}
                    <div
                        className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? "max-h-[1000px] opacity-100 mt-6" : "max-h-0 opacity-0"
                            }`}
                    >
                        <div className="border-2 border-gray-200 dark:border-accent/50 rounded-lg p-4">
                            <div className="grid grid-cols-7 gap-2 text-center text-sm">
                                {dayOrder.map((day) => {
                                    const isToday =
                                        day === new Date().toLocaleDateString("en-US", {
                                            weekday: "long",
                                        });
                                    return (
                                        <div
                                            key={day}
                                            className={`p-2 rounded-lg ${isToday ? "bg-green-100" : ""}`}
                                        >
                                            <p className="font-medium text-gray-400">{day.slice(0, 3)}</p>
                                            {routinesByDay[day]?.map((routine) => (
                                                <div
                                                    key={routine.routine_id}
                                                    className={`${colorClasses[routine.color] ||
                                                        "bg-gray-100 text-gray-700"
                                                        } py-1 mt-1 rounded-md`}
                                                >
                                                    {routine.routine_name} {routine.start_time} -{" "}
                                                    {routine.end_time}
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-5">
                    <div className="bg-light-background dark:bg-dark-background p-6 rounded-lg shadow-lg border-1 border-accent/50 lg:col-span-1 ">
                        <h3 className="font-semibold text-gray-800 dark:text-dark-text">Today's Progress</h3>
                        <div className="mt-4 flex items-start space-x-4">
                            {/* Left vertical bar */}
                            <div className="flex flex-col items-center">
                                {/* Top icon */}
                                <div className="bg-accent text-white h-10 w-10 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 7v5l3 3" />
                                    </svg>
                                </div>

                                {/* Vertical progress bar */}
                                <div className="w-1 h-48 bg-accent/20 mt-4 rounded-2xl relative">
                                    <div
                                        className="bg-primary rounded-2xl absolute bottom-0 w-1"
                                        style={{ height: `${progress}%` }}
                                    ></div>
                                </div>

                                {/* Bottom icon */}
                                <svg className="mt-4 h-10 w-10 text-gray-800 dark:text-dark-text" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M12 20a7.966 7.966 0 0 1-5-2v-1c0-2 1.5-3 3-3h4c1.5 0 3 1 3 3v1a7.966 7.966 0 0 1-5 2zM12 7c-2 0-3.5 1.5-3.5 3.5S10 14 12 14s3.5-1.5 3.5-3.5S14 7 12 7z" clipRule="evenodd" />
                                </svg>
                            </div>

                            {/* Right side info */}
                            <div className="flex-1">
                                {/* Current time */}
                                <p className="text-3xl font-bold text-gray-900 dark:text-dark-text">
                                    {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-dark-text/60">
                                    {time.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                                </p>

                                {/* Task completion */}
                                <div className="mt-6">
                                    <p className="text-center text-3xl font-bold text-accent">
                                        {Math.round(progress)}%
                                    </p>
                                    <p className="text-center text-sm text-gray-500 dark:text-dark-text/60">Day Complete</p>

                                    <div className="flex justify-between items-center text-sm mb-1">
                                        <p className="text-gray-600 dark:text-dark-text/60">Routines Done</p>
                                        <p className="font-medium text-gray-800 dark:text-dark-text/60">
                                            {completedRoutines}/{totalRoutines}
                                        </p>
                                    </div>

                                    {/* Horizontal progress bar */}
                                    <div className="bg-gray-200 rounded-full h-2 w-full">
                                        <div className="bg-primary h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                                    </div>

                                    {/* Current routine */}
                                    <div className="mt-6 text-sm text-center">
                                        {currentRoutine ? (
                                            <p className="text-gray-700 ">
                                                Now: <span className="font-medium">{currentRoutine.routine_name}</span> (
                                                {currentRoutine.start_time}–{currentRoutine.end_time})
                                            </p>
                                        ) : (
                                            <p className="text-gray-500 dark:text-dark-text/60">No routine right now</p>
                                        )}
                                        {/* Time left in the day */}
                                        <p className="mt-2 text-green-600 dark:text-green-text/60">
                                            ⏳ Time left today:{" "}
                                            <span className="font-medium">{hoursLeft}h {minsLeft}m</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-light-background dark:bg-dark-background border-1 border-accent/50 p-6 rounded-lg shadow-lg lg:col-span-1">
                        <h3 className="font-semibold text-gray-800 dark:text-dark-text">Today's Routine</h3>
                        <div className="space-y-4 mt-4">
                            {todaysRoutines.length > 0 ? (
                                todaysRoutines.map((routine) => {
                                    const isCompleted = completed[routine.routine_id] || false;

                                    // ⏰ Parse routine end time (assuming format HH:MM)
                                    const now = new Date();
                                    const [endHour, endMinute] = routine.end_time.split(":").map(Number);
                                    const routineEnd = new Date();
                                    routineEnd.setHours(endHour, endMinute, 0, 0);

                                    const isOverdue = now > routineEnd && !isCompleted;

                                    return (
                                        <div
                                            key={routine.routine_id}
                                            className={`border p-3 rounded-lg flex items-center justify-between 
                                                    ${isCompleted
                                                    ? "bg-green-50 dark:bg-green-800 border-green-200"
                                                    : isOverdue
                                                        ? "bg-red-50 dark:bg-[#b33939] border-red-200"
                                                        : "bg-gray-50 dark:bg-dark-background border-accent/70"
                                                }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="rounded-md p-1">
                                                    <input
                                                        type="checkbox"
                                                        checked={isCompleted}
                                                        onChange={() => handleRoutineCheckboxChange(routine.routine_id)}
                                                        className="h-4 w-4 text-green-600 border-green-300 rounded focus:ring-green-500"
                                                    />

                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800 dark:text-dark-text">
                                                        {routine.routine_name}
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-dark-text/60">
                                                        {routine.start_time} - {routine.end_time}
                                                    </p>
                                                </div>
                                            </div>

                                            {isCompleted ? (
                                                <div className="bg-green-500 text-white h-6 w-6 rounded-full flex items-center justify-center">
                                                    ✔︎
                                                </div>
                                            ) : isOverdue ? (
                                                <div className="bg-red-500 text-white h-6 w-6 rounded-full flex items-center justify-center">
                                                    ✖
                                                </div>
                                            ) : (
                                                <div className="bg-white text-white h-6 w-6 rounded-full flex items-center justify-center">
                                                    ⏳
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-gray-500 dark:text-dark-text/70">No routines for today 🎉</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6 lg:col-span-1">
                        <div className="bg-light-background dark:bg-dark-background border-1 border-accent/50 p-6 rounded-lg shadow-lg">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold text-black dark:text-dark-text">Today's Tasks</h3>
                                <button
                                    id='addIcon'
                                    className="text-indigo-600 hover:text-indigo-800"
                                    onClick={() => setShowForm(!showForm)}
                                >
                                    ➕
                                </button>
                            </div>

                            {showForm && (
                                <div className="flex items-center space-x-2 mt-4">
                                    <input
                                        id='taskName'
                                        value={newTask}
                                        onChange={(e) => setNewTask(e.target.value)}
                                        className="flex-1 p-2 dark:text-dark-text border-1 border-accent/70 rounded focus:outline-none"
                                        placeholder="Enter new task..."
                                    />
                                    <button
                                        id='addTask'
                                        onClick={handleAddTask}
                                        className="bg-primary text-black px-4 py-2 rounded hover:bg-primary/90 cursor-pointer"
                                    >
                                        Add
                                    </button>
                                </div>
                            )}

                            <div className="space-y-4 mt-4">
                                {tasks.length > 0 ? (
                                    tasks.map((task) => (
                                        <div
                                            key={task.task_id}
                                            className="flex items-center justify-between bg-gray-50 dark:bg-accent p-3 rounded"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <input
                                                    type="checkbox"
                                                    checked={task.completed}
                                                    onChange={() => handleToggleComplete(task.task_id)}
                                                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                />
                                                <label
                                                    className={`text-gray-800 dark:text-dark-text ${task.completed ? "line-through text-gray-500" : ""
                                                        }`}
                                                >
                                                    {task.task_name}
                                                </label>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveTask(task.task_id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No tasks for today 🎉</p>
                                )}
                            </div>
                        </div>
                        <div className="bg-light-background dark:bg-dark-background border-1 border-accent/70 p-6 rounded-lg shadow-lg">
                            <h3
                                className="font-semibold text-gray-800 dark:text-dark-text flex items-center space-x-2"
                            >
                                <svg className="w-6 h-6 text-gray-800 dark:text-dark-text" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 9a3 3 0 0 1 3-3m-2 15h4m0-3c0-4.1 4-4.9 4-9A6 6 0 1 0 6 9c0 4 4 5 4 9h4Z" />
                                </svg>

                                <span>Free Time Suggestions</span>
                            </h3>
                            <div className="space-y-4 mt-4">
                                {Array.isArray(freeTimeSuggestions) && freeTimeSuggestions.length > 0 ? (
                                    freeTimeSuggestions.map((a, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-white dark:bg-dark-background p-4 border-1 border-primary rounded-lg"
                                        >
                                            <div className="flex items-start space-x-3">
                                                <span className="text-2xl">{a.react_icon}</span>

                                                <div>
                                                    <p className="font-medium text-gray-800 dark:text-dark-text">{a.title}</p>
                                                    <p className="text-sm text-gray-500 dark:text-dark-text/60">
                                                        {a.description}
                                                    </p>
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
            </div>
        </div >
    )
}

export default RoutineDashboard