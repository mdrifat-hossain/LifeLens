import React from 'react'
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useApi } from "../../utils/api";

import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { FaArrowLeftLong } from "react-icons/fa6";
import { BsStars } from "react-icons/bs";

export default function LearningPathList() {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const { makeRequest } = useApi();

    const handleSubmit = async (type) => {
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
            setIsOpen(false);
        } catch (err) {
            console.error("Error saving path:", err);
        }
    };


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
                        <Link
                            to="path-details" // 👈 your route here
                            className="block bg-white dark:bg-gray-900/50 p-6 rounded-xl shadow-sm 
             hover:shadow-lg dark:hover:bg-gray-800/60 transition-all duration-300 
             border border-gray-200 dark:border-gray-800 hover:border-primary/50 
             dark:hover:border-primary/50"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex-grow">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Data Analysis Fundamentals
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        Learn the fundamentals of data analysis, including data manipulation,
                                        visualization, and statistical analysis.
                                    </p>
                                </div>

                                <MdOutlineKeyboardArrowRight
                                    className="text-gray-400 dark:text-gray-500 self-center"
                                    size={32}
                                />
                            </div>
                        </Link>
                        <Link
                            to="path-details" // 👈 your route here
                            className="block bg-white dark:bg-gray-900/50 p-6 rounded-xl shadow-sm 
             hover:shadow-lg dark:hover:bg-gray-800/60 transition-all duration-300 
             border border-gray-200 dark:border-gray-800 hover:border-primary/50 
             dark:hover:border-primary/50"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex-grow">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        UI/UX Design Mastery
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        Master the art of crafting compelling user interfaces and
                                        experiences for web and mobile applications.
                                    </p>
                                </div>

                                <MdOutlineKeyboardArrowRight
                                    className="text-gray-400 dark:text-gray-500 self-center"
                                    size={32}
                                />
                            </div>
                        </Link>

                    </div>
                </div>
            </main>
        </div>
    )
}
