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

// Sample data for the pie chart
const pieData = [
  { name: "Transportation", value: 120, color: "#4ade80" },
  { name: "Food & Dining", value: 45, color: "#60a5fa" },
  { name: "Shopping", value: 30, color: "#f87171" },
  { name: "Utilities", value: 25, color: "#facc15" },
  { name: "Entertainment", value: 15, color: "#a78bfa" },
];

// Sample data for the bar chart
const barData = [
  { name: "Jan", spending: 1200, footprint: 180 },
  { name: "Feb", spending: 1500, footprint: 210 },
  { name: "Mar", spending: 1100, footprint: 160 },
  { name: "Apr", spending: 1800, footprint: 250 },
  { name: "May", spending: 1300, footprint: 190 },
  { name: "Jun", spending: 1600, footprint: 230 },
];

const OverviewTab = () => {
  return (
    <div className="space-y-8">
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

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Monthly Footprint */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-gray-400">
              Monthly Footprint
            </CardDescription>
            <CardTitle className="text-3xl text-white">235 kg</CardTitle>
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

      {/* Charts */}
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
                    data={pieData}
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
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderColor: "#374151",
                      color: "#fff",
                    }}
                    formatter={(value) => [`${value} kg CO₂`, null]}
                  />
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
    </div>
  );
};

export default OverviewTab;
