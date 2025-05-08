import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Github, Linkedin } from "lucide-react";

// Team data
const teamMembers = [
  {
    id: 1,
    name: "Shaily Fadadu",
    role: "Frontend",
    github: "https://github.com/shailifadadu",
    linkedin: "https://www.linkedin.com/in/shailyfadadu/",
  },
  {
    id: 2,
    name: "Venu Virparia",
    role: "API Integration | Frontend",
    github: "https://github.com/VenuVirparia",
    linkedin: "https://www.linkedin.com/in/venu-virparia/",
  },
  {
    id: 3,
    name: "Nand Rabadiya",
    role: "Team Coordination | Backend | Deployment",
    github: "https://github.com/NandRabadiya",
    linkedin: "https://www.linkedin.com/in/nand-rabadiya/",
  },
  {
    id: 4,
    name: "Kunj Vasoya",
    role: "Backend",
    github: "https://github.com/kunjvasoya03",
    linkedin: "https://www.linkedin.com/in/kunj-vasoya-76bbb4264/",
  },
];

export default function TeamPage() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-2 pt-6">
      {teamMembers.map((member) => (
        <Card
          key={member.id}
          className="bg-gradient-to-br from-blue-900 to-gray-800 text-white rounded-2xl shadow-md hover:shadow-green-400/40 transition-transform transform hover:scale-[1.02]"
        >
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-green-400/20 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition duration-500"></div>

          <CardHeader className="flex flex-col items-center p-4 z-10 relative">
            <CardTitle className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-400">
              {member.name}
            </CardTitle>
            <p className="text-sm text-gray-300 italic">{member.role}</p>
          </CardHeader>

          <CardContent className="flex justify-center gap-4 pb-4 z-10 relative">
            <Button
              asChild
              className="bg-blue-400 hover:bg-blue-600 text-white rounded-full p-2 transition duration-300 transform hover:scale-110 shadow-sm"
            >
              <a href={member.github} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
              </a>
            </Button>
            <Button
              asChild
              className="bg-blue-400 hover:bg-blue-500 text-white rounded-full p-2 transition duration-300 transform hover:scale-110 shadow-sm"
            >
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
