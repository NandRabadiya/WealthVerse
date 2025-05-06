// pages/features/SpendingAnalysis.jsx
import React from "react";
import FeatureLayout from "./FeatureLayout"; // Import FeatureLayout (which now includes FeaturesNavbar)

const SpendingAnalysis = () => {
  return (
    <FeatureLayout>
      <h1 className="text-4xl font-bold text-center mt-24">Budget Planner</h1>
      <p className="text-lg text-center mt-8 px-6 md:px-12">
        Track and analyze your spending patterns for better financial
        management.
      </p>
      {/* More content related to Spend Analysis */}
    </FeatureLayout>
  );
};

export default SpendingAnalysis;
