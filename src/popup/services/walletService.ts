import { useContext } from "react";
import { useServices } from "../context/serviceContext";
import { OrdinalsBotService } from "./ordinalsBotService";
import { Order } from "../types/order";

export class WalletService {
  static payWithXverse = (
    ordinalsBotService: typeof OrdinalsBotService,
    order: Order = {}
  ) => {
    try {
      console.log("Sending XVerse payment for order:", order);
      // Request current Unisat state from background
      chrome.runtime.sendMessage(
        { type: "REQUEST_XVERSE_SIGN_PSBT", data: { psbt: "" } },
        (response) => {
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
      ordinalsBotService
        .createOrder
        /*contentString,
          dataURL,
          receiveAddress*/
        ();
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
