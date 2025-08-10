import { Order } from "../types/order";

export class OrdinalsBotService {
  //why here static and not const
  static createOrder = async (
    contentString: string = "",
    dataURL: string = "",
    receiveAddress: string = ""
  ) => {
    // Create inscription order via Ordinals Bot API (Managed)
    const response = await fetch("https://api.ordinalsbot.com/order", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        files: [
          {
            size: contentString.length,
            type: "text/plain",
            name: `outloud-post-${Date.now()}.txt`,
            dataURL: dataURL,
          },
        ],
        postage: 546,
        receiveAddress: receiveAddress,
        fee: "5", // Fee rate in sat/vB
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      //console.log("Error creating inscription order:", errorText);
      throw new Error(
        `Failed to create inscription order: ${response.statusText} - ${errorText}`
      );
    }

    const orderData = await response.json();

    if (orderData.paylink?.id) {
      // Open the paylink in a new tab
      chrome.tabs.create({
        url: `https://app.hel.io/pay/${orderData.paylink.id}`,
      });
    }
  };

  static createPaymentPsbt = async (order: Order) => {
    const response = await fetch(
      "https://api.ordinalsbot.com/tokenpay/create-payment-psbt",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: "order123",
          paymentAddress: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
          paymentPublicKey:
            "02b463a1e6b8e1a1e1a1e1a1e1a1e1a1e1a1e1a1e1a1e1a1e1a1e1a1e1a1e1a1",
          ordinalAddress: "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kygt080",
          ordinalPublicKey:
            "03b463a1e6b8e1a1e1a1e1a1e1a1e1a1e1a1e1a1e1a1e1a1e1a1e1a1e1a1e1a1",
          feeRate: 0.0001,
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
