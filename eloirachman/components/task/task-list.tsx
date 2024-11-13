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
import { Calendar, Check, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateTask } from "@/app/actions/tasks";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_date: string | null;
  assignee_id: string | null;
  assignee: {
    id: string;
    email: string;
    raw_user_meta_data: {
      full_name: string;
      avatar_url: string;
    };
  } | null;
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
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleComplete = async (taskId: string) => {
    setLoading(true);
    try {
      await updateTask({
        id: taskId,
        status: "completed",
      });
      toast({
        title: "Success",
        description: "Task marked as complete",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (taskId: string, formData: FormData) => {
    setLoading(true);
    try {
      await updateTask({
        id: taskId,
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        status: formData.get("status") as string,
        priority: formData.get("priority") as string,
      });
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
      setEditingTask(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id}>
          {editingTask === task.id ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate(task.id, new FormData(e.currentTarget));
              }}
            >
              <CardHeader>
                <div className="space-y-4">
                  <Input
                    name="title"
                    defaultValue={task.title}
                    placeholder="Task title"
                    required
                  />
                  <Textarea
                    name="description"
                    defaultValue={task.description || ""}
                    placeholder="Task description"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Select name="status" defaultValue={task.status}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select name="priority" defaultValue={task.priority}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditingTask(null)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </form>
          ) : (
            <>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{task.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        statusColors[task.status as keyof typeof statusColors]
                      }
                    >
                      {task.status.replace("_", " ")}
                    </Badge>
                    <Badge
                      className={
                        priorityColors[task.priority as keyof typeof priorityColors]
                      }
                    >
                      {task.priority}
                    </Badge>
                    {task.assignee && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Avatar className="h-8 w-8">
                            <AvatarImage 
                              src={task.assignee.raw_user_meta_data.avatar_url} 
                              alt={task.assignee.raw_user_meta_data.full_name} 
                            />
                            <AvatarFallback>
                              {task.assignee.raw_user_meta_data.full_name[0]}
                            </AvatarFallback>
                          </Avatar>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Assigned to: {task.assignee.raw_user_meta_data.full_name}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingTask(task.id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {task.status !== "completed" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleComplete(task.id)}
                        disabled={loading}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
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
            </>
          )}
        </Card>
      ))}
    </div>
  );
} 