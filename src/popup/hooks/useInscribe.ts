import { useState } from "react";
import { Content } from "../interfaces/content";
import { useServices } from "../context/serviceContext";
import { DusmPost } from "../types/dusm";

export function useInscribe(
  post: Content | null,
  xverseDetected: boolean,
  unisatDetected: boolean
) {
  const { walletService, ordinalsBotService } = useServices();
  const [isInscribing, setIsInscribing] = useState(false);

  const handleInscribe = async (receiverPubKey: string) => {
    setIsInscribing(true);
    if (!post) {
      setIsInscribing(false);
      return;
    }

    try {
      // Ensure we have a receive public key before proceeding
      if (!receiverPubKey) {
        throw new Error(
          "Failed to get wallet address. Please provide a valid receiver address."
        );
      }

      // Prepare the post content as JSON for inscription
      const inscription: DusmPost = {
        p: "dusm",
        op: "pub",
        type: "post",
        txt: post.content,
        author: post.author!,
        from: "x",
        edit: false,
      };

      if (unisatDetected) {
        walletService.payWithUnisat(
          ordinalsBotService,
          inscription,
          receiverPubKey
        );
      } else if (xverseDetected) {
        walletService.payWithXverse(
          ordinalsBotService,
          inscription,
          receiverPubKey
        );
      }
    } catch (error) {
      //console.error("Inscription failed:", error);
    } finally {
      setIsInscribing(false);
    }
  };

  return { isInscribing, handleInscribe };
}
