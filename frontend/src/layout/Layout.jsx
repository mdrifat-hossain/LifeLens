"use client";

import { useState, useEffect } from "react";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { UserButton } from "@clerk/clerk-react";
import { Outlet, Link, Navigate } from "react-router-dom";
import ChatWidget from "../pages/chat/ChatWidget";
import { useTheme } from "./useTheme";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

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

    const location = useLocation();

    const navItems = [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Food & Planning", path: "/meal-plan" },
        { name: "Manage Day", path: "/manage-day" },
        { name: "Finance", path: "/financial-dashboard" },
        { name: "Career", path: "/career-path" },
        { name: "Email", path: "/email" },
    ];

    return (
        <div className="app-layout bg-light-background dark:bg-dark-background">
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

                {/* Navigation */}
                <div className="flex flex-1 justify-end gap-8 items-center">
                    <SignedIn>
                        <nav className="relative flex items-center gap-9 text-sm font-medium text-gray-800 dark:text-gray-200">
                            {navItems.map((item) => {
                                // Normalize path to remove trailing slash
                                const basePath = item.path.replace(/\/$/, "");

                                // Active when current path starts with the base path and the next character is "/" or end of string
                                const isActive =
                                    location.pathname === basePath ||
                                    location.pathname.startsWith(`${basePath}/`);

                                return (
                                    <div key={item.name} className="relative">
                                        <Link
                                            to={basePath}
                                            className={`px-2 py-1 rounded-md transition-colors duration-200 ${isActive
                                                    ? "text-primary font-extrabold"
                                                    : "hover:bg-green-200 dark:hover:bg-green-800"
                                                }`}
                                        >
                                            {item.name}
                                        </Link>

                                        {isActive && (
                                            <motion.div
                                                layoutId="activeUnderline"
                                                className="absolute left-0 right-0 -bottom-[10px] h-[5px] bg-primary rounded-full"
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            />
                                        )}
                                    </div>
                                );
                            })}

                        </nav>

                        {/* User Button */}
                        <UserButton afterSignOutUrl="/">
                            
                            <UserButton.MenuItems>
                                <UserButton.Action
                                    label="Profile"
                                    onClick={() => setDarkMode((prev) => !prev)}
                                    labelIcon="👤"
                                />
                                <UserButton.Action
                                    label={darkMode ? "Light Mode" : "Dark Mode"}
                                    onClick={() => setDarkMode((prev) => !prev)}
                                    labelIcon={darkMode ? "☀️" : "🌙"}
                                />
                            </UserButton.MenuItems>
                        </UserButton>
                    </SignedIn>
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
