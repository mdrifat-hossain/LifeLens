import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Outlet, Link, Navigate } from "react-router-dom";
import ChatWidget from '../pages/chat/ChatWidget';

export function Layout() {


    return (
        <div className="app-layout">
            <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f2f4] px-10 py-3 bg-white">
                <div className="flex items-center gap-4 text-[#111418]">
                    <Link to="/">
                        <h2 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em]">
                            LifeLens
                        </h2>
                    </Link>
                </div>
                <div className="flex flex-1 justify-end gap-8">
                    <div className="flex items-center gap-9">
                        <SignedIn>
                            <Link to="/">
                                <div className="text-[#111418] text-sm font-medium leading-normal">
                                    Dashboard
                                </div>
                            </Link>
                            <Link to="/meal-plan">
                                <div className="text-[#111418] text-sm font-medium leading-normal">
                                    Food & Planning
                                </div>
                            </Link>
                            <Link to="/manage-day">
                                <div className="text-[#111418] text-sm font-medium leading-normal">
                                    Manage Day
                                </div>
                            </Link>
                            <Link to="/financial-dashboard">
                                <div className="text-[#111418] text-sm font-medium leading-normal">
                                    Finance
                                </div>
                            </Link>
                            <Link to="/financial-review">
                                <div className="text-[#111418] text-sm font-medium leading-normal">
                                    review
                                </div>
                            </Link>
                            <UserButton />
                        </SignedIn>
                    </div>
                    <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                        style={{ backgroundImage: `url("...your image url...")` }}
                    ></div>
                </div>
            </header>

            {/* Main Content */}
            <main className="app-main pt-16">
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
