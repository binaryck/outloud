// IIFE wrapper
(function () {
  // Function to detect XVerse wallet
  function detectXverseWallet() {
    // Check all possible XVerse providers
    const checks = [
      { name: "satsConnect", value: !!window.satsConnect },
      { name: "BitcoinProvider", value: !!window.BitcoinProvider },
      { name: "XverseProviders", value: !!window.XverseProviders },
      {
        name: "XverseProviders.BitcoinProvider",
        value: !!(
          window.XverseProviders && window.XverseProviders.BitcoinProvider
        ),
      },
      //{ name: "bitcoin", value: !!window.bitcoin },
      { name: "xverse", value: !!window.xverse },
    ];

    // XVerse typically injects satsConnect
    const detected = checks.some((check) => check.value);

    //console.log("XVerse detected in page context:", detected);
    //console.log("Unisat detected in page context:", unisatDetected);

    return detected;
  }

  // Try detection immediately
  let xverseDetected = detectXverseWallet();
  let unisatDetected = !!window.unisat;

  // Send result back to content script
  window.postMessage(
    {
      type: "XVERSE_DETECTED",
      detected: xverseDetected,
    },
    window.location.origin
  );

  // Send Unisat result back to content script
  window.postMessage(
    {
      type: "UNISAT_DETECTED",
      detected: unisatDetected,
    },
    window.location.origin
  );

  // Also try detection after a short delay in case wallet loads later
  setTimeout(() => {
    xverseDetected = detectXverseWallet();

    window.postMessage(
      {
        type: "XVERSE_DETECTED",
        detected: xverseDetected,
      },
      window.location.origin
    );

    unisatDetected = !!window.unisat;
    window.postMessage(
      {
        type: "UNISAT_DETECTED",
        detected: unisatDetected,
      },
      window.location.origin
    );
  }, 3000);

  // Listen for wallet injection events
  const observer = new MutationObserver(() => {
    if (detectXverseWallet() !== xverseDetected) {
      xverseDetected = detectXverseWallet();
      window.postMessage(
        {
          type: "XVERSE_DETECTED",
          detected: xverseDetected,
        },
        window.location.origin
      );
    }

    if (!!window.unisat !== unisatDetected) {
      unisatDetected = !!window.unisat;
      window.postMessage(
        {
          type: "UNISAT_DETECTED",
          detected: unisatDetected,
        },
        window.location.origin
      );
    }
  });

  // Watch for changes to the document that might indicate wallet injection
  observer.observe(document, { childList: true, subtree: true });

  // Listen for manual trigger requests from content script
  window.addEventListener("message", (event) => {
    if (event.origin !== window.location.origin) return;
    if (!event.data?.type) return;

    switch (event.data.type) {
      case "TRIGGER_XVERSE_DETECTION":
        xverseDetected = detectXverseWallet();

        window.postMessage(
          {
            type: "XVERSE_DETECTED",
            detected: xverseDetected,
          },
          window.location.origin
        );
        break;
      case "TRIGGER_UNISAT_DETECTION":
        unisatDetected = !!window.unisat;

        window.postMessage(
          {
            type: "UNISAT_DETECTED",
            detected: unisatDetected,
          },
          window.location.origin
        );
        break;
      case "XVERSE_SEND_TRANSFER":
        if (xverseDetected && !!window.XverseProviders.BitcoinProvider) {
          window.XverseProviders.BitcoinProvider.request("sendTransfer", {
            recipients: [
              {
                address: event.data.transfer.address,
                amount: event.data.transfer.amount,
              },
            ],
          });
        }
        break;
      case "UNISAT_SEND_TRANSFER":
        if (unisatDetected && !!window.unisat) {
          window.unisat.sendBitcoin(
            event.data.transfer.address,
            event.data.transfer.amount
          );
        }
        break;
      default:
        // Ignore other messages
        break;
    }
  });
})();
