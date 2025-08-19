import { useState } from "react";
import mempoolJS from "@mempool/mempool.js";

interface UseGetBlockHashReturn {
  getBlockHash: (bitmapNumber: number) => Promise<any>;
  loadingBlockHash: boolean;
  errorBlockHash: string | null;
  blockHash: string | null;
}

export function useGetBlockHash(): UseGetBlockHashReturn {
  const [loadingBlockHash, setLoadingBlockHash] = useState(false);
  const [errorBlockHash, setErrorBlockHash] = useState<string | null>(null);
  const [blockHash, setBlockHash] = useState<string | null>(null);

  const getBlockHash = async (bitmapNumber: number) => {
    setLoadingBlockHash(true);
    setErrorBlockHash(null);
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
      setErrorBlockHash(errorMessage);
      return null;
    } finally {
      setLoadingBlockHash(false);
    }
  };

  return {
    getBlockHash,
    loadingBlockHash,
    errorBlockHash,
    blockHash,
  };
}
