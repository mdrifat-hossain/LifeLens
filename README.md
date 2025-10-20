# LifeLens

A complete AI-powered personal decision assistant that integrates meal planning, productivity management, career learning guidance, and financial support — all in one intelligent web platform.

![LifeLens](https://img.shields.io/badge/Project-LifeLens-blue)
![Frontend](https://img.shields.io/badge/Frontend-React.js-orange)
![CSS](https://img.shields.io/badge/Styling-TailwindCSS-purple)
![Backend](https://img.shields.io/badge/Backend-FastAPI-009688)
![Database](https://img.shields.io/badge/Database-MySQL-lightgrey)
![Cache](https://img.shields.io/badge/Cache-Redis-red)
![Containerization](https://img.shields.io/badge/Deployment-Docker-blue)
![AI](https://img.shields.io/badge/AI-Gemini%202.0%20%2B%20LangChain-yellow)
![Testing](https://img.shields.io/badge/Testing-Selenium-blueviolet)
![Authentication](https://img.shields.io/badge/Auth-ClerkAPI-lightblue)


## ✨ Features

- 🔐 **Secure Authentication** — clerk user auth and session handling  
- 🧠 **Central AI Chatbot** — unified conversational assistant for all modules  
- 🍽️ **Meal & Grocery Planner** — personalized meal plans, grocery list generation, ingredient-aware suggestions  
- ⏱️ **Time & Productivity Manager** — routine creator, task prioritization, and smart schedule recommendations  
- 🎓 **Career & Learning Advisor** — learning paths, course suggestions, and project ideas tailored to the user’s profession  
- 💸 **Financial Assistant & Budget Planner** — spending analysis, monthly budgets, and saving goal tracking  
<!-- - 📊 **Progress Analytics** — visualized usage data, streaks, and performance metrics   -->
- 🖼️ **Image Support** — display visuals (e.g., meals, groceries) via Cloudinary integration  
- 🌐 **Responsive UI** — seamless performance across desktop, tablet, and mobile devices  
- 🧩 **Modular Architecture** — easily extendable backend modules (FastAPI) and frontend components (React)  
- 🐳 **Docker Ready** — pre-configured containers for effortless deployment  
- 🛠️ **Admin Dashboard** — manage users, content, and analytics in one place  
- 🔔 **Email** — email check and reply with AI assistant using Gmail API  
<!-- - 🧾 **Data Insights** — AI-powered recommendations from user behavior and activity logs -->


## 🚀 Quick Start

### 🧰 Prerequisites

Before running LifeLens, make sure the following software and tools are installed on your system:

- **Docker Desktop** (Windows/Mac) or **Docker Engine** (Linux) — for running Redis and optional containerized services  
- **Git** — to clone and manage the repository  
- **Node.js v18+** — required for the React frontend  
- **Python 3.10+** — required for the FastAPI backend  
- **MySQL 8.0+** — main relational database for LifeLens  
- **FastAPI** — Python web framework (installed automatically via `requirements.txt`)  
- **Redis** — caching and session management (run via Docker command)  
- **npm** — Node package manager (bundled with Node.js)  
- **Virtual Environment (venv)** — to isolate Python dependencies  
- **Web Browser** — for accessing the frontend interface (Google Chrome recommended)

### Installation Steps
```bash
# 1. Clone the repository
git clone https://github.com/mdrifat-hossain/LifeLens.git
cd LifeLens

# 2. Frontend
cd frontend
npm install
npm run dev

# 2. Backend
#open cmd in \LifeLens directory copy >> paste >> enter
python -m venv my_env 
# Activate virtual environment (Windows)
.venv\Scripts\activate

# Navigate to backend folder
cd backend

# Install dependencies
pip install -r requirements.txt

# Run FastAPI server
python server.py
# Runs API on http://localhost:8000

```

### Manual Docker Setup
```bash
# 1. Install Docker on your PC
#    (Download from: https://www.docker.com/products/docker-desktop/)

# 2. Open CMD or Terminal and pull + run Redis container
docker run -d --name redis -p 6379:6379 redis

# 3. Verify that Redis is running
docker ps
```

## 🛠️ Local Development Setup

## 🔧 Configuration

### Environment Variables


**For Local Development:**
```env
NODE_ENV=development
PORT=3000

# Database (supports auto-detection)
    "host": "localhost",
    "user": "userName",
    "password": "your password",
    "db": "your database name",
    "minsize": 1,
    "maxsize": 5,
    "autocommit": True,  # we'll explicitly commit/rollback
    "charset": "utf8mb4",

```

### Files Structure
```
LifeLens/
├── backend/
│ ├── src/                  # FastAPI source code (routes, models, services)
│ ├── requirements.txt      # Python dependencies
│ ├── server.py             # FastAPI entry point
│ └── init.py
│
├── frontend/
│ ├── node_modules/         # Installed npm dependencies
│ ├── public/               # Static assets
│ ├── src/                  # React components and pages
│ ├── .env                  # Environment configuration
│ ├── .gitignore
│ ├── eslint.config.js      # ESLint configuration
│ ├── index.html            # Entry HTML file
│ ├── package.json          # Frontend dependencies and scripts
│ ├── package-lock.json
│ ├── tailwind.config.js    # Tailwind CSS configuration
│ └── vite.config.js        # Vite build configuration
│
├── .gitignore
└── README.md               # Project documentation
```

## 🎯 Platform Features

### 💡 Core Functionality

- 👤 **User Management System** — Secure user registration, login, and personalized dashboard  
- 🧠 **AI-Powered Decision Assistant** — Central intelligent chatbot that integrates all modules and provides tailored suggestions  
- 🍽️ **Meal Planning & Grocery Management** — Personalized meal recommendations, grocery list generation, and nutrition tracking  
- ⏰ **Productivity & Routine Planner** — Task scheduling, daily routine creation, reminders, and performance tracking  
- 🎓 **Career & Learning Guidance** — Profession-based learning paths, course suggestions, and skill improvement insights  
- 💸 **Financial Management System** — Budget tracking, spending analysis, and smart saving recommendations  
- 📊 **Analytics & Insights** — Visualization of user progress, habits, and AI-driven improvement suggestions  
- 👨‍💼 **Admin Dashboard** — Manage users, monitor platform activity, and update content dynamically  


## Technology Used

### Frontend
- **React.js** + **Tailwind CSS**: Responsive, dynamic, component-based UI.

### Backend
- **FastAPI**: Handles requests, business logic, and AI integration.  
- **Docker**: Containerized backend for consistent deployment.

### APIs
- **LangChain** – Multi-model AI workflows  
- **Gemini 2.0 Flash** – AI reasoning and conversation  
- **Gemini 2.5 Flash Image (Nano Banana)** – Image generation  
- **Sentence-Transformers** – Semantic vector ranking  
- **Clerk API** – Authentication & user sessions  
- **Playwright** – Automated web scraping  
- **Gmail API** – Email notifications  
- **newsdata.io API** – Career/news updates  
- **Cloudinary API** – Image storage & optimization

### Database
- **MySQL** – Structured data management  
- **Redis** – Caching for faster performance

### Testing
- **Selenium** – Frontend testing

### Version Control
- **Git + GitHub** – Main (`main`), Dashboard (`dashboard`), Survey (`survey`) branches

### AI/ML Models
- **Gemini 2.0 Flash** – Core LLM  
- **LangChain** – Multi-step reasoning framework  
- **Sentence-Transformers** – Text recommendation  
- **Gemini 2.5 Flash Image** – Dynamic visual generation

## 🔒 Security & Best Practices

### Common Solutions
```bash
# Port already in use
netstat -tlnp | grep :3000  # Find process using port
sudo kill -9 <PID>          # Kill the process

# Database connection failed
docker-compose restart mysql # Restart MySQL container

# Website not showing updated values after DB connection
# 1. Restart backend server
# 2. Clear Redis cache
# 3. Check MySQL server port
# 4. Ensure all required dependencies and services are installed
```

## 🚧 Future Features

### 📱 Mobile Application Development
- Create a mobile version using **React Native** for instant, on-the-go access.
- Push notifications to keep users updated about meals, tasks, and financial reminders.

### 🗣️ Voice Interaction System
- Support for voice-based commands.
- Hands-free interaction with the AI chatbot for meal suggestions, schedule updates, and learning path advice.

### 🤖 Enhanced AI Recommendations
- Upgrade AI models to analyze user data and behavioral trends.
- Provide real-time, refined recommendations powered by **Gemini** and **LangChain**.

### 💪 Fitness and Health Tracking
- Integrate wearable devices (**Fitbit, Apple Health**, etc.) to gather nutrition and exercise data.
- Generate smart, personalized health and diet advice.

### 🌐 Community and Social Hub
- Launch an interactive community feature for sharing recipes, learning milestones, and financial tips.
- Encourage collaborative progress among users.

### 🎓 Advanced Career Insights
- Incorporate AI-driven career mentorship tools.
- Provide project ideas, skill gap analysis, and personalized growth plans.

### ☁️ Cloud and Scalability Improvements
- Deploy via **Docker** and cloud-native infrastructure.
- Use distributed caching for improved performance, global access, and larger user base support.

## 🎖️ Credits

**LifeLens** – Empowering Smarter Living Through AI! 🌍

**Developed by Team The Trailblazers**  
Department of Computer Science and Engineering  
United International University  

**Team Members:**  
- Md. Rifat Hossain

---

*Built for Software Engineering Laboratory - 9th Trimester*