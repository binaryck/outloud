import { useEffect, useState } from "react";

export function useWalletDetection() {
  const [xverseDetected, setXverseDetected] = useState(false);
  const [unisatDetected, setUnisatDetected] = useState(false);

  useEffect(() => {
    // Listen for XVerse detection messages
    const messageListener = (message: any) => {
      if (message.type === "XVERSE_DETECTED") {
        //console.log("Setting XVerse detected:", message.detected);
        setXverseDetected(message.detected);
      } else if (message.type === "UNISAT_DETECTED") {
        //console.log("Setting Unisat detected:", message.detected);
        setUnisatDetected(message.detected);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

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

    // Cleanup listener on unmount
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  return { xverseDetected, unisatDetected };
}
