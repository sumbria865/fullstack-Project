import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
};

export default function Button({
  children,
  className,
  variant = "primary",
  loading = false,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "w-full py-2 rounded-lg font-medium transition focus:outline-none focus:ring-2";

  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
    secondary:
      "bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400",
    danger:
      "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
  };

  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        baseStyles,
        variants[variant],
        (disabled || loading) && "opacity-60 cursor-not-allowed",
        className
      )}
      {...props}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}
