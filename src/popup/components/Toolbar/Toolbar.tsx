import React, { useState } from "react";
import { BackArrow } from "../BackArrow/BackArrow";
import { bitmapValidator } from "@/popup/utils/bitmapValidator";

interface ToolbarProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (address: string) => void;
  loading?: boolean;
}

export function Toolbar({
  isOpen,
  onClose,
  onSearch,
  loading = false,
}: ToolbarProps) {
  const [address, setAddress] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value;
    setAddress(newAddress);

    // Clear previous validation error
    setValidationError("");

    // Validate if it's a bitmap address
    if (newAddress) {
      const error = bitmapValidator(newAddress.trim());
      if (error) {
        setValidationError(error);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!address) return;

    // Validate before submitting
    const error = bitmapValidator(address.trim());
    if (error) {
      setValidationError(error);
      return;
    }

    onSearch(address.trim());
  };

  const handleBackToHome = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="search-toolbar">
      <div className="search-toolbar-header">
        <button className="back-to-home-btn" onClick={handleBackToHome}>
          <span>
            <BackArrow size={18} strokeWidth={2} />
          </span>
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
              onChange={handleAddressChange}
              placeholder="Address, bitmap or domain"
              className={`search-input ${
                validationError ? "search-input-error" : ""
              }`}
              disabled={loading}
            />
            <button
              type="submit"
              className="search-button"
              disabled={loading || !address || !!validationError}
            >
              {loading ? (
                <span className="loading-spinner">⟳</span>
              ) : (
                "Search Feed"
              )}
            </button>
          </div>
          {validationError && (
            <div className="validation-error">{validationError}</div>
          )}
        </form>
        <div className="search-hint">
          Enter any Bitcoin address to view their social media feed preserved on
          the blockchain
        </div>
      </div>
    </div>
  );
}
