import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Content } from "../interfaces/content";

export function useSelectedPost() {
  const navigate = useNavigate();
  const [selectedPost, setSelectedPost] = useState<Content | null>(null);

  // Load post data from storage when popup opens
  useEffect(() => {
    const loadSelectedPost = async () => {
      try {
        const result = await chrome.storage.local.get([
          "selectedPost",
          "timestamp",
        ]);

        if (result.selectedPost && result.timestamp) {
          setSelectedPost(result.selectedPost);

          // Navigate to inscribe page with the selected post
          navigate("/inscribe");

          // Clear the badge since we're showing the post
          chrome.action.setBadgeText({ text: "" });

          // Clear the stored data after using it
          await chrome.storage.local.remove(["selectedPost", "timestamp"]);
        } else {
          // Clear badge if no post is selected
          chrome.action.setBadgeText({ text: "" });
        }
      } catch (error) {
        //console.error("Error loading selected post:", error);
      }
    };

    loadSelectedPost();
  }, [navigate]);

  return selectedPost;
}
