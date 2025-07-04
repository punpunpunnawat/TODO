import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: string;
  backgroundColor?: string;
}

const Button: React.FC<ButtonProps> = ({ variant, backgroundColor, className, children, ...props }) => {
  let variantClass = "";
  let backgroundColorClass = "";

  switch (variant) {
    case "navigate":
      variantClass = "p-0 text-light_text_primary cursor-pointer";
      break;
    default:
      variantClass = "h-10 px-5 text-light_text_primary light_border hover:brightness-80 active:brightness-60 cursor-pointer duration-300";
      break;
  }

  switch (backgroundColor) {
    case "trasparecy":
      backgroundColorClass = "bg-transparent";
      break;
    default:
      backgroundColorClass = "bg-light_main";
      break;
  }

  return (
    <button
      className={`${variantClass} ${backgroundColorClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
