import { CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FieldWrapperProps {
  children: React.ReactNode;
  error?: string;
  touched?: boolean;
  isValid?: boolean;
  showValidation?: boolean;
  currentLength?: number;
  maxLength?: number;
}

export function FieldWrapper({
  children,
  error,
  touched,
  isValid,
  showValidation = true,
  currentLength,
  maxLength,
}: FieldWrapperProps) {
  const showSuccess = showValidation && touched && isValid && !error;
  const showError = touched && error;

  return (
    <div className="relative">
      {children}
      
      {/* Validation Icon */}
      {showValidation && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {showSuccess && (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          )}
          {showError && (
            <AlertCircle className="h-4 w-4 text-destructive" />
          )}
        </div>
      )}

      {/* Character Counter */}
      {maxLength && currentLength !== undefined && (
        <div className={cn(
          "text-xs text-right mt-1",
          currentLength > maxLength ? "text-destructive" : "text-muted-foreground"
        )}>
          {currentLength}/{maxLength}
        </div>
      )}

      {/* Error Message */}
      {showError && (
        <p className="text-sm text-destructive mt-1 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
}
