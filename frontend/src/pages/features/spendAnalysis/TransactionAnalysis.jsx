import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";

// Sample data - in a real app, this would come from your Spring Boot API
const sampleTransactions = [
  {
    id: 1,
    amount: 45.99,
    merchant_name: "Starbucks",
    payment_mode: "Credit Card",
    transaction_type: "Food",
    date: "2023-05-01",
  },
  {
    id: 2,
    amount: 120.5,
    merchant_name: "Amazon",
    payment_mode: "Debit Card",
    transaction_type: "Shopping",
    date: "2023-05-03",
  },
  {
    id: 3,
    amount: 35.0,
    merchant_name: "Uber",
    payment_mode: "UPI",
    transaction_type: "Transportation",
    date: "2023-05-05",
  },
  {
    id: 4,
    amount: 89.99,
    merchant_name: "Netflix",
    payment_mode: "Credit Card",
    transaction_type: "Entertainment",
    date: "2023-05-07",
  },
  {
    id: 5,
    amount: 250.0,
    merchant_name: "Electricity Co.",
    payment_mode: "Net Banking",
    transaction_type: "Utilities",
    date: "2023-05-10",
  },
  {
    id: 6,
    amount: 75.5,
    merchant_name: "Pharmacy",
    payment_mode: "Credit Card",
    transaction_type: "Healthcare",
    date: "2023-05-12",
  },
  {
    id: 7,
    amount: 199.99,
    merchant_name: "Coursera",
    payment_mode: "Credit Card",
    transaction_type: "Education",
    date: "2023-05-15",
  },
  {
    id: 8,
    amount: 55.0,
    merchant_name: "Starbucks",
    payment_mode: "UPI",
    transaction_type: "Food",
    date: "2023-05-18",
  },
  {
    id: 9,
    amount: 145.75,
    merchant_name: "Amazon",
    payment_mode: "Credit Card",
    transaction_type: "Shopping",
    date: "2023-05-20",
  },
  {
    id: 10,
    amount: 42.0,
    merchant_name: "Uber",
    payment_mode: "UPI",
    transaction_type: "Transportation",
    date: "2023-05-22",
  },
  {
    id: 11,
    amount: 12.99,
    merchant_name: "Spotify",
    payment_mode: "Credit Card",
    transaction_type: "Entertainment",
    date: "2023-05-25",
  },
  {
    id: 12,
    amount: 180.0,
    merchant_name: "Water Co.",
    payment_mode: "Net Banking",
    transaction_type: "Utilities",
    date: "2023-05-28",
  },
];

// Colors for the pie chart
const COLORS = [
  "#4ade80",
  "#60a5fa",
  "#f87171",
  "#facc15",
  "#a78bfa",
  "#fb923c",
  "#38bdf8",
  "#fb7185",
];

export function TransactionAnalysis() {
  const [transactions, setTransactions] = useState(sampleTransactions);
  const [timeFrame, setTimeFrame] = useState("monthly");
  const [viewType, setViewType] = useState("category");
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // In a real app, you would fetch data from your Spring Boot API
    // const fetchTransactions = async () => {
    //   try {
    //     const response = await fetch('your-api-endpoint/transactions')
    //     if (!response.ok) throw new Error('Failed to fetch transactions')
    //     const data = await response.json()
    //     setTransactions(data)
    //   } catch (error) {
    //     console.error('Error fetching transactions:', error)
    //   }
    // }
    //
    // fetchTransactions()

    // Using sample data for now
    setTransactions(sampleTransactions);
  }, []);

  useEffect(() => {
    // Process data for charts based on viewType
    if (viewType === "category") {
      const categoryData = processCategoryData(transactions);
      setChartData(categoryData);
    } else {
      const merchantData = processMerchantData(transactions);
      setChartData(merchantData);
    }
  }, [transactions, viewType]);

  // Process data for category-wise chart
  const processCategoryData = (data) => {
    const categoryMap = {};

    data.forEach((transaction) => {
      const category = transaction.transaction_type;
      if (categoryMap[category]) {
        categoryMap[category] += transaction.amount;
      } else {
        categoryMap[category] = transaction.amount;
      }
    });

    return Object.keys(categoryMap).map((category) => ({
      name: category,
      value: categoryMap[category],
    }));
  };

  // Process data for merchant-wise chart
  const processMerchantData = (data) => {
    const merchantMap = {};

    data.forEach((transaction) => {
      const merchant = transaction.merchant_name;
      if (merchantMap[merchant]) {
        merchantMap[merchant] += transaction.amount;
      } else {
        merchantMap[merchant] = transaction.amount;
      }
    });

    return Object.keys(merchantMap).map((merchant) => ({
      name: merchant,
      value: merchantMap[merchant],
    }));
  };

  // Filter transactions based on viewType
  // const getFilteredTransactions = () => {
  //   return transactions;
  // };

  // Custom tooltip for the pie chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-2 border border-gray-700 rounded shadow-lg">
          <p className="text-white font-medium">{`${payload[0].name}`}</p>
          <p className="text-green-400">{`$${payload[0].value.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Tabs
          defaultValue="category"
          value={viewType}
          onValueChange={setViewType}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger
              value="category"
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-green-400"
            >
              By Category
            </TabsTrigger>
            <TabsTrigger
              value="merchant"
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-green-400"
            >
              By Merchant
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Label htmlFor="timeframe" className="text-white whitespace-nowrap">
            Time Frame:
          </Label>
          <Select value={timeFrame} onValueChange={setTimeFrame}>
            <SelectTrigger
              id="timeframe"
              className="bg-gray-800 border-gray-700 text-white w-full sm:w-[150px]"
            >
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem
                value="monthly"
                className="hover:bg-gray-700 focus:bg-gray-700"
              >
                Monthly
              </SelectItem>
              <SelectItem
                value="yearly"
                className="hover:bg-gray-700 focus:bg-gray-700"
              >
                Yearly
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">
            {viewType === "category"
              ? "Spending by Category"
              : "Spending by Merchant"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(value) => (
                    <span className="text-white">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
