// pages/features/SpendingAnalysis.jsx
import React from "react";
import FeatureLayout from "./FeatureLayout";

const SpendingAnalysis = () => {
  return (
    <FeatureLayout>
      <div className="flex flex-col min-h-screen bg-gray-900 text-white">
        <h1 className="text-4xl font-bold text-center mt-24">Spend Analysis</h1>
        <p className="text-lg text-center mt-8 px-6 md:px-12">
          Track and analyze your spending patterns for better financial
          management.
        </p>
        {/* More content related to Spend Analysis */}
      </div>
    </FeatureLayout>
  );
};

export default SpendingAnalysis;
