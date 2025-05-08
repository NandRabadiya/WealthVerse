// pages/features/CarbonFootprint.jsx
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import FeatureLayout from "../FeatureLayout";
import OverviewTab from "./OverviewTab";
import CalculatorTab from "./CalculatorTab";
import OffsetsTab from "./OffsetsTab";

const CarbonFootprint = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <FeatureLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-white">Carbon Footprint</h1>
        <p className="text-gray-400 mb-6">
          Track, understand, and offset the environmental impact of your
          spending
        </p>

        <Tabs
          defaultValue="overview"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 bg-gray-800 mb-8">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-green-400 cursor-pointer"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="calculator"
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-green-400 cursor-pointer"
            >
              Calculator
            </TabsTrigger>
            <TabsTrigger
              value="offsets"
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-green-400 cursor-pointer"
            >
              Offsets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="calculator">
            <CalculatorTab />
          </TabsContent>

          <TabsContent value="offsets">
            <OffsetsTab />
          </TabsContent>
        </Tabs>
      </div>
    </FeatureLayout>
  );
};

export default CarbonFootprint;
