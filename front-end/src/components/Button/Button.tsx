import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "navigate"; // Different button styles
}

const Button: React.FC<ButtonProps> = ({ variant = "primary", className, children, ...props }) => {
  let variantClass = "";
  switch (variant) {
    case "navigate":
      variantClass = "p-0 bg-transparent text-light_text_primary underline cursor-pointer"; // Add cursor-pointer here
      break;
    default:
      variantClass = "h-10 px-5 bg-light_main text-light_text_primary light_border hover:brightness-80 active:brightness-60 cursor-pointer duration-300"; // Add cursor-pointer here
      break;
  }

  return (
    <button
      className={` ${variantClass} ${className}`}
      {...props} // Spread other props like onClick, disabled, etc.
    >
      {children}
    </button>
  );
};

export default Button;
