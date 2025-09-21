"use client";

import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { UserButton } from "@clerk/clerk-react";
import { Outlet, Link, Navigate } from "react-router-dom";
import ChatWidget from '../pages/chat/ChatWidget';
import { useTheme } from "./useTheme";

export function Layout() {
    const { darkMode, setDarkMode } = useTheme();

    return (
        <div className="app-layout bg-light-background dark:bg-dark-background">
            <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-b-[#f0f2f4] dark:border-b-[#0d3025] px-10 py-3 bg-light-background dark:bg-dark-background shadow-md">
                <div className="flex items-center gap-4">
                    <Link to="/">
                        <h2 className="text-lg font-bold text-[#111418] dark:text-dark-text">
                            LifeLens
                        </h2>
                    </Link>
                </div>

                <div className="flex flex-1 justify-end gap-8">
                    <div className="flex items-center gap-9 text-light-text dark:text-dark-text text-sm font-medium leading-normal">
                        <SignedIn>
                            <Link to="/">Dashboard</Link>
                            <Link to="/meal-plan">Food & Planning</Link>
                            <Link to="/manage-day">Manage Day</Link>
                            <Link to="/financial-dashboard">Finance</Link>
                            <Link to="/financial-review">Review</Link>

                            {/* Option 1: Fixed UserButton with proper Action */}
                            <UserButton afterSignOutUrl="/">
                                <UserButton.MenuItems>
                                    <UserButton.Action
                                        label={darkMode ? "Light Mode" : "Dark Mode"}
                                        onClick={() => setDarkMode((prev) => !prev)}
                                        labelIcon={darkMode ? "☀️" : "🌙"}
                                    />
                                </UserButton.MenuItems>
                            </UserButton>

                            {/* Option 2: Alternative approach with separate theme toggle button */}
                            {/* 
                            <button 
                                onClick={() => setDarkMode((prev) => !prev)}
                                className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
                            </button>
                            <UserButton afterSignOutUrl="/" />
                            */}
                        </SignedIn>
                    </div>

                    <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                        style={{ backgroundImage: `url('...your image url...')` }}
                    ></div>
                </div>
            </header>

            {/* Main Content */}
            <main className="app-main pt-16 bg-light-background dark:bg-dark-background">
                <SignedOut>
                    <Navigate to="/sign-in" replace />
                </SignedOut>
                <SignedIn>
                    <Outlet />
                </SignedIn>
            </main>

            <ChatWidget />
        </div>
    );
}