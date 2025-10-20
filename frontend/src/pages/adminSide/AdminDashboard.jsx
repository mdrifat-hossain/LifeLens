import React from 'react'

function AdminDashboard() {
    return (
        <div class="flex h-full min-h-screen">
            <aside class="w-64 bg-[#1c2127] text-white flex flex-col p-4">
                <div class="flex items-center gap-3 mb-8">
                    <div
                        class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                        data-alt="Admin profile picture"
                        style="
              background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBSSmtTZiVVl-tiAoQK0pMhv_8c_Vri8ZNZF73i7R75GDq0Zr47QpfY0KQJI49zuO9SLINrx-6yHUCa36ML1mV3sq2N4CaG8Qes3ALVKoJ9BHJG5Ter9uMr-rOZqaw4yuDdFY1xyHPUNSbWO975rqD3VfT-dhMxLZa7xvFVG_qhcguLUkaUMEd3oVDxwMdKKIRjoxeHDlz8HemoeeMbqQfUlI5SIpC0PQdG4mAoLFfxjxfsj4ELsgq3RcFLq5C6t_4Ex0saaHeE3lY');
            "
                    ></div>
                    <div class="flex flex-col">
                        <h1 class="text-white text-base font-medium leading-normal">
                            Admin Panel
                        </h1>
                        <p class="text-[#9dabb9] text-sm font-normal leading-normal">
                            System Administrator
                        </p>
                    </div>
                </div>
                <nav class="flex flex-col gap-2 flex-1">
                    <a
                        class="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary"
                        href="#"
                    >
                        <span class="material-symbols-outlined">dashboard</span>
                        <p class="text-sm font-medium leading-normal">Dashboard</p>
                    </a>
                    <a
                        class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#283039]"
                        href="#"
                    >
                        <span class="material-symbols-outlined">group</span>
                        <p class="text-sm font-medium leading-normal">Users</p>
                    </a>
                    <a
                        class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#283039]"
                        href="#"
                    >
                        <span class="material-symbols-outlined">flag</span>
                        <p class="text-sm font-medium leading-normal">Reports</p>
                    </a>
                    <a
                        class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#283039]"
                        href="#"
                    >
                        <span class="material-symbols-outlined">campaign</span>
                        <p class="text-sm font-medium leading-normal">Broadcast</p>
                    </a>
                </nav>
                <button
                    class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-danger text-white text-sm font-bold leading-normal tracking-[0.015em] mt-8"
                >
                    <span class="truncate">Logout</span>
                </button>
            </aside>
            <main class="flex-1 p-8">
                <div class="max-w-7xl mx-auto">
                    <div class="flex flex-wrap justify-between gap-3 mb-8">
                        <p
                            class="text-gray-800 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]"
                        >
                            Dashboard
                        </p>
                    </div>
                    <div
                        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8"
                    >
                        <div
                            class="flex flex-col gap-2 p-6 rounded-xl border border-gray-200 dark:border-[#3b4754] bg-white dark:bg-[#1c2127]"
                        >
                            <p class="text-gray-600 dark:text-[#9dabb9] text-sm">
                                Total Users
                            </p>
                            <div class="flex items-baseline gap-2">
                                <p class="text-gray-900 dark:text-white text-4xl font-bold">
                                    12,458
                                </p>
                                <p class="text-success text-sm font-medium">+2.5%</p>
                            </div>
                        </div>
                        <div
                            class="flex flex-col gap-2 p-6 rounded-xl border border-gray-200 dark:border-[#3b4754] bg-white dark:bg-[#1c2127]"
                        >
                            <p class="text-gray-600 dark:text-[#9dabb9] text-sm">
                                Active Users
                            </p>
                            <div class="flex items-baseline gap-2">
                                <p class="text-gray-900 dark:text-white text-4xl font-bold">
                                    9,876
                                </p>
                                <p class="text-success text-sm font-medium">+5.1%</p>
                            </div>
                        </div>
                        <div
                            class="flex flex-col gap-2 p-6 rounded-xl border border-gray-200 dark:border-[#3b4754] bg-white dark:bg-[#1c2127]"
                        >
                            <p class="text-gray-600 dark:text-[#9dabb9] text-sm">New Users</p>
                            <div class="flex items-baseline gap-2">
                                <p class="text-gray-900 dark:text-white text-4xl font-bold">
                                    1,234
                                </p>
                                <p class="text-danger text-sm font-medium">-1.2%</p>
                            </div>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        <div
                            class="flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-[#3b4754] bg-white dark:bg-[#1c2127] p-6"
                        >
                            <div class="flex justify-between items-start">
                                <div>
                                    <p
                                        class="text-gray-800 dark:text-white text-lg font-medium leading-normal"
                                    >
                                        Growth Over Time
                                    </p>
                                    <p class="text-gray-600 dark:text-[#9dabb9] text-sm">
                                        Last 30 Days
                                    </p>
                                </div>
                                <div class="flex gap-2">
                                    <button
                                        class="px-3 py-1 text-xs font-medium rounded-md bg-gray-200 dark:bg-[#283039] text-gray-700 dark:text-white"
                                    >
                                        7D
                                    </button>
                                    <button
                                        class="px-3 py-1 text-xs font-medium rounded-md bg-primary text-white"
                                    >
                                        30D
                                    </button>
                                    <button
                                        class="px-3 py-1 text-xs font-medium rounded-md bg-gray-200 dark:bg-[#283039] text-gray-700 dark:text-white"
                                    >
                                        90D
                                    </button>
                                    <button
                                        class="px-3 py-1 text-xs font-medium rounded-md bg-gray-200 dark:bg-[#283039] text-gray-700 dark:text-white"
                                    >
                                        All
                                    </button>
                                </div>
                            </div>
                            <div class="flex items-baseline gap-2">
                                <p
                                    class="text-gray-900 dark:text-white tracking-tight text-4xl font-bold leading-tight truncate"
                                >
                                    2,458
                                </p>
                                <p class="text-success text-base font-medium leading-normal">
                                    +15%
                                </p>
                            </div>
                            <div class="flex min-h-[250px] flex-1 flex-col gap-8 py-4">
                                <svg
                                    fill="none"
                                    height="100%"
                                    preserveAspectRatio="none"
                                    viewBox="0 0 580 200"
                                    width="100%"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M0 150 C 48.33 150, 48.33 80, 96.67 80 C 145 80, 145 120, 193.33 120 C 241.67 120, 241.67 40, 290 40 C 338.33 40, 338.33 100, 386.67 100 C 435 100, 435 20, 483.33 20 C 531.67 20, 531.67 160, 580 160"
                                        stroke="#3498DB"
                                        stroke-width="3"
                                    ></path>
                                    <path
                                        d="M0 150 C 48.33 150, 48.33 80, 96.67 80 C 145 80, 145 120, 193.33 120 C 241.67 120, 241.67 40, 290 40 C 338.33 40, 338.33 100, 386.67 100 C 435 100, 435 20, 483.33 20 C 531.67 20, 531.67 160, 580 160 V 200 H 0 Z"
                                        fill="url(#chartGradient)"
                                    ></path>
                                    <defs>
                                        <linearGradient
                                            gradientUnits="userSpaceOnUse"
                                            id="chartGradient"
                                            x1="290"
                                            x2="290"
                                            y1="20"
                                            y2="200"
                                        >
                                            <stop stop-color="#3498DB" stop-opacity="0.3"></stop>
                                            <stop
                                                offset="1"
                                                stop-color="#3498DB"
                                                stop-opacity="0"
                                            ></stop>
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                        </div>
                        <div
                            class="flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-[#3b4754] bg-white dark:bg-[#1c2127] p-6"
                        >
                            <p
                                class="text-gray-800 dark:text-white text-lg font-medium leading-normal"
                            >
                                Reports by Features
                            </p>
                            <div
                                class="flex flex-1 items-center justify-center min-h-[300px]"
                            >
                                <div class="relative w-full max-w-xs aspect-square">
                                    <svg
                                        class="w-full h-full"
                                        viewBox="0 0 36 36"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <circle
                                            class="stroke-current text-gray-200 dark:text-gray-700"
                                            cx="18"
                                            cy="18"
                                            fill="none"
                                            r="15.91549430918954"
                                            stroke-width="3.8"
                                        ></circle>
                                        <circle
                                            class="stroke-current text-danger"
                                            cx="18"
                                            cy="18"
                                            fill="none"
                                            r="15.91549430918954"
                                            stroke-dasharray="40, 100"
                                            stroke-dashoffset="25"
                                            stroke-linecap="round"
                                            stroke-width="3.8"
                                        ></circle>
                                        <circle
                                            class="stroke-current text-success"
                                            cx="18"
                                            cy="18"
                                            fill="none"
                                            r="15.91549430918954"
                                            stroke-dasharray="30, 100"
                                            stroke-dashoffset="-15"
                                            stroke-linecap="round"
                                            stroke-width="3.8"
                                        ></circle>
                                        <circle
                                            class="stroke-current text-primary"
                                            cx="18"
                                            cy="18"
                                            fill="none"
                                            r="15.91549430918954"
                                            stroke-dasharray="20, 100"
                                            stroke-dashoffset="-45"
                                            stroke-linecap="round"
                                            stroke-width="3.8"
                                        ></circle>
                                        <circle
                                            class="stroke-current text-yellow-500"
                                            cx="18"
                                            cy="18"
                                            fill="none"
                                            r="15.91549430918954"
                                            stroke-dasharray="10, 100"
                                            stroke-dashoffset="-65"
                                            stroke-linecap="round"
                                            stroke-width="3.8"
                                        ></circle>
                                    </svg>
                                    <div
                                        class="absolute inset-0 flex flex-col items-center justify-center"
                                    >
                                        <p class="text-3xl font-bold text-gray-900 dark:text-white">
                                            125
                                        </p>
                                        <p class="text-sm text-gray-500 dark:text-[#9dabb9]">
                                            Total Reports
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-x-6 gap-y-3">
                                <div class="flex items-center gap-2">
                                    <div class="w-3 h-3 rounded-full bg-danger"></div>
                                    <span class="text-sm text-gray-700 dark:text-gray-300"
                                    >Bug Reports (40%)</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <div class="w-3 h-3 rounded-full bg-success"></div>
                                    <span class="text-sm text-gray-700 dark:text-gray-300"
                                    >Feature Requests (30%)</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <div class="w-3 h-3 rounded-full bg-primary"></div>
                                    <span class="text-sm text-gray-700 dark:text-gray-300"
                                    >UI/UX Feedback (20%)</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <span class="text-sm text-gray-700 dark:text-gray-300"
                                    >Other (10%)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default AdminDashboard