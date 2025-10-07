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
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion, AnimatePresence } from "framer-motion";
import bg_animation from '../../assets/bg_animation.mp4';


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

const reviews = [
    {
        name: "Sarah Johnson",
        role: "Aarav, Student & Aspiring Data Analyst",
        text: "LifeLens helped me balance my studies, eat healthier, and land a remote internship—all with one dashboard.",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDLq4Gluj56kRW1tf_gkZ8vnCZ64DGzMEn9pwlOMWiSrOSEMRzIY5QvxXoDHOOXSiLY4InFs5TDQxtDweIPXs5nBUQ3j8CBbNAJ_AI_bfaSrskH7eXVppHdzp8Fp0uTq2XJbnNwHakwDo9QAeCS13fmYK3ktRiyClzOOqEVzCHewffJuaED46phHAzSoZJoLpM_CtlVeWvYtb58aUmOBaXoKG0MgIJjaz4pAOkFOTbJfZayIo0IT2Q0yrFRPInOkZMX472v8pktm7g",
    },
    {
        name: "John Smith",
        role: "Software Engineer",
        text: "LifeLens is a game changer! It keeps me productive, healthy, and focused on my career goals every single day.",
        img: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
        name: "Emily Davis",
        role: "Freelance Designer",
        text: "I love how LifeLens tracks everything from meals to finances. I finally feel in control of my life.",
        img: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
        name: "Michael Lee",
        role: "Entrepreneur",
        text: "The insights I get daily from LifeLens help me make smarter decisions both personally and professionally.",
        img: "https://randomuser.me/api/portraits/men/65.jpg",
    },
];

