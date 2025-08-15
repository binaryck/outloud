import { Post } from "../components/Post/Post";
import { Content } from "../interfaces/content";
import { Pagination } from "../components/Pagination/Pagination";

interface FeedPageProps {
  address: string;
  posts: Content[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  onLike: (postId: string) => void;
  onPageChange: (page: number) => void;
}

export function FeedPage({
  address,
  posts,
  loading,
  error,
  currentPage,
  totalPages,
  totalPosts,
  onLike,
  onPageChange,
}: FeedPageProps) {
  const formatAddress = (addr: string) => {
    if (addr.length <= 12) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-6)}`;
  };

  if (loading) {
    return (
      <div className="feed-page">
        <div className="feed-header">
          <div className="feed-title">
            <span className="btc-icon">₿</span>
            <span>Feed for {formatAddress(address)}</span>
          </div>
        </div>
        <div className="feed-loading">
          <div className="loading-spinner-large">⟳</div>
          <div className="loading-text">Loading feed from the timechain...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="feed-page">
        <div className="feed-header">
          <div className="feed-title">
            <span className="btc-icon">₿</span>
            <span>Feed Error</span>
          </div>
        </div>
        <div className="feed-error">
          <div className="error-icon">⚠️</div>
          <div className="error-text">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="feed-page">
      <div className="feed-header">
        <div className="feed-title">
          <span className="btc-icon">₿</span>
          <span>Feed from {formatAddress(address)}</span>
        </div>
        <div className="feed-stats">
          {totalPosts} post{totalPosts !== 1 ? "s" : ""} found
        </div>
      </div>

      <div className="feed-content">
        {posts.length === 0 ? (
          <div className="feed-empty">
            <div className="empty-icon">📭</div>
            <div className="empty-text">No posts found for this address</div>
            <div className="empty-subtext">
              Try searching for a different Bitcoin address
            </div>
          </div>
        ) : (
          <div className="feed-posts">
            {posts.map(
              (post) =>
                post.content.type === "post" && (
                  <Post key={post.inscription_id} post={post} onLike={onLike} />
                )
            )}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
