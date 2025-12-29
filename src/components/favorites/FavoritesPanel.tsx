import { useState } from "react";
import { Heart, FolderPlus, ChevronRight, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import type { FavoriteList } from "@/hooks/useFavoriteLists";
import type { UserFavorite } from "@/hooks/useFavorites";

interface FavoritesPanelProps {
  favorites: UserFavorite[];
  lists: FavoriteList[];
  showFavoritesOnly: boolean;
  onToggleShowFavorites: () => void;
  onCreateList: (name: string) => Promise<FavoriteList | null>;
  onDeleteList: (listId: string) => Promise<boolean>;
  getListItems: (listId: string) => string[];
  onSelectList?: (listId: string | null) => void;
  selectedListId?: string | null;
}

export function FavoritesPanel({
  favorites,
  lists,
  showFavoritesOnly,
  onToggleShowFavorites,
  onCreateList,
  onDeleteList,
  getListItems,
  onSelectList,
  selectedListId,
}: FavoritesPanelProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  const handleCreateList = async () => {
    if (!newListName.trim()) return;
    await onCreateList(newListName.trim());
    setNewListName("");
    setIsCreating(false);
  };

  return (
    <div className="space-y-2">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between px-2 h-8 text-xs font-bold uppercase tracking-wider text-foreground hover:bg-muted"
          >
            <div className="flex items-center gap-2">
              <Star className="w-3.5 h-3.5" />
              My Favorites
            </div>
            <ChevronRight
              className={cn(
                "w-4 h-4 transition-transform",
                isOpen && "rotate-90"
              )}
            />
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="space-y-1 pt-1">
          {/* Show Favorites Only Toggle */}
          <Button
            variant={showFavoritesOnly ? "default" : "outline"}
            size="sm"
            onClick={onToggleShowFavorites}
            className="w-full justify-start gap-2 h-9 text-xs"
          >
            <Heart className={cn("w-4 h-4", showFavoritesOnly && "fill-current")} />
            Show Favorites Only
            <span className="ml-auto bg-muted text-muted-foreground px-1.5 py-0.5 rounded text-[10px]">
              {favorites.length}
            </span>
          </Button>

          {/* All Favorites */}
          <Button
            variant={selectedListId === null && !showFavoritesOnly ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onSelectList?.(null)}
            className="w-full justify-start gap-2 h-9 text-xs"
          >
            <Heart className="w-4 h-4" />
            All Favorites
            <span className="ml-auto text-muted-foreground text-[10px]">
              {favorites.length}
            </span>
          </Button>

          {/* Lists */}
          {lists.map((list) => {
            const itemCount = getListItems(list.id).length;
            return (
              <div key={list.id} className="group flex items-center">
                <Button
                  variant={selectedListId === list.id ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => onSelectList?.(list.id)}
                  className="flex-1 justify-start gap-2 h-9 text-xs"
                >
                  <div className="w-4 h-4 rounded bg-primary/20 flex items-center justify-center">
                    <span className="text-[10px] text-primary font-bold">
                      {list.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="truncate">{list.name}</span>
                  <span className="ml-auto text-muted-foreground text-[10px]">
                    {itemCount}
                  </span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onDeleteList(list.id)}
                >
                  <Trash2 className="w-3.5 h-3.5 text-destructive" />
                </Button>
              </div>
            );
          })}

          {/* Create New List */}
          {isCreating ? (
            <div className="flex gap-1 px-1">
              <Input
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="List name"
                className="h-8 text-xs"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateList();
                  if (e.key === "Escape") {
                    setIsCreating(false);
                    setNewListName("");
                  }
                }}
              />
              <Button size="sm" className="h-8 px-2 text-xs" onClick={handleCreateList}>
                Add
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCreating(true)}
              className="w-full justify-start gap-2 h-9 text-xs text-muted-foreground"
            >
              <FolderPlus className="w-4 h-4" />
              Create New List
            </Button>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
