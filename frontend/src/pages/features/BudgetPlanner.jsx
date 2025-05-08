// pages/features/SpendingAnalysis.jsx
import React from "react";
import FeatureLayout from "./FeatureLayout";

const SpendingAnalysis = () => {
  return (
    <FeatureLayout>
      <h1 className="text-4xl font-bold text-center mt-24">Budget Planner</h1>
      <p className="text-lg text-center mt-8 px-6 md:px-12">
        Track and analyze your spending patterns for better financial
        management.
      </p>

      {/* Coming Soon with Typing Dots */}
      <div className="text-center mt-8 text-xl font-semibold">
        Coming Soon...
      </div>
    </FeatureLayout>
  );
};

export default SpendingAnalysis;
