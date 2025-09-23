import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

// Register chart components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

function SkillTrend() {
    // Salary Chart data & options
    const salaryData = {
        labels: ["Entry Level", "Mid Level", "Senior Level", "Lead Level"],
        datasets: [
            {
                label: "Minimum",
                data: [70, 90, 115, 175],
                backgroundColor: "#F87171",
                borderRadius: 8,
            },
            {
                label: "Median",
                data: [85, 115, 150, 220],
                backgroundColor: "#60A5FA",
                borderRadius: 8,
            },
            {
                label: "Maximum",
                data: [100, 140, 190, 290],
                backgroundColor: "#4ADE80",
                borderRadius: 8,
            },
        ],
    };

    const salaryOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
        scales: {
            x: {
                grid: { display: false },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value) => value + "K",
                    stepSize: 100,
                },
                title: {
                    display: true,
                    text: "Salary ($)",
                    font: { weight: "bold" },
                },
            },
        },
    };

    // Seasonal Hiring Chart
    const seasonalHiringData = {
        labels: ["Q1", "Q2", "Q3", "Q4"],
        datasets: [
            {
                label: "Software Engineering",
                data: [500, 700, 650, 550],
                borderColor: "#60A5FA",
                backgroundColor: "#60A5FA",
                tension: 0.4,
                fill: false,
            },
            {
                label: "Data Science",
                data: [300, 450, 500, 350],
                borderColor: "#4ADE80",
                backgroundColor: "#4ADE80",
                tension: 0.4,
                fill: false,
            },
        ],
    };

    const seasonalHiringOptions = {
        plugins: {
            legend: {
                position: "bottom",
                align: "start",
                labels: {
                    usePointStyle: true,
                    boxWidth: 8,
                },
            },
        },
        scales: {
            x: {
                grid: { display: false },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Job Postings",
                    font: { weight: "bold" },
                },
            },
        },
    };
    return (
        <div class="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <div class="mb-12">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-800">Market Outlook Overview</h2>
                    <div class="relative">
                        <select
                            class="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-8 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option>Software Engineering</option>
                        </select>
                        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <span class="material-icons text-sm">expand_more</span>
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="bg-green-50 rounded-lg p-6 flex flex-col justify-center">
                        <div class="flex items-center text-green-600 mb-2">
                            <span class="material-icons mr-2">trending_up</span>
                            <span class="font-semibold">Industry Growth</span>
                        </div>
                        <p class="text-4xl font-bold text-green-700">+23.5%</p>
                        <p class="text-sm text-gray-500 mt-1">Annual growth rate</p>
                    </div>
                    <div class="bg-blue-50 rounded-lg p-6 flex flex-col justify-center">
                        <div class="flex items-center text-blue-600 mb-2">
                            <span class="material-icons mr-2">work</span>
                            <span class="font-semibold">Demand Level</span>
                        </div>
                        <p class="text-4xl font-bold text-blue-700">High</p>
                        <p class="text-sm text-gray-500 mt-1">Market demand</p>
                    </div>
                    <div class="bg-purple-50 rounded-lg p-6">
                        <div class="flex items-center text-purple-600 mb-4">
                            <span class="material-icons mr-2">code</span>
                            <span class="font-semibold">Top Skills</span>
                        </div>
                        <div class="flex space-x-2">
                            <span
                                class="bg-purple-100 text-purple-700 text-sm font-medium px-3 py-1 rounded-full">React</span>
                            <span
                                class="bg-purple-100 text-purple-700 text-sm font-medium px-3 py-1 rounded-full">Python</span>
                            <span
                                class="bg-purple-100 text-purple-700 text-sm font-medium px-3 py-1 rounded-full">AWS</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="border-t border-gray-200 pt-8 mb-12"></div>
            <div class="mb-12">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-800">Salary Insights</h2>
                    <div class="flex space-x-4">
                        <div class="relative">
                            <select
                                class="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-8 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option>All Experience</option>
                            </select>
                            <div
                                class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <span class="material-icons text-sm">expand_more</span>
                            </div>
                        </div>
                        <div class="relative">
                            <select
                                class="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-8 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option>All Locations</option>
                            </select>
                            <div
                                class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <span class="material-icons text-sm">expand_more</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex justify-end space-x-4 mb-4 text-sm text-gray-600">
                    <div class="flex items-center"><span class="h-2 w-2 bg-red-400 rounded-full mr-2"></span>Minimum</div>
                    <div class="flex items-center"><span class="h-2 w-2 bg-blue-400 rounded-full mr-2"></span>Median</div>
                    <div class="flex items-center"><span class="h-2 w-2 bg-green-400 rounded-full mr-2"></span>Maximum</div>
                </div>
                <div className="h-80">
                    <Bar data={salaryData} options={salaryOptions} />
                </div>
            </div>
            <div class="border-t border-gray-200 pt-8 mb-12"></div>
            <div class="mb-12">
                <h2 class="text-2xl font-bold text-gray-800 mb-6">Company Hiring Trends</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <ul class="space-y-4">
                            <li class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div class="flex items-center">
                                    <div
                                        class="bg-blue-600 h-10 w-10 flex items-center justify-center rounded-md text-white font-bold text-xl mr-4">
                                        G</div>
                                    <div>
                                        <p class="font-semibold text-gray-800">Company G</p>
                                        <p class="text-sm text-gray-500">156 open positions</p>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <p class="text-green-600 font-semibold">+12%</p>
                                    <p class="text-sm text-gray-500">vs last month</p>
                                </div>
                            </li>
                            <li class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div class="flex items-center">
                                    <img alt="Company A logo" class="h-10 w-10 mr-4"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDC8lptNv3bVeAvC47qSe4znpA6bVYFaeE953OXbrbcYRsihR7JsW7Rkzdby5yITvCnFY9qJL4YgTUwm096oT-f6fSpoywHxJ5RuorYQdyeTrrhyE9BOQQQ2sh2AYGHOutML7mQpd4J-NXDcMwOMCiSsHFtZ5DU2Gy46Oh6wZH-aHbUkbRZv81iZXcp0ZSaZKYEODvcwriUXTsTg9fjATOfdO0xCbYE8ikZZfM0I2vXz4qEAvaKCHWWborpnZHfGlfccXnizT1i8G4" />
                                    <div>
                                        <p class="font-semibold text-gray-800">Company A</p>
                                        <p class="text-sm text-gray-500">89 open positions</p>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <p class="text-green-600 font-semibold">+8%</p>
                                    <p class="text-sm text-gray-500">vs last month</p>
                                </div>
                            </li>
                            <li class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div class="flex items-center">
                                    <img alt="Company M logo" class="h-10 w-10 mr-4"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwdY4718MfLTJIBZLjGXFQUFhebeDl9YNLovDy-ZFfaKHlxNq_K3WX3zIjNdRtlnQ_EDWgRclBkYSsU4t8FT8ZhrLCOTnYNPgWDmzGqK8kFBlfuT-H0lK6WpN46bH9PtvPOOw6z80ITgMY1JqgCDpL0-qDTqSrd2HNmUHXVt4GyjqZyJZA_Xo_-WSxEC5PcIg7_YFxNzmXH3GkM_ShLOrzv3h685L8HjQRbppHXkZSE6iVJodQFQt5UST8a5yJst58bJAw6O_wwJA" />
                                    <div>
                                        <p class="font-semibold text-gray-800">Company M</p>
                                        <p class="text-sm text-gray-500">67 open positions</p>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <p class="text-red-600 font-semibold">-3%</p>
                                    <p class="text-sm text-gray-500">vs last month</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <p className="text-center font-semibold text-gray-700 mb-2">
                            Seasonal Hiring Trends
                        </p>
                        <Line data={seasonalHiringData} options={seasonalHiringOptions} />
                    </div>
                </div>
            </div>
            <div class="border-t border-gray-200 pt-8"></div>
            <div>
                <h2 class="text-2xl font-bold text-gray-800 mb-6">Emerging Trends &amp; Future Skills</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div class="bg-green-50 border border-green-200 p-4 rounded-xl">
                        <div class="flex items-center mb-2">
                            <span class="material-icons text-green-600 mr-2">smart_toy</span>
                            <h4 class="font-semibold text-gray-800">AI Agents in Finance</h4>
                        </div>
                        <p class="text-sm text-gray-600 mb-4">Autonomous financial decision-making systems</p>
                        <div class="flex justify-between items-center text-sm mb-2">
                            <span class="text-gray-500">Time to Maturity: 1-2 years</span>
                            <span class="font-bold text-green-600">+67%</span>
                        </div>
                        <span
                            class="inline-block bg-green-200 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">High
                            Confidence</span>
                    </div>
                    <div class="bg-purple-50 border border-purple-200 p-4 rounded-xl">
                        <div class="flex items-center mb-2">
                            <span class="material-icons text-purple-600 mr-2">lock</span>
                            <h4 class="font-semibold text-gray-800">Quantum-Safe Encryption</h4>
                        </div>
                        <p class="text-sm text-gray-600 mb-4">Post-quantum cryptographic protocols</p>
                        <div class="flex justify-between items-center text-sm mb-2">
                            <span class="text-gray-500">Time to Maturity: 2-3 years</span>
                            <span class="font-bold text-purple-600">+45%</span>
                        </div>
                        <span
                            class="inline-block bg-purple-200 text-purple-800 text-xs font-semibold px-2 py-1 rounded-full">Medium
                            Confidence</span>
                    </div>
                    <div class="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                        <div class="flex items-center mb-2">
                            <span class="material-icons text-blue-600 mr-2">memory</span>
                            <h4 class="font-semibold text-gray-800">Edge AI Computing</h4>
                        </div>
                        <p class="text-sm text-gray-600 mb-4">AI processing at network edges</p>
                        <div class="flex justify-between items-center text-sm mb-2">
                            <span class="text-gray-500">Time to Maturity: 1 year</span>
                            <span class="font-bold text-blue-600">+52%</span>
                        </div>
                        <span
                            class="inline-block bg-blue-200 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">High
                            Confidence</span>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                        <h3 class="flex items-center font-semibold text-gray-700 mb-4">
                            <span class="material-icons text-green-500 mr-2">trending_up</span>
                            Future-Proof Skills (3-5 years)
                        </h3>
                        <div class="space-y-3">
                            <div
                                class="bg-green-50 border border-green-200 p-4 rounded-lg flex items-center justify-between">
                                <div>
                                    <div class="flex items-center mb-1">
                                        <span
                                            class="bg-green-200 font-semibold text-green-800 px-2 py-1 rounded text-xs font-medium mr-2">AI/ML</span>
                                        <span class="font-medium">LangChain</span>
                                    </div>
                                    <p class="text-sm text-gray-600">Certification: LangChain Professional</p>
                                </div>
                                <span class="font-bold text-green-600 text-lg">+45%</span>
                            </div>
                            <div
                                class="bg-green-50 border border-green-200 p-4 rounded-lg flex items-center justify-between">
                                <div>
                                    <div class="flex items-center mb-1">
                                        <span
                                            class="bg-blue-100 font-semibold text-blue-800 px-2 py-1 rounded text-xs font-medium mr-2">Cloud</span>
                                        <span class="font-medium">Serverless Architecture</span>
                                    </div>
                                    <p class="text-sm text-gray-600">Certification: AWS Serverless</p>
                                </div>
                                <span class="font-bold text-green-600 text-lg">+38%</span>
                            </div>
                            <div
                                class="bg-green-50 border border-green-200 p-4 rounded-lg flex items-center justify-between">
                                <div>
                                    <div class="flex items-center mb-1">
                                        <span
                                            class="bg-purple-100 font-semibold text-purple-800 px-2 py-1 rounded text-xs font-medium mr-2">DevOps</span>
                                        <span class="font-medium">MLOps</span>
                                    </div>
                                    <p class="text-sm text-gray-600">Certification: MLOps Engineer</p>
                                </div>
                                <span class="font-bold text-green-600 text-lg">+32%</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 class="flex items-center font-semibold text-gray-700 mb-4">
                            <span class="material-icons text-red-500 mr-2">warning</span>
                            Skill Declining Alerts
                        </h3>
                        <div class="space-y-3">
                            <div class="bg-red-50 border border-red-200 p-4 rounded-lg">
                                <div class="flex justify-between items-start">
                                    <div>
                                        <p class="font-semibold text-gray-800">jQuery</p>
                                        <p class="text-sm text-gray-600 mb-2">Declining in job postings and new projects</p>
                                    </div>
                                    <span class="font-bold text-red-600 text-lg">-35%</span>
                                </div>
                                <span class="text-sm text-gray-600">Consider: <span
                                    class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs mr-2">React</span><span
                                        class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs mr-2">Vue.js</span></span>
                            </div>
                            <div class="bg-red-50 border border-red-200 p-4 rounded-lg">
                                <div class="flex justify-between items-start">
                                    <div>
                                        <p class="font-semibold text-gray-800">Flash</p>
                                        <p class="text-sm text-gray-600 mb-2">Legacy technology being phased out</p>
                                    </div>
                                    <span class="font-bold text-red-600 text-lg">-88%</span>
                                </div>
                                <span class="text-sm text-gray-600">Consider: <span
                                    class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs mr-2">HTML5</span><span
                                        class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs mr-2">WebAssembly</span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            <div class="border-t border-gray-200 pt-8"></div>


            <div class="max-w-7xl mx-auto">
                <div class="bg-violet-50 p-6 rounded-2xl shadow-sm mb-8">
                    <div class="flex items-center mb-6">
                        <span class="material-icons text-violet-600 text-3xl mr-3">auto_awesome</span>
                        <h2 class="text-xl font-bold text-gray-800">Weekly Market Summary</h2>
                    </div>

                    <div class="">
                        <div class="space-y-4">
                            <div class="border rounded-lg">
                                <div class="p-4 flex justify-between items-center cursor-pointer">
                                    <div class="flex items-center">
                                        <span class="material-icons text-blue-500 mr-3">description</span>
                                        <div>
                                            <p class="text-sm text-blue-500">Paper</p>
                                            <h4 class="font-semibold text-gray-800">Autonomous AI Agents in Financial
                                                Services
                                            </h4>
                                        </div>
                                    </div>
                                    <span class="material-icons text-gray-500">expand_more</span>
                                </div>
                                <div class="px-4 pb-4">
                                    <p class="text-sm text-gray-600 mb-3">Published in IEEE Transactions on AI, this paper
                                        explores the implementation of autonomous decision-making systems in financial
                                        trading
                                        and risk management.</p>
                                    <a class="text-sm font-semibold text-blue-600 hover:underline" href="#">View Source</a>
                                </div>
                            </div>
                            <div class="border rounded-lg">
                                <div class="p-4 flex justify-between items-center cursor-pointer">
                                    <div class="flex items-center">
                                        <span class="material-icons text-green-500 mr-3">verified</span>
                                        <div>
                                            <p class="text-sm text-green-500">Patent</p>
                                            <h4 class="font-semibold text-gray-800">Quantum-Resistant Cryptographic Methods
                                            </h4>
                                        </div>
                                    </div>
                                    <span class="material-icons text-gray-500">expand_more</span>
                                </div>
                                <div class="px-4 pb-4">
                                    <p class="text-sm text-gray-600 mb-3">Recent patent filing by IBM covering novel
                                        approaches
                                        to post-quantum cryptography for enterprise applications.</p>
                                    <a class="text-sm font-semibold text-blue-600 hover:underline" href="#">View Patent</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default SkillTrend