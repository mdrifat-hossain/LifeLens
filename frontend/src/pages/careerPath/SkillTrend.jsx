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
import { useApi } from "../../utils/api";
import { useAuth } from "@clerk/clerk-react";
import { useTheme } from '../../layout/useTheme';
import { useState, useEffect } from 'react';

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
    const { makeRequest } = useApi();
    const { userId } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { darkMode } = useTheme();
    const [industryData, setIndustryData] = useState(null);
    // const [selectedIndustry, setSelectedIndustry] = useState("Software Engineer");
    const [selectedIndustry, setSelectedIndustry] = useState(null);
    const [news, setNews] = useState([]);
    const [availableIndustries, setAvailableIndustries] = useState([]);

    useEffect(() => {
        industryTrends();
    }, [userId]);

    useEffect(() => {
        if (selectedIndustry) {
            fetchIndustryNews(selectedIndustry);
        }
    }, [selectedIndustry]);

    const industryTrends = async () => {
        if (!userId) return;

        setIsLoading(true);
        setError(null);

        try {
            const res = await makeRequest("get-industry-trends");
            if (res.status === "success") {
                console.log(res.result);
                setIndustryData(res.result.career_insights);
                // Extract available industries from the response
                const industries = Object.keys(res.result.career_insights);
                setAvailableIndustries(industries);
                // Set the first industry as default if available
                if (industries.length > 0 && !selectedIndustry) {
                    setSelectedIndustry(industries[0]);
                }
            } else if (res.status === "empty") {
                setIndustryData(null);
                setAvailableIndustries([]);
            } else {
                setError("Failed to load industry trends.");
            }
        } catch (err) {
            console.error("❌ Error fetching industry trends:", err.message);
            setError("Permission denied or network error.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchIndustryNews = async (careerField) => {
        try {
            // setIsLoading(true);
            const res = await makeRequest(`news?career_field=${encodeURIComponent(careerField)}`);
            if (res.news) {
                setNews(res.news);
            }
        } catch (err) {
            console.error("❌ Error fetching news:", err.message);
            setError("Could not load news.");
        } finally {
            // setIsLoading(false);
        }
    };

    // Get current industry data
    const currentData = industryData?.[selectedIndustry];

    // Salary Chart data & options
    const salaryData = currentData ? {
        labels: currentData.salary_data.labels,
        datasets: [
            {
                label: "Minimum",
                data: currentData.salary_data.datasets.find(d => d.label === "Minimum")?.data || [],
                backgroundColor: "#F87171",
                borderRadius: 8,
            },
            {
                label: "Median",
                data: currentData.salary_data.datasets.find(d => d.label === "Median")?.data || [],
                backgroundColor: "#60A5FA",
                borderRadius: 8,
            },
            {
                label: "Maximum",
                data: currentData.salary_data.datasets.find(d => d.label === "Maximum")?.data || [],
                backgroundColor: "#4ADE80",
                borderRadius: 8,
            },
        ],
    } : null;

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
    const seasonalHiringData = currentData ? {
        labels: currentData.seasonal_hiring_trends.labels,
        datasets: [
            {
                label: currentData.seasonal_hiring_trends.datasets[0].label,
                data: currentData.seasonal_hiring_trends.datasets[0].data,
                borderColor: "#60A5FA",
                backgroundColor: "#60A5FA",
                tension: 0.4,
                fill: false,
            }
        ],
    } : null;

    const seasonalHiringOptions = {
        responsive: true,
        maintainAspectRatio: false,
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

    const industryTrendGenerator = async () => {
        try {
            setIsLoading(true)
            const res = await makeRequest("industry-trend-generator", { method: "POST" });
            if (res.status === "success") {
                console.log(res);
            }
        } catch (err) {
            console.error("❌ Error fetching data:", err.message);
        } finally {
            setIsLoading(false)
        }
    };

    if (isLoading) {
        return (
            // <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-8 flex items-center justify-center min-h-screen">
            //     <div className="text-center">
            //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            //         <p className="text-gray-600">Loading industry trends...</p>
            //     </div>
            // </div>
            <div className="h-[calc(100vh-4rem)] inset-0 flex items-center justify-center bg-light-background dark:bg-dark-background bg-opacity-70 z-10 dark:text-dark-text">
                <l-grid size="60" speed="1.5" color={darkMode ? "white" : "black"} ></l-grid>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-[calc(100vh-4rem)] max-w-7xl mx-auto bg-light-background dark:bg-dark-background rounded-lg shadow-lg p-8">
                <div className="text-center text-red-600">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!currentData) {
        return (
            <div className="flex flex-col items-center justify-center text-center px-6 h-screen">
                <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                    <svg
                        className="w-10 h-10 text-light-text dark:text-dark-text"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-[#111418] dark:text-dark-text mb-2">
                    No Data available
                </h2>
                <p className="text-[#637488] dark:text-[#b4b4b4] mb-4">
                    Click the button to generate Industry Trends.
                </p>
                <button
                    onClick={industryTrendGenerator}
                    disabled={isLoading}
                    className={`px-6 py-2 rounded-lg cursor-pointer font-semibold bg-primary disabled:opacity-50 disabled:cursor-not-allowed text-light-text shadow hover:shadow-lg transition`}
                >
                    {isLoading ? "Generating..." : "Generate Meal Plan"}
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto bg-light-background dark:bg-dark-background rounded-lg shadow-lg p-8">
            {/* Market Outlook Overview */}
            <div className="mb-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-dark-text">Market Outlook Overview</h2>
                    <div className="relative">
                        <select
                            value={selectedIndustry}
                            onChange={(e) => setSelectedIndustry(e.target.value)}
                            className="appearance-none bg-light-background dark:bg-dark-background border border-accent rounded-lg py-2 pl-3 pr-8 text-gray-700 dark:text-dark-text leading-tight focus:outline-none"
                        >
                            {availableIndustries.map((industry) => (
                                <option key={industry} value={industry}>
                                    {industry}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <span className="material-icons text-sm">expand_more</span>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-green-50 rounded-lg p-6 flex flex-col justify-center">
                        <div className="flex items-center text-green-600 mb-2">
                            <span className="material-icons mr-2">trending_up</span>
                            <span className="font-semibold">Industry Growth</span>
                        </div>
                        <p className="text-4xl font-bold text-green-700">{currentData.industry_growth}</p>
                        <p className="text-sm text-gray-500 mt-1">Annual growth rate</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-6 flex flex-col justify-center">
                        <div className="flex items-center text-blue-600 mb-2">
                            <span className="material-icons mr-2">work</span>
                            <span className="font-semibold">Demand Level</span>
                        </div>
                        <p className="text-4xl font-bold text-blue-700">{currentData.demand_level}</p>
                        <p className="text-sm text-gray-500 mt-1">Market demand</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-6">
                        <div className="flex items-center text-purple-600 mb-4">
                            <span className="material-icons mr-2">code</span>
                            <span className="font-semibold">Top Skills</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {currentData.top_skills.slice(0, 3).map((skill, index) => (
                                <span
                                    key={index}
                                    className="bg-purple-100 text-purple-700 text-sm font-medium px-3 py-1 rounded-full"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-primary dark:border-accent pt-8 mb-12"></div>

            {/* Salary Insights */}
            <div className="mb-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-dark-text">Salary Insights</h2>
                </div>
                <div className="flex justify-end space-x-4 mb-4 text-sm text-gray-600 dark:text-dark-text/50">
                    <div className="flex items-center"><span className="h-2 w-2 bg-red-400 rounded-full mr-2"></span>Minimum</div>
                    <div className="flex items-center"><span className="h-2 w-2 bg-blue-400 rounded-full mr-2"></span>Median</div>
                    <div className="flex items-center"><span className="h-2 w-2 bg-green-400 rounded-full mr-2"></span>Maximum</div>
                </div>
                <div className="h-80">
                    {salaryData && <Bar data={salaryData} options={salaryOptions} />}
                </div>
            </div>

            <div className="border-t border-primary dark:border-accent pt-8 mb-12"></div>

            {/* Company Hiring Trends */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-dark-text mb-6">Company Hiring Trends</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <ul className="space-y-4">
                            {currentData.company_hiring_trends.map((company, index) => {
                                const isPositive = company.hiring_rate.startsWith('+');
                                return (
                                    <li key={index} className="flex items-center justify-between p-4 bg-light-background dark:bg-dark-background border border-accent/70 rounded-lg">
                                        <div className="flex items-center">
                                            <div className="bg-blue-600 h-10 w-10 flex items-center justify-center rounded-md text-white font-bold text-xl mr-4">
                                                {company.company.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-light-text dark:text-dark-text">{company.company}</p>
                                                <p className="text-sm text-gray-500">Open positions</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                                {company.hiring_rate}
                                            </p>
                                            <p className="text-sm text-gray-500">vs last month</p>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <div>
                        <p className="text-center font-semibold text-gray-700 dark:text-dark-text/50 mb-2">
                            Seasonal Hiring Trends
                        </p>
                        <div className="h-64">
                            {seasonalHiringData && <Line data={seasonalHiringData} options={seasonalHiringOptions} />}
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-primary dark:border-accent pt-8"></div>

            {/* Emerging Trends & Future Skills */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-dark-text mb-6">Emerging Trends & Future Skills</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {currentData.emerging_trends.map((trend, index) => {
                        const colors = [
                            { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600', badge: 'bg-green-200 text-green-800' },
                            { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600', badge: 'bg-purple-200 text-purple-800' },
                            { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', badge: 'bg-blue-200 text-blue-800' }
                        ];
                        const color = colors[index % colors.length];

                        return (
                            <div key={index} className={`${color.bg} border ${color.border} p-4 rounded-xl`}>
                                <div className="flex items-center mb-2">
                                    <span className={`material-icons ${color.text} mr-2`}>smart_toy</span>
                                    <h4 className="font-semibold text-gray-800">{trend.name}</h4>
                                </div>
                                <p className="text-sm text-gray-600 mb-4">{trend.description}</p>
                                <div className="flex justify-between items-center text-sm mb-2">
                                    <span className="text-gray-500">Time to Maturity: {trend.time_to_maturity}</span>
                                    <span className={`font-bold ${color.text}`}>{trend.growth}</span>
                                </div>
                                <span className={`inline-block ${color.badge} text-xs font-semibold px-2 py-1 rounded-full`}>
                                    {trend.confidence} Confidence
                                </span>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Future-Proof Skills */}
                    <div>
                        <h3 className="flex items-center font-semibold text-gray-700 dark:text-dark-text mb-4">
                            <span className="material-icons text-green-500 mr-2">trending_up</span>
                            Future-Proof Skills (3-5 years)
                        </h3>
                        <div className="space-y-3">
                            {currentData.future_proof_skills.map((skill, index) => (
                                <div key={index} className="bg-green-50 border border-green-200 p-4 rounded-lg flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center mb-1">
                                            <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs font-medium mr-2">
                                                {skill.category}
                                            </span>
                                            <span className="font-medium">{skill.skill}</span>
                                        </div>
                                    </div>
                                    <span className="font-bold text-green-600 text-lg">{skill.growth}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Declining Skills */}
                    <div>
                        <h3 className="flex items-center font-semibold text-gray-700 dark:text-dark-text mb-4">
                            <span className="material-icons text-red-500 mr-2">warning</span>
                            Skill Declining Alerts
                        </h3>
                        <div className="space-y-3">
                            {currentData.declining_skills.map((skill, index) => (
                                <div key={index} className="bg-red-50 border border-red-200 p-4 rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-gray-800">{skill.skill}</p>
                                            <p className="text-sm text-gray-600 mb-2">Declining in demand</p>
                                        </div>
                                        <span className="font-bold text-red-600 text-lg">{skill.decline}</span>
                                    </div>
                                    <span className="text-sm text-gray-600">
                                        Consider: {skill.alternatives.map((alt, i) => (
                                            <span key={i} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs mr-2">
                                                {alt}
                                            </span>
                                        ))}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>


            <div class="border-t border-primary dark:border-accent pt-8"></div>


            <div className="max-w-7xl mx-auto">
                <div className="bg-accent/10 dark:bg-accent/25 p-6 rounded-2xl shadow-lg mb-8">
                    <div className="flex items-center mb-6">
                        <span className="material-icons text-violet-600 text-3xl mr-3">auto_awesome</span>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-dark-text">Daily News</h2>
                    </div>

                    {/* Industry Switcher */}
                    {/* <div className="mb-4 flex gap-3">
                        {availableIndustries.map((industry) => (
                            <button
                                key={industry}
                                className={`px-4 py-2 rounded-lg text-sm font-medium ${selectedIndustry === industry
                                        ? "bg-violet-600 text-white"
                                        : "bg-gray-200 text-gray-700"
                                    }`}
                                onClick={() => setSelectedIndustry(industry)}
                            >
                                {industry}
                            </button>
                        ))}
                    </div> */}

                    {/* News List */}
                    <div className="space-y-4">
                        {isLoading && <p className="text-gray-500">Loading news...</p>}
                        {error && <p className="text-red-500">{error}</p>}
                        {!isLoading && news.length === 0 && <p className="text-gray-500">No news available.</p>}

                        {news.map((article, idx) => (
                            <div key={idx} className="border rounded-lg border-accent">
                                <div className="p-4 flex justify-between items-center cursor-pointer">
                                    <div>
                                        <h4 className="font-semibold text-gray-800 dark:text-dark-text/80">{article.title}</h4>
                                    </div>
                                </div>
                                <div className="px-4 pb-4">
                                    <p className="text-sm text-gray-600 dark:text-dark-text/40 mb-3">
                                        {article.description || "No description available."}
                                    </p>
                                    <a
                                        className="text-sm font-semibold text-primary hover:underline"
                                        href={article.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        View Source
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SkillTrend