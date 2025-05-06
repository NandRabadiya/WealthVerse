// pages/features/SpendingAnalysis.jsx
import React from "react";
import FeatureLayout from "./FeatureLayout"; // Import FeatureLayout (which now includes FeaturesNavbar)

const CarbonFootPrint = () => {
  return (
    <FeatureLayout>
      <h1 className="text-4xl font-bold text-center mt-24">Carbon Footprint</h1>
      <p className="text-lg text-center mt-8 px-6 md:px-12">
        Track and analyze your carbon footprint patterns for better environmental
        management.
      </p>
      {/* More content related to Spend Analysis */}
    </FeatureLayout>
  );
};

export default CarbonFootPrint;
