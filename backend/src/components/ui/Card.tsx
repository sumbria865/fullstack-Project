import { ReactNode } from "react";
import clsx from "clsx";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className }: CardProps) {
  return (
    <div
      className={clsx(
        "bg-white rounded-xl shadow-md p-6",
        className
      )}
    >
      {children}
    </div>
  );
}
