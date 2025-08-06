let username: string | null | undefined = null;

console.log("Content script loaded on", window.location.href);

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
