//console.log("OutLoud background script loaded");

// Store XVerse detection state
let xverseDetected = false;
let unisatDetected = false;

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "openPopupWithPost") {
    //console.log("Post data received for popup:", message.post);

    // Set badge to indicate a post is selected
    chrome.action.setBadgeText({ text: "1" });
    chrome.action.setBadgeBackgroundColor({ color: "#f97316" });

    // Try to open popup programmatically
    chrome.action
      .openPopup()
      .then(() => {
        // Clear badge since popup is open
        chrome.action.setBadgeText({ text: "" });
        sendResponse({ success: true });
      })
      .catch((error) => {
        console.log("Popup auto-open not available:", error.message);
        // Keep badge to indicate user should click extension icon
        sendResponse({ success: false, needsManualOpen: true });
      });

    return true; // Keep the message channel open for async response
  }

  if (message.type === "REQUEST_XVERSE_STATE") {
    sendResponse({
      type: "XVERSE_DETECTED",
      detected: xverseDetected,
    });
  }

  if (message.type === "REQUEST_UNISAT_STATE") {
    sendResponse({
      type: "UNISAT_DETECTED",
      detected: unisatDetected,
    });
  }

  // Handle XVerse detection from content script
  if (message.type === "XVERSE_DETECTED") {
    xverseDetected = message.detected;

    // Try to forward to popup if it's listening
    chrome.runtime.sendMessage(message);
  }

  // Handle Unisat detection from content script
  if (message.type === "UNISAT_DETECTED") {
    const unisatDetected = message.detected;

    // Try to forward to popup if it's listening
    chrome.runtime.sendMessage({
      type: "UNISAT_DETECTED",
      detected: unisatDetected,
    });
  }

  return true;
});

// Clear badge when popup is opened manually
chrome.action.onClicked.addListener(() => {
  chrome.action.setBadgeText({ text: "" });
});
