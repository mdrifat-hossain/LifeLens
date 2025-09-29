import React from 'react'
import { Link } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";
import { BsStars } from "react-icons/bs";

function CareerDashboard() {
    return (
        <div className="container mx-auto p-8 space-y-8">
            <div className="gradient-bg text-white  rounded-xl shadow-lg">
                <h1 className="text-4xl font-bold">Your Financial Technology Learning Journey</h1>
                <p className="mt-2 text-lg">Master the skills needed to build sophisticated financial applications and advance
                    your career in fintech.</p>
                <div className="mt-6 flex space-x-4">
                    <div className="bg-white/20 px-4 py-2 rounded-lg text-sm">Progress: 65%</div>
                    <div className="bg-white/20 px-4 py-2 rounded-lg text-sm">12 Skills Acquired</div>
                    <div className="bg-white/20 px-4 py-2 rounded-lg text-sm">8 Projects Completed</div>
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
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800">Learning Roadmap</h2>
                        <Link
                            to="learning-path" // 👈 your route here
                            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-indigo-300 
               text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition"
                        >
                            <BsStars className="text-green-500 text-lg" />
                            <span>
                                View all & <span className="text-green-600 font-semibold">AI</span> help
                            </span>
                            <span className="material-icons text-base text-indigo-600">arrow_forward</span>
                        </Link>
                    </div>

                    <div className="space-y-8 relative">
                        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                        <div className="flex items-start">
                            <div className="z-10 flex-shrink-0">
                                <div
                                    className="bg-green-500 rounded-full h-10 w-10 flex items-center justify-center text-white">
                                    <span className="material-icons">check</span>
                                </div>
                            </div>
                            <div className="ml-6 flex-grow">
                                <h3 className="font-semibold text-gray-900">Frontend Development Basics</h3>
                                <p className="text-gray-500 text-sm">HTML, CSS, JavaScript fundamentals</p>
                                <div className="mt-2 flex items-center space-x-2">
                                    <span
                                        className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">Completed</span>
                                    <span className="text-gray-400 text-sm">40 hours</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="z-10 flex-shrink-0">
                                <div className="bg-blue-600 rounded-full h-10 w-10 flex items-center justify-center text-white">
                                    <span className="material-icons">play_arrow</span>
                                </div>
                            </div>
                            <div className="ml-6 flex-grow">
                                <h3 className="font-semibold text-gray-900">React &amp; State Management</h3>
                                <p className="text-gray-500 text-sm">Building interactive financial dashboards</p>
                                <div className="mt-2 flex items-center space-x-2">
                                    <span
                                        className="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">In
                                        Progress</span>
                                    <span className="text-gray-400 text-sm">60 hours</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                                    <div className="bg-blue-600 h-2 rounded-full w-[75%]"></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="z-10 flex-shrink-0">
                                <div
                                    className="bg-gray-300 rounded-full h-10 w-10 flex items-center justify-center text-gray-500">
                                    <span className="material-icons">lock</span>
                                </div>
                            </div>
                            <div className="ml-6 flex-grow">
                                <h3 className="font-semibold text-gray-400">Backend &amp; Database</h3>
                                <p className="text-gray-400 text-sm">Node.js, Express, MongoDB for financial data</p>
                                <div className="mt-2 flex items-center space-x-2">
                                    <span
                                        className="bg-gray-200 text-gray-600 text-xs font-semibold px-2.5 py-0.5 rounded-full">Locked</span>
                                    <span className="text-gray-400 text-sm">80 hours</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Skills You Can Learn This Week</h2>
                        <div className="space-y-4">
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                                <div className="flex">
                                    <div className="mr-3">
                                        <span className="material-icons text-yellow-500">lightbulb</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-yellow-800">Reduce Dining Out</p>
                                        <p className="text-sm text-yellow-700 mt-1">You spent 40% more on dining this month. Try
                                            cooking at home to save $200.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                                <div className="flex">
                                    <div className="mr-3">
                                        <span className="material-icons text-green-500">trending_up</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-green-800">Increase Savings</p>
                                        <p className="text-sm text-green-700 mt-1">Based on your income, you could save an
                                            additional $300 monthly.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Recommended Courses</h2>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <img alt="Course icon" className="w-10 h-10 rounded-lg bg-blue-100"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2YXF1HdYv9VZoIGnZSC5Qs4IJvSpipXJDsKuqmib8qyYM866hsQyoz027-7tIV74_gqF1Y26E9JhVfXmuP58wJiOKG8OZCQWdAhupvDa99wcgAtnV3n29E9WrFwak2C1VKK9qWiY-Jk8np4cGst_5Lzelvul43PTfMxQrHfrqF7O69ghOYUcfFDf8wFfuVynzdU6Je4510MY7pPWaUDvLioZWjQJ_ao5a8h8GzA7NvbOm7JpmP1WEK0ynFCWyZZaefXJ1x8QVV9k" />
                                <div>
                                    <h3 className="font-semibold text-sm text-gray-800">Advanced React Patterns</h3>
                                    <p className="text-xs text-gray-500">Udemy • 8 hours</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <img alt="Course icon" className="w-10 h-10 rounded-lg bg-green-100"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiyQ-Vy72oaEwplzKU_zd53uWvduAPjgp0Py-bk65aJA-39d5PAENhoFWHK7WAIeEjIu4cNDShXwbLSpJFlLZoVWtuWJC_IMKaGCJl8hEK62TnYMmJOurIaTOlM09mQ7ViqMssLmyYfyK6kh2aIum5N4U4sXRpjCFVQidcIr1X4O2M81_6g_NovwQTSdyiiDTIBW9AxaSCX6GO_e8xZokDZ_lGz8sabOM_f8cFPdaj74PXEBicsMeDfEcl84brJU809TKZ4rGXbN0" />
                                <div>
                                    <h3 className="font-semibold text-sm text-gray-800">Node.js for Finance Apps</h3>
                                    <p className="text-xs text-gray-500">Coursera • 24 hours</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">AI Project Idea Generator</h2>
                <p className="text-gray-600 mb-6">Describe your learning goals and get personalized project suggestions that
                    align with market demands.</p>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2" for="ai-prompt">Tell AI about your goals,
                        interests, or skills you want to develop:</label>
                    <div className="relative">
                        <textarea
                            className="w-full p-4 pr-20 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            id="ai-prompt"
                            placeholder="Example: I want to build a fintech application that helps users track expenses and provides AI-powered savings recommendations. I'm familiar with React but need to learn backend development..."
                            rows="3"></textarea>
                    </div>
                </div>
                <button
                    className="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-700 flex items-center space-x-2">
                    <span className="material-icons">auto_awesome</span>
                    <span>Generate Project Ideas</span>
                </button>


                <h2 className="text-xl font-bold text-gray-800 mt-10">AI-Suggested Projects</h2>
                <div className="bg-white p-8 rounded-xl shadow-md border border-green-300 mt-5">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">Smart Budget Tracker with AI Insights</h3>
                            <p className="text-sm text-gray-500">Perfect for: <span className="font-medium text-indigo-600">Frontend
                                + Backend + AI Integration</span></p>
                        </div>
                        <span
                            className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">Recommended</span>
                    </div>
                    <p className="text-gray-600 mb-6">Build a comprehensive financial tracking application that categorizes
                        expenses automatically and provides AI-powered savings recommendations based on spending patterns.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div>
                            <h4 className="text-sm font-semibold text-gray-500 mb-2">Tech Stack</h4>
                            <div className="flex flex-wrap gap-2">
                                <span
                                    className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">React.js</span>
                                <span
                                    className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Node.js</span>
                                <span
                                    className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">MongoDB</span>
                                <span
                                    className="bg-pink-100 text-pink-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Chart.js</span>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-500 mb-2">Duration</h4>
                            <p className="text-gray-800 font-medium">6-8 weeks</p>
                            <p className="text-xs text-gray-500">~40 hours total</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-500 mb-2">Complexity</h4>
                            <div className="flex items-center">
                                <span className="material-icons text-yellow-500 text-base">star</span>
                                <span className="material-icons text-yellow-500 text-base">star</span>
                                <span className="material-icons text-yellow-500 text-base">star</span>
                                <span className="material-icons text-gray-300 text-base">star_border</span>
                                <span className="material-icons text-gray-300 text-base">star_border</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Intermediate</p>
                        </div>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg mb-6">
                        <h4 className="font-semibold text-gray-800 mb-2">Why This Project?</h4>
                        <p className="text-sm text-gray-600">This project combines essential fintech skills: data visualization,
                            user authentication, API integration, and machine learning basics. It directly addresses real
                            market needs in personal finance management and showcases your ability to build full-stack
                            applications with AI features.</p>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1"><span
                                className="material-icons text-green-500 text-base">check_circle</span> <span>Portfolio
                                    Ready</span></div>
                            <div className="flex items-center space-x-1"><span
                                className="material-icons text-green-500 text-base">check_circle</span> <span>Job Market
                                    Aligned</span></div>
                            <div className="flex items-center space-x-1"><span
                                className="material-icons text-green-500 text-base">check_circle</span> <span>Skill
                                    Building</span></div>
                        </div>
                        <button
                            className="bg-indigo-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-indigo-700">Start
                            Project</button>
                    </div>
                </div>
            </div>

        </div>

    )
}

export default CareerDashboard