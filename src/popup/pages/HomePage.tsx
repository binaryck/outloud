import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <div className="home-page">
      <h1>Welcome to Outloud</h1>
      <p>Your voice matters. Join the movement to decentralize social media.</p>
      <Link to="/inscribe" className="btn-primary">
        Inscribe a Post
      </Link>
    </div>
  );
}
