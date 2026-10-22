import { cn } from "@/lib/utils";
import type { StatusTone } from "@/types/component.types";
import { CircleAlert, CircleCheck, Info, TriangleAlert, type LucideIcon } from "lucide-react";

const statusToneStyles: Record<StatusTone, string> = {
  default: "text-muted-foreground",
  success: "border-success bg-success-light text-success",
  warning: "border-warning bg-warning-light text-warning",
  error: "border-destructive bg-destructive-light text-destructive",
};

const statusToneIcons: Record<StatusTone, LucideIcon> = {
  default: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  error: CircleAlert,
};

interface FeedbackMessageProps {
  tone: StatusTone;
  message: string;
  className?: string;
  role?: "status" | "alert";
  "aria-live"?: "polite" | "assertive";
}

export default function FeedbackMessage({
  tone,
  message,
  className,
  role,
  "aria-live": ariaLive,
}: FeedbackMessageProps) {
  const Icon = statusToneIcons[tone];

  return (
    <div
      role={role}
      aria-live={ariaLive}
      className={cn(
        "flex max-w-sm items-start gap-2 rounded-md border px-3 py-2 text-lg font-bold",
        statusToneStyles[tone],
        className,
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
