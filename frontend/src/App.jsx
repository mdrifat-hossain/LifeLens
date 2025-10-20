import ClerkProviderWithRoutes from './auth/ClerkProviderWithRoute'
import { Layout } from "./layout/Layout"
import { Routes, Route, Navigate } from 'react-router-dom'
import MealPlan from "./pages/FoodPlanning/MealPlane"
import MealPlanMain from "./pages/FoodPlanning/MealPlanMain"
import GroceryList from "./pages/FoodPlanning/GroceryList"
import ProductSearch from './pages/FoodPlanning/ProductSearch'
import MealSurvey from './pages/FoodPlanning/MealSurvay'
import ChatPage from './pages/chat/ChatPage'
import RoutineDashboard from './pages/Routine/RoutineDashboard'
import RoutineEdit from './pages/Routine/RoutineEdit'
import FinancialDashboard from './pages/FinancialGuide/FinancialDashboard'
import TransactionDetails from './pages/FinancialGuide/TransactionDetails'
import Email from './pages/Email/email'
import CareerDashboard from './pages/careerPath/CareerDashboard'
import SkillTrend from './pages/careerPath/SkillTrend'


import './App.css'
import LandingPage from './pages/landingPage/LandingPage'
import Dashboard from './pages/dashboard/Dashboard'
import LearningPathList from './pages/careerPath/LearningPathList'
import PathDetails from './pages/careerPath/PathDetails'
import CareerDashboardLayout from './pages/careerPath/CareerDashboardLayout'
import LearningPathLayout from './pages/careerPath/LearningPathLayout'
import PathDetailsLayout from './pages/careerPath/PathDetailsLayout'
import AiHelp from './pages/careerPath/AiHelp'
import CareerSurvey from './pages/careerPath/CareerSurvey'
import SignInPage from "./auth/SignInPage";
import SignUpPage from "./auth/SignUpPage";
import { useState, useEffect } from "react";
import { useApi } from "./utils/api";
import SurveyAndReport from './pages/surveyEditAndReport/SurveyAndReport'
import AdminDashboard from './pages/adminSide/AdminDashboard'
import RoleRedirect from './pages/landingPage/RoleRedirect'

// function ProtectedMealPlan() {
// 	const isNewUser = false;

// 	if (isNewUser) {
// 		return <Navigate to="/meal-survey" replace />;
// 	}

// 	return <MealPlan />;
// }

// function ProtectedCareerPlan() {
// 	const isNewUserCareer = false;

// 	if (isNewUserCareer) {
// 		return <Navigate to="/career-survey" replace />;
// 	}

// 	return <CareerDashboardLayout />;
// }

function ProtectedMealPlan() {
	const { makeRequest } = useApi();
	const [loading, setLoading] = useState(true);
	const [completed, setCompleted] = useState(0);

	useEffect(() => {
		const fetchMealStatus = async () => {
			try {
				const res = await makeRequest("user-survey-status", { method: "GET" });
				console.log("meal res:", res);
				setCompleted(res?.meal_survey_completed ?? res?.data?.meal_survey_completed ?? 0);
			} catch (err) {
				console.error("Error fetching meal survey status:", err);
			} finally {
				setLoading(false);
			}
		};
		fetchMealStatus();
	}, [makeRequest]);

	if (loading) return null;

	console.log("Meal Completed:", completed);

	if (completed === 0) {
		return <Navigate to="/meal-survey" replace />;
	}

	return <MealPlan />;
}


function ProtectedCareerPlan() {
	const { makeRequest } = useApi();
	const [loading, setLoading] = useState(true);
	const [completed, setCompleted] = useState(0);

	useEffect(() => {
		const fetchCareerStatus = async () => {
			try {
				const res = await makeRequest("user-survey-status", { method: "GET" });
				console.log("career res:", res);
				// Handle both response shapes
				setCompleted(res?.career_survey_completed ?? res?.data?.career_survey_completed ?? 0);
			} catch (err) {
				console.error("Error fetching career survey status:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchCareerStatus();
	}, [makeRequest]);

	if (loading) return null; // you can show a spinner instead

	console.log("Career Completed:", completed);

	if (completed === 0) {
		return <Navigate to="/career-survey" replace />;
	}

	return <CareerDashboardLayout />;
}


function App() {
	return (
		<ClerkProviderWithRoutes>
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/sign-in/*" element={<SignInPage />} />
				<Route path="/sign-up/*" element={<SignUpPage />} />
				<Route path="/check-role-redirect" element={<RoleRedirect />} />
				<Route element={<Layout />}>
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/chat" element={<ChatPage />} />
					<Route path="/survey-report/*" element={<SurveyAndReport />}>
						<Route path="meal-survey" element={<MealSurvey />} />
						<Route path="career-survey" element={<CareerSurvey />} />
					</Route>

					<Route path="/meal-survey" element={<MealSurvey />} />
					<Route path="/meal-plan/*" element={<ProtectedMealPlan />}>
						<Route index element={<MealPlanMain />} />
						<Route path="grocery-list" element={<GroceryList />} />
						<Route path="grocery-list/product-search" element={<ProductSearch />} />
					</Route>
					<Route path="/manage-day/*"  >
						<Route index element={<RoutineDashboard />} />
						<Route path="edit" element={<RoutineEdit />} />

					</Route>
					<Route path='/financial-dashboard/*'>
						<Route index element={<FinancialDashboard />} />
						<Route path="financial-review" element={<TransactionDetails />} />
					</Route>
					{/* <Route path='/financial-review/*'>
						<Route index element={<TransactionDetails />} />
					</Route> */}
					<Route path='/email/*'>
						<Route index element={<Email />} />
					</Route>

					<Route path="/career-survey" element={<CareerSurvey />} />

					<Route path="/career-path/*" element={<ProtectedCareerPlan />}>
						<Route index element={<CareerDashboard />} />
						<Route path="skills-trend" element={<SkillTrend />} />
						<Route path="learning-path" element={<LearningPathLayout />}>
							<Route index element={<LearningPathList />} />
							<Route path="path-details" element={<PathDetailsLayout />}>
								<Route index element={<PathDetails />} />
								<Route path="ai-help" element={<AiHelp />} />
							</Route>
						</Route>
					</Route>


				</Route>
			</Routes>
		</ClerkProviderWithRoutes>
	);
}



export default App;