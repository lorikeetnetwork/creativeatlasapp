import { differenceInDays, differenceInHours, isPast, format } from "date-fns";
import { Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeadlineCountdownProps {
  deadline: string;
  className?: string;
  showIcon?: boolean;
}

const DeadlineCountdown = ({
  deadline,
  className,
  showIcon = true,
}: DeadlineCountdownProps) => {
  const deadlineDate = new Date(deadline);
  const now = new Date();

  if (isPast(deadlineDate)) {
    return (
      <div
        className={cn(
          "flex items-center gap-1.5 text-destructive",
          className
        )}
      >
        {showIcon && <AlertCircle className="h-4 w-4" />}
        <span>Deadline passed</span>
      </div>
    );
  }

  const daysLeft = differenceInDays(deadlineDate, now);
  const hoursLeft = differenceInHours(deadlineDate, now);

  let text: string;
  let isUrgent = false;

  if (daysLeft === 0) {
    if (hoursLeft <= 1) {
      text = "Less than 1 hour left";
      isUrgent = true;
    } else {
      text = `${hoursLeft} hours left`;
      isUrgent = true;
    }
  } else if (daysLeft === 1) {
    text = "1 day left";
    isUrgent = true;
  } else if (daysLeft <= 3) {
    text = `${daysLeft} days left`;
    isUrgent = true;
  } else if (daysLeft <= 7) {
    text = `${daysLeft} days left`;
  } else {
    text = `Deadline: ${format(deadlineDate, "MMM d, yyyy")}`;
  }

  return (
    <div
      className={cn(
        "flex items-center gap-1.5",
        isUrgent ? "text-destructive" : "text-muted-foreground",
        className
      )}
    >
      {showIcon && <Clock className="h-4 w-4" />}
      <span>{text}</span>
    </div>
  );
};

export default DeadlineCountdown;
