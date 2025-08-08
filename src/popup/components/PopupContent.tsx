import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Routes, Route, useNavigate } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { InscribePage } from "../pages/InscribePage";
import { Post } from "../types/post";

export function PopupContent(): React.JSX.Element {
  const [isInscribing, setIsInscribing] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const navigate = useNavigate();

  // Load post data from storage when popup opens
  useEffect(() => {
    const loadSelectedPost = async () => {
      try {
        const result = await chrome.storage.local.get([
          "selectedPost",
          "timestamp",
        ]);

        if (result.selectedPost && result.timestamp) {
          setSelectedPost(result.selectedPost);

          // Navigate to inscribe page with the selected post
          navigate("/inscribe");

          // Clear the badge since we're showing the post
          chrome.action.setBadgeText({ text: "" });

          // Clear the stored data after using it
          await chrome.storage.local.remove(["selectedPost", "timestamp"]);
        } else {
          // Clear badge if no post is selected
          chrome.action.setBadgeText({ text: "" });
        }
      } catch (error) {
        //console.error("Error loading selected post:", error);
      }
    };

    loadSelectedPost();
  }, [navigate]);

  const handleInscribe = async () => {
    setIsInscribing(true);

    try {
      // Get user address
      let receiveAddress = "address";

      // Ensure we have a receive address before proceeding
      if (!receiveAddress) {
        throw new Error(
          "Failed to get wallet address. Please connect your Unisat wallet and try again."
        );
      }

      // Prepare the post content as JSON for inscription
      const postContent = {
        author: postToUse.author,
        content: postToUse.content,
        timestamp: postToUse.timestamp,
        platform: "outloud",
      };

      // Convert content to base64 dataURL as required by Ordinals Bot API
      const contentString = JSON.stringify(postContent, null, 2);
      const base64Content = btoa(contentString);
      const dataURL = `data:text/plain;base64,${base64Content}`;

      // Create inscription order via Ordinals Bot API (Managed)
      const response = await fetch("https://api.ordinalsbot.com/order", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          files: [
            {
              size: contentString.length,
              type: "text/plain",
              name: `outloud-post-${Date.now()}.txt`,
              dataURL: dataURL,
            },
          ],
          postage: 546,
          receiveAddress: receiveAddress,
          fee: "5", // Fee rate in sat/vB
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        //console.log("Error creating inscription order:", errorText);
        throw new Error(
          `Failed to create inscription order: ${response.statusText} - ${errorText}`
        );
      }

      const orderData = await response.json();
      //console.log("Inscription order created:", orderData);

      if (orderData.charge?.address) {
        const paymentAddress = orderData.charge.address;
        const amount = orderData.charge.amount; // Amount in satoshis

        // Try XVerse wallet first
        if (
          typeof window !== "undefined" &&
          (window as any).XverseProviders?.BitcoinProvider
        ) {
          console.log("XVerse wallet detected, attempting payment...");
          try {
            // Convert satoshis to BTC for XVerse (it expects BTC amounts)
            const btcAmount = amount / 100000000; // Convert satoshis to BTC

            const response = await (
              window as any
            ).XverseProviders.BitcoinProvider.request("sendTransfer", {
              recipients: [
                {
                  address: paymentAddress,
                  amount: btcAmount,
                },
              ],
            });

            if (response.status === "success") {
              console.log(
                "XVerse payment transaction sent:",
                response.result.txid
              );
            } else {
              throw new Error("XVerse payment failed");
            }
          } catch (xverseError) {
            console.error("XVerse wallet payment failed:", xverseError);
            // Fall through to Unisat
          }
        }
        // Try to use Unisat wallet
        else if (window.unisat) {
          /*console.log(
            "Unisat wallet detected as fallback, attempting payment..."
          );*/
          try {
            const txid = await window.unisat.sendBitcoin(
              paymentAddress,
              amount
            );
            //console.log("Unisat payment transaction sent:", txid);
          } catch (walletError) {
            // Fallback to paylink
            chrome.tabs.create({
              url: `https://app.hel.io/pay/${orderData.paylink.id}`,
            });
          }
        } else {
          //console.log("No wallet detected, would open paylink");
          // No wallet available, use paylink
          chrome.tabs.create({
            url: `https://app.hel.io/pay/${orderData.paylink.id}`,
          });
        }
      } else if (orderData.paylink?.id) {
        // Fallback to paylink if no direct address
        chrome.tabs.create({
          url: `https://app.hel.io/pay/${orderData.paylink.id}`,
        });
      } else {
        //console.error("No payment method available in order response");
      }
    } catch (error) {
      //console.error("Inscription failed:", error);
    } finally {
      setIsInscribing(false);
    }
  };

  // Fallback mock post data for when no post is selected
  const mockPost: Post = {
    author: "@bob",
    content: "Decentralization is the future.",
    timestamp: "2h ago",
  };

  const postToUse = selectedPost || mockPost;

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
                post={postToUse}
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
