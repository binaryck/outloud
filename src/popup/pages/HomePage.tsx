import Button from "../components/Button/Button";

export function HomePage() {
  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="logo-container">
          <div className="logo-symbol">⧉</div>
          <h1 className="brand-title">Stay Free</h1>
        </div>
        <p className="tagline">Your voice matters.</p>
      </div>

      <div className="process-flow">
        <div className="flow-title">Quick Start</div>
        <div className="flow-steps">
          <div className="flow-item">
            <div className="flow-icon">𝕏</div>
            <div className="flow-text">Post</div>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-item">
            <div className="flow-icon">⧉</div>
            <div className="flow-text">Repost on BTC</div>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-item">
            <div className="flow-icon">₿</div>
            <div className="flow-text">Sign</div>
          </div>
        </div>
      </div>

      <div className="action-zone">
        <Button
          onClick={() => window.open("https://x.com", "_blank")}
          text="Launch X"
          animated={true}
        />
        <div className="hint-text">
          Go to any of your posts & click "Repost on Bitcoin"
        </div>
      </div>
    </div>
  );
}
