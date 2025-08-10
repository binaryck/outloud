import { useState } from "react";
import { Post } from "../types/post";
import { useServices } from "../context/serviceContext";
import { DusmPost } from "../types/dusm";

export function useInscribe(
  post: Post | null,
  xverseDetected: boolean,
  unisatDetected: boolean
) {
  const { walletService, ordinalsBotService } = useServices();
  const [isInscribing, setIsInscribing] = useState(false);

  const handleInscribe = async () => {
    setIsInscribing(true);
    if (!post) {
      setIsInscribing(false);
      return;
    }

    try {
      // Get user address
      let receiverPubKey =
        "bc1pgnwmg7wplc09cm9fctgmgalu7l4synjh7khwzre9qlcvg5xy0k5qz9mwe3"; // Mock address

      // Ensure we have a receive public key before proceeding
      if (!receiverPubKey) {
        throw new Error(
          "Failed to get wallet address. Please connect your Unisat wallet and try again."
        );
      }

      // Prepare the post content as JSON for inscription
      const inscription: DusmPost = {
        p: "dusm",
        op: "pub",
        type: "post",
        txt: post.content,
        author: post.author,
        from: post.platform,
        edit: false,
      };

      if (xverseDetected) {
        walletService.payWithXverse(
          ordinalsBotService,
          inscription,
          receiverPubKey
        );
      } else if (unisatDetected) {
        walletService.payWithUnisat();
      }
    } catch (error) {
      //console.error("Inscription failed:", error);
    } finally {
      setIsInscribing(false);
    }
  };

  return { isInscribing, handleInscribe };
}
