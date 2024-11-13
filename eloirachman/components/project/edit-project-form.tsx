"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Pencil, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { updateProject } from "@/app/actions/projects";

type Project = {
  id: string;
  name: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
};

export function EditProjectForm({ project }: { project: Project }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || "");
  const [startDate, setStartDate] = useState<Date | undefined>(
    project.start_date ? new Date(project.start_date) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    project.end_date ? new Date(project.end_date) : undefined
  );
  const { toast } = useToast();

  // Reset form when project changes
  useEffect(() => {
    setName(project.name);
    setDescription(project.description || "");
    setStartDate(project.start_date ? new Date(project.start_date) : undefined);
    setEndDate(project.end_date ? new Date(project.end_date) : undefined);
  }, [project]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      await updateProject({
        id: project.id,
        name,
        description,
        startDate,
        endDate,
      });

      toast({
        title: "Success",
        description: "Project updated successfully",
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    setName(project.name);
    setDescription(project.description || "");
    setStartDate(project.start_date ? new Date(project.start_date) : undefined);
    setEndDate(project.end_date ? new Date(project.end_date) : undefined);
    setIsEditing(false);
  }

  if (!isEditing) {
    return (
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0"
          onClick={() => setIsEditing(true)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold mb-2">{name}</h1>
        {description && (
          <p className="text-gray-600 mb-6">{description}</p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Edit Project</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCancel}
          type="button"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Project name"
          required
        />
      </div>

      <div className="space-y-2">
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Project description"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : "Start date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : "End date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
} 