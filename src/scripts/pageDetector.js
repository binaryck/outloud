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
    "*"
  );

  // Send Unisat result back to content script
  window.postMessage(
    {
      type: "UNISAT_DETECTED",
      detected: unisatDetected,
    },
    "*"
  );

  // Also try detection after a short delay in case wallet loads later
  setTimeout(() => {
    detected = detectXverseWallet();

    window.postMessage(
      {
        type: "XVERSE_DETECTED",
        detected,
      },
      "*"
    );

    unisatDetected = !!window.unisat;
    window.postMessage(
      {
        type: "UNISAT_DETECTED",
        detected: unisatDetected,
      },
      "*"
    );
  }, 2000);

  // Listen for wallet injection events
  const observer = new MutationObserver(() => {
    if (detectXverseWallet() !== xverseDetected) {
      xverseDetected = newDetected;
      window.postMessage(
        {
          type: "XVERSE_DETECTED",
          detected,
        },
        "*"
      );
    }

    if (!!window.unisat !== unisatDetected) {
      unisatDetected = !!window.unisat;
      window.postMessage(
        {
          type: "UNISAT_DETECTED",
          detected: unisatDetected,
        },
        "*"
      );
    }
  });

  // Watch for changes to the document that might indicate wallet injection
  observer.observe(document, { childList: true, subtree: true });

  // Listen for manual trigger requests from content script
  window.addEventListener("message", (event) => {
    switch (event.data.type) {
      case "TRIGGER_XVERSE_DETECTION":
        const currentDetected = detectXverseWallet();

        xverseDetected = currentDetected;
        window.postMessage(
          {
            type: "XVERSE_DETECTED",
            detected: currentDetected,
          },
          "*"
        );
        break;
      case "TRIGGER_UNISAT_DETECTION":
        const unisatDetected = !!window.unisat;
        window.postMessage(
          {
            type: "UNISAT_DETECTED",
            detected: unisatDetected,
          },
          "*"
        );
        break;
      case "XVERSE_SIGN_PSBT":
        console.log("XVerse sign psbt request received");
        if (xverseDetected && !!window.satsConnect) {
          window.satsConnect.signPsbt(event.data.psbt);
        }
        break;
      case "UNISAT_SIGN_PSBT":
        if (unisatDetected && !!window.unisat) {
          window.unisat.signPsbt(event.data.psbt);
        }
        break;
      default:
        // Ignore other messages
        break;
    }
  });
})();
