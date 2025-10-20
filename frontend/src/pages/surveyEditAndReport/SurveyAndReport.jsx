import React from 'react'
import { useNavigate, Outlet } from "react-router-dom";
import { FaAngleDown } from "react-icons/fa";
import { useApi } from "../../utils/api";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function SurveyAndReport() {
    const { makeRequest } = useApi();
    const navigate = useNavigate();
    const [subject, setSubject] = useState("");
    const [section, setSection] = useState("Chatbot");
    const [description, setDescription] = useState("");
    const [reports, setReports] = useState([]);

    // Fetch user reports
    useEffect(() => {
        const fetchReports = async () => {
            try {
                const data = await makeRequest("my-reports", { method: "GET" });
                console.log(data);
                // Access the array inside `data.reports`
                setReports(Array.isArray(data.reports) ? data.reports : []);
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch reports");
            }
        };


        fetchReports();
    }, []);

    // Submit report
    const handleSubmit = async () => {
        if (!subject || !section || !description) {
            toast.error("Please fill all fields");
            return;
        }

        try {
            console.log(subject);
            // Submit the report
            await makeRequest("submit-report", {
                method: "POST",
                body: JSON.stringify({ subject, section, description }),
            });

            toast.success("Report submitted!");

            // Reset form fields
            setSubject("");
            setSection("Survey A");
            setDescription("");

            // Refresh reports
            const data = await makeRequest("my-reports", { method: "GET" });
            setReports(Array.isArray(data) ? data : []); // Ensure array
        } catch (err) {
            console.error(err);
            toast.error("Failed to submit report");
        }
    };

    const handleDelete = async (reportId) => {
        if (!window.confirm("Are you sure you want to delete this report?")) return;

        try {
            await makeRequest(`delete-report/${reportId}`, {
                method: "DELETE",
            });
            toast.success("Report deleted successfully");
            // Remove from local state
            setReports((prev) => prev.filter((r) => r.report_id !== reportId));
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete report");
        }
    };


    return (
        <div
            class="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden"
        >
            <ToastContainer />
            <div class="layout-container flex h-full grow flex-col">
                <main class="flex-1 px-4 sm:px-6 lg:px-10 py-8">
                    <div class="max-w-7xl mx-auto">
                        <div class="flex flex-wrap justify-between gap-3 p-4 mb-8">
                            <div class="flex min-w-72 flex-col gap-3">
                                <p
                                    class="text-4xl font-black leading-tight tracking-[-0.033em] text-[#111418] dark:text-white"
                                >
                                    Survey Management
                                </p>
                                <p
                                    class="text-base font-normal leading-normal text-[#617589] dark:text-gray-400"
                                >
                                    Edit surveys and report issues to the admin.
                                </p>
                            </div>
                        </div>
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            <div className="bg-white dark:bg-background-dark/30 p-6 rounded-xl shadow-sm">
                                <h2 className="text-2xl font-bold leading-tight tracking-[-0.015em] text-[#111418] dark:text-white mb-6">
                                    Edit Surveys
                                </h2>

                                <div className="flex flex-col gap-4">
                                    <button
                                        // onClick={() => navigate("/survey-report/meal-survey")}
                                        onClick={() => navigate("/meal-survey")}
                                        className="flex w-full min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-5 bg-primary text-white text-lg font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors"
                                    >
                                        <span className="truncate">Edit Meal Survey</span>
                                    </button>

                                    <button
                                        // onClick={() => navigate("/survey-report/career-survey")}
                                        onClick={() => navigate("/career-survey")}
                                        className="flex w-full min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-5 bg-primary text-white text-lg font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors"
                                    >
                                        <span className="truncate">Edit Career Survey</span>
                                    </button>
                                </div>
                                {/* <div className="mt-8">
                                    <Outlet />
                                </div> */}
                            </div>
                            <div class="flex flex-col gap-8">
                                <div
                                    class="bg-white dark:bg-background-dark/30 p-6 rounded-xl shadow-sm"
                                >
                                    <h2
                                        class="text-2xl font-bold leading-tight tracking-[-0.015em] text-[#111418] dark:text-white mb-4"
                                    >
                                        Report to Admin
                                    </h2>
                                    <p class="text-sm text-[#617589] dark:text-gray-400 mb-4">
                                        Please provide a detailed description of the issue you are
                                        encountering. We will get back to you as soon as possible.
                                    </p>
                                    <div className="flex flex-col gap-4">
                                        <input
                                            type="text"
                                            placeholder="Subject"
                                            className="w-full h-12 px-3 bg-[#f0f2f4] dark:bg-background-dark/50 rounded-lg"
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                        />
                                        <div className="relative w-full">
                                            <select
                                                className="w-full h-12 px-3 bg-[#f0f2f4] dark:bg-background-dark/50 rounded-lg appearance-none"
                                                value={section}
                                                onChange={(e) => setSection(e.target.value)}
                                            >
                                                <option>Chatbot</option>
                                                <option>Meal & Grocery Planning</option>
                                                <option>Time & Productivity Management</option>
                                                <option>Career & Learning Path Advisor</option>
                                                <option>Financial Assistance & Budget Planner</option>
                                                <option>Survey</option>
                                                <option>Others</option>
                                            </select>
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <FaAngleDown />
                                            </span>
                                        </div>
                                        <textarea
                                            placeholder="Please describe the issue..."
                                            className="w-full h-32 p-3 bg-[#f0f2f4] dark:bg-background-dark/50 rounded-lg"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                        <button
                                            onClick={handleSubmit}
                                            className="flex w-full sm:w-auto self-end min-w-[120px] items-center justify-center rounded-lg h-12 px-5 bg-accent text-white"
                                        >
                                            Submit Report
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Past Reports */}
                        <div className="bg-white dark:bg-background-dark/30 p-6 rounded-xl shadow-sm">
                            <h2 className="text-2xl font-bold mb-6 text-[#111418] dark:text-white">
                                Past Reports
                            </h2>

                            {reports.length === 0 ? (
                                <p className="text-sm text-[#617589] dark:text-gray-400">
                                    No report history.
                                </p>
                            ) : (
                                <div className="space-y-6">
                                    {reports.map((report) => (
                                        <div
                                            key={report.report_id}
                                            className={`p-4 rounded-lg border-l-4 ${report.status === "Resolved"
                                                ? "border-green-500"
                                                : report.status === "In Progress"
                                                    ? "border-yellow-500"
                                                    : "border-red-500"
                                                } bg-[#f0f2f4] dark:bg-background-dark/50 relative`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <p className="font-semibold text-sm text-[#111418] dark:text-white">
                                                        Report: "{report.subject}"
                                                    </p>
                                                    <p className="text-xs text-[#617589] dark:text-gray-400">
                                                        Submitted: {new Date(report.submitted_at).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2 items-center">
                                                    <span
                                                        className={`text-xs font-bold py-1 px-3 rounded-full ${report.status === "Resolved"
                                                            ? "bg-green-200 text-green-800"
                                                            : report.status === "In Progress"
                                                                ? "bg-yellow-200 text-yellow-800"
                                                                : "bg-red-200 text-red-800"
                                                            }`}
                                                    >
                                                        {report.status}
                                                    </span>
                                                    {/* Delete button */}
                                                    <button
                                                        onClick={() => handleDelete(report.report_id)}
                                                        className="text-xs font-bold py-1 px-3 rounded bg-red-500 text-white hover:bg-red-600 transition"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Admin Replies */}
                                            {(report.replies || []).map((reply) => (
                                                <div key={reply.reply_id ?? Math.random()} className="border-t pt-2 mt-2">
                                                    <p className="text-sm font-semibold text-accent">Admin Reply:</p>
                                                    <p className="text-sm text-[#111418] dark:text-gray-300">
                                                        {reply.reply_text || "No reply yet"} ({reply.replied_at ? new Date(reply.replied_at).toLocaleString() : ""})
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>


                    </div>
                </main>
            </div>
        </div>
    )
}

export default SurveyAndReport