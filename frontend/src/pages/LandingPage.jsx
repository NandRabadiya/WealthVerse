import React from "react";
import { Button } from "@/components/ui/Button";
import { LogIn, TrendingUp, Leaf, PiggyBank, BadgeInfo } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/Carousel";
import { useAuth } from "@/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/Card";
import { Link } from "react-router-dom";
import WealthVerse from "/WealthVerse.png";
import { User } from "lucide-react";
import TeamPage from "./TeamPage";
import { ThemeToggle } from "@/components/ThemeToggle";
// import { useTheme } from "../context/ThemeContext";
import { useState } from "react";

const teamMembers = [
  { name: "Venu", email: "venupatel004@gmail.com", password: "Venu@123" },
  { name: "Nand", email: "nandrabadiya2003@gmail.com", password: "Nand@123" },
  { name: "Shaily", email: "shaily@gmail.com", password: "Shaily@123" },
  { name: "Kunj", email: "kunjvasoya03@gmail.com", password: "Kunj@123" },
];

const LandingPage = () => {
  const { token, logout, login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  // const { theme } = useTheme();
  console.log(token);
  const navigate = useNavigate();

  const features = [
    {
      title: "Spend Analysis",
      description:
        "Track and analyze your spending patterns for better financial management.",
      icon: <TrendingUp className="h-10 w-10 text-green-400" />,
      url: "spend-analysis",
    },
    {
      title: "Carbon Footprint",
      description:
        "Monitor your environmental impact through your financial choices.",
      icon: <Leaf className="h-10 w-10 text-green-400" />,
      url: "carbon-footprint",
    },
    {
      title: "Budget Planner",
      description:
        "Create personalized budgets and achieve your financial goals.",
      icon: <PiggyBank className="h-10 w-10 text-blue-400" />,
      url: "budget-planner",
    },
  ];

  const suggestions = [
    "Save 20% of your income for a secure financial future.",
    "Track your daily expenses to identify unnecessary spending.",
    "Automate bill payments to avoid late fees and improve credit score.",
    "Group online orders to reduce carbon footprint.",
    "Review your budget regularly and adjust based on changing needs.",
    "Build an emergency fund to cover at least 6 months of expenses.",
    "Invest early and let compound interest do its magic!",
  ];

  const handleCardClick = (url) => {
    const isAuthenticated = !!token || !!localStorage.getItem("token");
    console.log("isAuthenticated: ", isAuthenticated);
    if (isAuthenticated) {
      console.log("Navigating to: ", url);
      navigate(`/${url}`);
    } else {
      navigate("/login");
    }
  };

  // Dummy login function
  const handleAvatarClick = async (memberIndex) => {
    const member = teamMembers[memberIndex];
    setIsLoading(true);

    try {
      const result = await login(member.email, member.password);
      if (result.success) {
        navigate("/");
      } else {
        console.error("Login failed:", result.error);
      }
    } catch (error) {
      console.error("Error during login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center h-20 px-6 md:px-12 lg:px-24 bg-transparent backdrop-blur-md border-gray-700">
        <Link to="/">
          <img
            src={WealthVerse}
            alt="WealthVerse Logo"
            className="h-40 object-contain w-auto cursor-pointer"
          />
        </Link>
        <div className="flex items-center gap-4">
          {/* <ThemeToggle /> */}

          {token ? (
            // Display Logout Button when user is logged in
            <Button
              onClick={async () => {
                await logout();
                navigate("/");
              }}
              className="bg-red-500 hover:bg-red-600 cursor-pointer hover:opacity-90 transition-opacity text-white"
            >
              Logout
            </Button>
          ) : (
            // Display Login Button if user is not logged in
            <Button
              onClick={() => navigate("/login")}
              className="bg-green-400 hover:bg-green-600 cursor-pointer hover:opacity-90 transition-opacity text-gray-900"
            >
              <LogIn className="mr-2 h-4 w-4" /> Login
            </Button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-30 py-16 md:py-24 px-6 md:px-12 lg:px-24 ">
        <div className="max-w-3xl mx-auto text-center animate-scale-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
            Banking Reimagined for the Digital Age
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-8 animate-pulse-subtle">
            Experience financial management that empowers, enlightens, and
            evolves with you.
          </p>
          <Button
            onClick={() => {
              const isAuthenticated =
                !!token || !!localStorage.getItem("token");
              navigate(isAuthenticated ? "/spend-analysis" : "/login");
            }}
            className="bg-green-400 hover:bg-green-600 cursor-pointer hover:opacity-90 transition-opacity text-gray-900 px-8 py-6 text-lg rounded-lg animate-float"
          >
            Get Started
          </Button>

          {/* Dummy User Avatars */}
          {!token && (
            <div className="flex justify-center gap-8 mt-8">
              {teamMembers.map((member, index) => (
                <div>
                  <div
                    key={index}
                    onClick={() => handleAvatarClick(index)}
                    className={`flex justify-center items-center w-20 h-20 bg-blue-900 rounded-full cursor-pointer hover:opacity-90 transition-opacity ${
                      isLoading ? "opacity-50" : ""
                    }`}
                    title={`Login as ${member.name}`}
                  >
                    <User className="text-white w-12 h-12" />
                  </div>
                  <span className="text-xs text-gray-400">{member.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 md:py-20 px-6 md:px-12 lg:px-24 bg-gray-900">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-green-400">
          Powerful Features for Your Financial Journey
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              onClick={() => handleCardClick(feature.url)}
              className="bg-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl cursor-pointer duration-300 transform hover:-translate-y-1 hover:scale-105 transition-transform"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tips & Suggestion */}
      <section className="py-16 md:py-20 px-6 md:px-12 lg:px-24 bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] overflow-hidden">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 text-[#8de9c2]">
          Financial Tips & Suggestions
        </h2>

        <div className="relative w-full overflow-hidden">
          <div className="flex w-max gap-6 slider-track">
            {[...suggestions, ...suggestions].map((suggestion, index) => (
              <div
                key={index}
                className="min-w-[300px] p-4 bg-[#1e293b] border border-[#334155] rounded-xl shadow-xl hover:shadow-2xl transition-transform duration-300"
              >
                <p className="text-center text-[#c0fdfb] text-lg font-semibold">
                  💡 {suggestion}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-8 px-6 md:px-12 lg:px-24 bg-gray-900">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 drop-shadow-lg pt-4">
          Meet the Team 🌟
        </h2>
        <TeamPage />
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 md:px-12 lg:px-24 bg-gray-800 border-t border-gray-700 mt-auto">
        <p className="text-center text-gray-400">
          Made with <span className="text-red-500">❤</span> by Team
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