const headline = "Live Smarter with LifeLens : Your AI Companion for Health, Productivity & Growth";

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

    const [current, setCurrent] = useState(0);

    // Automatically cycle reviews every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % reviews.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const [displayedText, setDisplayedText] = useState("");
    const [aiHighlight, setAiHighlight] = useState(false);

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            const nextChar = headline[i];
            setDisplayedText((prev) => prev + nextChar);

            // Trigger AI effect when "AI" is typed
            if (headline.slice(i - 1, i + 1) === "AI") {
                setAiHighlight(true);
                setTimeout(() => setAiHighlight(false), 500); // pulse for 0.5s
            }

            i++;
            if (i >= headline.length) clearInterval(interval);
        }, 60); // typing speed
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const video = document.getElementById("bgVideo");
        if (video) video.playbackRate = 0.15; // Slow down to 0.25x speed
    }, []);

    return (
        <body class="bg-emerald-50 text-text-dark font-display relative overflow-x-hidden">
            {/* Background Video Layer */}
            {/* <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
                <video
                    id="bgVideo"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                    style={{
                        opacity: 0.25, 
                        filter: "brightness(0.6) contrast(0.8) saturate(0.6) blur(1px)",
                        transform: "scale(1.05)",
                        mixBlendMode: "overlay",
                    }}
                >
                    <source src={bg_animation} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                <div className="absolute inset-0 bg-emerald-50/50"></div>
            </div> */}

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-20">
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
                                    {displayedText.split("AI").map((part, index, arr) => (
                                        <span key={index}>
                                            {part}
                                            {index < arr.length - 1 && (
                                                <motion.span
                                                    className="text-primary"
                                                    animate={aiHighlight ? { scale: [1, 1.5, 1] } : {}}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    AI
                                                </motion.span>
                                            )}
                                        </span>
                                    ))}
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
                                {/* <img
                                    alt="Person trading crypto on a laptop"
                                    className="rounded-2xl shadow-2xl w-full"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjPcV7hxh_ylX-qLXaurN2zBBnUNBqENx9dTIFraSQAIqhEZqAWw4ziMQJk3KOElK1HfX0xPkDn5_C8-FR6x7MfX-rdHQj8jyJhEsCMk3GQW6QLwQCMrXkLhiwNjWCTcaTgQVqs58a_poOilAr7plFx7fUmvqxhDokcpQ0kAyx5xmwv9E3ccqOkp3zt3DqQDCB30tIspusXRQUJ06kzcqbMRONnTJlkvRURejjXPjr4xGkvwdC5JtBe3xXY2acyZ-3nOFd2-wBEdk"
                                /> */}
                                <DotLottieReact
                                    className="rounded-2xl shadow-2xl w-full"
                                    src="https://lottie.host/2196a326-5692-41e9-bc35-23627c3defc0/3cfGLUuZtg.lottie"
                                    loop
                                    autoplay
                                />


                            </div>


                        </div>
                    </section>
                    {/* Security Level Card - top-left, partially outside */}
                    {/* <div className="absolute -top-8 -left-8 bg-card-dark/80 backdrop-blur-sm p-4 rounded-lg shadow-lg flex items-center space-x-3 max-w-xs">
                                    <div className="p-2 bg-purple-200 rounded-full flex items-center justify-center">
                                        <span className="material-icons text-primary text-lg">security</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-text-secondary-dark"> Data Protection Level</p>
                                        <p className="font-bold text-white">Enterprise</p>
                                    </div>
                                </div> */}

                    {/* 24h Change Card - bottom-right, partially outside */}
                    {/* <div className="absolute -bottom-3 -right-3 bg-card-dark/80 backdrop-blur-sm p-4 rounded-lg shadow-lg max-w-xs">
                                    <div className="flex items-center text-green-600 font-bold mt-1">
                                        <p className="text-sm text-text-secondary-dark">Daily Productivity</p>
                                        <span className="material-icons text-lg mr-1">arrow_upward</span>
                                        <p></p>
                                    </div>
                                </div> */}
                    <section className="py-20">
                        <div className="text-center mb-12">
                            <h3 className="text-4xl font-bold">Powerful Features</h3>
                            <p className="mt-2 text-text-secondary-dark">
                                CryptoFlow gives an unfair advantage in the crypto market for both
                                beginners and professional traders.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                { Icon: GiHotMeal, title: "Meal Plan Assistant", desc: "Suggests daily meals based on health, preferences, and available ingredients" },
                                { Icon: MdLocalGroceryStore, title: "Smart Grocery Planner", desc: "Builds weekly grocery lists using budget, image uploads, or manual input" },
                                { Icon: IoTimerSharp, title: "Time Manager", desc: "Creates routines and suggests recreational breaks" },
                                { Icon: GiPathDistance, title: "Career Path Advisor", desc: "Recommends jobs, internships, and learning paths based on your profile" },
                                { Icon: FaProjectDiagram, title: "Project Generator", desc: "Proposes new project ideas based on recently learned skills" },
                                { Icon: null, title: "Financial Tracker", desc: "Analyzes spending and offers saving strategies", img: trackerIcon },
                            ].map((feature, index) => (
                                <motion.div
                                    key={index}
                                    className="bg-white/50 backdrop-blur-md p-6 rounded-lg shadow-lg"
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: false, amount: 0.3 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                >
                                    {feature.Icon ? (
                                        <feature.Icon className="text-primary text-3xl" />
                                    ) : (
                                        <img src={feature.img} alt={feature.title} className="w-10 h-10" />
                                    )}
                                    <h4 className="font-bold text-xl mt-4">{feature.title}</h4>
                                    <p className="text-text-secondary-dark mt-2">{feature.desc}</p>
                                </motion.div>
                            ))}
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
                            {[
                                {
                                    number: "01",
                                    title: "Create Your Profile",
                                    desc: "Tell us about your goals, habits, and preferences.",
                                },
                                {
                                    number: "02",
                                    title: "Choose Your Focus Areas",
                                    desc: "Select health, productivity, career, or finance—or all of them.",
                                },
                                {
                                    number: "03",
                                    title: "Let LifeLens Guide You",
                                    desc: "Get personalized plans, suggestions, and insights every day.",
                                },
                            ].map((step, index) => (
                                <motion.div
                                    key={index}
                                    className="bg-white/50 backdrop-blur-md p-6 rounded-lg shadow-lg"
                                    initial={{ opacity: 0, y: 60 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    // viewport={{ once: true, amount: 0.3 }}
                                    viewport={{ once: false, amount: 0.3 }}
                                    transition={{ duration: 0.6, delay: index * 0.2 }}
                                >
                                    <div className="flex items-center space-x-4">
                                        <span className="text-primary font-bold text-xl">{step.number}</span>
                                        <h4 className="font-bold text-xl">{step.title}</h4>
                                    </div>
                                    <p className="text-text-secondary-dark mt-4">{step.desc}</p>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            className="text-center mt-12"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            // viewport={{ once: true }}
                            viewport={{ once: false }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                        >
                            <Link
                                className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-shadow"
                                to="/sign-in"
                            >
                                Get Started with LifeLens
                            </Link>
                        </motion.div>
                    </section>

                    <section className="py-20">
                        <div className="text-center mb-12">
                            <h3 className="text-4xl font-bold">What Our Users Say</h3>
                            <p className="mt-2 text-text-secondary-dark">
                                Join thousands of users transforming their lives with LifeLens—your
                                all-in-one AI guide for smarter health, productivity, career, and
                                finances
                            </p>
                        </div>

                        <div className="relative max-w-2xl mx-auto h-64 overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={current}
                                    className="absolute inset-0 bg-white/50 backdrop-blur-md p-6 rounded-lg shadow-lg flex flex-col justify-center items-center text-center"
                                    initial={{ x: 300, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -300, opacity: 0 }}
                                    transition={{ duration: 0.8 }}
                                >
                                    <div className="flex justify-center mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <span
                                                key={i}
                                                className="material-icons text-yellow-400"
                                            >
                                                star
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-xl italic mb-6">{reviews[current].text}</p>
                                    <div className="flex items-center justify-center space-x-3">
                                        <img
                                            src={reviews[current].img}
                                            alt={reviews[current].name}
                                            className="w-12 h-12 rounded-full"
                                        />
                                        <div>
                                            <p className="font-semibold">{reviews[current].name}</p>
                                            <p className="text-sm text-text-secondary-dark">
                                                {reviews[current].role}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Pagination dots */}
                        <div className="flex justify-center space-x-2 mt-8">
                            {reviews.map((_, index) => (
                                <button
                                    key={index}
                                    className={`w-2 h-2 rounded-full ${index === current ? "bg-primary" : "bg-gray-600"
                                        }`}
                                />
                            ))}
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
                                <motion.div
                                    key={index}
                                    className="bg-white/30 backdrop-blur-md rounded-lg shadow-lg overflow-hidden"
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    viewport={{ once: false, amount: 0.3 }}
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
                                </motion.div>
                            ))}
                        </div>

                    </section>
                    <motion.section
                        className="py-20"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: false, amount: 0.3 }}
                    >
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
                                    className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-shadow"
                                    href="#"
                                >
                                    Get Started
                                </a>
                            </div>
                        </div>
                    </motion.section>

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
