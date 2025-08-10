import { OrdinalsBotService } from "./ordinalsBotService";
import { OrderDetails } from "../types/order";
import { DusmPost } from "../types/dusm";

export class WalletService {
  /**
   * Create an inscription order and retrieve its details
   * @param ordinalsBotService - OrdinalsBotService instance
   * @param inscription - Inscription data to be sent
   * @param receiverPubKey - Public key of the receiver
   * @returns OrderDetails containing the order information
   */
  static createOrderAndGetDetails = async (
    ordinalsBotService: typeof OrdinalsBotService,
    inscription: DusmPost,
    receiverPubKey: string
  ): Promise<OrderDetails> => {
    const jsonString = JSON.stringify(inscription);

    // Browser-native btoa()
    const base64 = btoa(jsonString);
    const dataURL = `data:text/plain;base64,${base64}`;

    // Use browser-native way to get byte length
    const size = new TextEncoder().encode(jsonString).length;

    const body = {
      files: [
        {
          name: "post.txt",
          size: size,
          type: "text/plain",
          dataURL: dataURL,
        },
      ],
      receiveAddress: receiverPubKey,
      fee: 2,
      postage: 546,
      compress: false,
      //webhookUrl: "https://callback.com/ordinalsbot",
      timeout: 1440,
    };

    // Create inscription order
    const order = await ordinalsBotService.createOrder(body).catch((error) => {
      throw new Error("Failed to create inscription order");
    });

    const orderDetails: OrderDetails = await ordinalsBotService
      .getOrder(order.id)
      .catch((error) => {
        //console.error("Failed to get order payment address:", error);
      });

    if (!orderDetails || !orderDetails.charge || !orderDetails.charge.address) {
      throw new Error("Failed to retrieve order payment address");
    }

    return orderDetails;
  };

  /**
   * Pay with XVerse wallet
   * @param ordinalsBotService - OrdinalsBotService instance
   * @param inscription - Inscription data to be sent
   * @param receiverPubKey - Public key of the receiver
   */
  static payWithXverse = async (
    ordinalsBotService: typeof OrdinalsBotService,
    inscription: DusmPost,
    receiverPubKey: string
  ) => {
    try {
      const orderDetails: OrderDetails = await this.createOrderAndGetDetails(
        ordinalsBotService,
        inscription,
        receiverPubKey
      );

      chrome.runtime.sendMessage(
        {
          type: "REQUEST_XVERSE_SEND_TRANSFER",
          data: {
            transfer: {
              address: orderDetails.charge?.address,
              amount: orderDetails.charge?.amount,
            },
          },
        },
        (response) => {
          // Successful transaction response
        }
      );
    } catch (walletError) {
      // Error, eventually fallback to paylink
    }
  };

  /**
   * Pay with Unisat wallet
   * @param ordinalsBotService - OrdinalsBotService instance
   * @param inscription - Inscription data to be sent
   * @param receiverPubKey - Public key of the receiver
   */
  static payWithUnisat = async (
    ordinalsBotService: typeof OrdinalsBotService,
    inscription: DusmPost,
    receiverPubKey: string
  ) => {
    try {
      const orderDetails: OrderDetails = await this.createOrderAndGetDetails(
        ordinalsBotService,
        inscription,
        receiverPubKey
      );

      chrome.runtime.sendMessage(
        {
          type: "REQUEST_UNISAT_SEND_TRANSFER",
          data: {
            transfer: {
              address: orderDetails.charge?.address,
              amount: orderDetails.charge?.amount,
            },
          },
        },
        (response) => {
          // Successful transaction response
        }
      );
    } catch (walletError) {
      // Error, eventually fallback to paylink
    }
  };
}
