import React, { useState } from "react";
import Header from "./components/Header";
import PostSection from "./components/PostSection";
import Footer from "./components/Footer";

export function Popup(): React.JSX.Element {
  const [isInscribing, setIsInscribing] = useState(false);

  // Mock post data
  const postData = {
    author: "@bob",
    content: "Decentralization is the future.",
    timestamp: "2h ago",
  };

  const handleInscribe = async () => {
    setIsInscribing(true);
    try {
      // TODO: Implement inscription logic
      console.log("Inscribing post to Bitcoin...");
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error("Inscription failed:", error);
    } finally {
      setIsInscribing(false);
    }
  };

  return (
    <div className="container-popup">
      <Header subtitle="No voice can be silenced or erased from history" />

      <PostSection
        post={postData}
        onInscribe={handleInscribe}
        isInscribing={isInscribing}
      />

      <Footer isReady={!isInscribing} />
    </div>
  );
}

export default Popup;
