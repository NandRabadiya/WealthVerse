import React from "react";
import { Button } from "@/components/ui/button";
import { LogIn, TrendingUp, Leaf, PiggyBank, BadgeInfo } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useAuth } from "@/auth/AuthContext"; // Import the useAuth hook
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const { token, logout } = useAuth();
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
    {
      title: "Cibil Scoring",
      description:
        "Keep track of your credit health and improve your credit score.",
      icon: <BadgeInfo className="h-10 w-10 text-blue-400" />,
      url: "cibil-scoring",
    },
  ];

  const suggestions = [
    "Save 20% of your income for a secure financial future.",
    "Track your daily expenses to identify unnecessary spending.",
    "Automate bill payments to avoid late fees and improve credit score.",
    "Invest in diverse assets to minimize risk and maximize returns.",
    "Review your budget regularly and adjust based on changing needs.",
    "Build an emergency fund to cover at least 6 months of expenses.",
    "Pay credit card bills in full to avoid high interest charges.",
  ];

  const handleCardClick = (url) => {
    if (token) {
      navigate(`/${url}`);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center py-6 px-6 md:px-12 lg:px-24">
        <div className="font-bold text-2xl text-green-400">WealthVerse</div>
        {token ? (
          // Display Logout Button when user is logged in
          <Button
            onClick={() => {
              logout();
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
      </nav>

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-6 md:px-12 lg:px-24 bg-blue-900">
        <div className="max-w-3xl mx-auto text-center animate-scale-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
            Banking Reimagined for the Digital Age
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-8 animate-pulse-subtle">
            Experience financial management that empowers, enlightens, and
            evolves with you.
          </p>
          <Button className="bg-green-400 hover:bg-green-600 cursor-pointer hover:opacity-90 transition-opacity text-gray-900 px-8 py-6 text-lg rounded-lg animate-float">
            Get Started
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 md:py-20 px-6 md:px-12 lg:px-24 bg-gray-900">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-green-400">
          Powerful Features for Your Financial Journey
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              onClick={() => handleCardClick(feature.url)}
              className="bg-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer duration-300 transform hover:-translate-y-1 hover:scale-105 transition-transform"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Suggestions Slider */}
      <section className="py-16 md:py-20 px-6 md:px-12 lg:px-24 bg-[#0f172a]">
        {" "}
        {/* dark blue background */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#8de9c2]">
          Financial Tips & Suggestions
        </h2>
        <div className="relative w-full">
          <Carousel className="w-full" opts={{ loop: true, align: "start" }}>
            <CarouselContent>
              {suggestions.map((suggestion, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="bg-[#1e293b] border border-[#334155] rounded-xl hover:shadow-md transition-transform duration-300 hover:scale-[1.03]">
                      <CardContent className="flex items-center justify-center p-6 h-32">
                        <p className="text-center text-[#c0fdfb] text-lg font-medium">
                          {suggestion}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 md:px-12 lg:px-24 bg-gray-800 border-t border-gray-700 mt-auto">
        <p className="text-center text-gray-400">
          Made with <span className="text-red-500">❤</span> by team
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
