import React from "react";

const variantClasses = {
  default:
    "border-transparent bg-blue-600 text-white hover:bg-blue-700",
  secondary:
    "border-transparent bg-gray-200 text-gray-800 hover:bg-gray-300",
  destructive:
    "border-transparent bg-red-600 text-white hover:bg-red-700",
  outline: "border border-gray-400 text-black",
};

function Badge({ children, className = "", variant = "default", ...props }) {
  const baseClasses =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 text-xs sm:text-sm";

  const finalClasses = `${baseClasses} ${variantClasses[variant] || variantClasses.default} ${className}`;

  return (
    <span className={finalClasses} {...props}>
      {children}
    </span>
  );
}

export default Badge;