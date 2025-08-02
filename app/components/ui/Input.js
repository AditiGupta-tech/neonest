import React from "react";

const Input = React.forwardRef(
  ({ className = "", type = "text", ...props }, ref) => {
    const baseClasses =
      "flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base placeholder-gray-500 ring-offset-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200 min-h-[44px] sm:min-h-[40px] text-sm sm:text-base";

    return (
      <input
        type={type}
        className={`${baseClasses} ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
