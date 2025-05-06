// pages/features/FeaturesNavbar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

// Define the feature links you want in the navbar
const features = [
  { title: "Spend Analysis", url: "spend-analysis" },
  { title: "Carbon Footprint", url: "carbon-footprint" },
  { title: "Budget Planner", url: "budget-planner" },
  { title: "Cibil Scoring", url: "cibil-scoring" },
];

const FeaturesNavbar = () => {
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
      <Button className="bg-green-400 hover:bg-green-600 cursor-pointer hover:opacity-90 transition-opacity text-gray-900">
        <LogIn className="mr-2 h-4 w-4" /> User
      </Button>
    </nav>
  );
};

export default FeaturesNavbar;
