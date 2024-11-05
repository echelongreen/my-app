import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectHeader } from "@/components/project/project-header";
import { ProjectTasks } from "@/components/project/project-tasks";
import { ProjectDocuments } from "@/components/project/project-documents";
import { ProjectChat } from "@/components/project/project-chat";

export default function ProjectPage({
  params: { projectId },
}: {
  params: { projectId: string };
}) {
  return (
    <div className="container py-6">
      <ProjectHeader projectId={projectId} />
      <Tabs defaultValue="tasks" className="mt-6">
        <TabsList>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>
        <TabsContent value="tasks" className="mt-6">
          <ProjectTasks projectId={projectId} />
        </TabsContent>
        <TabsContent value="documents" className="mt-6">
          <ProjectDocuments projectId={projectId} />
        </TabsContent>
        <TabsContent value="chat" className="mt-6">
          <ProjectChat projectId={projectId} />
        </TabsContent>
      </Tabs>
    </div>
  );
} 