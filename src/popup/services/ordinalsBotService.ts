import { OrderDetails } from "../types/order";

export class OrdinalsBotService {
  // Class methods
  static createOrder = async (body: any) => {
    // Create inscription order via Ordinals Bot API (Managed)
    const response = await fetch("https://api.ordinalsbot.com/inscribe", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      //console.log("Error creating inscription order:", errorText);
      throw new Error(
        `Failed to create inscription order: ${response.statusText} - ${errorText}`
      );
    }

    const orderData = await response.json();

    return orderData;

    /*if (orderData.paylink?.id) {
      // Open the paylink in a new tab
      chrome.tabs.create({
        url: `https://app.hel.io/pay/${orderData.paylink.id}`,
      });
    }*/
  };

  static getOrder = async (orderId: string) => {
    const response = await fetch(
      "https://api.ordinalsbot.com/order?id=" + orderId,
      {
        method: "GET",
        //headers: {
        //Accept: "*/*",
        //},
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to get order: ${response.statusText} - ${errorText}`
      );
    }

    const orderData = await response.json();
    return orderData;
  };

  //Leave for now
  static createPaymentPsbt = async (
    order: OrderDetails,
    receiverPubKey: string
  ) => {
    const response = await fetch(
      "https://api.ordinalsbot.com/tokenpay/create-payment-psbt",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: order.id,
          paymentAddress: order.charge?.address,
          paymentPublicKey: receiverPubKey, // To get
          ordinalAddress: receiverPubKey, // To get
          ordinalPublicKey: receiverPubKey, // To get
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to create payment PSBT: ${response.statusText} - ${errorText}`
      );
    }

    const psbtData = await response.json();

    return psbtData;
  };
}
