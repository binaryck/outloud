import React, { useState } from "react";
import PostCard from "../PostCard/PostCard";
import Button from "../Button/Button";
import { Content } from "@/popup/interfaces/content";
import { TextInput } from "../TextInput/TextInput";

interface PostSectionProps {
  post: Content | null;
  onInscribe: (receiverPubKey: string) => void;
  isInscribing?: boolean;
}

export function PostSection({
  post,
  onInscribe,
  isInscribing = false,
}: PostSectionProps): React.JSX.Element {
  const [receiverPubKey, setReceiverPubKey] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (receiverPubKey.trim()) {
      onInscribe(receiverPubKey.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="content">
        <div className="mb-xl">
          <h3 className="section-title">Post to Inscribe</h3>
          <PostCard post={post} />
          <TextInput
            name="receiverPubKey"
            value={receiverPubKey}
            onChange={setReceiverPubKey}
            required={true}
            placeholder="Add the receiver's address here"
          />
        </div>
        <Button
          type="submit"
          disabled={isInscribing /* || !receiverPubKey.trim()*/}
        />
      </div>
    </form>
  );
}

export default PostSection;
