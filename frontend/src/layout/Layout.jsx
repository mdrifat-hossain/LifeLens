"use client";

import { useState, useEffect } from "react";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { UserButton } from "@clerk/clerk-react";
import { Outlet, Link, Navigate } from "react-router-dom";
import ChatWidget from "../pages/chat/ChatWidget";
import { useTheme } from "./useTheme";

export function Layout() {
    const { darkMode, setDarkMode } = useTheme();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="app-layout bg-light-background dark:bg-dark-background">
            {/* Header */}
            <header
                className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-3 transition-all duration-300 ${scrolled
                        ? "bg-white/50 dark:bg-dark-background/50 backdrop-blur-md shadow-md border-b border-gray-200 dark:border-gray-800"
                        : "bg-transparent"
                    }`}
            >
                {/* Logo */}
                <div className="flex items-center gap-4">
                    <Link to="/dashboard">
                        <h2 className="text-lg font-bold text-[#111418] dark:text-dark-text">
                            LifeLens
                        </h2>
                    </Link>
                </div>

                {/* Navigation + User */}
                <div className="flex flex-1 justify-end gap-8">
                    <div className="flex items-center gap-9 text-light-text dark:text-dark-text text-sm font-medium leading-normal">
                        <SignedIn>
                            <Link to="/dashboard">Dashboard</Link>
                            <Link to="/meal-plan">Food & Planning</Link>
                            <Link to="/manage-day">Manage Day</Link>
                            <Link to="/financial-dashboard">Finance</Link>
                            <Link to="/career-path">Career</Link>
                            <Link to="/email">Email</Link>

                            {/* User + Theme Toggle in Menu */}
                            <UserButton afterSignOutUrl="/">
                                <UserButton.MenuItems>
                                    <UserButton.Action
                                        label={darkMode ? "Light Mode" : "Dark Mode"}
                                        onClick={() => setDarkMode((prev) => !prev)}
                                        labelIcon={darkMode ? "☀️" : "🌙"}
                                    />
                                </UserButton.MenuItems>
                            </UserButton>
                        </SignedIn>
                    </div>

                    {/* Avatar Placeholder */}
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
