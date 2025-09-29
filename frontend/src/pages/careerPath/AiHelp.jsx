import React from 'react'

function AiHelp() {
    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200 flex h-[calc(100vh-4rem)] flex-col">
            <main className="flex flex-1 overflow-hidden">
                <div className="flex flex-1 flex-col">
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                AI Career Path Chat
                            </h1>
                        </div>
                        <div className="flex flex-col gap-6">
                            <div className="flex items-start gap-4">
                                <div
                                    className="h-10 w-10 shrink-0 rounded-full bg-cover bg-center"
                                    style={{
                                        backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuC99Yg6KBk4xqV3RuPK6y1mlV2KAhPyEqd_IMUuQhzfIduUTSWY0uwg2yQTgqxwo9n8nUnfDGNH1fPrEVXABcP6Y-TvUPoiZKYFiKmGk2RoZYt6IBVrFA_daKYaGirDbxB3ALYjpQHmJGOtNidSuHkkHHFljk1k4ZgsNSAmRXOHKWxj4_cOl0BFyXnEAIL4STngkaZa-B398ZT-ql8YtoSD94QjTxYw64aCoM3GNOI-6C8f6Yx2gjlWwv2JTeiyIFVTwsM45F435NU')`
                                    }}
                                ></div>

                                <div className="flex flex-col items-start gap-2">
                                    <span
                                        className="text-sm font-medium text-gray-500 dark:text-gray-400"
                                    >AI Assistant</span>
                                    <div
                                        className="max-w-md rounded-lg bg-gray-100 px-4 py-3 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                                    >
                                        <p>
                                            Hi there! I'm here to help you create a personalized
                                            learning path. What career are you interested in pursuing?
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start justify-end gap-4">
                                <div className="flex flex-col items-end gap-2">
                                    <span
                                        className="text-sm font-medium text-gray-500 dark:text-gray-400"
                                    >Sophia</span>
                                    <div
                                        className="max-w-md rounded-lg bg-primary px-4 py-3 text-white"
                                    >
                                        <p>I'm interested in becoming a Data Scientist.</p>
                                    </div>
                                </div>
                                <div
                                    className="h-10 w-10 shrink-0 rounded-full bg-cover bg-center"
                                    style={{
                                        backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuC99Yg6KBk4xqV3RuPK6y1mlV2KAhPyEqd_IMUuQhzfIduUTSWY0uwg2yQTgqxwo9n8nUnfDGNH1fPrEVXABcP6Y-TvUPoiZKYFiKmGk2RoZYt6IBVrFA_daKYaGirDbxB3ALYjpQHmJGOtNidSuHkkHHFljk1k4ZgsNSAmRXOHKWxj4_cOl0BFyXnEAIL4STngkaZa-B398ZT-ql8YtoSD94QjTxYw64aCoM3GNOI-6C8f6Yx2gjlWwv2JTeiyIFVTwsM45F435NU')`
                                    }}
                                ></div>

                            </div>
                            <div className="flex items-start gap-4">
                                <div
                                    className="h-10 w-10 shrink-0 rounded-full bg-cover bg-center"
                                    style={{
                                        backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuC99Yg6KBk4xqV3RuPK6y1mlV2KAhPyEqd_IMUuQhzfIduUTSWY0uwg2yQTgqxwo9n8nUnfDGNH1fPrEVXABcP6Y-TvUPoiZKYFiKmGk2RoZYt6IBVrFA_daKYaGirDbxB3ALYjpQHmJGOtNidSuHkkHHFljk1k4ZgsNSAmRXOHKWxj4_cOl0BFyXnEAIL4STngkaZa-B398ZT-ql8YtoSD94QjTxYw64aCoM3GNOI-6C8f6Yx2gjlWwv2JTeiyIFVTwsM45F435NU')`
                                    }}
                                ></div>

                                <div className="flex flex-col items-start gap-2">
                                    <span
                                        className="text-sm font-medium text-gray-500 dark:text-gray-400"
                                    >AI Assistant</span>
                                    <div
                                        className="max-w-xl rounded-lg bg-gray-100 px-4 py-3 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                                    >
                                        <p className="mb-4">
                                            Great choice! Based on your interest, I recommend the
                                            following learning path:
                                        </p>
                                        <ol className="list-decimal space-y-2 pl-5">
                                            <li>
                                                <strong>Foundations of Data Science:</strong> Learn the
                                                basics of statistics, probability, and linear algebra.
                                            </li>
                                            <li>
                                                <strong>Programming for Data Science:</strong> Master
                                                Python and R, essential programming languages for data
                                                analysis.
                                            </li>
                                            <li>
                                                <strong>Data Manipulation and Analysis:</strong> Dive
                                                into data cleaning, transformation, and exploratory data
                                                analysis using libraries like Pandas and NumPy.
                                            </li>
                                            <li>
                                                <strong>Machine Learning Fundamentals:</strong>
                                                Understand the core concepts of machine learning
                                                algorithms, including supervised and unsupervised
                                                learning.
                                            </li>
                                            <li>
                                                <strong>Advanced Machine Learning:</strong> Explore
                                                advanced techniques such as deep learning, natural
                                                language processing, and time series analysis.
                                            </li>
                                            <li>
                                                <strong>Data Visualization:</strong> Learn to
                                                effectively communicate insights through data
                                                visualization tools like Matplotlib and Seaborn.
                                            </li>
                                            <li>
                                                <strong>Big Data Technologies:</strong> Get familiar
                                                with big data platforms like Hadoop and Spark for
                                                handling large datasets.
                                            </li>
                                            <li>
                                                <strong>Real-World Projects:</strong> Apply your
                                                knowledge by working on real-world data science projects
                                                to build your portfolio.
                                            </li>
                                        </ol>
                                        <p className="mt-4">
                                            Do you want to accept this learning path?
                                        </p>
                                    </div>
                                    <div className="mt-2 flex gap-2">
                                        <button
                                            className="flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            className="flex items-center justify-center rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className="shrink-0 border-t border-gray-200 bg-background-light p-6 dark:border-gray-700/50 dark:bg-background-dark"
                    >
                        <div className="relative">
                            <textarea
                                className="w-full resize-none rounded-lg border-gray-300 bg-gray-100 p-4 pr-20 text-sm text-gray-800 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400"
                                placeholder="Type your message..."
                                rows="1"
                            ></textarea>
                            <button
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

                    <div className="px-6 pb-4 shrink-0">
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
                    </div>
                    <div className="flex-1 overflow-y-auto px-6 py-2 space-y-1">
                        <div className="space-y-1 p-2">
                            <div
                                className="rounded-lg px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                            >
                                <p className="font-medium text-gray-800 dark:text-gray-200">
                                    Statistics and Probability
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Foundations of Data Science
                                </p>
                            </div>
                            <div
                                className="rounded-lg px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                            >
                                <p className="font-medium text-gray-800 dark:text-gray-200">
                                    Python and R
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Programming for Data Science
                                </p>
                            </div>
                            <div
                                className="rounded-lg px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                            >
                                <p className="font-medium text-gray-800 dark:text-gray-200">
                                    Pandas and NumPy
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Data Manipulation and Analysis
                                </p>
                            </div>
                            <div
                                className="rounded-lg px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                            >
                                <p className="font-medium text-gray-800 dark:text-gray-200">
                                    Supervised and Unsupervised Learning
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Machine Learning Fundamentals
                                </p>
                            </div>
                            <div
                                className="rounded-lg px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                            >
                                <p className="font-medium text-gray-800 dark:text-gray-200">
                                    Deep Learning and NLP
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Advanced Machine Learning
                                </p>
                            </div>
                            <div
                                className="rounded-lg px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                            >
                                <p className="font-medium text-gray-800 dark:text-gray-200">
                                    Matplotlib and Seaborn
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Data Visualization
                                </p>
                            </div>
                            <div
                                className="rounded-lg px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                            >
                                <p className="font-medium text-gray-800 dark:text-gray-200">
                                    Hadoop and Spark
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Big Data Technologies
                                </p>
                            </div>
                            <div
                                className="rounded-lg px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                            >
                                <p className="font-medium text-gray-800 dark:text-gray-200">
                                    Portfolio Building
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Real-World Projects
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 shrink-0">
                        <button className="w-full rounded-lg bg-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                            Add Item
                        </button>
                    </div>
                </aside>
            </main>
        </div>
    )
}

export default AiHelp