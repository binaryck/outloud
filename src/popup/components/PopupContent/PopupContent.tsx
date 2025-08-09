import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { Routes, Route } from "react-router-dom";
import { HomePage } from "../../pages/HomePage";
import { InscribePage } from "../../pages/InscribePage";
import { Post } from "../../types/post";
import { useWalletDetection } from "../../hooks/useWalletDetection";
import { useSelectedPost } from "../../hooks/useSelectedPost";
import { useInscribe } from "../../hooks/useInscribe";

export function PopupContent(): React.JSX.Element {
  const { xverseDetected, unisatDetected } = useWalletDetection();
  const selectedPost: Post | null = useSelectedPost();
  const { isInscribing, handleInscribe } = useInscribe(
    selectedPost,
    xverseDetected,
    unisatDetected
  );

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
                post={selectedPost}
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
