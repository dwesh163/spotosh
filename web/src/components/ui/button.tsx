import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-display font-bold transition-all disabled:opacity-25 disabled:cursor-not-allowed active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-accent text-black rounded-xl hover:opacity-90",
        ghost: "bg-transparent text-muted rounded-full hover:bg-white/10 hover:text-foreground",
        icon: "bg-transparent text-muted rounded-full hover:bg-white/10 hover:text-foreground border-none cursor-pointer",
      },
      size: {
        default: "px-5 py-3 text-sm",
        sm: "px-3 py-2 text-xs",
        icon: "w-10 h-10",
        "icon-sm": "w-7 h-7",
        "icon-lg": "w-[54px] h-[54px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
    );
  }
);

Button.displayName = "Button";
