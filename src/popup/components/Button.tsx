import React from "react";

interface ButtonProps {
  onClick: () => void;
  text?: string;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  fullWidth?: boolean;
}

export function Button({
  onClick,
  text = "Inscribe on Bitcoin",
  disabled = false,
  variant = "primary",
  fullWidth = false,
}: ButtonProps): React.JSX.Element {
  const getButtonClasses = () => {
    let classes = `btn-${variant}`;
    if (fullWidth) classes += " btn-full";
    if (disabled) classes += " opacity-60";
    return classes;
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={getButtonClasses()}
    >
      🔗 {text}
    </button>
  );
}

export default Button;
