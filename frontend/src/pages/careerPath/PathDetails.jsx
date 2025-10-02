import React from 'react'
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from 'react';
import { useApi } from "../../utils/api";

import { FaArrowLeftLong } from "react-icons/fa6";
import { MdDragIndicator, MdEdit, MdDeleteForever } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { PiArrowsDownUpDuotone } from "react-icons/pi";
import { BsStars } from "react-icons/bs";




// PathDetails.jsx
// - Drag & drop reordering using the HTML5 Drag API
// - Edit button opens a modal dialog (background content is blurred while modal is open)
// - Modal contains inputs specific to the selected item (title, type, description)

const initialItems = [
    {
        id: "item-1",
        title: 'Read "The Design of Everyday Things"',
        type: "Book",
        description: "Foundational principles of user-centered design.",
    },
    {
        id: "item-2",
        title: "Complete Coursera's \"Google UX Design Professional Certificate\"",
        type: "Course",
        description:
            "Comprehensive online program covering the entire UX process.",
    },
];

function PathDetails() {
    const queryParams = new URLSearchParams(location.search);
    const pathId = queryParams.get("path_id");
    const { makeRequest } = useApi();


    const [items, setItems] = useState(initialItems);
    const dragItemIndex = useRef(null);
    const dragOverItemIndex = useRef(null);
    const [draggingIndex, setDraggingIndex] = useState(null);

    // Modal/edit state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [form, setForm] = useState({ title: "", type: "", description: "" });

    const [paths, setPaths] = useState();

    useEffect(() => {
        const fetchPath = async () => {
            try {
                const res = await makeRequest(`get-learning-path/${pathId}`, {
                    method: "GET"
                });
                // console.log("Fetched Path:", res.title);
                setPaths(res);
            } catch (err) {
                console.error("Error fetching path:", err);
            }
        };

        if (pathId) fetchPath();
    }, [pathId]);

    // const [items, setItems] = useState([]);
    // Open modal for add/edit
    // const openEdit = (item) => {
    //     setForm(item || { item_id: null, title: "", type: "Course", description: "" });
    //     setIsModalOpen(true);
    // };

    // const closeModal = () => setIsModalOpen(false);

    // Handle form changes
    const handleFormChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Add or update item
    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (form.item_id) {
                // update
                console.log("Updating item with form data:", form);
                await makeRequest(`update-learning-path-items/${form.item_id}`, {
                    method: "PUT",
                    body: JSON.stringify(form),
                });
                setItems((prev) =>
                    prev.map((i) => (i.item_id === form.item_id ? { ...i, ...form } : i))
                );
            } else {
                // add new
                const res = await makeRequest(`add-learning-path-items/${pathId}`, {
                    method: "POST",
                    body: JSON.stringify(form),
                });
                setItems(prev => [res, ...prev]); // prepend new item to list
            }
            closeModal();
        } catch (err) {
            console.error("Error saving item:", err);
        }
    };

    // Delete item
    const handleDelete = async (item_id) => {
        try {
            await makeRequest(`learning-path-items/${item_id}`, { method: "DELETE" });
            setItems((prev) => prev.filter((i) => i.item_id !== item_id));
        } catch (err) {
            console.error("Error deleting item:", err);
        }
    };

    // Fetch all items
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await makeRequest(`get-learning-path-items/${pathId}`, { method: "GET" });
                console.log("Fetched Items:", res);
                setItems(res.items);
            } catch (err) {
                console.error("Error fetching items:", err);
            }
        };
        fetchItems();
    }, [pathId]);

    // Open modal for add/edit
    const openEdit = (item) => {
        setEditingItem(item);
        setForm(item || { item_id: null, title: "", type: "Course", description: "" });
        setIsModalOpen(true);
    };


    // Prevent body scroll while modal is open
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => (document.body.style.overflow = "");
    }, [isModalOpen]);

    // Drag handlers
    function handleDragStart(e, index) {
        dragItemIndex.current = index;
        setDraggingIndex(index);
        // required for Firefox
        try {
            e.dataTransfer.setData("text/plain", "drag");
        } catch (err) {
            // ignore
        }
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
    //         // cleanup
    //         dragItemIndex.current = null;
    //         dragOverItemIndex.current = null;
    //         setDraggingIndex(null);
    //         return;
    //     }

    //     setItems((prev) => {
    //         const copy = Array.from(prev);
    //         const [moved] = copy.splice(from, 1);
    //         copy.splice(to, 0, moved);
    //         return copy;
    //     });

    //     dragItemIndex.current = null;
    //     dragOverItemIndex.current = null;
    //     setDraggingIndex(null);
    // }
    function handleDrop(e) {
        e.preventDefault();
        const from = dragItemIndex.current;
        const to = dragOverItemIndex.current;

        if (from === null || to === null || from === to) {
            // reset refs and dragging state
            dragItemIndex.current = null;
            dragOverItemIndex.current = null;
            setDraggingIndex(null);
            return;
        }

        setItems((prev) => {
            const copy = Array.from(prev);
            const [moved] = copy.splice(from, 1);
            copy.splice(to, 0, moved);

            // persist new order
            const reordered = copy.map((item, index) => ({
                item_id: item.item_id,
                order_index: index,
            }));

            makeRequest(`reorder-learning-path-items/${pathId}`, {
                method: "POST",
                body: JSON.stringify({ items: reordered }),
            }).catch((err) => console.error("Error saving order:", err));

            return copy;
        });

        // reset refs and dragging state
        dragItemIndex.current = null;
        dragOverItemIndex.current = null;
        setDraggingIndex(null);
    }

    async function saveOrder(newOrder) {
        try {
            const reordered = newOrder.map((item, index) => ({
                item_id: item.item_id,
                sort_order: index,
            }));

            await makeRequest("update-learning-path-items-order", {
                method: "PUT",
                body: JSON.stringify({ items: reordered }),
                headers: { "Content-Type": "application/json" },
            });
        } catch (err) {
            console.error("Error saving order:", err);
        }
    }

    function handleDragEnd() {
        dragItemIndex.current = null;
        dragOverItemIndex.current = null;
        setDraggingIndex(null);
    }

    function closeModal() {
        setIsModalOpen(false);
        setEditingItem(null);
    }

    const [expandedItems, setExpandedItems] = useState({});

    // Edit modal flows
    // function openEdit(item) {
    //     setEditingItem(item);
    //     setForm({ title: item.title, type: item.type, description: item.description });
    //     setIsModalOpen(true);
    // }



    // function handleFormChange(e) {
    //     const { name, value } = e.target;
    //     setForm((f) => ({ ...f, [name]: value }));
    // }

    // function handleSave(e) {
    //     e.preventDefault();
    //     if (!editingItem) return closeModal();

    //     setItems((prev) => prev.map((it) => (it.id === editingItem.id ? { ...it, ...form } : it)));
    //     closeModal();
    // }

    // function handleDelete(id) {
    //     setItems((prev) => prev.filter((it) => it.id !== id));
    // }

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200 min-h-screen flex flex-col">
            <main className={`container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow ${isModalOpen ? "filter blur-sm" : ""}`}>
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <Link
                            to="/career-path/learning-path"
                            className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors mb-4"
                        >
                            <FaArrowLeftLong className="text-base" />
                            <span>Back to Learning Paths</span>
                        </Link>
                        {!paths ? (
                            <p>Loading...</p>   // 👈 while fetching
                        ) : (
                            <>
                                <div className="flex items-center gap-4 group">
                                    <input
                                        className="text-3xl font-bold text-gray-900 dark:text-white bg-transparent border-none p-0 focus:ring-0 w-full"
                                        type="text"
                                        value={paths.title} // ✅ use the fetched title
                                        readOnly
                                    />
                                    <button className="opacity-0 group-hover:opacity-100 transition-opacity text-green-900 hover:text-primary">
                                        <MdEdit size={20} />
                                    </button>


                                </div>
                                <p className="text-gray-600 dark:text-gray-400 mt-2">
                                    {paths.description || "No description provided."}
                                </p>
                            </>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="flex justify-between mb-4">
                            <PiArrowsDownUpDuotone className="text-base" size={30} />
                            <Link
                                to={`ai-help?path_Id=${pathId}`} // 👈 your route here
                                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg 
             bg-white/20 dark:bg-green-900/20 backdrop-blur-md border border-white/20 
             text-sm font-medium text-green-600 dark:text-green-400 
             hover:bg-white/20 dark:hover:bg-green-900/50 
             transition shadow-md hover:shadow-lg"
                            >
                                <BsStars className="text-green-500 text-lg" />
                                <span className="text-green-600 dark:text-green-300 font-semibold">AI help</span>
                                <span className="material-icons text-base text-green-900 dark:text-green-200">
                                    arrow_forward
                                </span>
                            </Link>


                            <button
                                className="flex items-center gap-2 bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                                onClick={() => openEdit(null)} // opens blank form for new item
                            >
                                <IoMdAdd className="text-base" size={20} />
                                <span>Add New Item</span>
                            </button>
                        </div>

                        {/* Draggable list */}
                        {items.map((item, index) => (
                            <div
                                key={item.item_id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDrop={handleDrop}
                                onDragEnd={handleDragEnd}
                                className={`bg-white dark:bg-gray-900/50 p-4 rounded-xl shadow-sm border 
            border-gray-200 dark:border-gray-800 flex flex-col gap-2 
            ${draggingIndex === index ? "opacity-50" : ""}`}
                            >
                                {/* Main Info */}
                                <div className="flex items-center gap-4">
                                    <div className="w-6 h-6 flex items-center justify-center">
                                        <MdDragIndicator size={24} className="cursor-grab text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => openEdit(item)} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                                            <MdEdit size={20} />
                                        </button>
                                        <button onClick={() => handleDelete(item.item_id)} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                                            <MdDeleteForever size={20} />
                                        </button>
                                    </div>
                                </div>

                                {/* Dropdown toggle */}
                                <div className="text-center mt-2">
                                    <button
                                        onClick={() =>
                                            setExpandedItems((prev) => ({ ...prev, [item.item_id]: !prev[item.item_id] }))
                                        }
                                        className="text-sm text-blue-500 hover:underline"
                                    >
                                        {expandedItems[item.item_id] ? "Show Less ▲" : "Show More ▼"}
                                    </button>
                                </div>

                                {/* Expanded Section with smooth animation */}
                                <div
                                    className={`mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded space-y-1 text-sm text-gray-700 dark:text-gray-300
                transition-all duration-300 ease-in-out overflow-hidden
                ${expandedItems[item.item_id] ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}
                                >
                                    <p><strong>Focus:</strong> {item.focus}</p>

                                    {item.skills && Array.isArray(item.skills) && item.skills.length > 0 && (
                                        <p>
                                            <strong>Skills:</strong>
                                            <ul className="list-disc list-inside ml-4">
                                                {item.skills.map((skill, i) => <li key={i}>{skill}</li>)}
                                            </ul>
                                        </p>
                                    )}

                                    {item.sources?.length > 0 && (
                                        <p>
                                            <strong>Sources:</strong>
                                            <ul className="list-disc list-inside ml-4">
                                                {item.sources.map((srcGroup, i) =>
                                                    srcGroup.map((src, j) => {
                                                        if (!src) return null;
                                                        const urlMatch = src.match(/\[.*?\]\((.*?)\)/);
                                                        const url = urlMatch ? urlMatch[1] : src;
                                                        const text = urlMatch ? src.replace(/\[|\]\(.*?\)/g, "") : src;
                                                        return (
                                                            <li key={`${i}-${j}`}>
                                                                <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                                    {text || url}
                                                                </a>
                                                            </li>
                                                        );
                                                    })
                                                )}
                                            </ul>
                                        </p>
                                    )}

                                    <p><strong>Duration:</strong> {item.duration}</p>
                                </div>
                            </div>
                        ))}



                    </div>
                </div>
            </main>

            {/* Edit Modal */}
            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
                    <div
                        role="dialog"
                        aria-modal="true"
                        className="relative bg-white dark:bg-gray-900/90 rounded-lg shadow-lg w-full max-w-lg p-6 z-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            {form.item_id ? "Edit Item" : "Add Item"}
                        </h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                                <input
                                    name="title"
                                    value={form.title}
                                    onChange={handleFormChange}
                                    className="mt-1 block w-full rounded-md border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                                <select
                                    name="type"
                                    value={form.type}
                                    onChange={handleFormChange}
                                    className="mt-1 block w-full rounded-md border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option>Course</option>
                                    <option>Book</option>
                                    <option>Article</option>
                                    <option>Video</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleFormChange}
                                    rows={4}
                                    className="mt-1 block w-full rounded-md border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white text-sm">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}


export default PathDetails