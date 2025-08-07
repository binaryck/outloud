//console.log("OutLoud background script loaded");

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "openPopupWithPost") {
    console.log("Post data received for popup:", message.post);

    // Set badge to indicate a post is selected
    chrome.action.setBadgeText({ text: "1" });
    chrome.action.setBadgeBackgroundColor({ color: "#f97316" });

    // Try to open popup programmatically
    // Note: This might not work in all contexts due to browser restrictions
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

  return true;
});

// Clear badge when popup is opened manually
chrome.action.onClicked.addListener(() => {
  chrome.action.setBadgeText({ text: "" });
});
