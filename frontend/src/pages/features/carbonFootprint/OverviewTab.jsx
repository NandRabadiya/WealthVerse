import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { Leaf, AlertTriangle, TrendingDown } from "lucide-react";
import api from "../../../api/api"; // Import the API like in TransactionAnalysis
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Label } from "@/components/ui/Label";

// Sample data for the bar chart - keeping this as is for now
const barData = [
  { name: "Jan", spending: 1200, footprint: 180 },
  { name: "Feb", spending: 1500, footprint: 210 },
  { name: "Mar", spending: 1100, footprint: 160 },
  { name: "Apr", spending: 1800, footprint: 250 },
  { name: "May", spending: 1300, footprint: 190 },
  { name: "Jun", spending: 1600, footprint: 230 },
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

const OverviewTab = () => {
  const [monthlySummary, setMonthlySummary] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedYearMonth, setSelectedYearMonth] = useState(
    `${new Date().getFullYear()}-${(new Date().getMonth() + 1)
      .toString()
      .padStart(2, "0")}`
  );

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
    const categoryData = monthlySummary.categorySummaries.map((category, index) => ({
      name: formatCategoryName(category.categoryName),
      value: category.totalEmission,
      color: COLORS[index % COLORS.length],
    }));
    setChartData(categoryData);
  }, [monthlySummary]);

  // Custom tooltip for the pie chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 p-2 border border-gray-700 rounded shadow-lg">
          <p className="text-white font-medium">{data.name}</p>
          <p className="text-green-400">{data.value.toFixed(2)} kg CO₂</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Month Selector */}
      <div className="flex justify-end items-center space-x-2">
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
          <SelectContent className="bg-gray-800 border-gray-700 text-white">
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

      {/* Understanding Your Carbon Footprint */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-400" />
            Understanding Your Carbon Footprint
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-300">
            Your carbon footprint is the total amount of greenhouse gases
            (primarily carbon dioxide) that your activities produce. By tracking
            your spending, we can estimate the environmental impact of your
            purchases and lifestyle choices.
          </p>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h3 className="text-white font-medium mb-2 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              Why It Matters
            </h3>
            <p className="text-gray-300">
              Climate change is one of the most pressing challenges of our time.
              By understanding your carbon footprint, you can make more informed
              choices and take steps to reduce your environmental impact. Small
              changes in your daily habits can make a significant difference
              when adopted collectively.
            </p>
          </div>
        </CardContent>
      </Card>

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
            No data available for the selected month.
          </p>
        </div>
      )}

      {/* Metrics Cards */}
      {!isLoading && monthlySummary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Monthly Footprint */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardDescription className="text-gray-400">
                Monthly Footprint
              </CardDescription>
              <CardTitle className="text-3xl text-white">
                {monthlySummary.totalEmission.toFixed(2)} kg
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-green-400 flex items-center">
                <TrendingDown className="h-4 w-4 mr-1" />
                12% less than last month
              </div>
            </CardContent>
          </Card>

          {/* YTD Total */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardDescription className="text-gray-400">
                YTD Total
              </CardDescription>
              <CardTitle className="text-3xl text-white">1,245 kg</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-blue-400">
                On track for 3,200 kg this year
              </div>
            </CardContent>
          </Card>

          {/* Carbon Intensity */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardDescription className="text-gray-400">
                Carbon Intensity
              </CardDescription>
              <CardTitle className="text-3xl text-white">Medium</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress
                value={65}
                className="h-2 bg-gray-700"
                indicatorClassName="bg-yellow-500"
              />
              <div className="text-sm text-gray-400 mt-2">
                65/100 - Better than 45% of users
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts */}
      {!isLoading && monthlySummary && chartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">
                Your Carbon Footprint Breakdown
              </CardTitle>
              <CardDescription className="text-gray-400">
                Where your environmental impact comes from
              </CardDescription>
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
                        <Cell key={`cell-${index}`} fill={entry.color} />
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

          {/* Bar Chart */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Footprint vs. Finances</CardTitle>
              <CardDescription className="text-gray-400">
                Comparing your spending with your carbon impact
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis yAxisId="left" orientation="left" stroke="#60a5fa" />
                    <YAxis yAxisId="right" orientation="right" stroke="#4ade80" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        borderColor: "#374151",
                        color: "#fff",
                      }}
                      formatter={(value, name) => {
                        if (name === "spending") return [`₹${value}`, "Spending"];
                        return [`${value} kg`, "Carbon Footprint"];
                      }}
                    />
                    <Legend
                      formatter={(value) => {
                        if (value === "spending")
                          return (
                            <span className="text-blue-400">Spending (₹)</span>
                          );
                        return (
                          <span className="text-green-400">
                            Carbon Footprint (kg)
                          </span>
                        );
                      }}
                    />
                    <Bar
                      yAxisId="left"
                      dataKey="spending"
                      fill="#60a5fa"
                      name="spending"
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="footprint"
                      fill="#4ade80"
                      name="footprint"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default OverviewTab;