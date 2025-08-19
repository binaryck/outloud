import { useState } from "react";

type Transaction = {
  id: string;
  blockHash: string;
  from: string;
  to: string;
  value: number;
  timestamp: string;
};

export const useGetBlockTransactions = () => {
  const [loadingBlockTransactions, setLoadingBlockTransactions] =
    useState(false);
  const [errorBlockTransactions, setErrorBlockTransactions] = useState<
    string | null
  >(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  const getBlockTransactions = async (blockHash: string | null) => {
    if (!blockHash) {
      setErrorBlockTransactions("Block hash not found");
      return;
    }
    setLoadingBlockTransactions(true);
    setErrorBlockTransactions(null);

    try {
      console.log("blockHash", blockHash);
      const response = await fetch(
        `https://mempool.space/api/block/${blockHash}/txs`
      );
      const data = await response.json();
      setTransactions(data);
    } catch (err: any) {
      setErrorBlockTransactions(err.message);
    } finally {
      setLoadingBlockTransactions(false);
    }
  };

  return {
    getBlockTransactions,
    loadingBlockTransactions,
    errorBlockTransactions,
    transactions,
  };
};
