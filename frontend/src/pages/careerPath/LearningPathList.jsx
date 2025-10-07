import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useApi } from "../../utils/api";

import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { FaArrowLeftLong } from "react-icons/fa6";
import { BsStars } from "react-icons/bs";
import { MdDragIndicator, MdEdit, MdDeleteForever } from "react-icons/md";

const initialItems = [
    {
        id: "demo",
        title: 'demo',
        type: "demo",
        description: "demo",
    },

];

export default function LearningPathList() {

    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const { makeRequest } = useApi();
    const navigate = useNavigate();

    const handleSubmit = async (type) => {
        // Validation
        if (!title || title.trim() === "") {
            alert("Title cannot be empty");
            return;
        }

        const TITLE_LIMIT = 100;        // max 100 characters
        const DESCRIPTION_LIMIT = 500;  // max 500 characters

        if (title.length > TITLE_LIMIT) {
            alert(`Title cannot exceed ${TITLE_LIMIT} characters`);
            return;
        }

        if (description && description.length > DESCRIPTION_LIMIT) {
            alert(`Description cannot exceed ${DESCRIPTION_LIMIT} characters`);
            return;
        }

        try {
            const res = await makeRequest("add-learning-path", {
                method: "POST",
                body: JSON.stringify({
                    title,
                    description,
                    pathType: type, // "AI" or "Manual"
                }),
            });

            console.log("Learning Path Saved:", res);

            if (type === "Manual") {
                navigate(`path-details?path_id=${res.path_id}`);
                setIsOpen(false);
                return;
            }
            else {
                // For AI, navigate to AI help page
                navigate(`path-details/ai-help?path_Id=${res.path_id}`);
                setIsOpen(false);
                return;
            }

            // setIsOpen(false);
        } catch (err) {
            console.error("Error saving path:", err);
            alert("Error saving learning path. Please try again.");
        }
    };

    const [paths, setPaths] = useState([]);

    useEffect(() => {
        const fetchPaths = async () => {
            try {
                const res = await makeRequest("get-learning-paths", { method: "GET" });
                console.log("Fetched paths:", res);
                setPaths(res.learning_paths);

                // Set running path if any
                // Set running paths if any
                const running = res.learning_paths
                    .filter(p => p.is_running === 1)
                    .map(p => p.path_id);

                if (running.length > 0) {
                    setRunningPaths(running);
                }
            } catch (err) {
                console.error("Error fetching paths:", err);
            }
        };

        fetchPaths();
    }, []); // empty array = run once

    // const [paths, setPaths] = useState([]); 
    const dragItemIndex = useRef(null);
    const dragOverItemIndex = useRef(null);
    const [draggingIndex, setDraggingIndex] = useState(null);

    // modal/edit state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [form, setForm] = useState({ path_id: null, title: "", description: "" });

    // running path state
    // const [runningPath, setRunningPath] = useState(null);
    const [runningPaths, setRunningPaths] = useState([]);

    // drag handlers
    function handleDragStart(e, index) {
        dragItemIndex.current = index;
        setDraggingIndex(index);
        try {
            e.dataTransfer.setData("text/plain", "drag");
        } catch (err) { }
        e.dataTransfer.effectAllowed = "move";
    }

    function handleDragOver(e, index) {
        e.preventDefault();
        dragOverItemIndex.current = index;
    }

    // function handleDrop(e) {
    //     e.preventDefault();
    //     const from = dragItemIndex.current;
    //     const to = dragOverItemIndex.current;

    //     if (from === null || to === null || from === to) {
    //         resetDrag();
    //         return;
    //     }

    //     // cannot drag another path to top if one is running
    //     // if (runningPath && to === 0) {
    //     //     alert("Already one path is running. Stop it first.");
    //     //     resetDrag();
    //     //     return;
    //     // }

    //     setPaths((prev) => {
    //         const copy = Array.from(prev);
    //         const [moved] = copy.splice(from, 1);
    //         copy.splice(to, 0, moved);

    //         // persist sort_order
    //         const reordered = copy.map((item, index) => ({
    //             path_id: item.path_id,
    //             sort_order: index,
    //         }));

    //         console.log("Reordered:", reordered);

    //         makeRequest(`reorder-learning-paths`, {
    //             method: "POST",
    //             body: JSON.stringify({ items: reordered }),
    //         }).catch((err) => console.error(err));

    //         return copy;
    //     });

    //     resetDrag();
    // }

    function handleDrop(e) {
        e.preventDefault();
        const from = dragItemIndex.current;
        const to = dragOverItemIndex.current;

        if (from === null || to === null || from === to) {
            resetDrag();
            return;
        }

        setPaths((prev) => {
            const copy = Array.from(prev);
            const [moved] = copy.splice(from, 1);
            copy.splice(to, 0, moved);

            // update sort_order but keep is_running intact
            const reordered = copy.map((item, index) => ({
                path_id: item.path_id,
                sort_order: index,
                is_running: item.is_running ?? 0, // ✅ preserve running
            }));

            // Update DB
            makeRequest(`reorder-learning-paths`, {
                method: "POST",
                body: JSON.stringify({ items: reordered }),
            }).catch((err) => console.error(err));

            return copy; // keep is_running in local state as well
        });

        resetDrag();
    }



    function resetDrag() {
        dragItemIndex.current = null;
        dragOverItemIndex.current = null;
        setDraggingIndex(null);
    }

    function handleDragEnd() {
        resetDrag();
    }

    // toggle running path
    // const handleToggleRunning = async (path) => {
    //     try {
    //         console.log("Toggle running for path:", runningPath, path.path_id);
    //         if (runningPath === path.path_id) {
    //             // STOP running
    //             setRunningPath(null);
    //             await makeRequest(`update-learning-path-running/${path.path_id}`, {
    //                 method: "POST",
    //                 body: JSON.stringify({ is_running: 0 }),
    //             });
    //         } else {
    //             if (runningPath) {
    //                 alert("At first stop current running path");
    //                 return;
    //             }

    //             // START running
    //             setRunningPath(path.path_id);
    //             const idx = paths.findIndex((i) => i.path_id === path.path_id);
    //             if (idx > 0) {
    //                 const reordered = [...paths];
    //                 const [selected] = reordered.splice(idx, 1);
    //                 reordered.unshift(selected);
    //                 setPaths(reordered);
    //             }

    //             // Update DB
    //             await makeRequest(`update-learning-path-running/${path.path_id}`, {
    //                 method: "POST",
    //                 body: JSON.stringify({ is_running: 1, sort_order: 0 }),
    //             });
    //         }
    //     } catch (err) {
    //         console.error("Error toggling running path:", err);
    //     }
    // };


    // edit modal

    const handleToggleRunning = async (path) => {
        try {
            const isRunning = runningPaths.includes(path.path_id);

            if (isRunning) {
                // STOP running
                setRunningPaths((prev) => prev.filter((id) => id !== path.path_id));

                // Recalculate orders after stopping
                setPaths((prev) => {
                    const reordered = prev.map((item, index) => ({
                        ...item,
                        sort_order: index,
                    }));

                    // Update DB with fresh order
                    makeRequest(`reorder-learning-paths`, {
                        method: "POST",
                        body: JSON.stringify({
                            items: reordered.map((i, idx) => ({
                                path_id: i.path_id,
                                sort_order: idx,
                                is_running: runningPaths.includes(i.path_id) && i.path_id !== path.path_id ? 1 : 0
                            })),
                        }),
                    }).catch((err) => console.error(err));

                    return reordered;
                });
            } else {
                // START running
                setRunningPaths((prev) => [path.path_id, ...prev]); // newest at the front

                setPaths((prev) => {
                    const idx = prev.findIndex((i) => i.path_id === path.path_id);
                    if (idx >= 0) {
                        const reordered = [...prev];
                        const [selected] = reordered.splice(idx, 1);
                        reordered.unshift(selected);

                        // Recalculate orders
                        const updated = reordered.map((item, index) => ({
                            ...item,
                            sort_order: index,
                        }));

                        // Update DB with full order + running state
                        makeRequest(`reorder-learning-paths`, {
                            method: "POST",
                            body: JSON.stringify({
                                items: updated.map((i) => ({
                                    path_id: i.path_id,
                                    sort_order: i.sort_order,
                                    is_running: runningPaths.includes(i.path_id) || i.path_id === path.path_id ? 1 : 0
                                })),
                            }),
                        }).catch((err) => console.error(err));

                        return updated;
                    }
                    return prev;
                });
            }
        } catch (err) {
            console.error("Error toggling running path:", err);
        }
    };


    const openEdit = (item) => {
        setEditingItem(item);
        setForm(item || { path_id: null, title: "", description: "" });
        setIsModalOpen(true);
    };

    function closeModal() {
        setIsModalOpen(false);
        setEditingItem(null);
    }

    const handleFormChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (form.path_id) {
                // update
                await makeRequest(`update-learning-path/${form.path_id}`, {
                    method: "PUT",
                    body: JSON.stringify(form),
                });
                setPaths((prev) =>
                    prev.map((i) => (i.path_id === form.path_id ? { ...i, ...form } : i))
                );
            } else {
                // add new
                const res = await makeRequest(`add-learning-path`, {
                    method: "POST",
                    body: JSON.stringify(form),
                });
                setPaths((prev) => [res, ...prev]);
            }
            closeModal();
        } catch (err) {
            console.error("Error saving item:", err);
        }
    };

    const handleDelete = async (path_id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this learning path?");
        if (!confirmDelete) return;

        try {
            console.log("Delete path:", path_id);
            await makeRequest(`delete-learning-path/${path_id}`, { method: "DELETE" });
            setPaths((prev) => prev.filter((i) => i.path_id !== path_id));
            alert("Learning path deleted successfully!");
        } catch (err) {
            console.error("Error deleting path:", err);
            alert("Failed to delete the learning path. Please try again.");
        }
    };



    // prevent body scroll when modal open
    useEffect(() => {
        document.body.style.overflow = isModalOpen ? "hidden" : "";
        return () => (document.body.style.overflow = "");
    }, [isModalOpen]);


    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200 min-h-screen flex flex-col">
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
                <div className="max-w-4xl mx-auto">
                    <Link
                        to="/career-path" // 👈 adjust this to your actual route
                        className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 
             hover:text-primary dark:hover:text-primary transition-colors mb-4"
                    >
                        <FaArrowLeftLong className="text-base" />
                        <span>Back to Career-Dashboard</span>
                    </Link>
                    <div
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8"
                    >

                        <h2
                            className="text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0"
                        >
                            My Learning Paths
                        </h2>
                        <button
                            onClick={() => setIsOpen(true)}
                            className="flex items-center justify-center gap-2 bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            <BsStars className="text-base" />
                            <span className="text-green-950">
                                New Path with <span className="text-white font-semibold">AI</span>
                            </span>
                            <span className="material-icons text-base text-green-950">arrow_forward</span>
                        </button>

                        {isOpen && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center">
                                <div
                                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                                    onClick={() => setIsOpen(false)}
                                ></div>

                                <div className="relative z-10 w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-lg">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                        Create New Path
                                    </h2>
                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="Enter Title"
                                            className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-gray-800 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                        />
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Enter Description"
                                            rows="3"
                                            className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-gray-800 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                        ></textarea>
                                    </div>
                                    <div className="mt-6 flex justify-end gap-3">

                                        <button
                                            onClick={() => setIsOpen(false)}
                                            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            onClick={() => handleSubmit("AI")}
                                            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
                                        >
                                            Create with AI →
                                        </button>
                                        <button
                                            onClick={() => handleSubmit("Manual")}
                                            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                                        >
                                            Manual
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="space-y-4">
                        {/* Draggable list */}
                        {paths.map((path, index) => (
                            <div
                                key={path.path_id}
                                // draggable={path.path_id !== runningPath} 
                                draggable={true} // always draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDrop={handleDrop}
                                onDragEnd={handleDragEnd}
                                className={`bg-white dark:bg-gray-900/50 p-4 rounded-xl shadow-sm border 
            border-gray-200 dark:border-gray-800 flex items-center gap-4 
            ${draggingIndex === index ? "opacity-50" : ""} 
            ${"cursor-grab"}`}
                            >
                                {/* Drag Handle */}
                                <MdDragIndicator
                                    size={24}
                                    className={`text-gray-400 dark:text-gray-500 ${runningPaths.includes(path.path_id) ? "opacity-30" : ""}`}
                                />

                                {/* Main Content + Link */}
                                <Link
                                    to={`path-details?path_id=${path.path_id}`}
                                    className="flex items-center justify-between w-full no-underline"
                                >
                                    {/* Left: Title + Description */}
                                    <div className="flex flex-col flex-grow">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{path.title}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{path.description}</p>
                                    </div>
                                </Link>

                                {/* Middle: Run/Stop Button */}
                                <div className="mx-4 flex-shrink-0">
                                    <button
                                        onClick={() => handleToggleRunning(path)}
                                        className={`px-6 py-2 min-w-[120px] rounded-lg text-sm font-medium transition-colors 
${runningPaths.includes(path.path_id)
                                                ? "bg-red-500 text-white"
                                                : "bg-primary text-white hover:bg-primary/90"}`}
                                    >
                                        {runningPaths.includes(path.path_id) ? "Stop Running" : "Run This"}

                                    </button>
                                </div>

                                {/* Right: Edit/Delete */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => openEdit(path)}
                                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
                                    >
                                        <MdEdit size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(path.path_id)}
                                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-red-500"
                                    >
                                        <MdDeleteForever size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}


                        {/* Simple modal for add/edit */}
                        {isModalOpen && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                                <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-96">
                                    <h2 className="text-lg font-semibold mb-4">
                                        {editingItem ? "Edit Path" : "Add Path"}
                                    </h2>
                                    <form onSubmit={handleSave} className="space-y-3">
                                        <input
                                            type="text"
                                            name="title"
                                            value={form.title}
                                            onChange={handleFormChange}
                                            placeholder="Title"
                                            className="w-full border p-2 rounded"
                                        />
                                        <textarea
                                            name="description"
                                            value={form.description}
                                            onChange={handleFormChange}
                                            placeholder="Description"
                                            className="w-full border p-2 rounded"
                                        />
                                        <div className="flex justify-end gap-2 mt-4">
                                            <button
                                                type="button"
                                                onClick={closeModal}
                                                className="px-4 py-2 text-black bg-gray-300 rounded hover:bg-gray-400"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
