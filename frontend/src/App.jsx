import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SpendAnalysis from "./pages/features/spendAnalysis/SpendAnalysis";
import CarbonFootPrint from "./pages/features/carbonFootprint/CarbonFootprint";
import BudgetPlanner from "./pages/features/BudgetPlanner";
import LoginPage from "./pages/authentication/LoginPage";
import SignupPage from "./pages/authentication/SignupPage";
import ProtectedRoute from "./auth/ProtectedRoute";
import Transactions from "./pages/features/transactions/Transactions";
import ChatBot from "./pages/chatbot/ChatBot";
import { TransactionProvider } from "./context/TransactionContext";
import { useAuth } from "./auth/AuthContext";

function App() {
  const { userId } = useAuth();
  return (
    <>
      <TransactionProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/spend-analysis" element={<SpendAnalysis />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/carbon-footprint" element={<CarbonFootPrint />} />
            <Route path="/budget-planner" element={<BudgetPlanner />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        {userId && <ChatBot userId={userId} />}
      </TransactionProvider>
    </>
  );
}

export default App;
