// pages/features/SpendingAnalysis.jsx
import React from "react";
import FeatureLayout from "./FeatureLayout";
import { Leaf, Target, CalendarCheck2 } from "lucide-react"; // Optional icons

const SpendingAnalysis = () => {
  return (
    <FeatureLayout>
      <div className="max-w-5xl mx-auto mt-24 px-4 md:px-8 bg-gray-900 text-white rounded-2xl py-10 shadow-xl">
        <p className="text-lg text-center mt-4 text-gray-300">
          Track and analyze your spending patterns for better financial management.
        </p>

        {/* Coming Soon Text */}
        <div className="text-center mt-6 text-xl font-semibold text-gray-400 animate-pulse">
          Coming Soon...
        </div>

        {/* Carbon Footprint Target */}
        <section className="mt-12 bg-gray-700 p-6 rounded-xl shadow-inner">
          <div className="flex items-center gap-3 mb-4">
            <Leaf className="text-green-400" />
            <h2 className="text-2xl font-semibold text-green-400">Carbon Footprint Target</h2>
          </div>
          <p className="text-gray-300 mb-4">
            Set your monthly carbon reduction goal based on travel, energy usage, and consumption habits.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            {[
              { label: "Travel Emissions", target: "50 kg CO₂" },
              { label: "Energy Consumption", target: "100 kWh" },
              { label: "Product Usage", target: "30 items" },
            ].map(({ label, target }, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-400">{label}</p>
                <p className="text-lg font-medium text-green-400">{target}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Expense Category Targets */}
        <section className="mt-12 bg-gray-700 p-6 rounded-xl shadow-inner">
          <div className="flex items-center gap-3 mb-4">
            <Target className="text-green-400" />
            <h2 className="text-2xl font-semibold text-green-400">Expense Targets by Category</h2>
          </div>
          <p className="text-gray-300 mb-4">
            Define personalized monthly limits for each spending category to manage your budget wisely.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            {[
              { label: "Food & Dining", amount: "₹ 4,000" },
              { label: "Transportation", amount: "₹ 2,500" },
              { label: "Entertainment", amount: "₹ 3,000" },
            ].map(({ label, amount }, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-400">{label}</p>
                <p className="text-lg font-medium text-green-400">{amount}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Calendar Insight Placeholder */}
        <section className="mt-12 bg-gray-700 p-6 rounded-xl shadow-inner">
          <div className="flex items-center gap-3 mb-4">
            <CalendarCheck2 className="text-green-400" />
            <h2 className="text-2xl font-semibold text-green-400">Track Monthly Progress</h2>
          </div>
          <p className="text-gray-300">
            Visualize your monthly budget progress and carbon impact through upcoming interactive dashboards and timelines.
          </p>
        </section>
      </div>
    </FeatureLayout>
  );
};

export default SpendingAnalysis;
