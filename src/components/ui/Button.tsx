import React from "react";

interface ButtonProps {
  text: string;
  style: "primary" | "secondary";
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

function Button(props: ButtonProps) {
  return (
    <div>
      {props.style === "primary" ? (
        <button
          type={props.type}
          className="h-12 rounded-md truncate bg-primary px-1 sm:px-3 py-2 text-md sm:text-lg font-semibold text-white shadow-xs hover:bg-primary/80 hover:scale-102 focus-visible:outline-2 focus-visible:outline-offset-2 cursor-pointer"
          onClick={props.onClick}
          disabled={props.disabled}
        >
          {props.text}
        </button>
      ) : (
        <button
          type={props.type}
          className="h-12 rounded-md border-2 truncate border-white px-1 sm:px-3 py-2 text-md sm:text-lg font-semibold text-white shadow-xs hover:bg-gray-800/50 hover:scale-102 focus-visible:outline-2 focus-visible:outline-offset-2 cursor-pointer"
          onClick={props.onClick}
          disabled={props.disabled}
        >
          {props.text}
        </button>
      )}
    </div>
  );
}

export default Button;
