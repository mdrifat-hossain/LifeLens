import React from 'react'
import { useState } from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

import { FaProjectDiagram } from "react-icons/fa";
import { GiPathDistance } from "react-icons/gi";
import { GiHotMeal } from "react-icons/gi";
import { MdLocalGroceryStore } from "react-icons/md";
import { IoTimerSharp } from "react-icons/io5";
import trackerIcon from '../../assets/tracker-icon.png';

const faqs = [
    {
        question: "How does LifeLens personalize my meal plan?",
        answer: "We use your health data, preferences, and pantry items to suggest meals.",
    },
    {
        question: "Can I upload my grocery list?",
        answer: "Not yet, coming soon via image, manual entry, or web scraping.",
    },
    {
        question: "How does the career advisor work?",
        answer: "It analyzes your CV and skills to recommend jobs and learning paths.",
    },
    {
        question: "Is my data secure?",
        answer: "Absolutely. Your privacy is our priority.",
    },
];

export default function LandingPage() {
    const [openIndex, setOpenIndex] = useState(null);
    const [scrolled, setScrolled] = useState(false);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

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
        <body class="bg-emerald-50 text-text-dark font-display">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <header
                    className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled
                            ? "bg-white/50 backdrop-blur-md shadow-md"
                            : "bg-transparent"
                        }`}
                >
                    <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <h1 className="text-2xl font-bold">LifeLens</h1>
                        </div>

                        <nav className="hidden md:flex items-center space-x-8">
                            <a
                                className="text-sm text-text-secondary-dark hover:text-text-dark"
                                href="#"
                            >
                                Features
                            </a>
                            <a
                                className="text-sm text-text-secondary-dark hover:text-text-dark"
                                href="#"
                            >
                                How it works
                            </a>
                            <a
                                className="text-sm text-text-secondary-dark hover:text-text-dark"
                                href="#"
                            >
                                Testimonials
                            </a>
                            <a
                                className="text-sm text-text-secondary-dark hover:text-text-dark"
                                href="#"
                            >
                                FAQ
                            </a>
                        </nav>

                        <div className="flex items-center space-x-4">
                            <Link
                                className="text-sm text-text-secondary-dark hover:text-text-dark hidden md:block"
                                to="/sign-in"
                            >
                                Login
                            </Link>
                            <Link
                                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium"
                                to="/sign-up"
                            >
                                Sign up
                            </Link>
                        </div>
                    </div>
                </header>
                <main>
                    <section className="pt-30">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6">
                                {/* <div className="inline-flex items-center bg-card-dark/50 text-text-secondary-dark text-sm font-medium px-3 py-1 rounded-full">
                                    New Feature: AI-Powered Trading Signals
                                    <span className="material-icons text-sm ml-1">chevron_right</span>
                                </div> */}
                                <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-black dark:text-black">
                                    Live Smarter with <br />
                                    <span className="text-primary">LifeLens</span> : Your AI Companion for Health, Productivity & Growth
                                </h1>
                                <p className="text-lg text-text-secondary-dark max-w-lg">

                                </p>
                                <div className="flex items-center space-x-4 pt-4">
                                    <button className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg flex items-center">
                                        <Link
                                            className=""
                                            to="/sign-in"
                                        >
                                            Get Started with LifeLens
                                        </Link>
                                        <span className="material-icons text-xl ml-2">
                                            arrow_forward
                                        </span>
                                    </button>
                                </div>
                                {/* <div className="flex items-center space-x-12 pt-8">
                                    <div>
                                        <p className="text-3xl font-bold text-white">$2.5B+</p>
                                        <p className="text-text-secondary-dark">Trading Volume</p>
                                    </div>
                                    <div>
                                        <p className="text-3xl font-bold text-white">120K+</p>
                                        <p className="text-text-secondary-dark">Active Traders</p>
                                    </div>
                                    <div>
                                        <p className="text-3xl font-bold text-white">50+</p>
                                        <p className="text-text-secondary-dark">Global Markets</p>
                                    </div>
                                </div> */}
                            </div>
                            <div className="relative w-full max-w-xl mx-auto">
                                {/* Main Image */}
                                <img
                                    alt="Person trading crypto on a laptop"
                                    className="rounded-2xl shadow-2xl w-full"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjPcV7hxh_ylX-qLXaurN2zBBnUNBqENx9dTIFraSQAIqhEZqAWw4ziMQJk3KOElK1HfX0xPkDn5_C8-FR6x7MfX-rdHQj8jyJhEsCMk3GQW6QLwQCMrXkLhiwNjWCTcaTgQVqs58a_poOilAr7plFx7fUmvqxhDokcpQ0kAyx5xmwv9E3ccqOkp3zt3DqQDCB30tIspusXRQUJ06kzcqbMRONnTJlkvRURejjXPjr4xGkvwdC5JtBe3xXY2acyZ-3nOFd2-wBEdk"
                                />

                                {/* Security Level Card - top-left, partially outside */}
                                <div className="absolute -top-8 -left-8 bg-card-dark/80 backdrop-blur-sm p-4 rounded-lg shadow-lg flex items-center space-x-3 max-w-xs">
                                    <div className="p-2 bg-purple-200 rounded-full flex items-center justify-center">
                                        <span className="material-icons text-primary text-lg">security</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-text-secondary-dark"> Data Protection Level</p>
                                        <p className="font-bold text-white">Enterprise</p>
                                    </div>
                                </div>

                                {/* 24h Change Card - bottom-right, partially outside */}
                                <div className="absolute -bottom-3 -right-3 bg-card-dark/80 backdrop-blur-sm p-4 rounded-lg shadow-lg max-w-xs">
                                    <div className="flex items-center text-green-600 font-bold mt-1">
                                        <p className="text-sm text-text-secondary-dark">Daily Productivity</p>
                                        <span className="material-icons text-lg mr-1">arrow_upward</span>
                                        <p></p>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </section>
                    <section className="py-20">
                        <div className="text-center mb-12">
                            <h3 className="text-4xl font-bold">Powerful Features</h3>
                            <p className="mt-2 text-text-secondary-dark">
                                CryptoFlow gives an unfair advantage in the crypto market for both
                                beginners and professional traders.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="bg-white/50 backdrop-blur-md p-6 rounded-lg shadow-lg">
                                {/* <span className="material-icons text-primary text-3xl">
                                    timeline
                                </span> */}
                                <GiHotMeal className="text-primary text-3xl" />
                                <h4 className="font-bold text-xl mt-4"> Meal Plan Assistant</h4>
                                <p className="text-text-secondary-dark mt-2">
                                    Suggests daily meals based on health, preferences, and available ingredients
                                </p>
                            </div>
                            <div className="bg-white/50 backdrop-blur-md p-6 rounded-lg shadow-lg">
                                {/* <span className="material-icons text-primary text-3xl">shield</span> */}
                                <MdLocalGroceryStore className="text-primary text-3xl" />
                                <h4 className="font-bold text-xl mt-4">Smart Grocery Planner</h4>
                                <p className="text-text-secondary-dark mt-2">
                                    Builds weekly grocery lists using budget, image uploads, or manual input
                                </p>
                            </div>
                            <div className="bg-white/50 backdrop-blur-md p-6 rounded-lg shadow-lg">
                                {/* <span className="material-icons text-primary text-3xl">bolt</span> */}
                                <IoTimerSharp className="text-primary text-3xl" />
                                <h4 className="font-bold text-xl mt-4"> Time Manager</h4>
                                <p className="text-text-secondary-dark mt-2">
                                    Creates routines and suggests recreational breaks
                                </p>
                            </div>
                            <div className="bg-white/50 backdrop-blur-md p-6 rounded-lg shadow-lg">
                                {/* <span className="material-icons text-primary text-3xl">
                                    pie_chart
                                </span> */}
                                <GiPathDistance className="text-primary text-3xl" />
                                <h4 className="font-bold text-xl mt-4">Career Path Advisor </h4>
                                <p className="text-text-secondary-dark mt-2">
                                    Recommends jobs, internships, and learning paths based on your profile
                                </p>
                            </div>
                            <div className="bg-white/50 backdrop-blur-md p-6 rounded-lg shadow-lg">
                                {/* <span className="material-icons text-primary text-3xl">
                                    notifications
                                </span> */}
                                <FaProjectDiagram className="text-primary text-3xl" />
                                <h4 className="font-bold text-xl mt-4">Project Generator</h4>
                                <p className="text-text-secondary-dark mt-2">
                                    Proposes new project ideas based on recently learned skills
                                </p>
                            </div>
                            <div className="bg-white/50 backdrop-blur-md p-6 rounded-lg shadow-lg">
                                {/* <span className="material-icons text-primary text-3xl">
                                    ac_unit
                                </span> */}
                                <img src={trackerIcon} alt="Financial Tracker" className='text-3xl' />
                                <h4 className="font-bold text-xl mt-4">Financial Tracker</h4>
                                <p className="text-gray-700 mt-2">
                                    Analyzes spending and offers saving strategies
                                </p>
                            </div>

                        </div>
                    </section>
                    <section className="py-20">
                        <div className="text-center mb-12">
                            <h3 className="text-4xl font-bold">How It Works</h3>
                            <p className="mt-2 text-text-secondary-dark">
                                Getting started with CryptoFlow is easy. Follow these simple steps
                                to begin your crypto.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-white/50 backdrop-blur-md p-6 rounded-lg shadow-lg">
                                <div className="flex items-center space-x-4">
                                    <span className="text-primary font-bold text-xl">01</span>
                                    <h4 className="font-bold text-xl">Create Your Profile</h4>
                                </div>
                                <p className="text-text-secondary-dark mt-4">
                                    Tell us about your goals, habits, and preferences.

                                </p>
                            </div>
                            <div className="bg-white/50 backdrop-blur-md p-6 rounded-lg shadow-lg">
                                <div className="flex items-center space-x-4">
                                    <span className="text-primary font-bold text-xl">02</span>
                                    <h4 className="font-bold text-xl">Choose Your Focus Areas</h4>
                                </div>
                                <p className="text-text-secondary-dark mt-4">
                                    Select health, productivity, career, or finance—or all of them.


                                </p>
                            </div>
                            <div className="bg-white/50 backdrop-blur-md p-6 rounded-lg shadow-lg">
                                <div className="flex items-center space-x-4">
                                    <span className="text-primary font-bold text-xl">03</span>
                                    <h4 className="font-bold text-xl">Let LifeLens Guide You</h4>
                                </div>
                                <p className="text-text-secondary-dark mt-4">
                                    Get personalized plans, suggestions, and insights every day.
                                </p>
                            </div>
                        </div>
                        <div className="text-center mt-12">
                            <Link
                                className="bg-primary text-white px-6 py-3 rounded-lg font-medium"
                                to="/sign-in"
                            >
                                Get Started with LifeLens
                            </Link>
                            {/* <a
                                className="bg-primary text-white px-6 py-3 rounded-lg font-medium"
                                href="#"
                            >
                                Get Started Now
                            </a> */}
                        </div>
                    </section>
                    <section className="py-20">
                        <div className="text-center mb-12">
                            <h3 className="text-4xl font-bold">What Our Users Say</h3>
                            <p className="mt-2 text-text-secondary-dark">
                                Join thousands of users transforming their lives with LifeLens—your all-in-one AI guide for smarter health, productivity, career, and finances
                            </p>
                        </div>
                        <div className="bg-white/50 backdrop-blur-md p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
                            <div className="flex justify-center mb-4">
                                <span className="material-icons text-yellow-400">star</span>
                                <span className="material-icons text-yellow-400">star</span>
                                <span className="material-icons text-yellow-400">star</span>
                                <span className="material-icons text-yellow-400">star</span>
                                <span className="material-icons text-yellow-400">star</span>
                            </div>
                            <p className="text-xl italic">
                                “LifeLens helped me balance my studies, eat healthier, and land a remote internship—all with one dashboard.”


                            </p>
                            <div className="mt-6 flex items-center justify-center space-x-3">
                                <img
                                    alt="Profile picture of Sarah Johnson"
                                    className="w-12 h-12 rounded-full"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLq4Gluj56kRW1tf_gkZ8vnCZ64DGzMEn9pwlOMWiSrOSEMRzIY5QvxXoDHOOXSiLY4InFs5TDQxtDweIPXs5nBUQ3j8CBbNAJ_AI_bfaSrskH7eXVppHdzp8Fp0uTq2XJbnNwHakwDo9QAeCS13fmYK3ktRiyClzOOqEVzCHewffJuaED46phHAzSoZJoLpM_CtlVeWvYtb58aUmOBaXoKG0MgIJjaz4pAOkFOTbJfZayIo0IT2Q0yrFRPInOkZMX472v8pktm7g"
                                />
                                <div>
                                    <p className="font-semibold">Sarah Johnson</p>
                                    <p className="text-sm text-text-secondary-dark">
                                        Aarav, Student & Aspiring Data Analyst
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center space-x-2 mt-8">
                            <button className="w-2 h-2 rounded-full bg-gray-600" />
                            <button className="w-2 h-2 rounded-full bg-primary" />
                            <button className="w-2 h-2 rounded-full bg-gray-600" />
                        </div>
                    </section>
                    {/* <section className="py-20">
                        <div className="text-center mb-12">
                            <h3 className="text-4xl font-bold">Simple, Transparent Pricing</h3>
                            <p className="mt-2 text-text-secondary-dark">
                                Choose the best plan that fits your needs. We offer flexible pricing
                                for our crypto trading platform.
                            </p>
                            <div className="mt-6 inline-flex bg-card-dark p-1 rounded-lg space-x-2">
                                <button className="px-4 py-1 rounded text-sm text-white bg-gray-700">
                                    Monthly
                                </button>
                                <button className="px-4 py-1 rounded text-sm text-text-secondary-dark">
                                    Annual (save 15%)
                                </button>
                            </div>
                        </div>
                        <div className="grid lg:grid-cols-3 gap-8 items-start">
                            <div className="bg-card-dark p-8 rounded-lg border border-gray-700">
                                <h4 className="font-bold text-xl">Basic</h4>
                                <p className="text-4xl font-bold mt-4">
                                    $0
                                    <span className="text-lg font-normal text-text-secondary-dark">
                                        /month
                                    </span>
                                </p>
                                <p className="text-text-secondary-dark mt-2">
                                    Perfect for beginners getting started with crypto.
                                </p>
                                <button className="w-full bg-gray-700 text-white py-3 rounded-lg mt-6 font-medium">
                                    Get started
                                </button>
                                <ul className="mt-6 space-y-3 text-sm">
                                    <li className="flex items-center">
                                        <span className="material-icons text-green-500 mr-2">
                                            check_circle
                                        </span>
                                        What's included:
                                    </li>
                                    <li className="flex items-center">
                                        <span className="material-icons text-green-500 mr-2">
                                            check
                                        </span>
                                        Secure crypto wallet
                                    </li>
                                    <li className="flex items-center">
                                        <span className="material-icons text-green-500 mr-2">
                                            check
                                        </span>
                                        Lowest fees on the market
                                    </li>
                                    <li className="flex items-center">
                                        <span className="material-icons text-green-500 mr-2">
                                            check
                                        </span>
                                        Real-time price charts
                                    </li>
                                    <li className="flex items-center">
                                        <span className="material-icons text-green-500 mr-2">
                                            check
                                        </span>
                                        Basic support
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-card-dark p-8 rounded-lg border-2 border-primary relative">
                                <span className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                                    Most Popular
                                </span>
                                <h4 className="font-bold text-xl">Pro</h4>
                                <p className="text-4xl font-bold mt-4">
                                    $19
                                    <span className="text-lg font-normal text-text-secondary-dark">
                                        /month
                                    </span>
                                </p>
                                <p className="text-text-secondary-dark mt-2">
                                    Designed for active traders seeking advanced tools and premium
                                    features.
                                </p>
                                <button className="w-full bg-primary text-white py-3 rounded-lg mt-6 font-medium">
                                    Choose Pro
                                </button>
                                <ul className="mt-6 space-y-3 text-sm">
                                    <li className="flex items-center">
                                        <span className="material-icons text-green-500 mr-2">
                                            check_circle
                                        </span>
                                        Everything in Basic, plus:
                                    </li>
                                    <li className="flex items-center">
                                        <span className="material-icons text-green-500 mr-2">
                                            check
                                        </span>
                                        Advanced trading charts
                                    </li>
                                    <li className="flex items-center">
                                        <span className="material-icons text-green-500 mr-2">
                                            check
                                        </span>
                                        Automated trading bots
                                    </li>
                                    <li className="flex items-center">
                                        <span className="material-icons text-green-500 mr-2">
                                            check
                                        </span>
                                        Priority support
                                    </li>
                                    <li className="flex items-center">
                                        <span className="material-icons text-green-500 mr-2">
                                            check
                                        </span>
                                        API access
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-card-dark p-8 rounded-lg border border-gray-700">
                                <h4 className="font-bold text-xl">Enterprise</h4>
                                <p className="text-4xl font-bold mt-4">
                                    $49
                                    <span className="text-lg font-normal text-text-secondary-dark">
                                        /month
                                    </span>
                                </p>
                                <p className="text-text-secondary-dark mt-2">
                                    The ultimate solution for professional traders and institutions.
                                </p>
                                <button className="w-full bg-gray-700 text-white py-3 rounded-lg mt-6 font-medium">
                                    Choose Enterprise
                                </button>
                                <ul className="mt-6 space-y-3 text-sm">
                                    <li className="flex items-center">
                                        <span className="material-icons text-green-500 mr-2">
                                            check_circle
                                        </span>
                                        Everything in Pro, plus:
                                    </li>
                                    <li className="flex items-center">
                                        <span className="material-icons text-green-500 mr-2">
                                            check
                                        </span>
                                        Dedicated account manager
                                    </li>
                                    <li className="flex items-center">
                                        <span className="material-icons text-green-500 mr-2">
                                            check
                                        </span>
                                        Customizable trading interface
                                    </li>
                                    <li className="flex items-center">
                                        <span className="material-icons text-green-500 mr-2">
                                            check
                                        </span>
                                        Institutional-grade security
                                    </li>
                                    <li className="flex items-center">
                                        <span className="material-icons text-green-500 mr-2">
                                            check
                                        </span>
                                        Advanced analytics
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section> */}
                    <section className="py-20">
                        <div className="text-center mb-12">
                            <h3 className="text-4xl font-bold">Frequently Asked Questions</h3>
                            <p className="mt-2 text-text-secondary-dark">
                                Still have questions about LifeLens? We've got answers. If you can't find what you're
                                looking for, feel free to contact our support team.
                            </p>
                        </div>

                        <div className="max-w-3xl mx-auto space-y-4">
                            {faqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className="bg-white/30 backdrop-blur-md rounded-lg shadow-lg overflow-hidden transition-all"
                                >
                                    <button
                                        onClick={() => toggleFAQ(index)}
                                        className="w-full flex justify-between items-center text-left p-6 focus:outline-none"
                                    >
                                        <span className="font-medium">{faq.question}</span>
                                        <span className="material-icons text-text-secondary-dark">
                                            {openIndex === index ? "remove" : "add"}
                                        </span>
                                    </button>
                                    {openIndex === index && (
                                        <div className="px-6 pb-6 text-text-secondary-dark">
                                            <p>{faq.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                    <section className="py-20">
                        <div className="bg-card-dark rounded-lg p-12 text-center">
                            <h3 className="text-4xl font-bold">
                                Ready to transform your daily life with
                                <span className="text-primary"> AI?</span>
                            </h3>
                            <p className="mt-4 text-text-secondary-dark max-w-2xl mx-auto">
                                Join thousands of users already optimizing their health, productivity, career, and finances with LifeLens.


                            </p>
                            <div className="mt-8 flex justify-center space-x-4">
                                <a
                                    className="bg-primary text-white px-6 py-3 rounded-lg font-medium"
                                    href="#"
                                >
                                    Get Started
                                </a>
                                {/* <a
                                    className="bg-gray-700 text-white px-6 py-3 rounded-lg font-medium"
                                    href="#"
                                >
                                    Contact Sales
                                </a> */}
                            </div>
                        </div>
                    </section>
                </main>
                <footer className="py-12 border-t border-gray-800">
                    <div className="grid md:grid-cols-5 gap-8">
                        <div className="md:col-span-2">
                            <div className="flex items-center space-x-2">
                                {/* <span className="material-icons text-primary text-3xl">
                                    water_drop
                                </span> */}
                                <h1 className="text-2xl font-bold"> LifeLens</h1>
                            </div>
                            <p className="mt-4 text-text-secondary-dark">
                                Your personal AI-powered guide to healthier meals, smarter routines, career growth, and financial wellness—all in one place
                            </p>
                        </div>
                        <div>
                            <h5 className="font-semibold">Products</h5>
                            <ul className="mt-4 space-y-2 text-text-secondary-dark text-sm">
                                <li>
                                    <a className="hover:text-white" href="#">
                                        Wallet
                                    </a>
                                </li>
                                <li>
                                    <a className="hover:text-white" href="#">
                                        Exchange
                                    </a>
                                </li>
                                <li>
                                    <a className="hover:text-white" href="#">
                                        API
                                    </a>
                                </li>
                                <li>
                                    <a className="hover:text-white" href="#">
                                        Pricing
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-semibold">Resources</h5>
                            <ul className="mt-4 space-y-2 text-text-secondary-dark text-sm">
                                <li>
                                    <a className="hover:text-white" href="#">
                                        Blog
                                    </a>
                                </li>
                                <li>
                                    <a className="hover:text-white" href="#">
                                        Market Data
                                    </a>
                                </li>
                                <li>
                                    <a className="hover:text-white" href="#">
                                        Help Center
                                    </a>
                                </li>
                                <li>
                                    <a className="hover:text-white" href="#">
                                        Status
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-semibold">Company</h5>
                            <ul className="mt-4 space-y-2 text-text-secondary-dark text-sm">
                                <li>
                                    <a className="hover:text-white" href="#">
                                        About Us
                                    </a>
                                </li>
                                <li>
                                    <a className="hover:text-white" href="#">
                                        Careers
                                    </a>
                                </li>
                                <li>
                                    <a className="hover:text-white" href="#">
                                        Press
                                    </a>
                                </li>
                                <li>
                                    <a className="hover:text-white" href="#">
                                        Legal
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-gray-800 flex justify-between items-center text-sm text-text-secondary-dark">
                        <p>
                            © 2023 CryptoFlow Inc. All rights reserved. Distributed by
                            <a className="text-primary" href="#">
                                ThemeWagon
                            </a>
                        </p>
                        <div className="flex space-x-4">
                            <a className="hover:text-white" href="#">
                                Terms of Service
                            </a>
                            <a className="hover:text-white" href="#">
                                Privacy Policy
                            </a>
                            <a className="hover:text-white" href="#">
                                Cookie Policy
                            </a>
                        </div>
                    </div>
                </footer>
            </div>
            <button className="fixed bottom-4 right-4 bg-primary text-white p-3 rounded-full shadow-lg">
                <span className="material-icons">chat</span>
            </button>
        </body>

    )
}
