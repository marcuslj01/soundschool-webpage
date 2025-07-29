import React from "react";

interface BadgeProps {
  text: string;
  style: "blue" | "yellow" | "gray" | "green" | "indigo";
}

function Badge(props: BadgeProps) {
  const style =
    props.style === "blue"
      ? "bg-blue-500/10 text-blue-500 text-xs sm:text-sm"
      : props.style === "yellow"
        ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500"
        : props.style === "green"
          ? "bg-green-500/10 text-green-500 border border-green-500"
          : props.style === "indigo"
            ? "bg-indigo-500/10 text-indigo-500 border border-indigo-500"
            : "bg-gray-400/10 text-gray-400 text-xs sm:text-sm"; // Default to gray
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium max-h-8 max-w-fit ${style}`}
    >
      {props.text}
    </span>
  );
}

export default Badge;
