// pages/features/FeaturesNavbar.jsx
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useAuth } from "../../auth/AuthContext"; // Import the useAuth hook
//import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { AddTransactionForm } from "./spendAnalysis/AddTransaction";

// Define the feature links you want in the navbar
const features = [
  { title: "Spend Analysis", url: "spend-analysis" },
  { title: "Carbon Footprint", url: "carbon-footprint" },
  { title: "Budget Planner", url: "budget-planner" },
  { title: "Cibil Scoring", url: "cibil-scoring" },
];

const FeaturesNavbar = () => {
  const { logout } = useAuth();
  //const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <nav className="flex justify-between items-center py-6 px-6 md:px-12 lg:px-24 bg-gray-900 text-white">
      <div className="font-bold text-2xl text-green-400">WealthVerse</div>
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
            <AddTransactionForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>

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
