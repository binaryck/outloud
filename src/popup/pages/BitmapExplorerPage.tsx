import React, { useEffect, useState } from "react";
import { Card } from "../components//Card/Card";
import { useGetBlockHash } from "../hooks/useGetBlockHash";
import { useGetBlockTransactions } from "../hooks/useGetBlockTransactions";
import ThreeViewer from "../components/ThreeViewer/ThreeViewer";
import * as THREE from "three";

type BitmapPageProps = {
  isInscribing: boolean;
};

export const BitmapExplorerPage = ({ isInscribing }: BitmapPageProps) => {
  const [bitmapInput, setBitmapInput] = useState("");
  const [validationError, setValidationError] = useState("");
  const { getBlockHash, loadingBlockHash, errorBlockHash, blockHash } =
    useGetBlockHash();
  const {
    getBlockTransactions,
    loadingBlockTransactions,
    errorBlockTransactions,
    transactions,
  } = useGetBlockTransactions();

  const validateBitmap = (input: string): number | null => {
    // Check if input ends with .bitmap
    if (!input.endsWith(".bitmap")) {
      setValidationError("Input must end with .bitmap");
      return null;
    }

    // Extract the number part
    const numberPart = input.replace(".bitmap", "");
    const number = parseInt(numberPart, 10);

    // Validate number range
    if (isNaN(number) || number < 0 || number > 900000) {
      setValidationError("Bitmap must be between 0 and 900000");
      return null;
    }

    setValidationError("");
    return number;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBitmapInput(value);

    if (value) {
      validateBitmap(value);
    } else {
      setValidationError("");
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bitmapInput) return;

    const bitmapNumber = validateBitmap(bitmapInput);
    if (bitmapNumber === null) return;

    getBlockHash(bitmapNumber);
  };

  useEffect(() => {
    if (blockHash) {
      getBlockTransactions(blockHash);
    }
  }, [blockHash]);

  return (
    <div className="bitmap-explorer-page">
      {/* Search Bitmap Section */}
      <Card className="search-bitmap-section" padding="xl">
        <div className="section-header">
          <h2 className="section-title">Search Bitmap</h2>
          <p className="section-description">
            Enter a bitmap number (0-900000) followed by .bitmap to get block
            hash from block height
          </p>
        </div>

        <form onSubmit={handleSearch} className="bitmap-search-form">
          <div className="form-group">
            <input
              type="text"
              value={bitmapInput}
              onChange={handleInputChange}
              placeholder="e.g., 123456.bitmap"
              className={`form-input ${
                validationError ? "form-input-error" : ""
              }`}
              disabled={loadingBlockHash || loadingBlockTransactions}
            />
            <button
              type="submit"
              className="form-button"
              disabled={
                loadingBlockHash ||
                loadingBlockTransactions ||
                !bitmapInput ||
                !!validationError
              }
            >
              {loadingBlockHash || loadingBlockTransactions ? (
                <span className="loading-spinner">⟳</span>
              ) : (
                "Search"
              )}
            </button>
          </div>

          {validationError && (
            <div className="form-error">{validationError}</div>
          )}

          {errorBlockHash && <div className="form-error">{errorBlockHash}</div>}
          {!errorBlockHash && errorBlockTransactions && (
            <div className="form-error">{errorBlockTransactions}</div>
          )}
        </form>
      </Card>

      {/* Bitmap Explorer Section */}
      <Card className="bitmap-explorer-section" padding="xl">
        <h2 className="section-title">Bitmap Explorer</h2>
        <p className="section-description">
          Interactive 3D visualization of Bitcoin blocks and transactions
        </p>

        {!transactions.length ? (
          <div className="explorer-placeholder">
            <div className="placeholder-content">
              <div className="placeholder-icon">🎨</div>
              <p>Bitmap visualization will be displayed here</p>
            </div>
          </div>
        ) : (
          <ThreeViewer
            id="bitmap-visualization"
            className="bitmap-visualization"
            onSceneSetup={(scene, camera, renderer) => {
              // Scene, camera, and renderer
            }}
            animate={(scene, camera, renderer) => {
              // Animation loop
            }}
          />
        )}
      </Card>
    </div>
  );
};
