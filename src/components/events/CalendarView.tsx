import { useMemo } from "react";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CalendarEvent {
  id: string;
  slug: string;
  title: string;
  start_date: string;
  event_type: string;
  is_online: boolean | null;
}

interface CalendarViewProps {
  events: CalendarEvent[];
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  onDayClick?: (date: Date) => void;
}

const eventTypeColors: Record<string, string> = {
  workshop: "bg-blue-500",
  concert: "bg-purple-500",
  exhibition: "bg-pink-500",
  festival: "bg-orange-500",
  conference: "bg-green-500",
  meetup: "bg-cyan-500",
  networking: "bg-yellow-500",
  other: "bg-gray-500",
};

const CalendarView = ({
  events,
  currentMonth,
  onMonthChange,
  onEventClick,
  onDayClick,
}: CalendarViewProps) => {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = useMemo(
    () => eachDayOfInterval({ start: calendarStart, end: calendarEnd }),
    [calendarStart, calendarEnd]
  );

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    events.forEach((event) => {
      const dateKey = event.start_date;
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(event);
    });
    return map;
  }, [events]);

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="bg-card rounded-lg border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onMonthChange(subMonths(currentMonth, 1))}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-semibold">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onMonthChange(addMonths(currentMonth, 1))}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 border-b">
        {weekDays.map((day) => (
          <div
            key={day}
            className="p-2 text-center text-sm font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const dateKey = format(day, "yyyy-MM-dd");
          const dayEvents = eventsByDate.get(dateKey) || [];
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={index}
              className={cn(
                "min-h-[100px] p-2 border-b border-r cursor-pointer hover:bg-muted/50 transition-colors",
                !isCurrentMonth && "bg-muted/20 text-muted-foreground"
              )}
              onClick={() => onDayClick?.(day)}
            >
              <div
                className={cn(
                  "w-7 h-7 flex items-center justify-center rounded-full text-sm mb-1",
                  isToday && "bg-primary text-primary-foreground font-bold"
                )}
              >
                {format(day, "d")}
              </div>

              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className={cn(
                      "text-xs px-1.5 py-0.5 rounded truncate text-white cursor-pointer hover:opacity-80",
                      eventTypeColors[event.event_type] || eventTypeColors.other
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                    title={event.title}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{dayEvents.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
