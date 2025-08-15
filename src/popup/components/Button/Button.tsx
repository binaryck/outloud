import React from "react";

interface ButtonProps {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  text?: string;
  icon?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  fullWidth?: boolean;
  animated?: boolean;
}

export function Button({
  onClick,
  type = "button",
  text = "Inscribe on Bitcoin",
  icon = true,
  disabled = false,
  variant = "primary",
  fullWidth = false,
  animated = false,
}: ButtonProps): React.JSX.Element {
  const getButtonClasses = () => {
    let classes = `btn-${variant}`;
    if (fullWidth) classes += " btn-full";
    if (disabled) classes += " opacity-60";
    if (animated && variant === "primary") classes += " btn-pulse";
    return classes;
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={getButtonClasses()}
    >
      {icon && <span>🔗</span>} {text}
    </button>
  );
}

export default Button;
