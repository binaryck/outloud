import { useState } from "react";
import { Content } from "../interfaces/content";

export interface UseFeedResult {
  posts: Content[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  fetchFeed: (address: string, page?: number) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  setPage: (page: number) => void;
}

interface ApiResponse {
  data: Content[];
  pagination: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
  };
}

export function useFeed(): UseFeedResult {
  const [posts, setPosts] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [currentAddress, setCurrentAddress] = useState("");

  const fetchFeed = async (address: string, page: number = 1) => {
    if (!address.trim()) {
      setError("Please enter a valid address");
      return;
    }

    setLoading(true);
    setError(null);
    setCurrentAddress(address);

    try {
      //console.log("Fetching feed from:", address);
      const url = new URL("http://localhost:3001/api/contents");
      url.searchParams.append("owner", address);
      url.searchParams.append("page", page.toString());
      url.searchParams.append("limit", "10");
      url.searchParams.append("sortBy", "block_height");
      url.searchParams.append("sortOrder", "desc");

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      const mappedPosts = data.data.map((post) => ({
        ...post,
        content: JSON.parse(post.content_str),
      }));

      setPosts(mappedPosts);
      setCurrentPage(data.pagination.page);
      setTotalPages(data.pagination.totalPages);
      setTotalPosts(data.pagination.total);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes("CORS")) {
          setError(
            "CORS error: Please ensure the API server allows extension requests"
          );
        } else if (
          err.message.includes("NetworkError") ||
          err.message.includes("Failed to fetch")
        ) {
          setError("Network error: Please ensure the API server is running");
        } else {
          setError(`API Error: ${err.message}`);
        }
      } else {
        setError("Failed to fetch feed data");
      }
      //console.error("Error fetching feed:", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const setPage = async (page: number) => {
    if (currentAddress && page !== currentPage) {
      await fetchFeed(currentAddress, page);
    }
  };

  const likePost = async (postId: string) => {
    try {
      /*const success = await dusmService.likePost(postId);
      if (success) {
        // Fetch post data again
      }*/
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  return {
    posts,
    loading,
    error,
    currentPage,
    totalPages,
    totalPosts,
    fetchFeed,
    likePost,
    setPage,
  };
}
