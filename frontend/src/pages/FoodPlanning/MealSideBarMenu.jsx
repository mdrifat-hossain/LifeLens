import React from 'react'
import { Link, useLocation } from 'react-router-dom'

function MealSideBarMenu() {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <>
            {/* Fixed Sidebar */}
            <div className="fixed left-0 top-15 h-full w-[260px] bg-light-background dark:bg-dark-background border-r border-[#f0f2f4] dark:border-secondary/20 p-4 flex flex-col">
                <div className="flex flex-col gap-2">

                    {/* Grocery List */}
                    <Link
                        to="/meal-plan/grocery-list"
                        className={`flex items-center gap-3 px-3 py-3 mb-2 rounded-xl transition-colors
                            ${currentPath === '/meal-plan/grocery-list' || currentPath === '/meal-plan/grocery-list/product-search'
                                ? 'bg-secondary/10 border-l-2 border-primary'
                                : ''
                            }`}
                    >
                        <div className="text-light-text dark:text-dark-text" data-icon="Calendar" data-size="24px" data-weight="regular">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                                <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Zm-96-88v64a8,8,0,0,1-16,0V132.94l-4.42,2.22a8,8,0,0,1-7.16-14.32l16-8A8,8,0,0,1,112,120Zm59.16,30.45L152,176h16a8,8,0,0,1,0,16H136a8,8,0,0,1-6.4-12.8l28.78-38.37A8,8,0,1,0,145.07,132a8,8,0,1,1-13.85-8A24,24,0,0,1,176,136,23.76,23.76,0,0,1,171.16,150.45Z"></path>
                            </svg>
                        </div>
                        <p className="text-light-text dark:text-dark-text text-sm font-medium leading-normal">Grocery List</p>
                    </Link>

                    {/* Meal Plan */}
                    <Link
                        to="/meal-plan"
                        className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors
                            ${currentPath === '/meal-plan'
                                ? 'bg-secondary/10 border-l-2 border-primary'
                                : ''
                            }`}
                    >
                        <div className="text-light-text dark:text-dark-text" data-icon="Calendar" data-size="24px" data-weight="fill">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                                <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM112,184a8,8,0,0,1-16,0V132.94l-4.42,2.22a8,8,0,0,1-7.16-14.32l16-8A8,8,0,0,1,112,120Zm56-8a8,8,0,0,1,0,16H136a8,8,0,0,1-6.4-12.8l28.78-38.37A8,8,0,1,0,145.07,132a8,8,0,1,1-13.85-8A24,24,0,0,1,176,136a23.76,23.76,0,0,1-4.84,14.45L152,176ZM48,80V48H72v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80Z"></path>
                            </svg>
                        </div>
                        <p className="text-light-text dark:text-dark-text text-sm font-medium leading-normal">Meal Plan</p>
                    </Link>

                </div>
            </div>

            {/* Main content placeholder */}
            <div className="ml-[200px] p-4">
                {/* Your main page content goes here */}
            </div>
        </>
    )
}

export default MealSideBarMenu
