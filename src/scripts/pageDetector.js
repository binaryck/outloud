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

    console.log("XVerse detected in page context:", detected);

    return detected;
  }

  // Try detection immediately
  let detected = detectXverseWallet();

  // Send result back to content script
  window.postMessage(
    {
      type: "XVERSE_DETECTED",
      detected,
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
  }, 2000);

  // Listen for wallet injection events
  const observer = new MutationObserver(() => {
    const newDetected = detectXverseWallet();
    if (newDetected !== detected) {
      detected = newDetected;
      window.postMessage(
        {
          type: "XVERSE_DETECTED",
          detected,
        },
        "*"
      );
    }
  });

  // Watch for changes to the document that might indicate wallet injection
  observer.observe(document, { childList: true, subtree: true });

  // Listen for manual trigger requests from content script
  window.addEventListener("message", (event) => {
    if (event.data.type === "TRIGGER_XVERSE_DETECTION") {
      const currentDetected = detectXverseWallet();

      detected = currentDetected;
      window.postMessage(
        {
          type: "XVERSE_DETECTED",
          detected: currentDetected,
        },
        "*"
      );
    }
  });
})();
