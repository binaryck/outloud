// To complete
export interface Order {
  status?: string;
  charge?: {
    id: string; // Order ID
    address: string; // Bitcoin address to pay
    amount: number; // in satoshis
    lightning_invoice: {
      expires_at: number; // timestamp in ms
      payreq: string;
    };
    created_at: number; // timestamp in ms
  };
  paylink?: {
    id: string; // visit https://app.hel.io/pay/66xxx16 to pay
  };
  chainFee?: number; // in satoshis
  serviceFee?: number; // in satoshis
  orderType?: string;
  nonStandardTx?: boolean; //  400kb-4MB transaction, reveal tx will not be visible in public mempool
  createdAt?: number; // timestamp in ms
  additionalFee?: number | null;
  additionalFeeCharged?: number;
  baseFee?: number;
  batchMode?: any | null;
  compress?: any | null;
  delegates?: any | null;
  fee?: number;
  files?: any[];
  id?: string;
  parent?: any | null;
  postage?: number;
  projectTag?: any | null;
  rareSats?: string;
  rareSatsFee?: number;
  receiveAddress?: string;
  referral?: any | null;
  state?: string;
  webhookUrl?: any | null;
  zeroConf?: any | null;
}
