import { AuthProvider } from "./auth/AuthContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SpendAnalysis from "./pages/features/SpendAnalysis";
import CarbonFootPrint from "./pages/features/CarbonFootPrint";
import BudgetPlanner from "./pages/features/BudgetPlanner";
import CibilScoring from "./pages/features/CibilScoring";

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/spend-analysis" element={<SpendAnalysis />} />
            <Route path="/carbon-footprint" element={<CarbonFootPrint />} />
            <Route path="/budget-planner" element={<BudgetPlanner />} />
            <Route path="/cibil-scoring" element={<CibilScoring />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
