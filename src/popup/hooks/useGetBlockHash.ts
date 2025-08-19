import { useState } from "react";
import mempoolJS from "@mempool/mempool.js";

interface UseGetBlockHashReturn {
  getBlockHash: (bitmapNumber: number) => Promise<any>;
  loading: boolean;
  error: string | null;
  blockHash: string | null;
}

export function useGetBlockHash(): UseGetBlockHashReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [blockHash, setBlockHash] = useState<string | null>(null);

  const getBlockHash = async (bitmapNumber: number) => {
    setLoading(true);
    setError(null);
    setBlockHash(null);

    try {
      const {
        bitcoin: { blocks },
      } = mempoolJS();

      const blockHeight = await blocks.getBlockHeight({ height: bitmapNumber });
      setBlockHash(blockHeight);
      return blockHeight;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch block data";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    getBlockHash,
    loading,
    error,
    blockHash,
  };
}
