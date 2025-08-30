export interface Transaction {
  txid: string;
  version: number;
  locktime: number;
  size: number;
  weight: number;
  fee: number;
  sigops: number;
  vin: {
    txid: string;
    vout: number;
    prevout: {
      scriptpubkey: string;
      scriptpubkey_asm: string;
      scriptpubkey_type: string;
      value: number; // Sats
    } | null;
    scriptsig: string;
    scriptsig_asm: string;
    is_coinbase?: boolean;
    sequence: number;
  }[];
  vout: {
    scriptpubkey: string;
    scriptpubkey_asm: string;
    scriptpubkey_type: string;
    value: number; // Sats
  }[];
  status: {
    confirmed: boolean;
    block_hash: string;
    block_height: number;
    block_time: number;
  };
}
