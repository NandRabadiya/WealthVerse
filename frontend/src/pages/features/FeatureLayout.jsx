import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

const links = [
  { name: "Spend Analysis", path: "/spend-analysis" },
  { name: "Carbon FootPrint", path: "/carbon-footprint" },
  { name: "Budget Planner", path: "/budget-planner" },
  { name: "Cibil Scoring", path: "/cibil-scoring" },
];

export default function FeatureLayout({ children }) {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <nav className="flex justify-between items-center px-6 py-4 bg-green-700 text-white">
        <h1 className="font-bold text-xl">WealthVerse</h1>
        <div className="flex gap-4">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `hover:underline ${isActive ? "font-bold underline" : ""}`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>
        <button
          onClick={logout}
          className="bg-white text-green-700 px-3 py-1 rounded-full"
        >
          Logout
        </button>
      </nav>
      <main className="text-center mt-10">{children}</main>
    </div>
  );
}
