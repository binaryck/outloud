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
                  post.querySelector('[data-testid="socialContext"]') !== null;

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

    button.onclick = () =>
      console.log("Repost on Bitcoin clicked for tweet:", post);
    actionsBar.appendChild(button);
  }
}
