// pages/features/SpendingAnalysis.jsx
import FeatureLayout from "../FeatureLayout";
import { TransactionAnalysis } from "./TransactionAnalysis";
import { TransactionTable } from "./TransactionTable";

const SpendingAnalysis = () => {
  return (
    <FeatureLayout>
      <div className="min-h-screen bg-gray-900 text-white">
        <h1 className="text-3xl font-bold mb-6 text-white">Spend Analysis</h1>

        <div className="space-y-8">
          <TransactionAnalysis />
          <TransactionTable />
        </div>
      </div>
    </FeatureLayout>
  );
};

export default SpendingAnalysis;
