import React, { useState } from "react";

interface SearchToolbarProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (address: string) => void;
  loading?: boolean;
}

export function SearchToolbar({
  isOpen,
  onClose,
  onSearch,
  loading = false,
}: SearchToolbarProps) {
  const [address, setAddress] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      onSearch(address.trim());
    }
  };

  const handleBackToHome = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="search-toolbar">
      <div className="search-toolbar-header">
        <button className="back-to-home-btn" onClick={handleBackToHome}>
          <span className="back-arrow">←</span>
          <span>Home</span>
        </button>
        <button className="close-toolbar-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="search-toolbar-content">
        <div className="search-title">Search Bitcoin Feed</div>
        <form onSubmit={handleSubmit} className="search-form">
          <div className="search-input-group">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter Bitcoin address..."
              className="search-input"
              disabled={loading}
            />
            <button
              type="submit"
              className="search-button"
              disabled={loading || !address.trim()}
            >
              {loading ? (
                <span className="loading-spinner">⟳</span>
              ) : (
                "Search Feed"
              )}
            </button>
          </div>
        </form>
        <div className="search-hint">
          Enter any Bitcoin address to view their social media feed preserved on
          the blockchain
        </div>
      </div>
    </div>
  );
}
