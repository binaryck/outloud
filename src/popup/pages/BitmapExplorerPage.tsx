import React, { useEffect, useState, useCallback } from "react";
import { Card } from "../components//Card/Card";
import { useGetBlockHash } from "../hooks/useGetBlockHash";
import { useGetBlockTransactions } from "../hooks/useGetBlockTransactions";
import ThreeViewer from "../components/ThreeViewer/ThreeViewer";
import * as THREE from "three";
import {
  bitmapAnimate,
  bitmapSceneSetup,
} from "../scenes/bitmapScene/bitmapScene";
import { Transaction } from "../types/transaction";

type BitmapPageProps = {
  isInscribing: boolean;
};

export const BitmapExplorerPage = ({ isInscribing }: BitmapPageProps) => {
  const [bitmapInput, setBitmapInput] = useState("");
  const [validationError, setValidationError] = useState("");
  const [hoveredTx, setHoveredTx] = useState<Transaction | null>();
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

  const handleSceneSetup = useCallback(
    (
      scene: THREE.Scene,
      camera: THREE.PerspectiveCamera,
      renderer: THREE.WebGLRenderer
    ) => {
      bitmapSceneSetup(scene, camera, renderer, transactions, setHoveredTx);
    },
    [transactions]
  );

  return (
    <div className="bitmap-explorer-page">
      {/* Bitmap Explorer Section */}
      <Card className="bitmap-explorer-section" padding="xl">
        <h2 className="section-title">Bitmap Explorer</h2>
        <p className="section-description">
          Interactive 3D visualization of Bitcoin blocks and transactions
        </p>

        {/* Search bitmap */}
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

        {!transactions.length ? (
          <div className="explorer-placeholder">
            <div className="placeholder-content">
              <div className="placeholder-icon">🎨</div>
              <p>Bitmap visualization will be displayed here</p>
            </div>
          </div>
        ) : (
          <>
            <ThreeViewer
              id="bitmap-visualization"
              className="bitmap-visualization"
              onSceneSetup={handleSceneSetup}
              animate={bitmapAnimate}
            />

            {/* Transaction Details Panel */}
            <div className="transaction-details-panel">
              {hoveredTx ? (
                <div className="transaction-info-card">
                  <div className="transaction-header">
                    <div className="transaction-icon">₿</div>
                    <div className="transaction-title">
                      <h3>Transaction Details</h3>
                      <p>Hover over cubes to explore transactions</p>
                    </div>
                  </div>

                  <div className="transaction-details">
                    <div className="detail-row">
                      <span className="detail-label">TXID</span>
                      <span className="detail-value txid">
                        {hoveredTx.txid}
                      </span>
                    </div>

                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="detail-label">Size</span>
                        <span className="detail-value">
                          {hoveredTx.size?.toLocaleString()} bytes
                        </span>
                      </div>

                      <div className="detail-item">
                        <span className="detail-label">Weight</span>
                        <span className="detail-value">
                          {hoveredTx.weight?.toLocaleString()} WU
                        </span>
                      </div>

                      <div className="detail-item">
                        <span className="detail-label">Inputs</span>
                        <span className="detail-value">
                          {hoveredTx.vin?.length || 0}
                        </span>
                      </div>

                      <div className="detail-item">
                        <span className="detail-label">Outputs</span>
                        <span className="detail-value">
                          {hoveredTx.vout?.length || 0}
                        </span>
                      </div>
                    </div>

                    {hoveredTx.vout && hoveredTx.vout.length > 0 && (
                      <div className="detail-row value-highlight">
                        <span className="detail-label">Total Output</span>
                        <span className="detail-value btc-amount">
                          {(
                            hoveredTx.vout.reduce(
                              (sum, output) => sum + output.value,
                              0
                            ) / 1e8
                          ).toFixed(8)}{" "}
                          BTC
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="transaction-placeholder">
                  <div className="placeholder-icon">🎯</div>
                  <p>Hover over a transaction cube to view details</p>
                </div>
              )}
            </div>
          </>
        )}
      </Card>
    </div>
  );
};
