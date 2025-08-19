import React, { useState } from "react";
import { bitmapValidator } from "@/popup/utils/bitmapValidator";
import { Card } from "../Card/Card";

interface ToolbarProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (address: string) => void;
  onBitmapExplorer?: () => void;
  onCreatePost?: () => void;
  onCreateParcel?: () => void;
  loading?: boolean;
}

export function Toolbar({
  isOpen,
  onClose,
  onSearch,
  onCreatePost,
  onBitmapExplorer,
  onCreateParcel,
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
    <div className="full-toolbar">
      <div className="toolbar-header">
        <div className="toolbar-brand">
          <span className="brand-symbol">₿</span>
          <span className="brand-name">OutLoud</span>
        </div>
        <button className="toolbar-close-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="toolbar-content">
        {/* Search Section */}
        <Card className="toolbar-section" padding="xl">
          <div className="section-header">
            <div className="section-icon">🔍</div>
            <div className="section-info">
              <h3 className="section-title">Search Feed</h3>
              <p className="section-description">
                Explore immutable feeds and discover posts permanently inscribed
                on the Bitcoin blockchain
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="section-form">
            <div className="form-group">
              <input
                type="text"
                value={address}
                onChange={handleAddressChange}
                placeholder="Address, bitmap or domain"
                className={`form-input ${
                  validationError ? "form-input-error" : ""
                }`}
                disabled={loading}
              />
              <button
                type="submit"
                className="form-button"
                disabled={loading || !address || !!validationError}
              >
                {loading ? (
                  <span className="loading-spinner">⟳</span>
                ) : (
                  "Search"
                )}
              </button>
            </div>
            {validationError && (
              <div className="form-error">{validationError}</div>
            )}
          </form>
        </Card>

        {/* Bitmap Visualization Section */}
        <Card className="toolbar-section" padding="xl">
          <div className="section-header">
            <div className="section-icon">🎨</div>
            <div className="section-info">
              <h3 className="section-title">Bitmap Explorer</h3>
              <p className="section-description">
                Explore Bitcoin blocks, on an interactive 3d social media
                experience. More to come.
              </p>
            </div>
          </div>

          <div className="section-actions">
            <button
              className="section-button"
              onClick={onBitmapExplorer}
              disabled={loading}
            >
              <span className="button-icon">🔮</span>
              <span className="button-text">Launch</span>
            </button>
          </div>
        </Card>

        {/* Create Post Section */}
        {/*<Card className="toolbar-section" padding="xl">
          <div className="section-header">
            <div className="section-icon">✍️</div>
            <div className="section-info">
              <h3 className="section-title">Create a Post</h3>
              <p className="section-description">
                Share your thoughts and carve them forever on the world's
                biggest p2p network. Bitcoin for freedom.
              </p>
            </div>
          </div>

          <div className="section-actions">
            <button
              className="section-button"
              onClick={onCreatePost}
              disabled={loading}
            >
              <span className="button-icon">📝</span>
              <span className="button-text">Create</span>
            </button>
          </div>
        </Card>*/}
      </div>
    </div>
  );
}
