import { useState, useEffect } from "react";
import { DusmService } from "../services/dusmService";
import { Content } from "../interfaces/content";

export interface UseFeedResult {
  posts: Content[];
  loading: boolean;
  error: string | null;
  fetchFeed: (address: string) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
}

export function useFeed(): UseFeedResult {
  const [posts, setPosts] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dusmService = DusmService.getInstance();

  const fetchFeed = async (address: string) => {
    if (!address.trim()) {
      setError("Please enter a valid address");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const posts = await dusmService.getFeedByAddress(address);
      setPosts(posts);
    } catch (err) {
      setError("Failed to fetch feed data");
      console.error("Error fetching feed:", err);
    } finally {
      setLoading(false);
    }
  };

  const likePost = async (postId: string) => {
    try {
      const success = await dusmService.likePost(postId);
      if (success) {
        // Fetch post data again
      }
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  return {
    posts,
    loading,
    error,
    fetchFeed,
    likePost,
  };
}
