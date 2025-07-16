import React from "react";

interface BadgeProps {
  text: string;
  style: "blue" | "yellow";
}

function Badge(props: BadgeProps) {
  const style =
    props.style === "blue"
      ? "bg-blue-500/10 text-blue-500"
      : "bg-yellow-500/10 text-yellow-500 border border-yellow-500";
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${style}`}
    >
      {props.text}
    </span>
  );
}

export default Badge;
