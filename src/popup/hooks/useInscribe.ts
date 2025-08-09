import { useState } from "react";
import { Post } from "../types/post";
import { useServices } from "../context/serviceContext";

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
      let receiveAddress = "bc1qfclypa0ad762762m0pxzfnquj7nsq2vglhy86k";

      // Ensure we have a receive address before proceeding
      if (!receiveAddress) {
        throw new Error(
          "Failed to get wallet address. Please connect your Unisat wallet and try again."
        );
      }

      // Prepare the post content as JSON for inscription
      const postContent = {
        author: post.author,
        content: post.content,
        timestamp: post.timestamp,
        platform: "outloud",
      };

      // Convert content to base64 dataURL as required by Ordinals Bot API
      const contentString = JSON.stringify(postContent, null, 2);
      const base64Content = btoa(contentString);
      const dataURL = `data:text/plain;base64,${base64Content}`;

      //console.log("Inscription order created:", orderData);

      if (xverseDetected) {
        walletService.payWithXverse(
          ordinalsBotService /*, {
          contentString,
          dataURL,
          receiveAddress,
        }*/
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
