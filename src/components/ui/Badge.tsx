import React from "react";

interface BadgeProps {
  text: string;
  style: "blue" | "yellow" | "gray";
}

function Badge(props: BadgeProps) {
  const style =
    props.style === "blue"
      ? "bg-blue-500/10 text-blue-500"
      : props.style === "yellow"
        ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500"
        : "bg-gray-400/10 text-gray-400"; // Default to gray
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${style}`}
    >
      {props.text}
    </span>
  );
}

export default Badge;
