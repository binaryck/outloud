import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface BackArrowProps {
  size?: number;
  strokeWidth?: number;
}

export function BackArrow({
  size = 25,
  strokeWidth = 4,
}: BackArrowProps): React.JSX.Element {
  return (
    <Link to="/" className="back-arrow">
      <ArrowLeft size={size} strokeWidth={strokeWidth} />
    </Link>
  );
}
