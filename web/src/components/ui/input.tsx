import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full px-10 py-[11px] rounded-xl bg-card border border-outline text-foreground text-base font-display outline-none transition-colors placeholder:text-muted",
      "focus:border-accent",
      className
    )}
    {...props}
  />
));

Input.displayName = "Input";
