import React from 'react'
import { useApi } from "../../utils/api";
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react'
import DayMealCard from '../../pages/FoodPlanning/DayMealCard';


import { MdAccountBalanceWallet } from "react-icons/md";
import { FaArrowUp } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";
import { MdSavings } from "react-icons/md";
import { MdExpandMore } from "react-icons/md";
import { FaLightbulb } from "react-icons/fa";
import { FaArrowTrendUp } from "react-icons/fa6";
import { MdReport } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { toast } from "react-toastify";

function Dashboard() {
  const { makeRequest } = useApi();


  const [metrics, setMetrics] = useState({
    total_balance: 0,
    monthly_income: 0,
    monthly_expenses: 0,
    savings_rate: 0
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      const res = await makeRequest("dashboard-metrics", { method: "GET" });
      setMetrics(res);
      console.log("Fetched metrics:", res);
    };
    fetchMetrics();
  }, []);

  // Routines State
  const [taskChecked, taskSetChecked] = useState(false);
  const [routines, setRoutines] = useState([]);
  const [completed, setCompleted] = useState({}); // <-- here
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [time, setTime] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);


  const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = shortDays[new Date().getDay()];

  // useEffect(() => {
  //     const newCompleted = {};
  //     todaysRoutines.forEach(task => {
  //         newCompleted[task.routine_id] = task.completed; // or false if missing
  //     });
  //     setCompleted(newCompleted);
  // }, [todaysRoutines]);

  // Fetch tasks from DB on mount


  // Update clock every minute
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Task stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const taskCompletion = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Current routine
  // const currentRoutine = routines.find((r) => {
  //   const now = time.getHours() * 60 + time.getMinutes(); // minutes of day
  //   const [startHour, startMin] = r.start_time.split(":").map(Number);
  //   const [endHour, endMin] = r.end_time.split(":").map(Number);

  //   const startMinutes = startHour * 60 + startMin;
  //   const endMinutes = endHour * 60 + endMin;

  //   return now >= startMinutes && now <= endMinutes;
  // });

  // Time left in the day (till midnight)
  const minutesLeft = (24 * 60) - (time.getHours() * 60 + time.getMinutes());
  const hoursLeft = Math.floor(minutesLeft / 60);
  const minsLeft = minutesLeft % 60;


  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await makeRequest("get_tasks", { method: "GET" });
        setTasks(res.tasks || []);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };
    fetchTasks();
  }, []);

  // Add new task

  // const handleAddTask = async () => {
  //   if (!newTask.trim()) return;

  //   try {
  //     const res = await makeRequest("add_task", {
  //       method: "POST",
  //       body: JSON.stringify({ task_name: newTask }),
  //     });
  //     // Add to local state
  //     setTasks((prev) => [...prev, res.task]);
  //     setNewTask("");
  //     setShowForm(false);
  //   } catch (err) {
  //     console.error("Error adding task:", err);
  //   }
  // };


  // Toggle complete
  const handleAddTask = async () => {
    // if (!newTask.trim()) return;
    const trimmedTask = newTask.trim();

    // ✅ Validate empty
    if (!trimmedTask) {
      toast.warning("Please enter a task name.", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
      });
      return;
    }

    // ✅ Validate length
    if (trimmedTask.length > 30) {
      toast.warning("Task name cannot exceed 30 characters.", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
      });
      return;
    }

    try {
      const res = await makeRequest("add_task", {
        method: "POST",
        body: JSON.stringify({ task_name: trimmedTask }),
      });

      // ✅ Update UI
      setTasks((prev) => [...prev, res.task]);
      setNewTask("");
      setShowForm(false);
    } catch (err) {
      console.error("Error adding task:", err);
      toast.error("Failed to add task. Please try again.", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
      });
    }
  };

  const handleToggleComplete = async (taskId) => {
    setTasks(prev =>
      prev.map(task =>
        task.task_id === taskId ? { ...task, completed: !task.completed } : task
      )
    );

    try {
      await makeRequest(`toggle_task/${taskId}`, { method: "PATCH" });
      fetchTodayProgress(); // <-- update progress bar
    } catch (err) {
      console.error("Error toggling task:", err);
    }
  };


  // Remove task
  const handleRemoveTask = async (taskId) => {
    setTasks((prev) => prev.filter((task) => task.task_id !== taskId));
    try {
      await makeRequest(`delete_task/${taskId}`, { method: "DELETE" });
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };


  const colorClasses = {
    purple: "bg-purple-100 text-purple-700",
    pink: "bg-pink-100 text-pink-700",
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    blue: "bg-blue-100 text-blue-700",
    indigo: "bg-indigo-100 text-indigo-700",
  };

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const res = await makeRequest("get_routines", { method: "GET" });
        const routines = res.routines || [];

        setRoutines(routines);

        // Initialize completed state from backend
        const completedMap = {};
        routines.forEach(r => {
          completedMap[r.routine_id] = r.is_completed_today; // <-- use backend value
        });
        setCompleted(completedMap);

      } catch (err) {
        console.error("Error fetching routines:", err);
      }
    };

    fetchRoutines();
  }, []);


  // Current routine
  // Get today's day abbreviation
  const todayAbbr = time.toLocaleDateString("en-US", { weekday: "short" }); // e.g., "Mon", "Tue"

  const currentRoutine = routines.find((r) => {
    // Skip routines not scheduled for today
    if (!r.days.includes(todayAbbr)) return false;

    // Convert times to minutes
    const now = time.getHours() * 60 + time.getMinutes();
    const [startHour, startMin] = r.start_time.split(":").map(Number);
    const [endHour, endMin] = r.end_time.split(":").map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    return now >= startMinutes && now <= endMinutes;
  });

  // group routines by day
  const routinesByDay = dayOrder.reduce((acc, day) => {
    const shortDay = day.slice(0, 3); // "Mon", "Tue", "Sun"
    acc[day] = routines.filter(r => r.days.includes(shortDay));
    return acc;
  }, {});

  const todaysRoutines = routines.filter(r => r.days.includes(today));

  const handleCheckboxChange = (id) => {
    setCompleted((prev) => ({
      ...prev,
      [id]: !prev[id], // toggle completion
    }));
  };

  const [progress, setProgress] = useState(0);
  const [completedRoutines, setCompletedRoutines] = useState(0);
  const [totalRoutines, setTotalRoutines] = useState(0);



  const handleRoutineCheckboxChange = async (routineId) => {
    try {
      // Optimistic UI update
      setCompleted(prev => ({ ...prev, [routineId]: !prev[routineId] }));
      console.log("Toggling routine:", routineId);

      // Make POST request with routine_id in body
      const res = await makeRequest("routines/toggle", {
        method: "POST",
        body: JSON.stringify({ routine_id: routineId }),
      });

      // Update local state with actual DB value
      setCompleted(prev => ({ ...prev, [routineId]: res.is_completed_today }));

      // Refresh today's progress
      fetchTodayProgress();
    } catch (err) {
      console.error("Error toggling routine:", err);
    }
  };


  const fetchTodayProgress = async () => {
    try {
      const res = await makeRequest("get_today_progress", { method: "GET" }); // routines
      const taskRes = tasks; // from local state
      console.log("Today's progress data:", res, taskRes);


      // const totalRoutinesAndTasks = res.total_routines + taskRes.length;
      // const completedRoutinesAndTasks =
      //     res.completed_routines + taskRes.filter(t => t.completed).length;

      // const combinedProgress = totalRoutinesAndTasks > 0
      //     ? (completedRoutinesAndTasks / totalRoutinesAndTasks) * 100
      //     : 0;
      const routineProgress = res.total_routines > 0
        ? (res.completed_routines / res.total_routines) * 100
        : 0;

      setProgress(routineProgress);

      // setProgress(combinedProgress);
      setCompletedRoutines(res.completed_routines);
      setTotalRoutines(res.total_routines);
    } catch (err) {
      console.error("Error fetching today progress:", err);
    }
  };


  useEffect(() => {
    fetchTodayProgress();
  }, []);

  //Routine state end

  // Meals state
  const [todayMeals, setTodayMeals] = useState([]);
  const [checkedMeals, setCheckedMeals] = useState({
    Breakfast: false,
    Lunch: false,
    Dinner: false,
  });

  // Example preferred times (you can later load from DB)
  const preferredTimes = {
    Breakfast: "7:00 AM – 9:00 AM",
    Lunch: "12:30 PM – 2:00 PM",
    Dinner: "7:30 PM – 9:00 PM",
  };

  // ✅ Fetch today’s meals from backend
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await makeRequest("get-today-meals", { method: "GET" });
        const meals = res.data || [];
        console.log("Fetched today's meals:", meals);

        setTodayMeals(meals);

        // ✅ Initialize checkedMeals from backend `is_checked`
        const initialChecked = {
          Breakfast: false,
          Lunch: false,
          Dinner: false,
        };

        meals.forEach(m => {
          const typeCapitalized = m.meal_type.charAt(0).toUpperCase() + m.meal_type.slice(1);
          if (m.is_checked === 1) {
            initialChecked[typeCapitalized] = true;
          }
        });

        setCheckedMeals(initialChecked);

      } catch (err) {
        console.error("Error fetching today's meals:", err);
      }
    };

    fetchMeals();
  }, []);


  // ✅ Helper: check if meal time exceeded
  const isMealTimeExceeded = (mealType) => {
    const now = new Date();
    const endTimes = {
      Breakfast: "09:00",
      Lunch: "14:00",
      Dinner: "21:00",
    };

    const [hour, minute] = endTimes[mealType].split(":").map(Number);
    const endTime = new Date();
    endTime.setHours(hour, minute, 0, 0);

    return now > endTime; // true if time passed
  };

  const handleMealCheckboxChange = async (mealType, mealData) => {
    const alreadyChecked = checkedMeals[mealType];
    const newCheckedState = !alreadyChecked;

    setCheckedMeals((prev) => ({ ...prev, [mealType]: newCheckedState }));

    if (mealData && mealData.ingredients) {
      try {
        let ingredients = [];
        try {
          ingredients = JSON.parse(mealData.ingredients);
        } catch (err) {
          console.error("Invalid ingredient JSON format:", mealData.ingredients);
          return;
        }

        for (const ing of ingredients) {
          const ingredient_name = ing.name;
          const amount = ing.amount_used;

          if (newCheckedState) {
            // ✅ Check → deduct
            console.log(`Deducting ${amount} of ${ingredient_name}`);
            await makeRequest("deduct-ingredient", {
              method: "POST",
              body: JSON.stringify({
                ingredient_name,
                deduct_amount: amount,
                meal_id: mealData.meal_id,
              }),
            });
          } else {
            // ✅ Uncheck → add back
            console.log(`Adding back ${amount} of ${ingredient_name}`);
            await makeRequest("add-ingredient", {
              method: "POST",
              body: JSON.stringify({
                ingredient_name,
                add_amount: amount,
                meal_id: mealData.meal_id,
              }),
            });
          }
        }

        // // ✅ Update is_checked in meal_plan
        // await makeRequest("update-meal-checked", {
        //   method: "POST",
        //   body: JSON.stringify({
        //     meal_id: mealData.meal_id,
        //     is_checked: newCheckedState ? 1 : 0,
        //   }),
        // });

        // console.log(`${mealType} checkbox state updated to ${newCheckedState}`);
      } catch (err) {
        console.error("Error updating meal ingredients:", err);
      }
    }
  };

  // ✅ Handle checkbox (deduct ingredients)
  // const handleMealCheckboxChange = async (mealType, mealData) => {
  //   const alreadyChecked = checkedMeals[mealType];
  //   const newCheckedState = !alreadyChecked;

  //   setCheckedMeals((prev) => ({ ...prev, [mealType]: newCheckedState }));

  //   if (newCheckedState && mealData && mealData.ingredients) {
  //     try {
  //       // 🧩 Step 1: Parse JSON string safely
  //       let ingredients = [];
  //       try {
  //         ingredients = JSON.parse(mealData.ingredients);
  //       } catch (err) {
  //         console.error("Invalid ingredient JSON format:", mealData.ingredients);
  //         return;
  //       }

  //       // 🧩 Step 2: Loop through each ingredient
  //       for (const ing of ingredients) {
  //         const ingredient_name = ing.name;
  //         const deduct_amount = ing.amount_used;

  //         console.log(`Deducting ingredient: ${ingredient_name}, Amount: ${deduct_amount}, Meal ID: ${mealData.meal_id}`);

  //         await makeRequest("deduct-ingredient", {
  //           method: "POST",
  //           body: JSON.stringify({
  //             ingredient_name,
  //             deduct_amount,
  //             meal_id: mealData.meal_id, // <-- pass meal ID to backend
  //           }),
  //         });
  //       }

  //       console.log(`${mealType} ingredients deducted successfully ✅`);
  //     } catch (err) {
  //       console.error("❌ Error deducting ingredients:", err);
  //     }
  //   }
  // };

  // ✅ Handle checkbox (deduct or add back ingredients)
  // const handleMealCheckboxChange = async (mealType, mealData) => {
  //   const alreadyChecked = checkedMeals[mealType];
  //   const newCheckedState = !alreadyChecked;

  //   setCheckedMeals((prev) => ({ ...prev, [mealType]: newCheckedState }));

  //   if (mealData && mealData.ingredients) {
  //     try {
  //       let ingredients = [];
  //       try {
  //         ingredients = JSON.parse(mealData.ingredients);
  //       } catch (err) {
  //         console.error("Invalid ingredient JSON format:", mealData.ingredients);
  //         return;
  //       }

  //       // Send each ingredient individually
  //       for (const ing of ingredients) {
  //         console.log(`Updating ingredient: ${ing.name}, Amount: ${ing.amount_used}, Deduct: ${newCheckedState}`);
  //         await makeRequest("deduct-ingredient", {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json", // very important
  //           },
  //           body: JSON.stringify({
  //             meal_id: mealData.id,
  //             ingredient_name: ing.name.replace(/"/g, ""),
  //             amount_used: ing.amount_used.replace(/"/g, ""),
  //             is_checked: newCheckedState
  //           }),
  //         });

  //       }

  //       console.log(`${mealType} ingredients updated successfully ✅`);
  //     } catch (err) {
  //       console.error("❌ Error updating ingredients:", err);
  //     }
  //   }
  // };



  // Meals state end

  return (
    <div className="max-w-7xl mx-auto mt-5 h-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-light-text dark:text-dark-text">Dashboard</h1>
          <p className="text-gray-500 dark:text-dark-text/50">Welcome back! Here's your financial overview</p>
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-accent p-6 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-black text-md">Total Balance</p>
              <p className="text-2xl font-bold text-dark-text mt-1">
                ৳{(metrics?.total_balance ?? 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-green-100 mt-3 p-2 rounded-lg">
              <MdAccountBalanceWallet className="text-green-500" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-accent p-6 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-black text-md">Monthly Income</p>
              <p className="text-2xl font-bold text-dark-text mt-1">
                ৳{(metrics?.monthly_income ?? 0).toLocaleString()}
              </p>

            </div>
            <div className="bg-blue-100 mt-3 p-2 rounded-lg">
              <FaArrowUp className="text-blue-500" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-accent p-6 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-black text-md">Monthly Expenses</p>
              <p className="text-2xl font-bold text-dark-text mt-1">
                ৳{(metrics?.monthly_expenses ?? 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-red-100 mt-3 p-2 rounded-lg">
              <FaArrowDown className="text-red-500" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-accent p-6 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-black text-md">Savings Goal</p>
              <p className="text-2xl font-bold text-dark-text mt-1">
                {Math.round(metrics?.savings_rate ?? 0)}%
              </p>
            </div>
            <div className="bg-purple-100 mt-3 p-2 rounded-lg">
              <MdSavings className="text-purple-500" size={24} />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-light-background dark:bg-dark-background p-6 rounded-lg shadow-lg border-1 border-accent/50 lg:col-span-1 ">
          <h3 className="font-semibold text-gray-800 dark:text-dark-text">Today's Progress</h3>
          <div className="mt-4 flex items-start space-x-4">
            {/* Left vertical bar */}
            <div className="flex flex-col items-center">
              {/* Top icon */}
              <div className="bg-accent text-white h-10 w-10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 7v5l3 3" />
                </svg>
              </div>

              {/* Vertical progress bar */}
              <div className="w-1 h-48 bg-accent/20 mt-4 rounded-2xl relative">
                <div
                  className="bg-primary rounded-2xl absolute bottom-0 w-1"
                  style={{ height: `${progress}%` }}
                ></div>
              </div>

              {/* Bottom icon */}
              <svg className="mt-4 h-10 w-10 text-gray-800 dark:text-dark-text" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 20a7.966 7.966 0 0 1-5-2v-1c0-2 1.5-3 3-3h4c1.5 0 3 1 3 3v1a7.966 7.966 0 0 1-5 2zM12 7c-2 0-3.5 1.5-3.5 3.5S10 14 12 14s3.5-1.5 3.5-3.5S14 7 12 7z" clipRule="evenodd" />
              </svg>
            </div>

            {/* Right side info */}
            <div className="flex-1">
              {/* Current time */}
              <p className="text-3xl font-bold text-gray-900 dark:text-dark-text">
                {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
              <p className="text-sm text-gray-500 dark:text-dark-text/60">
                {time.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
              </p>

              {/* Task completion */}
              <div className="mt-6">
                <p className="text-center text-3xl font-bold text-accent">
                  {Math.round(progress)}%
                </p>
                <p className="text-center text-sm text-gray-500 dark:text-dark-text/60">Day Complete</p>

                <div className="flex justify-between items-center text-sm mb-1">
                  <p className="text-gray-600 dark:text-dark-text/60">Routines Done</p>
                  <p className="font-medium text-gray-800 dark:text-dark-text/60">
                    {completedRoutines}/{totalRoutines}
                  </p>
                </div>

                {/* Horizontal progress bar */}
                <div className="bg-gray-200 rounded-full h-2 w-full">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>

                {/* Current routine */}
                <div className="mt-6 text-sm text-center">
                  {currentRoutine ? (
                    <p className="text-gray-700 ">
                      Now: <span className="font-medium">{currentRoutine.routine_name}</span> (
                      {currentRoutine.start_time}–{currentRoutine.end_time})
                    </p>
                  ) : (
                    <p className="text-gray-500 dark:text-dark-text/60">No routine right now</p>
                  )}
                  {/* Time left in the day */}
                  <p className="mt-2 text-green-600 dark:text-green-text/60">
                    ⏳ Time left today:{" "}
                    <span className="font-medium">{hoursLeft}h {minsLeft}m</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-light-background dark:bg-dark-background border-1 border-accent/50 p-6 rounded-lg shadow-lg lg:col-span-1">
          <h3 className="font-semibold text-gray-800 dark:text-dark-text">Today's Routine</h3>
          <div className="space-y-4 mt-4">
            {todaysRoutines.length > 0 ? (
              todaysRoutines.map((routine) => {
                const isCompleted = completed[routine.routine_id] || false;

                // ⏰ Parse routine end time (assuming format HH:MM)
                const now = new Date();
                const [endHour, endMinute] = routine.end_time.split(":").map(Number);
                const routineEnd = new Date();
                routineEnd.setHours(endHour, endMinute, 0, 0);

                const isOverdue = now > routineEnd && !isCompleted;

                return (
                  <div
                    key={routine.routine_id}
                    className={`border p-3 rounded-lg flex items-center justify-between 
                                                    ${isCompleted
                        ? "bg-green-50 dark:bg-green-800 border-green-200"
                        : isOverdue
                          ? "bg-red-50 dark:bg-[#b33939] border-red-200"
                          : "bg-gray-50 dark:bg-dark-background border-accent/70"
                      }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="rounded-md p-1">
                        <input
                          type="checkbox"
                          checked={isCompleted}
                          onChange={() => handleRoutineCheckboxChange(routine.routine_id)}
                          className="h-4 w-4 text-green-600 border-green-300 rounded focus:ring-green-500"
                        />

                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-dark-text">
                          {routine.routine_name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-dark-text/60">
                          {routine.start_time} - {routine.end_time}
                        </p>
                      </div>
                    </div>

                    {isCompleted ? (
                      <div className="bg-green-500 text-white h-6 w-6 rounded-full flex items-center justify-center">
                        ✔︎
                      </div>
                    ) : isOverdue ? (
                      <div className="bg-red-500 text-white h-6 w-6 rounded-full flex items-center justify-center">
                        ✖
                      </div>
                    ) : (
                      <div className="bg-white text-white h-6 w-6 rounded-full flex items-center justify-center">
                        ⏳
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 dark:text-dark-text/70">No routines for today 🎉</p>
            )}
          </div>
        </div>

        <div className="space-y-6 lg:col-span-1">
          <div className="bg-light-background dark:bg-dark-background border-1 border-accent/50 p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-black dark:text-dark-text">Today's Tasks</h3>
              <Link to="/manage-day">
                <button
                  className="text-indigo-600 hover:text-indigo-800"
                // onClick={() => setShowForm(!showForm)}
                >
                  ➕
                </button>
              </Link>
            </div>

            {showForm && (
              <div className="flex items-center space-x-2 mt-4">
                <input
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  className="flex-1 p-2 dark:text-dark-text border-1 border-accent/70 rounded focus:outline-none"
                  placeholder="Enter new task..."
                />
                <button
                  onClick={handleAddTask}
                  className="bg-primary text-black px-4 py-2 rounded hover:bg-primary/90 cursor-pointer"
                >
                  Add
                </button>
              </div>
            )}

            <div className="space-y-4 mt-4">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <div
                    key={task.task_id}
                    className="flex items-center justify-between bg-gray-50 dark:bg-accent p-3 rounded"
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleToggleComplete(task.task_id)}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <label
                        className={`text-gray-800 dark:text-dark-text ${task.completed ? "line-through text-gray-500" : ""
                          }`}
                      >
                        {task.task_name}
                      </label>
                    </div>
                    <button
                      onClick={() => handleRemoveTask(task.task_id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      🗑️
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No tasks for today 🎉</p>
              )}
            </div>
          </div>
          <div className="bg-light-background dark:bg-dark-background border-1 border-accent/70 p-6 rounded-lg shadow-lg">
            <h3
              className="font-semibold text-gray-800 dark:text-dark-text flex items-center space-x-2"
            >
              <svg className="w-6 h-6 text-gray-800 dark:text-dark-text" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 9a3 3 0 0 1 3-3m-2 15h4m0-3c0-4.1 4-4.9 4-9A6 6 0 1 0 6 9c0 4 4 5 4 9h4Z" />
              </svg>

              <span>Free Time Suggestions</span>
            </h3>
            <div className="space-y-4 mt-4">
              <div className="bg-white dark:bg-dark-background  border-1 border-primary p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-gray-800 dark:text-dark-text" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.03v13m0-13c-2.819-.831-4.715-1.076-8.029-1.023A.99.99 0 0 0 3 6v11c0 .563.466 1.014 1.03 1.007 3.122-.043 5.018.212 7.97 1.023m0-13c2.819-.831 4.715-1.076 8.029-1.023A.99.99 0 0 1 21 6v11c0 .563-.466 1.014-1.03 1.007-3.122-.043-5.018.212-7.97 1.023" />
                  </svg>


                  <div>
                    <p className="font-medium text-gray-800 dark:text-dark-text">
                      Read for 15 minutes
                    </p>
                    <p className="text-sm text-gray-500 dark:text-dark-text/60">
                      Boost your knowledge and relax your mind
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-dark-background p-4 border-1 border-primary rounded-lg">
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-gray-800 dark:text-dark-text" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 18c0 1.1046-.89543 2-2 2s-2-.8954-2-2 .89543-2 2-2 2 .8954 2 2Zm0 0V6.33333L18 4v11.6667M8 10.3333 18 8m0 8c0 1.1046-.8954 2-2 2s-2-.8954-2-2 .8954-2 2-2 2 .8954 2 2Z" />
                  </svg>

                  <div>
                    <p className="font-medium text-gray-800 dark:text-dark-text">Listen to music</p>
                    <p className="text-sm text-gray-500 dark:text-dark-text/60">
                      Energize yourself with your favorite tunes
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-6 pb-5 px-6 bg-light-background dark:bg-dark-background border-1 border-accent/50 rounded-lg shadow-lg mt-8">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">
          🍽️ Today's Meal Plan
        </h2>

        <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0">
          {["Breakfast", "Lunch", "Dinner"].map((mealType) => {
            const mealData = todayMeals.find(
              (m) => m.meal_type?.toLowerCase() === mealType.toLowerCase()
            );
            const exceeded = isMealTimeExceeded(mealType);

            return (
              <div
                key={mealType}
                className={`flex-1 rounded-2xl shadow-md p-5 border transition-all duration-300
                ${exceeded && !checkedMeals[mealType]
                    ? "border-red-500 bg-red-50 dark:bg-red-900/30"
                    : "bg-white dark:bg-dark-background border-gray-200 dark:border-gray-700"
                  }`}
              >
                <div className="flex justify-between items-center mb-3">
                  <h3
                    className={`text-lg font-bold ${exceeded && !checkedMeals[mealType]
                      ? "text-red-700 dark:text-red-400"
                      : "text-gray-900 dark:text-dark-text"
                      }`}
                  >
                    {mealType}
                  </h3>
                  <p
                    className={`text-sm ${exceeded && !checkedMeals[mealType]
                      ? "text-red-500 dark:text-red-400"
                      : "text-gray-500 dark:text-gray-400"
                      }`}
                  >
                    {preferredTimes[mealType]}
                  </p>
                </div>

                {mealData ? (
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-base font-medium ${exceeded && !checkedMeals[mealType]
                        ? "text-red-600"
                        : "text-gray-800 dark:text-dark-text"
                        }`}
                    >
                      {mealData.food_title}
                    </span>
                    <input
                      type="checkbox"
                      checked={checkedMeals[mealType]}
                      onChange={() => handleMealCheckboxChange(mealType, mealData)}
                      className="h-5 w-5 text-green-600 rounded focus:ring-green-500"
                    />
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm italic">
                    No {mealType.toLowerCase()} added yet.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}

export default Dashboard