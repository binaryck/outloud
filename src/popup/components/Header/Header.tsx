import React from "react";

interface HeaderProps {
  title?: string;
  subtitle: string;
  onToggleSearch?: () => void;
}

export function Header({
  subtitle,
  onToggleSearch,
}: HeaderProps): React.JSX.Element {
  return (
    <div className="header">
      <div className="header-content">
        <img
          src="/images/logo-text.png"
          alt="OutLoud Logo"
          className="header-logo"
        />
        <p className="header-subtitle">{subtitle}</p>
      </div>
      {onToggleSearch && (
        <button className="hamburger-menu" onClick={onToggleSearch}>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      )}
    </div>
  );
}

export default Header;
