// pages/features/FeatureLayout.jsx
import React from "react";
import FeaturesNavbar from "./FeaturesNavbar"; // Import FeaturesNavbar

const FeatureLayout = ({ children }) => {
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <FeaturesNavbar /> {/* Add FeaturesNavbar here */}
      <div className="pt-24 px-6 md:px-12 lg:px-24">
        {" "}
        {/* Added padding-top to avoid overlap with navbar */}
        {children}
      </div>
    </div>
  );
};

export default FeatureLayout;
