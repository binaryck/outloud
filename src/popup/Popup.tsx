import React, { useState } from "react";
import Header from "./components/Header";
import PostSection from "./components/PostSection";
import Footer from "./components/Footer";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { InscribePage } from "./pages/InscribePage";
import { Post } from "./types/post";

export function Popup(): React.JSX.Element {
  const [isInscribing, setIsInscribing] = useState(false);

  // Mock post data
  const postMock: Post = {
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
      <div className="content">
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/inscribe"
              element={
                <InscribePage
                  post={postMock}
                  onInscribe={handleInscribe}
                  isInscribing={isInscribing}
                />
              }
            />
          </Routes>
        </MemoryRouter>
      </div>
      <Footer isReady={!isInscribing} />
    </div>
  );
}

export default Popup;
