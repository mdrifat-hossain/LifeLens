import React from 'react'
import { useState } from 'react'
import { RiRobot2Fill } from "react-icons/ri";
import { FaSave } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { useApi } from "../../utils/api";
import { useEffect } from 'react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function RoutineEdit() {
    const { makeRequest } = useApi();
    const [showAIHelp, setShowAIHelp] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [routines, setRoutines] = useState([]);

    const [messages, setMessages] = useState([
        { sender: "ai", text: "Hi! I can help you create your weekly routine. Tell me about your ideal schedule and I'll organize it for you." }
    ]);
    const [input, setInput] = useState("");

    const sendMessage = () => {
        if (!input.trim()) return;

        // Add user message
        setMessages(prev => [...prev, { sender: "user", text: input }]);

        // Simulate AI reply
        setTimeout(() => {
            setMessages(prev => [
                ...prev,
                // { sender: "user", text: input },
                { sender: "ai", text: `Got it! You said: "${input}"` }
            ]);
        }, 2000);

        setInput("");
    };

    // Form state for edit routine
    const [formData, setFormData] = useState([{
        routineId: null,
        day: "",
        routineName: "",
        selectedDays: [],   // ✅ must be an array
        startTime: "",
        endTime: "",
        color: "blue",
        description: "",
    }]);

    const dayMap = {
        Monday: "Mon",
        Tuesday: "Tue",
        Wednesday: "Wed",
        Thursday: "Thu",
        Friday: "Fri",
        Saturday: "Sat",
        Sunday: "Sun",
    };

    // Handle input change
    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData((prev) => ({ ...prev, [name]: value }));
    // };

    useEffect(() => {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const today = days[new Date().getDay()];
        const shortDay = dayMap[today];

        setFormData((prev) => ({
            ...prev,
            day: today,
            selectedDays: [shortDay],
        }));
    }, []);

    // useEffect(() => {
    //     const fetchRoutines = async () => {
    //         try {
    //             const res = await makeRequest("get_routines", { method: "GET" });
    //             console.log("Fetched routines:", res.routines);

    //             if (res.routines && res.routines.length > 0) {

    //                 const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    //                 const today = days[new Date().getDay()];
    //                 const shortDay = dayMap[today];
    //                 console.log("Today is:", today, "(", shortDay, ")");

    //                 const todayRoutines = res.routines.filter(r => r.days.includes(shortDay));

    //                 console.log("Today's routine:", todayRoutines);


    //                 if (todayRoutines.length > 0) {
    //                     let newBlocks = [];

    //                     todayRoutines.forEach(r => {
    //                         const start = new Date(`2025-01-01T${r.start_time}`);
    //                         const end = new Date(`2025-01-01T${r.end_time}`);

    //                         const startHour = start.getHours();
    //                         const startMinutes = start.getMinutes();
    //                         const endHour = end.getHours();
    //                         const endMinutes = end.getMinutes();

    //                         for (let hour = startHour; hour <= endHour; hour++) {
    //                             let top = 0;
    //                             let height = 100;

    //                             if (hour === startHour && hour === endHour) {

    //                                 top = (startMinutes / 60) * 100;
    //                                 height = ((endMinutes - startMinutes) / 60) * 100;
    //                             } else if (hour === startHour) {

    //                                 top = (startMinutes / 60) * 100;
    //                                 height = 100 - top;
    //                             } else if (hour === endHour) {

    //                                 top = 0;
    //                                 height = (endMinutes / 60) * 100;
    //                             } else {

    //                                 top = 0;
    //                                 height = 100;
    //                             }

    //                             newBlocks.push({
    //                                 hour,
    //                                 top,
    //                                 height,
    //                                 task: {
    //                                     routineName: r.routine_name,
    //                                     description: r.description,
    //                                     color: r.color || "blue",
    //                                 }
    //                             });
    //                         }
    //                     });


    //                     setRenderedBlocks(newBlocks);
    //                     console.log("Rendered blocks from DB:", newBlocks);
    //                 }
    //             }
    //         } catch (err) {
    //             console.error("Error fetching routines:", err);
    //         }
    //     };

    //     fetchRoutines();
    // }, []);



    const generateBlocks = (selectedDay) => {
        // console.log("Generating blocks for day:", selectedDay);
        console.log("All routines:", routines);
        if (!routines || routines.length === 0) return;

        const shortDay = dayMap[selectedDay];
        const dayRoutines = routines.filter(r => r.days.includes(shortDay));

        let newBlocks = [];
        dayRoutines.forEach(r => {
            const start = new Date(`2025-01-01T${r.start_time}`);
            const end = new Date(`2025-01-01T${r.end_time}`);

            const startHour = start.getHours();
            const startMinutes = start.getMinutes();
            const endHour = end.getHours();
            const endMinutes = end.getMinutes();

            for (let hour = startHour; hour <= endHour; hour++) {
                let top = 0;
                let height = 100;

                if (hour === startHour && hour === endHour) {
                    top = (startMinutes / 60) * 100;
                    height = ((endMinutes - startMinutes) / 60) * 100;
                } else if (hour === startHour) {
                    top = (startMinutes / 60) * 100;
                    height = 100 - top;
                } else if (hour === endHour) {
                    top = 0;
                    height = (endMinutes / 60) * 100;
                } else {
                    top = 0;
                    height = 100;
                }

                newBlocks.push({
                    hour,
                    top,
                    height,
                    task: {
                        routineId: r.routine_id,
                        routineName: r.routine_name,
                        description: r.description,
                        color: r.color || "blue",
                    }
                });
            }
        });

        setRenderedBlocks(newBlocks);
        // setRenderedBlocks((prev) => [...prev, ...newBlocks]);
        // console.log("Rendered blocks for", selectedDay, ":", newBlocks);
    };

    // Fetch routines once
    useEffect(() => {
        const fetchRoutines = async () => {
            try {
                const res = await makeRequest("get_routines", { method: "GET" });
                setRoutines(res.routines || []);
                // console.log("Fetched routines:", res.routines);

                // set today's routine initially
                const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                const today = days[new Date().getDay()];
                // console.log("Today is:", today);

                setFormData((prev) => ({
                    ...prev,
                    day: today,
                    selectedDays: [dayMap[today]]
                }));
            } catch (err) {
                console.error("Error fetching routines:", err);
            }
        };

        fetchRoutines();
    }, []);


    useEffect(() => {
        if (routines && routines.length > 0 && formData.day) {
            generateBlocks(formData.day); // ✅ pass the selected day
        }
    }, [routines, formData.day]);

    // 🔑 Run generateBlocks whenever formData.day changes
    // useEffect(() => {
    //     if (formData.day) {
    //         generateBlocks(formData.day);
    //     }
    // }, [formData.day]);


    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "day") {
            const shortDay = dayMap[value];

            // ✅ Reset form but keep the newly selected day
            setFormData({
                day: value,
                routineName: "",
                selectedDays: [shortDay],
                startTime: "",
                endTime: "",
                color: "blue",
                description: "",
            });
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };




    // Handle checkbox toggle
    const handleCheckbox = (day) => {
        setFormData((prev) => {
            const updated = prev.selectedDays.includes(day)
                ? prev.selectedDays.filter((d) => d !== day)
                : [...prev.selectedDays, day];
            return { ...prev, selectedDays: updated };
        });
    };

    // Handle color selection
    const handleColorSelect = (color) => {
        setFormData((prev) => ({ ...prev, color }));
    };

    // Submit
    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log("Routine Data:", formData);
    };

    // Reset
    const handleReset = () => {
        setFormData({
            day: "",
            routineName: "",
            selectedDays: [],
            startTime: "",
            endTime: "",
            color: "blue",
            description: "",
        });
    };

    const splitTaskByHour = (task) => {
        const { start, end } = task;

        let results = [];
        let current = new Date(start);

        while (current < end) {
            const hourStart = new Date(current);
            const nextHour = new Date(hourStart);
            nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);

            const blockStart = current;
            const blockEnd = end < nextHour ? end : nextHour;

            const totalMinutes = 60;
            const startMinutes = blockStart.getMinutes();
            const endMinutes = blockEnd.getMinutes() + (blockEnd.getSeconds() > 0 ? 1 : 0);
            console.log("Start Minutes:", startMinutes, "End Minutes:", endMinutes);

            const top = (startMinutes / totalMinutes) * 100;   // offset from top %
            const height = ((endMinutes - startMinutes) / totalMinutes) * 100; // height %


            // console.log("Adding style:", top," ", height);

            results.push({
                hour: hourStart.getHours(),
                top,
                height,
                task,
            });

            current = nextHour;
        }

        return results;
    };

    const [renderedBlocks, setRenderedBlocks] = useState([]);

    // const handleAddRoutine = () => {
    //     const { name, description, startTime, endTime, color } = formData;

    //     const start = new Date(`2025-01-01T${startTime}`);
    //     const end = new Date(`2025-01-01T${endTime}`);

    //     const startHour = start.getHours();
    //     const startMinutes = start.getMinutes();
    //     const endHour = end.getHours();
    //     const endMinutes = end.getMinutes();

    //     let newBlocks = [];

    //     for (let hour = startHour; hour <= endHour; hour++) {
    //         let top = 0;
    //         let height = 100;

    //         if (hour === startHour && hour === endHour) {
    //             // Task within same hour
    //             top = (startMinutes / 60) * 100;
    //             height = ((endMinutes - startMinutes) / 60) * 100;
    //         } else if (hour === startHour) {
    //             // First hour
    //             top = (startMinutes / 60) * 100;
    //             height = 100 - top;
    //         } else if (hour === endHour) {
    //             // Last hour
    //             top = 0;
    //             height = (endMinutes / 60) * 100;
    //         } else {
    //             // Middle hours
    //             top = 0;
    //             height = 100;
    //         }

    //         newBlocks.push({
    //             hour,
    //             top,
    //             height,
    //             task: { name, description, color }
    //         });
    //     }

    //     setRenderedBlocks((prev) => [...prev, ...newBlocks]);
    // };


    const errorAddingCart = () => {
        toast.error("Routine is overlap. If you want then delete existing routine", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
        });
    }

    const showRoutineOverlap = (item) => {
        // prevent duplicates
        if (!shoppingList.find((i) => i.name === item.name)) {
            setShoppingList((prev) => [...prev, item]);
        }
        else {
            errorAddingCart();

        }
    };

    const parseTimeToMinutes = (t) => {
        if (t == null) return null;

        // if number (could be seconds from DB or minutes)
        if (typeof t === "number") {
            // if large number, assume seconds -> convert to minutes
            if (t > 1000) return Math.floor(t / 60);
            return t; // assume already minutes
        }

        // if string "HH:MM" or "H:MM"
        if (typeof t === "string") {
            const m = t.match(/^(\d{1,2}):(\d{2})$/);
            if (m) {
                const hh = parseInt(m[1], 10);
                const mm = parseInt(m[2], 10);
                return hh * 60 + mm;
            }
            // if DB returned "01:30:00", handle that
            const m2 = t.match(/^(\d{1,2}):(\d{2}):(\d{2})$/);
            if (m2) {
                const hh = parseInt(m2[1], 10);
                const mm = parseInt(m2[2], 10);
                return hh * 60 + mm;
            }
        }

        return null; // unknown format
    };

    // helper: check overlap between two intervals (in minutes). Supports overnight intervals.
    const intervalsOverlap = (s1, e1, s2, e2) => {
        // if any is null -> no decision (treat as no overlap)
        if (s1 == null || e1 == null || s2 == null || e2 == null) return false;

        // if interval goes overnight (end <= start), treat end as next day
        if (e1 <= s1) e1 += 24 * 60;
        if (e2 <= s2) e2 += 24 * 60;

        return s1 < e2 && s2 < e1;
    };



    const handleAddRoutine = async () => {
        // console.log("Routine handle ", routines);
        const { routineName, description, startTime, endTime, color, selectedDays } = formData;
        // console.log("Adding Routine:", formData);

        if (!routineName || !startTime || !endTime || !selectedDays?.length) {
            // toast.error("Please fill name, start/end time and select day(s).");
            // console.log("Missing required fields, not adding routine.");
            toast.warning("Please fill name, start/end time and select day(s).", {
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

        // parse new routine times (form input are "HH:MM")
        const newStartMin = parseTimeToMinutes(startTime);
        const newEndMin = parseTimeToMinutes(endTime);

        if (newStartMin == null || newEndMin == null) {
            toast.error("Invalid time format. Use HH:MM.", {
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

        // check conflicts with existing routines
        // ensure routines is defined and each routine.days is normalized to array
        for (const r of routines || []) {
            const existingDays = Array.isArray(r.days) ? r.days : (typeof r.days === "string" ? r.days.split(",") : []);
            // if no shared day -> skip
            const sharesDay = existingDays.some((d) => selectedDays.includes(d));
            if (!sharesDay) continue;

            // parse existing times (your DB uses start_time/end_time keys)
            const existingStartMin = parseTimeToMinutes(r.start_time ?? r.startTime ?? r.start);
            const existingEndMin = parseTimeToMinutes(r.end_time ?? r.endTime ?? r.end);

            if (intervalsOverlap(newStartMin, newEndMin, existingStartMin, existingEndMin)) {
                // conflict found -> show toast with routine name + times, then exit
                const existingStartLabel = r.start_time ?? r.startTime ?? (existingStartMin != null ? `${Math.floor(existingStartMin / 60).toString().padStart(2, "0")}:${(existingStartMin % 60).toString().padStart(2, "0")}` : "??:??");
                const existingEndLabel = r.end_time ?? r.endTime ?? (existingEndMin != null ? `${Math.floor(existingEndMin / 60).toString().padStart(2, "0")}:${(existingEndMin % 60).toString().padStart(2, "0")}` : "??:??");

                toast.error(`Conflict with "${r.routine_name}" (${existingStartLabel} - ${existingEndLabel})`, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: false,
                    progress: undefined,
                });
                // console.log("Conflict detected, not adding routine.");
                // toast.error("Routine is overlap. If you want then delete existing routine", {
                //     position: "bottom-right",
                //     autoClose: 5000,
                //     hideProgressBar: false,
                //     closeOnClick: true,
                //     pauseOnHover: true,
                //     draggable: false,
                //     progress: undefined,
                // });
                return; // stop saving
            }
        }

        const start = new Date(`2025-01-01T${startTime}`);
        const end = new Date(`2025-01-01T${endTime}`);

        const startHour = start.getHours();
        const startMinutes = start.getMinutes();
        const endHour = end.getHours();
        const endMinutes = end.getMinutes();

        let newBlocks = [];

        for (let hour = startHour; hour <= endHour; hour++) {
            let top = 0;
            let height = 100;

            if (hour === startHour && hour === endHour) {
                // Task within same hour
                top = (startMinutes / 60) * 100;
                height = ((endMinutes - startMinutes) / 60) * 100;
            } else if (hour === startHour) {
                // First hour
                top = (startMinutes / 60) * 100;
                height = 100 - top;
            } else if (hour === endHour) {
                // Last hour
                top = 0;
                height = (endMinutes / 60) * 100;
            } else {
                // Middle hours
                top = 0;
                height = 100;
            }

            newBlocks.push({
                hour,
                top,
                height,
                task: { routineName, description, color }
            });
        }

        const payload = {
            routine_name: formData.routineName,   // convert camelCase → snake_case
            selectedDays: formData.selectedDays,
            startTime: formData.startTime,
            endTime: formData.endTime,
            color: formData.color,
            description: formData.description || null, // optional
        };

        try {
            const res = await makeRequest("add_routine", {
                method: "POST",
                body: JSON.stringify(payload),
            });

            console.log("Routine saved to backend:", res);

            // Update UI with new blocks
            setRenderedBlocks((prev) => [...prev, ...newBlocks]);
            console.log("Rendered Blocks:", [...renderedBlocks, ...newBlocks]);
        } catch (error) {
            console.error("Error saving routine:", error);
        }
    };

    const handleBlockClick = (task, idx) => {
        console.log("Clicked task:", task);

        // Find the full routine using routineId
        const routine = routines.find(r => r.routine_id === task.routineId);

        if (!routine) return; // safeguard if not found

        setFormData({
            routineId: routine.routine_id,
            routineName: routine.routine_name,
            description: routine.description,
            startTime: routine.start_time,
            endTime: routine.end_time,
            selectedDays: routine.days,   // should already be an array
            color: routine.color || "blue",
        });

        setIsEditing(true);
    };







    const colors = {
        blue: "bg-blue-500 ring-blue-500",
        green: "bg-green-500 ring-green-500",
        yellow: "bg-yellow-500 ring-yellow-500",
        red: "bg-red-500 ring-red-500",
        purple: "bg-purple-500 ring-purple-500",
        pink: "bg-pink-500 ring-pink-500",
    };





    return (
        <div className="flex-grow container mx-auto px-6 py-8">
            <ToastContainer />
            <div className="flex grid-cols-1 lg:grid-cols-3 gap-8">
                <form
                    onSubmit={handleSubmit}
                    className="flex-2 lg:col-span-2 bg-white rounded-lg shadow p-6"
                >
                    <div className="flex-2 lg:col-span-2 bg-white rounded-lg shadow p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold text-gray-700">
                                Weekly Routine
                            </h2>
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <select
                                        name="day"
                                        value={formData.day}
                                        onChange={handleChange}
                                        className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(d => (
                                            <option key={d}>{d}</option>
                                        ))}
                                    </select>
                                    <svg class="absolute top-2 right-1 w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7" />
                                    </svg>

                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label
                                    className="block text-sm font-medium text-gray-700"
                                    for="routine-name"
                                >Routine Name</label>
                                <input
                                    name="routineName"
                                    value={formData.routineName}
                                    onChange={handleChange}
                                    className="mt-1 block w-full h-10 p-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:outline-none sm:text-sm "
                                    id="routine-name"
                                    placeholder="e.g. Morning Workout"
                                    type="text"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700"
                                >Same days of the Week</label>
                                <div className="mt-2 grid grid-cols-4 gap-2">
                                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                                        <label key={day} className="flex items-center space-x-2 text-sm">
                                            <input
                                                type="checkbox"
                                                // checked={formData.selectedDays.includes(day)}
                                                checked={formData.selectedDays?.includes(day) || false}
                                                onChange={() => handleCheckbox(day)}
                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
                                            />
                                            <span>{day}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label
                                        className="block text-sm font-medium text-gray-700"
                                        for="start-time"
                                    >Start Time</label>
                                    <input
                                        name="startTime"
                                        value={formData.startTime}
                                        onChange={handleChange}
                                        type="time"
                                        className="mt-1 block w-full h-10 p-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:outline-none sm:text-sm"
                                        id="start-time"
                                    />
                                </div>
                                <div>
                                    <label
                                        className="block text-sm font-medium text-gray-700"
                                        for="end-time"
                                    >End Time</label>
                                    <input
                                        name="endTime"
                                        value={formData.endTime}
                                        onChange={handleChange}
                                        type="time"
                                        className="mt-1 block w-full h-10 p-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:outline-none sm:text-sm"
                                        id="end-time"
                                    />
                                </div>
                            </div>
                            <div>
                                <label
                                    className="block text-sm font-medium text-gray-700"
                                    for="color"
                                >Color</label>
                                <div className="mt-2 flex items-center space-x-2">
                                    {Object.keys(colors).map((clr) => (
                                        <div
                                            key={clr}
                                            onClick={() => handleColorSelect(clr)}
                                            className={`w-8 h-8 rounded-full cursor-pointer ${colors[clr].split(" ")[0]} ${formData.color === clr ? "ring-2 ring-offset-2 " + colors[clr].split(" ")[1] : ""
                                                }`}
                                        ></div>
                                    ))}
                                </div>

                            </div>
                            <div>
                                <label
                                    className="block text-sm font-medium text-gray-700"
                                    for="description"
                                >Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="mt-1 block w-full h-20 p-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:outline-none sm:text-sm"
                                    id="description"
                                    placeholder="Add a short description..."
                                    rows="3"
                                ></textarea>
                            </div>
                            {/* <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddRoutine}
                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    type="submit"
                                >
                                    Add Routine
                                </button>
                            </div> */}
                            <div className="flex justify-end space-x-3 pt-4">
                                {isEditing ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={handleReset}
                                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            // onClick={handleUpdateRoutine}
                                            className="py-2 px-4 rounded-md text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600"
                                        >
                                            Update
                                        </button>
                                        <button
                                            type="button"
                                            // onClick={handleDeleteRoutine}
                                            className="py-2 px-4 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            onClick={handleReset}
                                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleAddRoutine}
                                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                            type="submit"
                                        >
                                            Add Routine
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
                <div className="lg:col-span-2 bg-white rounded-lg shadow p-6 flex-2">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold text-gray-700">
                            Weekly Routine
                        </h2>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <button
                                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <FaSave className="mr-2 text-lg" />
                                    Save Routine
                                </button>

                                <button
                                    className="flex items-center bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                    onClick={() => setShowAIHelp(!showAIHelp)}
                                >
                                    <RiRobot2Fill className="mr-2 text-lg" />
                                    AI Help
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* <div className="grid grid-cols-1 h-[calc(100vh-250px)] overflow-y-auto scroll-smooth">

                        <div className="grid grid-cols-12">
                            <div className="col-span-1 border-r border-gray-200">
                                <div className="text-xs text-gray-500 font-medium py-2 text-center">
                                    Time
                                </div>
                            </div>
                            <div className="col-span-11 pl-4">
                                <div className="text-xs text-gray-500 font-medium py-2">Tasks</div>
                            </div>
                        </div>

                        {Array.from({ length: 24 }, (_, i) => (
                            <div key={i} className="grid grid-cols-12 border-t border-gray-200">

                                <div className="col-span-1 border-r border-gray-200 py-4 pr-2 text-right text-sm text-gray-500">
                                    {String(i).padStart(2, "0")}:00
                                </div>

                                <div className="col-span-11 pl-4"></div>
                            </div>
                        ))}
                    </div> */}
                    <div className="grid grid-cols-1 h-[calc(100vh-250px)] overflow-y-auto scroll-smooth">
                        {/* Header */}
                        <div className="grid grid-cols-12">
                            <div className="col-span-1 border-r text-center text-xs py-2 text-gray-500">Time</div>
                            <div className="col-span-11 pl-4 text-xs py-2 text-gray-500">Tasks</div>
                        </div>

                        {Array.from({ length: 24 }).map((_, i) => (
                            <div key={i} className="grid grid-cols-12 border-t border-gray-200 relative">
                                <div className="col-span-1 border-r py-4 pr-2 text-right text-sm text-gray-500">
                                    {String(i).padStart(2, "0")}:00
                                </div>
                                <div className="col-span-11 pl-4 relative h-16">
                                    {renderedBlocks
                                        .filter((b) => b.hour === i)
                                        .map((block, idx) => (
                                            <div
                                                key={idx}
                                                className="absolute left-2 right-2 rounded-md text-xs text-white p-1"
                                                style={{
                                                    top: `${block.top}%`,
                                                    height: `${block.height}%`,
                                                    backgroundColor: block.task.color,
                                                    opacity: 0.5,
                                                }}
                                                onClick={() => handleBlockClick(block.task, idx)}
                                            >
                                                <div className="font-bold text-center">{block.task.routineName}</div>
                                                <div className="text-[10px] text-center">{block.task.description}</div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>


                    {/* <div
                        className="grid grid-cols-1 h-[calc(100vh-250px)] overflow-y-auto scroll-smooth">

                        <div className="grid grid-cols-12">
                            <div className="col-span-1 border-r border-gray-200">
                                <div
                                    className="text-xs text-gray-500 font-medium py-2 text-center"
                                >
                                    Time
                                </div>
                            </div>
                            <div className="col-span-11 pl-4">
                                <div className="text-xs text-gray-500 font-medium py-2">
                                    Tasks
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-12 border-t border-gray-200">
                            <div
                                className="col-span-1 border-r border-gray-200 py-4 pr-2 text-right text-sm text-gray-500"
                            >
                                00:00
                            </div>
                            <div className="col-span-11 pl-4"></div>
                        </div>
                        <div className="grid grid-cols-12 border-t border-gray-200">
                            <div
                                className="col-span-1 border-r border-gray-200 py-4 pr-2 text-right text-sm text-gray-500"
                            >
                                01:00
                            </div>
                            <div className="col-span-11 pl-4"></div>
                        </div>
                        <div className="grid grid-cols-12 border-t border-gray-200">
                            <div
                                className="col-span-1 border-r border-gray-200 py-4 pr-2 text-right text-sm text-gray-500"
                            >
                                02:00
                            </div>
                            <div className="col-span-11 pl-4"></div>
                        </div>
                        <div className="grid grid-cols-12 border-t border-gray-200">
                            <div
                                className="col-span-1 border-r border-gray-200 py-4 pr-2 text-right text-sm text-gray-500"
                            >
                                03:00
                            </div>
                            <div className="col-span-11 pl-4"></div>
                        </div>
                        <div className="grid grid-cols-12 border-t border-gray-200">
                            <div
                                className="col-span-1 border-r border-gray-200 py-4 pr-2 text-right text-sm text-gray-500"
                            >
                                04:00
                            </div>
                            <div className="col-span-11 pl-4"></div>
                        </div>
                        <div className="grid grid-cols-12 border-t border-gray-200">
                            <div
                                className="col-span-1 border-r border-gray-200 py-4 pr-2 text-right text-sm text-gray-500"
                            >
                                05:00
                            </div>
                            <div className="col-span-11 pl-4"></div>
                        </div>
                        <div className="grid grid-cols-12 border-t border-gray-200">
                            <div
                                className="col-span-1 border-r border-gray-200 py-4 pr-2 text-right text-sm text-gray-500"
                            >
                                06:00
                            </div>
                            <div className="col-span-11 pl-4"></div>
                        </div>
                        <div className="grid grid-cols-12 border-t border-gray-200">
                            <div
                                className="col-span-1 border-r border-gray-200 py-4 pr-2 text-right text-sm text-gray-500"
                            >
                                07:00
                            </div>
                            <div className="col-span-11 pl-4"></div>
                        </div>
                        <div className="grid grid-cols-12 border-t border-gray-200">
                            <div
                                className="col-span-1 border-r border-gray-200 py-4 pr-2 text-right text-sm text-gray-500"
                            >
                                08:00
                            </div>
                            <div className="col-span-11 pl-4"></div>
                        </div>
                        <div className="grid grid-cols-12 border-t border-gray-200">
                            <div
                                className="col-span-1 border-r border-gray-200 py-4 pr-2 text-right text-sm text-gray-500"
                            >
                                09:00
                            </div>
                            <div className="col-span-11 pl-4"></div>
                        </div>
                        <div className="grid grid-cols-12 border-t border-gray-200">
                            <div
                                className="col-span-1 border-r border-gray-200 py-4 pr-2 text-right text-sm text-gray-500"
                            >
                                10:00
                            </div>
                            <div className="col-span-11 pl-4"></div>
                        </div>
                        <div className="grid grid-cols-12 border-t border-gray-200">
                            <div
                                className="col-span-1 border-r border-gray-200 py-4 pr-2 text-right text-sm text-gray-500"
                            >
                                11:00
                            </div>
                            <div className="col-span-11 pl-4"></div>
                        </div>
                        <div className="grid grid-cols-12 border-t border-gray-200">
                            <div
                                className="col-span-1 border-r border-gray-200 py-4 pr-2 text-right text-sm text-gray-500"
                            >
                                12:00
                            </div>
                            <div className="col-span-11 pl-4"></div>
                        </div>
                        <div className="grid grid-cols-12 border-t border-gray-200">
                            <div
                                className="col-span-1 border-r border-gray-200 py-4 pr-2 text-right text-sm text-gray-500"
                            >
                                13:00
                            </div>
                            <div className="col-span-11 pl-4"></div>
                        </div>
                        <div className="grid grid-cols-12 border-t border-gray-200">
                            <div
                                className="col-span-1 border-r border-gray-200 py-4 pr-2 text-right text-sm text-gray-500"
                            >
                                14:00
                            </div>
                            <div className="col-span-11 pl-4"></div>
                        </div>
                        <div className="grid grid-cols-12 border-t border-gray-200">
                            <div
                                className="col-span-1 border-r border-gray-200 py-4 pr-2 text-right text-sm text-gray-500"
                            >
                                15:00
                            </div>
                            <div className="col-span-11 pl-4"></div>
                        </div>
                        <div className="grid grid-cols-12 border-t border-gray-200">
                            <div
                                className="col-span-1 border-r border-gray-200 py-4 pr-2 text-right text-sm text-gray-500"
                            >
                                16:00
                            </div>
                            <div className="col-span-11 pl-4"></div>
                        </div>
                        <div className="grid grid-cols-12 border-t border-gray-200">
                            <div
                                className="col-span-1 border-r border-gray-200 py-4 pr-2 text-right text-sm text-gray-500"
                            >
                                17:00
                            </div>
                            <div className="col-span-11 pl-4"></div>
                        </div>
                        <div className="grid grid-cols-12 border-t border-gray-200">
                            <div
                                className="col-span-1 border-r border-gray-200 py-4 pr-2 text-right text-sm text-gray-500"
                            >
                                18:00
                            </div>
                            <div className="col-span-11 pl-4"></div>
                        </div>
                        <div className="grid grid-cols-12 border-t border-gray-200">
                            <div
                                className="col-span-1 border-r border-gray-200 py-4 pr-2 text-right text-sm text-gray-500"
                            >
                                19:00
                            </div>
                            <div className="col-span-11 pl-4"></div>
                        </div>
                        <div className="grid grid-cols-12 border-t border-gray-200">
                            <div
                                className="col-span-1 border-r border-gray-200 py-4 pr-2 text-right text-sm text-gray-500"
                            >
                                20:00
                            </div>
                            <div className="col-span-11 pl-4"></div>
                        </div>
                        <div className="grid grid-cols-12 border-t border-gray-200">
                            <div
                                className="col-span-1 border-r border-gray-200 py-4 pr-2 text-right text-sm text-gray-500"
                            >
                                21:00
                            </div>
                            <div className="col-span-11 pl-4"></div>
                        </div>
                        <div className="grid grid-cols-12 border-t border-gray-200">
                            <div
                                className="col-span-1 border-r border-gray-200 py-4 pr-2 text-right text-sm text-gray-500"
                            >
                                22:00
                            </div>
                            <div className="col-span-11 pl-4"></div>
                        </div>
                        <div className="grid grid-cols-12 border-t border-gray-200">
                            <div
                                className="col-span-1 border-r border-gray-200 py-4 pr-2 text-right text-sm text-gray-500"
                            >
                                23:00
                            </div>
                            <div className="col-span-11 pl-4"></div>
                        </div>
                    </div> */}
                </div>
                {showAIHelp && (
                    <div className="bg-gray-100 rounded-lg p-6 flex flex-col flex-1">
                        <div className="flex items-center mb-4">
                            <RiRobot2Fill className="text-purple-600 mr-2 text-2xl" />
                            <h3 className="text-md font-semibold text-gray-800">AI Assistant</h3>
                        </div>
                        {/* Chat Messages */}
                        <div className="bg-white rounded-lg p-4 mb-4 flex-grow overflow-y-auto h-[300px]">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex mb-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${msg.sender === "user"
                                            ? "bg-purple-600 text-white rounded-br-none"
                                            : "bg-gray-200 text-gray-800 rounded-bl-none"
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="relative">
                            <input
                                className="w-full border border-gray-300 rounded-md py-2 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Describe your routine..."
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && sendMessage()}
                            />
                            <button
                                onClick={sendMessage}
                                className="absolute inset-y-0 right-0 flex items-center justify-center w-10 h-full text-white bg-purple-600 rounded-r-md hover:bg-purple-700 focus:outline-none"
                            >
                                <IoSend className="text-lg" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default RoutineEdit