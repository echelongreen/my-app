import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CustomBadgeProps {
  variant: "active" | "completed" | "on_hold";
  children: React.ReactNode;
  className?: string;
}

const variantStyles = {
  active: "bg-blue-100 text-blue-800 hover:bg-blue-100/80",
  completed: "bg-green-100 text-green-800 hover:bg-green-100/80",
  on_hold: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80",
};

export function CustomBadge({ variant, children, className }: CustomBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(variantStyles[variant], className)}
    >
      {children}
    </Badge>
  );
} 