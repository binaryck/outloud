import React from "react";

interface HeaderProps {
  title?: string;
  subtitle: string;
}

export function Header({ subtitle }: HeaderProps): React.JSX.Element {
  return (
    <div className="header">
      <img
        src="/images/logo-text.png"
        alt="OutLoud Logo"
        className="header-logo"
      />
      <p className="header-subtitle">{subtitle}</p>
    </div>
  );
}

export default Header;
