import { useEffect, useState } from "react";

export function useWalletDetection() {
  const [xverseDetected, setXverseDetected] = useState(false);
  const [unisatDetected, setUnisatDetected] = useState(false);

  useEffect(() => {
    // Request current XVerse state from background
    chrome.runtime.sendMessage({ type: "REQUEST_XVERSE_STATE" }, (response) => {
      if (response && response.type === "XVERSE_DETECTED") {
        setXverseDetected(response.detected);
      }
    });

    // Request current Unisat state from background
    chrome.runtime.sendMessage({ type: "REQUEST_UNISAT_STATE" }, (response) => {
      if (response && response.type === "UNISAT_DETECTED") {
        setUnisatDetected(response.detected);
      }
    });

    return () => {};
  }, []);

  return { xverseDetected, unisatDetected };
}
