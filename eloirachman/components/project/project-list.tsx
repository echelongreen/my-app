"use client";

import { useQuery } from "@tanstack/react-query";
import { ProjectCard } from "./project-card";
import { useSession } from "next-auth/react";
import { getProjects } from "@/app/actions/projects";

export function ProjectList() {
  const { data: session } = useSession();

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects", session?.user?.id],
    queryFn: () => session?.user?.id ? getProjects(session.user.id) : Promise.resolve([]),
    enabled: !!session?.user?.id,
  });

  if (isLoading) {
    return <div>Loading projects...</div>;
  }

  if (!projects?.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No projects yet</h3>
        <p className="text-muted-foreground">Create your first project to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
} 