import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useApi } from "../../utils/api";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";


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
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.completed).length;
    const taskCompletion = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // Current routine
    const currentRoutine = routines.find((r) => {
        const now = time.getHours() * 60 + time.getMinutes(); // minutes of day
        const [startHour, startMin] = r.start_time.split(":").map(Number);
        const [endHour, endMin] = r.end_time.split(":").map(Number);

        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;

        return now >= startMinutes && now <= endMinutes;
    });

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
    const handleAddTask = async () => {
        if (!newTask.trim()) return;

        try {
            const res = await makeRequest("add_task", {
                method: "POST",
                body: JSON.stringify({ task_name: newTask }),
            });
            // Add to local state
            setTasks((prev) => [...prev, res.task]);
            setNewTask("");
            setShowForm(false);
        } catch (err) {
            console.error("Error adding task:", err);
        }
    };


    // Toggle complete
    const handleToggleComplete = async (taskId) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.task_id === taskId ? { ...task, completed: !task.completed } : task
            )
        );
        try {
            await makeRequest(`toggle_task/${taskId}`, { method: "PATCH" });
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
                setRoutines(res.routines || []);
                console.log(res.routines);
            } catch (err) {
                console.error("Error fetching routines:", err);
            }
        };

        fetchRoutines();
    }, []);

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




    return (
        <div className="flex-grow p-6 lg:p-8 bg-light-background dark:bg-dark-background h-screen">
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
                    {/* <div className="mt-4 ">
                        <div className="border-2 border-gray-200 rounded-lg">
                            <div
                                className="p-4 flex justify-between items-center cursor-pointer bg-gray-100 hover:bg-gray-200 transition duration-200 rounded-lg"
                            >
                                <span className="tracking-wider">View Full Weekly Schedule</span>
                                <IoIosArrowDown className="text-gray-600" />

                            </div>
                        </div>
                    </div>
                    <div className="mt-6 border-2 border-gray-200 rounded-lg p-4">
                        <div className="grid grid-cols-7 gap-2 text-center text-sm">
                            {dayOrder.map((day) => {
                                const isToday = day === new Date().toLocaleDateString("en-US", { weekday: "long" });
                                return (
                                    <div
                                        key={day}
                                        className={`p-2 rounded-lg ${isToday ? "bg-green-100" : ""}`}
                                    >
                                        <p className="font-medium text-gray-600">{day.slice(0, 3)}</p>
                                        {routinesByDay[day]?.map((routine) => (
                                            <div
                                                key={routine.routine_id}
                                                className={`${colorClasses[routine.color] || "bg-gray-100 text-gray-700"} py-1 mt-1 rounded-md`}
                                            >
                                                {routine.routine_name} {routine.start_time} - {routine.end_time}
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    </div> */}




                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* <div className="bg-white p-6 rounded-lg shadow-sm lg:col-span-1">
                        <h3 className="font-semibold text-gray-800">Today's Progress</h3>
                        <div className="mt-4 flex items-start space-x-4">
                            <div className="flex flex-col items-center">
                                <div
                                    className="bg-indigo-600 text-white h-10 w-10 rounded-full flex items-center justify-center"
                                >
                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z" clipRule="evenodd" />
                                    </svg>

                                </div>
                                <svg className="mt-10 h-10 w-10 text-gray-800 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M12 20a7.966 7.966 0 0 1-5.002-1.756l.002.001v-.683c0-1.794 1.492-3.25 3.333-3.25h3.334c1.84 0 3.333 1.456 3.333 3.25v.683A7.966 7.966 0 0 1 12 20ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10c0 5.5-4.44 9.963-9.932 10h-.138C6.438 21.962 2 17.5 2 12Zm10-5c-1.84 0-3.333 1.455-3.333 3.25S10.159 13.5 12 13.5c1.84 0 3.333-1.455 3.333-3.25S13.841 7 12 7Z" clipRule="evenodd" />
                                </svg>
                                <div className="w-1 h-50 bg-indigo-200 mt-2 rounded-2xl">
                                    <div className="h-[65%] bg-indigo-500 rounded-2xl">

                                    </div>


                                </div>
                            </div>
                            <div className="flex-1">
                                <p className="text-3xl font-bold text-gray-900">11:01 PM</p>
                                <p className="text-sm text-gray-500">Wednesday, Jan 15</p>
                                <div className="mt-8">
                                    <p
                                        className="text-center text-3xl font-bold text-indigo-500 mt-2"
                                    >
                                        65%
                                    </p>
                                    <p className="text-center text-sm text-gray-500">
                                        Day Complete
                                    </p>
                                    <div className="flex justify-between items-center text-sm mb-1">
                                        <p className="text-gray-600">Tasks Done</p>
                                        <p className="font-medium text-gray-800">8/12</p>
                                    </div>

                                    <div className="bg-gray-200 rounded-full h-2 w-full">
                                        <div
                                            className="bg-indigo-500 h-2 rounded-full w-[65%]"
                                        ></div>
                                    </div>


                                    <div className="mt-6 flex justify-between items-center text-sm">
                                        <p className="text-gray-600">Time Left</p>
                                        <p className="font-medium text-gray-800">8h 30m</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}
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
                                        className="bg-accent rounded-2xl absolute bottom-0 w-1"
                                        style={{ height: `${taskCompletion}%` }}
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
                                        {Math.round(taskCompletion)}%
                                    </p>
                                    <p className="text-center text-sm text-gray-500 dark:text-dark-text/60">Day Complete</p>

                                    <div className="flex justify-between items-center text-sm mb-1">
                                        <p className="text-gray-600 dark:text-dark-text/60">Tasks Done</p>
                                        <p className="font-medium text-gray-800 dark:text-dark-text/60">
                                            {completedTasks}/{totalTasks}
                                        </p>
                                    </div>

                                    {/* Horizontal progress bar */}
                                    <div className="bg-gray-200 rounded-full h-2 w-full">
                                        <div
                                            className="bg-accent h-2 rounded-full"
                                            style={{ width: `${taskCompletion}%` }}
                                        ></div>
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
                                                        onChange={() => handleCheckboxChange(routine.routine_id)}
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

                    {/* <div className="bg-white p-6 rounded-lg shadow-sm lg:col-span-1">
                        <h3 className="font-semibold text-gray-800">Today's Routine</h3>
                        <div className="space-y-4 mt-4">
                            <div
                                className="bg-green-50 border border-green-200 p-3 rounded-lg flex items-center justify-between"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="bg-green-100 rounded-md p-1">
                                        <input
                                            checked="true"
                                            className="h-4 w-4 text-green-600 border-green-300 rounded focus:ring-green-500"
                                            type="checkbox"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">Morning Workout</p>
                                        <p className="text-sm text-gray-500">6:00 AM - 7:00 AM</p>
                                    </div>
                                </div>
                                <div
                                    className="bg-green-500 text-white h-6 w-6 rounded-full flex items-center justify-center"
                                >
                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 11.917 9.724 16.5 19 7.5" />
                                    </svg>

                                </div>
                            </div>
                            <div
                                className="bg-green-50 border border-green-200 p-3 rounded-lg flex items-center justify-between"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="bg-green-100 rounded-md p-1">
                                        <input
                                            checked="true"
                                            className="h-4 w-4 text-green-600 border-green-300 rounded focus:ring-green-500"
                                            type="checkbox"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">Breakfast</p>
                                        <p className="text-sm text-gray-500">8:00 AM - 8:30 AM</p>
                                    </div>
                                </div>
                                <div
                                    className="bg-green-500 text-white h-6 w-6 rounded-full flex items-center justify-center"
                                >
                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 11.917 9.724 16.5 19 7.5" />
                                    </svg>

                                </div>
                            </div>
                            <div
                                className="bg-indigo-50 border border-indigo-200 p-3 rounded-lg flex items-center justify-between"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="bg-gray-100 rounded-md p-1">
                                        <input
                                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                            type="checkbox"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">Team Meeting</p>
                                        <p className="text-sm text-gray-500">1:00 PM - 2:00 PM</p>
                                    </div>
                                </div>
                                <div
                                    className="bg-indigo-500 text-white h-6 w-6 rounded-full flex items-center justify-center"
                                >
                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>

                                </div>
                            </div>
                            <div
                                className="bg-gray-50 border border-gray-200 p-3 rounded-lg flex items-center justify-between"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="bg-gray-100 rounded-md p-1">
                                        <input
                                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                            type="checkbox"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">Project Work</p>
                                        <p className="text-sm text-gray-500">3:00 PM - 6:00 PM</p>
                                    </div>
                                </div>
                                <div
                                    className="bg-gray-400 text-white h-6 w-6 rounded-full flex items-center justify-center"
                                >
                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>

                                </div>
                            </div>
                            <div
                                className="bg-gray-50 border border-gray-200 p-3 rounded-lg flex items-center justify-between"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="bg-gray-100 rounded-md p-1">
                                        <input
                                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                            type="checkbox"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">Evening Walk</p>
                                        <p className="text-sm text-gray-500">7:00 PM - 8:00 PM</p>
                                    </div>
                                </div>
                                <div
                                    className="bg-gray-400 text-white h-6 w-6 rounded-full flex items-center justify-center"
                                >
                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>

                                </div>
                            </div>
                        </div>
                    </div> */}
                    <div className="space-y-6 lg:col-span-1">
                        {/* <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold text-blue-500">Today's Tasks</h3>
                                <a className="text-indigo-600 hover:text-indigo-800" href="#">
                                    <svg className="w-6 h-6 text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>

                                </a>
                            </div>
                            <div className="space-y-4 mt-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <input
                                            checked={taskChecked}
                                            onChange={() => taskSetChecked(!taskChecked)}
                                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                            type="checkbox"
                                        />
                                        <label className={`text-gray-800 ${taskChecked ? "line-through text-gray-500" : ""}`}
                                        >Review project proposal</label>
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <svg className="w-6 h-6 text-red-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>

                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <input
                                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                            type="checkbox"
                                        />
                                        <label className="text-gray-800"
                                        >Call client about requirements</label>
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <svg className="w-6 h-6 text-red-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>

                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <input
                                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                            type="checkbox"
                                        />
                                        <label className="text-gray-800">Update documentation</label>
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <svg className="w-6 h-6 text-red-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>

                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <input
                                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                            type="checkbox"
                                        />
                                        <label className="text-gray-800">Grocery shopping</label>
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <svg className="w-6 h-6 text-red-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>

                                    </button>
                                </div>
                            </div>
                        </div> */}
                        <div className="bg-light-background dark:bg-dark-background border-1 border-accent/50 p-6 rounded-lg shadow-lg">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold text-black dark:text-dark-text">Today's Tasks</h3>
                                <button
                                    className="text-indigo-600 hover:text-indigo-800"
                                    onClick={() => setShowForm(!showForm)}
                                >
                                    ➕
                                </button>
                            </div>

                            {showForm && (
                                <div className="flex items-center space-x-2 mt-4">
                                    <input
                                        value={newTask}
                                        onChange={(e) => setNewTask(e.target.value)}
                                        className="flex-1 p-2 dark:text-dark-text border-1 border-accent/70 rounded focus:outline-none"
                                        placeholder="Enter new task..."
                                    />
                                    <button
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
                                <div className="bg-white dark:bg-dark-background  border-1 border-primary p-4 rounded-lg">
                                    <div className="flex items-start space-x-3">
                                        <svg className="w-6 h-6 text-gray-800 dark:text-dark-text" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.03v13m0-13c-2.819-.831-4.715-1.076-8.029-1.023A.99.99 0 0 0 3 6v11c0 .563.466 1.014 1.03 1.007 3.122-.043 5.018.212 7.97 1.023m0-13c2.819-.831 4.715-1.076 8.029-1.023A.99.99 0 0 1 21 6v11c0 .563-.466 1.014-1.03 1.007-3.122-.043-5.018.212-7.97 1.023" />
                                        </svg>


                                        <div>
                                            <p className="font-medium text-gray-800 dark:text-dark-text">
                                                Read for 15 minutes
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-dark-text/60">
                                                Boost your knowledge and relax your mind
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-dark-background p-4 border-1 border-primary rounded-lg">
                                    <div className="flex items-start space-x-3">
                                        <svg className="w-6 h-6 text-gray-800 dark:text-dark-text" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 18c0 1.1046-.89543 2-2 2s-2-.8954-2-2 .89543-2 2-2 2 .8954 2 2Zm0 0V6.33333L18 4v11.6667M8 10.3333 18 8m0 8c0 1.1046-.8954 2-2 2s-2-.8954-2-2 .8954-2 2-2 2 .8954 2 2Z" />
                                        </svg>

                                        <div>
                                            <p className="font-medium text-gray-800 dark:text-dark-text">Listen to music</p>
                                            <p className="text-sm text-gray-500 dark:text-dark-text/60">
                                                Energize yourself with your favorite tunes
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default RoutineDashboard