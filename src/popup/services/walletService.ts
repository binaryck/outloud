import { OrdinalsBotService } from "./ordinalsBotService";
import { OrderDetails } from "../types/order";
import { DusmPost } from "../types/dusm";

export class WalletService {
  static payWithXverse = async (
    ordinalsBotService: typeof OrdinalsBotService,
    inscription: DusmPost,
    receiverPubKey: string
  ) => {
    try {
      console.log("Sending XVerse payment for inscription:", inscription);
      const jsonString = JSON.stringify(inscription);

      // Browser-native btoa()
      const base64 = btoa(jsonString);
      const dataURL = `data:text/plain;base64,${base64}`;

      console.log("Data URL for inscription:", dataURL);

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

      console.log("Creating inscription order with body:", body);

      // Create inscription order
      const order = await ordinalsBotService
        .createOrder(body)
        .catch((error) => {
          console.error("Failed to create inscription order:", error);
          throw new Error("Failed to create inscription order");
        });
      console.log("Created inscription order:", order);

      const orderDetails: OrderDetails = await ordinalsBotService
        .getOrder(order.id)
        .catch((error) => {
          console.error("Failed to get order payment address:", error);
        });
      console.log("Order details:", orderDetails);

      // Create payment PSBT
      const psbt = await ordinalsBotService
        .createPaymentPsbt(orderDetails, receiverPubKey)
        .catch((error) => {
          console.error("Failed to create payment PSBT:", error);
          throw new Error("Failed to create payment PSBT");
        });
      console.log("Created payment PSBT:", psbt);

      chrome.runtime.sendMessage(
        { type: "REQUEST_XVERSE_SIGN_PSBT", data: { psbt } },
        (response) => {
          console.log("XVerse PSBT sign response:", response);
          /*if (response && response.type === "UNISAT_DETECTED") {
              if (response.status === "success") {
                console.log(
                  "XVerse payment transaction sent:",
                  response.result.txid
                );
              } else {
                throw new Error("XVerse payment failed");
              }
            }*/
        }
      );
    } catch (walletError) {
      // Fallback to paylink
      /*ordinalsBotService
        .createOrder
        contentString,
          dataURL,
          receiverPubKey
        ();*/
    }
  };

  static payWithUnisat = () => {
    try {
      //Unisat request
      //console.log("Unisat payment transaction sent:", txid);
    } catch (walletError) {
      // Fallback to paylink
      /*chrome.tabs.create({
        url: `https://app.hel.io/pay/${orderData.paylink.id}`,
      });*/
    }
  };
}
