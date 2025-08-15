import React from "react";
import { Content } from "@/popup/interfaces/content";
import { LikeButton } from "../LikeButton/LikeButton";

interface PostProps {
  post: Content;
  onLike: (postId: string) => void;
}

export function Post({ post, onLike }: PostProps) {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const formatContent = (content: string) => {
    return content.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < content.split("\n").length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className="post-card">
      <div className="post-header">
        {/* To add user avatar, and differenciate between author and wallet */}
        {/*<div className="post-avatar">{post.author.avatar}</div>*/}
        <div className="post-author-info">
          <div className="post-author-username">{post.author || "Unknown"}</div>
        </div>
        <div className="post-timestamp">{formatTimestamp(post.timestamp)}</div>
      </div>

      <div className="post-content">{formatContent(post.content)}</div>

      {post.inscription_id && (
        <div className="post-inscription-info">
          <div className="inscription-badge">
            <span className="inscription-icon">⧉</span>
            <span className="inscription-text">Inscribed on Bitcoin</span>
          </div>
          <div className="inscription-id">{post.inscription_id}</div>
        </div>
      )}

      <div className="post-actions">
        {/*<LikeButton
          isLiked={post.isLiked}
          likes={post.likes}
          onLike={() => onLike(post.id)}
        />*/}
        <div className="post-stats">
          <span className="btc-icon">₿</span>
          <span className="immutable-text">Immutable</span>
        </div>
      </div>
    </div>
  );
}
