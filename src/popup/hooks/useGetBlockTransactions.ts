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
      let transactionsFetchCompleted = false;
      let incompleteTransactions: Transaction[] = [];
      while (!transactionsFetchCompleted) {
        const response = await fetch(
          `https://mempool.space/api/block/${blockHash}/txs/${incompleteTransactions.length}`
        );
        const data = await response.json();
        incompleteTransactions = [...incompleteTransactions, ...data];
        if (data.length < 25) {
          // All transactions are fetched
          transactionsFetchCompleted = true;
          setTransactions(incompleteTransactions);
        }
      }
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
