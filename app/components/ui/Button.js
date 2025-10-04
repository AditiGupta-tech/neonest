import React from "react";
import { Slot } from "@radix-ui/react-slot";

const variantClasses = {
  default: "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600",
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  destructive: "bg-red-500 text-white hover:bg-red-600",
  outline: "border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100",
  secondary: "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700",
  ghost: "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100",
  link: "text-blue-600 dark:text-blue-400 underline-offset-4 hover:underline",
};

const sizeClasses = {
  primary: "h-10 px-4 py-2 min-h-[44px] sm:min-h-[40px]",
  sm: "h-9 rounded-md px-3 min-h-[44px] sm:min-h-[36px]",
  lg: "h-11 rounded-md px-8 min-h-[44px] sm:min-h-[44px]",
  icon: "h-10 w-10 min-h-[44px] min-w-[44px] sm:min-h-[40px] sm:min-w-[40px]",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-sm sm:text-base";

const Button = React.forwardRef(function Button(
  {
    className = "",
    variant = "default",
    size = "primary",
    asChild = false,
    ...props
  },
  ref
) {
  const Comp = asChild ? Slot : "button";
  const finalClassName = [
    baseClasses,
    variantClasses[variant] || variantClasses.primary,
    sizeClasses[size] || sizeClasses.primary,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <Comp className={finalClassName} ref={ref} {...props} />;
});

export default Button;
