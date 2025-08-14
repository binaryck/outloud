import React, { useState } from "react";
import Button from "../Button/Button";

interface LikeButtonProps {
  isLiked: boolean;
  likes: number;
  onLike: () => void;
  disabled?: boolean;
}

export function LikeButton({
  isLiked,
  likes,
  onLike,
  disabled = false,
}: LikeButtonProps) {
  const [showNotification, setShowNotification] = useState(false);

  const handleClick = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  return (
    <div className="like-button-container">
      <Button
        onClick={handleClick}
        text={`${isLiked ? "❤️" : "🤍"} ${likes}`}
        disabled={disabled}
        variant="ghost"
      />

      {showNotification && <div className="like-notification">Coming soon</div>}
    </div>
  );
}
