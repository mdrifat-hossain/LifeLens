import React from 'react'
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from 'react';
import { useApi } from "../../utils/api";
import { RiRobot3Fill } from "react-icons/ri";
import { infinity } from 'ldrs'
import { FaUserCircle } from "react-icons/fa";


function AiHelp() {
    const queryParams = new URLSearchParams(location.search);
    const pathId = queryParams.get("path_Id");
    const { makeRequest } = useApi();

    const [paths, setPaths] = useState();

    useEffect(() => {
        console.log("Path ID in AI Help:", pathId);
        const fetchPath = async () => {
            try {
                const res = await makeRequest(`get-learning-path/${pathId}`, {
                    method: "GET"
                });
                console.log("Fetched Path in AIchat:", res);
                setPaths(res);
            } catch (err) {
                console.error("Error fetching path:", err);
            }
        };

        if (pathId) fetchPath();
    }, [pathId]);

    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content:
                "Hi there! I'm here to help you create a personalized learning path. How can I help you?",
        },
    ]);

    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null); // for auto-scroll

    const handleSend = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { role: "user", content: input.trim() }];
        setMessages(newMessages);
        setInput("");
        setIsLoading(true); // start loader

        try {
            const res = await makeRequest("career-ai-help", {
                method: "POST",
                body: JSON.stringify({
                    path_id: pathId,
                    conversation: newMessages,
                }),
            });

            if (res?.ai_reply) {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        content: res.ai_reply.raw_text,
                        structured: res.ai_reply,
                    },
                ]);
            }
        } catch (err) {
            console.error("❌ Error sending message:", err);
        } finally {
            setIsLoading(false); // stop loader after response or error
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);



    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const [acceptedPath, setAcceptedPath] = useState(null);
    const handleAddItem = async () => {
        if (!acceptedPath) return;

        try {
            console.log("✅ Accepted Path to add:", acceptedPath);
            const res = await makeRequest(`add-ai-learning-path/${pathId}`, {
                method: "POST",
                body: JSON.stringify({
                    path: acceptedPath,
                }),
            });

            if (res.success) {
                alert("Learning path added successfully!");
            } else {
                alert("Failed to add learning path");
            }
        } catch (err) {
            console.error("❌ Error adding learning path:", err);
        }
    };


    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200 flex h-[calc(100vh-4rem)] flex-col">
            <main className="flex flex-1 overflow-hidden">
                <div className="flex flex-1 flex-col">
                    <div className="flex-1 overflow-y-auto pl-6 pr-6 pb-6">
                        {/* <div className="sticky top-0 z-20 w-full bg-background-light dark:bg-background-dark pb-5">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                AI Career Path Chat
                            </h1>
                        </div> */}
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                AI Career Path Chat
                            </h1>
                        </div>
                        <div className="flex flex-col gap-6">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex items-start gap-4 ${msg.role === "user" ? "justify-end" : ""}`}
                                >
                                    {msg.role === "assistant" && (
                                        <div className="h-10 w-10 shrink-0 rounded-full bg-gray-400">
                                            <RiRobot3Fill className="h-10 w-10 p-2 text-black" />
                                        </div>
                                    )}

                                    <div
                                        className={`max-w-2xl rounded-lg px-4 py-3 ${msg.role === "assistant"
                                            ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                                            : "bg-primary text-white"
                                            }`}
                                    >
                                        {/* AI structured reply */}
                                        {msg.role === "assistant" && msg.structured ? (
                                            <div className="space-y-6">
                                                <h2 className="text-xl font-bold">{msg.structured.path_title}</h2>

                                                {/* Levels */}
                                                {msg.structured.levels.map((level) => (
                                                    <div
                                                        key={level.level_num}
                                                        className="border rounded-lg p-4 bg-white dark:bg-gray-900 shadow"
                                                    >
                                                        <h3 className="font-semibold text-lg">
                                                            Level {level.level_num}: {level.title}
                                                        </h3>
                                                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                                            <strong>Focus:</strong> {level.focus}
                                                        </p>
                                                        <p className="mt-1">
                                                            <strong>Duration:</strong> {level.duration}
                                                        </p>
                                                        <p className="mt-1">
                                                            <strong>Skills:</strong> {level.skills.join(", ")}
                                                        </p>
                                                        <div className="mt-2">
                                                            <strong>Sources:</strong>
                                                            <ul className="list-disc list-inside">
                                                                {level.sources.map(([name, url]) => (
                                                                    <li key={url}>
                                                                        <a
                                                                            href={url}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-blue-600 dark:text-blue-400 underline"
                                                                        >
                                                                            {name}
                                                                        </a>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                ))}

                                                {/* Weekly Routine */}
                                                <div>
                                                    <h3 className="font-semibold text-lg">Weekly Routine</h3>
                                                    {msg.structured.routines && msg.structured.routines.length > 0 ? (
                                                        <ul className="mt-2 space-y-1">
                                                            {msg.structured.routines.map((routine, i) => (
                                                                <li key={i} className="flex justify-between">
                                                                    <span className="font-medium">{routine.day_of_week}:</span>
                                                                    <span>{routine.start_time} - {routine.end_time}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p className="text-gray-500 italic">
                                                            You already have a weekly routine for this path.
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Accept Button */}
                                                <div className="pt-2">
                                                    <button
                                                        onClick={() => setAcceptedPath(msg.structured)}
                                                        className="w-full rounded-lg bg-green-500 px-4 py-2 text-white font-bold hover:bg-green-600"
                                                    >
                                                        Accept
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            // fallback plain text
                                            <p>{msg.content}</p>
                                        )}
                                    </div>

                                    {msg.role === "user" && (
                                        // <div className="h-10 w-10 shrink-0 rounded-full bg-gray-400" />
                                        <FaUserCircle className="h-10 w-10 shrink-0 rounded-full text-gray-400" />
                                    )}
                                </div>
                            ))}
                            {/* Loader */}
                            {isLoading && (
                                <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center">
                                        <RiRobot3Fill className="h-6 w-6 text-black" />
                                    </div>
                                    <div className="p-4 max-w-2xl rounded-2xl bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                                        <l-infinity
                                            size="35"
                                            stroke="3"
                                            stroke-length="0.15"
                                            bg-opacity="0.1"
                                            speed="1.3"
                                            class="text-gray-800 dark:text-white"
                                            color="currentColor"
                                        ></l-infinity>
                                    </div>

                                </div>
                            )}

                            <div ref={messagesEndRef}></div>

                        </div>
                    </div>
                    {/* Input */}
                    <div className="shrink-0 border-t border-gray-200 bg-background-light p-6 dark:border-gray-700/50 dark:bg-background-dark">
                        <div className="relative">
                            <textarea
                                className="w-full resize-none rounded-lg border-gray-300 bg-gray-100 p-4 pr-20 text-sm text-gray-800 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400"
                                placeholder="Type your message..."
                                rows="1"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <button
                                onClick={handleSend}
                                className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white hover:bg-primary/90"
                            >
                                <span className="material-symbols-outlined">send</span>
                            </button>
                        </div>
                    </div>
                </div>
                <aside className="hidden w-96 flex-shrink-0 flex-col border-l border-gray-200 bg-background-light dark:border-gray-700/50 dark:bg-background-dark lg:flex h-[calc(100vh-4rem)]">
                    {/* 4rem (64px) = header height, adjust as needed */}

                    <div className="p-6 shrink-0">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Learning Path</h2>
                    </div>

                    {/* <div className="px-6 pb-4 shrink-0">
                        <div className="relative">
                            <input
                                className="w-full rounded-lg border border-gray-300 bg-gray-100 py-3 pl-4 pr-12 text-sm font-medium text-gray-800 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                                placeholder="Data Scientist Path"
                                type="text"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">edit</span>
                            </div>
                        </div>
                    </div> */}
                    <div className="flex-1 overflow-y-auto px-6 py-2 space-y-1">
                        <div className="space-y-1 p-2">
                            {acceptedPath
                                ? acceptedPath.levels.map((level) => (
                                    <div
                                        key={level.level_num}
                                        className="rounded-lg px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                                    >
                                        <p className="font-medium text-gray-800 dark:text-gray-200">
                                            {level.title}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {level.skills.join(", ")}
                                        </p>
                                    </div>
                                ))
                                : (
                                    <div className="rounded-lg px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800/50">
                                        <p className="font-medium text-gray-800 dark:text-gray-200">
                                            No accepted path yet.
                                        </p>

                                    </div>
                                )}
                        </div>
                    </div>
                    <div className="p-6 shrink-0">
                        <button className="w-full rounded-lg bg-green-500 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-300 dark:bg-green-700 dark:text-gray-200 dark:hover:bg-gray-600"
                            onClick={handleAddItem}
                        >
                            Add Item
                        </button>
                    </div>


                </aside>
            </main>
        </div>
    )
}

export default AiHelp