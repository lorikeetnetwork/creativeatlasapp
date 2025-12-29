import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Layers, Moon, Sun, Satellite, Map, Mountain, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MapStyle, MarkerColorMode } from "@/hooks/useMapPreferences";

interface MapStyleControlProps {
  mapStyle: MapStyle;
  colorMode: MarkerColorMode;
  onStyleChange: (style: MapStyle) => void;
  onColorModeChange: (mode: MarkerColorMode) => void;
}

const MAP_STYLES: { id: MapStyle; label: string; icon: React.ReactNode }[] = [
  { id: "dark", label: "Dark", icon: <Moon className="w-4 h-4" /> },
  { id: "light", label: "Light", icon: <Sun className="w-4 h-4" /> },
  { id: "satellite", label: "Satellite", icon: <Satellite className="w-4 h-4" /> },
  { id: "streets", label: "Streets", icon: <Map className="w-4 h-4" /> },
  { id: "outdoors", label: "Outdoors", icon: <Mountain className="w-4 h-4" /> },
];

const COLOR_MODES: { id: MarkerColorMode; label: string; color: string }[] = [
  { id: "category", label: "Category", color: "bg-gradient-to-r from-purple-500 via-green-500 to-orange-500" },
  { id: "mono", label: "Mono", color: "bg-primary" },
  { id: "highContrast", label: "High Contrast", color: "bg-white border border-foreground" },
];

export function MapStyleControl({
  mapStyle,
  colorMode,
  onStyleChange,
  onColorModeChange,
}: MapStyleControlProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="h-10 w-10 bg-background/90 backdrop-blur-sm border border-border shadow-lg hover:bg-background"
        >
          <Layers className="w-5 h-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 p-3" sideOffset={8}>
        <div className="space-y-4">
          {/* Map Style Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
              <Map className="w-3 h-3" />
              Map Style
            </div>
            <div className="grid grid-cols-5 gap-1">
              {MAP_STYLES.map((style) => (
                <Button
                  key={style.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => onStyleChange(style.id)}
                  className={cn(
                    "flex flex-col items-center justify-center h-14 p-1 gap-1",
                    mapStyle === style.id && "bg-primary/10 ring-1 ring-primary"
                  )}
                  title={style.label}
                >
                  {style.icon}
                  <span className="text-[10px] leading-none">{style.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Color Mode Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
              <Palette className="w-3 h-3" />
              Marker Colors
            </div>
            <div className="flex gap-2">
              {COLOR_MODES.map((mode) => (
                <Button
                  key={mode.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => onColorModeChange(mode.id)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 h-9",
                    colorMode === mode.id && "bg-primary/10 ring-1 ring-primary"
                  )}
                >
                  <div className={cn("w-3 h-3 rounded-full", mode.color)} />
                  <span className="text-xs">{mode.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
