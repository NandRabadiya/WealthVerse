// pages/features/FeaturesNavbar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/auth/AuthContext"; // Import the useAuth hook
import { useNavigate } from "react-router-dom";

// Define the feature links you want in the navbar
const features = [
  { title: "Spend Analysis", url: "spend-analysis" },
  { title: "Carbon Footprint", url: "carbon-footprint" },
  { title: "Budget Planner", url: "budget-planner" },
  { title: "Cibil Scoring", url: "cibil-scoring" },
];

const FeaturesNavbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
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
      <Button
        onClick={async () => {
          await logout();
          window.location.href = "/"; // Force full reload to clear context
        }}
        className="bg-red-500 hover:bg-red-600 cursor-pointer hover:opacity-90 transition-opacity text-white"
      >
        Logout
      </Button>
    </nav>
  );
};

export default FeaturesNavbar;
