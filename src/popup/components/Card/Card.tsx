import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg" | "xl";
  hover?: boolean;
}

export function Card({
  children,
  className = "",
  padding = "lg",
  hover = true,
}: CardProps) {
  const paddingClass = `card-padding-${padding}`;
  const hoverClass = hover ? "card-hover" : "";

  return (
    <div className={`card ${paddingClass} ${hoverClass} ${className}`}>
      {children}
    </div>
  );
}
