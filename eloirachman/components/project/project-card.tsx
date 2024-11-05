import Link from "next/link";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CustomBadge } from "@/components/ui/custom-badge";

interface Project {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: "active" | "completed" | "on_hold";
}

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl">{project.name}</CardTitle>
            <CustomBadge variant={project.status}>
              {formatStatus(project.status)}
            </CustomBadge>
          </div>
          <CardDescription>{project.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            <p>Start: {format(new Date(project.start_date), "PPP")}</p>
            <p>End: {format(new Date(project.end_date), "PPP")}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function formatStatus(status: string) {
  return status.split("_").map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(" ");
} 