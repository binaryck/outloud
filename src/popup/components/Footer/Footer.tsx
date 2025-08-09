import React from "react";

interface FooterProps {
  isReady?: boolean;
}

export function Footer({ isReady = true }: FooterProps): React.JSX.Element {
  return (
    <div className="footer">
      <div className="footer-content">
        <span>Powered by DUSM</span>
        <div className="status-indicator">
          <div className="pulse-dot"></div>
          <span>{isReady ? "Bitcoin Ready" : "Connecting..."}</span>
        </div>
      </div>
    </div>
  );
}

export default Footer;
