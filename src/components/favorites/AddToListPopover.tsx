import { useState } from "react";
import { Plus, Check, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { FavoriteList } from "@/hooks/useFavoriteLists";

interface AddToListPopoverProps {
  lists: FavoriteList[];
  locationId: string;
  isInList: (listId: string, locationId: string) => boolean;
  onAddToList: (listId: string, locationId: string) => Promise<boolean>;
  onRemoveFromList: (listId: string, locationId: string) => Promise<boolean>;
  onCreateList: (name: string) => Promise<FavoriteList | null>;
}

export function AddToListPopover({
  lists,
  locationId,
  isInList,
  onAddToList,
  onRemoveFromList,
  onCreateList,
}: AddToListPopoverProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [open, setOpen] = useState(false);

  const handleToggleList = async (listId: string) => {
    if (isInList(listId, locationId)) {
      await onRemoveFromList(listId, locationId);
    } else {
      await onAddToList(listId, locationId);
    }
  };

  const handleCreateList = async () => {
    if (!newListName.trim()) return;

    const list = await onCreateList(newListName.trim());
    if (list) {
      await onAddToList(list.id, locationId);
      setNewListName("");
      setIsCreating(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          title="Add to list"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 p-2" sideOffset={4}>
        <div className="space-y-1">
          <div className="text-xs font-medium text-muted-foreground px-2 py-1">
            Add to List
          </div>

          {lists.length === 0 && !isCreating && (
            <p className="text-xs text-muted-foreground px-2 py-2">
              No lists yet. Create one below.
            </p>
          )}

          {lists.map((list) => {
            const inList = isInList(list.id, locationId);
            return (
              <Button
                key={list.id}
                variant="ghost"
                size="sm"
                onClick={() => handleToggleList(list.id)}
                className={cn(
                  "w-full justify-start gap-2 h-9",
                  inList && "bg-primary/10"
                )}
              >
                {inList ? (
                  <Check className="w-4 h-4 text-primary" />
                ) : (
                  <div className="w-4 h-4 rounded border border-muted-foreground/30" />
                )}
                <span className="truncate">{list.name}</span>
              </Button>
            );
          })}

          <div className="border-t my-1" />

          {isCreating ? (
            <div className="flex gap-1 p-1">
              <Input
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="List name"
                className="h-8 text-sm"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateList();
                  if (e.key === "Escape") {
                    setIsCreating(false);
                    setNewListName("");
                  }
                }}
              />
              <Button size="sm" className="h-8 px-2" onClick={handleCreateList}>
                Add
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCreating(true)}
              className="w-full justify-start gap-2 h-9 text-muted-foreground"
            >
              <FolderPlus className="w-4 h-4" />
              Create New List
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
