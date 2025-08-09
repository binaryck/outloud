import React from "react";
import PostCard from "../PostCard/PostCard";
import Button from "../Button/Button";
import { Post } from "../../types/post";

interface PostSectionProps {
  post: Post | null;
  onInscribe: () => void;
  isInscribing?: boolean;
}

export function PostSection({
  post,
  onInscribe,
  isInscribing = false,
}: PostSectionProps): React.JSX.Element {
  return (
    <div className="content">
      <div className="mb-xl">
        <h3 className="section-title">Post to Inscribe</h3>
        <PostCard post={post} />
      </div>
      <Button onClick={onInscribe} disabled={isInscribing} />
    </div>
  );
}

export default PostSection;
