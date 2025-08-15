import React, { useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { Routes, Route, useNavigate } from "react-router-dom";
import { HomePage } from "../../pages/HomePage";
import { InscribePage } from "../../pages/InscribePage";
import { FeedPage } from "../../pages/FeedPage";
import { Content } from "@/popup/interfaces/content";
import { useWalletDetection } from "../../hooks/useWalletDetection";
import { useSelectedPost } from "../../hooks/useSelectedPost";
import { useInscribe } from "../../hooks/useInscribe";
import { useFeed } from "../../hooks/useFeed";
import { Toolbar } from "../Toolbar/Toolbar";

export function PopupContent(): React.JSX.Element {
  const navigate = useNavigate();
  const { xverseDetected, unisatDetected } = useWalletDetection();
  const selectedPost: Content | null = useSelectedPost();
  const { isInscribing, handleInscribe } = useInscribe(
    selectedPost,
    xverseDetected,
    unisatDetected
  );

  // Toolbar state
  const [isToolbarOpen, setIsToolbarOpen] = useState(false);
  const [searchedAddress, setSearchedAddress] = useState("");

  // Feed functionality
  const { 
    posts, 
    loading, 
    error, 
    currentPage, 
    totalPages, 
    totalPosts, 
    fetchFeed, 
    likePost, 
    setPage 
  } = useFeed();

  const handleToggleSearch = () => {
    setIsToolbarOpen(!isToolbarOpen);
  };

  const handleCloseToolbar = () => {
    setIsToolbarOpen(false);
    navigate("/");
  };

  const handleSearch = async (address: string) => {
    setIsToolbarOpen(false);
    setSearchedAddress(address);
    navigate("feed");
    await fetchFeed(address);
  };

  return (
    <>
      <Header
        subtitle="No voice can be silenced or erased from history"
        onToggleSearch={handleToggleSearch}
      />

      <Toolbar
        isOpen={isToolbarOpen}
        onClose={handleCloseToolbar}
        onSearch={handleSearch}
        loading={loading}
      />

      <div className="content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/feed"
            element={
              <FeedPage
                address={searchedAddress}
                posts={posts}
                loading={loading}
                error={error}
                currentPage={currentPage}
                totalPages={totalPages}
                totalPosts={totalPosts}
                onLike={likePost}
                onPageChange={setPage}
              />
            }
          />
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
