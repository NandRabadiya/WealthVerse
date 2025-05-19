import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useAuth } from "../../auth/AuthContext";
import { PlusCircle, Eye, Menu, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { AddTransactionForm } from "./spendAnalysis/AddTransaction";
import WealthVerse from "/WealthVerse.png";
import { useTransactions } from "../../context/TransactionContext";

const features = [
  { title: "Spend Analysis", url: "spend-analysis" },
  { title: "Carbon Footprint", url: "carbon-footprint" },
  { title: "Planner", url: "budget-planner" },
];

const FeaturesNavbar = () => {
  const { logout } = useAuth();
  const { fetchTransactions } = useTransactions();
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTransactionSuccess = () => {
    fetchTransactions();
    setOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center h-20 px-4 md:px-6 lg:px-12 bg-transparent backdrop-blur-md text-white">
        {/* Logo */}
        <Link to="/" className="z-50">
          <img
            src={WealthVerse}
            alt="WealthVerse Logo"
            className="h-32 lg:h-40 object-contain w-auto cursor-pointer"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-grow justify-center space-x-4 lg:space-x-8 mx-4">
          {features.map((feature) => (
            <NavLink
              key={feature.title}
              to={`/${feature.url}`}
              className={({ isActive }) =>
                `relative px-2 py-1 text-sm lg:text-base transition-all duration-300 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-white after:w-0 hover:after:w-full after:transition-all after:duration-300 ${
                  isActive ? "text-green-400 after:w-full after:bg-green-400" : "text-white"
                }`
              }
            >
              {feature.title}
            </NavLink>
          ))}
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-2 lg:gap-4">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-1 lg:gap-2 text-xs lg:text-sm h-8 lg:h-9 px-2 lg:px-4">
                <PlusCircle className="h-3 w-3 lg:h-4 lg:w-4" />
                <span>Add</span>
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
            <Button className="min-w-[100px] lg:min-w-[150px] h-8 lg:h-9 bg-blue-500 hover:bg-blue-700 text-white flex items-center justify-center gap-1 lg:gap-2 text-xs lg:text-sm px-2 lg:px-4">
              <Eye className="h-3 w-3 lg:h-4 lg:w-4" />
              <span>Transactions</span>
            </Button>
          </Link>

          <Button
            onClick={async () => {
              await logout();
              window.location.href = "/";
            }}
            className="bg-red-500 hover:bg-red-600 text-white text-xs lg:text-sm h-8 lg:h-9 px-2 lg:px-4"
          >
            Logout
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden z-50 p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Mobile Menu */}
        <div
          className={`fixed top-20 right-0 w-64 bg-gray-900 border-l border-gray-800 z-40 transition-all duration-300 ease-in-out transform ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          } md:hidden`}
        >
          <div className="flex flex-col p-4 space-y-4">
            {features.map((feature) => (
              <NavLink
                key={feature.title}
                to={`/${feature.url}`}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-md ${
                    isActive ? "bg-gray-800 text-green-400" : "text-white hover:bg-gray-800"
                  }`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                {feature.title}
              </NavLink>
            ))}

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Add Transaction
                </Button>
              </DialogTrigger>
            </Dialog>

            <Link to="/transactions">
              <Button className="w-full bg-blue-500 hover:bg-blue-700 text-white flex items-center justify-center gap-2 mt-2">
                <Eye className="h-4 w-4" />
                All Transactions
              </Button>
            </Link>

            <Button
              onClick={async () => {
                await logout();
                window.location.href = "/";
              }}
              className="w-full bg-red-500 hover:bg-red-600 text-white mt-2"
            >
              Logout
            </Button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default FeaturesNavbar;