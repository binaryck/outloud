import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Routes, Route, useNavigate } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { InscribePage } from "../pages/InscribePage";
import { Post } from "../types/post";

export function PopupContent(): React.JSX.Element {
  const [isInscribing, setIsInscribing] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const navigate = useNavigate();

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

  const handleInscribe = async () => {
    setIsInscribing(true);
    try {
      //console.log("Inscribing post to Bitcoin...");
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error("Inscription failed:", error);
    } finally {
      setIsInscribing(false);
    }
  };

  // Fallback mock post data for when no post is selected
  const mockPost: Post = {
    author: "@bob",
    content: "Decentralization is the future.",
    timestamp: "2h ago",
  };

  const postToUse = selectedPost || mockPost;

  return (
    <>
      <Header subtitle="No voice can be silenced or erased from history" />
      <div className="content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/inscribe"
            element={
              <InscribePage
                post={postToUse}
                onInscribe={handleInscribe}
                isInscribing={isInscribing}
              />
            }
          />
        </Routes>
      </div>
      <Footer isReady={!isInscribing} />
    </>
  );
}
