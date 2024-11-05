import { ProjectList } from "@/components/project/project-list";
import { CreateProjectButton } from "@/components/project/create-project-button";

export default function DashboardPage() {
  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Projects</h1>
        <CreateProjectButton />
      </div>
      <ProjectList />
    </div>
  );
} 