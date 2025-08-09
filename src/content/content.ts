let username: string | null | undefined = null;

//console.log("Content script loaded on", window.location.href);

function injectScript(fileName: string) {
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL(fileName); // MV3-safe source
  script.type = "text/javascript";
  document.head.appendChild(script);
}

// Listen for messages from injected script
window.addEventListener("message", (event) => {
  // Only accept messages from same origin
  if (event.origin !== window.location.origin) return;

  if (event.data.type === "XVERSE_DETECTED") {
    // Send to background script
    chrome.runtime
      .sendMessage({
        type: "XVERSE_DETECTED",
        detected: event.data.detected,
      })
      .catch((err) => {
        //console.log("Failed to send XVerse detection message:", err);
      });
  }
});

// Inject the script
injectScript("src/scripts/pageDetector.js");

// Try to initialize immediately if DOM is already loaded
if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", () => {
    //console.log("DOMContentLoaded fired");
    initObserver();
  });
} else {
  //console.log("DOM already loaded");
  initObserver();
}

// Init observer to monitor for dynamic content changes
function initObserver(): void {
  // Select the main container where tweets are added
  const targetNode =
    document.querySelector('main[role="main"]') ||
    document.querySelector('[data-testid="primaryColumn"]') ||
    document.body;

  const config = { attributes: false, childList: true, subtree: true };

  // Callback function to execute when mutations are observed
  const callback = (
    mutationList: MutationRecord[],
    observer: MutationObserver
  ): void => {
    //console.log("Mutations count:", mutationList.length);
    if (!username) {
      username = getUsername();
      console.log("Username set to:", username);
    }

    // Check for new posts
    if (username) {
      for (const mutation of mutationList) {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;

              const posts = element.matches('article[data-testid="tweet"]')
                ? [element]
                : element.querySelectorAll('article[data-testid="tweet"]');

              posts.forEach((post) => {
                // Check if this is a post from the current user (not a repost)
                const userLink = post.querySelector(`a[href="/${username}"]`);
                const isRepost =
                  post.querySelector('[data-testid="socialContext"]') !==
                    null && !post.textContent!.includes("Pinned");

                if (
                  userLink &&
                  !isRepost &&
                  !post.querySelector(".outloud-button")
                ) {
                  console.log("Adding repost button to post:", post);
                  addRepostButton(post as HTMLElement);
                }
              });
            }
          });
        }
      }
    }
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  if (targetNode) {
    observer.observe(targetNode, config);
  } else {
    console.error("No target node found");
  }
}

// Function to check if the user is logged in
function getUsername(): string | null | undefined {
  const isLoggedIn: boolean =
    document.querySelector('[data-testid="SideNav_NewTweet_Button"]') !==
      null ||
    document.querySelector('[aria-label*="Post"]') !== null ||
    document.querySelector('[data-testid="tweetButton"]') !== null;

  let username: string | null | undefined;

  if (isLoggedIn) {
    //console.log("User is logged in");
    const profileLink: HTMLAnchorElement | null = document.querySelector(
      'a[aria-label*="Profile"]'
    );

    if (profileLink) {
      const href = profileLink.getAttribute("href");
      username = href?.includes("/") ? href.split("/")[1] : null;
    }
  } else {
    //console.log("User is not logged in");
  }

  return username;
}

// Extract post data from the DOM element
function extractPostData(
  post: HTMLElement
): { author: string; content: string; timestamp: string } | null {
  try {
    // Extract author (username)
    const authorElement = post.querySelector(
      '[data-testid="User-Name"] a, [data-testid="User-Names"] a'
    );
    const author =
      authorElement?.getAttribute("href")?.replace("/", "@") || "@unknown";

    // Extract post content
    const contentElement = post.querySelector('[data-testid="tweetText"]');
    const content = contentElement?.textContent?.trim() || "";

    // Extract timestamp
    const timeElement = post.querySelector("time");
    const timestamp =
      timeElement?.getAttribute("datetime") ||
      timeElement?.textContent ||
      "unknown";

    if (!content) {
      //console.warn("Could not extract post content");
      return null;
    }

    return {
      author,
      content,
      timestamp,
    };
  } catch (error) {
    //console.error("Error extracting post data:", error);
    return null;
  }
}

