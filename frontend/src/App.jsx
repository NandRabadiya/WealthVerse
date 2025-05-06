import { AuthProvider } from "./auth/AuthContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SpendAnalysis from "./pages/features/SpendAnalysis";
import CarbonFootPrint from "./pages/features/CarbonFootprint";
import BudgetPlanner from "./pages/features/BudgetPlanner";
import CibilScoring from "./pages/features/CibilScoring";
import LoginPage from "./pages/authentication/LoginPage";
import SignupPage from "./pages/authentication/SignupPage";
import ProtectedRoute from "./auth/ProtectedRoute";

function App() {

  
  return (
    <>
      <AuthProvider>
        
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/spend-analysis" element={<SpendAnalysis />} />
              <Route path="/carbon-footprint" element={<CarbonFootPrint />} />
              <Route path="/budget-planner" element={<BudgetPlanner />} />
              <Route path="/cibil-scoring" element={<CibilScoring />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        
      </AuthProvider>
    </>
  );
}

export default App;
