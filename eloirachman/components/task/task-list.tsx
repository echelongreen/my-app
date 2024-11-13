"use client";

import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Flag } from "lucide-react";

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_date: string | null;
};

const priorityColors = {
  low: "bg-gray-500",
  medium: "bg-blue-500",
  high: "bg-red-500",
};

const statusColors = {
  pending: "bg-yellow-500",
  in_progress: "bg-blue-500",
  completed: "bg-green-500",
};

export function TaskList({ tasks }: { tasks: Task[] }) {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{task.title}</CardTitle>
              <div className="flex gap-2">
                <Badge className={statusColors[task.status as keyof typeof statusColors]}>
                  {task.status.replace("_", " ")}
                </Badge>
                <Badge className={priorityColors[task.priority as keyof typeof priorityColors]}>
                  {task.priority}
                </Badge>
              </div>
            </div>
            {task.description && (
              <CardDescription>{task.description}</CardDescription>
            )}
          </CardHeader>
          {task.due_date && (
            <CardContent>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Due: {format(new Date(task.due_date), "PPP")}</span>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
} 