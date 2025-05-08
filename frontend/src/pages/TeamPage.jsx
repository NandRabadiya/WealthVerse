import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Github, Linkedin } from "lucide-react";

// Team data
const teamMembers = [
  {
    id: 1,
    name: "Shaily Fadadu",
    role: "Frontend Developer",
    photoUrl: "/images/shaily.jpg",
    github: "https://github.com/shailyfadadu",
    linkedin: "https://linkedin.com/in/shailyfadadu",
  },
  {
    id: 2,
    name: "Venu Virpariya",
    role: "Backend Developer",
    photoUrl: "/images/member2.jpg",
    github: "https://github.com/member2",
    linkedin: "https://linkedin.com/in/member2",
  },
  {
    id: 3,
    name: "Nand Rabadiya",
    role: "UI/UX Designer",
    photoUrl: "/images/member3.jpg",
    github: "https://github.com/member3",
    linkedin: "https://linkedin.com/in/member3",
  },
  {
    id: 4,
    name: "Kunj Vasoya",
    role: "Cloud Specialist",
    photoUrl: "/images/member4.jpg",
    github: "https://github.com/member4",
    linkedin: "https://linkedin.com/in/member4",
  },
];

export default function TeamPage() {
  return (
    <div className="p-6 bg-gradient-to-b from-gray-900 via-black to-gray-950 min-h-screen">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 drop-shadow-lg pt-5">
        Meet the Team 🌟
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 px-4 pt-10">
        {teamMembers.map((member) => (
          <Card
            key={member.id}
            className="relative overflow-hidden group bg-gradient-to-br from-blue-900 to-gray-800 text-white rounded-3xl shadow-xl hover:shadow-green-400/50 transition-transform transform hover:scale-[1.03]"
          >
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-green-400/20 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition duration-500"></div>

            <CardHeader className="flex flex-col items-center p-6 z-10 relative">
              <div className="relative group">
                <img
                  src={member.photoUrl}
                  alt={member.name}
                  className="w-28 h-28 rounded-full object-cover border-4 border-green-400 transition duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-full border-4 border-green-500/30 group-hover:animate-ping"></div>
              </div>
              <CardTitle className="text-2xl mt-4 font-semibold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-400 ">
                {member.name}
              </CardTitle>
              <p className="text-gray-300 italic">{member.role}</p>
            </CardHeader>

            <CardContent className="flex justify-center gap-6 pb-6 z-10 relative">
              <Button
                asChild
                className="bg-blue-400 hover:bg-blue-600 text-white rounded-full p-2 transition duration-300 transform hover:scale-110 shadow-md"
              >
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-5 w-5" />
                </a>
              </Button>
              <Button
                asChild
                className="bg-blue-400 hover:bg-blue-500 text-white rounded-full p-2 transition duration-300 transform hover:scale-110 shadow-md"
              >
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
