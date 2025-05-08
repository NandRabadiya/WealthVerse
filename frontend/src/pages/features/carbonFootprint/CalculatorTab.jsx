import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Calculator } from "lucide-react";
import api from "../../../api/api"; // Adjust the import path as necessary

const categories = [
  "ELECTRICITY",
  "FUEL",
  "FLIGHT",
  "PUBLIC_TRANSPORT",
  "GROCERIES",
  "FOOD_DINNING",
  "ONLINE_FOOD",
  "CLOTHINNG_SHOPPING",
  "ONLINE_SHOPPING",
  "SUBSCRIPTIONS",
  "HOTEL_STAY",
  "TRAVELING",
  "CREDITECART_PAYMENT",
  "INSURANCE",
  "CASH",
  "MISCELLANEOUS",
  "NGO",
  "INVESTMENT",
  "RECHARGE",
];

const CalculatorTab = () => {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState(null);

  const handleCalculate = async () => {
    if (!category || !amount || isNaN(amount) || amount <= 0) return;

    setIsCalculating(true);
    setError(null);
    // Simulate API call
    setError(null);

    try {
      // Call the backend API
      const response = await api.post("/category/calculate", {
        categoryName: category,
        amountSpent: parseFloat(amount),
      });

      // Process response
      const carbonFootprint = response.data;

      setResult({
        category,
        amount: parseFloat(amount),
        carbonFootprint: carbonFootprint.toFixed(2),
      });
    } catch (err) {
      console.error("Error calculating carbon footprint:", err);
      setError("Failed to calculate carbon footprint. Please try again.");
    } finally {
      setIsCalculating(false);
    }
  };
  return (
    <div className="space-y-8">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calculator className="h-5 w-5 text-green-400" />
            Carbon Footprint Calculator
          </CardTitle>
          <CardDescription className="text-gray-400">
            Estimate the environmental impact of your spending
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h3 className="text-white font-medium mb-2">
              How We Calculate Your Footprint
            </h3>
            <p className="text-gray-300 mb-4">
              We use category-specific emission factors to estimate the carbon
              impact of each transaction:
            </p>
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
              <h4 className="text-white font-medium mb-2">
                Transportation Example:
              </h4>
              <ul className="space-y-1 text-gray-300">
                <li>Fuel purchase: ₹1,200</li>
                <li>Emission factor: 0.027 kg CO₂ per ₹</li>
                <li className="text-green-400 font-medium mt-2">
                  Carbon footprint: 1200 × 0.027 = 32.4 kg CO₂
                </li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-white">
                  Transaction Category
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger
                    id="category"
                    className="bg-gray-800 border-gray-700 text-white"
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    {categories.map((cat) => (
                      <SelectItem
                        key={cat}
                        value={cat}
                        className="hover:bg-gray-700 focus:bg-gray-700"
                      >
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="text-white">
                  Amount Spent (₹)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <Button
                onClick={handleCalculate}
                disabled={!category || !amount || isCalculating}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
              >
                {isCalculating ? "Calculating..." : "Calculate Footprint"}
              </Button>
              {error && (
                <div className="text-red-400 text-sm mt-2">{error}</div>
              )}
            </div>

            {result && (
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex flex-col justify-center">
                <h3 className="text-white font-medium mb-4">
                  Calculation Result
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Category:</span>
                    <span className="text-white">{result.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Amount Spent:</span>
                    <span className="text-white">
                      ₹{result.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="h-px bg-gray-700 my-2"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Carbon Footprint:</span>
                    <span className="text-green-400 text-xl font-bold">
                      {result.carbonFootprint} kg CO₂
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalculatorTab;
