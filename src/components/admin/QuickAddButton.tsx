import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCollaboratorRole } from "@/hooks/useCollaboratorRole";

interface QuickAddButtonProps {
  onClick: () => void;
}

export function QuickAddButton({ onClick }: QuickAddButtonProps) {
  const { isMaster, loading } = useCollaboratorRole();

  // Only show for master users
  if (loading || !isMaster) {
    return null;
  }

  return (
    <Button
      onClick={onClick}
      className="h-14 px-5 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
    >
      <Plus className="w-5 h-5 mr-2" />
      Quick Add
    </Button>
  );
}
