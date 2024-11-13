import { ProjectFormData } from "@/actions/projects";
import { projectSchema } from "@/schemas/projectSchema";
import { createProject } from "@/actions/projects";
import { useSession } from "next-auth/react";
import { useQueryClient } from "react-query";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";

const { data: session } = useSession();
const queryClient = useQueryClient();
const { toast } = useToast();
const {
  register,
  handleSubmit,
  formState: { errors },
  reset,
} = useForm<ProjectFormData>();

const [open, setOpen] = useState(false);
const [isLoading, setIsLoading] = useState(false);

const onSubmit = async (values: z.infer<typeof projectSchema>) => {
  if (!session?.user?.id) return;
  
  try {
    setIsLoading(true);
    const formData: ProjectFormData = {
      ...values,
      user_id: session.user.id,
      // Optionally parse and format dates if necessary
      start_date: new Date(values.start_date).toISOString(),
      end_date: new Date(values.end_date).toISOString(),
    };

    const result = await createProject(formData);

    if (result.success) {
      toast({
        title: "Success",
        description: "Project created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setOpen(false);
      reset();
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to create project",
        variant: "destructive",
      });
    }
  } catch (error) {
    console.error('Error creating project:', error);
    toast({
      title: "Error",
      description: "Something went wrong",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
}

// Rest of your code... 