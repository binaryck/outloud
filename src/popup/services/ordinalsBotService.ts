export class OrdinalsBotService {
  //why here static and not const
  static createOrdinalsBotOrder = async (
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
}
