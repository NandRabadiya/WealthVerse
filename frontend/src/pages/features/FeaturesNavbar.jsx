// pages/features/FeaturesNavbar.jsx
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useAuth } from "../../auth/AuthContext"; // Import the useAuth hook
import { PlusCircle, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { AddTransactionForm } from "./spendAnalysis/AddTransaction";
import WealthVerse from "/WealthVerse.png"; // Adjust the path as necessary
import { useTransactions } from "../../context/TransactionContext"; // Import the TransactionContext
import { ThemeToggle } from "@/components/ThemeToggle"; // Import the ThemeToggle component

// Define the feature links you want in the navbar
const features = [
  { title: "Spend Analysis", url: "spend-analysis" },
  { title: "Carbon Footprint", url: "carbon-footprint" },
  { title: "Budget Planner", url: "budget-planner" },
  { title: "Cibil Scoring", url: "cibil-scoring" },
];

const FeaturesNavbar = () => {
  const { logout } = useAuth();
  const { fetchTransactions } = useTransactions();
  const [open, setOpen] = useState(false);
  const handleTransactionSuccess = () => {
    fetchTransactions(); // Refresh transactions
    setOpen(false);
  };
  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center h-20  px-6 md:px-12 lg:px-24 bg-transparent backdrop-blur-md text-white">
      {/* <div className="font-bold text-2xl text-green-400">WealthVerse</div> */}
      <Link to="/">
        <img
          src={WealthVerse}
          alt="WealthVerse Logo"
          className="h-40 object-contain w-auto cursor-pointer"
        />
      </Link>
      <div className="flex flex-grow justify-center space-x-8">
        {features.map((feature) => (
          <NavLink
            key={feature.title}
            to={`/${feature.url}`}
            className="text-white hover:text-green-400 transition-colors hover:underline"
          >
            {feature.title}
          </NavLink>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-gray-900 border-gray-800 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">
                Add New Transaction
              </DialogTitle>
            </DialogHeader>
            <AddTransactionForm onSuccess={handleTransactionSuccess} />
          </DialogContent>
        </Dialog>

        <Link to="/transactions">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2 cursor-pointer">
            <Eye className="h-5 w-5" />
            View All Transactions
          </button>
        </Link>

        <Button
          onClick={async () => {
            await logout();
            window.location.href = "/"; // Force full reload to clear context
          }}
          className="bg-red-500 hover:bg-red-600 cursor-pointer hover:opacity-90 transition-opacity text-white"
        >
          Logout
        </Button>
      </div>
    </nav>
  );
};

export default FeaturesNavbar;
