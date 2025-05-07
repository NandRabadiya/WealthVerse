import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { CheckCircle, TreesIcon as Tree, Wind, Recycle } from "lucide-react";

// Sample offset projects
const offsetProjects = [
  {
    id: 1,
    name: "Plant 5 trees",
    description: "Support reforestation efforts in degraded areas",
    offset: 50,
    cost: 50,
    icon: Tree,
  },
  {
    id: 2,
    name: "Support renewable energy project",
    description: "Fund solar and wind energy installations",
    offset: 100,
    cost: 100,
    icon: Wind,
  },
  {
    id: 3,
    name: "Sponsor waste management",
    description: "Support recycling and waste reduction initiatives",
    offset: 70,
    cost: 75,
    icon: Recycle,
  },
];

// Sample offset history
const offsetHistory = [
  {
    id: 1,
    date: "Apr 20, 2025",
    project: "Tree Planting Initiative",
    amount: 100,
    offset: 100,
  },
  {
    id: 2,
    date: "Mar 15, 2025",
    project: "Wind Energy Project",
    amount: 200,
    offset: 180,
  },
];

const OffsetsTab = () => {
  const [history, setHistory] = useState(offsetHistory);
  const [isContributing, setIsContributing] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState(null);

  const handleContribute = (project) => {
    setIsContributing(true);
    setActiveProjectId(project.id);

    // Simulate API call
    setTimeout(() => {
      const newOffset = {
        id: history.length + 1,
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        project: project.name,
        amount: project.cost,
        offset: project.offset,
      };

      setHistory([newOffset, ...history]);
      setIsContributing(false);
      setActiveProjectId(null);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Recommended Offset Actions */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">
            Recommended Carbon Offset Actions
          </CardTitle>
          <CardDescription className="text-gray-400">
            Based on your monthly carbon footprint of 235 kg CO₂e, here are some
            ways you can offset your impact:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {offsetProjects.map((project) => (
              <Card key={project.id} className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <project.icon className="h-8 w-8 text-green-400" />
                    <Badge
                      variant="outline"
                      className="bg-green-400/10 text-green-400 border-green-400/20"
                    >
                      {project.offset}kg CO₂ offset
                    </Badge>
                  </div>
                  <CardTitle className="text-white text-lg mt-2">
                    {project.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-400 text-sm">{project.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">
                      ₹{project.cost}
                    </span>
                    <Button
                      onClick={() => handleContribute(project)}
                      disabled={isContributing}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      {isContributing && activeProjectId === project.id
                        ? "Processing..."
                        : "Contribute"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <h3 className="text-white font-medium">All Partners Verified</h3>
            </div>
            <p className="text-gray-300">
              We partner only with certified carbon offset projects that meet
              international standards for verification, permanence, and
              additionality.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Offset History */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Your Offset History</CardTitle>
        </CardHeader>
        <CardContent>
          {history.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800 hover:bg-gray-900">
                  <TableHead className="text-gray-400">Date</TableHead>
                  <TableHead className="text-gray-400">Project</TableHead>
                  <TableHead className="text-gray-400 text-right">
                    Amount
                  </TableHead>
                  <TableHead className="text-gray-400 text-right">
                    CO₂ Offset
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item) => (
                  <TableRow
                    key={item.id}
                    className="border-gray-800 hover:bg-gray-800"
                  >
                    <TableCell className="text-white">{item.date}</TableCell>
                    <TableCell className="text-white font-medium">
                      {item.project}
                    </TableCell>
                    <TableCell className="text-right text-white">
                      ₹{item.amount}
                    </TableCell>
                    <TableCell className="text-right font-medium text-green-400">
                      {item.offset}kg
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">
                You haven't made any carbon offset contributions yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OffsetsTab;