// Show a temporary notification to the user
function showNotification(message: string): void {
  // Create notification element
  const notification = document.createElement("div");
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #f97316, #ea580c);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 10000;
    max-width: 300px;
    animation: slideIn 0.3s ease-out;
  `;

  // Add animation keyframes
  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // Add notification to page
  document.body.appendChild(notification);

  // Remove notification after 4 seconds
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease-out";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 4000);
}

// Add repost button to user's posts
function addRepostButton(post: HTMLElement): void {
  const actionsBar = post.querySelector('[role="group"]');
  if (actionsBar) {
    const button = document.createElement("button");
    button.className = "outloud-button";
    button.innerHTML = "Repost on Bitcoin";
    button.style.cssText =
      "margin-left: 8px; padding: 8px; margin-top: 3px; margin-bottom: 3px; background: linear-gradient(135deg, #f97316, #ea580c); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 12px; font-weight: 600; transition: all 0.3s ease; transform: scale(1); box-shadow: 0 2px 4px rgba(0,0,0,0.1);";

    // Add hover effects
    button.onmouseenter = () => {
      button.style.transform = "scale(1.05) translateY(-1px)";
      button.style.background = "linear-gradient(135deg, #ea580c, #dc2626)";
      button.style.boxShadow = "0 4px 12px rgba(249, 115, 22, 0.4)";
    };

    button.onmouseleave = () => {
      button.style.transform = "scale(1) translateY(0px)";
      button.style.background = "linear-gradient(135deg, #f97316, #ea580c)";
      button.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
    };

    button.onclick = async () => {
      try {
        const postData = extractPostData(post);
        if (!postData) {
          console.error("Failed to extract post data");
          return;
        }

        // Store the post data in Chrome storage for the popup to access
        await chrome.storage.local.set({
          selectedPost: postData,
          timestamp: Date.now(), // Add timestamp to ensure freshness
        });

        // Send message to background script to open popup
        chrome.runtime
          .sendMessage({
            action: "openPopupWithPost",
            post: postData,
          })
          .then((response) => {
            if (response?.success) {
              //console.log("Popup opened successfully");
            } else if (response?.needsManualOpen) {
              showNotification(
                "Click the OutLoud extension icon to inscribe this post!"
              );
            }
          })
          .catch((error: unknown) => {
            //console.log("Failed", error);
            showNotification(
              "Post saved! Click the OutLoud extension icon to inscribe."
            );
          });

        // Visual feedback
        button.innerHTML = "✓ Selected";
        button.style.background = "linear-gradient(135deg, #10b981, #059669)";

        // Reset button after a delay
        setTimeout(() => {
          button.innerHTML = "Repost on Bitcoin";
          button.style.background = "linear-gradient(135deg, #f97316, #ea580c)";
        }, 2000);
      } catch (error) {
        //console.error("Error on button click:", error);
      }
    };

    actionsBar.appendChild(button);
  }
}

// Listen for messages from popup to re-check XVerse
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "REQUEST_XVERSE_STATE") {
    // Trigger a fresh detection for Xverse
    window.postMessage({ type: "TRIGGER_XVERSE_DETECTION" }, "*");
  } else if (request.type === "REQUEST_UNISAT_STATE") {
    // Trigger a fresh detection for Unisat
    window.postMessage({ type: "TRIGGER_UNISAT_DETECTION" }, "*");
  } else if (request.type === "REQUEST_XVERSE_SIGN_PSBT") {
    // Trigger xverse signPsbt
    window.postMessage({ type: "XVERSE_SIGN_PSBT" }, "*");
  } else if (request.type === "REQUEST_UNISAT_SIGN_PSBT") {
    // Trigger unisat signPsbt
    window.postMessage({ type: "UNISAT_SIGN_PSBT" }, "*");
  }
});
