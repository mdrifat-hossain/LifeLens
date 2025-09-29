import ClerkProviderWithRoutes from './auth/ClerkProviderWithRoute'
import { Layout } from "./layout/Layout"
import { AuthenticationPage } from "./auth/AuthenticationPage"
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


function ProtectedMealPlan() {
	const isNewUser = false; // fake flag for now

	if (isNewUser) {
		return <Navigate to="/meal-survey" replace />;
	}

	return <MealPlan />;
}


function App() {
	return (
		<ClerkProviderWithRoutes>
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/sign-in/*" element={<AuthenticationPage />} />
				<Route path="/sign-up" element={<AuthenticationPage />} />
				<Route element={<Layout />}>
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/chat" element={<ChatPage />} />   {/* now safe */}
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

					<Route path="/career-path" element={<CareerDashboardLayout />}>
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



export default App