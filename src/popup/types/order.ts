export type OrderDetails = {
  additionalFeeCharged: number;
  baseFee: number;
  chainFee: number;
  charge: {
    address: string;
    amount: number;
    callback_url: string;
  };
  createdAt: number;
  fee: number;
  files: any[];
  id: string;
  orderType: string;
  payToAnchor: boolean;
  postage: number;
  receiveAddress: string;
  serviceFee: number;
  state: string;
  status: string;
  uncurseIt: boolean;
};
