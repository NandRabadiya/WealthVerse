import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
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
import { Leaf, AlertTriangle, MessageSquare, TrendingDown } from "lucide-react";
import api from "../../../api/api"; // Import the API like in TransactionAnalysis
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Label } from "@/components/ui/Label";
import { Check, Copy } from "lucide-react"; // Optional icons


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
    const categoryData = monthlySummary.categorySummaries.map(
      (category, index) => ({
        name: formatCategoryName(category.categoryName),
        value: category.totalEmission,
        color: COLORS[index % COLORS.length],
      })
    );
    setChartData(categoryData);
  }, [monthlySummary]);

  // Calculate carbon intensity (kg CO₂e per $)
  const calculateCarbonIntensity = () => {
    if (!monthlySummary || monthlySummary.totalSpending === 0) return 0;
    return monthlySummary.totalEmission / monthlySummary.totalSpending;
  };

  // Get intensity level based on carbon intensity value
  const getIntensityLevel = (intensity) => {
    if (intensity === 0) return "N/A";
    if (intensity < 1) return "Low";
    if (intensity < 2) return "Medium";
    return "High";
  };

  // Get intensity progress value (0-100)
  const getIntensityProgress = (intensity) => {
    if (intensity === 0) return 0;
    // Scale from 0 to 3 kg CO₂e/$ to 0-100%
    return Math.min(Math.round((intensity / 3) * 100), 100);
  };

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

  // Calculate carbon intensity
  const carbonIntensity = calculateCarbonIntensity();
  const intensityLevel = getIntensityLevel(carbonIntensity);
  const intensityProgress = getIntensityProgress(carbonIntensity);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const questions = [
    "How can I reduce my carbon footprint from transportation?",
    "What are sustainable alternatives for my food purchases?",
    "Give few carbon offsetting tips",
    "What small changes would have the biggest impact?",
  ];

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500); // Reset after 1.5s
  };

  return (
    <div className="space-y-6">
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
        <div className="text-center py-8">
          <p className="text-white">Loading data...</p>
        </div>
      )}

      {/* No data state */}
      {!isLoading && (!monthlySummary || chartData.length === 0) && (
        <div className="text-center py-8 bg-gray-900 border border-gray-800 rounded-lg">
          <p className="text-white">
            No data available for the selected month.
          </p>
        </div>
      )}

      {/* Metrics Cards */}
      {!isLoading && monthlySummary && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Footprint */}
          <Card className="bg-gray-900 border-gray-800 h-full">
            <CardHeader className="pb-2 flex flex-col justify-center">
              <CardDescription className="text-gray-400">
                Monthly Footprint
              </CardDescription>
              <CardTitle className="text-3xl text-white">
                {monthlySummary.totalEmission.toFixed(2)} kg CO₂e
              </CardTitle>
            </CardHeader>
          </Card>

          {/* Carbon Intensity */}
          <Card className="bg-gray-900 border-gray-800 h-full">
            <CardHeader className="pb-2">
              <CardDescription className="text-gray-400">
                Carbon Intensity
              </CardDescription>
              <CardTitle className="text-3xl text-white">
                {carbonIntensity.toFixed(2)} kg CO₂e/₹
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Level:</span>
                <span
                  className={`text-sm font-medium ${
                    intensityLevel === "Low"
                      ? "text-green-400"
                      : intensityLevel === "Medium"
                      ? "text-yellow-400"
                      : intensityLevel === "High"
                      ? "text-red-400"
                      : "text-gray-400"
                  }`}
                >
                  {intensityLevel}
                </span>
              </div>
              <Progress
                value={intensityProgress}
                className="h-2 bg-gray-700 mt-2"
                indicatorClassName={`${
                  intensityLevel === "Low"
                    ? "bg-green-500"
                    : intensityLevel === "Medium"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts */}
      {!isLoading && monthlySummary && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <Card className="bg-gray-900 border-gray-800 h-full">
            <CardHeader>
              <CardTitle className="text-white">
                Your Carbon Footprint Breakdown
              </CardTitle>
              <CardDescription className="text-gray-400">
                Where your environmental impact comes from
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="w-full h-[300px]">
                {chartData.length > 0 ? (
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
                        verticalAlign="bottom"
                        align="center"
                        layout="horizontal"
                        formatter={(value) => (
                          <span className="text-white">{value}</span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-400">No category data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tips Section */}
          <Card className="bg-gray-900 border-gray-800 h-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-400" />
                Ask Your Finance Assistant
              </CardTitle>
              <CardDescription className="text-gray-400">
                Get personalized insights to reduce your carbon footprint
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-300">
                  Ask our AI assistant questions like:
                </p>
                <div className="space-y-2">
                  {questions.map((q, index) => (
                    <div
                      key={index}
                      onClick={() => handleCopy(q, index)}
                      className="relative p-3 bg-gray-800 rounded-lg border border-gray-700 cursor-pointer hover:bg-gray-750 transition-colors text-sm sm:text-base group"
                    >
                      {q}
                      <span className="absolute right-3 top-3 text-green-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        {copiedIndex === index ? (
                          <span className="flex items-center gap-1">
                            <Check size={14} /> Copied!
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-gray-400">
                            <Copy size={14} /> Click to copy
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Click on a question or type your own in the chat to get
                  personalized advice
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default OverviewTab;
