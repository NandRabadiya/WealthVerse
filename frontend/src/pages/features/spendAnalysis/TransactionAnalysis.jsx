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
import api from "../../../api/api"; // Adjust the import path as necessary

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
  const [monthlySummary, setMonthlySummary] = useState(null);
  const [chartData, setChartData] = useState([]);
   const [viewType, setViewType] = useState("category"); // category or merchant
  const [selectedYearMonth, setSelectedYearMonth] = useState(
    `${new Date().getFullYear()}-${(new Date().getMonth() + 1)
      .toString()
      .padStart(2, "0")}`
  );
  const [isLoading, setIsLoading] = useState(false);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Generate year-month options for the last 12 months
  const getYearMonthOptions = () => {
    const options = [];
    const now = new Date();

    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const yearMonth = `${d.getFullYear()}-${(d.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
      options.push({
        value: yearMonth,
        label: `${monthNames[d.getMonth()]} ${d.getFullYear()}`,
      });
    }

    return options;
  };

  const yearMonthOptions = getYearMonthOptions();

  // Helper function to format category names for display
  const formatCategoryName = (categoryName) => {
    return categoryName
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Fetch monthly summary data from the API
  const fetchMonthlySummary = async (yearMonth) => {
    setIsLoading(true);
    try {
      const response = await api.get(`/reports/monthly/${yearMonth}`);
      setIsLoading(false);
      return response.data;
    } catch (error) {
      console.error("Error fetching monthly summary:", error);
      setIsLoading(false);
      return null;
    }
  };

  // Load data when selected month changes
  useEffect(() => {
    const loadData = async () => {
      const data = await fetchMonthlySummary(selectedYearMonth);
      if (data) {
        setMonthlySummary(data);
      }
    };

    loadData();
  }, [selectedYearMonth]);

  // Process data for the chart when monthly summary changes
  useEffect(() => {
    if (!monthlySummary) return;

    // Format data for the pie chart based on category data
    if (viewType === "category") {
      const categoryData = monthlySummary.categorySummaries.map((category) => ({
        name: formatCategoryName(category.categoryName),
        value: category.totalAmount,
      }));
      setChartData(categoryData);
    }
    // For merchant view, we would need a different API or data structure
    // This is a placeholder for when that data becomes available
    else if (viewType === "merchant") {
      // For now, we'll just leave the chart empty when merchant view is selected
      setChartData([]);
    }
  }, [monthlySummary, viewType]);

  // Custom tooltip for the pie chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 p-2 border border-gray-700 rounded shadow-lg">
          <p className="text-white font-medium">{data.name}</p>
          <p className="text-green-400">${data.value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Tabs
          value={viewType}
          onValueChange={setViewType}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid w-full grid-cols-1bg-gray-800">
            <TabsTrigger
              value="category"
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-green-400 cursor-pointer"
            >
              By Category
            </TabsTrigger>
            {/* <TabsTrigger
              value="merchant"
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-green-400 cursor-pointer"
            >
              By Merchant
            </TabsTrigger> */}
          </TabsList>
        </Tabs>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Label htmlFor="yearMonth" className="text-white whitespace-nowrap">
            Select Month:
          </Label>
          <Select
            value={selectedYearMonth}
            onValueChange={(value) => setSelectedYearMonth(value)}
          >
            <SelectTrigger
              id="yearMonth"
              className="cursor-pointer bg-gray-800 border-gray-700 text-white w-full sm:w-[180px]"
            >
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white ">
              {yearMonthOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="cursor-pointer focus:bg-gray-300 focus:text-black"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="text-center py-12">
          <p className="text-white">Loading data...</p>
        </div>
      )}

      {/* No data state */}
      {!isLoading && (!monthlySummary || chartData.length === 0) && (
        <div className="text-center py-12">
          <p className="text-white">
            {viewType === "merchant"
              ? "Merchant data is not available yet."
              : "No data available for the selected month."}
          </p>
        </div>
      )}

      {/* Chart */}
      {!isLoading && monthlySummary && chartData.length > 0 && (
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
      )}

      {/* Summary Card */}
      {!isLoading && monthlySummary && (
        <Card className="bg-gray-900 border-gray-800 mt-4">
          <CardHeader>
            <CardTitle className="text-white">Monthly Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400">Total Spending</p>
                <p className="text-green-400 text-2xl font-bold">
                  ${monthlySummary.totalSpending.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Categories</p>
                <p className="text-blue-400 text-2xl font-bold">
                  {monthlySummary.categorySummaries.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
