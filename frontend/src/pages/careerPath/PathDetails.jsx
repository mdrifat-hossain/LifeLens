import React from 'react'
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from 'react';

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
    const [items, setItems] = useState(initialItems);
    const dragItemIndex = useRef(null);
    const dragOverItemIndex = useRef(null);
    const [draggingIndex, setDraggingIndex] = useState(null);

    // Modal/edit state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [form, setForm] = useState({ title: "", type: "", description: "" });

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

    function handleDrop(e) {
        e.preventDefault();
        const from = dragItemIndex.current;
        const to = dragOverItemIndex.current;
        if (from === null || to === null || from === to) {
            // cleanup
            dragItemIndex.current = null;
            dragOverItemIndex.current = null;
            setDraggingIndex(null);
            return;
        }

        setItems((prev) => {
            const copy = Array.from(prev);
            const [moved] = copy.splice(from, 1);
            copy.splice(to, 0, moved);
            return copy;
        });

        dragItemIndex.current = null;
        dragOverItemIndex.current = null;
        setDraggingIndex(null);
    }

    function handleDragEnd() {
        dragItemIndex.current = null;
        dragOverItemIndex.current = null;
        setDraggingIndex(null);
    }

    // Edit modal flows
    function openEdit(item) {
        setEditingItem(item);
        setForm({ title: item.title, type: item.type, description: item.description });
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
        setEditingItem(null);
    }

    function handleFormChange(e) {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    }

    function handleSave(e) {
        e.preventDefault();
        if (!editingItem) return closeModal();

        setItems((prev) => prev.map((it) => (it.id === editingItem.id ? { ...it, ...form } : it)));
        closeModal();
    }

    function handleDelete(id) {
        setItems((prev) => prev.filter((it) => it.id !== id));
    }

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

                        <div className="flex items-center gap-4 group">
                            <input
                                className="text-3xl font-bold text-gray-900 dark:text-white bg-transparent border-none p-0 focus:ring-0 w-full"
                                type="text"
                                value="UI/UX Design Mastery"
                                readOnly
                            />
                            <button className="opacity-0 group-hover:opacity-100 transition-opacity text-green-900 hover:text-primary">
                                <MdEdit size={20} />
                            </button>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Master the art of crafting compelling user interfaces and experiences for web and
                            mobile applications.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex justify-between mb-4">
                            <PiArrowsDownUpDuotone className="text-base" size={30} />
                            <Link
                                to="ai-help" // 👈 your route here
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
                                onClick={() => {
                                    // add a new item placeholder and open edit modal immediately
                                    const newItem = {
                                        id: `item-${Date.now()}`,
                                        title: "New Item",
                                        type: "Course",
                                        description: "",
                                    };
                                    setItems((prev) => [newItem, ...prev]);
                                    openEdit(newItem);
                                }}
                            >
                                <IoMdAdd className="text-base" size={20} />
                                <span>Add New Item</span>
                            </button>
                        </div>

                        {/* Draggable list */}
                        {items.map((item, index) => (
                            <div
                                key={item.id}
                                className={`bg-white dark:bg-gray-900/50 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 flex items-center gap-4 ${draggingIndex === index ? "opacity-60" : ""
                                    }`}
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDrop={handleDrop}
                                onDragEnd={handleDragEnd}
                            >
                                <div className="cursor-grab text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                                    <MdDragIndicator size={24} />
                                </div>

                                <div className="flex-grow">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openEdit(item);
                                        }}
                                        className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
                                        aria-label={`Edit ${item.title}`}
                                    >
                                        <MdEdit size={20} />
                                    </button>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(item.id);
                                        }}
                                        className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                        aria-label={`Delete ${item.title}`}
                                    >
                                        <MdDeleteForever size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* semi-transparent background, click to close */}
                    <div className="absolute inset-0 bg-black/40" onClick={closeModal} />

                    <div
                        role="dialog"
                        aria-modal="true"
                        className="relative bg-white dark:bg-gray-900/90 rounded-lg shadow-lg w-full max-w-lg p-6 z-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Edit Item</h3>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                                <input
                                    name="title"
                                    value={form.title}
                                    onChange={handleFormChange}
                                    className="mt-1 block w-full rounded-md border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
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