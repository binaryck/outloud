import React from "react";
import { Content } from "@/popup/interfaces/content";

interface PostCardProps {
  post: Content | null;
}

export function PostCard({ post }: PostCardProps): React.JSX.Element {
  if (!post) {
    return <div className="card-post">No post available</div>;
  }

  return (
    <div className="card-post">
      <div className="post-header">
        <div className="avatar">{post.author.charAt(1).toUpperCase()}</div>
        <div>
          <div className="author-name">{post.author}</div>
          <div className="timestamp">{post.timestamp}</div>
        </div>
      </div>
      <p className="post-content">{post.content}</p>
    </div>
  );
}

export default PostCard;
